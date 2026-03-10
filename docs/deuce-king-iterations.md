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

## Iteration 3 — Add "Mark Complete" button to Active Challenge Card

**Date:** 2026-03-10
**What I analyzed:** The Active Challenge Card showed `userCompleted: true/false` state but had no action. Even after adding the API endpoint in Iteration 2, users in the UI couldn't trigger it. There was no CTA to mark the challenge done — it was a read-only card.

**What I changed:**
- Added `completeChallengeMutation` in `group-detail.tsx` calling `POST /api/groups/:groupId/challenge/complete`
- Replaced the static "✅ You completed this!" text with a conditional:
  - Not yet: green outlined "Mark Complete 🏆" button (disabled while pending)
  - Completed: "✅ You completed this!" text (same as before)
- Invalidates the challenge query on success to update the progress bar live
- Toast feedback on success/error

**Test results:** 493/493 passed
**Verdict:** Users can now complete challenges from the squad page.

---

## Iteration 4 — Fix period_end boundary bug (`gte` → `gt`)

**Date:** 2026-03-10
**What I analyzed:** Three queries in `storage.ts` used `gte(*.periodEnd, now)` (>=) to determine if a king/challenge period is still active. The cron sets `periodEnd = Monday 00:00:00.000 UTC`. At precisely midnight, the old king's record would still show as active (because `periodEnd >= now` is true at that exact millisecond) while the cron is inserting the new king. This creates a brief window of double-king state.

**What I changed:**
- `getCurrentKing`: `gte(deuceKings.periodEnd, now)` → `gt(deuceKings.periodEnd, now)`
- `getActiveChallenge`: `gte(challenges.periodEnd, now)` → `gt(challenges.periodEnd, now)`
- `getChallengeWithMemberProgress`: same fix
- Added `gt` to the drizzle-orm import in `storage.ts`

**Semantics:** Period is active if `periodStart <= now < periodEnd`. A king crowned Mon–Sun expires cleanly at the start of the next Monday, not a millisecond into it.

**Test results:** 493/493 passed
**Verdict:** Period boundary is correct — no stale king at rollover time.

---

## Iteration 5 — Add king avatar to Crown Banner

**Date:** 2026-03-10
**What I analyzed:** The Crown Banner showed only a 👑 emoji + name. Every other user surface (feed entries, members list, check-in row) shows an avatar. The king's `profileImageUrl` was already included in the API response but unused in the banner. The banner felt flat and impersonal compared to the rest of the design system.

**What I changed:**
- Replaced the static `👑` emoji lead with a 9×9 `Avatar` component (ring-2 ring-yellow-400 for gold accent)
- Added a `👑` overlaid as a small absolute-positioned span in the top-right of the avatar
- Falls back to first letter of username on no profileImageUrl
- Kept consistent with existing Avatar usage in the page (same component, same fallback pattern)

**Test results:** 493/493 passed
**Verdict:** Crown Banner now shows the king's face — consistent with the rest of the UI.

---

## Iteration 6 — Show "days remaining" in Crown Banner

**Date:** 2026-03-10
**What I analyzed:** The spec explicitly lists "days remaining" as a required element of the Crown Banner. The current implementation showed `· ends Mar 10` (a fixed date string). While correct, it requires mental arithmetic from the user. "3d left" is immediately actionable — it creates urgency to compete.

**What I changed:**
- Replaced the static `ends ${date}` suffix in the Crown Banner subtitle with a computed `· Xd left` / `· ends today`
- Uses `Math.ceil(msLeft / 86400000)` so a period ending tomorrow evening shows "1d left" not "0d left"
- Falls back to "ends today" when ≤0 days remain

**Test results:** 493/493 passed
**Verdict:** Crown Banner now matches the spec — shows log count, streak weeks, and days remaining.

---

## Iteration 7 — Edge case tests: 1-person group, boundary exclusion, tiebreaker

**Date:** 2026-03-10
**What I analyzed:** Three untested scenarios that could cause incorrect crown assignments in production:
1. **1-person group** — a solo member who logs should be crowned (the cron's `if (logCounts.length === 0)` guard only skips zero-log groups, not solo-member groups)
2. **Period boundary exclusion** — logs exactly at `periodEnd` should NOT count (the DB query uses `lt`, but this was only implicitly tested)
3. **Tiebreaker (earliest first log)** — when two users have identical log counts and streak lengths, the one who logged first that period should win

**What I changed:**
- Added 3 tests to the `POST /api/internal/crown-transfer` describe block:
  1. `crowns the sole member of a 1-person group if they have logs` — verifies a solo user with 1 log gets crowned
  2. `does not include logs that fall exactly on periodEnd (exclusive boundary)` — verifies `logCounts.length === 0` when the only log is at the boundary
  3. `tiebreaker uses earliest first log when streaks are equal` — verifies `firstLogAt` sort direction with matching log counts

**Test results:** 496/496 passed (+3 new tests)
**Verdict:** Crown transfer tiebreaker and boundary logic verified against all three edge cases.

---
