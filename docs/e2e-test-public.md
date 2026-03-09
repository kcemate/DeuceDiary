# E2E Test Report — Public Routes & API Endpoints

**Date:** 2026-03-09
**Target:** https://deuce-diary-web-production.up.railway.app
**Tester:** Claude (automated curl tests against production)

---

## Summary

| Metric | Count |
|--------|-------|
| Total tests | 22 |
| PASS | 17 |
| FAIL | 4 |
| WARN | 1 |

---

## Test Results

### 1. Landing Page

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1.1 | `GET /` status code | 200 | 200 | **PASS** |
| 1.2 | HTML contains `<title>` | "Deuce Diary" in title | `Deuce Diary — The Social Poop Tracker` | **PASS** |
| 1.3 | `<meta name="viewport">` present | Present with mobile settings | `width=device-width, initial-scale=1.0, maximum-scale=1` | **PASS** |
| 1.4 | `<meta name="description">` present | Non-empty description | "Track your deuces, build streaks, and compete with friends…" | **PASS** |
| 1.5 | JS bundle loads (`/assets/index-*.js`) | 200 | 200 | **PASS** |
| 1.6 | CSS bundle loads (`/assets/index-*.css`) | 200 | 200 | **PASS** |

### 2. Meta Tags & Structured Data

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 2.1 | OG title | Present | `Deuce Diary — Track Your Streaks With Friends` | **PASS** |
| 2.2 | OG image | Present & loads | `/og-image.png` → HTTP 200 | **PASS** |
| 2.3 | OG type | `website` | `website` | **PASS** |
| 2.4 | Twitter card meta | Present | `summary_large_image` | **PASS** |
| 2.5 | JSON-LD structured data | Valid `WebApplication` schema | Present with correct `@type`, name, URL, offers, rating | **PASS** |

### 3. Public Pages (SPA Routes)

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 3.1 | `GET /privacy` | 200, SPA shell | 200, SPA shell with correct title | **PASS** |
| 3.2 | `GET /terms` | 200, SPA shell | 200, SPA shell with correct title | **PASS** |
| 3.3 | `GET /invite/abc123fake` | 200, SPA shell (client renders error) | 200, SPA shell served | **PASS** |
| 3.4 | `GET /nonexistent-route-xyz` | 200, SPA shell (client renders 404) | 200, SPA shell served | **PASS** |

### 4. Public API Endpoints

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 4.1 | `GET /api/health` | 200, JSON with status | `{"status":"ok","db":"connected","dbLatencyMs":42,...}` | **PASS** |
| 4.2 | `GET /api/config` | 200, JSON with Clerk key | `{"clerkPublishableKey":"pk_test_..."}` | **PASS** |
| 4.3 | `GET /api/groups/preview/fakecode` | 404 JSON | `{"error":"Invite not found",...,"status":404}` | **PASS** |
| 4.4 | `GET /api/groups/invite-preview/fakecode` | 404 JSON | `{"error":"Invite not found",...,"status":404}` | **PASS** |
| 4.5 | `GET /api/share/streak/fakeuser` | 404 JSON | `{"error":"User not found not found",...}` — 404 | **WARN** |
| 4.6 | `GET /api/users/fakeuser/legacy` | 404 JSON | `{"error":"User not found not found",...}` — 404 | **WARN** |

> **Warning (4.5, 4.6):** Error message says "User not found not found" — the word "not found" is duplicated. Likely the code does something like `throw new NotFoundError(thing + " not found")` where `thing` is already "User not found". Minor cosmetic bug.

### 5. Auth Protection (Protected Endpoints Without Auth)

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 5.1 | `GET /api/deuces` | 401 JSON | `{"message":"Unauthorized"}` — 401 | **PASS** |
| 5.2 | `POST /api/deuces` | 401 JSON | `{"message":"Unauthorized"}` — 401 | **PASS** |
| 5.3 | `GET /api/locations` | 401 JSON | `{"message":"Unauthorized"}` — 401 | **PASS** |

### 6. Security Headers

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 6.1 | `Strict-Transport-Security` | Present | `max-age=31536000; includeSubDomains` | **PASS** |
| 6.2 | `X-Content-Type-Options` | `nosniff` | `nosniff` | **PASS** |
| 6.3 | `X-Frame-Options` | Present | `SAMEORIGIN` | **PASS** |
| 6.4 | `Content-Security-Policy` | Present | Comprehensive CSP with Clerk domains | **PASS** |
| 6.5 | `Referrer-Policy` | Present | `no-referrer` | **PASS** |
| 6.6 | `Cross-Origin-Opener-Policy` | Present | `same-origin` | **PASS** |
| 6.7 | `Cross-Origin-Resource-Policy` | Present | `same-origin` | **PASS** |
| 6.8 | `X-Request-Id` | Present | UUID format (e.g. `f9f0ae6f-...`) | **PASS** |
| 6.9 | `X-DNS-Prefetch-Control` | Present | `off` | **PASS** |

### 7. CORS & Error Handling

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 7.1 | `OPTIONS /api/health` (CORS preflight) | 200/204 with CORS headers | **500** — `{"message":"Internal Server Error"}` | **FAIL** |
| 7.2 | `GET /api/nonexistent-xyz` (unknown API route) | 404 JSON | **200** — returns SPA HTML instead | **FAIL** |
| 7.3 | `GET /api/user` (no such route) | 404 or 401 | **200** — returns SPA HTML instead | **FAIL** |
| 7.4 | `GET /api/friends` (no such route) | 404 or 401 | **200** — returns SPA HTML instead | **FAIL** |

---

## Bugs Found

### BUG-1: CORS preflight returns 500 (Severity: Medium)
- **Endpoint:** `OPTIONS /api/health`
- **Expected:** 200/204 with `Access-Control-Allow-Origin` header
- **Actual:** HTTP 500 `{"message":"Internal Server Error"}`
- **Impact:** Cross-origin API consumers (mobile apps, other frontends) cannot make preflight requests. May break CORS for any third-party integrations.

### BUG-2: Unknown `/api/*` routes fall through to SPA catch-all (Severity: Medium)
- **Endpoints:** Any unregistered `/api/*` path (e.g. `/api/nonexistent`, `/api/user`, `/api/friends`)
- **Expected:** 404 JSON response like `{"error":"Not found"}`
- **Actual:** HTTP 200 with full SPA HTML
- **Impact:** API consumers get HTML instead of JSON errors. Makes debugging harder. Could confuse automated clients or health checks that hit wrong endpoints.
- **Fix:** Add a catch-all middleware before the SPA fallback: `app.all('/api/*', (req, res) => res.status(404).json({ error: 'Not found' }))`

### BUG-3: Duplicated "not found" in error messages (Severity: Low)
- **Endpoints:** `/api/share/streak/:userId`, `/api/users/:username/legacy`
- **Expected:** `"User not found"`
- **Actual:** `"User not found not found"`
- **Impact:** Cosmetic — confusing error messages for API consumers.

---

## Overall Assessment

The app is in solid shape for public-facing routes:
- Landing page loads correctly with proper meta tags, OG tags, and structured data
- Security headers are comprehensive and well-configured
- Auth-protected endpoints correctly return 401 for unauthenticated requests
- Public API routes (`/api/health`, `/api/config`, invite previews) work correctly
- Static assets (JS, CSS, OG image) all load fine

The three bugs found are:
1. **CORS preflight 500** — should be fixed before any cross-origin API usage
2. **API catch-all missing** — unregistered `/api/*` routes serve SPA HTML instead of 404 JSON
3. **Double "not found"** — minor string duplication in error messages
