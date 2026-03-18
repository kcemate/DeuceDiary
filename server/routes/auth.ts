import { Router } from "express";
import logger from "../lib/logger";
import { z, ZodError } from "zod";
import { storage } from "../storage";
import { db } from "../db";
import { users, updateUserSchema } from "@shared/schema";
import { eq, and, isNull } from "drizzle-orm";
import { isAuthenticated, clerkEnabled } from "../replitAuth";
import { requiresPremiumFor } from "../premiumAuth";
import { track } from "../lib/analytics";
import { Errors } from "../lib/apiError";
import { getTitle, themeSchema, VALID_THEMES } from "./helpers";
import multer from "multer";
import sharp from "sharp";
import path from "path";

const syncBodySchema = z.object({
  email: z.string().max(254).nullish(),
  firstName: z.string().max(100).nullish(),
  lastName: z.string().max(100).nullish(),
  username: z.string().max(50).nullish(),
  imageUrl: z.string().max(2048).nullish(),
});

export function createAuthRouter(uploadsDir: string): Router {
  const router = Router();

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

  // Auth routes
  router.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      track("user_login", userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return Errors.notFound(res, "User");
      }
      res.json({
        ...user,
        title: getTitle(user.deuceCount ?? 0),
        subscription: user.subscription ?? 'free',
        subscriptionExpiresAt: user.subscriptionExpiresAt ?? null,
        streakInsuranceUsed: user.streakInsuranceUsed ?? false,
      });
    } catch (error) {
      logger.error({ err: error }, "Error fetching user");
      Errors.internal(res, "Failed to fetch user");
    }
  });

  // Clerk frontend sync — called after Clerk login to upsert user + return profile
  router.post('/api/auth/sync', isAuthenticated, async (req, res) => {
    try {
      const bodyParsed = syncBodySchema.safeParse(req.body);
      const clerkData = bodyParsed.success ? bodyParsed.data : {};
      const userId = req.user.id;

      // In Clerk mode, identity fields (email, name) come from the verified JWT,
      // not the request body, to prevent spoofing. Only username is user-supplied.
      const jwtClaims = req.clerkAuth;
      const upsertData = clerkEnabled
        ? {
            id: userId,
            email: jwtClaims?.email ?? req.user.email ?? null,
            firstName: jwtClaims?.first_name ?? req.user.firstName ?? null,
            lastName: jwtClaims?.last_name ?? req.user.lastName ?? null,
            username: clerkData.username ?? undefined,
            profileImageUrl: jwtClaims?.image_url ?? req.user.profileImageUrl ?? null,
          }
        : {
            id: userId,
            email: clerkData.email ?? req.user.email ?? null,
            firstName: clerkData.firstName ?? req.user.firstName ?? null,
            lastName: clerkData.lastName ?? req.user.lastName ?? null,
            username: clerkData.username ?? undefined,
            profileImageUrl: clerkData.imageUrl ?? req.user.profileImageUrl ?? null,
          };

      const user = await storage.upsertUser(upsertData);

      // Auto-create "Solo Deuces" if user has no groups
      let groups = await storage.getUserGroups(userId);
      if (groups.length === 0) {
        const { v4: uuidv4 } = await import("uuid");
        await storage.createGroup({
          id: uuidv4(),
          name: "Solo Deuces",
          description: "Your personal throne log",
          createdBy: userId,
        });
        groups = await storage.getUserGroups(userId);
        logger.info({ userId }, "Auth sync: created Solo Deuces for user");
      }

      // Fetch streak data from user's groups — single batch query instead of N queries
      const streakMap = await storage.getGroupStreaksBatch(groups.map(g => g.id));
      const streaks = groups.map(g => ({
        groupId: g.id,
        groupName: g.name,
        ...(streakMap.get(g.id) ?? { currentStreak: 0, longestStreak: 0, lastStreakDate: null }),
      }));

      res.json({
        ...user,
        title: getTitle(user.deuceCount ?? 0),
        streaks,
      });
    } catch (error) {
      logger.error({ err: error }, "Error syncing user");
      Errors.internal(res, "Failed to sync user");
    }
  });

  router.put('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const userData = updateUserSchema.parse(req.body);
      const updatedUser = await storage.updateUserUsername(userId, userData.username);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return Errors.badRequest(res, error.errors[0]?.message ?? "Invalid input");
      }
      if (error instanceof Error && error.message.includes('duplicate key value')) {
        return Errors.badRequest(res, "Username already taken");
      }
      logger.error({ err: error }, "Error updating user");
      Errors.internal(res, "Failed to update user");
    }
  });

  // Profile picture upload endpoint
  router.post(
    '/api/auth/user/profile-picture',
    isAuthenticated, upload.single('profilePicture'),
    async (req, res) => {
      try {
      const userId = req.user.id;

      if (!req.file) {
        return Errors.badRequest(res, "No file uploaded");
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
      logger.error({ err: error }, "Error uploading profile picture");
      Errors.internal(res, "Failed to upload profile picture");
    }
  });

  // Theme routes
  router.get('/api/user/theme', isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      res.json({ theme: user?.theme ?? 'default' });
    } catch (error) {
      logger.error({ err: error }, "Error fetching theme");
      Errors.internal(res, "Failed to fetch theme");
    }
  });

  router.put('/api/user/theme', isAuthenticated, requiresPremiumFor('custom_themes'), async (req, res) => {
    try {
      const parsed = themeSchema.safeParse(req.body);
      if (!parsed.success) {
        return Errors.badRequest(res, `Invalid theme. Must be one of: ${VALID_THEMES.join(', ')}`);
      }
      const user = await storage.updateUserTheme(req.user.id, parsed.data.theme);
      res.json({ theme: user.theme });
    } catch (error) {
      logger.error({ err: error }, "Error updating theme");
      Errors.internal(res, "Failed to update theme");
    }
  });

  // Data export (GDPR right to data portability)
  router.get('/api/user/export', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const groups = await storage.getUserGroups(userId);
      const badges = await storage.getUserBadges(userId);

      const exportData = {
        exportedAt: new Date().toISOString(),
        account: {
          username: user?.username,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          subscription: user?.subscription,
          deuceCount: user?.deuceCount,
          theme: user?.theme,
          timezone: user?.timezone,
          createdAt: user?.createdAt,
        },
        groups: groups.map((g) => ({
          name: g.name,
          memberCount: g.memberCount,
          joinedAt: g.joinedAt,
        })),
        badges: badges.map((b) => ({
          name: b.name,
          unlocked: b.unlocked,
        })),
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="deuce-diary-export.json"');
      res.json(exportData);
    } catch (error) {
      logger.error({ err: error }, "Error exporting data");
      Errors.internal(res, "Failed to export data");
    }
  });

  // Timezone preference
  router.put('/api/user/timezone', isAuthenticated, async (req, res) => {
    try {
      const { timezone } = req.body;
      if (!timezone || typeof timezone !== 'string') {
        return Errors.badRequest(res, "Timezone is required");
      }
      if (timezone.length > 100) {
        return Errors.badRequest(res, "Timezone identifier too long (max 100 characters)");
      }
      try {
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
      } catch {
        return Errors.badRequest(
          res,
          `Unknown timezone: "${timezone}". Use an IANA timezone name (e.g. "America/New_York")`,
        );
      }
      const [user] = await db
        .update(users)
        .set({ timezone, updatedAt: new Date() })
        .where(and(eq(users.id, req.user.id), isNull(users.deletedAt)))
        .returning();
      res.json({ timezone: user.timezone });
    } catch (error) {
      logger.error({ err: error }, "Error updating timezone");
      Errors.internal(res, "Failed to update timezone");
    }
  });

  // Account deletion (soft-delete with GDPR-compliant data removal)
  router.delete('/api/user/account', isAuthenticated, async (req, res) => {
    try {
      await storage.softDeleteUser(req.user.id);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error deleting account");
      Errors.internal(res, "Failed to delete account");
    }
  });

  // Badge system (free)
  router.get('/api/user/badges', isAuthenticated, async (req, res) => {
    try {
      const badges = await storage.getUserBadges(req.user.id);
      res.json(badges);
    } catch (error) {
      logger.error({ err: error }, "Error fetching user badges");
      Errors.internal(res, "Failed to fetch badges");
    }
  });

  return router;
}
