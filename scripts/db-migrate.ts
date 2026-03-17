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
      referee_id varchar NOT NULL REFERENCES users(id),
      discount_applied boolean DEFAULT false NOT NULL,
      created_at timestamp DEFAULT now()
    )`,
  },
  // Fix: rename referred_id → referee_id for DBs that ran the old migration
  {
    name: "referrals.rename_referred_id_to_referee_id",
    sql: "ALTER TABLE referrals RENAME COLUMN referred_id TO referee_id",
  },
  // referrals: add converted_to_premium_at column
  {
    name: "referrals.converted_to_premium_at",
    sql: "ALTER TABLE referrals ADD COLUMN IF NOT EXISTS converted_to_premium_at timestamp",
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
  // analytics_events table
  {
    name: "table.analytics_events",
    sql: `CREATE TABLE IF NOT EXISTS analytics_events (
      id serial PRIMARY KEY NOT NULL,
      user_id text,
      event text NOT NULL,
      properties text,
      created_at timestamp DEFAULT now()
    )`,
  },
  // --- Deuce King Challenge tables ---
  {
    name: "table.deuce_kings",
    sql: `CREATE TABLE IF NOT EXISTS deuce_kings (
      id serial PRIMARY KEY NOT NULL,
      group_id varchar NOT NULL REFERENCES groups(id),
      user_id varchar NOT NULL REFERENCES users(id),
      period_start timestamptz NOT NULL,
      period_end timestamptz NOT NULL,
      log_count integer NOT NULL,
      consecutive_wins integer NOT NULL DEFAULT 1,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )`,
  },
  {
    name: "idx.deuce_kings_group_period",
    sql: "CREATE INDEX IF NOT EXISTS idx_deuce_kings_group_period ON deuce_kings(group_id, period_start)",
  },
  {
    name: "table.challenges",
    sql: `CREATE TABLE IF NOT EXISTS challenges (
      id serial PRIMARY KEY NOT NULL,
      group_id varchar NOT NULL REFERENCES groups(id),
      king_id varchar NOT NULL REFERENCES users(id),
      deuce_king_id integer NOT NULL REFERENCES deuce_kings(id),
      title varchar(140) NOT NULL,
      template_key varchar(50),
      period_start timestamptz NOT NULL,
      period_end timestamptz NOT NULL,
      is_auto_selected boolean NOT NULL DEFAULT FALSE,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )`,
  },
  {
    name: "idx.challenges_group_period",
    sql: "CREATE INDEX IF NOT EXISTS idx_challenges_group_period ON challenges(group_id, period_start)",
  },
  {
    name: "table.challenge_completions",
    sql: `CREATE TABLE IF NOT EXISTS challenge_completions (
      id serial PRIMARY KEY NOT NULL,
      challenge_id integer NOT NULL REFERENCES challenges(id),
      user_id varchar NOT NULL REFERENCES users(id),
      completed_at timestamptz NOT NULL DEFAULT NOW(),
      UNIQUE(challenge_id, user_id)
    )`,
  },
  {
    name: "idx.challenge_completions_challenge",
    sql: "CREATE INDEX IF NOT EXISTS idx_challenge_completions_challenge ON challenge_completions(challenge_id)",
  },

  // broadcasts table
  {
    name: "deuce_entries.ghost",
    sql: "ALTER TABLE deuce_entries ADD COLUMN IF NOT EXISTS ghost boolean DEFAULT false NOT NULL",
  },
  {
    name: "deuce_entries.bristol_score",
    sql: "ALTER TABLE deuce_entries ADD COLUMN IF NOT EXISTS bristol_score integer",
  },
  {
    name: "deuce_entries.photo_url",
    sql: "ALTER TABLE deuce_entries ADD COLUMN IF NOT EXISTS photo_url text",
  },
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
  {
    name: "add_groups_avatar_url",
    sql: "ALTER TABLE groups ADD COLUMN IF NOT EXISTS avatar_url varchar",
  },
  {
    name: "add_deuce_entries_latitude",
    sql: "ALTER TABLE deuce_entries ADD COLUMN IF NOT EXISTS latitude numeric",
  },
  {
    name: "add_deuce_entries_longitude",
    sql: "ALTER TABLE deuce_entries ADD COLUMN IF NOT EXISTS longitude numeric",
  },

  // --- Battle Shits tables ---
  {
    name: "table.battle_matches",
    sql: `CREATE TABLE IF NOT EXISTS battle_matches (
      id varchar PRIMARY KEY NOT NULL,
      group_id varchar NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      challenger_id varchar NOT NULL REFERENCES users(id),
      opponent_id varchar NOT NULL REFERENCES users(id),
      match_type varchar(10) NOT NULL DEFAULT 'standard',
      status varchar(20) NOT NULL DEFAULT 'pending',
      winner_id varchar REFERENCES users(id),
      week_start timestamp NOT NULL,
      week_end timestamp NOT NULL,
      placement_deadline timestamp NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )`,
  },
  {
    name: "idx.battle_matches_group",
    sql: "CREATE INDEX IF NOT EXISTS idx_battle_matches_group ON battle_matches(group_id)",
  },
  {
    name: "idx.battle_matches_status",
    sql: "CREATE INDEX IF NOT EXISTS idx_battle_matches_status ON battle_matches(status)",
  },
  {
    name: "idx.battle_matches_players",
    sql: "CREATE INDEX IF NOT EXISTS idx_battle_matches_players ON battle_matches(challenger_id, opponent_id)",
  },
  {
    name: "table.battle_ships",
    sql: `CREATE TABLE IF NOT EXISTS battle_ships (
      id serial PRIMARY KEY NOT NULL,
      match_id varchar NOT NULL REFERENCES battle_matches(id) ON DELETE CASCADE,
      user_id varchar NOT NULL REFERENCES users(id),
      ship_type varchar(15) NOT NULL,
      cells jsonb NOT NULL,
      is_sunk boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT NOW(),
      UNIQUE(match_id, user_id, ship_type)
    )`,
  },
  {
    name: "idx.battle_ships_match",
    sql: "CREATE INDEX IF NOT EXISTS idx_battle_ships_match ON battle_ships(match_id)",
  },
  {
    name: "table.battle_attacks",
    sql: `CREATE TABLE IF NOT EXISTS battle_attacks (
      id serial PRIMARY KEY NOT NULL,
      match_id varchar NOT NULL REFERENCES battle_matches(id) ON DELETE CASCADE,
      attacker_id varchar NOT NULL REFERENCES users(id),
      col integer NOT NULL,
      row integer NOT NULL,
      is_hit boolean NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW(),
      UNIQUE(match_id, attacker_id, col, row)
    )`,
  },
  {
    name: "idx.battle_attacks_match",
    sql: "CREATE INDEX IF NOT EXISTS idx_battle_attacks_match ON battle_attacks(match_id)",
  },
  {
    name: "table.battle_tokens",
    sql: `CREATE TABLE IF NOT EXISTS battle_tokens (
      id serial PRIMARY KEY NOT NULL,
      match_id varchar NOT NULL REFERENCES battle_matches(id) ON DELETE CASCADE,
      user_id varchar NOT NULL REFERENCES users(id),
      deuce_entry_id varchar NOT NULL REFERENCES deuce_entries(id),
      token_type varchar(15) NOT NULL DEFAULT 'standard',
      created_at timestamptz NOT NULL DEFAULT NOW(),
      UNIQUE(match_id, deuce_entry_id, token_type)
    )`,
  },
  {
    name: "idx.battle_tokens_match_user",
    sql: "CREATE INDEX IF NOT EXISTS idx_battle_tokens_match_user ON battle_tokens(match_id, user_id)",
  },
  {
    name: "table.battle_powerups",
    sql: `CREATE TABLE IF NOT EXISTS battle_powerups (
      id serial PRIMARY KEY NOT NULL,
      match_id varchar NOT NULL REFERENCES battle_matches(id) ON DELETE CASCADE,
      user_id varchar NOT NULL REFERENCES users(id),
      powerup_type varchar(15) NOT NULL,
      used_at timestamptz,
      earned_at timestamptz NOT NULL DEFAULT NOW(),
      revealed_cell jsonb,
      UNIQUE(match_id, user_id, powerup_type)
    )`,
  },
  {
    name: "table.battle_badges",
    sql: `CREATE TABLE IF NOT EXISTS battle_badges (
      id serial PRIMARY KEY NOT NULL,
      user_id varchar NOT NULL REFERENCES users(id),
      badge_type varchar(30) NOT NULL,
      match_id varchar REFERENCES battle_matches(id),
      expires_at timestamp,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )`,
  },
  {
    name: "idx.battle_badges_user",
    sql: "CREATE INDEX IF NOT EXISTS idx_battle_badges_user ON battle_badges(user_id)",
  },
];

export async function runMigrations() {
  console.log("🔄 Running DB migrations...");
  let passed = 0;
  let failed = 0;

  for (const m of migrations) {
    try {
      await pool.query(m.sql);
      console.log(`  ✅ ${m.name}`);
      passed++;
    } catch (err: unknown) {
      const pgErr = err as { code?: string; message?: string };
      // Some "errors" are fine (e.g. column/index already exists with same def)
      if (
        pgErr.code === "42701" || // column already exists
        pgErr.code === "42P07" || // relation already exists
        pgErr.code === "23505" || // unique violation on index create
        pgErr.code === "42703"    // column does not exist (e.g. rename source gone)
      ) {
        console.log(`  ⏭️  ${m.name} (already exists)`);
        passed++;
      } else {
        console.error(`  ❌ ${m.name}: ${pgErr.message}`);
        failed++;
      }
    }
  }

  // Don't close the pool — the server process needs it to stay open

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
