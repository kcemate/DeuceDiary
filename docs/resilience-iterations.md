# Error Resilience Iterations

QA engineer: Casey | Date: 2026-03-13

---

## Click 1 — Bingo blank screen on non-premium error

**File:** `client/src/pages/bingo.tsx`

**Problem:** `BingoContent` used the condition `{!isLoading && !error && data && (...)}` — if any non-premium error occurred (network issue, 5xx), the component rendered a completely blank `<div>` with no feedback to the user.

**Fix:** Added an explicit `{!isLoading && error && !isPremiumError && (...)}` branch that shows a "Couldn't load your bingo card — Try Again" error state with a button that invalidates the query.

**Commit:** `9ba7734b`

---

## Click 2 — Unauthenticated Suspense routes lacked error boundary

**File:** `client/src/App.tsx`

**Problem:** The authenticated routes were wrapped in `<ErrorBoundary>` inside `AppRoutes`, but the unauthenticated `<Suspense>` block (Landing, Privacy, Terms, InviteLanding, Legacy) had no error boundary. A `ChunkLoadError` (failed dynamic import from a bad deploy or CDN miss) would produce a white blank screen.

**Fix:** Wrapped the unauthenticated `<Suspense>` block in `<ErrorBoundary>`, matching the pattern used for authenticated routes.

**Commit:** `69ca8cca`

---

## Click 3 — All API queries had `retry: false`

**File:** `client/src/lib/queryClient.ts`

**Problem:** The global QueryClient default had `retry: false`. Any single transient network hiccup or 5xx response was permanent for the user — no automatic recovery.

**Fix:** Added `shouldRetry()` function that retries up to 3x with exponential backoff (1s → 2s → 4s, capped at 10s) for network failures and 5xx errors. 4xx errors (client/auth failures) are never retried.

**Commit:** `e99cbfbd`

---

## Click 4 — WebSocket reconnect used a fixed 3-second delay

**File:** `client/src/hooks/useWebSocket.ts`

**Problem:** After a disconnect, the WebSocket always attempted to reconnect after exactly 3 seconds, regardless of how many consecutive failures had occurred. During a server outage this hammers the endpoint.

**Fix:** Added `reconnectAttemptRef` to track consecutive failures. Reconnect delay is now exponential: 2s → 4s → 8s → 16s, capped at 30s. Counter resets to 0 on a successful `onopen`.

**Commit:** `84246196`

---

## Click 5 — ErrorBoundary showed generic message for chunk-load errors

**File:** `client/src/components/error-boundary.tsx`

**Problem:** A `ChunkLoadError` (stale bundle after a new deploy) showed the generic "🚽 Something went sideways — Flush & Retry" UI. This message is wrong and confusing — the correct action is a hard reload, not a state reset.

**Fix:** Added `isChunkLoadError()` method that detects errors by name (`ChunkLoadError`) or common message patterns. Renders a distinct "🔄 New version available — Reload Page" fallback instead.

**Commit:** `473b48b5`

---

## Click 6 — Failed queries failed silently (no user feedback)

**File:** `client/src/App.tsx`

**Problem:** When any background query failed with a 5xx or network error, the user saw stale data with no indication something went wrong. Errors were only visible in the browser console.

**Fix:** Added a `useEffect` in the `Router` component that subscribes to `queryClient.getQueryCache()`. On every query error that is transient (status ≥ 500 or no HTTP status at all), fires a destructive toast: "Connection issue — Couldn't reach the server. Pull down to refresh."

**Commit:** `25ce40a2`

---

## Click 7 — Home feed silently showed empty state on API failure

**File:** `client/src/pages/home.tsx`

**Problem:** The feed query used `data: feedEntries = []` but didn't destructure `isError`. When the `/api/deuces` endpoint failed, `feedEntries` remained `[]` and the component rendered the happy-path "your throne room awaits" empty state. Users had no idea their feed had failed to load.

**Fix:** Added `isError: feedError` to the feed query destructuring. Added a dedicated error branch in the render tree that shows "⚠️ Couldn't load your feed — Pull down to refresh."

**Commit:** `fdd39710`
