/**
 * In-process API metrics — request counts by status bucket,
 * per-route call counts, and a rolling p95 latency estimate.
 *
 * Exposed at GET /api/internal/metrics (requires X-Internal-Key).
 */

interface StatusBuckets {
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
}

// Total request counters by HTTP status class
const statusCounts: StatusBuckets = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };

// Per-route (METHOD /path) hit counters — top-N routes only to bound memory
const MAX_ROUTES = 200;
const routeCounts = new Map<string, number>();

// Rolling window for latency (last 2000 measurements, sorted on snapshot)
const LATENCY_WINDOW = 2000;
const latencyBuffer: number[] = [];

function statusBucket(code: number): keyof StatusBuckets | null {
  if (code >= 200 && code < 300) return "2xx";
  if (code >= 300 && code < 400) return "3xx";
  if (code >= 400 && code < 500) return "4xx";
  if (code >= 500 && code < 600) return "5xx";
  return null;
}

/** Record one completed request. */
export function recordRequest(
  method: string,
  routePath: string,
  statusCode: number,
  durationMs: number,
): void {
  // Status bucket
  const bucket = statusBucket(statusCode);
  if (bucket) statusCounts[bucket]++;

  // Route counter (bound memory usage)
  const key = `${method} ${routePath}`;
  if (routeCounts.size < MAX_ROUTES || routeCounts.has(key)) {
    routeCounts.set(key, (routeCounts.get(key) ?? 0) + 1);
  }

  // Latency rolling window
  latencyBuffer.push(durationMs);
  if (latencyBuffer.length > LATENCY_WINDOW) {
    latencyBuffer.shift();
  }
}

/** Compute p95 from the current rolling window. */
function computeP95(): number {
  if (latencyBuffer.length === 0) return 0;
  const sorted = [...latencyBuffer].sort((a, b) => a - b);
  const idx = Math.floor(sorted.length * 0.95);
  return Math.round(sorted[Math.min(idx, sorted.length - 1)]);
}

/** Return a snapshot of all metrics. */
export function getMetricsSnapshot(): Record<string, unknown> {
  const total = statusCounts["2xx"] + statusCounts["3xx"] + statusCounts["4xx"] + statusCounts["5xx"];
  const errors = statusCounts["4xx"] + statusCounts["5xx"];
  const errorRate = total > 0 ? parseFloat(((errors / total) * 100).toFixed(2)) : 0;

  // Top-10 routes by count
  const topRoutes = [...routeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([route, count]) => ({ route, count }));

  return {
    timestamp: new Date().toISOString(),
    requests: {
      total,
      byStatus: { ...statusCounts },
      errorRatePct: errorRate,
    },
    latency: {
      p95Ms: computeP95(),
      sampleSize: latencyBuffer.length,
    },
    topRoutes,
  };
}

import { type Request, type Response, type NextFunction } from "express";

/**
 * Express middleware that feeds metrics for every API response.
 */
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.path.startsWith("/api")) {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
    // Use the matched route pattern when available (e.g. /api/groups/:id), fall back to raw path
    const routePath = (req.route?.path as string | undefined) ?? req.path;
    recordRequest(req.method, routePath, res.statusCode, durationMs);
  });

  next();
}
