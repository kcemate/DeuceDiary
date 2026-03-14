# WebSocket Hardening Iterations

## Overview
7-click ratchet of WebSocket / real-time improvements. All changes are surgical;
all 654 tests pass after each click.

---

## Click 1 — Jitter in exponential backoff
**File:** `client/src/hooks/useWebSocket.ts`
**Problem:** Reconnect delay was deterministic (`2s * 2^n`, capped at 30s). If many
clients disconnect simultaneously (e.g. server restart), they all retry at the
same instant and hammer the server.
**Fix:** Added ±25% random jitter to each backoff delay:
```
baseDelay * (0.75 + Math.random() * 0.5)
```
**Commit:** `fix(ws): add ±25% jitter to exponential backoff to prevent thundering herd on reconnect`

---

## Click 2 — Group join queue during disconnection
**File:** `client/src/hooks/useWebSocket.ts`
**Problem:** `joinGroup()` silently dropped the message if the socket wasn't
connected. After a brief network drop the user's group subscriptions were lost.
**Fix:** `pendingGroupJoinsRef` (a `Set<string>`) records every group the caller
wants to join. On `ws.onopen`, `flushPendingGroupJoins()` replays all of them.
`disconnect()` clears the set to prevent stale joins after logout.
**Commit:** `fix(ws): queue group joins during disconnect, replay automatically on reconnect`

---

## Click 3 — Multi-group cleanup fix on disconnect
**File:** `server/routes.ts`
**Problem:** `(ws as any).groupId = groupId` was overwritten on each `join_group`.
On socket close, only the *last* subscribed group was cleaned from
`groupConnections`. Sockets that joined groups A then B would leave A with a dead
socket until the 60-second sweep ran.
**Fix:** Replaced `groupId` scalar with `subscribedGroups: Set<string>`. The `close`
handler iterates the set and removes the socket from every group it joined.
**Test added:** Verifies multi-group log creates one entry per group and server stays healthy.
**Commit:** `fix(ws): track all subscribed groups per socket, clean all on disconnect`

---

## Click 4 — leave_group message support
**File:** `server/routes.ts`
**Problem:** The only way to unsubscribe from a group was to disconnect the socket.
Page navigations that no longer needed a group's events kept the stale subscription alive.
**Fix:** Server now handles `{ type: "leave_group", groupId }`. Removes the socket
from `groupConnections` and `subscribedGroups` immediately.
**Test added:** leave_group server-health smoke test.
**Commit:** `fix(ws): add leave_group message — clean unsubscribe without disconnecting`

---

## Click 5 — Message IDs on broadcasts + join_group_ok acknowledgment
**File:** `server/routes.ts`
**Problems:**
1. Broadcast events had no unique ID, making client-side deduplication impossible.
2. Clients had no way to know when `join_group` was fully processed, so they used
   a fixed setTimeout before triggering broadcasts in tests.
**Fix:**
- `broadcastToGroup()` stamps every outgoing message with `msgId: uuidv4()`.
  The ID is generated once and shared to all subscribers of the group for that event.
- After successfully adding a socket to a group, server sends
  `{ type: "join_group_ok", groupId }` so clients know they're subscribed.
**Test added:** Verifies two sequential logs produce different entry IDs (uuidv4 runs without error).
**Commit:** `fix(ws): stamp broadcast events with msgId for client dedup; ack join_group with join_group_ok`

---

## Click 6 — Client-side message deduplication
**File:** `client/src/hooks/useWebSocket.ts`
**Problem:** Without deduplication, the same `deuce_logged` event could trigger
multiple notifications (e.g. during a reconnect window where both old and new
connections briefly exist).
**Fix:** `seenMsgIdsRef` (a `Set<string>`) tracks the last ≤100 `msgId` values.
Any message whose `msgId` is already in the set is silently dropped before
calling `setLastMessage`. The set is evicted FIFO when it exceeds 100 entries.
**Commit:** `fix(ws): deduplicate incoming messages client-side using server-stamped msgId`

---

## Click 7 — Enhanced connection state enum
**File:** `client/src/hooks/useWebSocket.ts`
**Problem:** The hook only exported a boolean `isConnected`. UI components couldn't
distinguish "never connected" from "connecting" from "waiting to reconnect".
**Fix:** Added `ConnectionState` type (`"idle" | "connecting" | "connected" | "reconnecting"`)
and `connectionState` state variable. Transitions:
- `idle` → `connecting` when `connect()` is called
- `connecting` → `connected` on `ws.onopen`
- `connected` → `reconnecting` on `ws.onclose` (when `shouldReconnectRef` is true)
- Any → `idle` on `disconnect()`
**Commit:** `fix(ws): expose connectionState enum (idle/connecting/connected/reconnecting)`

---

## Summary

| Click | Area | Benefit |
|-------|------|---------|
| 1 | Client reconnect | Prevents thundering herd on server restart |
| 2 | Client reconnect | Group subs survive network drops |
| 3 | Server cleanup | Dead sockets removed from all subscribed groups |
| 4 | Server protocol | Clean group unsubscribe without disconnect |
| 5 | Server protocol | Enables client dedup; removes timing guesswork |
| 6 | Client dedup | No duplicate notifications during reconnect window |
| 7 | Client state | Rich connection state for UI feedback |
