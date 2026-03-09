# Log Flow — Autoresearch Iterations

## Iteration 1: Surface server error messages in log deuce modal

**Date**: 2026-03-09

**Issue**: The `logDeuceMutation.onError` handler in `log-deuce-modal.tsx` showed a generic "Failed to log deuce" message for ALL errors — rate limits (429), validation (400), authorization (403), and server errors (500) all displayed the same unhelpful message. The server returns specific, user-friendly messages (e.g., "Throne limit reached for today. Come back tomorrow.") but they were never surfaced.

**Root cause**: The `apiRequest` helper throws `Error("STATUS: JSON_BODY")`, but `onError` never parsed the error object to extract the server's `message` field.

**Fix**: Updated `onError` in `log-deuce-modal.tsx` to parse the JSON from the error message and extract the server's `message` field, falling back to a slightly improved generic message.

**Tests**: 461/461 pass. No regressions.

**Impact**: Users now see specific, actionable error messages:
- Rate limit → "Throne limit reached for today. Come back tomorrow."
- Invalid group → "Not authorized for group X"
- Bad data → specific validation message
- Server error → "Failed to log deuce. Please try again." (improved fallback)

---

## Iteration 2: Prevent future dates on backend POST /api/deuces

**Date**: 2026-03-09

**Issue**: The frontend date picker limits to today (`max` attribute), but the backend had no future date validation. A user could bypass the UI and POST a deuce with `loggedAt` set to any future date.

**Root cause**: The `loggedAt` validation in both `server/routes.ts` (POST /api/deuces and POST /api/deuces/bulk) and `server/routes/deuces.ts` only checked for `isNaN` — no upper bound.

**Fix**: Added future date rejection (with 1-minute clock skew tolerance) to all 3 deuce creation endpoints:
- `server/routes.ts` POST /api/deuces (line ~1322)
- `server/routes.ts` POST /api/deuces/bulk (same pattern)
- `server/routes/deuces.ts` POST /api/deuces (line ~243)

**Test added**: `edge-cases.test.ts` — "POST /api/deuces with future loggedAt is rejected with 400"

**Tests**: 462/462 pass (1 new test). No regressions.

**Impact**: Closes a data integrity gap — prevents impossible future-dated entries from appearing in feeds and messing with streak calculations.

---

## Iteration 3: Test edge cases — special chars, empty fields, boundary conditions

**Date**: 2026-03-09

**Issue**: Several input edge cases lacked test coverage on POST /api/deuces.

**Tests added** (4 new in `edge-cases.test.ts`):
1. Empty thoughts string → succeeds (200) ✅
2. Special characters in location ("O'Brien's / Bar & Grill") → succeeds, stores correctly ✅
3. Location > 100 chars → rejected (400) ✅ — Zod schema enforces `.max(100)`
4. Missing location field entirely → rejected (400) ✅ — Zod schema enforces `.min(1)`

**Previously covered** (confirmed working):
- Unicode emoji in thoughts (💩🚽👑) ✅
- Japanese text + emoji ✅
- SQL injection in location ✅
- Empty groupIds array ✅
- >500 char thoughts ✅

**Tests**: 466/466 pass (4 new tests). No regressions. No code changes needed — validation was already correct.

---

## Iteration 4: Validate rate limit UX

**Date**: 2026-03-09

**Issue investigated**: What happens when users hit the 10 logs/day rate limit?

**Findings** (all positive):
- Backend returns 429 with "Throne limit reached for today. Come back tomorrow." ✅
- Frontend now surfaces this message (fixed in iteration 1) ✅
- Optimistic deuce count rolls back correctly on 429 errors ✅
- Modal stays open on error so user can see the toast message ✅
- Form data preserved on error so nothing is lost ✅
- Rate limit is per-user, per UTC day ✅
- Tests: 3 rate limit tests exist across test files ✅

**Code changes**: None needed — rate limit UX is solid after iteration 1's error surfacing fix.

---

## Iteration 5: Feed not refreshing after logging — missing query invalidation

**Date**: 2026-03-09

**Issue**: After logging a deuce, the home feed did NOT refresh to show the new entry. The user had to manually pull-to-refresh. The `onSuccess` handler invalidated `/api/groups`, `/api/analytics/most-deuces`, `/api/auth/user`, and `/api/passport` — but NOT `/api/deuces` (the feed query).

**Root cause**: Missing `queryClient.invalidateQueries({ queryKey: ["/api/deuces"] })` in the success handler.

**Fix**: Added `/api/deuces` invalidation to the `onSuccess` handler. This matches all feed queries (home feed + group-specific feeds) since React Query matches by prefix.

**Tests**: 466/466 pass. No regressions.

**Impact**: Critical UX fix — new deuces now immediately appear in the home feed after logging, giving instant feedback that the log was successful.

---
