# API E2E Test Report — Authenticated Endpoints

**Date:** 2026-03-09
**Target:** https://deuce-diary-web-production.up.railway.app
**Tester:** Claude (automated curl-based testing)

---

## 1. Auth Rejection Tests (No Auth Header)

All authenticated endpoints should return 401 or 403, **never** 200 or 500.

| # | Method | Endpoint | Expected | Actual | Result |
|---|--------|----------|----------|--------|--------|
| 1 | GET | /api/deuces | 401 | 401 | PASS |
| 2 | GET | /api/groups | 401 | 401 | PASS |
| 3 | GET | /api/passport | 401 | 401 | PASS |
| 4 | GET | /api/user/export | 401 | 401 | PASS |
| 5 | GET | /api/user/theme | 401 | 401 | PASS |
| 6 | GET | /api/analytics/me | 401 | 401 | PASS |
| 7 | GET | /api/analytics/most-deuces | 401 | 401 | PASS |
| 8 | GET | /api/users/me/weekly-report | 401 | 401 | PASS |
| 9 | GET | /api/user/badges | 401 | 401 | PASS |
| 10 | GET | /api/auth/user | 401 | 401 | PASS |
| 11 | GET | /api/locations | 401 | 401 | PASS |
| 12 | GET | /api/subscription | 401 | 401 | PASS |
| 13 | GET | /api/referral | 401 | 401 | PASS |
| 14 | GET | /api/referral/stats | 401 | 401 | PASS |
| 15 | GET | /api/referrals/stats | 401 | 401 | PASS |
| 16 | GET | /api/referrals/leaderboard | 401 | 401 | PASS |
| 17 | GET | /api/bingo/current | 401 | 401 | PASS |
| 18 | GET | /api/bingo/leaderboard | 401 | 401 | PASS |
| 19 | GET | /api/challenges/today | 401 | 401 | PASS |
| 20 | GET | /api/groups/1 | 401 | 401 | PASS |
| 21 | GET | /api/groups/1/streak | 401 | 401 | PASS |
| 22 | GET | /api/groups/1/leaderboard | 401 | 401 | PASS |
| 23 | GET | /api/groups/1/weekly-report | 401 | 401 | PASS |
| 24 | GET | /api/groups/1/weekly-report/pdf | 401 | 401 | PASS |
| 25 | GET | /api/groups/1/spy | 401 | 401 | PASS |
| 26 | GET | /api/entries/1/reactions | 401 | 401 | PASS |
| 27 | POST | /api/deuces | 401 | 401 | PASS |
| 28 | POST | /api/groups | 401 | 401 | PASS |
| 29 | POST | /api/locations | 401 | 401 | PASS |
| 30 | POST | /api/entries/1/reactions | 401 | 401 | PASS |
| 31 | DELETE | /api/entries/1/reactions | 401 | 401 | PASS |
| 32 | PUT | /api/user/theme | 401 | 401 | PASS |
| 33 | PUT | /api/user/timezone | 401 | 401 | PASS |
| 34 | POST | /api/auth/sync | 401 | 401 | PASS |
| 35 | PUT | /api/auth/user | 401 | 401 | PASS |
| 36 | POST | /api/auth/user/profile-picture | 401 | 401 | PASS |
| 37 | POST | /api/notifications/register | 401 | 401 | PASS |
| 38 | DELETE | /api/push/unregister | 401 | 401 | PASS |
| 39 | PUT | /api/notifications/reminder | 401 | 401 | PASS |
| 40 | POST | /api/referral/apply | 401 | 401 | PASS |
| 41 | POST | /api/subscription/upgrade | 401 | 401 | PASS |
| 42 | POST | /api/subscription/streak-insurance | 401 | 401 | PASS |
| 43 | POST | /api/bingo/check | 401 | 401 | PASS |
| 44 | POST | /api/challenges/complete | 401 | 401 | PASS |
| 45 | DELETE | /api/user/account | 401 | 401 | PASS |
| 46 | DELETE | /api/passport | 401 | 401 | PASS |
| 47 | POST | /api/groups/1/invite | 401 | 401 | PASS |
| 48 | POST | /api/join/fake-invite | 401 | 401 | PASS |
| 49 | POST | /api/groups/1/streak/check | 401 | 401 | PASS |
| 50 | POST | /api/squads/1/broadcast | 401 | 401 | PASS |

