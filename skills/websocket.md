---
summary: "Real-time layer — WS server at /ws, join_group subscription, deuce_logged broadcast."
links: [api]
---
# WebSocket

The WebSocket server is attached to the same HTTP server as the [[api]], mounted at path `/ws`. It uses the `ws` npm package (`WebSocketServer`). There is no authentication on the WS handshake itself — clients are expected to only call `join_group` for groups they are members of (the HTTP [[api]] enforces membership).

---

## Server-Side Implementation (`server/routes.ts`)

```
WebSocketServer({ server: httpServer, path: '/ws' })
```

Connections are tracked in a `Map<groupId, Set<WebSocket>>` called `groupConnections`. A single WebSocket connection is associated with one group at a time (the last `join_group` message wins — `ws.groupId` is overwritten).

### Incoming message: `join_group`
```json
{ "type": "join_group", "groupId": "uuid" }
```
Adds the socket to `groupConnections.get(groupId)`. The `groupId` is stored on the socket object as `ws.groupId` for cleanup on close.

### On `close`
The socket is removed from its group's Set. If the Set becomes empty, the group key is deleted from the Map.

### `broadcastToGroup(groupId, message)`
Iterates the Set for the given groupId and sends the JSON-serialized message to every socket with `readyState === OPEN`. Called internally after [[api]] mutations.

---

## Events Broadcast by the Server

### `deuce_logged`
Emitted after `POST /api/deuces` creates entries. One broadcast per group in `groupIds`.
```json
{
  "type": "deuce_logged",
  "message": "Alice logged a new deuce",
  "entry": { ...DeuceEntry, "user": { ...User } },
  "userId": "the-poster-user-id"
}
```
The `userId` field is included so the frontend can suppress the notification for the user who just logged (they already see the optimistic update).

---

## Frontend Connection Pattern

The React frontend connects to `ws://<same-origin>/ws` on app load (after auth). When navigating into a group, it sends `join_group`. TanStack Query cache is invalidated or patched when a `deuce_logged` event arrives. The connection includes automatic reconnection logic.

For the iOS rebuild, React Native ships with the native `WebSocket` API — no library changes needed. The plan is to wrap the connection in a `useGroupSocket` hook mirroring the web app's pattern. See [[ios-rebuild]] for details.

---

## Limitations & Future Work

- One WS connection per client tracks only one group at a time. A user viewing multiple groups simultaneously would need multiple connections or a subscription multiplexing approach.
- No auth on the WS handshake — a client could subscribe to any `groupId` string. Mitigate in production by validating group membership inside the `join_group` handler.
- Push notifications (via Expo Notifications / APNs) are planned for the iOS rebuild to cover users not connected via WebSocket.
