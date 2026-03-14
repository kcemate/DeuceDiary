# Deuce Diary — Database Schema Reference

> Generated from `shared/schema.ts` · Last updated 2026-03-13

## Overview

The database is PostgreSQL (Neon serverless). Schema is managed with **Drizzle ORM** (`drizzle-orm/pg-core`). All migrations are generated with `drizzle-kit` and applied with `drizzle-kit push` (dev) or via migration files (prod).

```
sessions
users ──┬── groups (created_by →)
        ├── group_members (→ groups)
        ├── deuce_entries (→ groups)
        ├── invites (→ groups)
        ├── locations (created_by nullable)
        ├── reactions (→ deuce_entries)
        ├── push_tokens
        ├── passport_stamps
        ├── daily_challenge_completions
        ├── bingo_cards (→ groups nullable)
        ├── bingo_completions (→ bingo_cards)
        ├── referrals (referrer_id, referee_id)
        ├── streak_alerts (→ groups)
        ├── broadcasts (→ groups)
        ├── analytics_events (user_id, no FK)
        ├── deuce_kings (→ groups, → users)
        ├── challenges (→ groups, → users, → deuce_kings)
        └── challenge_completions (→ challenges, → users)
```

---

## Tables

### `sessions`

Session storage for Replit Auth. **Do not drop.**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `sid` | varchar | PK | Session ID |
| `sess` | jsonb | NOT NULL | Full session JSON |
| `expire` | timestamp | NOT NULL | Expiry time |

**Indexes:** `IDX_session_expire` on `expire` — required for cleanup queries.

---

### `users`

Core user table. Auth identity comes from Clerk; this table stores app-level profile and subscription state.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | varchar | PK, NOT NULL | — | Clerk user ID |
| `email` | varchar | UNIQUE | — | Nullable (Clerk may not provide) |
| `first_name` | varchar | — | — | |
| `last_name` | varchar | — | — | |
| `username` | varchar | UNIQUE | — | Nullable until user sets one |
| `profile_image_url` | varchar | — | — | |
| `deuce_count` | integer | — | 0 | Denormalized total log count |
| `subscription` | varchar(10) | NOT NULL | `'free'` | `'free'` or `'premium'` |
| `subscription_expires_at` | timestamp | — | — | Nullable; used for RevenueCat expiry |
| `streak_insurance_used` | boolean | NOT NULL | `false` | One-time premium feature flag |
| `theme` | text | NOT NULL | `'default'` | Validated to VALID_THEMES set |
| `reminder_hour` | integer | — | — | 0–23; nullable if no reminder set |
| `reminder_minute` | integer | — | — | 0–59; nullable if no reminder set |
| `referral_code` | text | UNIQUE | — | User's own invite code |
| `referred_by` | text | — | — | Referral code of referrer (not FK) |
| `referral_count` | integer | — | 0 | Denormalized; tracks referrals credited |
| `timezone` | varchar(64) | NOT NULL | `'UTC'` | IANA timezone string |
| `deleted_at` | timestamp | — | — | Soft delete; NULL = active |
| `created_at` | timestamp | — | `NOW()` | |
| `updated_at` | timestamp | — | `NOW()` | ⚠️ Not auto-updated on row changes |

**Indexes:** PK on `id`, unique on `email`, unique on `username`, unique on `referral_code`.

**Notes:**
- `deuce_count` is denormalized — updated via `updateUserDeuceCount()`. Can drift from actual entry count; treat as approximate.
- `referral_count` is also denormalized for the same reason.
- `updated_at` has `defaultNow()` but no trigger; it reflects the insert time, not the last update time, unless explicitly set on update.
- `deleted_at` is a soft-delete field. Hard-delete is not used. Queries should filter `WHERE deleted_at IS NULL` for active users.
- `referred_by` stores a referral code string (not a user ID FK). To resolve the referrer, join via `users.referral_code`.

---

### `groups`

A squad that users log deuces in together.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | varchar | PK, NOT NULL | — | UUID |
| `name` | varchar | NOT NULL | — | |
| `description` | text | — | — | |
| `created_by` | varchar | NOT NULL, FK→users.id | — | |
| `timezone` | varchar(64) | NOT NULL | `'UTC'` | |
| `current_streak` | integer | NOT NULL | 0 | |
| `longest_streak` | integer | NOT NULL | 0 | |
| `last_streak_date` | varchar | — | — | ISO date `YYYY-MM-DD`; nullable |
| `created_at` | timestamp | — | `NOW()` | |
| `updated_at` | timestamp | — | `NOW()` | ⚠️ Not auto-updated |

