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
