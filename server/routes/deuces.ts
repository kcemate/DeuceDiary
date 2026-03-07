import { Router } from "express";
import { WebSocket } from "ws";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { track } from "../lib/analytics";
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
      if (error.message?.includes('duplicate key')) {
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
      const { entryId } = req.params;
      const reactions = await storage.getEntryReactions(entryId);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });

  // Deuce feed route (free)
  router.get('/api/deuces', isAuthenticated, async (req: any, res) => {
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
        return res.status(400).json({ message: "Invalid deuce entry data" });
      }

      const { groupIds, groupId, ...entryData } = parsed.data;

      // Handle both single group (backward compatibility) and multiple groups
      const targetGroupIds = groupIds || (groupId ? [groupId] : []);

      if (targetGroupIds.length === 0) {
        return res.status(400).json({ message: "At least one group must be selected" });
      }

      // Validate thought length
      if (entryData.thoughts && entryData.thoughts.length > 500) {
        return res.status(400).json({ message: "Thought must be 500 characters or less" });
      }

      // Check if user is in all selected groups
      for (const gid of targetGroupIds) {
        const isInGroup = await storage.isUserInGroup(userId, gid);
        if (!isInGroup) {
          return res.status(403).json({ message: `Not authorized for group ${gid}` });
        }
      }

      const entries = [];
      const loggedAt = new Date(entryData.loggedAt || new Date());
      const isGhost = !!entryData.ghost;

      // Create entry for each selected group
      for (const groupId of targetGroupIds) {
        const entry = await storage.createDeuceEntry({
          ...entryData,
          ghost: isGhost,
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

  return router;
}
