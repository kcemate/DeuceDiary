import { type Request, type Response, type NextFunction } from "express";
import { log } from "../utils";

// --- Rolling window of response times for avg calculation ---
const WINDOW_SIZE = 1000;
const responseTimes: number[] = [];

/** Record a response time measurement. */
function recordResponseTime(durationMs: number): void {
  responseTimes.push(durationMs);
  if (responseTimes.length > WINDOW_SIZE) {
    responseTimes.shift();
  }
}

/** Get average response time across the rolling window. */
export function getAvgResponseTime(): number {
  if (responseTimes.length === 0) return 0;
  const sum = responseTimes.reduce((a, b) => a + b, 0);
  return Math.round((sum / responseTimes.length) * 100) / 100;
}

/** Threshold in ms — requests slower than this are logged. */
const SLOW_REQUEST_THRESHOLD_MS = 500;

/**
 * Middleware that measures response time and logs slow requests (> 500ms).
 * Also feeds into the rolling average for the detailed health endpoint.
 */
export function responseTimeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const elapsed = startTimer();

  res.on("finish", () => {
    const durationMs = elapsed();

    // Only track API routes
    if (req.path.startsWith("/api")) {
      recordResponseTime(durationMs);

      if (durationMs > SLOW_REQUEST_THRESHOLD_MS) {
        log(
          `SLOW ${req.method} ${req.originalUrl || req.path} ${res.statusCode} — ${Math.round(durationMs)}ms`,
          "perf",
        );
      }
    }
  });

  next();
}

/**
 * Start a high-resolution timer. Returns a function that, when called,
 * returns the elapsed time in milliseconds.
 */
export function startTimer(): () => number {
  const start = process.hrtime.bigint();
  return () => Number(process.hrtime.bigint() - start) / 1e6;
}

/** Format bytes into a human-readable string. */
function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Build the degraded health payload returned when the DB is unreachable.
 */
export function buildDegradedHealth(): Record<string, unknown> {
  return {
    status: "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: { connected: false, poolTotal: 0, poolIdle: 0, poolWaiting: 0 },
    memory: {
      rss: "0 MB",
      heapUsed: "0 MB",
      heapTotal: "0 MB",
      external: "0 MB",
    },
    avgResponseTimeMs: 0,
  };
}

/**
 * Build the detailed health payload.
 * `pool` is the pg Pool instance passed at registration time.
 */
export function buildDetailedHealth(pool: { totalCount: number; idleCount: number; waitingCount: number }): Record<string, unknown> {
  const mem = process.memoryUsage();
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: {
      connected: true,
      poolTotal: pool.totalCount,
      poolIdle: pool.idleCount,
      poolWaiting: pool.waitingCount,
    },
    memory: {
      rss: formatBytes(mem.rss),
      heapUsed: formatBytes(mem.heapUsed),
      heapTotal: formatBytes(mem.heapTotal),
      external: formatBytes(mem.external),
    },
    avgResponseTimeMs: getAvgResponseTime(),
  };
}
