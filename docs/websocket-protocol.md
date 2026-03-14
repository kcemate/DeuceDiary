# WebSocket Protocol

Deuce Diary uses a single WebSocket endpoint for real-time group notifications (new deuce logged, streak updates).

---

## Endpoint

```
wss://host/ws
```

Only one path is accepted. Any other path causes the connection to be immediately closed.

---

## Authentication

WebSocket connections are authenticated at upgrade time — **before** the connection is established.

### Clerk Mode (Production)

Pass the Clerk session token as a query parameter (browsers cannot set headers during upgrade):

```
wss://host/ws?token=<clerk_session_token>
```

The server verifies the token with `clerk.verifyToken(token)`. If verification fails or the user is not in the DB, the server returns HTTP `401 Unauthorized` and destroys the socket.

### Session Mode (Development)

In dev mode, the server reads the session cookie from the upgrade request:

```
// No special query param needed — cookie is sent automatically by the browser
wss://host/ws
```

The session middleware is applied to the upgrade request to extract `session.userId`.

### Auth Failure

If authentication fails, the server writes an HTTP response over the raw socket and terminates it:

```
HTTP/1.1 401 Unauthorized
```

---

## Connection Lifecycle

```
client                               server
  │                                    │
  │── Upgrade request ─────────────── →│
  │   ?token=<jwt>  (or session cookie)│
  │                                    │ verify token / session
  │                                    │ load user from DB
  │← 101 Switching Protocols ─────────│  (or 401 if auth fails)
  │                                    │
  │── join_group { groupId } ─────────→│
  │                                    │ verify group membership
  │← joined (implicit; no ack) ────── │
  │                                    │
  │  ··· real-time events ···          │
  │← deuce_logged { entry, userId } ──│ (when someone logs a deuce)
  │                                    │
  │← ping ─────────────────────────── │ (every 30s)
  │── pong ───────────────────────────→│
  │                                    │
  │── close ──────────────────────────→│
  │                                    │ cleanup groupConnections
```

---

## Client → Server Messages

All client messages are JSON.

### `join_group`

Subscribe to real-time events for a group. A client must send this after connecting to start receiving events.

```json
{
  "type": "join_group",
  "groupId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `"join_group"` | Yes | Message type |
| `groupId` | UUID string | Yes | Group to subscribe to |

**Authorization:** The server checks `storage.isUserInGroup(userId, groupId)`. If the user is not a member, an error is returned and the subscription is not created:

```json
{
  "type": "error",
  "message": "Not a member of this group"
}
```

**Invalid groupId:**
```json
{
  "type": "error",
  "message": "Invalid groupId"
}
```

---

## Server → Client Messages

### `deuce_logged`

Broadcast to all connected members of a group when a new deuce is logged. **Not sent for ghost logs** (private entries).

```json
{
  "type": "deuce_logged",
  "message": "Jordan logged a new deuce",
  "entry": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "groupId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user_abc123",
    "location": "The Office",
    "thoughts": "Monday blues",
    "loggedAt": "2026-03-13T10:30:00.000Z",
    "ghost": false,
    "user": {
      "id": "user_abc123",
      "username": "jordan",
      "firstName": "Jordan",
      "profileImageUrl": "https://..."
    }
  },
  "userId": "user_abc123"
}
```

The `userId` field identifies who logged the deuce — clients use this to **skip** showing the notification to the user who performed the action.

| Field | Type | Description |
|---|---|---|
| `type` | `"deuce_logged"` | Event type |
| `message` | string | Human-readable notification text |
| `entry` | object | The new deuce entry (sanitized user data, no email/referral fields) |
| `userId` | string | ID of the user who logged the deuce |

### `error`

Sent when the client sends an invalid message.

```json
{
  "type": "error",
  "message": "Not a member of this group"
}
```

---

## Heartbeat

The server pings all connected clients every **30 seconds**. Clients that miss **2 consecutive pongs** are terminated.

- Server → Client: WebSocket `ping` frame (protocol-level, not a JSON message)
- Client → Server: WebSocket `pong` frame (browsers respond automatically)

If a connection is dead (missed 2 pongs), the server calls `ws.terminate()`.

A background sweep runs every **60 seconds** to remove terminated sockets from the in-memory `groupConnections` map and clean up empty group entries.

---

## Connection Limits & State

- Each WebSocket connection is associated with exactly one user (set at auth time)
- A client can subscribe to one group per connection (last `join_group` wins)
- Group subscriptions are stored in a server-side `Map<groupId, Set<WebSocket>>`
- All state is in-memory — connections are not persisted across server restarts

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Invalid or missing auth token | HTTP 401 during upgrade, socket destroyed |
| User not in DB | HTTP 401 during upgrade, socket destroyed |
| Invalid `groupId` in `join_group` | Error message sent, connection stays open |
| User not in requested group | Error message sent, subscription not created |
| Malformed JSON message | Error logged server-side, connection stays open |
| Client disconnects | Removed from `groupConnections` map |

---

## Example: Browser Client

```javascript
// Clerk mode
const token = await clerk.session.getToken();
const ws = new WebSocket(`wss://api.deucediary.app/ws?token=${token}`);

ws.addEventListener('open', () => {
  ws.send(JSON.stringify({
    type: 'join_group',
    groupId: 'your-group-uuid'
  }));
});

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === 'deuce_logged' && msg.userId !== currentUserId) {
    showNotification(msg.message);
    appendEntryToFeed(msg.entry);
  }
});

ws.addEventListener('close', () => {
  // Reconnect logic here
});
```
