import { Router } from "express";
import { pool } from "../db";
import { storage } from "../storage";
import { checkAllGroupStreaksAndNotify } from "../streakNotifications";
import { getRecentErrors } from "../lib/errorTracker";
import { buildDetailedHealth } from "../lib/perfBaseline";

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

  return router;
}
