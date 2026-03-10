import { Router } from "express";
import { pool } from "../db";
import { storage } from "../storage";
import { checkAllGroupStreaksAndNotify } from "../streakNotifications";
import { getRecentErrors } from "../lib/errorTracker";
import { buildDetailedHealth } from "../lib/perfBaseline";
import { getRandomTemplate } from "../challengeTemplates";

export function createInternalRouter(): Router {
  const router = Router();

  // Health check (no auth required) — checks DB connectivity, latency, and memory
  router.get('/api/health', async (_req, res) => {
    const t0 = Date.now();
    try {
      await pool.query('SELECT 1');
      const dbLatencyMs = Date.now() - t0;
      const mem = process.memoryUsage();
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        db: 'connected',
        dbLatencyMs,
        memory: {
          heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
          rssMb: Math.round(mem.rss / 1024 / 1024),
        },
      });
    } catch (err) {
      res.status(503).json({
        status: 'degraded',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        db: 'disconnected',
        dbLatencyMs: Date.now() - t0,
      });
    }
  });

  // --- Admin stats endpoint (no session auth, X-Admin-Key header) ---
  const ADMIN_KEY = process.env.ADMIN_KEY;
  if (!ADMIN_KEY) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[ERROR] ADMIN_KEY not set in production — admin endpoints disabled');
    }
    console.warn('[WARN] ADMIN_KEY not set — admin endpoints will reject all requests in dev');
  }
  router.get('/api/admin/stats', async (req, res) => {
    const key = req.headers['x-admin-key'];
    if (!ADMIN_KEY || key !== ADMIN_KEY) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error('[ADMIN STATS ERROR]', error);
      res.status(500).json({ message: 'Failed to fetch admin stats' });
    }
  });

  // Internal streak check endpoint (cron / manual trigger, no session auth)
  const INTERNAL_KEY = process.env.INTERNAL_API_KEY;
  if (!INTERNAL_KEY) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[ERROR] INTERNAL_API_KEY not set — internal endpoints disabled');
    }
    console.warn('[WARN] INTERNAL_API_KEY not set — internal endpoints will reject all requests in dev');
  }
  router.post('/api/internal/streak-check', async (req, res) => {
    const key = req.headers['x-internal-key'];
    if (!INTERNAL_KEY || key !== INTERNAL_KEY) {
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

  // --- Error log endpoint (internal) ---
  router.get('/api/internal/errors', (req, res) => {
    const key = req.headers['x-internal-key'];
    if (!INTERNAL_KEY || key !== INTERNAL_KEY) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const rawLimit = Number(req.query.limit);
      const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 200) : 50;
      const errors = getRecentErrors(limit);
      res.json({ errors, count: errors.length });
    } catch (err) {
      console.error('[INTERNAL ERRORS]', err);
      res.status(500).json({ message: 'Failed to fetch error log' });
    }
  });

  // --- Detailed health endpoint (internal) ---
  router.get('/api/internal/health/detailed', async (req, res) => {
    const key = req.headers['x-internal-key'];
    if (!INTERNAL_KEY || key !== INTERNAL_KEY) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      await pool.query('SELECT 1');
      res.json(buildDetailedHealth(pool));
    } catch (err) {
      res.status(503).json({
        status: 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db: { connected: false, poolTotal: 0, poolIdle: 0, poolWaiting: 0 },
        memory: {
          rss: '0 MB',
          heapUsed: '0 MB',
          heapTotal: '0 MB',
          external: '0 MB',
        },
        avgResponseTimeMs: 0,
      });
    }
  });

  // --- Crown transfer: calculate weekly kings and transfer crowns ---
  router.post('/api/internal/crown-transfer', async (req, res) => {
    const key = req.headers['x-internal-key'];
    const internalKey = process.env.INTERNAL_API_KEY;
    if (!internalKey || key !== internalKey) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const results: { groupId: string; winner: string | null; error?: string }[] = [];

    try {
      // Period = last completed Mon–Sun UTC week
      const now = new Date();
      const dayOfWeek = now.getUTCDay(); // 0=Sun,1=Mon,...6=Sat
      // Days since last Monday
      const daysSinceMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMon));
      const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

      const groupIds = await storage.getAllGroupIds();

      for (const groupId of groupIds) {
        try {
          // Fetch log counts for the period
          const logCounts = await storage.getGroupLogCountsForPeriod(groupId, periodStart, periodEnd);

          if (logCounts.length === 0) {
            results.push({ groupId, winner: null });
            continue;
          }

          // Sort by logCount desc, then streak desc (tiebreak 1), then earliest first log (tiebreak 2)
          const maxLogs = Math.max(...logCounts.map((l) => l.logCount));
          const topTiers = logCounts.filter((l) => l.logCount === maxLogs);

          let winner = topTiers[0];
          if (topTiers.length > 1) {
            // Tiebreaker 1: longest streak
            const withStreaks = await Promise.all(
              topTiers.map(async (t) => ({
                ...t,
                streak: await storage.getUserStreakInGroup(t.userId, groupId),
              })),
            );
            const maxStreak = Math.max(...withStreaks.map((w) => w.streak));
            const topStreaks = withStreaks.filter((w) => w.streak === maxStreak);

            if (topStreaks.length > 1) {
              // Tiebreaker 2: earliest first log
              topStreaks.sort((a, b) => {
                const aTime = a.firstLogAt?.getTime() ?? Infinity;
                const bTime = b.firstLogAt?.getTime() ?? Infinity;
                return aTime - bTime;
              });
            }
            winner = topStreaks[0];
          }

          // Determine consecutive wins
          const prevKing = await storage.getLatestKingForGroup(groupId);
          const consecutiveWins =
            prevKing && prevKing.userId === winner.userId
              ? prevKing.consecutiveWins + 1
              : 1;

          // Insert deuce_kings row
          const kingRecord = await storage.createDeuceKing({
            groupId,
            userId: winner.userId,
            periodStart,
            periodEnd,
            logCount: winner.logCount,
            consecutiveWins,
          });

          // Post crown transfer to group feed via broadcasts
          const winnerUser = await storage.getUser(winner.userId);
          const fullName = `${winnerUser?.firstName ?? ''} ${winnerUser?.lastName ?? ''}`.trim();
          const displayName = winnerUser?.username ?? (fullName || 'Someone');
          const dynastyNote = consecutiveWins >= 3 ? ' 👑👑👑 Dynasty!' : '';
          await storage.createBroadcast({
            groupId,
            userId: winner.userId,
            milestone: `👑 ${displayName} is the new Deuce King with ${winner.logCount} logs!${dynastyNote}`,
          });

          // Auto-set a random template challenge if king hasn't set one yet
          // (24h deadline handled separately; here we pre-create auto-selected for the period)
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
        } catch (groupErr: any) {
          console.error(`[crown-transfer] group ${groupId} error:`, groupErr.message);
          results.push({ groupId, winner: null, error: groupErr.message });
        }
      }

      res.json({ processed: groupIds.length, results });
    } catch (error: any) {
      console.error('[CROWN TRANSFER ERROR]', error);
      res.status(500).json({ message: 'Crown transfer failed' });
    }
  });

  return router;
}
