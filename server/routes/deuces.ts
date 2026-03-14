import { Router } from "express";
import { WebSocket } from "ws";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { track, Events } from "../lib/analytics";
import { v4 as uuidv4 } from "uuid";
import {
  createDeuceSchema,
  createLocationSchema,
  reactionSchema,
  deleteReactionSchema,
  MAX_LOGS_PER_DAY,
  getTodayUTC,
  recalculateStreak,
} from "./helpers";
import { reverseGeocode } from "../lib/geocode";

type BroadcastFn = (groupId: string, message: any) => void;

export function createDeucesRouter(broadcastToGroup: BroadcastFn): Router {
  const router = Router();

  // Location routes
  router.get('/api/locations', async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  router.post('/api/locations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const parsed = createLocationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Location name is required" });
      }
      const name = parsed.data.name;

      if (!name.trim()) {
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

  // Reaction routes (free)
  router.post('/api/entries/:entryId/reactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { entryId } = req.params;
      const parsed = reactionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Emoji is required" });
      }
      const { emoji } = parsed.data;

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
      if (error instanceof Error && error.message.includes('duplicate key')) {
        return res.status(400).json({ message: "You've already reacted with this emoji" });
      }
      res.status(500).json({ message: "Failed to add reaction" });
    }
  });

  router.delete('/api/entries/:entryId/reactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { entryId } = req.params;
      const parsed = deleteReactionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Emoji is required" });
      }
      const { emoji } = parsed.data;

      await storage.removeReaction(userId, entryId, emoji);
      res.json({ message: "Reaction removed" });
    } catch (error) {
      console.error("Error removing reaction:", error);
      res.status(500).json({ message: "Failed to remove reaction" });
    }
  });

  router.get('/api/entries/:entryId/reactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { entryId } = req.params;

      // Verify the entry exists and the user can access it
      const entry = await storage.getEntryById(entryId);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      const isInGroup = await storage.isUserInGroup(userId, entry.groupId);
      if (!isInGroup) {
        return res.status(403).json({ message: "Not authorized to view reactions for this entry" });
      }

      const reactions = await storage.getEntryReactions(entryId);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });

  // Delete a deuce entry (owner only — IDOR protection)
  router.delete('/api/deuces/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const entry = await storage.getEntryById(id);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      // IDOR protection: only the owner can delete their own entry
      if (entry.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this entry" });
      }

      await storage.deleteDeuceEntry(id);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting deuce entry:", error);
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  // Deuce feed route (free)
  router.get('/api/deuces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { groupId } = req.query;

      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

      if (groupId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(groupId as string)) {
        return res.status(400).json({ message: "Invalid groupId format" });
      }

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

      const entries = await storage.getFeedEntries(groupIds, limit, offset);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching deuces feed:", error);
      res.status(500).json({ message: "Failed to fetch deuces feed" });
    }
  });

  // Deuce entry routes
  router.post('/api/deuces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Per-user daily rate limit (10 logs per UTC day)
      const today = getTodayUTC();
      const currentCount = await storage.getUserDailyLogCount(userId, today);
      if (currentCount >= MAX_LOGS_PER_DAY) {
        return res.status(429).json({ message: 'Throne limit reached for today. Come back tomorrow.' });
      }

      const parsed = createDeuceSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message || "Invalid deuce entry data";
        return res.status(400).json({ message: firstIssue });
      }

      const { groupIds, groupId, bristolScore, photoUrl, latitude, longitude, ...entryData } = parsed.data;

      // Handle both single group (backward compatibility) and multiple groups
      const targetGroupIds = groupIds || (groupId ? [groupId] : []);

      if (targetGroupIds.length === 0) {
        return res.status(400).json({ message: "At least one group must be selected" });
      }

      // Check if user is in all selected groups — single batch query instead of N queries
      const memberGroupIds = await storage.isUserInGroups(userId, targetGroupIds);
      for (const gid of targetGroupIds) {
        if (!memberGroupIds.has(gid)) {
          return res.status(403).json({ message: `Not authorized for group ${gid}` });
        }
      }

      // Validate loggedAt if provided; fall back to now for missing/invalid dates
      let loggedAt: Date;
      if (entryData.loggedAt) {
        const parsed = new Date(entryData.loggedAt);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ message: "Invalid loggedAt date" });
        }
        // Reject future dates (allow up to 1 minute of clock skew)
        if (parsed.getTime() > Date.now() + 60_000) {
          return res.status(400).json({ message: "Cannot log a deuce in the future" });
        }
        loggedAt = parsed;
      } else {
        loggedAt = new Date();
      }
      const isGhost = !!entryData.ghost;

      // Create entry for each selected group
      const entries: any[] = [];
      for (const groupId of targetGroupIds) {
        // bristolScore validated by zod (1-7 int), but double-check for safety
        if (bristolScore !== undefined && (bristolScore < 1 || bristolScore > 7)) {
          return res.status(400).json({ message: "bristolScore must be an integer between 1 and 7" });
        }
        const entry = await storage.createDeuceEntry({
          ...entryData,
          thoughts: entryData.thoughts ?? "",
          ghost: isGhost,
          bristolScore: bristolScore ?? null,
          photoUrl: photoUrl ?? null,
          latitude: latitude != null ? String(latitude) : null,
          longitude: longitude != null ? String(longitude) : null,
          groupId,
          userId,
          loggedAt,
          id: uuidv4(),
        });
        entries.push(entry);
      }

      // Update user's deuce count (only increment once, not per group)
      await storage.updateUserDeuceCount(userId, 1);

      track("log_created", userId, { has_notes: !!entryData.thoughts });
      Events.deuceLogged(userId, { groupCount: targetGroupIds.length, has_notes: !!entryData.thoughts });

      // Get user info for WebSocket notification
      const user = await storage.getUser(userId);

      // Create display name for notifications
      const displayName = user?.username ||
                          (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName) ||
                          'Someone';

      // Send WebSocket notification to all groups (skip for ghost logs)
      if (!isGhost) {
        for (const groupId of targetGroupIds) {
          const groupEntry = entries.find(e => e.groupId === groupId);
          broadcastToGroup(groupId, {
            type: 'deuce_logged',
            message: `${displayName} logged a new deuce`,
            entry: { ...groupEntry, user },
            userId: userId, // Don't notify the user who logged the deuce
          });
        }
      }

      // Recalculate streaks for all affected groups
      const STREAK_MILESTONES = [7, 30, 100, 365];
      let maxStreak = 0;
      for (const groupId of targetGroupIds) {
        try {
          await recalculateStreak(groupId);
        } catch (err) {
          console.error(`Error recalculating streak for group ${groupId}:`, err);
        }
      }
      // Batch fetch streaks after all recalculations — single query instead of N
      const streakMap = await storage.getGroupStreaksBatch(targetGroupIds);
      for (const groupId of targetGroupIds) {
        const { currentStreak } = streakMap.get(groupId) ?? { currentStreak: 0 };
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        if (STREAK_MILESTONES.includes(currentStreak)) {
          Events.streakMilestone(userId, groupId, currentStreak);
        }
      }

      // Async: reverse geocode and create passport stamp (fire-and-forget)
      if (latitude != null && longitude != null) {
        reverseGeocode(latitude, longitude)
          .then(async (geo) => {
            if (geo) {
              await storage.upsertPassportStamp(
                userId,
                geo.city,
                geo.country,
                geo.region,
                geo.countryCode,
                String(latitude),
                String(longitude),
              );
            }
          })
          .catch((err) => {
            console.error("[passport] Failed to create stamp:", err);
          });
      }

      res.json({ entries, count: entries.length, streak: maxStreak });
    } catch (error) {
      console.error("Error creating deuce entry:", error);
      res.status(500).json({ message: "Failed to create deuce entry" });
    }
  });

  return router;
}
