import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from "@shared/schema";
import { instrumentPool } from './lib/slowQueryLogger';

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

// Instrument pool.query to log slow queries (>100ms)
instrumentPool(pool);

// Prevent idle client errors from crashing the process.
// pg.Pool emits 'error' when a backend terminates an idle connection
// (e.g. Railway restarts, PgBouncer timeout). Without this handler the
// event becomes an uncaughtException and kills the server.
pool.on('error', (err) => {
  console.error('[DB POOL] Unexpected error on idle client:', err.message);
});

export const db = drizzle({ client: pool, schema });
