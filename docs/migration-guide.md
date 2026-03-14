# Deuce Diary — Database Migration Guide

> Covers: drizzle-kit usage, safe prod patterns, and how to address known schema gaps.
> Last updated 2026-03-13

---

## Tools

| Command | What it does |
|---------|-------------|
| `npm run db:push` | Applies schema changes directly to the target DB (no migration file generated). **Dev/staging only.** |
| `npx drizzle-kit generate` | Generates a SQL migration file in `./migrations/` from schema diff |
| `npx drizzle-kit migrate` | Applies pending migration files to the DB |
| `npm run check-schema` | Runs `scripts/check-schema-drift.ts` — compares live DB against `shared/schema.ts` |

### When to use `db:push` vs `generate + migrate`

| Scenario | Use |
|----------|-----|
| Local dev iteration | `db:push` — fast, no file overhead |
| Staging | `db:push` is acceptable if DB is disposable |
| Production | **Always** use `generate + migrate` — reviewable, reversible, auditable |

---

## Safe Production Migration Checklist

Before running any migration in production:

- [ ] **Test on staging first** — apply the migration to a staging DB clone
- [ ] **Backup** — snapshot the prod DB before applying destructive changes
- [ ] **Check for drift** — run `npm run check-schema` against prod before and after
- [ ] **Zero-downtime** — use `CONCURRENTLY` for index creation; avoid long-running table locks
- [ ] **Deploy in two phases** if needed (see below)

---

## Patterns by Change Type

### Adding a nullable column

Safest migration — no lock, no data backfill required.

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS foo text;
```

In `shared/schema.ts`:
```ts
foo: text("foo"),  -- nullable, no default needed
```

Deploy: schema change and code change can be deployed simultaneously.

---

### Adding a NOT NULL column with a default

Two-phase approach to avoid table lock in high-traffic tables:

**Phase 1** — Add nullable, backfill, then add constraint:
```sql
-- Step 1: add nullable
ALTER TABLE users ADD COLUMN IF NOT EXISTS foo text;

-- Step 2: backfill
UPDATE users SET foo = 'default_value' WHERE foo IS NULL;

-- Step 3: add not-null constraint (fast if no NULLs exist)
ALTER TABLE users ALTER COLUMN foo SET NOT NULL;
```

**Phase 2** — Add the Drizzle `.notNull()` after the DB constraint is live.

> ⚠️ For Neon serverless, `ALTER TABLE ... SET NOT NULL` acquires an `ACCESS EXCLUSIVE` lock. Do this during low-traffic hours or in a maintenance window.

---

### Adding an index

Always use `CONCURRENTLY` in production — avoids blocking reads/writes:

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_foo_bar ON foo (bar);
```

In `shared/schema.ts`:
```ts
(table) => [
  index("idx_foo_bar").on(table.bar),
]
```

> `drizzle-kit generate` will NOT add `CONCURRENTLY` automatically. Always edit the generated SQL file before applying to prod.

---

### Adding a unique constraint

Unique constraints require an exclusive lock. For large tables, create a unique index first:

```sql
-- Step 1: create unique index concurrently (no lock)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS uq_foo_bar ON foo (bar);

-- Step 2: add constraint using the existing index (fast, uses existing index)
ALTER TABLE foo ADD CONSTRAINT uq_foo_bar UNIQUE USING INDEX uq_foo_bar;
```

In `shared/schema.ts`:
```ts
(table) => [
  unique("uq_foo_bar").on(table.bar),
]
```

---

### Adding a foreign key

FKs require a scan of the referencing table to validate. For large tables, use `NOT VALID`:

```sql
-- Step 1: add FK without validating existing rows (fast, no lock on data)
ALTER TABLE child ADD CONSTRAINT fk_child_parent
  FOREIGN KEY (parent_id) REFERENCES parent(id)
  NOT VALID;

-- Step 2: validate in background (ShareUpdateExclusiveLock — doesn't block reads/writes)
ALTER TABLE child VALIDATE CONSTRAINT fk_child_parent;
```

---

### Dropping a column

Always use two-phase to avoid breaking running app code that still reads the column:

1. **Deploy 1**: Remove all app code that reads/writes the column
2. **Migrate**: `ALTER TABLE foo DROP COLUMN IF EXISTS bar`
3. **Deploy 2**: Remove column from `shared/schema.ts`

Never drop a column while app code still references it.

---

### Changing a column type

Requires rewriting the entire table in most cases. Always:

1. Add a new column with the new type
2. Backfill from the old column
3. Update app code to write to both columns
4. Switch reads to the new column
5. Drop the old column (after deploy)

---

## Addressing Known Schema Gaps

See `docs/database-schema.md` for the full gap summary. Migration SQL for each:

### `group_members`: Add unique constraint on `(user_id, group_id)`

