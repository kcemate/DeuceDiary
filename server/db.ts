import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // Enable SSL in production; allow override via DB_SSL=false for local dev without SSL
  ssl: process.env.NODE_ENV === "production" && process.env.DB_SSL !== "false"
    ? { rejectUnauthorized: false }
    : undefined,
});

// Prevent idle client errors from crashing the process.
// pg.Pool emits 'error' when a backend terminates an idle connection
// (e.g. Railway restarts, PgBouncer timeout). Without this handler the
// event becomes an uncaughtException and kills the server.
pool.on('error', (err) => {
  console.error('[DB POOL] Unexpected error on idle client:', err.message);
});

// --- Slow query detection ---
// Wrap pool.query to log any query that exceeds the threshold.
const SLOW_QUERY_THRESHOLD_MS = 200;
const _originalQuery = pool.query.bind(pool);
(pool as any).query = async (...args: Parameters<typeof pool.query>) => {
  const start = process.hrtime.bigint();
  try {
    return await (_originalQuery as any)(...args);
  } finally {
    const durationMs = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
    if (durationMs > SLOW_QUERY_THRESHOLD_MS) {
      // Log first 120 chars of SQL to avoid leaking full query text with values
      const sql = typeof args[0] === 'string'
        ? args[0].slice(0, 120)
        : (args[0] as any)?.text?.slice(0, 120) ?? '?';
      console.warn(`[SLOW QUERY] ${durationMs}ms — ${sql}`);
    }
  }
};

export const db = drizzle({ client: pool, schema });
