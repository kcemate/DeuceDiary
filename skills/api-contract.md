# Deuce Diary — iOS REST API Contract (dd-8)

> **Base URL:** `https://<host>` (TBD per environment)
> **Auth mode:** Clerk JWT — all `isAuthenticated` endpoints require `Authorization: Bearer <clerk_token>` header.
> **Content-Type:** `application/json` unless noted otherwise.
> **Error shape (all endpoints):** `{ "message": "<human-readable string>" }`

---

## Table of Contents

1. [Auth & User](#1-auth--user)
2. [Groups](#2-groups)
3. [Invites & Joining](#3-invites--joining)
4. [Deuce Entries](#4-deuce-entries)
5. [Reactions](#5-reactions)
6. [Locations](#6-locations)
7. [Analytics](#7-analytics)
8. [WebSocket Protocol](#8-websocket-protocol)
9. [Common Types](#9-common-types)

---

## 1. Auth & User

### GET /api/auth/user
**Purpose:** Fetch the authenticated user's profile. Auto-creates a "Solo Deuces" default group on first call if the user has no groups.
**Auth:** yes
**Request:** _(none — user ID derived from token)_
**Response 200:**
```json
{
  "id": "user_abc123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "profileImageUrl": "/uploads/user_abc123-1700000000.jpg",
  "deuceCount": 42,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-06-01T12:00:00.000Z"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 401 | Missing / invalid Bearer token, or user not found in DB |
| 500 | Server error |

**iOS notes:**
- Call this on app launch after Clerk sign-in to bootstrap the session.
- The auto-created "Solo Deuces" group won't be in this response — call `GET /api/groups` next.
- `profileImageUrl` may be `null` for new users.

---

### PUT /api/auth/user
**Purpose:** Update the authenticated user's username.
**Auth:** yes
**Request:**
```json
{
  "username": "newname"
}
```
**Validation:** 3–20 characters, alphanumeric + underscores + spaces only (`/^[a-zA-Z0-9_ ]+$/`).
**Response 200:**
```json
{
  "id": "user_abc123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "username": "newname",
  "profileImageUrl": "/uploads/user_abc123-1700000000.jpg",
  "deuceCount": 42,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-06-01T12:30:00.000Z"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 400 | Username already taken, or validation fails |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:** Show inline validation for the regex before submitting.

---

### POST /api/auth/user/profile-picture
**Purpose:** Upload a new profile picture. Server resizes to 200x200 JPEG.
**Auth:** yes
**Content-Type:** `multipart/form-data`
**Request:**
```
Field: "profilePicture" — image file (JPEG, PNG, etc.)
Max size: 5 MB
```
**Response 200:** _(full User object with updated `profileImageUrl`)_
```json
{
  "id": "user_abc123",
  "profileImageUrl": "/uploads/user_abc123-1700000000.jpg",
  "...": "...rest of User fields"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 400 | No file attached, or non-image MIME type |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:**
- Use `URLSession` upload task with `multipart/form-data`.
- Field name **must** be `profilePicture`.
- Accepts any `image/*` MIME type; server converts to JPEG.
- After success, update the local cached `profileImageUrl` — the URL is a relative path, prepend the base URL.

---

## 2. Groups

### POST /api/groups
**Purpose:** Create a new group. The creator is auto-added as `admin`.
**Auth:** yes
**Request:**
```json
{
  "name": "Throne Room",
  "description": "Optional group description"
}
```
**Response 200:**
```json
{
  "id": "uuid-v4",
  "name": "Throne Room",
  "description": "Optional group description",
  "createdBy": "user_abc123",
  "createdAt": "2025-06-01T12:00:00.000Z",
  "updatedAt": "2025-06-01T12:00:00.000Z"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:** `name` is required; `description` is optional.

---

### GET /api/groups
**Purpose:** List all groups the authenticated user belongs to (with summary stats).
**Auth:** yes
**Request:** _(none)_
**Response 200:**
```json
[
  {
    "id": "uuid-v4",
    "name": "Solo Deuces",
    "description": "Your personal throne log",
    "createdBy": "user_abc123",
    "createdAt": "2025-06-01T12:00:00.000Z",
    "updatedAt": "2025-06-01T12:00:00.000Z",
    "memberCount": 1,
    "entryCount": 14,
    "lastActivity": "2025-06-10T08:00:00.000Z"
  }
]
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:**
- `lastActivity` may be `null` if the group has no entries.
- Use `memberCount` and `entryCount` for group list cell rendering.

---

### GET /api/groups/:groupId
**Purpose:** Get full group detail — group info, members (with personal records), and all entries (with user data).
**Auth:** yes
**Request:** _(groupId in URL path)_
**Response 200:**
```json
{
  "group": {
    "id": "uuid-v4",
    "name": "Throne Room",
    "description": "...",
    "createdBy": "user_abc123",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "members": [
    {
      "id": 1,
      "groupId": "uuid-v4",
      "userId": "user_abc123",
      "role": "admin",
      "joinedAt": "2025-06-01T12:00:00.000Z",
      "user": {
        "id": "user_abc123",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe",
        "profileImageUrl": "/uploads/...",
        "deuceCount": 42,
        "createdAt": "...",
        "updatedAt": "..."
      },
      "personalRecord": {
        "date": "2025-05-20",
        "count": 5
      }
    }
  ],
  "entries": [
    {
      "id": "uuid-v4",
      "userId": "user_abc123",
      "groupId": "uuid-v4",
      "location": "Home",
      "thoughts": "A throne worthy of a king",
      "loggedAt": "2025-06-10T08:00:00.000Z",
      "createdAt": "2025-06-10T08:01:00.000Z",
      "user": {
        "id": "user_abc123",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe",
        "profileImageUrl": "/uploads/...",
        "...": "...rest of User"
      }
    }
  ]
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 403 | User is not a member of this group |
| 404 | Group does not exist |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:**
- `entries` are ordered newest-first. Use this for the group feed.
- `members[].personalRecord` can be `null` if the member has no entries.
- `members[].role` is either `"admin"` or `"member"`.

---

## 3. Invites & Joining

### POST /api/groups/:groupId/invite
**Purpose:** Generate a shareable invite link for a group. Expires in 7 days.
**Auth:** yes
**Request:** _(groupId in URL path, no body)_
**Response 200:**
```json
{
  "inviteLink": "https://deucediary.com/join/uuid-v4",
  "id": "uuid-v4"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 403 | User is not a member of this group |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:**
- Use `inviteLink` for `UIActivityViewController` share sheet.
- The `id` can be used to construct a deep link: `deucediary://join/<id>`.

---

### POST /api/join/:inviteId
**Purpose:** Accept an invite and join the group.
**Auth:** yes
**Request:** _(inviteId in URL path, no body)_
**Response 200 (new member):**
```json
{
  "group": {
    "id": "uuid-v4",
    "name": "Throne Room",
    "description": "...",
    "createdBy": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```
**Response 200 (already a member):**
```json
{
  "group": { "...": "...Group object" },
  "message": "Already a member of this group"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 400 | Invite not found or expired |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:**
- Handle the universal link / deep link `deucediary://join/<inviteId>` → call this endpoint.
- Check for the `"message"` field to detect "already a member" and skip navigation to a success screen.
- After success, navigate to the group detail screen using the returned `group.id`.

---

### GET /join/:inviteId
**Purpose:** Browser-based invite link handler (redirects). **Not for iOS API use.**
**iOS notes:** Do **not** call this from the iOS client. Handle deep links by extracting the `inviteId` and calling `POST /api/join/:inviteId` directly.

---

## 4. Deuce Entries

### POST /api/deuces
**Purpose:** Log a new deuce. Supports posting to multiple groups at once. Broadcasts WebSocket notification.
**Auth:** yes
**Request:**
```json
{
  "groupIds": ["uuid-group-1", "uuid-group-2"],
  "location": "Home",
  "thoughts": "A throne worthy of a king",
  "loggedAt": "2025-06-10T08:00:00.000Z"
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `groupIds` | `string[]` | yes | At least one group ID |
| `location` | `string` | yes | Location name |
| `thoughts` | `string` | yes | Entry text |
| `loggedAt` | `ISO 8601 string` | no | Defaults to server time if omitted |

**Response 200:**
```json
{
  "entries": [
    {
      "id": "uuid-v4",
      "userId": "user_abc123",
      "groupId": "uuid-group-1",
      "location": "Home",
      "thoughts": "A throne worthy of a king",
      "loggedAt": "2025-06-10T08:00:00.000Z",
      "createdAt": "2025-06-10T08:01:00.000Z"
    }
  ],
  "count": 1
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 400 | No `groupIds` provided (empty array) |
| 403 | User is not a member of one or more specified groups |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:**
- The `groupId` field (singular) is also accepted for backward compatibility, but prefer `groupIds` (array).
- `loggedAt` — send device local time as ISO 8601 UTC so entries have correct timestamps.
- `count` reflects total entries created (one per group).
- On success, the user's `deuceCount` is incremented by 1 server-side (regardless of how many groups).
- A WebSocket `deuce_logged` event will fire for each group — the posting client should ignore its own events (filter by `userId`).

---

## 5. Reactions

### POST /api/entries/:entryId/reactions
**Purpose:** Add an emoji reaction to a deuce entry.
**Auth:** yes
**Request:**
```json
{
  "emoji": "💩"
}
```
**Response 200:**
```json
{
  "id": 1,
  "entryId": "uuid-v4",
  "userId": "user_abc123",
  "emoji": "💩",
  "createdAt": "2025-06-10T09:00:00.000Z"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 400 | Missing `emoji`, or user already reacted with this emoji (duplicate) |
| 403 | User is not a member of the entry's group |
| 404 | Entry not found |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:**
- One reaction per emoji per user. Tapping the same emoji again should call DELETE to toggle it off.
- `emoji` is a string (max 10 chars) — pass the actual Unicode emoji character.

---

### DELETE /api/entries/:entryId/reactions
**Purpose:** Remove the authenticated user's emoji reaction from an entry.
**Auth:** yes
**Request:**
```json
{
  "emoji": "💩"
}
```
**Response 200:**
```json
{
  "message": "Reaction removed"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 400 | Missing `emoji` |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:** Note this is a `DELETE` with a JSON body — set `Content-Type: application/json` and include the body.

---

### GET /api/entries/:entryId/reactions
**Purpose:** Get all reactions for a specific entry, with user info.
**Auth:** yes
**Request:** _(entryId in URL path)_
**Response 200:**
```json
[
  {
    "id": 1,
    "entryId": "uuid-v4",
    "userId": "user_abc123",
    "emoji": "💩",
    "createdAt": "2025-06-10T09:00:00.000Z",
    "user": {
      "id": "user_abc123",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "profileImageUrl": "/uploads/...",
      "...": "...rest of User"
    }
  }
]
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:** Use this to render reaction pill views with user avatar tooltips.

---

## 6. Locations

### GET /api/locations
**Purpose:** List all available locations (default ones first, then alphabetical).
**Auth:** no
**Request:** _(none)_
**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Home",
    "isDefault": true,
    "createdBy": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 5,
    "name": "The Office",
    "isDefault": false,
    "createdBy": "user_abc123",
    "createdAt": "2025-06-01T12:00:00.000Z"
  }
]
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 500 | Server error |

**iOS notes:**
- No auth required. Cache this list locally for the location picker.
- Sort order from server: `isDefault` DESC, `name` ASC.

---

### POST /api/locations
**Purpose:** Create a custom location.
**Auth:** yes
**Request:**
```json
{
  "name": "Grandma's House"
}
```
**Response 200:**
```json
{
  "id": 6,
  "name": "Grandma's House",
  "isDefault": false,
  "createdBy": "user_abc123",
  "createdAt": "2025-06-10T12:00:00.000Z"
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 400 | Empty name, or location name already exists |
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:** Let users type a custom location in the picker; if it doesn't exist, POST to create it first, then use it in the deuce entry.

---

## 7. Analytics

### GET /api/analytics/most-deuces
**Purpose:** Get the user's top day — the date with the most deuces logged.
**Auth:** yes
**Request:** _(none)_
**Response 200:**
```json
{
  "date": "2025-05-20",
  "count": 5
}
```
**Response 200 (no entries yet):**
```json
{
  "date": "",
  "count": 0
}
```
**Error cases:**
| Status | Trigger |
|--------|---------|
| 401 | Not authenticated |
| 500 | Server error |

**iOS notes:** Use for the "Personal Record" badge on the profile screen. Check for `count === 0` to show an empty state.

---

## 8. WebSocket Protocol

### Connection
**URL:** `wss://<host>/ws`
**Auth:** None at the WebSocket level (unauthenticated connection). Auth is enforced on the HTTP endpoints that trigger events.

### Client → Server Messages

#### Join a group channel
```json
{
  "type": "join_group",
  "groupId": "uuid-v4"
}
```
Send this immediately after connecting to subscribe to real-time events for a group. One connection supports one group at a time (the last `join_group` wins).

### Server → Client Messages

#### New deuce logged
```json
{
  "type": "deuce_logged",
  "message": "johndoe logged a new deuce",
  "entry": {
    "id": "uuid-v4",
    "userId": "user_abc123",
    "groupId": "uuid-v4",
    "location": "Home",
    "thoughts": "...",
    "loggedAt": "...",
    "createdAt": "...",
    "user": {
      "id": "user_abc123",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "profileImageUrl": "/uploads/...",
      "...": "...rest of User"
    }
  },
  "userId": "user_abc123"
}
```

### iOS Implementation Notes
1. **Connect** when the user opens a group detail screen.
2. **Send** `join_group` with the current `groupId`.
3. **Listen** for `deuce_logged` messages.
4. **Filter** out events where `userId` matches the current user (they already see their own entry from the POST response).
5. **Insert** the new entry at the top of the feed and show a toast/banner.
6. **Disconnect** when the user leaves the group detail screen.
7. **Reconnect** on network recovery — use `URLSessionWebSocketTask` or Starscream with auto-reconnect.
8. If the user switches groups, send a new `join_group` — the server replaces the previous subscription.

---

## 9. Common Types

### User
```json
{
  "id": "string",
  "email": "string | null",
  "firstName": "string | null",
  "lastName": "string | null",
  "username": "string | null",
  "profileImageUrl": "string | null",
  "deuceCount": "integer",
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

### Group
```json
{
  "id": "string (UUID v4)",
  "name": "string",
  "description": "string | null",
  "createdBy": "string (user ID)",
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

### DeuceEntry
```json
{
  "id": "string (UUID v4)",
  "userId": "string",
  "groupId": "string",
  "location": "string",
  "thoughts": "string",
  "loggedAt": "ISO 8601 string",
  "createdAt": "ISO 8601 string"
}
```

### Reaction
```json
{
  "id": "integer (auto-increment)",
  "entryId": "string",
  "userId": "string",
  "emoji": "string (max 10 chars)",
  "createdAt": "ISO 8601 string"
}
```

### Location
```json
{
  "id": "integer (auto-increment)",
  "name": "string",
  "isDefault": "boolean",
  "createdBy": "string | null",
  "createdAt": "ISO 8601 string"
}
```

### GroupMember
```json
{
  "id": "integer (auto-increment)",
  "groupId": "string",
  "userId": "string",
  "role": "\"admin\" | \"member\"",
  "joinedAt": "ISO 8601 string"
}
```

### Invite
```json
{
  "id": "string (UUID v4)",
  "groupId": "string",
  "createdBy": "string",
  "expiresAt": "ISO 8601 string",
  "createdAt": "ISO 8601 string"
}
```

---

## Endpoint Summary

| Verb | Path | Auth | Purpose |
|------|------|------|---------|
| GET | `/api/auth/user` | yes | Get current user |
| PUT | `/api/auth/user` | yes | Update username |
| POST | `/api/auth/user/profile-picture` | yes | Upload profile pic (multipart) |
| POST | `/api/groups` | yes | Create group |
| GET | `/api/groups` | yes | List user's groups |
| GET | `/api/groups/:groupId` | yes | Group detail + members + entries |
| POST | `/api/groups/:groupId/invite` | yes | Generate invite link |
| POST | `/api/join/:inviteId` | yes | Accept invite, join group |
| POST | `/api/deuces` | yes | Log a deuce |
| POST | `/api/entries/:entryId/reactions` | yes | Add reaction |
| DELETE | `/api/entries/:entryId/reactions` | yes | Remove reaction |
| GET | `/api/entries/:entryId/reactions` | yes | List reactions for entry |
| GET | `/api/locations` | no | List locations |
| POST | `/api/locations` | yes | Create location |
| GET | `/api/analytics/most-deuces` | yes | User's top deuce day |
| WSS | `/ws` | no | Real-time group events |
