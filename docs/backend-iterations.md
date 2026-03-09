# Backend Infrastructure Iterations

## Session: 2026-03-09

### Iteration 1: Fix N+1 queries in streak fetching
**Problem:** Two endpoints in `routes.ts` used `Promise.all(groups.map(g => storage.getGroupStreak(g.id)))` — firing N individual queries instead of using the existing `getGroupStreaksBatch()` method.
**Fix:** Replaced with single `getGroupStreaksBatch()` call + `Map` lookup. Also parallelized streak update writes with `Promise.all()` in the streak insurance endpoint.
**Files:** `server/routes.ts`, all 19 test files (added `getGroupStreaksBatch` to memStore)
**Impact:** Reduces DB round-trips from O(N) to O(1) for auth sync and streak insurance endpoints.

---

### Iteration 2: Wrap /api/deuces/sync with outer try/catch
**Problem:** The offline sync endpoint had per-entry error handling but no top-level try/catch wrapper. Any error before the loop (or in response serialization) would cause an unhandled promise rejection and crash.
**Fix:** Added outer try/catch that returns a 500 with standardized error.
**Files:** `server/routes.ts`
**Impact:** Prevents server crashes from edge-case errors in the sync endpoint.

---

### Iteration 3: Consolidate duplicate utility functions
**Problem:** `escapeHtml` was defined in 3 files, `isPremiumUser`/`getTodayUTC`/`getTitle`/`MAX_LOGS_PER_DAY` duplicated between `routes.ts` and `routes/helpers.ts`, `getTodayUTC` duplicated in `streakNotifications.ts`.
**Fix:** Added `escapeHtml` to `routes/helpers.ts` as the single source of truth. Updated all consumers to import from helpers. Removed 66 lines of duplicate code.
**Files:** `server/routes.ts`, `server/routes/helpers.ts`, `server/routes/groups.ts`, `server/routes/public.ts`, `server/streakNotifications.ts`
**Impact:** Single source of truth for shared utilities — easier maintenance, no risk of divergent behavior.

---

### Iteration 4: Add DB pool error handler
**Problem:** `pg.Pool` emits `'error'` when a backend kills an idle connection (Railway deploys, PgBouncer timeouts). Without a handler, this becomes an `uncaughtException` and crashes the server.
**Fix:** Added `pool.on('error', ...)` handler that logs the error without crashing.
**Files:** `server/db.ts`
**Impact:** Prevents server crashes from transient DB connection drops.

---

### Iteration 5: Add X-Request-Id middleware for request tracing
**Problem:** No way to correlate client-side errors with server logs. When a user reports an error, there's no trace ID to find the relevant server log entry.
**Fix:** Added middleware that generates a UUID for each request (or forwards the `X-Request-Id` header if already set). The ID appears in response headers, API log lines, and error responses.
**Files:** `server/index.ts`
**Impact:** Enables production debugging — clients can report the request ID and operators can grep server logs.

---

### Iteration 6: Improve health check with 503 status and DB latency
**Problem:** Health check returned 500 when DB was down. Load balancers couldn't distinguish "server crashed" from "DB unreachable." No timing data for monitoring.
**Fix:** Returns 503 (Service Unavailable) with structured `{ status: 'degraded', db: 'unreachable' }` when DB is down. Added `dbLatencyMs` field when healthy.
**Files:** `server/routes.ts`
**Impact:** Load balancers can properly route traffic. Monitoring dashboards get DB latency data.

---

## Known Issues for Future Iterations
- **Duplicate route code:** `server/routes/*.ts` (auth, deuces, groups, etc.) appear to be a partial refactor of the monolithic `server/routes.ts` — the extracted routers are never mounted. Either complete the extraction or remove the dead files.
- **Duplicate recalculateStreak:** Two versions exist — one in `routes.ts` (with db.transaction fallback for tests) and one in `helpers.ts` (db.transaction only). Should be consolidated.
- **Error response standardization:** 60+ route handlers in `server/routes/*.ts` still use `res.status(X).json({ message })` instead of the `Errors` utility. Low priority since the response shape includes `message` either way.
- **Unsafe `error.message` patterns:** All fixed in this session. Monitor for regressions.
