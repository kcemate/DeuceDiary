import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Webhook } from "svix";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, clerkEnabled } from "./replitAuth";
import { requiresPremium } from "./premiumAuth";
import { insertGroupSchema, insertDeuceEntrySchema, insertInviteSchema, updateUserSchema } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { checkAllGroupStreaksAndNotify } from "./streakNotifications";

/** Get today's date as YYYY-MM-DD in UTC */
function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Get yesterday's date as YYYY-MM-DD in UTC */
function getYesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * After a deuce is logged, check if all group members have logged today.
 * If yes, advance the streak. If a day was missed, reset first.
 */
async function recalculateStreak(groupId: string): Promise<void> {
  const today = getTodayUTC();
  const yesterday = getYesterdayUTC();
  const streak = await storage.getGroupStreak(groupId);
  const memberStatuses = await storage.getMembersLogStatusToday(groupId, today);

  const allLoggedToday = memberStatuses.every(m => m.hasLogged);

  if (!allLoggedToday) {
    // Not everyone has logged today yet — but check if streak needs resetting
    if (streak.lastStreakDate && streak.lastStreakDate !== today && streak.lastStreakDate !== yesterday) {
      // Missed a day — reset
      await storage.updateGroupStreak(groupId, 0, streak.longestStreak, streak.lastStreakDate);
    }
    return;
  }

  // Everyone logged today
  if (streak.lastStreakDate === today) {
    // Already counted today
    return;
  }

  let newStreak: number;
  if (!streak.lastStreakDate || (streak.lastStreakDate !== yesterday && streak.lastStreakDate !== today)) {
    // Fresh start (first time or missed a day)
    newStreak = 1;
  } else {
    // Continuing from yesterday
    newStreak = streak.currentStreak + 1;
  }

  const newLongest = Math.max(newStreak, streak.longestStreak);
  await storage.updateGroupStreak(groupId, newStreak, newLongest, today);
}

/**
 * Check if a group's streak is at risk (any member hasn't logged today).
 */