**Risk:** Low — adds a constraint that should already hold if app logic is correct. If duplicate rows exist, the `CREATE UNIQUE INDEX CONCURRENTLY` will fail and tell you which rows.

```sql
-- First, find and clean up any duplicates:
SELECT user_id, group_id, count(*) FROM group_members
GROUP BY user_id, group_id HAVING count(*) > 1;

-- If clean:
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS uq_group_members_user_group
  ON group_members (user_id, group_id);

ALTER TABLE group_members
  ADD CONSTRAINT uq_group_members_user_group
  UNIQUE USING INDEX uq_group_members_user_group;
```

In `shared/schema.ts`, replace the existing performance index:
```ts
// BEFORE:
index("idx_group_members_user_group").on(table.userId, table.groupId),

// AFTER:
unique("uq_group_members_user_group").on(table.userId, table.groupId),
```

---

### `push_tokens`: Add unique constraint on `token`

**Risk:** Low. Duplicate tokens are wasteful but not dangerous. Dedup first:

```sql
-- Find duplicates:
SELECT token, count(*) FROM push_tokens GROUP BY token HAVING count(*) > 1;

-- Dedup (keep most recent per token):
DELETE FROM push_tokens p1
USING push_tokens p2
WHERE p1.token = p2.token AND p1.id < p2.id;

-- Add unique index:
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS uq_push_tokens_token
  ON push_tokens (token);
```

---

### `locations`: Fix `is_default` missing NOT NULL

**Risk:** None — adding NOT NULL after all existing rows already have a value.

```sql
UPDATE locations SET is_default = false WHERE is_default IS NULL;
ALTER TABLE locations ALTER COLUMN is_default SET NOT NULL;
```

In `shared/schema.ts`:
```ts
// BEFORE:
isDefault: boolean("is_default").default(false),

// AFTER:
isDefault: boolean("is_default").default(false).notNull(),
```

---

### `streak_alerts`: Fix `triggered_at` and `notified` missing NOT NULL

```sql
UPDATE streak_alerts SET triggered_at = created_at WHERE triggered_at IS NULL;
UPDATE streak_alerts SET notified = false WHERE notified IS NULL;
ALTER TABLE streak_alerts ALTER COLUMN triggered_at SET NOT NULL;
ALTER TABLE streak_alerts ALTER COLUMN notified SET NOT NULL;
```

---

### `daily_challenge_completions`: Add unique on `(user_id, challenge_date)`

```sql
-- Find duplicates:
SELECT user_id, challenge_date, count(*) FROM daily_challenge_completions
GROUP BY user_id, challenge_date HAVING count(*) > 1;

-- Dedup (keep earliest per user+date):
DELETE FROM daily_challenge_completions d1
USING daily_challenge_completions d2
WHERE d1.user_id = d2.user_id
  AND d1.challenge_date = d2.challenge_date
  AND d1.id > d2.id;

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS uq_daily_challenge_user_date
  ON daily_challenge_completions (user_id, challenge_date);
```

---

### `bingo_cards`: Add unique on `(user_id, month)`

```sql
DELETE FROM bingo_cards b1
USING bingo_cards b2
WHERE b1.user_id = b2.user_id
  AND b1.month = b2.month
  AND b1.created_at > b2.created_at;

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS uq_bingo_cards_user_month
  ON bingo_cards (user_id, month);
```

---

## Schema Drift Detection

The project ships `scripts/check-schema-drift.ts` which compares `shared/schema.ts` against the live database and reports:

- Missing tables
- Missing columns
- Missing indexes
- Type mismatches

Run it before and after any migration:

```bash
DATABASE_URL=<prod_url> npm run check-schema
```

Exit code 0 = no drift. Exit code 1 = drift detected.

---

## Rollback Strategy

Drizzle does not auto-generate rollback SQL. For every migration, write a corresponding rollback:

```sql
-- Example rollback for adding an index:
DROP INDEX CONCURRENTLY IF EXISTS idx_foo_bar;

-- Example rollback for adding a column:
ALTER TABLE foo DROP COLUMN IF EXISTS bar;

-- Example rollback for adding a unique constraint:
ALTER TABLE foo DROP CONSTRAINT IF EXISTS uq_foo_bar;
DROP INDEX CONCURRENTLY IF EXISTS uq_foo_bar;
```

Store rollback SQL alongside the migration file (e.g., `0006_foo.rollback.sql`).

---

## Migration File Naming Convention

```
NNNN_short_description.sql
```

Examples from this project:
- `0001_mysterious_selene.sql` — drizzle-kit auto-generated (initial schema)
- `0002_add_missing_indexes.sql` — hand-written performance indexes
- `0003_pagination_indexes.sql` — hand-written feed pagination indexes

For hand-written migrations, prefer descriptive names over drizzle-kit auto-names.
