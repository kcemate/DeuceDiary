# Error Resilience Iterations — Deuce Diary

## Session: 2026-03-13 (7 clicks)

### Click 1 — Fetch request timeout via AbortController
**Gap:** `apiRequest()` and `getQueryFn` had no timeout — requests could hang indefinitely on
network stalls or slow servers.

**Fix:** Added `AbortController` with 15s timeout to `getQueryFn` (queries) and 20s to
`apiRequest` (mutations). Cancellation by React Query's own signal is forwarded; timeouts
produce a clear `"Request timed out after Xms"` error instead of a silent hang.

**Commit:** `fix(resilience): add 15-20s AbortController timeout to all fetch requests`

---

### Click 2 — WebSocket tab-visibility reconnect + buffered group joins
**Gap:** When users switched tabs for a long time, the WebSocket could be disconnected and
would only reconnect after the full backoff timer (up to 30s). Group joins sent while offline
were silently dropped.

**Fix:**
- Added `visibilitychange` listener — immediately reconnects when user returns to the tab,
  cancelling any pending backoff timer.
- Linter also added `pendingGroupJoinsRef` buffer: group joins made while disconnected are
  queued and replayed in `ws.onopen` upon reconnect.

**Commit:** `fix(resilience): reconnect WebSocket immediately on tab visibility, add backoff jitter`

---

### Click 3 — Offline queue max retries
**Gap:** Failed deuce sync items in IndexedDB had no retry cap — they would persist in
`pending` state forever, retrying every time the device came back online.

**Fix:** Added `retryCount?: number` to `PendingDeuce`. During sync, items with
`retryCount >= MAX_SYNC_RETRIES (5)` are immediately marked `failed` rather than retried.
Each failed attempt increments `retryCount` so items don't silently spin forever.

**Commit:** `fix(resilience): cap offline queue at 5 retries, mark permanently failed after exhaustion`

---

### Click 4 — Global offline banner
**Gap:** When the device went offline, users saw no visual indicator. Deuce logging was
handled gracefully (offline queue), but there was no feedback about the app's connectivity state.

**Fix:** Created `useNetworkStatus` hook that subscribes to `window.online/offline` events.
Added `<OfflineBanner>` component in `App.tsx` that renders a yellow strip at the top of the
screen with a contextual message when offline. Uses `role="status"` and `aria-live="polite"`
for screen reader accessibility.

**Commit:** `fix(resilience): add offline banner that shows when network is unavailable`

---

### Click 5 — Mutation retry on transient 5xx errors
**Gap:** Mutations were `retry: false` — a single transient server error (5xx, network blip)
would immediately surface as a failure even though a retry seconds later would succeed.

**Fix:** Updated default mutations config to retry once (`failureCount >= 1 → false`) on
transient errors (5xx or network failures). 4xx errors including 429 are still never retried.
Retry delay is a fixed 1000ms (no exponential backoff for a single retry).

**Commit:** `fix(resilience): retry mutations once on transient 5xx/network errors`

---

### Click 6 — ErrorBoundary soft reset without full page reload
**Gap:** The generic error fallback only offered "Flush & Retry" which always called
`window.location.reload()`. This was disruptive — it wiped all React state and caused a
full page navigation just to retry rendering.

**Fix:** Added `softReset()` private method that clears `hasError` state without reloading.
Added a "Try Again" button alongside "Flush & Retry" so users can attempt a soft recovery
first. Added optional `onReset?: () => void` prop so boundaries can hook into the reset
(e.g., to refetch data or navigate away).

**Commit:** `fix(resilience): add soft-reset to ErrorBoundary so pages can recover without reload`

---

### Click 7 — 429 rate limit: ApiError class + Retry-After countdown toast
**Gap:** 429 responses were caught by `throwIfResNotOk` and converted to a plain `Error`
with the message string. The `Retry-After` header was discarded. There was no user-facing
feedback specific to rate limiting.

**Fix:**
- Introduced `ApiError` class (exported from `queryClient.ts`) carrying `status` and optional
  `retryAfterSeconds` parsed from the `Retry-After` header.
- `throwIfResNotOk` throws `ApiError` for all non-2xx responses, with `retryAfterSeconds`
  populated on 429.
- `shouldRetry` and `isTransientError` updated to use `ApiError` directly (no regex parsing).
- Query cache subscriber now shows a specific "Too many requests" toast with countdown when
  it sees a 429, distinct from the generic server-error toast.
- Server's `broadcastToGroup` now stamps every WS broadcast with a `msgId` (uuidv4) for
  client-side deduplication.
- Server's WS `join_group` handler now sends `join_group_ok` confirmation so clients know
  exactly when they're subscribed.

**Commit:** `fix(resilience): parse Retry-After on 429s, ApiError class, rate-limit toast, msgId in WS broadcasts`

---

## Final State
- Test suite: **654 tests passing**, 28 files
- All 7 commits on `main`
- No regressions introduced
