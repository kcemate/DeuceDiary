import { Router } from "express";
import { storage } from "../storage";
import { updateUserSchema } from "@shared/schema";
import { isAuthenticated } from "../replitAuth";
import { requiresPremiumFor } from "../premiumAuth";
import { track } from "../lib/analytics";
import { getTitle, themeSchema, VALID_THEMES } from "./helpers";
import multer from "multer";
import sharp from "sharp";
import path from "path";

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
  router.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      track("user_login", userId);
      const user = await storage.getUser(userId);
      res.json({
        ...user,
        title: getTitle(user?.deuceCount ?? 0),
        subscription: user?.subscription ?? 'free',
        subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null,
        streakInsuranceUsed: user?.streakInsuranceUsed ?? false,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Clerk frontend sync — called after Clerk login to upsert user + return profile
  router.post('/api/auth/sync', isAuthenticated, async (req: any, res) => {
    try {
      const clerkData = req.body;
      const userId = req.user.id;

      const user = await storage.upsertUser({
        id: userId,
        email: clerkData.email ?? req.user.email ?? null,
        firstName: clerkData.firstName ?? req.user.firstName ?? null,
        lastName: clerkData.lastName ?? req.user.lastName ?? null,
        username: clerkData.username ?? undefined,
        profileImageUrl: clerkData.imageUrl ?? req.user.profileImageUrl ?? null,
      });

      // Fetch streak data from user's groups
      const groups = await storage.getUserGroups(userId);
      const streaks = await Promise.all(
        groups.map(async (g) => {
          const streak = await storage.getGroupStreak(g.id);
          return { groupId: g.id, groupName: g.name, ...streak };
        }),
      );

      res.json({
        ...user,
        title: getTitle(user.deuceCount ?? 0),
        streaks,
      });
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ message: "Failed to sync user" });
    }
  });

  router.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
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
  router.post('/api/auth/user/profile-picture', isAuthenticated, upload.single('profilePicture'), async (req: any, res) => {
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

  // Theme routes
  router.get('/api/user/theme', isAuthenticated, requiresPremiumFor('custom_themes'), async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      res.json({ theme: user?.theme ?? 'default' });
    } catch (error) {
      console.error("Error fetching theme:", error);
      res.status(500).json({ message: "Failed to fetch theme" });
    }
  });

  router.put('/api/user/theme', isAuthenticated, requiresPremiumFor('custom_themes'), async (req: any, res) => {
    try {
      const parsed = themeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: `Invalid theme. Must be one of: ${VALID_THEMES.join(', ')}` });
      }
      const user = await storage.updateUserTheme(req.user.id, parsed.data.theme);
      res.json({ theme: user.theme });
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Failed to update theme" });
    }
  });

  return router;
}
