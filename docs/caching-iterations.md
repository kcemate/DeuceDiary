# Caching Iterations (Ratchet-style)

Implementation: `server/lib/cache.ts` — `TtlCache<T>` class backed by a `Map`. Supports `get`, `set`, `delete`, `deleteByPrefix`, and `clear`. Named singleton instances exported for each domain. No Redis, no external dependencies — process-local, resets on restart.

---

## Click 1 — Cache `GET /api/locations` (5 min TTL)

**Issue:** `storage.getLocations()` hits the DB on every request from every user, even though the locations list is a near-static global table that rarely changes.
**Fix:** Added `locationsCache` (5 min TTL). GET returns cached value; POST `/api/locations` (create new location) calls `locationsCache.delete('all')` to invalidate. Added `Cache-Control: public, max-age=300` response header.
**Files:** `server/lib/cache.ts` (new), `server/routes/deuces.ts`
**Commit:** `perf(cache): cache locations list with 5min TTL`

---

## Click 2 — Cache `GET /api/groups/:groupId/leaderboard` (30 s TTL)

**Issue:** Every leaderboard load calls `storage.getGroupMembers(groupId)` — a `DISTINCT ON` query with user joins — and then sorts in application code. Refreshed eagerly by clients on every tab focus.
**Fix:** Added `leaderboardCache` keyed by `groupId` (30 s TTL). Cache is populated on first miss and returned on subsequent hits. Added `Cache-Control: private, max-age=30`. Invalidation on new deuce handled in Click 6.
**Files:** `server/routes/groups.ts`
**Commit:** `perf(cache): cache group leaderboard with 30s TTL`

---

## Click 3 — Cache `GET /api/auth/user` (60 s TTL)

**Issue:** `GET /api/auth/user` is called on every app load and tab refocus to hydrate the current user. Each call hits `storage.getUser()` even when nothing has changed.
**Fix:** Added `userCache` keyed by `userId` (60 s TTL). Cache is invalidated on `PUT /api/auth/user` (username update) and `POST /api/auth/user/profile-picture` (profile picture update). Added `Cache-Control: private, max-age=60`.
**Files:** `server/routes/auth.ts`
**Commit:** `perf(cache): cache user profile with 60s TTL, invalidate on update`

---

## Click 4 — Cache `GET /api/subscription` (60 s TTL)

**Issue:** `GET /api/subscription` calls `storage.getUserSubscription()` on every premium feature render. Subscription tier changes at most once a month.
**Fix:** Added `subscriptionCache` keyed by `userId` (60 s TTL). Invalidated on `POST /api/subscription/upgrade`. Added `Cache-Control: private, max-age=60`.
**Files:** `server/routes/premium.ts`
**Commit:** `perf(cache): cache subscription status with 60s TTL, invalidate on upgrade`

---

## Click 5 — Cache `GET /api/groups/:groupId/weekly-report` (5 min TTL)

**Issue:** `storage.getGroupWeeklyReport()` runs complex SQL aggregations (top logger, streak data, weekly entry counts) on every open of the weekly report card. Report data only changes when new deuces are posted, which happens at most a few times per day.
**Fix:** Added `weeklyReportCache` keyed by `groupId` (5 min TTL). Added `Cache-Control: private, max-age=300`. Cache auto-expires; for a tighter guarantee, invalidation on new deuce can be wired via the weekly-report cache if needed.
**Files:** `server/routes/groups.ts`
**Commit:** `perf(cache): cache group weekly report with 5min TTL`

---

## Click 6 — Cache `GET /api/analytics/me` (60 s TTL)

**Issue:** `storage.getPremiumAnalytics()` runs 6+ parallel DB queries (total count, first entry date, best DOW, avg Bristol, most-used location, streak rankings). Even after parallelization (Click 6 of prior ratchet), the combined round-trip is expensive and called on every analytics page load.
**Fix:** Added `analyticsCache` keyed by `userId` (60 s TTL). Added `Cache-Control: private, max-age=60`. Invalidated on `POST /api/deuces` since a new entry changes analytics (deuceCount, best-day stats, etc.). Also added blanket invalidation of `userCache` and `leaderboardCache` per group on new deuce.
**Files:** `server/routes/premium.ts`, `server/routes/deuces.ts`
**Commit:** `perf(cache): cache premium analytics with 60s TTL, invalidate on new deuce`

---

## Click 7 — Cache `GET /api/groups/:groupId/streak` (30 s TTL)

**Issue:** `GET /api/groups/:groupId/streak` calls `storage.getGroupStreak()` + `storage.getMembersLogStatusToday()` — two queries — on every group screen load and every tab refocus. This is the hot-path for group social presence.
**Fix:** Added `streakCache` keyed by `groupId` (30 s TTL). Cache is invalidated on `POST /api/deuces` (new deuce updates streak state). Added `Cache-Control: private, max-age=30`. The 30 s window is short enough to feel live while eliminating the thundering-herd effect when multiple group members refresh simultaneously.
**Files:** `server/routes/groups.ts`
**Commit:** `perf(cache): cache group streak with 30s TTL, invalidate on new deuce`
