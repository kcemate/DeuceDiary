# DB Schema Iterations Log

## Click 1 — 2026-03-13
**Type:** docs
**What:** Created `docs/database-schema.md` — full ERD-style reference for all 14 tables (sessions, users, groups, group_members, deuce_entries, invites, locations, streak_alerts, push_tokens, reactions, broadcasts, daily_challenge_completions, analytics_events, referrals, bingo_cards, bingo_completions, passport_stamps, deuce_kings, challenges, challenge_completions). Documents columns, types, constraints, indexes, FK behavior, and schema gaps.
**Tests:** 651/651 passed
**Commit:** `docs(db): add ERD-style database schema reference for all 14 tables`

## Click 2 — 2026-03-13
**Type:** docs
**What:** Created `docs/migration-guide.md` — safe production migration patterns for adding columns, indexes, unique constraints, FK constraints, and column type changes. Includes zero-downtime techniques (`CREATE INDEX CONCURRENTLY`, `NOT VALID` FK), rollback strategy, drift detection, and concrete SQL for each known schema gap.
**Tests:** 651/651 passed
**Commit:** `docs(db): add migration safety guide with per-change-type patterns and gap remediation SQL`

## Click 3 — 2026-03-13
**Type:** fix
**What:** Added `.notNull()` to `locations.isDefault` in `shared/schema.ts`. The column had `.default(false)` but no `.notNull()`, meaning the DB would accept NULL insertions if the ORM default was bypassed. This hardens the schema at the type level and ensures Drizzle generates the correct DDL.
**Tests:** 651/651 passed
**Commit:** `fix(db): add .notNull() to locations.isDefault — had default(false) but DB could accept NULL`

## Click 4 — 2026-03-13
**Type:** fix
**What:** Added `.notNull()` to `streak_alerts.triggeredAt` and `streak_alerts.notified`. Both columns had `defaultNow()`/`default(false)` respectively but missing NOT NULL, allowing NULL insertions at the DB level if the default was bypassed. Now the Drizzle schema enforces `NOT NULL` to match the intended invariant.
**Tests:** 651/651 passed
**Commit:** `fix(db): add .notNull() to streak_alerts.triggeredAt and .notified — both had defaults but no NOT NULL`

## Click 5 — 2026-03-13
**Type:** fix
**What:** Upgraded `group_members` `(user_id, group_id)` from a plain performance `index()` to a `unique()` constraint (`uq_group_members_user_group`). The original index did not prevent duplicate memberships (same user in the same group twice). The unique constraint serves the same query-acceleration purpose AND enforces uniqueness at the DB level, closing a data integrity gap.
**Tests:** 651/651 passed
**Commit:** `fix(db): upgrade group_members (user_id, group_id) from performance index to unique constraint`

## Click 6 — 2026-03-13
**Type:** fix
**What:** Added `unique("uq_push_tokens_token").on(table.token)` to `push_tokens`. Without this constraint, a device could register the same APNs/FCM token multiple times (e.g. app reinstall without cleanup), causing duplicate notifications. The unique constraint ensures each token appears only once, enabling safe upsert patterns.
**Tests:** 651/651 passed
**Commit:** `fix(db): add unique constraint on push_tokens.token to prevent duplicate device registrations`

## Click 7 — 2026-03-13
**Type:** fix
**What:** Added `.notNull()` to all `createdAt`/`updatedAt`/`joinedAt` timestamp columns in the four core tables: `groups` (createdAt, updatedAt), `group_members` (joinedAt), `deuce_entries` (createdAt), `invites` (createdAt). These columns all had `defaultNow()` but no NOT NULL — a pervasive pattern across the schema where the DB default masked a missing constraint. Remaining `createdAt` columns in peripheral tables (analytics_events, referrals, bingo_cards, etc.) are lower priority and can be addressed in a follow-up migration.
**Tests:** 651/651 passed
**Commit:** `fix(db): add .notNull() to createdAt/updatedAt/joinedAt in groups, group_members, deuce_entries, invites`