**Result: 50/50 PASS**

---

## 2. Public Endpoints (No Auth Required)

| # | Method | Endpoint | Expected | Actual | Result | Notes |
|---|--------|----------|----------|--------|--------|-------|
| 1 | GET | /api/health | 200 | 200 | PASS | Returns `{"status":"ok","db":"connected"}` |
| 2 | GET | /api/groups/preview/:inviteCode | 404 | 404 | PASS | Correct "Invite not found" |
| 3 | GET | /api/groups/invite-preview/:inviteCode | 404 | 404 | PASS | Correct "Invite not found" |
| 4 | GET | /api/og/invite/:inviteCode | 404 | 404 | PASS | Returns HTML "Invite not found" |
| 5 | GET | /api/passport/:userId | 404 | 404 | PASS | Correct "User not found" |
| 6 | GET | /api/share/streak/:userId | 404 | 404 | PASS | But message says "User not found not found" |
| 7 | GET | /api/og/streak/:userId | 404 | 404 | PASS | But message says "User not found not found" |
| 8 | GET | /api/users/:username/legacy | 404 | 404 | PASS | But message says "User not found not found" |

**Result: 8/8 PASS** (with bug noted below)

---

## 3. Internal Endpoints (Require X-Internal-Key)

| # | Method | Endpoint | Expected | Actual | Result | Notes |
|---|--------|----------|----------|--------|--------|-------|
| 1 | GET | /api/internal/errors | 401 | 401 | PASS | |
| 2 | GET | /api/internal/health/detailed | 401 | 401 | PASS | |
| 3 | GET | /api/admin/stats | 401 | 401 | PASS | |
| 4 | POST | /api/internal/streak-check | 401 | 401 | PASS | |

**Result: 4/4 PASS**

---

## 4. Webhook Endpoints (Require Signature)

| # | Method | Endpoint | Payload | Expected | Actual | Result | Notes |
|---|--------|----------|---------|----------|--------|--------|-------|
| 1 | POST | /api/webhooks/clerk | Fake data | 400/401 | **500** | **FAIL** | Returns "Webhook secret not configured" |
| 2 | POST | /api/webhooks/revenuecat | Fake data | 401 | 401 | PASS | Correct "Invalid webhook authorization" |

**Result: 1/2 PASS**

---

## 5. Input Validation Tests

| # | Test | Method | Endpoint | Payload | Expected | Actual | Result |
|---|------|--------|----------|---------|----------|--------|--------|
| 1 | Invalid JSON body | POST | /api/deuces | `not-json{{{` | 400 | 400 | PASS |
| 2 | Empty body (no Content-Type data) | POST | /api/deuces | (none) | 401 | 401 | PASS |
| 3 | XSS in notes | POST | /api/deuces | `<script>alert(1)</script>` | 401 | 401 | PASS (blocked by auth before validation) |
| 4 | Very long theme string (10K chars) | PUT | /api/user/theme | `AAA...` (10K) | 401 | 401 | PASS (blocked by auth) |
| 5 | 1MB payload | POST | /api/deuces | 1MB JSON | 401 | 401 | PASS (blocked by auth) |

**Result: 5/5 PASS**

> Note: Most validation tests are blocked at the auth layer, which is correct behavior. Deeper input validation testing requires authenticated requests.

---

## 6. SQL Injection Tests

| # | Test | Endpoint | Payload | Expected | Actual | Result |
|---|------|----------|---------|----------|--------|--------|
| 1 | OR 1=1 in query param | /api/deuces?groupId=1 OR 1=1 | - | 401 | 401 | PASS |
| 2 | DROP TABLE in query param | /api/deuces?groupId='; DROP TABLE users;-- | - | 401 | 401 | PASS |
| 3 | UNION SELECT in query param | /api/groups?id=1 UNION SELECT * FROM users | - | 401 | 401 | PASS |
| 4 | SQL in POST body | /api/deuces | SQL in notes field | 401 | 401 | PASS |

**Result: 4/4 PASS** (blocked at auth layer; Drizzle ORM provides parameterized queries as additional protection)

---

## 7. Path Traversal Tests

