import { Router, type Request, type Response } from "express";
import logger from "../lib/logger";
import { WebSocket } from "ws";
import { storage } from "../storage";
import { db } from "../db";
import { deuceEntries, users } from "@shared/schema";
import type { DeuceEntry, BattleMatch } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { isAuthenticated } from "../replitAuth";
import { track } from "../lib/analytics";
import { triggerPassportStamp } from "../lib/geocode";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  createDeuceSchema,
  createLocationSchema,
  MAX_LOGS_PER_DAY,
  getTodayUTC,
  recalculateStreak,
  sanitizeUserForResponse,
} from "./helpers";

// Simple emoji schema — accepts any non-empty string (original behavior)
const reactionSchema = z.object({ emoji: z.string().min(1).max(10) });

const syncDeuceSchema = z.object({
  entries: z.array(z.object({
    id: z.string(),
    location: z.string().min(1).max(100),
    thoughts: z.string().max(500, "Thought must be 500 characters or less").optional(),
    groupIds: z.array(z.string()).min(1),
    loggedAt: z.union([z.string(), z.null()]).optional(),
  })).min(1).max(50),
});

type BroadcastFn = (groupId: string, message: unknown) => void;

/** Fetch an entry and verify the user belongs to its group. Returns the entry or sends an error response. */
async function getAuthorizedEntry(entryId: string, userId: string, res: Response) {
  const entry = await storage.getEntryById(entryId);
  if (!entry) {
    res.status(404).json({ message: "Entry not found" });
    return null;
  }
  const isInGroup = await storage.isUserInGroup(userId, entry.groupId);
  if (!isInGroup) {
    res.status(403).json({ message: "Not authorized to access this entry" });
    return null;
  }
  return entry;
}

