# QA Report: Referral System

**Date:** 2026-03-03
**QA Engineer:** Casey
**Commits under test:**
- `d9482ca` feat: referral dashboard — share card, stats grid, leaderboard, incentive banner
- `77bc7de` feat: referral tracking — converted_to_premium_at column, dashboard stats + leaderboard API

---

## 1. Test Suite

| Check | Result |
|-------|--------|
| `npm test` — all 345 tests pass | PASS |
| 13 test suites, 0 failures | PASS |
| Referral-specific tests (13 tests in referral.test.ts) | PASS |

---

## 2. DB Migration (`scripts/db-migrate.ts`)

| Check | Result |
|-------|--------|
| Referrals table created with `CREATE TABLE IF NOT EXISTS` | PASS |
| `converted_to_premium_at` column added via `ADD COLUMN IF NOT EXISTS` | PASS |
| Users table: `referral_code`, `referred_by`, `referral_count` columns present | PASS |
| Unique partial index on `referral_code` (non-null only) | PASS |
| Idempotent — safe to run twice (IF NOT EXISTS + error code handling) | PASS |

### Bug found and fixed

**BUG:** Column name mismatch — migration used `referred_id`, Drizzle schema expects `referee_id`.
This would cause runtime SQL errors on any production database created via the migration script.

**Fix applied:**
1. Changed `CREATE TABLE` to use `referee_id` (matches schema)
2. Added rename migration `referred_id -> referee_id` for DBs that already ran the old migration
3. Added error code `42703` (column does not exist) to the safe-skip list in the migration runner
4. Removed dead `converted` boolean column from CREATE TABLE (not in Drizzle schema)

---

## 3. API Endpoints

### GET /api/referrals/stats

| Check | Result |
|-------|--------|
| Returns valid JSON | PASS |
| Response includes `totalReferrals` (number) | PASS |
| Response includes `premiumConversions` (number) | PASS |
| Response includes `pendingConversions` (number) | PASS |
| `pendingConversions = totalReferrals - premiumConversions` | PASS |
| Auth required (`isAuthenticated` middleware) | PASS |
| No premium gate (available to free users) | PASS |

### GET /api/referrals/leaderboard

| Check | Result |
|-------|--------|
| Returns JSON array | PASS |
| Each entry has `username`, `profileImageUrl`, `referralCount`, `premiumConversionCount` | PASS |
| Limited to top 10 (`LIMIT 10`) | PASS |
| Ordered by referral count descending | PASS |
| Auth required (`isAuthenticated` middleware) | PASS |

### GET /api/referral (user's own code)

| Check | Result |
|-------|--------|
| Returns `code`, `referralCount`, `referralLink` | PASS |
| `referralLink` includes `/join?ref=` + user's code | PASS |
| Auth required | PASS |

### POST /api/referral/apply

| Check | Result |
|-------|--------|
| Valid code returns `{ ok: true, referrerUsername }` | PASS |
| Self-referral blocked (400) | PASS |
| Double-apply blocked (400 "already used") | PASS |
| Invalid code returns 400 | PASS |
| Zod validation on input (`code: string, min 1, max 20`) | PASS |

### GET /api/referral/stats (premium-gated)

| Check | Result |
|-------|--------|
| Premium users get referral list with joinedAt dates | PASS |
| Free users get 403 "premium required" | PASS |

### GET /join?ref=CODE

| Check | Result |
|-------|--------|
| Redirects to `/` (302) | PASS |
| Stores referral code in session | PASS |

---

## 4. Frontend Review (`client/src/pages/referral.tsx`)

### Share Card

| Check | Result |
|-------|--------|
| Copy Link button calls `navigator.clipboard.writeText()` | PASS |
| Share button uses `navigator.share()` with clipboard fallback | PASS |
| Invite URL correctly built from `referral.referralLink` (from API) | PASS |
| Referral code displayed in mono font with tracking | PASS |

### Stats Grid

| Check | Result |
|-------|--------|
| 3-column grid: Referred, Converted, Pending | PASS |
| Values fallback to 0 via `?? 0` when stats not loaded | PASS |
| Icons (Users, Award, Clock) match each stat semantically | PASS |

### Leaderboard

| Check | Result |
|-------|--------|
| Renders entries with medal emojis for top 3 | PASS |
| Shows profile image or first-letter fallback | PASS |
| Null username renders as "Anonymous" | PASS |
| Empty state shows trophy emoji + "No referrals yet" message | PASS |

### Incentive Banner

| Check | Result |
|-------|--------|
| Text: "Invite friends -> unlock Porcelain Premium for a month when 3 friends join" | PASS |
| TODO comment for backend auto-grant logic present (acknowledged, not blocking) | NOTE |

### Apply Code Section

| Check | Result |
|-------|--------|
| Input uppercases display via CSS (`uppercase` class) | PASS |
| Code trimmed + uppercased before sending to API | PASS |
| Button disabled when input empty or mutation pending | PASS |
| Error toast on failure, success toast on apply | PASS |
| Unauthorized error redirects to login | PASS |

---

## 5. Edge Cases

| Scenario | Result |
|----------|--------|
| User with 0 referrals — share card shows "No friends joined yet — share your code!" | PASS |
| User with 1 referral — correct singular "1 friend joined" | PASS |
| User with 2+ referrals — correct plural "N friends joined" | PASS |
| Empty leaderboard — shows trophy emoji empty state | PASS |
| Stats with 0 values — grid renders 0s cleanly via `?? 0` | PASS |
| Loading state — spinner shown while referral data loads | PASS |

---

## 6. Summary

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| Test Suite | 345/345 | 0 | All green |
| DB Migration | 5/5 | 0 | 1 bug found + fixed (column name mismatch) |
| API Endpoints | 17/17 | 0 | All endpoints properly auth-gated |
| Frontend | 14/14 | 0 | Clean implementation |
| Edge Cases | 6/6 | 0 | Graceful degradation confirmed |

### Bugs Found: 1

1. **[FIXED] Migration column name mismatch** — `referred_id` in migration vs `referee_id` in Drizzle schema. Would cause production SQL failures. Fixed in this commit.

### Notes

- Backend auto-grant premium at 3 referrals is a TODO (not a bug — feature not yet implemented)
- The `[analytics]` TypeError in test stderr is pre-existing (analytics `db.insert` not mocked in test stores) — not a referral issue
