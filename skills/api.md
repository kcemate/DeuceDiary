---
summary: "All REST endpoints grouped by domain — auth, groups, deuces, reactions, locations, invites — with request/response shapes."
links: [database, websocket]
---
# API

All routes are defined in `server/routes.ts`. Protected routes require the `isAuthenticated` middleware (session check — see [[database]] sessions table for storage). JSON body and responses throughout; 10 MB body limit for file uploads.

---

## Auth

### `POST /api/login`
No auth required.
```json
// Request
{ "username": "alice" }
// Response
{ "ok": true }
```
Creates/upserts user in [[database]], sets `req.session.userId`.

### `GET /api/logout`
Destroys session, redirects to `/`.

### `GET /api/auth/user` *(protected)*
Returns the current user object (from `users` table).

### `PUT /api/auth/user` *(protected)*
Update username.
```json
// Request
{ "username": "alice_cool" }
// Response — updated User object
```
Validated by `updateUserSchema` (3–20 chars). 400 if username taken.

### `POST /api/auth/user/profile-picture` *(protected)*
Multipart `profilePicture` file field. Resized to 200×200 JPEG by `sharp`, saved to `dist/public/uploads/`, URL stored in user row.
```json
// Response — updated User object with profileImageUrl
```

---

## Groups

### `POST /api/groups` *(protected)*
```json
// Request
{ "name": "The Gang", "description": "optional" }
// Response — Group object
```
Creator is automatically added as `admin` member.

### `GET /api/groups` *(protected)*
Returns array of groups the current user belongs to.

### `GET /api/groups/:groupId` *(protected)*
403 if not a member.
```json
// Response
{
  "group": { ...Group },
  "members": [ { ...GroupMember + User } ],
  "entries": [ { ...DeuceEntry + User + reactions } ]
}
```

---

## Invites

### `POST /api/groups/:groupId/invite` *(protected)*
Must be a group member. Creates an invite with 7-day TTL.
```json
// Response
{ "inviteLink": "https://host/join/:inviteId", "id": "uuid" }
```

### `GET /join/:inviteId`
Browser-facing redirect. If not authenticated → redirects to `/api/login?returnTo=…`. If authenticated → redirects to `/?join=:inviteId` for the frontend to handle.

### `POST /api/join/:inviteId` *(protected)*
Validates invite exists and is not expired. Adds user to group. Deletes invite after use (one-time use). Returns `{ group }`. If already a member, returns `{ group, message: "Already a member..." }`.

---

## Locations

### `GET /api/locations`
Public — no auth required. Returns all locations (defaults + user-created).

### `POST /api/locations` *(protected)*
```json
// Request
{ "name": "The Office" }
// Response — Location object
```
400 if name already exists.

---

## Deuces

### `POST /api/deuces` *(protected)*
Multi-group aware. Creates one `deuceEntries` row per group and broadcasts [[websocket]] `deuce_logged` events.
```json
// Request
{
  "groupIds": ["group-uuid-1", "group-uuid-2"],
  "location": "Home",
  "thoughts": "Deep thoughts.",
  "loggedAt": "2026-02-19T14:30:00Z"
}
// Response
{ "entries": [ ...DeuceEntry ], "count": 2 }
```
`groupIds` is preferred; single `groupId` also accepted for backward compatibility. 403 if user is not a member of any listed group.

### `GET /api/analytics/most-deuces` *(protected)*
Returns the current user's best deuce day.
```json
// Response
{ "date": "2026-01-15", "count": 4 }
```

---

## Reactions

### `POST /api/entries/:entryId/reactions` *(protected)*
```json
// Request
{ "emoji": "🔥" }
// Response — Reaction object
```
400 if already reacted with same emoji (unique constraint). 403 if not in the entry's group.

### `DELETE /api/entries/:entryId/reactions` *(protected)*
```json
// Request
{ "emoji": "🔥" }
// Response
{ "message": "Reaction removed" }
```

### `GET /api/entries/:entryId/reactions` *(protected)*
Returns array of Reaction objects for the entry.
