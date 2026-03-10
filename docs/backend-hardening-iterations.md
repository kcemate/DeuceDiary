# Backend Hardening — Autoresearch Iterations

> Date: 2026-03-10 | Branch: main | Tests: 466 passing throughout

---

## Iteration 1 — Rate Limiting: Group Creation, Reactions, Referral Apply
**Commit:** `7373066d`

**Problem:** Three endpoint families had no dedicated rate limits, relying only on the global 100 req/min limiter:
- `POST /api/groups` — unlimited squad creation per IP
- `POST /api/entries/:id/reactions` — unlimited emoji spam
- `POST /api/referral/apply` — brute-force referral code guessing possible

**Fix:** Added three `express-rate-limit` middleware blocks in `server/index.ts`:
- `/api/groups`: 10 req/min — prevents spam squad creation
- `/api/entries`: 60 req/min — blocks emoji reaction flooding
- `/api/referral/apply`: 10 req/hour — stops code brute-forcing

All limits set to 10,000 in test mode to avoid affecting test suite.

**Files:** `server/index.ts`

---

## Iteration 2 — Fix Missing try-catch in Redirect + Error Log Endpoints
**Commit:** `24efc577`

**Problem:**
1. `GET /join/:inviteId` in `groups.ts` was declared `async` but had no `await` and no try-catch — the `async` keyword was superfluous and any unexpected error would be unhandled.
2. `GET /api/internal/errors` in `internal.ts` had no try-catch wrapping `getRecentErrors()`. Also, `Number(req.query.limit)` was not guarded against `NaN` or negative values.

**Fix:**
- Removed unnecessary `async` keyword from `/join/:inviteId`.
- Wrapped `/api/internal/errors` body in try-catch.
- Hardened limit param: `Number.isFinite(rawLimit) && rawLimit > 0` before `Math.min(rawLimit, 200)`.

**Files:** `server/routes/groups.ts`, `server/routes/internal.ts`

---

## Iteration 3 — Unicode-Aware Emoji Validation on Reaction Schemas
**Commit:** `b2435a86`

**Problem:** `reactionSchema` and `deleteReactionSchema` validated `emoji` as `z.string().min(1).max(10)` — accepting any 1-10 char string including `<script>`, HTML attributes, or arbitrary Unicode that isn't an emoji.

**Fix:** Added `EMOJI_RE` regex using the `Extended_Pictographic` Unicode property plus modifier codepoints:
```ts
const EMOJI_RE = /^[\p{Extended_Pictographic}\u200D\uFE0F\u20E3\u{1F3FB}-\u{1F3FF}]+$/u;
```
Covers: base emoji, ZWJ sequences (👨‍👩‍👧), variation selectors, skin tone modifiers, keycap sequences. Rejects all ASCII text, HTML, and non-emoji Unicode.

**Files:** `server/routes/helpers.ts`

---

## Iteration 4 — Zod Path Param Validation on All Public Routes
**Commit:** `bb1d3cf6`

**Problem:** Five public endpoints accepted raw, unvalidated path parameters from `req.params` and passed them directly to DB queries:
- `/api/share/streak/:userId` — any string as userId
- `/api/og/streak/:userId` — any string as userId
- `/api/share/group-report/:groupId` — any string as groupId
- `/api/og/group-report/:groupId` — any string as groupId
- `/api/users/:username/legacy` — any string as username

**Fix:** Added three param schemas to `helpers.ts`:
- `userIdParamSchema`: `[\w.\-]+` max 128 (covers Clerk IDs and UUIDs)
- `groupIdParamSchema`: UUID v4 format
- `usernameParamSchema`: `[\w\-]+` max 50

Each endpoint now runs `.safeParse(req.params)` and returns 400 before any DB query for invalid params.

**Files:** `server/routes/helpers.ts`, `server/routes/public.ts`

---

## Iteration 5 — Health Check: DB Latency + Memory Usage
**Commit:** `8d4e0c90`

**Problem:** `GET /api/health` returned `{ status, timestamp, uptime, db }` but no observable metrics — DB latency and memory usage required the authenticated `/api/internal/health/detailed` endpoint.

**Fix:** Updated `GET /api/health` to also return:
- `dbLatencyMs`: round-trip time for `SELECT 1` — useful for detecting cold starts and connection pool issues
- `memory.heapUsedMb / heapTotalMb / rssMb`: current Node.js process memory
- `uptime`: now rounded to nearest second (was fractional float)

Degraded path also returns `dbLatencyMs` (elapsed time before failure).

**Files:** `server/routes/internal.ts`

---

## Iteration 6 — RevenueCat Webhook Payload Zod Schema
**Commit:** `d247ec6a`

**Problem:** RevenueCat webhook validated `req.body` with loose duck-typing: `if (!event?.type || !event?.app_user_id)`. This accepted any object with those fields, with no type constraints on values.

**Fix:** Replaced duck-typing with a formal Zod schema:
```ts
const revenueCatEventSchema = z.object({
  event: z.object({
    type: z.string().min(1).max(100),
    app_user_id: z.string().min(1).max(256),
    expiration_at_ms: z.number().int().positive().optional().nullable(),
  }),
});
```
Invalid payloads return 400 with a warning log that includes the flattened Zod error (without leaking details to the response). Also added the full list of known RC event type constants as reference.

**Files:** `server/routes/webhooks/revenuecat.ts`

---

## Iteration 7 — Auto-Inject requestId into All Error Responses
**Commit:** `3a6c80ae`

**Problem:** Route-level `catch` blocks returned `{ message: "..." }` without `requestId`. The global error handler (index.ts) included `requestId`, but only for unhandled errors that flowed via `next(err)`. The 40+ individual route catch blocks didn't include it.

**Fix:** Added a `res.json()` interceptor middleware in `server/index.ts` (after the Request ID middleware, before body parsers):
```ts
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode >= 400 && body && typeof body === 'object' && !body.requestId) {
      const rid = req.headers['x-request-id'] as string | undefined;
      if (rid) (body as Record<string, unknown>).requestId = rid;
    }
    return originalJson(body);
  };
  next();
});
```
All 40+ error paths now include `requestId` for free — no need to thread `req` through every catch block. Existing responses that already set `requestId` are not double-stamped (guarded by `!body.requestId`).

**Files:** `server/index.ts`

---

## Summary

| # | Area | Change | Impact |
|---|------|--------|--------|
| 1 | Rate Limiting | Group/reaction/referral limiters | Abuse prevention |
| 2 | Error Handling | try-catch on redirect + error-log endpoints | Crash safety |
| 3 | Input Validation | Unicode emoji regex on reaction fields | XSS/injection prevention |
| 4 | Input Validation | Zod path params on 5 public endpoints | DB query safety |
| 5 | Observability | DB latency + memory in /api/health | Monitoring readiness |
| 6 | Input Validation | Zod schema for RevenueCat webhook body | Webhook robustness |
| 7 | Observability | Auto requestId in all error responses | End-to-end tracing |

Tests: **466 passing** throughout all iterations.
