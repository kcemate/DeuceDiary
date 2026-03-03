# QA Report — Jordan Backend Batch

**QA Engineer:** Casey
**Date:** 2026-03-03
**Scope:** Last 4 commits by Jordan (launch playbook, API docs, error tracking, perf baseline)

---

## 1. Test Suite

**Result: PASS**

- 13 test suites, 343 tests — all passing
- Runtime: ~1.5s
- No regressions introduced by any of the 4 commits

---

## 2. New API Endpoints

### GET /api/internal/errors

**Result: PASS**

| Check | Result |
|-------|--------|
| Returns valid JSON | `{ "errors": [...], "count": N }` |
| Auth required (X-Internal-Key) | 401 without key, 401 with wrong key |
| Limit parameter works | `?limit=10` respected, capped at 200 |
| Captures errors | Malformed JSON body → error captured with timestamp, method, path, statusCode, message |
| Stack trace logic | `stack` is null for <500 errors (correct — only 500+ get stack) |
| Disk log written | `server/logs/errors.log` confirmed with matching JSON line |

### GET /api/internal/health/detailed

**Result: PASS**

| Check | Result |
|-------|--------|
| Returns valid JSON | Full payload with status, timestamp, uptime, db, memory, avgResponseTimeMs |
| Auth required | 401 without key |
| DB pool stats | `poolTotal: 1, poolIdle: 1, poolWaiting: 0` (correct for dev) |
| Memory stats | Human-readable MB format |
| Avg response time | Tracked across rolling window of 1000 requests |
| Degraded fallback (503) | Code path exists for DB connection failure |

---

## 3. Error Tracking Smoke Test

**Result: PASS**

- Triggered a body parser error (malformed JSON) against `POST /api/deuces`
- Error appeared in both in-memory buffer (via `/api/internal/errors`) and disk log (`server/logs/errors.log`)
- Fields captured: timestamp, method, path, statusCode, message, stack (null for <500), userId

### Log Rotation Code Review

**Result: PASS**

- Rotation triggers at 5 MB per file
- Keeps max 5 files: `errors.log` → `errors.1.log` → ... → `errors.4.log`
- Oldest file (`errors.4.log`) deleted on overflow before shifting
- Uses sync fs operations (acceptable — only runs at 5MB threshold, involves fast renames)
- Log directory auto-created if missing

### Note: Error Tracking Coverage Gap

Route-level try/catch blocks handle most errors with direct `res.status().json()` responses — these do NOT flow through the error tracking middleware. Only errors propagated via `next(err)` (body parser errors, multer errors, unhandled exceptions) get captured. This means many 500 errors from route handlers are logged to console but not to the error tracker.

**Recommendation:** Consider adding a `recordError()` call inside route-level catch blocks, or refactor to pass errors via `next(err)` instead of handling inline. Not blocking for launch — Sentry covers the gap.

---

## 4. docs/LAUNCH_PLAYBOOK.md Review

**Result: PASS (with recommendations)**

### Coverage Check

| Channel | Covered? | Notes |
|---------|----------|-------|
| Reddit | YES | r/InternetIsBeautiful, r/SideProject, r/QuantifiedSelf, r/digitalnomad |
| Hacker News | YES | Show HN section with tech angle |
| Product Hunt | YES | Detailed tagline, description, maker comment |
| Twitter/X | YES | 3-tweet launch thread |
| TikTok | YES | 2 video concepts |

### Success Metrics Assessment

| Metric | Target | Realistic? |
|--------|--------|------------|
| 500 signups (Week 1) | Achievable with Reddit + PH | YES |
| 100 DAU | Depends on activation rate | STRETCH |
| 5% premium conversion (Week 1) | Most apps see 1-3% initially | AGGRESSIVE |
| 40% 7-day streak retention | Group accountability helps, but ambitious | STRETCH |
| $150 revenue (Week 1) | Requires ~50 premium subscribers | DEPENDS on conversion |

### Gaps Identified

1. **No competitive response plan.** What if Poop Map ships a streaks feature? What if a copycat launches within 48 hours of going viral? Add a section on competitive moats (group dynamics, social graph, streak history) and response playbook.

