# Deuce King — Autoresearch Iterations

---

## Iteration 1 — Delete dead `routes/internal.ts` (duplicate crown-transfer)

**Date:** 2026-03-10
**What I analyzed:** The crown-transfer cron endpoint existed in two places:
1. Inline in `server/routes.ts` (lines ~320–421) — the **live** copy, registered via `app.post()`
2. `server/routes/internal.ts` — a `createInternalRouter()` that was **never imported or used** anywhere

The spec flagged this as a "duplicate to consolidate." Root cause: `routes/internal.ts` was built as a refactored modular version but never wired up. It was 100% dead code — cron calls would always hit the inline route.

**What I changed:**
- Deleted `server/routes/internal.ts` (dead code, never registered)
- Restored `getRandomTemplate` import in `routes.ts` that was accidentally removed during exploration
- Left the inline crown-transfer handler in `routes.ts` as the sole canonical implementation

**Test results:** 488/488 passed
**Verdict:** Clean — no duplicates, no dead router file.

---

## Iteration 2 — Add `POST /api/groups/:groupId/challenge/complete` endpoint

**Date:** 2026-03-10
**What I analyzed:** The storage layer had `addChallengeCompletion` and `getUserChallengeCompletion` implemented but there was no HTTP endpoint. The UI showed `userCompleted: true/false` from the GET endpoint but users had no way to actually mark a challenge done. This was a missing feature gap blocking the core challenge loop.

**What I changed:**
- Added `POST /api/groups/:groupId/challenge/complete` in `server/routes/king.ts`
  - Requires auth + group membership
  - Returns 404 if no active challenge
  - Returns 409 if already completed (idempotent-safe)
  - On success: returns `{ ok: true, challengeId }`
- Added 5 tests covering: happy path, duplicate prevention, no active challenge, unauthenticated, completionCount increment

**Test results:** 493/493 passed (+5 new tests)
**Verdict:** Challenge completion loop is now complete end-to-end.

---
