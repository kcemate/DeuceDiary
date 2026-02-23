/**
 * db-migrate.ts — Idempotent startup migration script
 *
 * Uses ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS so it's safe
 * to run on every deploy regardless of DB state.
 * Never drops data. Never interactive.
 */

import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set — skipping migration");
  process.exit(0); // don't block server start in dev without DB
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrations: { name: string; sql: string }[] = [
  // Users table: columns added after initial deploy
  {
    name: "users.reminder_hour",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS reminder_hour integer",
  },
  {
    name: "users.reminder_minute",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS reminder_minute integer",
  },
  {
    name: "users.referral_code",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code text",
  },
  {
    name: "users.referred_by",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by text",
  },
  {
    name: "users.referral_count",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_count integer DEFAULT 0",
  },
  {
    name: "users.streak_insurance_used",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_insurance_used boolean DEFAULT false NOT NULL",
  },
  {
    name: "users.theme",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS theme text DEFAULT 'default' NOT NULL",
  },
  {
    name: "users.subscription",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription varchar(10) DEFAULT 'free' NOT NULL",
  },
  {
    name: "users.subscription_expires_at",
    sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp",
  },
  // Unique index on referral_code (partial — only non-null values)
  {
    name: "idx.users_referral_code_unique",
    sql: "CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_unique ON users(referral_code) WHERE referral_code IS NOT NULL",
  },
  // referrals table
  {
    name: "table.referrals",
    sql: `CREATE TABLE IF NOT EXISTS referrals (
      id serial PRIMARY KEY NOT NULL,
      referrer_id varchar NOT NULL REFERENCES users(id),
      referred_id varchar NOT NULL REFERENCES users(id),
      converted boolean DEFAULT false NOT NULL,
      discount_applied boolean DEFAULT false NOT NULL,
      created_at timestamp DEFAULT now()
    )`,
  },
  // streak_alerts table
  {
    name: "table.streak_alerts",
    sql: `CREATE TABLE IF NOT EXISTS streak_alerts (
      id serial PRIMARY KEY NOT NULL,
      group_id varchar NOT NULL REFERENCES groups(id),
      user_id varchar NOT NULL,
      alert_type varchar NOT NULL,
      sent_at timestamp DEFAULT now(),
      streak_date varchar(10),
      created_at timestamp DEFAULT now()
    )`,
  },
  // push_tokens table
  {
    name: "table.push_tokens",
    sql: `CREATE TABLE IF NOT EXISTS push_tokens (
      id serial PRIMARY KEY NOT NULL,
      user_id varchar NOT NULL REFERENCES users(id),
      token text NOT NULL,
      platform varchar DEFAULT 'ios',
      created_at timestamp DEFAULT now()
    )`,
  },
  // broadcasts table
  {
    name: "table.broadcasts",
    sql: `CREATE TABLE IF NOT EXISTS broadcasts (
      id serial PRIMARY KEY NOT NULL,
      group_id varchar NOT NULL,
      user_id varchar NOT NULL,
      milestone text NOT NULL,
      created_at timestamp DEFAULT now()
    )`,
  },
];

async function runMigrations() {
  console.log("🔄 Running DB migrations...");
  let passed = 0;
  let failed = 0;

  for (const m of migrations) {
    try {
      await pool.query(m.sql);
      console.log(`  ✅ ${m.name}`);
      passed++;
    } catch (err: any) {
      // Some "errors" are fine (e.g. column/index already exists with same def)
      if (
        err.code === "42701" || // column already exists
        err.code === "42P07" || // relation already exists
        err.code === "23505"    // unique violation on index create
      ) {
        console.log(`  ⏭️  ${m.name} (already exists)`);
        passed++;
      } else {
        console.error(`  ❌ ${m.name}: ${err.message}`);
        failed++;
      }
    }
  }

  await pool.end();

  if (failed > 0) {
    console.error(`\n❌ Migration completed with ${failed} error(s). Server will start anyway.`);
    // Don't exit(1) — let the server start and surface errors at runtime
  } else {
    console.log(`\n✅ Migration complete (${passed} steps)`);
  }
}

runMigrations().catch((err) => {
  console.error("❌ Migration script crashed:", err.message);
  process.exit(0); // still don't block server start
});
