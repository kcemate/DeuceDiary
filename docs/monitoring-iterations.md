# Monitoring & Observability Iterations

> Casey (QA) — 2026-03-14 — 7 clicks

---

## Click 1 — Structured JSON request logging middleware
**Gap:** Morgan's "short" format is human-readable but not machine-parseable. Log aggregators (Datadog, Loki, Railway) need structured JSON.

**Fix:** Added `server/lib/structuredLogger.ts` — an Express middleware that emits one JSON line per API request on response finish. Fields: `ts`, `method`, `path`, `status`, `durationMs`, `requestId`, `userId`, `ip`, `userAgent`, `contentLength`.

**Commit:** `b4bb1f26 feat(monitoring): add structured JSON request logging middleware`

**Tests:** 651/651 ✓

---

## Click 2 — DB version in health check response
**Gap:** `/api/health` confirmed DB connectivity via `SELECT 1` but didn't surface the Postgres server version. Ops teams use this to verify migration targets and catch version skew after upgrades.

**Fix:** Changed `SELECT 1` to `SELECT version()` in the health handler. Added `dbVersion` field (e.g. `"PostgreSQL 16.2"`) to the 200 response. Used safe optional chaining on `rows?.[0]?.version` to tolerate test mocks that return `{}`.

**Commit:** `60652dae feat(monitoring): include DB version string in /api/health response`

**Tests:** 651/651 ✓

---

## Click 3 — Error tracking enrichment (user agent + IP)
**Gap:** `ErrorEntry` captured method, path, status, message, stack, and userId — but not the client's IP address, user-agent, or request ID. These are essential for correlating errors with request traces and identifying bad actors.

**Fix:** Extended `ErrorEntry` interface with `ip`, `userAgent`, and `requestId`. Populated them in `errorTrackingMiddleware` using `x-forwarded-for` → socket address fallback for IP.

**Commit:** `5109afc8 feat(monitoring): enrich error log entries with IP, user-agent, and request ID`

**Tests:** 651/651 ✓

---

## Click 4 — Slow query detection via pool instrumentation
**Gap:** `perfBaseline.ts` logged slow HTTP requests (>500ms) but had no visibility into individual DB query latency. A fast endpoint could mask a slow query that happens to be within threshold.

**Fix:** Wrapped `pool.query` in `server/db.ts` with a timing shim. Queries exceeding 200ms emit a `[SLOW QUERY] Nms — <first 120 chars of SQL>` warning to stderr. The SQL is truncated to avoid leaking full parameterised queries.

**Commit:** `3ccf63e2 feat(monitoring): instrument pool.query to detect and log slow queries (>200ms)`

**Tests:** 651/651 ✓

---

## Click 5 — API metrics counters (request count, error rate, p95 latency)
**Gap:** `perfBaseline.ts` tracked a rolling average response time but no per-status counts, no error rate, no p95, and no per-route breakdown.

**Fix:** Created `server/lib/metrics.ts` with:
- Status bucket counters (2xx / 3xx / 4xx / 5xx)
- Rolling 2000-entry latency window for p95 computation
- Per-route hit counts (top-10 exposed, max 200 tracked to bound memory)
- `metricsMiddleware` wired into `index.ts`
- `GET /api/internal/metrics` endpoint (requires `X-Internal-Key`)

**Commit:** `44596ef4 feat(monitoring): add API metrics module with request counts, error rate, and p95 latency`

**Tests:** 651/651 ✓

---

## Click 6 — WebSocket connection monitoring
**Gap:** WebSocket connect/disconnect were logged with bare `console.log` strings. No counters, no structured output, no way to query active connection count or historical totals.

**Fix:** Created `server/lib/wsMonitor.ts` with counters for `activeConnections`, `totalConnects`, `totalDisconnects`, `totalAuthRejections`, and `peakConcurrent`. Each connect/disconnect emits a structured JSON line. Wired into `wss.on('connection')`, `ws.on('close')`, and the Clerk auth rejection catch block. Exposed at `GET /api/internal/ws-stats` (requires `X-Internal-Key`).

**Commit:** `a65219b0 feat(monitoring): add WebSocket connection monitor with connect/disconnect counters and /api/internal/ws-stats endpoint`

**Tests:** 651/651 ✓

---

## Click 7 — Startup diagnostics logging
**Gap:** Server startup logged only `serving on port X`. No visibility into runtime configuration, which env vars were present, Node.js version, memory footprint at boot, or DB version at startup time.

**Fix:** In `server/index.ts`, the `server.listen` callback now emits a structured JSON `startup` event containing: ISO timestamp, `nodeVersion`, `env`, `port`, memory snapshot (rss/heapUsed/heapTotal), list of env var names that are present (values never logged), and `dbVersion` from a live `SELECT version()` call (graceful fallback to `"unavailable"`).

**Commit:** `bee6c25c feat(monitoring): emit structured startup diagnostics (node version, env vars, memory, DB version)`

**Tests:** 651/651 ✓
