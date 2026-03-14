# Authentication

Deuce Diary uses **dual-mode authentication**: Clerk JWT in production, username-based sessions in development.

## Mode Detection

The server checks for `CLERK_SECRET_KEY` at startup. If set, Clerk mode activates; otherwise dev session mode is used.

```
CLERK_SECRET_KEY set → Clerk JWT mode (production)
CLERK_SECRET_KEY not set → Session mode (development)
```

---

## Clerk JWT Mode (Production)

### How It Works

1. The client authenticates with Clerk on the frontend
2. Clerk issues a signed JWT (session token)
3. Every API request includes the token in the `Authorization` header
4. The server verifies the JWT using the Clerk SDK and loads the user from the database

### Request Header

```
Authorization: Bearer <clerk_session_token>
```

### Frontend Sync

After login, clients must call `POST /api/auth/sync` to upsert the user record in the DB and receive profile + streak data. Identity fields (email, name) are taken from the verified JWT — not the request body — to prevent spoofing. Only `username` may be supplied by the client body.

### Middleware Chain

```
request
  └─ isAuthenticated
       ├─ Extract Bearer token from Authorization header
       ├─ clerk.verifyToken(token) → payload
       ├─ storage.getUser(payload.sub) → user
       │    └─ (auto-create if first login; auto-create Solo Deuces group)
       ├─ req.user = user
       ├─ req.clerkAuth = payload   ← raw JWT claims for premium checks
       └─ next()
```

If the token is missing or invalid, the middleware returns `401 Unauthorized`.

### JWT Claims Used

| Claim | Field | Usage |
|---|---|---|
| `sub` | User ID | Primary key for DB lookup |
| `email` | Email address | Stored on upsert |
| `first_name` | First name | Stored on upsert |
| `last_name` | Last name | Stored on upsert |
| `image_url` | Profile image | Stored on upsert |

### WebSocket Authentication

Browsers cannot send custom headers during WebSocket upgrade. Instead, pass the Clerk token as a query parameter:

```
wss://host/ws?token=<clerk_session_token>
```

The server verifies the token identically to HTTP requests. See [websocket-protocol.md](./websocket-protocol.md) for the full protocol.

---

## Session Mode (Development Only)

### How It Works

1. Client POSTs a username to `POST /api/login`
2. Server creates or upserts a user with a deterministic ID (`dev-<username>`)
3. A server-side session is created and stored in Postgres (`sessions` table)
4. The session cookie (`connect.sid`) is sent back to the client

### Login

```http
POST /api/login
Content-Type: application/json

{
  "username": "jordan",
  "inviteCode": "<optional-uuid>"
}
```

**Response:**
```json
{
  "ok": true,
  "user": {
    "id": "dev-jordan",
    "username": "jordan",
    "profilePicture": null,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

If `inviteCode` is provided and valid, the user is auto-joined to that group and `joinedGroup` is included in the response.

### Logout

```http
GET /api/logout
```
Destroys the session and redirects to `/`.

```http
POST /api/auth/logout
```
Destroys the session and returns `{ "ok": true }`.

### Session Configuration

| Setting | Value |
|---|---|
| Store | Postgres (`sessions` table) |
| TTL | 7 days |
| Cookie | `HttpOnly`, `SameSite=Lax`, `Secure` in production |
| Secret | `SESSION_SECRET` env var (required in production) |

---

## Middleware Reference

### `isAuthenticated`

Protects a route. Checks Clerk JWT (production) or session cookie (dev). Sets `req.user` on success.

```typescript
app.get('/api/example', isAuthenticated, async (req: any, res) => {
  const userId = req.user.id;
  // ...
});
```

**Error responses:**
- `401 { "message": "Unauthorized" }` — no token / no session
- `401 { "message": "Invalid token" }` — bad JWT signature or expired

### `requiresPremiumFor(feature)`

Must be used **after** `isAuthenticated`. Checks `req.user.subscription` and `req.user.subscriptionExpiresAt`. Returns `402` with `{ "feature": "<name>", "upgrade": true }` if the user is not premium.

```typescript
app.get('/api/spy', isAuthenticated, requiresPremiumFor('squad_spy'), handler);
```

### `requireGroupMember(paramName?)`

Must be used **after** `isAuthenticated`. Verifies the authenticated user is a member of the group identified by the route parameter (default: `groupId`). Sets `req.groupId` to the resolved group ID.

```typescript
app.get('/api/groups/:groupId/streak', isAuthenticated, requireGroupMember(), handler);
// req.groupId is available inside handler
```

---

## Admin & Internal Endpoints

These endpoints skip session auth entirely and use API keys for machine-to-machine calls.

### Admin Key (`X-Admin-Key`)

```http
GET /api/admin/stats
X-Admin-Key: <ADMIN_KEY>
```

Set `ADMIN_KEY` env var. Comparison is constant-time (timing-attack safe).

### Internal Key (`X-Internal-Key`)

Used for cron jobs and internal service calls:

```http
POST /api/internal/streak-check
X-Internal-Key: <INTERNAL_API_KEY>

POST /api/internal/crown-transfer
X-Internal-Key: <INTERNAL_API_KEY>

GET /api/internal/errors
X-Internal-Key: <INTERNAL_API_KEY>

GET /api/internal/health/detailed
X-Internal-Key: <INTERNAL_API_KEY>
```

Set `INTERNAL_API_KEY` env var.

---

## Runtime Config

The client fetches Clerk's publishable key at boot rather than baking it into the JS bundle:

```http
GET /api/config
```

Response:
```json
{
  "clerkPublishableKey": "pk_live_..."
}
```
