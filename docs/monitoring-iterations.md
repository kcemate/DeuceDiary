# Monitoring & Observability Iterations

Ratchet-style log — 7 clicks, each fixing one gap.
Branch: `main` | Author: Jordan | Date: 2026-03-13

---

## Click 1 — Slow DB Query Logging (100ms threshold)
**Gap:** HTTP request timing existed (500ms) but no per-query DB instrumentation.
**Fix:** `server/lib/slowQueryLogger.ts` — transparent `pool.query` wrapper that times every query and logs any exceeding 100ms to the `[db]` source. Errors are timed too. Query text truncated to 150 chars.
**Wired:** `server/db.ts` calls `instrumentPool(pool)` after pool creation.
**Commit:** `34f706e1`

---

## Click 2 — WebSocket Connection Metrics
**Gap:** No tracking of WS connection counts, authentication failures, or forced disconnects.
**Fix:** `server/lib/wsMetrics.ts` — module with `registerWss()`, `incWsCounter()`, `getWsMetrics()`, and `closeWss()`. Tracks:
- `activeConnections` (real-time from `wss.clients.size`)
- `totalConnections` (lifetime)
- `failedAuthentications` (Clerk token invalid, user not found, no session)
- `gracefulDisconnects` (client-initiated close events)
- `forcedDisconnects` (missed-pong terminations)

**Wired:** `server/routes.ts` — `registerWss(wss)` after WSS creation; `incWsCounter()` at all auth-reject, connect, close, and terminate paths.
**Commit:** `f44d5875`

---

## Click 3 — Startup Diagnostics & Env Var Validation
**Gap:** Server started with no visibility into which env vars were set; misconfiguration discovered at runtime, not boot.
**Fix:** `server/lib/startupDiagnostics.ts` — `runStartupDiagnostics()` logs a formatted table of all 10 known env vars (required/optional, present/absent) and throws on any missing required vars (currently only `DATABASE_URL`) so the process fails fast.
**Wired:** Called as first step in `server/index.ts` IIFE, before migrations.
**Commit:** `84dc5f0c`

---

## Click 4 — Graceful WebSocket Shutdown
**Gap:** SIGTERM handler closed HTTP server and DB pool but left the WebSocket server open, leaving clients in an undefined state during deploys.
**Fix:** Added `closeWss()` call to the shutdown sequence in `server/index.ts` between HTTP server close and DB pool drain. Uses the `wsMetrics` module's reference to `wss` set during `registerWss()`.
**Commit:** `a12640e0`

---

## Click 5 — Structured Request Logging with userId
**Gap:** Custom API logger emitted `METHOD PATH STATUS in Xms [reqId]` but not the authenticated userId, making it hard to correlate logs to a specific user.
**Fix:** `server/index.ts` request logger extracts `req.user.id` in `res.on('finish')` (available after auth middleware runs) and appends `uid=<12-char prefix>` to the log line.
**Commit:** `51af9fe7`

---

## Click 6 — Health Check Includes WebSocket Metrics
**Gap:** `GET /api/health` exposed DB latency and uptime but nothing about WebSocket state, making it incomplete for uptime monitors watching connection health.
**Fix:** `GET /api/health` now includes a `ws` object in the response body (both healthy and degraded paths) with `activeConnections`, `totalConnections`, `failedAuthentications`, `gracefulDisconnects`, `forcedDisconnects`. No auth required.
**Commit:** `3b271467`

---

## Click 7 — Error Tracker User-Agent & Request ID Enrichment
**Gap:** `ErrorEntry` captured userId and stack trace but not the client type (mobile vs web) or the request trace ID, making it hard to reproduce and correlate errors.
**Fix:** Added `userAgent: string | null` and `requestId: string | null` fields to `ErrorEntry` interface and populated them in `errorTrackingMiddleware` from `req.headers["user-agent"]` and `req.headers["x-request-id"]`.
**Commit:** `f15c363e`

---

## Summary

| Click | Area | File(s) Changed |
|-------|------|-----------------|
| 1 | Slow DB query logging | `server/lib/slowQueryLogger.ts`, `server/db.ts` |
| 2 | WebSocket metrics | `server/lib/wsMetrics.ts`, `server/routes.ts` |
| 3 | Startup diagnostics | `server/lib/startupDiagnostics.ts`, `server/index.ts` |
| 4 | Graceful WS shutdown | `server/index.ts` |
| 5 | userId in request logs | `server/index.ts` |
| 6 | WS metrics in health check | `server/routes.ts` |
| 7 | Error tracker enrichment | `server/lib/errorTracker.ts` |

All 651 tests pass after each click.
