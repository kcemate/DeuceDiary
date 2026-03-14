# Performance Optimization Iterations (Ratchet-style)

## Click 1 — Batch streak queries in `/api/auth/sync`
**Issue:** N+1 — `getGroupStreak` called once per group via `Promise.all` in `routes.ts:595-600`. With N groups that's N round-trips to the DB.
**Fix:** Replaced with existing `getGroupStreaksBatch` — fetches all streaks in a single `WHERE id = ANY(...)` query.
**File:** `server/routes.ts`
**Commit:** `perf: batch streak queries in /api/auth/sync using getGroupStreaksBatch`

---

## Click 2 — Batch group membership checks in `POST /api/deuces`
**Issue:** N+1 — `isUserInGroup(userId, gid)` called sequentially for each `targetGroupId` (loop in `routes/deuces.ts:229-234`).
**Fix:** Added `isUserInGroups(userId, groupIds): Promise<Set<string>>` to `IStorage` and `DatabaseStorage`. Uses `WHERE user_id = ? AND group_id = ANY(?)` — single query regardless of group count.
**Files:** `server/storage.ts`, `server/routes/deuces.ts`
**Commit:** `perf: batch group membership checks in POST /api/deuces`

---

## Click 3 — Batch streak fetches after deuce creation
**Issue:** N+1 — `getGroupStreak(groupId)` called once per group inside the streak recalculation loop (`routes/deuces.ts:310`). With N target groups = N DB queries.
**Fix:** Separated recalculation loop from streak reading. After all `recalculateStreak` calls complete, fetches all streaks at once via `getGroupStreaksBatch(targetGroupIds)`.
**File:** `server/routes/deuces.ts`
**Commit:** `perf: batch streak fetches after recalculate in POST /api/deuces`

---

## Click 4 — Add `(groupId, loggedAt DESC)` index on `deuce_entries`
**Issue:** Missing index — queries filtering by `groupId` alone (e.g., `getGroupEntries`, `getGroupDeuceCount`, `getMembersLogStatusToday`) cannot use the existing `(userId, groupId)` composite index. Full table scan on large tables.
**Fix:** Added `idx_deuce_entries_group_logged` index on `(group_id, logged_at DESC)` in `shared/schema.ts` and migration `migrations/0005_add_deuce_entries_group_logged_index.sql`. Covers both the `WHERE group_id = ?` filter and the `ORDER BY logged_at DESC` sort used by the group feed.
**Files:** `shared/schema.ts`, `migrations/0005_add_deuce_entries_group_logged_index.sql`
**Commit:** `perf: add (groupId, loggedAt) index on deuce_entries for group feed queries`

---

## Click 5 — `DISTINCT ON` for personal records in `getGroupMembers`
**Issue:** Expensive full-scan — `getGroupMembers` fetched **all** historical entries for every group member, grouped them by user+date in SQL (large result set), then filtered to top-1 per user in application code. O(total entries for all members) rows returned.
**Fix:** Replaced with a `DISTINCT ON (user_id)` subquery that returns only 1 row per user directly from PostgreSQL, reducing result set to O(members).
**File:** `server/storage.ts`
**Commit:** `perf: use DISTINCT ON for personal records in getGroupMembers`

---

## Click 6 — Parallelize `getPremiumAnalytics` queries
**Issue:** Sequential queries — `getPremiumAnalytics` ran 6+ independent DB queries one after another: total count, first entry date, group IDs, best DOW, avg Bristol, most-used location. Total latency = sum of all query times.
**Fix:** Wrapped all independent queries in a single `Promise.all`. Streak + group rankings (dependent on `userGroupIds`) run in a second parallel batch. Total latency ≈ max of slowest query instead of sum.
**File:** `server/storage.ts`
**Commit:** `perf: parallelize independent queries in getPremiumAnalytics`

---

## Click 7 — Parallelize `getWeeklyReport` queries
**Issue:** Sequential queries — `getWeeklyReport` ran 7 sequential DB queries: total deuces, peak day, most active squad, group IDs, funniest entry, total reactions, daily counts. All independent except the streak lookup.
**Fix:** Wrapped all 7 in a single `Promise.all`. Only the streak lookup (requiring `userGroupIds`) is deferred to a second step. Latency reduced from 7× to ~1× round-trip.
**File:** `server/storage.ts`
**Commit:** `perf: parallelize independent queries in getWeeklyReport`