async function checkAndNotifyStreakRisk(groupId: string): Promise<{ atRisk: boolean; missingMembers: string[] }> {
  const today = getTodayUTC();
  const memberStatuses = await storage.getMembersLogStatusToday(groupId, today);
  const missing = memberStatuses.filter(m => !m.hasLogged);

  if (missing.length > 0) {
    const missingNames = missing.map(m => m.username || m.firstName || m.userId);
    console.log(`[STREAK RISK] Group ${groupId}: ${missingNames.join(', ')} haven't logged today`);
    return { atRisk: true, missingMembers: missingNames };
  }

  return { atRisk: false, missingMembers: [] };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check (no auth required)
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Internal streak check endpoint (cron / manual trigger, no session auth)
  const INTERNAL_KEY = process.env.INTERNAL_API_KEY || 'streak-check-secret';
  app.post('/api/internal/streak-check', async (req, res) => {
    const key = req.headers['x-internal-key'];
    if (key !== INTERNAL_KEY) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const summary = await checkAllGroupStreaksAndNotify();
      res.json(summary);
    } catch (error) {
      console.error('[STREAK CHECK ERROR]', error);
      res.status(500).json({ message: 'Streak check failed' });
    }
  });

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    },
  });

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'dist', 'public', 'uploads');
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.log('Uploads directory already exists or created successfully');
  }

  // --- Clerk webhook (must be before session middleware) ---
  if (clerkEnabled) {
    app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), async (req, res) => {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
      if (!WEBHOOK_SECRET) {
        console.error("CLERK_WEBHOOK_SECRET not set — rejecting webhook");
        return res.status(500).json({ message: "Webhook secret not configured" });
      }

      const svixId = req.headers["svix-id"] as string;
      const svixTimestamp = req.headers["svix-timestamp"] as string;
      const svixSignature = req.headers["svix-signature"] as string;

      if (!svixId || !svixTimestamp || !svixSignature) {
        return res.status(400).json({ message: "Missing svix headers" });
      }

      try {
        const wh = new Webhook(WEBHOOK_SECRET);
        const event = wh.verify(req.body, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        }) as any;

        if (event.type === "user.created" || event.type === "user.updated") {
          const { id, email_addresses, first_name, last_name, image_url } = event.data;
          await storage.upsertUser({
            id,
            email: email_addresses?.[0]?.email_address ?? null,
            firstName: first_name ?? null,
            lastName: last_name ?? null,
            profileImageUrl: image_url ?? null,
          });
          console.log(`Clerk webhook: synced user ${id} (${event.type})`);
        }

        res.json({ received: true });
      } catch (err) {
        console.error("Clerk webhook verification failed:", err);
        res.status(400).json({ message: "Invalid webhook signature" });
      }
    });
  }

  // --- RevenueCat webhook (no session auth, server-to-server) ---
  app.post('/api/webhooks/revenuecat', express.json(), async (req, res) => {
    try {
      const { event } = req.body;
      if (!event?.type || !event?.app_user_id) {
        return res.status(400).json({ message: 'Invalid payload' });
      }

      const userId = event.app_user_id;
      const expirationMs = event.expiration_at_ms;

      switch (event.type) {
        case 'INITIAL_PURCHASE':
        case 'RENEWAL':
        case 'PRODUCT_CHANGE': {
          const expiresAt = expirationMs ? new Date(expirationMs) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          await storage.updateUserSubscription(userId, 'premium', expiresAt);
          console.log(`[REVENUECAT] ${event.type} — user ${userId} upgraded until ${expiresAt.toISOString()}`);
          break;
        }
        case 'CANCELLATION':
        case 'EXPIRATION': {
          // Set expiration to now so the premium check fails immediately
          await storage.updateUserSubscription(userId, 'free', new Date());
          console.log(`[REVENUECAT] ${event.type} — user ${userId} downgraded`);
          break;
        }
        default:
          console.log(`[REVENUECAT] Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('[REVENUECAT] Webhook error:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  });

  // --- Public endpoints (no auth required) ---

  // Group preview for invite landing page
  app.get('/api/groups/preview/:inviteCode', async (req, res) => {
    try {
      const { inviteCode } = req.params;
      const invite = await storage.getInviteById(inviteCode);
      if (!invite || invite.expiresAt < new Date()) {
        return res.status(404).json({ message: "Invite not found or expired" });
      }
      const group = await storage.getGroupById(invite.groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      const memberCount = await storage.getGroupMemberCount(invite.groupId);
      const deuceCount = await storage.getGroupDeuceCount(invite.groupId);
      res.json({ name: group.name, memberCount, deuceCount });
    } catch (error) {
      console.error("Error fetching group preview:", error);
      res.status(500).json({ message: "Failed to fetch group preview" });
    }
  });

  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'dist', 'public', 'uploads')));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json({
        ...user,
        subscription: user?.subscription ?? 'free',
        subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null,
        streakInsuranceUsed: user?.streakInsuranceUsed ?? false,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userData = updateUserSchema.parse(req.body);
      const updatedUser = await storage.updateUserUsername(userId, userData.username);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.message?.includes('duplicate key value')) {
        return res.status(400).json({ message: "Username already taken" });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Profile picture upload endpoint
  app.post('/api/auth/user/profile-picture', isAuthenticated, upload.single('profilePicture'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Process the image with sharp
      const filename = `${userId}-${Date.now()}.jpg`;
      const filepath = path.join(uploadsDir, filename);
      
      await sharp(req.file.buffer)
        .resize(200, 200, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(filepath);

      // Update user's profile image URL
      const profileImageUrl = `/uploads/${filename}`;
      const updatedUser = await storage.updateUserProfilePicture(userId, profileImageUrl);
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Failed to upload profile picture" });
    }
  });

  // Group routes
  app.post('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const groupData = insertGroupSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      
      const group = await storage.createGroup({
        ...groupData,
        id: uuidv4(),
      });
      
      res.json(group);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  app.get('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log("Fetching groups for user:", userId);
      const groups = await storage.getUserGroups(userId);
      console.log("User groups result:", groups);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.get('/api/groups/:groupId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;
      
      console.log("Fetching group details for:", groupId, "user:", userId);
      
      const isInGroup = await storage.isUserInGroup(userId, groupId);
      if (!isInGroup) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const group = await storage.getGroupById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      const members = await storage.getGroupMembers(groupId);
      const entries = await storage.getGroupEntries(groupId);
      
      console.log("Group details - members:", members.length, "entries:", entries.length);
      console.log("Members data:", members);
      
      res.json({ group, members, entries });
    } catch (error) {
      console.error("Error fetching group details:", error);
      res.status(500).json({ message: "Failed to fetch group details" });
    }
  });

  // Invite routes
  app.post('/api/groups/:groupId/invite', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;
      
      const isInGroup = await storage.isUserInGroup(userId, groupId);
      if (!isInGroup) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const inviteId = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      await storage.createInvite({
        id: inviteId,
        groupId,
        createdBy: userId,
        expiresAt,
      });
      
      const inviteLink = `${req.protocol}://${req.get('host')}/join/${inviteId}`;
      res.json({ inviteLink, id: inviteId });
    } catch (error) {
      console.error("Error creating invite:", error);
      res.status(500).json({ message: "Failed to create invite" });
    }
  });

  app.post('/api/join/:inviteId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { inviteId } = req.params;
      
      console.log("User attempting to join group:", userId, "invite:", inviteId);
      
      const invite = await storage.getInviteById(inviteId);
      if (!invite || invite.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired invite" });
      }
      
      const isAlreadyMember = await storage.isUserInGroup(userId, invite.groupId);
      if (isAlreadyMember) {
        console.log("User is already a member of group:", invite.groupId);
        const group = await storage.getGroupById(invite.groupId);
        return res.json({ group, message: "Already a member of this group" });
      }
      
      console.log("Adding user to group:", userId, "group:", invite.groupId);
      // User already exists (isAuthenticated ensures this), just add to group
      
      await storage.addGroupMember({
        groupId: invite.groupId,
        userId,
        role: "member",
      });
      
      await storage.deleteInvite(inviteId);
      
      const group = await storage.getGroupById(invite.groupId);
      console.log("User successfully joined group:", group);
      res.json({ group });
    } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ message: "Failed to join group" });
    }
  });

  // Legacy /join/:inviteId redirect → new client-side /invite/:code page
  app.get('/join/:inviteId', async (req: any, res) => {
    res.redirect(`/invite/${req.params.inviteId}`);
  });

  // Location routes
  app.get('/api/locations', async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.post('/api/locations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Location name is required" });
      }
      
      // Check if location already exists
      const existing = await storage.getLocationByName(name.trim());
      if (existing) {
        return res.status(400).json({ message: "Location already exists" });
      }
      
      const location = await storage.createLocation({
        name: name.trim(),
        isDefault: false,
        createdBy: userId,
      });
      
      res.json(location);
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  // Reaction routes
  app.post('/api/entries/:entryId/reactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { entryId } = req.params;
      const { emoji } = req.body;
      
      if (!emoji || typeof emoji !== 'string') {
        return res.status(400).json({ message: "Emoji is required" });
      }
      
      // Check if entry exists and user can access it
      const entry = await storage.getEntryById(entryId);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      const isInGroup = await storage.isUserInGroup(userId, entry.groupId);
      if (!isInGroup) {
        return res.status(403).json({ message: "Not authorized to react to this entry" });
      }
      
      const reaction = await storage.addReaction({
        entryId,
        userId,
        emoji,
      });
      
      res.json(reaction);
    } catch (error) {
      console.error("Error adding reaction:", error);
      if (error.message?.includes('duplicate key')) {
        return res.status(400).json({ message: "You've already reacted with this emoji" });
      }
      res.status(500).json({ message: "Failed to add reaction" });
    }
  });

  app.delete('/api/entries/:entryId/reactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { entryId } = req.params;
      const { emoji } = req.body;
      
      if (!emoji || typeof emoji !== 'string') {
        return res.status(400).json({ message: "Emoji is required" });
      }
      
      await storage.removeReaction(userId, entryId, emoji);
      res.json({ message: "Reaction removed" });
    } catch (error) {
      console.error("Error removing reaction:", error);
      res.status(500).json({ message: "Failed to remove reaction" });
    }
  });

  app.get('/api/entries/:entryId/reactions', isAuthenticated, async (req: any, res) => {
    try {
      const { entryId } = req.params;
      const reactions = await storage.getEntryReactions(entryId);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });

  // Streak routes
  app.get('/api/groups/:groupId/streak', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;

      const isInGroup = await storage.isUserInGroup(userId, groupId);
      if (!isInGroup) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const today = getTodayUTC();
      const yesterday = getYesterdayUTC();
      const streak = await storage.getGroupStreak(groupId);
      const logsToday = await storage.getMembersLogStatusToday(groupId, today);

      // If streak is stale (lastStreakDate is not today and not yesterday), reset it for the response
      let currentStreak = streak.currentStreak;
      if (streak.lastStreakDate && streak.lastStreakDate !== today && streak.lastStreakDate !== yesterday) {
        currentStreak = 0;
      }

      res.json({
        currentStreak,
        longestStreak: streak.longestStreak,
        memberCount: logsToday.length,
        logsToday: logsToday.map(m => ({
          userId: m.userId,
          username: m.username || m.firstName || 'Unknown',
          hasLogged: m.hasLogged,
          profileImageUrl: m.profileImageUrl,
        })),
      });
    } catch (error) {
      console.error("Error fetching streak:", error);
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  app.post('/api/groups/:groupId/streak/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.params;

      const isInGroup = await storage.isUserInGroup(userId, groupId);
      if (!isInGroup) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const result = await checkAndNotifyStreakRisk(groupId);
      res.json(result);
    } catch (error) {
      console.error("Error checking streak risk:", error);
      res.status(500).json({ message: "Failed to check streak risk" });
    }
  });

  // Deuce feed route
  app.get('/api/deuces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.query;

      let groupIds: string[];

      if (groupId) {
        // Single group — verify membership
        const isInGroup = await storage.isUserInGroup(userId, groupId as string);
        if (!isInGroup) {
          return res.status(403).json({ message: "Not authorized" });
        }
        groupIds = [groupId as string];
      } else {
        // All groups the user belongs to
        const userGroups = await storage.getUserGroups(userId);
        groupIds = userGroups.map(g => g.id);
      }

      const entries = await storage.getFeedEntries(groupIds, 50);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching deuces feed:", error);
      res.status(500).json({ message: "Failed to fetch deuces feed" });
    }
  });

  // Deuce entry routes
  app.post('/api/deuces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { groupIds, ...entryData } = req.body;
      
      // Handle both single group (backward compatibility) and multiple groups
      const targetGroupIds = groupIds || [req.body.groupId];
      
      if (!targetGroupIds || targetGroupIds.length === 0) {
        return res.status(400).json({ message: "At least one group must be selected" });
      }
      
      // Check if user is in all selected groups
      for (const groupId of targetGroupIds) {
        const isInGroup = await storage.isUserInGroup(userId, groupId);
        if (!isInGroup) {
          return res.status(403).json({ message: `Not authorized for group ${groupId}` });
        }
      }

      // Validate thought length
      if (entryData.thoughts && entryData.thoughts.length > 500) {
        return res.status(400).json({ message: "Thought must be 500 characters or less" });
      }

      const entries = [];
      const loggedAt = new Date(entryData.loggedAt || new Date());
      
      // Create entry for each selected group
      for (const groupId of targetGroupIds) {
        const entry = await storage.createDeuceEntry({
          ...entryData,
          groupId,
          userId,
          loggedAt,
          id: uuidv4(),
        });
        entries.push(entry);
      }
      
      // Update user's deuce count (only increment once, not per group)
      await storage.updateUserDeuceCount(userId, 1);
      
      // Get user info for WebSocket notification
      const user = await storage.getUser(userId);
      
      // Create display name for notifications
      const displayName = user?.username || 
                          (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName) ||
                          'Someone';
      
      // Send WebSocket notification to all groups
      for (const groupId of targetGroupIds) {
        const groupEntry = entries.find(e => e.groupId === groupId);
        broadcastToGroup(groupId, {
          type: 'deuce_logged',
          message: `${displayName} logged a new deuce`,
          entry: { ...groupEntry, user },
          userId: userId, // Don't notify the user who logged the deuce
        });
      }

      // Recalculate streaks for all affected groups
      for (const groupId of targetGroupIds) {
        try {
          await recalculateStreak(groupId);
        } catch (err) {
          console.error(`Error recalculating streak for group ${groupId}:`, err);
        }
      }

      res.json({ entries, count: entries.length });
    } catch (error) {
      console.error("Error creating deuce entry:", error);
      res.status(500).json({ message: "Failed to create deuce entry" });
    }
  });

  // --- Subscription routes ---

  app.get('/api/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const sub = await storage.getUserSubscription(req.user.id);
      const isPremium = sub.subscription === 'premium' && sub.subscriptionExpiresAt && new Date(sub.subscriptionExpiresAt) > new Date();
      res.json({
        tier: isPremium ? 'premium' : 'free',
        expiresAt: sub.subscriptionExpiresAt,
        features: isPremium
          ? ['custom_themes', 'streak_insurance', 'gold_badge', 'priority_support', 'detailed_analytics']
          : [],
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  app.post('/api/subscription/streak-insurance', isAuthenticated, requiresPremium, async (req: any, res) => {
    try {
      const sub = await storage.getUserSubscription(req.user.id);
      if (sub.streakInsuranceUsed) {
        return res.status(400).json({ message: "Streak insurance already used this month" });
      }

      // Find the user's groups and extend any at-risk streaks
      const userGroups = await storage.getUserGroups(req.user.id);
      const today = getTodayUTC();
      const yesterday = getYesterdayUTC();
      let extended = false;

      for (const group of userGroups) {
        const streak = await storage.getGroupStreak(group.id);
        // If last streak date was yesterday and streak > 0, extend it through today
        if (streak.lastStreakDate === yesterday && streak.currentStreak > 0) {
          await storage.updateGroupStreak(group.id, streak.currentStreak, streak.longestStreak, today);
          extended = true;
        }
      }

      await storage.useStreakInsurance(req.user.id);
      res.json({ used: true, extended, message: extended ? "Streak preserved!" : "Insurance activated (no at-risk streaks found)" });
    } catch (error) {
      console.error("Error using streak insurance:", error);
      res.status(500).json({ message: "Failed to use streak insurance" });
    }
  });

  // --- Premium analytics ---

  app.get('/api/analytics/me', isAuthenticated, requiresPremium, async (req: any, res) => {
    try {
      const analytics = await storage.getPremiumAnalytics(req.user.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching premium analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get('/api/analytics/most-deuces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const deucesByDate = await storage.getUserDeucesByDate(userId);
      
      const topDay = deucesByDate.reduce((max, current) => 
        current.count > max.count ? current : max, 
        { date: '', count: 0 }
      );
      
      res.json(topDay);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Weekly Throne Report
  app.get('/api/users/:userId/weekly-report', isAuthenticated, async (req: any, res) => {
    try {
      const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
      const report = await storage.getWeeklyReport(targetUserId);
      res.json(report);
    } catch (error) {
      console.error("Error fetching weekly report:", error);
      res.status(500).json({ message: "Failed to fetch weekly report" });
    }
  });

  // Subscription upgrade (dev mode — no real payment)
  app.post('/api/subscription/upgrade', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { plan } = req.body; // 'monthly' | 'annual'

      const expiresAt = new Date();
      if (plan === 'annual') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      const updatedUser = await storage.updateUserSubscription(userId, 'premium', expiresAt);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      res.status(500).json({ message: "Failed to upgrade subscription" });
    }
  });

  // --- Push notification token registration ---
  app.post('/api/notifications/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { token, platform } = req.body;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: 'token is required' });
      }
      if (platform !== 'ios' && platform !== 'android') {
        return res.status(400).json({ message: "platform must be 'ios' or 'android'" });
      }

      await storage.upsertPushToken({ userId, token, platform });
      res.json({ ok: true });
    } catch (error) {
      console.error('Error registering push token:', error);
      res.status(500).json({ message: 'Failed to register push token' });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const groupConnections = new Map<string, Set<WebSocket>>();

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket connection established');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'join_group') {
          const groupId = data.groupId;
          if (!groupConnections.has(groupId)) {
            groupConnections.set(groupId, new Set());
          }
          groupConnections.get(groupId)?.add(ws);
          
          // Store groupId on the WebSocket for cleanup
          (ws as any).groupId = groupId;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      // Clean up connection
      const groupId = (ws as any).groupId;
      if (groupId && groupConnections.has(groupId)) {
        groupConnections.get(groupId)?.delete(ws);
        if (groupConnections.get(groupId)?.size === 0) {
          groupConnections.delete(groupId);
        }
      }
    });
  });

  function broadcastToGroup(groupId: string, message: any) {
    const connections = groupConnections.get(groupId);
    if (connections) {
      connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });
    }
  }

  // Cleanup expired invites periodically
  setInterval(async () => {
    try {
      await storage.cleanupExpiredInvites();
    } catch (error) {
      console.error('Error cleaning up expired invites:', error);
    }
  }, 60 * 60 * 1000); // Every hour

  return httpServer;
}