**Indexes:** `idx_groups_current_streak` on `current_streak`.

**FK behavior:** `created_by` → `users.id` (no `onDelete` = RESTRICT by default).

---

### `group_members`

Join table: which users are in which groups.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `group_id` | varchar | NOT NULL, FK→groups.id CASCADE | — | |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `role` | varchar | NOT NULL | `'member'` | `'admin'` or `'member'` |
| `joined_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_group_members_user_group` on `(user_id, group_id)`, `idx_group_members_group` on `group_id`.

**⚠️ Schema gap:** The index on `(user_id, group_id)` is a performance index only — it does **not** enforce uniqueness. Duplicate memberships (same user in same group twice) are possible at the DB level. Uniqueness is enforced only at the application layer. See [migration guide](./migration-guide.md#adding-a-unique-constraint-safely) for how to harden this safely.

---

### `deuce_entries`

Individual log entries ("deuces").

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | varchar | PK, NOT NULL | — | UUID |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `group_id` | varchar | NOT NULL, FK→groups.id CASCADE | — | |
| `location` | varchar | NOT NULL | — | Free text or preset name |
| `thoughts` | text | NOT NULL | — | User's journal note |
| `ghost` | boolean | NOT NULL | `false` | If true, hidden from group feed |
| `bristol_score` | integer | — | — | 1–7; nullable (not shown in UI) |
| `photo_url` | text | — | — | CDN URL; nullable |
| `latitude` | numeric | — | — | GPS; nullable |
| `longitude` | numeric | — | — | GPS; nullable |
| `logged_at` | timestamp | NOT NULL | — | User-supplied time of event |
| `last_logged_at` | timestamp | — | — | ⚠️ Unused/unclear; see note |
| `created_at` | timestamp | — | `NOW()` | Row insertion time |

**Indexes:** 5 indexes:
- `idx_deuce_entries_user_group` on `(user_id, group_id)`
- `idx_deuce_entries_logged_at` on `logged_at`
- `idx_deuce_entries_created_at` on `created_at`
- `idx_deuce_entries_user_created` on `(user_id, created_at)`
- `idx_deuce_entries_group_logged` on `(group_id, logged_at)` — most common feed query pattern

**⚠️ Schema note:** `last_logged_at` purpose is unclear from the schema; it's never set in `createDeuceEntry`. May be legacy. Do not rely on it.

---

### `invites`

Short-lived invite links to join a group.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | varchar | PK, NOT NULL | — | UUID used as the invite code |
| `group_id` | varchar | NOT NULL, FK→groups.id CASCADE | — | |
| `created_by` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `expires_at` | timestamp | NOT NULL | — | Set at creation (e.g. +7 days) |
| `created_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_invites_group` on `group_id`.

---

### `locations`

Preset and user-created location names for log entries.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `name` | varchar | NOT NULL | — | |
| `is_default` | boolean | — | `false` | ⚠️ Missing NOT NULL — can be NULL |
| `created_by` | varchar | FK→users.id (nullable) | — | NULL = system default |
| `created_at` | timestamp | — | `NOW()` | |

**⚠️ Schema gap:** `is_default` has `default(false)` but is missing `.notNull()`. A row can have `is_default = NULL` if inserted without the default being applied. Application code should treat `is_default IS DISTINCT FROM true` as "not default".

---

### `streak_alerts`

Records when a group streak is at risk (members haven't logged today).

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `group_id` | varchar | NOT NULL, FK→groups.id CASCADE | — | |
| `triggered_at` | timestamp | — | `NOW()` | ⚠️ Missing NOT NULL |
| `streak_length` | integer | NOT NULL | — | |
| `missing_members` | text | NOT NULL | — | JSON array of display names |
| `notified` | boolean | — | `false` | ⚠️ Missing NOT NULL |

**Indexes:** `idx_streak_alerts_group` on `group_id`.

**⚠️ Schema gaps:** Both `triggered_at` and `notified` have defaults but are missing `.notNull()`. They cannot be NULL in practice (defaultNow()/false), but the constraint isn't enforced at the DB level.

---

### `push_tokens`

Device push notification tokens.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `token` | text | NOT NULL | — | APNs or FCM token |
| `platform` | varchar(10) | NOT NULL | — | `'ios'` or `'android'` |
| `created_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_push_tokens_user` on `user_id`.

**⚠️ Schema gap:** No unique constraint on `token`. If a device re-registers (e.g. app reinstall), duplicate tokens can accumulate. Application should upsert by token or clean up stale entries.

---

### `reactions`

Emoji reactions to deuce entries.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `entry_id` | varchar | NOT NULL, FK→deuce_entries.id CASCADE | — | |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `emoji` | varchar(10) | NOT NULL | — | Single emoji character |
| `created_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_reactions_entry` on `entry_id`, `idx_reactions_user` on `user_id`.

**Unique constraint:** `(entry_id, user_id, emoji)` — one reaction per user per emoji per entry.

---

### `broadcasts`

Records milestone broadcasts sent to a group.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `group_id` | varchar | NOT NULL, FK→groups.id CASCADE | — | |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `milestone` | text | NOT NULL | — | Milestone description string |
| `created_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_broadcasts_group` on `group_id`.

---

### `daily_challenge_completions`

Tracks which users completed the daily challenge on which date.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `challenge_date` | varchar(10) | NOT NULL | — | `YYYY-MM-DD` |
| `created_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_daily_challenge_user_date` on `(user_id, challenge_date)`.

**⚠️ Schema gap:** No unique constraint on `(user_id, challenge_date)`. A user could have multiple completions recorded for the same day. App logic must deduplicate on read.

---

### `analytics_events`

Append-only event log for product analytics.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `user_id` | text | — | — | Nullable (anonymous events allowed); **no FK** |
| `event` | text | NOT NULL | — | Event name |
| `properties` | text | — | — | JSON string (not jsonb) |
| `created_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_analytics_events_user` on `user_id`, `idx_analytics_events_event` on `event`.

**Design notes:**
- `user_id` has **no foreign key** — intentional. Analytics events can be logged before user creation (anonymous), and we don't want cascade deletes wiping event history when a user is soft-deleted.
- `properties` is stored as a `text` JSON string rather than `jsonb`. This is a trade-off: no jsonb indexing/querying, but simpler to append without parsing. If jsonb queries are needed in future, migrate this column.

---

### `referrals`

Tracks who referred whom and whether a discount was applied.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `referrer_id` | varchar | NOT NULL, FK→users.id | — | No onDelete = RESTRICT |
| `referee_id` | varchar | NOT NULL, FK→users.id | — | No onDelete = RESTRICT |
| `discount_applied` | boolean | NOT NULL | `false` | |
| `converted_to_premium_at` | timestamp | — | — | Nullable |
| `created_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_referrals_referrer` on `referrer_id`, `idx_referrals_referee` on `referee_id`.

**⚠️ FK behavior:** Both FKs have no `onDelete` specified → defaults to RESTRICT. Deleting a user who has referrals will fail at the DB level. Since users are soft-deleted (`deleted_at`), this is unlikely to be triggered, but should be documented.

---

### `bingo_cards`

Monthly bingo cards per user (optionally scoped to a group).

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | varchar | PK, NOT NULL | — | UUID |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `group_id` | varchar | FK→groups.id SET NULL (nullable) | — | |
| `month` | varchar(7) | NOT NULL | — | `YYYY-MM` |
| `squares` | jsonb | NOT NULL | — | `BingoSquare[]` |
| `completed_squares` | jsonb | NOT NULL | `[]` | `number[]` of completed square IDs |
| `created_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_bingo_cards_user_month` on `(user_id, month)`.

**⚠️ Schema gap:** No unique constraint on `(user_id, month)`. Multiple bingo cards per user per month are possible. App should check before creating.

---

### `bingo_completions`

Records when a user completes a bingo card.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `card_id` | varchar | NOT NULL, FK→bingo_cards.id CASCADE | — | |
| `completed_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_bingo_completions_user` on `user_id`, `idx_bingo_completions_card` on `card_id`.

---

### `passport_stamps`

Geographic "stamps" awarded when a user logs a deuce in a new location.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `user_id` | varchar | NOT NULL, FK→users.id CASCADE | — | |
| `city` | varchar(200) | NOT NULL | — | |
| `region` | varchar(200) | — | — | State/province; nullable |
| `country` | varchar(200) | NOT NULL | — | |
| `country_code` | varchar(10) | — | — | ISO 3166-1 alpha-2; nullable |
| `latitude` | numeric | NOT NULL | — | |
| `longitude` | numeric | NOT NULL | — | |
| `entry_count` | integer | NOT NULL | 1 | Upserted on each new log |
| `first_visit_at` | timestamp | — | `NOW()` | |
| `last_visit_at` | timestamp | — | `NOW()` | |

**Indexes:** `idx_passport_stamps_user` on `user_id`.

**Unique constraint:** `uq_passport_stamps_user_city_country` on `(user_id, city, country)`.

---

### `deuce_kings`

Weekly/periodic "Deuce King" winners — the user who logged the most in a period.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `group_id` | varchar | NOT NULL, FK→groups.id | — | No onDelete |
| `user_id` | varchar | NOT NULL, FK→users.id | — | No onDelete |
| `period_start` | timestamp with tz | NOT NULL | — | |
| `period_end` | timestamp with tz | NOT NULL | — | |
| `log_count` | integer | NOT NULL | — | |
| `consecutive_wins` | integer | NOT NULL | 1 | |
| `created_at` | timestamp with tz | NOT NULL | `NOW()` | |

**Indexes:** `idx_deuce_kings_group_period` on `(group_id, period_start)`.

**⚠️ FK behavior:** No `onDelete` on either FK → RESTRICT. Deleting a group or user that has `deuce_kings` rows will fail. Soft-delete mitigates this in practice.

---

### `challenges`

King's Challenge: a goal set by the current Deuce King for their group.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `group_id` | varchar | NOT NULL, FK→groups.id | — | No onDelete |
| `king_id` | varchar | NOT NULL, FK→users.id | — | No onDelete |
| `deuce_king_id` | integer | NOT NULL, FK→deuce_kings.id | — | No onDelete |
| `title` | varchar(140) | NOT NULL | — | |
| `template_key` | varchar(50) | — | — | Nullable; links to a challenge template |
| `period_start` | timestamp with tz | NOT NULL | — | |
| `period_end` | timestamp with tz | NOT NULL | — | |
| `is_auto_selected` | boolean | NOT NULL | `false` | |
| `created_at` | timestamp with tz | NOT NULL | `NOW()` | |

**Indexes:** `idx_challenges_group_period` on `(group_id, period_start)`.

---

### `challenge_completions`

Records which users completed which challenges.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | serial | PK | — | |
| `challenge_id` | integer | NOT NULL, FK→challenges.id | — | No onDelete |
| `user_id` | varchar | NOT NULL, FK→users.id | — | No onDelete |
| `completed_at` | timestamp with tz | NOT NULL | `NOW()` | |

**Unique constraint:** `(challenge_id, user_id)` — one completion per user per challenge.

**Indexes:** `idx_challenge_completions_challenge` on `challenge_id`.

---

## Summary: Schema Gaps & Tech Debt

| Table | Gap | Severity | Status |
|-------|-----|----------|--------|
| `users` | `updated_at` not auto-updated by trigger | Low | Documented |
| `group_members` | No unique constraint on `(user_id, group_id)` | High | Documented |
| `locations` | `is_default` missing `.notNull()` | Medium | Documented |
| `streak_alerts` | `triggered_at`, `notified` missing NOT NULL | Low | Documented |
| `push_tokens` | No unique constraint on `token` | Medium | Documented |
| `daily_challenge_completions` | No unique on `(user_id, challenge_date)` | Medium | Documented |
| `bingo_cards` | No unique on `(user_id, month)` | Medium | Documented |
| `analytics_events` | `properties` is `text` not `jsonb` | Low | Design choice |
| `referrals` | FKs missing `onDelete` (RESTRICT by default) | Low | Documented |
| `deuce_kings` / `challenges` | FKs missing `onDelete` (RESTRICT by default) | Low | Documented |

See `docs/migration-guide.md` for how to address these safely in production.