export function createDeucesRouter(broadcastToGroup: BroadcastFn): Router {
  const router = Router();

  router.get('/api/locations', isAuthenticated, async (req, res) => {
    try {
      const locations = await storage.getLocationsForUser(req.user.id);
      res.json(locations);
    } catch (error) {
      logger.error({ err: error }, "Error fetching locations");
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  router.post('/api/locations', isAuthenticated, async (req, res) => {
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

      // Check if location already exists for this user
      const existing = await storage.getLocationByName(name.trim(), userId);
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
      logger.error({ err: error }, "Error creating location");
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  // Reaction routes (free)
  router.post('/api/entries/:entryId/reactions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { entryId } = req.params;
      const parsed = reactionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Emoji is required" });
      }
      const { emoji } = parsed.data;

      const entry = await getAuthorizedEntry(entryId, userId, res);
      if (!entry) return;

      const reaction = await storage.addReaction({
        entryId,
        userId,
        emoji,
      });

      res.json(reaction);
    } catch (error) {
      logger.error({ err: error }, "Error adding reaction");
      if (error instanceof Error && error.message.includes('duplicate key')) {
        return res.status(400).json({ message: "You've already reacted with this emoji" });
      }
      res.status(500).json({ message: "Failed to add reaction" });
    }
  });

  router.delete('/api/entries/:entryId/reactions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { entryId } = req.params;
      const parsed = reactionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Emoji is required" });
      }
      const { emoji } = parsed.data;

      await storage.removeReaction(userId, entryId, emoji);
      res.json({ message: "Reaction removed" });
    } catch (error) {
      logger.error({ err: error }, "Error removing reaction");
      res.status(500).json({ message: "Failed to remove reaction" });
    }
  });

  router.get('/api/entries/:entryId/reactions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { entryId } = req.params;

      const entry = await getAuthorizedEntry(entryId, userId, res);
      if (!entry) return;

      const reactions = await storage.getEntryReactions(entryId);
      res.json(reactions);
    } catch (error) {
      logger.error({ err: error }, "Error fetching reactions");
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });

  // Delete a deuce entry (owner only — IDOR protection)
  router.delete('/api/deuces/:id', isAuthenticated, async (req, res) => {
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
      logger.error({ err: error }, "Error deleting deuce entry");
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  // Deuce feed route (free)
  router.get('/api/deuces', isAuthenticated, async (req, res) => {
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
      logger.error({ err: error }, "Error fetching deuces feed");
      res.status(500).json({ message: "Failed to fetch deuces feed" });
    }
  });

  // Deuce entry routes
  router.post('/api/deuces', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;

      // Per-user daily rate limit (10 logs per UTC day)
      const today = getTodayUTC();
      const currentCount = await storage.getUserDailyLogCount(userId, today);
      if (currentCount >= MAX_LOGS_PER_DAY) {
        return res.status(429).json({
          message: 'Throne limit reached for today. Come back tomorrow.',
          code: 'RATE_LIMIT_EXCEEDED',
          status: 429,
        });
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

      // Check if user is in all selected groups (batch)
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

      // bristolScore validated by zod (1-7 int), but double-check for safety
      if (bristolScore !== undefined && (bristolScore < 1 || bristolScore > 7)) {
        return res.status(400).json({ message: "bristolScore must be an integer between 1 and 7" });
      }

      // Create entry for each selected group
      const entries: DeuceEntry[] = [];
      for (const groupId of targetGroupIds) {
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
      track("deuce_logged", userId, { groupCount: targetGroupIds.length, has_notes: !!entryData.thoughts });

      // Get user info for WebSocket notification
      const user = await storage.getUser(userId);

      // Create display name for notifications
      const displayName = user?.username ||
        (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName) ||
        'Someone';

      // Send WebSocket notification to all groups (skip for ghost logs)
      if (!isGhost) {
        const safeUser = user ? sanitizeUserForResponse(user) : null;
        for (const groupId of targetGroupIds) {
          const groupEntry = entries.find(e => e.groupId === groupId);
          broadcastToGroup(groupId, {
            type: 'deuce_logged',
            message: `${displayName} logged a new deuce`,
            entry: { ...groupEntry, user: safeUser },
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
          logger.error({ err, groupId }, "Error recalculating streak for group");
        }
      }
      // Batch fetch streaks after all recalculations — single query instead of N
      const streakMap = await storage.getGroupStreaksBatch(targetGroupIds);
      for (const groupId of targetGroupIds) {
        const { currentStreak } = streakMap.get(groupId) ?? { currentStreak: 0 };
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        if (STREAK_MILESTONES.includes(currentStreak)) {
          track("streak_milestone", userId, { groupId, streak: currentStreak });
        }
      }

      // Async: reverse geocode and create passport stamp (fire-and-forget)
      triggerPassportStamp(latitude, longitude, (geo, lat, lon) =>
        storage.upsertPassportStamp(userId, geo.city, geo.country, geo.region, geo.countryCode, lat, lon));

      // Generate Battle Shits tokens for active matches
      const deuceEntryId = entries[0]?.id ?? '';
      try {
        const activeMatches = await storage.getUserActiveMatches(userId);
        const activeOnly = activeMatches.filter((m: BattleMatch) => m.status === 'active');
        for (const match of activeOnly) {
          await storage.createBattleToken(match.id, userId, deuceEntryId, 'standard');
          // Double flush: 2nd or more log of the day
          if (currentCount >= 1) {
            await storage.createBattleToken(match.id, userId, deuceEntryId, 'double_flush');
          }
        }
      } catch (err) {
        logger.error({ err }, "Error generating battle tokens");
      }

      res.json({ entries, count: entries.length, streak: maxStreak });
    } catch (error) {
      logger.error({ err: error }, "Error creating deuce entry");
      res.status(500).json({ message: "Failed to create deuce entry" });
    }
  });

  // Bulk deuce logging — atomic multi-group in one transaction
  router.post('/api/deuces/bulk', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;

      const today = getTodayUTC();
      const currentCount = await storage.getUserDailyLogCount(userId, today);
      if (currentCount >= MAX_LOGS_PER_DAY) {
        return res.status(429).json({
          message: 'Throne limit reached for today. Come back tomorrow.',
          code: 'RATE_LIMIT_EXCEEDED',
          status: 429,
        });
      }

      const parsed = createDeuceSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message || "Invalid deuce entry data";
        return res.status(400).json({ message: firstIssue });
      }

      const { groupIds, groupId, bristolScore, photoUrl, latitude, longitude, ...entryData } = parsed.data;
      const targetGroupIds = groupIds || (groupId ? [groupId] : []);

      if (targetGroupIds.length === 0) {
        return res.status(400).json({ message: "At least one group must be selected" });
      }
      if (targetGroupIds.length === 1) {
        return res.status(400).json({
          message: "Use /api/deuces for single group logging. Bulk requires multiple groups.",
        });
      }

      if (bristolScore !== undefined && (bristolScore < 1 || bristolScore > 7)) {
        return res.status(400).json({ message: "bristolScore must be an integer between 1 and 7" });
      }

      const bulkMemberGroupIds = await storage.isUserInGroups(userId, targetGroupIds);
      for (const gid of targetGroupIds) {
        if (!bulkMemberGroupIds.has(gid)) return res.status(403).json({ message: `Not authorized for group ${gid}` });
      }

      let loggedAt: Date;
      if (entryData.loggedAt) {
        const parsedDate = new Date(entryData.loggedAt);
        if (isNaN(parsedDate.getTime())) return res.status(400).json({ message: "Invalid loggedAt date" });
        if (parsedDate.getTime() > Date.now() + 60_000)
          return res.status(400).json({ message: "Cannot log a deuce in the future" });
        loggedAt = parsedDate;
      } else {
        loggedAt = new Date();
      }
      const isGhost = !!entryData.ghost;

      const entries: DeuceEntry[] = [];
      await db.transaction(async (tx) => {
        for (const gid of targetGroupIds) {
          const [entry] = await tx
            .insert(deuceEntries)
            .values({
              ...entryData,
              thoughts: entryData.thoughts ?? "",
              ghost: isGhost,
              bristolScore: bristolScore ?? null,
              photoUrl: photoUrl ?? null,
              latitude: latitude != null ? String(latitude) : null,
              longitude: longitude != null ? String(longitude) : null,
              groupId: gid,
              userId,
              loggedAt,
              id: uuidv4(),
            })
            .returning();
          entries.push(entry);
        }
        await tx
          .update(users)
          .set({ deuceCount: sql`${users.deuceCount} + 1`, updatedAt: new Date() })
          .where(eq(users.id, userId));
      });

      track("bulk_log_created", userId, {
        group_count: targetGroupIds.length,
        has_notes: !!entryData.thoughts,
        has_photo: !!photoUrl,
      });

      const user = await storage.getUser(userId);
      const displayName = user?.username ||
        (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName) ||
        'Someone';

      if (!isGhost) {
        const safeUser = user ? sanitizeUserForResponse(user) : null;
        for (const gid of targetGroupIds) {
          const groupEntry = entries.find(e => e.groupId === gid);
          broadcastToGroup(gid, {
            type: 'deuce_logged',
            message: `${displayName} logged a new deuce`,
            entry: { ...groupEntry, user: safeUser },
            userId,
          });
        }
      }

      for (const gid of targetGroupIds) {
        try { await recalculateStreak(gid); } catch (err) {
          logger.error({ err, groupId: gid }, "Error recalculating streak for group");
        }
      }

      // Streak milestone tracking
      const STREAK_MILESTONES = [7, 30, 100, 365];
      const streakMap = await storage.getGroupStreaksBatch(targetGroupIds);
      for (const gid of targetGroupIds) {
        const { currentStreak } = streakMap.get(gid) ?? { currentStreak: 0 };
        if (STREAK_MILESTONES.includes(currentStreak)) {
          track("streak_milestone", userId, { groupId: gid, streak: currentStreak });
        }
      }

      // Passport stamp (fire-and-forget)
      triggerPassportStamp(latitude, longitude, (geo, lat, lon) =>
        storage.upsertPassportStamp(userId, geo.city, geo.country, geo.region, geo.countryCode, lat, lon));

      // Battle tokens for active matches
      const bulkEntryId = entries[0]?.id ?? '';
      try {
        const activeMatches = await storage.getUserActiveMatches(userId);
        const activeOnly = activeMatches.filter((m: BattleMatch) => m.status === 'active');
        for (const match of activeOnly) {
          await storage.createBattleToken(match.id, userId, bulkEntryId, 'standard');
          if (currentCount >= 1) {
            await storage.createBattleToken(match.id, userId, bulkEntryId, 'double_flush');
          }
        }
      } catch (err) {
        logger.error({ err }, "Error generating battle tokens");
      }

      res.json({ entries, count: entries.length });
    } catch (error) {
      logger.error({ err: error }, "Error creating bulk deuce entry");
      res.status(500).json({ message: "Failed to create bulk deuce entry" });
    }
  });

  // Offline sync — accepts an array of queued deuce logs
  router.post('/api/deuces/sync', isAuthenticated, async (req, res) => {
    try {
      const parsed = syncDeuceSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: 'Invalid sync payload' });

      const userId = req.user.id;
      const today = getTodayUTC();
      const results: Array<{ id: string; status: 'ok' | 'error'; reason?: string }> = [];

      const syncUser = await storage.getUser(userId);
      const syncDisplayName = syncUser?.username ||
        (syncUser?.firstName && syncUser?.lastName
          ? `${syncUser.firstName} ${syncUser.lastName}`
          : syncUser?.firstName) ||
        'Someone';

      for (const entry of parsed.data.entries) {
        try {
          const currentCount = await storage.getUserDailyLogCount(userId, today);
          if (currentCount >= MAX_LOGS_PER_DAY) {
            results.push({ id: entry.id, status: 'error', reason: 'Daily limit reached' });
            continue;
          }

          const validGroups: string[] = [];
          let authorized = true;
          for (const gid of entry.groupIds) {
            const isInGroup = await storage.isUserInGroup(userId, gid);
            if (!isInGroup) {
              results.push({ id: entry.id, status: 'error', reason: `Not a member of group ${gid}` });
              authorized = false;
              break;
            }
            validGroups.push(gid);
          }
          if (!authorized) continue;

          let loggedAt: Date;
          if (entry.loggedAt) {
            const parsedDate = new Date(entry.loggedAt);
            if (isNaN(parsedDate.getTime())) {
              results.push({ id: entry.id, status: 'error', reason: 'Invalid loggedAt date' });
              continue;
            }
            if (parsedDate.getTime() > Date.now() + 60_000) {
              results.push({ id: entry.id, status: 'error', reason: 'Cannot log a deuce in the future' });
              continue;
            }
            loggedAt = parsedDate;
          } else {
            loggedAt = new Date();
          }

          const syncEntries: DeuceEntry[] = [];
          for (const gid of validGroups) {
            const created = await storage.createDeuceEntry({
              location: entry.location,
              thoughts: entry.thoughts ?? '',
              ghost: false,
              bristolScore: null,
              photoUrl: null,
              groupId: gid,
              userId,
              loggedAt,
              id: uuidv4(),
            });
            syncEntries.push(created);
          }

          await storage.updateUserDeuceCount(userId, 1);
          track('log_created', userId, { has_notes: !!entry.thoughts, source: 'offline_sync' });

          // WebSocket broadcast to group members
          const safeUser = syncUser ? sanitizeUserForResponse(syncUser) : null;
          for (const gid of validGroups) {
            const groupEntry = syncEntries.find(e => e.groupId === gid);
            broadcastToGroup(gid, {
              type: 'deuce_logged',
              message: `${syncDisplayName} logged a new deuce`,
              entry: { ...groupEntry, user: safeUser },
              userId,
            });
          }

          // Battle tokens for active matches
          const syncEntryId = syncEntries[0]?.id ?? '';
          const syncCount = await storage.getUserDailyLogCount(userId, today);
          try {
            const activeMatches = await storage.getUserActiveMatches(userId);
            const activeOnly = activeMatches.filter((m: BattleMatch) => m.status === 'active');
            for (const match of activeOnly) {
              await storage.createBattleToken(match.id, userId, syncEntryId, 'standard');
              if (syncCount >= 1) {
                await storage.createBattleToken(match.id, userId, syncEntryId, 'double_flush');
              }
            }
          } catch (err) {
            logger.error({ err }, '[sync] Error generating battle tokens');
          }

          // Passport stamp (fire-and-forget)
          triggerPassportStamp(undefined, undefined, (geo, lat, lon) =>
            storage.upsertPassportStamp(userId, geo.city, geo.country, geo.region, geo.countryCode, lat, lon));

          for (const gid of validGroups) {
            try { await recalculateStreak(gid); } catch (err) {
              logger.error({ err, groupId: gid }, '[sync] recalculateStreak failed for group');
            }
          }

          results.push({ id: entry.id, status: 'ok' });
        } catch (err) {
          logger.error({ err }, 'Error syncing offline entry ' + entry.id);
          results.push({ id: entry.id, status: 'error', reason: 'Internal error' });
        }
      }

      res.json({ results, synced: results.filter(r => r.status === 'ok').length });
    } catch (error) {
      logger.error({ err: error }, 'Error in deuce sync endpoint');
      res.status(500).json({ message: 'Failed to sync offline entries' });
    }
  });

  return router;
}
