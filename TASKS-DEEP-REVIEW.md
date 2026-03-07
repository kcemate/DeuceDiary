# Deuce Diary — Deep Audit (Grok 4.20 Reasoning, 2026-03-06)
# EXHAUSTIVE launch-readiness review — 80K chars of source analyzed

## CRITICAL (3 issues)

### 1. CRITICAL — Security — WebSocket has zero authentication
**File:** `server/routes.ts` — `wss.on('connection')` block
**Issue:** Anyone can connect to `/ws` and join any group to receive real-time deuce broadcasts. No JWT/session validation.
**Fix:** Extract token from query string (`?token=...`) or first message, validate with Clerk `verifyToken()`, reject otherwise.

### 2. CRITICAL — Security — Admin/internal endpoints use weak static fallback keys
**File:** `server/routes.ts` — `/api/admin/stats`, `/api/internal/*`
**Issue:** `const ADMIN_KEY = process.env.ADMIN_KEY || 'dev-admin-key'` — default key is in git history.
**Fix:** Remove `|| 'dev-admin-key'` fallback. Throw on startup if env vars missing. Require in Railway.

### 3. CRITICAL — Integrity — Streak calculation is racy and timezone-unsafe
**File:** `server/routes.ts` — `recalculateStreak()`
**Issue:** Pure UTC day boundaries vs user timezones. No transaction or lock on concurrent writes. Race conditions.
**Fix:** Wrap in DB transaction with `SELECT FOR UPDATE`. Consider user timezone in streak calculation.

## HIGH (7 issues)

### 4. HIGH — Security — IDOR on group endpoints
**File:** `server/routes.ts` — multiple group GET/POST endpoints
**Fix:** Create reusable `requireGroupMember()` middleware, apply to all group-scoped routes.

### 5. HIGH — Security — Push tokens stored without validation
**File:** `server/routes.ts` — `POST /api/notifications/register`
**Fix:** Add Expo token format regex validation. Unique constraint `(userId, platform, token)`. Rate limit.

### 6. HIGH — Integrity — Streak reset off-by-one edge cases
**File:** `server/routes.ts` — `recalculateStreak()` midnight logic
**Fix:** Add comprehensive test cases for 23:59→00:01 transitions. Consider daily rollup job.

### 7. HIGH — Performance — N+1 queries in getGroupMembers
**File:** `server/storage.ts` — `getGroupMembers()`
**Fix:** Rewrite as single JOIN query with lateral subquery for personal records.

### 8. HIGH — Performance — Missing database indexes
**File:** `shared/schema.ts`
**Fix:** Add indexes on `deuce_entries(userId, groupId)`, `deuce_entries(loggedAt)`, `group_members(userId, groupId)`, `push_tokens(userId)`, `reactions(entryId)`.

### 9. HIGH — Crash — Unhandled promises in POST /api/deuces
**File:** `server/routes.ts` — deuce creation handler
**Fix:** Wrap post-log side effects in try/catch. Use transaction for critical path.

### 10. HIGH — Auth — Soft-delete doesn't filter queries
**File:** `server/routes.ts` + `server/storage.ts`
**Fix:** Add `deletedAt IS NULL` to every user query. Add 30-day hard-delete cleanup job.

## MEDIUM (5 issues)

### 11. MEDIUM — Integrity — dailyLogCounts Map not persisted/cleaned
**Fix:** Add cleanup interval for old entries, or use Redis.

### 12. MEDIUM — Performance — WebSocket groupConnections can leak
**Fix:** Add ping/pong heartbeat, periodic dead connection cleanup.

### 13. MEDIUM — Crash — Sharp image processing no error boundary
**Fix:** Add try/catch around sharp, delete partial files on error.

### 14. MEDIUM — Rejection — Incomplete privacy policy & data disclosure
**Fix:** Update privacy policy for all data types. Add "Delete Account" flow. Include link in app metadata.

### 15. MEDIUM — Payment — RevenueCat missing grace period & event types
**Fix:** Handle BILLING_RECOVERY, SUBSCRIPTION_EXTENDED. Add grace_period_expires_at column.

### 16. MEDIUM — API — Inconsistent error shapes
**Fix:** Create `errorResponse()` helper. Use `.safeParse()` everywhere. Standard error envelope.

### 17. LOW — Rejection — Premium feature naming
**Fix:** Keep copy PG-13. Add "light bathroom humor" in App Store description.
