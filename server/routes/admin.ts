import { Router, type Request, type Response } from "express";
import { timingSafeEqual } from "crypto";
import logger from "../lib/logger";
import { pool } from "../db";
import { storage } from "../storage";
import { getRandomTemplate } from "../challengeTemplates";
import { sendPushToUser, isPushConfigured } from "../push";
import { db } from "../db";
import { pushSubscriptions } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { checkAllGroupStreaksAndNotify } from "../streakNotifications";
import { getRecentErrors } from "../lib/errorTracker";
import { buildDetailedHealth, buildDegradedHealth } from "../lib/perfBaseline";
import { getWsMetrics } from "../lib/wsMetrics";
import { Errors } from "../lib/apiError";
import { isAuthenticated } from "../replitAuth";

/** Constant-time string comparison to prevent timing attacks on API keys */
function safeKeyCompare(provided: string | undefined, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) {
      timingSafeEqual(Buffer.alloc(b.length), b);
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Verify the x-admin-key header. Sends 401 and returns false if invalid. */
function requireAdminKey(req: Request, res: Response): boolean {
  const key = req.headers['x-admin-key'] as string | undefined;
  if (!process.env.ADMIN_KEY || !safeKeyCompare(key, process.env.ADMIN_KEY)) {
    Errors.unauthorized(res);
    return false;
  }
  return true;
}

/** Verify the x-internal-key header. Sends 401 and returns false if invalid. */
function requireInternalKey(req: Request, res: Response): boolean {
  const key = req.headers['x-internal-key'] as string | undefined;
  if (!process.env.INTERNAL_API_KEY || !safeKeyCompare(key, process.env.INTERNAL_API_KEY)) {
    Errors.unauthorized(res);
    return false;
  }
  return true;
}

export function createAdminRouter(): Router {
  const router = Router();

  // Public config endpoint — returns runtime config values for the frontend
  router.get('/api/config', (_req, res) => {
    res.json({
      clerkPublishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY || null,
    });
  });

  // Health check (no auth required)
  router.get('/api/health', async (_req, res) => {
    const base = { timestamp: new Date().toISOString(), uptime: process.uptime() };
    const ws = getWsMetrics();
    try {
      const start = Date.now();
      await pool.query('SELECT 1');
      const dbLatencyMs = Date.now() - start;
      res.json({ status: 'ok', db: 'connected', dbLatencyMs, ws, ...base });
    } catch {
      res.status(503).json({ status: 'degraded', db: 'unreachable', ws, ...base });
    }
  });

  // Admin stats endpoint
  router.get('/api/admin/stats', async (req, res) => {
    if (!requireAdminKey(req, res)) return;
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      logger.error({ err: error }, '[ADMIN STATS ERROR]');
      Errors.internal(res, 'Failed to fetch admin stats');
    }
  });

  // Internal streak check endpoint (cron / manual trigger)
  router.post('/api/internal/streak-check', async (req, res) => {
    if (!requireInternalKey(req, res)) return;
    try {
      const summary = await checkAllGroupStreaksAndNotify();
      res.json(summary);
    } catch (error) {
      logger.error({ err: error }, '[STREAK CHECK ERROR]');
      Errors.internal(res, 'Streak check failed');
    }
  });

  // Crown transfer: calculate weekly kings and transfer crowns
  router.post('/api/internal/crown-transfer', async (req, res) => {
    if (!requireInternalKey(req, res)) return;

    const results: { groupId: string; winner: string | null; error?: string }[] = [];

    try {
      const now = new Date();
      const dayOfWeek = now.getUTCDay();
      const daysSinceMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMon));
      const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

      const groupIds = await storage.getAllGroupIds();

      for (const groupId of groupIds) {
        try {
          const logCounts = await storage.getGroupLogCountsForPeriod(groupId, periodStart, periodEnd);

          if (logCounts.length === 0) {
            results.push({ groupId, winner: null });
            continue;
          }

          const maxLogs = Math.max(...logCounts.map((l) => l.logCount));
          const topTiers = logCounts.filter((l) => l.logCount === maxLogs);

          let winner = topTiers[0];
          if (topTiers.length > 1) {
            const withStreaks = await Promise.all(
              topTiers.map(async (t) => ({
                ...t,
                streak: await storage.getUserStreakInGroup(t.userId, groupId),
              })),
            );
            const maxStreak = Math.max(...withStreaks.map((w) => w.streak));
            const topStreaks = withStreaks.filter((w) => w.streak === maxStreak);
            if (topStreaks.length > 1) {
              topStreaks.sort((a, b) => {
                const aTime = a.firstLogAt?.getTime() ?? Infinity;
                const bTime = b.firstLogAt?.getTime() ?? Infinity;
                return aTime - bTime;
              });
            }
            winner = topStreaks[0];
          }

          const prevKing = await storage.getLatestKingForGroup(groupId);
          const consecutiveWins =
            prevKing && prevKing.userId === winner.userId ? prevKing.consecutiveWins + 1 : 1;

          const kingRecord = await storage.createDeuceKing({
            groupId,
            userId: winner.userId,
            periodStart,
            periodEnd,
            logCount: winner.logCount,
            consecutiveWins,
          });

          const winnerUser = await storage.getUser(winner.userId);
          const fullName = `${winnerUser?.firstName ?? ''} ${winnerUser?.lastName ?? ''}`.trim();
          const displayName = winnerUser?.username ?? (fullName || 'Someone');
          const dynastyNote = consecutiveWins >= 3 ? ' 👑👑👑 Dynasty!' : '';
          await storage.createBroadcast({
            groupId,
            userId: winner.userId,
            milestone: `👑 ${displayName} is the new Deuce King with ${winner.logCount} logs!${dynastyNote}`,
          });

          const existing = await storage.getExistingChallengeForKing(kingRecord.id);
          if (!existing) {
            const template = getRandomTemplate();
            await storage.createChallenge({
              groupId,
              kingId: winner.userId,
              deuceKingId: kingRecord.id,
              title: template.title,
              templateKey: template.key,
              periodStart,
              periodEnd,
              isAutoSelected: true,
            });
          }

          results.push({ groupId, winner: winner.userId });
        } catch (groupErr: unknown) {
          const msg = groupErr instanceof Error ? groupErr.message : String(groupErr);
          logger.error({ groupId, msg }, `[crown-transfer] group error`);
          results.push({ groupId, winner: null, error: msg });
        }
      }

      res.json({ processed: groupIds.length, results });
    } catch (error: unknown) {
      logger.error({ err: error }, '[CROWN TRANSFER ERROR]');
      Errors.internal(res, 'Crown transfer failed');
    }
  });

  // Error log endpoint (internal)
  router.get('/api/internal/errors', (req, res) => {
    if (!requireInternalKey(req, res)) return;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const errors = getRecentErrors(limit);
    res.json({ errors, count: errors.length });
  });

  // Detailed health endpoint (internal)
  router.get('/api/internal/health/detailed', async (req, res) => {
    if (!requireInternalKey(req, res)) return;
    try {
      await pool.query('SELECT 1');
      res.json(buildDetailedHealth(pool));
    } catch {
      res.status(503).json(buildDegradedHealth());
    }
  });

  // Test push notification — sends to a specific user (admin key) or the authenticated user
  router.post("/api/admin/test-push", async (req: Request, res: Response) => {
    if (!isPushConfigured()) {
      return res.status(503).json({ message: "Push not configured (missing VAPID keys)" });
    }
    // Accept either admin key with userId in query, or authenticated session
    let userId: string | undefined;
    const isAdmin = req.headers['x-admin-key'] && process.env.ADMIN_KEY && safeKeyCompare(req.headers['x-admin-key'] as string, process.env.ADMIN_KEY);
    if (isAdmin) {
      userId = (req.query.userId as string) || req.body?.userId;
      if (!userId) return res.status(400).json({ message: "userId required (query or body) when using admin key" });
    } else if (req.user?.id) {
      userId = req.user.id;
    } else {
      return Errors.unauthorized(res);
    }
    const sent = await sendPushToUser(userId, {
      title: "🚽 Throne Alert!",
      body: "Push notifications are working! Time to log a deuce.",
      icon: "/icon-192.png",
      url: "/log",
      tag: "test-push",
    });
    res.json({ sent, userId });
  });

  // Debug: list push subscriptions for a user (admin key)
  router.get("/api/admin/push-subs", async (req: Request, res: Response) => {
    if (!requireAdminKey(req, res)) return;
    const userId = req.query?.userId as string;
    if (!userId) return res.status(400).json({ message: "userId query param required" });
    const subs = await db.select({
      id: pushSubscriptions.id,
      endpoint: pushSubscriptions.endpoint,
      createdAt: pushSubscriptions.createdAt,
    }).from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
    res.json({ count: subs.length, subscriptions: subs });
  });

  return router;
}