2. **No refund policy.** RevenueCat handles App Store/Play Store refunds automatically, but there's no documented policy for direct customer requests. Add a note: "Refunds handled via App Store/Play Store. No custom refund flow needed for web launch."

3. **No press kit checklist.** Marketing assets section mentions OG image and PH screenshots but lacks a full press kit: logo files (SVG/PNG, light/dark), brand colors, founder bio/headshot, product screenshots at standard sizes (1200x630 OG, 1080x1920 story), boilerplate press copy.

4. **No rollback plan for bad deploys.** The contingency section covers Railway being down but not "we shipped a bug to prod." Add: "Rollback: `git revert HEAD && git push` or redeploy previous commit hash in Railway dashboard."

---

## 5. docs/API.md Review

**Result: PASS (3 issues found and fixed)**

### Spot-Check (10 endpoints)

All 10 endpoints verified against `server/routes.ts`:

| Endpoint | Method | Path | Auth | Schema | Errors | Verdict |
|----------|--------|------|------|--------|--------|---------|
| Health | GET | /api/health | None | — | — | MATCH |
| Log deuce | POST | /api/deuces | Required | groupIds, location, thoughts, loggedAt, ghost | 400, 403, 429 | MATCH |
| Create group | POST | /api/groups | Required | name (1-100), description (max 500) | 400, 403 | MATCH |
| Add reaction | POST | /api/entries/:id/reactions | Required | emoji (1-10) | 400, 403, 404 | MATCH |
| Set theme | PUT | /api/user/theme | Premium | theme enum | 400 | MATCH |
| Apply referral | POST | /api/referral/apply | Required | code (1-20) | 400 | MATCH |
| Streak insurance | POST | /api/subscription/streak-insurance | Premium | — | 400 | PARTIAL (see fix below) |
| Broadcast | POST | /api/squads/:id/broadcast | Premium | milestone (1-200) | — | MATCH |
| Set reminder | PUT | /api/notifications/reminder | Premium | hour (0-23), minute (0-59) | — | MATCH |
| Public profile | GET | /api/users/:username/legacy | None | — | 404 | MATCH |

### Issues Found and Fixed

1. **`POST /api/auth/logout` was undocumented.** Dev-only endpoint that destroys session and returns `{ok: true}`. Added to Authentication section.

2. **`POST /api/login` missing `inviteCode` field.** The Zod schema accepts an optional `inviteCode` that triggers auto-group-join on login. Added to Authentication section.

3. **Streak insurance response incomplete.** Docs only showed the `"Streak preserved!"` message but the code also returns `"Insurance activated (no at-risk streaks found)"` when `extended` is false. Added note to endpoint docs.

### Undocumented Routes (non-blocking)

- `GET /join` — referral redirect (server-side, not a REST endpoint)
- `GET /join/:inviteId` — invite redirect to client-side `/invite/:code` page

These are server-side redirects, not API endpoints. No fix needed in API.md.

### No Phantom Endpoints

All endpoints documented in API.md have matching route handlers in `routes.ts`. No ghost docs.

---

## 6. Performance Baseline Code Review

**Result: PASS**

| Check | Result |
|-------|--------|
| Response time middleware | Uses `process.hrtime.bigint()` for nanosecond precision |
| Rolling window | Last 1000 API requests tracked |
| Slow request logging | >500ms threshold, logged via `log()` utility |
| Only tracks /api routes | Non-API routes (static files, etc.) excluded |
| Average calculation | Correct: sum / count, rounded to 2 decimals |
| Memory formatting | `formatBytes()` converts to human-readable MB |
| DB pool stats | Reads `pool.totalCount`, `pool.idleCount`, `pool.waitingCount` from pg Pool |

---

## Summary

| Check | Result | Issues |
|-------|--------|--------|
| Test suite (343 tests) | PASS | 0 |
| GET /api/internal/errors | PASS | 0 |
| GET /api/internal/health/detailed | PASS | 0 |
| Error tracking smoke test | PASS | 0 |
| Log rotation logic | PASS | 0 |
| docs/LAUNCH_PLAYBOOK.md | PASS | 4 recommendations (not blocking) |
| docs/API.md | PASS | 3 issues found and fixed |
| Performance baseline | PASS | 0 |

**Overall: PASS — all checks green, 3 doc fixes applied, 4 launch playbook recommendations noted.**