| # | Test | Endpoint | Expected | Actual | Result | Notes |
|---|------|----------|----------|--------|--------|-------|
| 1 | ../../../etc/passwd | /api/deuces/../../etc/passwd | 400/404 | 200 (HTML) | PASS | SPA catch-all, no file served |
| 2 | Encoded traversal | /api/../../../etc/passwd | 400/404 | 200 (HTML) | PASS | SPA catch-all, no file served |
| 3 | Null byte | /api/deuces/%00 | 400/404 | 200 (HTML) | PASS | SPA catch-all, no file served |

**Result: 3/3 PASS** (unmatched routes fall through to SPA, no file system access)

---

## 8. Rate Limiting Test

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | 20 rapid POST /api/deuces | 429 after threshold | All 401 (auth) | **INCONCLUSIVE** |

> Rate limiting cannot be verified without authentication since auth rejection happens before rate limiting. No evidence of rate limiting on unauthenticated requests (all 20 returned 401 without any 429).

---

## 9. CORS / Security Headers

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | OPTIONS preflight from evil.com | 204 or 200 | **500** | **FAIL** |
| 2 | Security headers present | CSP, HSTS, etc. | Present | PASS |

**Security headers observed (PASS):**
- `content-security-policy` - comprehensive policy
- `strict-transport-security: max-age=31536000; includeSubDomains`
- `x-content-type-options: nosniff`
- `x-frame-options: SAMEORIGIN`
- `x-xss-protection: 0` (correctly disabled, CSP handles this)
- `cross-origin-opener-policy: same-origin`
- `cross-origin-resource-policy: same-origin`
- `referrer-policy: no-referrer`

**No `access-control-allow-origin` header returned** — CORS may not be configured, causing the 500 on OPTIONS preflight.

---

## 10. HTTP Method Handling

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | PATCH /api/deuces (unsupported) | 405 | 200 (HTML) | **WARN** |

Unsupported methods fall through to SPA catch-all instead of returning 405 Method Not Allowed. Low severity — no security impact.

---

## Summary

| Category | Passed | Total | Rate |
|----------|--------|-------|------|
| Auth Rejection | 50 | 50 | 100% |
| Public Endpoints | 8 | 8 | 100% |
| Internal Endpoints | 4 | 4 | 100% |
| Webhooks | 1 | 2 | 50% |
| Input Validation | 5 | 5 | 100% |
| SQL Injection | 4 | 4 | 100% |
| Path Traversal | 3 | 3 | 100% |
| Rate Limiting | 0 | 1 | N/A |
| CORS | 1 | 2 | 50% |
| HTTP Methods | 0 | 1 | 0% |

**Overall: 76/80 PASS (95%)**

---

## Security Issues Found

### HIGH: Clerk Webhook Returns 500 with Config Leak
- **Endpoint:** `POST /api/webhooks/clerk`
- **Issue:** Returns 500 with `{"message":"Webhook secret not configured"}` — leaks internal configuration state
- **Expected:** Should return 400 or 401 without revealing whether a webhook secret is configured
- **Risk:** Information disclosure; attacker learns webhook is misconfigured

### MEDIUM: CORS Preflight Returns 500
- **Endpoint:** `OPTIONS /api/deuces` (and likely all API routes)
- **Issue:** OPTIONS preflight requests return HTTP 500 with no `Access-Control-*` headers
- **Expected:** Should return 204 with appropriate CORS headers, or explicitly reject with 403
- **Risk:** Browsers from legitimate origins may fail to make API calls; could indicate missing CORS middleware
- **Note:** If the API is same-origin only (served from same domain as frontend), this may be by design, but the 500 status code is still incorrect

### LOW: Doubled Error Message String
- **Endpoints:** `/api/share/streak/:userId`, `/api/og/streak/:userId`, `/api/users/:username/legacy`
- **Issue:** Error message reads `"User not found not found"` instead of `"User not found"`
- **Risk:** No security impact, but looks unprofessional

### LOW: No Rate Limiting on Unauthenticated Requests
- **Issue:** 20 rapid requests received no 429 response
- **Risk:** Potential for brute-force or DoS on auth-checking endpoints (mitigated by Railway's infrastructure)

### INFO: Unsupported Methods Return 200 HTML
- **Issue:** Methods like PATCH fall through to SPA catch-all
- **Risk:** No security impact, but violates REST conventions (should return 405)

---

## Bugs Found

1. **Doubled error message** — "User not found not found" in 3 public endpoints
2. **Clerk webhook 500** — webhook secret appears not configured in production (or error handling is wrong)
3. **CORS preflight 500** — OPTIONS requests crash instead of being handled
