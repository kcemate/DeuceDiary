# API Reference

Base URL: `https://deuce-diary-web-production.up.railway.app`

All authenticated endpoints require either:
- `Authorization: Bearer <clerk_session_token>` (production, Clerk mode)
- A valid session cookie from `POST /api/login` (development, non-Clerk mode)

WebSocket authenticated connections pass the Clerk token via `?token=<clerk_session_token>` query param (browsers cannot set WebSocket headers). In dev mode, the session cookie is used instead.

**Legend:** 🔓 Public · 🔑 Auth required · 👑 Premium required · 🔧 Admin/Internal key

---

## Table of Contents

- [Config & Health](#config--health)
- [Authentication](#authentication)
- [User](#user)
- [Groups](#groups)
- [Invites](#invites)
- [Locations](#locations)
- [Deuce Entries](#deuce-entries)
- [Reactions](#reactions)
- [Streaks](#streaks)
- [Leaderboard & Analytics](#leaderboard--analytics)
- [Referrals](#referrals)
- [Subscriptions](#subscriptions)
- [Push Notifications](#push-notifications)
- [Challenges & Bingo](#challenges--bingo)
- [Deuce King](#deuce-king)
- [Passport (Location History)](#passport-location-history)
- [Social Sharing](#social-sharing)
- [Admin Endpoints](#admin-endpoints)
- [Internal Endpoints](#internal-endpoints)
- [WebSocket Protocol](#websocket-protocol)

---

## Config & Health

### GET /api/config 🔓

Returns runtime configuration values for the frontend. Lets the client discover the Clerk publishable key without baking it into the JS bundle.

**Response:**
```json
{
  "clerkPublishableKey": "pk_live_..."
}
```

---

### GET /api/health 🔓

Liveness/readiness probe. Checks DB connectivity. Load balancers use this endpoint.

**Response 200:**
```json
{
  "status": "ok",
  "db": "connected",
  "dbLatencyMs": 3,
  "ws": {
    "totalConnections": 120,
    "activeConnections": 8,
    "failedAuthentications": 2,
    "gracefulDisconnects": 110,
    "forcedDisconnects": 0
  },
  "timestamp": "2026-03-13T10:00:00.000Z",
  "uptime": 86400.5
}
```

**Response 503** (DB unreachable):
```json
{
  "status": "degraded",
  "db": "unreachable",
  "timestamp": "2026-03-13T10:00:00.000Z",
  "uptime": 86400.5
}
```

---

## Authentication

### POST /api/login 🔓 *(dev mode only)*

Creates or upserts a user by username and starts a session. Not available when Clerk is enabled.

**Request:**
```json
{
  "username": "jordan",
  "inviteCode": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `username` | string | Yes | 1–50 chars |
| `inviteCode` | UUID string | No | Auto-joins the group if valid |

**Response 200:**
```json
{
  "ok": true,
  "user": {
    "id": "dev-jordan",
    "username": "jordan",
    "profilePicture": null,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "joinedGroup": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "The Porcelain Crew"
  }
}
```

`joinedGroup` is only present when `inviteCode` was valid.

---

### GET /api/logout 🔓 *(dev mode only)*

Destroys the session and redirects to `/`.

---

### POST /api/auth/logout 🔓 *(dev mode only)*

Destroys the session and returns JSON.

**Response:** `{ "ok": true }`

---

### GET /api/auth/user 🔑

Returns the authenticated user's profile.

**Response:**
```json
{
  "id": "user_abc123",
  "username": "jordan",
  "email": "jordan@example.com",
  "firstName": "Jordan",
  "lastName": "Smith",
  "profileImageUrl": "https://...",
  "deuceCount": 42,
  "subscription": "premium",
  "subscriptionExpiresAt": "2026-12-31T00:00:00.000Z",
  "streakInsuranceUsed": false,
  "theme": "cream",
  "timezone": "America/New_York",
  "title": "Seasoned Squatter",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

`title` is computed from `deuceCount` (not stored in DB).

---

### POST /api/auth/sync 🔑

Upserts the user record from Clerk JWT claims and returns the full profile with streak data. **Call this immediately after Clerk login.**

**Request body** (optional, username only; identity fields come from JWT in Clerk mode):
```json
{
  "username": "jordan"
}
```

**Response:**
```json
{
  "id": "user_abc123",
  "username": "jordan",
  "email": "jordan@example.com",
  "deuceCount": 42,
  "title": "Seasoned Squatter",
  "streaks": [
    {
      "groupId": "550e8400-e29b-41d4-a716-446655440000",
      "groupName": "The Porcelain Crew",
      "currentStreak": 5,
      "longestStreak": 12,
      "lastStreakDate": "2026-03-13"
    }
  ]
}
```

Auto-creates a "Solo Deuces" group if the user has no groups.

---

### PUT /api/auth/user 🔑

Updates the authenticated user's username.

**Request:**
```json
{ "username": "new_username" }
```

**Response:** Updated user object.

**Errors:**
- `400` — Username already taken

---

### POST /api/auth/user/profile-picture 🔑

Uploads a profile picture. Accepts `multipart/form-data`.

**Request:** `Content-Type: multipart/form-data` with field `profilePicture` (image file, max 5 MB).

Processing: resized to 200×200 JPEG (85% quality) using Sharp.

**Response:** Updated user object with new `profileImageUrl`.

---

## User

### GET /api/user/theme 🔑 👑

Returns the user's current theme.

**Response:** `{ "theme": "cream" }`

Valid themes: `default`, `dark`, `cream`, `midnight`, `ocean`, `retro`

---

### PUT /api/user/theme 🔑 👑

Updates the user's theme preference.

**Request:** `{ "theme": "midnight" }`

**Response:** `{ "theme": "midnight" }`

**Errors:**
- `400` — Invalid theme value

---

### GET /api/user/export 🔑

Exports user data as a JSON file (GDPR right to portability).

**Response:** JSON file download (`deuce-diary-export.json`) with:
```json
{
  "exportedAt": "2026-03-13T10:00:00.000Z",
  "account": {
    "username": "jordan",
    "email": "jordan@example.com",
    "firstName": "Jordan",
    "lastName": "Smith",
    "subscription": "premium",
    "deuceCount": 42,
    "theme": "cream",
    "timezone": "America/New_York",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "groups": [
    { "name": "The Porcelain Crew", "memberCount": 4, "joinedAt": "2026-01-15T00:00:00.000Z" }
  ],
  "badges": [
    { "name": "First Flush", "unlocked": true }
  ]
}
```

---

### PUT /api/user/timezone 🔑

Sets the user's IANA timezone for streak calculations.

**Request:** `{ "timezone": "America/New_York" }`

Validated against `Intl.DateTimeFormat`. Max 100 chars.

**Response:** `{ "timezone": "America/New_York" }`

**Errors:**
- `400` — Unknown or invalid IANA timezone

---

### DELETE /api/user/account 🔑

Soft-deletes the account (GDPR-compliant). Data is anonymized rather than hard-deleted.

**Response:** `{ "success": true }`

---

### GET /api/user/badges 🔑

Returns all badges for the authenticated user.

**Response:**
```json
[
  { "id": "first_flush", "name": "First Flush", "description": "Log your first deuce", "unlocked": true, "unlockedAt": "2026-01-01T00:00:00.000Z" },
  { "id": "streak_7", "name": "Week Warrior", "description": "7-day squad streak", "unlocked": false, "unlockedAt": null }
]
```

---

## Groups

### POST /api/groups 🔑

Creates a new group. Free users are limited to 3 groups.

**Request:**
```json
{
  "name": "The Porcelain Crew",
  "description": "We hold each other accountable"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | Yes | 1–100 chars |
| `description` | string | No | max 500 chars |

**Response:** Created group object.

**Errors:**
- `402` — Free user at 3-group limit (`{ "feature": "unlimited_squads", "upgrade": true }`)

---

### GET /api/groups 🔑

Returns all groups the authenticated user belongs to.

**Response:** Array of group objects.

---

### GET /api/groups/:groupId 🔑

Returns group details including members and recent entries. Requires group membership.

**Query parameters:**

| Param | Type | Default | Max |
|---|---|---|---|
| `limit` | integer | 50 | 100 |
| `offset` | integer | 0 | — |

**Response:**
```json
{
  "group": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "The Porcelain Crew",
    "description": "We hold each other accountable",
    "createdBy": "user_abc123",
    "currentStreak": 5,
    "longestStreak": 12,
    "timezone": "America/New_York",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "members": [
    {
      "userId": "user_abc123",
      "username": "jordan",
      "role": "admin",
      "deuceCount": 42,
      "profileImageUrl": "https://..."
    }
  ],
  "entries": [
    {
      "id": "entry-uuid",
      "location": "The Office",
      "thoughts": "Monday blues",
      "loggedAt": "2026-03-13T10:30:00.000Z",
      "ghost": false,
      "user": { "username": "jordan", "profileImageUrl": "https://..." }
    }
  ]
}
```

---

### DELETE /api/groups/:groupId/members/:userId 🔑

Removes a member from a group. Users can remove themselves. Admins can remove others.

**Response:** `{ "ok": true }`

**Errors:**
- `403` — Non-admin trying to remove someone else

---

## Invites

### POST /api/groups/:groupId/invite 🔑 👑

Creates a shareable invite link (valid for 7 days). Requires group membership. Requires premium.

**Response:**
```json
{
  "inviteLink": "https://deuce-diary-web-production.up.railway.app/join/550e8400-e29b-41d4-a716-446655440001",
  "id": "550e8400-e29b-41d4-a716-446655440001"
}
```

---

### POST /api/join/:inviteId 🔑

Joins a group using an invite code. Invite must be a valid UUID and not expired.

**Response:**
```json
{
  "group": { "id": "...", "name": "The Porcelain Crew" }
}
```

If already a member:
```json
{
  "group": { ... },
  "message": "Already a member of this group"
}
```

**Errors:**
- `400` — Invalid or expired invite
- `403` — Free users cannot join multi-member squads (`{ "feature": "squad_social", "upgrade": true }`)

---

### GET /api/groups/preview/:inviteCode 🔓

Public group preview for the invite landing page. No auth required. Returns slim public data (no sensitive fields).

**Response:**
```json
{
  "name": "The Porcelain Crew",
  "memberCount": 4,
  "deuceCount": 127,
  "currentStreak": 5,
  "longestStreak": 12,
  "members": [
    { "username": "jordan", "deuceCount": 42 }
  ],
  "recentActivity": [
    { "username": "jordan", "location": "The Office", "loggedAt": "2026-03-13T10:30:00.000Z" }
  ]
}
```

---

### GET /api/groups/invite-preview/:inviteCode 🔓

Rich invite preview for OG tags and the detailed invite card. No auth required.

**Response:**
```json
{
  "name": "The Porcelain Crew",
  "description": "We hold each other accountable",
  "memberCount": 4,
  "deuceCount": 127,
  "currentStreak": 5,
  "longestStreak": 12,
  "memberNames": ["jordan", "alex", "sam", "taylor"]
}
```

---

## Locations

### GET /api/locations 🔑

Returns saved locations for the authenticated user, including app-wide defaults.

**Response:**
```json
[
  { "id": 1, "name": "Home", "isDefault": true, "createdBy": null },
  { "id": 2, "name": "The Executive Suite", "isDefault": false, "createdBy": "user_abc123" }
]
```

---

### POST /api/locations 🔑

Creates a custom location.

**Request:** `{ "name": "The Executive Suite" }` (1–100 chars)

**Response:** Created location object `{ id, name, isDefault, createdBy }`.

**Errors:**
- `400` — Location name is required
- `400` — Location already exists

---

## Deuce Entries

### GET /api/deuces 🔑

Returns the activity feed for the authenticated user's groups.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `groupId` | UUID | Filter to a single group (must be a member) |
| `limit` | integer | Max entries (default 50, max 100) |
| `offset` | integer | Pagination offset (default 0) |

**Response:** Array of entry objects.

---

### POST /api/deuces 🔑

Logs a new deuce entry. Can target multiple groups in a single call.

**Rate limit:** 10 logs per user per UTC day.

**Request:**
```json
{
  "location": "The Office",
  "thoughts": "Finally, some peace and quiet",
  "groupIds": ["550e8400-e29b-41d4-a716-446655440000"],
  "loggedAt": "2026-03-13T10:30:00.000Z",
  "ghost": false,
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `location` | string | Yes | 1–100 chars |
| `thoughts` | string | No | max 500 chars |
| `groupIds` | UUID[] | One of `groupIds`/`groupId` | At least 1 |
| `groupId` | UUID | One of `groupIds`/`groupId` | Backward compat |
| `loggedAt` | ISO 8601 string | No | Cannot be in the future (1 min tolerance) |
| `ghost` | boolean | No | Ghost logs are hidden from group feed + WebSocket |
| `latitude` | number | No | −90 to 90 |
| `longitude` | number | No | −180 to 180 |

**Response:**
```json
{
  "entries": [{ ... }],
  "count": 1
}
```

Side effects:
- Increments `user.deuceCount` (once, regardless of group count)
- Recalculates streak for each group
- Broadcasts `deuce_logged` WebSocket event to group members (skip for ghost)
- Fires reverse-geocode → passport stamp (async, fire-and-forget) if lat/lng provided

**Errors:**
- `429` — Daily limit reached (`"Throne limit reached for today. Come back tomorrow."`)
- `400` — Future date, invalid groupId, missing group
- `403` — Not a member of a specified group

---

### POST /api/deuces/bulk 🔑

Atomically logs a deuce to **multiple groups** in a single DB transaction. Requires 2+ groups (use `/api/deuces` for single group).

**Request:** Same schema as `POST /api/deuces` with `groupIds` containing ≥2 entries.

**Response:** Same as `POST /api/deuces`.

---

### POST /api/deuces/sync 🔑

Syncs offline-queued deuce entries. Processes entries in order; each entry is validated independently.

**Request:**
```json
{
  "entries": [
    {
      "id": "client-local-uuid",
      "location": "Airport Terminal",
      "thoughts": "Gate C-42",
      "groupIds": ["550e8400-e29b-41d4-a716-446655440000"],
      "loggedAt": "2026-03-12T14:00:00.000Z"
    }
  ]
}
```

Max 50 entries per request. Entries missing `loggedAt` use server time.

**Response:**
```json
{
  "results": [
    { "id": "client-local-uuid", "status": "ok" },
    { "id": "client-local-uuid-2", "status": "error", "reason": "Daily limit reached" }
  ],
  "synced": 1
}
```

---

## Reactions

### POST /api/entries/:entryId/reactions 🔑

Adds an emoji reaction to an entry. User must be in the entry's group.

**Request:** `{ "emoji": "💩" }` (1–10 chars)

**Response:** Created reaction object.

**Errors:**
- `400` — Already reacted with this emoji
- `403` — Not in the entry's group

---

### DELETE /api/entries/:entryId/reactions 🔑

Removes a reaction. User must be in the entry's group.

**Request:** `{ "emoji": "💩" }`

**Response:** `{ "message": "Reaction removed" }`

---

### GET /api/entries/:entryId/reactions 🔑

Returns all reactions for an entry. User must be in the entry's group.

**Response:** Array of reaction objects `{ emoji, userId, username, createdAt }`.

---

## Streaks

### GET /api/groups/:groupId/streak 🔑

Returns streak data and today's log status per member.

**Response:**
```json
{
  "currentStreak": 5,
  "longestStreak": 12,
  "lastStreakDate": "2026-03-13",
  "memberCount": 4,
  "logsToday": [
    {
      "userId": "user_abc123",
      "username": "jordan",
      "hasLogged": true,
      "profileImageUrl": "https://..."
    }
  ]
}
```

Note: If `lastStreakDate` is older than yesterday, `currentStreak` is returned as `0` (stale streak reset).

---

### POST /api/groups/:groupId/streak/check 🔑

Checks which members haven't logged today (streak risk check).

**Response:**
```json
{
  "atRisk": true,
  "missingMembers": ["alex", "sam"]
}
```

---

## Leaderboard & Analytics

### GET /api/groups/:groupId/leaderboard 🔑

Returns weekly/monthly/all-time log counts per member with MVP designation.

**Response:** Array of member stats objects.

---

### GET /api/groups/:groupId/spy 🔑 👑

Squad Spy Mode — returns typical log hour per member.

**Response:** Array of `{ userId, username, typicalHour }` objects.

---

### GET /api/groups/:groupId/weekly-report 🔑 👑

Weekly Throne Report — group-level summary for the current week.

**Response:**
```json
{
  "groupName": "The Porcelain Crew",
  "weekOf": "2026-03-09",
  "weekEnding": "2026-03-15",
  "groupStats": {
    "totalDeucesThisWeek": 18,
    "currentStreak": 5,
    "longestStreak": 12
  },
  "mvp": { "username": "jordan", "deuceCount": 7 },
  "members": [
    {
      "username": "jordan",
      "deucesThisWeek": 7,
      "streakStatus": "active"
    }
  ],
  "funnyStats": {
    "longestGap": { "username": "alex", "gapDays": 3 },
    "mostReactionsReceived": { "username": "sam", "reactionCount": 12 },
    "funniestEntry": { "thought": "Needed a moment", "username": "jordan", "reactions": 5 }
  }
}
```

---

### GET /api/groups/:groupId/weekly-report/pdf 🔑 👑

Downloads the Weekly Throne Report as a formatted PDF.

**Response:** `application/pdf` file download (`throne-report-<weekOf>.pdf`).

Premium feature: `report_export`.

---

### GET /api/analytics/me 🔑 👑

Premium personal analytics — log frequency, patterns, streaks over time.

**Response:** Analytics object from `storage.getPremiumAnalytics()`.

---

### GET /api/analytics/most-deuces 🔑 👑

Returns the user's best day (most deuces in a single day).

**Response:** `{ "date": "2026-03-01", "count": 3 }`

---

### GET /api/users/:userId/weekly-report 🔑 👑

Personal weekly report. Only accessible for the authenticated user's own data (IDOR-protected). Use `me` as the userId alias.

**Response:** Weekly report object.

---

## Referrals

### GET /api/referral 🔑

Returns the authenticated user's referral code and link.

**Response:**
```json
{
  "code": "JORDAN42",
  "referralCount": 2,
  "referralLink": "https://deuce-diary-web-production.up.railway.app/join?ref=JORDAN42"
}
```

---

### POST /api/referral/apply 🔑

Applies a referral code. Can only be done once per account and not with your own code.

**Request:** `{ "code": "FRIEND99" }` (1–20 chars, case-insensitive)

**Response:** `{ "ok": true, "referrerUsername": "friend" }`

**Errors:**
- `400` — Invalid code, self-referral, or already used a referral

Side effects: When the referrer accumulates 3 referrals, they receive 30 days of free premium.

---

### GET /api/referral/stats 🔑 👑

Detailed referral stats (premium only).

**Response:** Referral stats from `storage.getReferralStats()`.

---

### GET /api/referrals/stats 🔑

Referral dashboard stats (no premium gate).

**Response:** Dashboard stats from `storage.getReferralDashboardStats()`.

---

### GET /api/referrals/leaderboard 🔑

Referral leaderboard — top referrers.

**Response:** Leaderboard from `storage.getReferralLeaderboard()`.

---

## Subscriptions

### GET /api/subscription 🔑

Returns the user's current subscription status.

**Response:**
```json
{
  "tier": "premium",
  "expiresAt": "2026-12-31T00:00:00.000Z",
  "features": ["custom_themes", "streak_insurance", "gold_badge", "priority_support", "detailed_analytics"]
}
```

`tier` is `"premium"` or `"free"`. `features` is empty for free users.

---

### POST /api/subscription/streak-insurance 🔑 👑

Uses streak insurance to preserve an at-risk streak for today. One use per month.

**Response:**
```json
{
  "used": true,
  "extended": true,
  "message": "Streak preserved!"
}
```

**Errors:**
- `400` — Insurance already used this month

---

### POST /api/subscription/upgrade 🔑 *(dev mode only)*

Grants premium subscription. Only available when Clerk is disabled (dev/test mode). Real subscriptions are handled via RevenueCat webhook.

**Request:** `{ "plan": "monthly" | "annual" }`

**Response:** Updated user object.

---

## Push Notifications

### POST /api/notifications/register 🔑

Registers an Expo push token for the authenticated user. Max 10 tokens per user.

**Request:**
```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "platform": "ios"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `token` | string | Yes | Valid Expo push token |
| `platform` | `"ios"` \| `"android"` | Yes | |

**Response:** `{ "ok": true }`

**Errors:**
- `400` — Invalid Expo push token format
- `400` — Maximum 10 devices reached

---

### DELETE /api/push/unregister 🔑

Removes a push token (e.g., on logout or device switch).

**Request:** `{ "token": "ExponentPushToken[...]" }`

**Response:** `{ "ok": true }`

---

### PUT /api/notifications/reminder 🔑 👑

Sets a daily reminder time (premium).

**Request:**
```json
{
  "hour": 9,
  "minute": 0
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `hour` | integer | Yes | 0–23 |
| `minute` | integer | Yes | 0–59 |

**Response:** `{ "reminderHour": 9, "reminderMinute": 0 }`

---

### POST /api/squads/:id/broadcast 🔑 👑

Sends a milestone broadcast to all group members (Throne Broadcast feature).

**Request:** `{ "milestone": "Jordan hit 100 deuces!" }` (1–200 chars)

**Response:**
```json
{
  "broadcast": { "id": "...", "milestone": "Jordan hit 100 deuces!", "createdAt": "..." },
  "tokenCount": 4
}
```

---

## Challenges & Bingo

### GET /api/challenges/today 🔑 👑

Returns the daily challenge and completion status.

**Response:**
```json
{
  "challenge": {
    "title": "Speed Demon",
    "description": "Log 3 entries in under an hour"
  },
  "date": "2026-03-13",
  "completed": false
}
```

---

### POST /api/challenges/complete 🔑 👑

Marks today's daily challenge as complete. Awards +1 to deuce count.

**Response:**
```json
{
  "completion": { "userId": "...", "challengeDate": "2026-03-13" },
  "bonusAwarded": true
}
```

**Errors:**
- `400` — Challenge already completed today

---

### GET /api/bingo/current 🔑 👑

Gets or creates the current month's bingo card for the authenticated user.

**Response:**
```json
{
  "id": "card-uuid",
  "userId": "user_abc123",
  "month": "2026-03",
  "squares": [
    {
      "id": 0,
      "title": "Early Bird",
      "description": "Log before 7am",
      "condition_type": "time_before",
      "condition_value": 7,
      "completed": false
    }
  ],
  "completedCount": 0
}
```

The 25 bingo squares are randomly shuffled each month. Cards containing deprecated Bristol/photo squares are automatically regenerated.

---

## Deuce King

### GET /api/groups/:groupId/king 🔑

Returns the current Deuce King and active challenge for the group.

**Response:**
```json
{
  "king": {
    "id": "king-uuid",
    "userId": "user_abc123",
    "username": "jordan",
    "profileImageUrl": "https://...",
    "logCount": 14,
    "consecutiveWins": 2,
    "periodStart": "2026-03-06T00:00:00.000Z",
    "periodEnd": "2026-03-13T00:00:00.000Z"
  },
  "challenge": {
    "id": "challenge-uuid",
    "title": "Log Before 7am",
    "templateKey": "early_bird",
    "periodStart": "...",
    "periodEnd": "...",
    "completionCount": 3,
    "isAutoSelected": true
  },
  "templates": [ ... ]
}
```

`king` and `challenge` may be `null` if not yet determined.

---

### GET /api/groups/:groupId/challenge/history 🔑

Returns the last 10 challenge+king periods for the group.

**Response:** Array of history objects.

---

### GET /api/groups/:groupId/challenge 🔑

Returns the currently active challenge for the group.

---

### POST /api/groups/:groupId/challenge 🔑

Sets a new challenge (Deuce King only). Accepts a template key or custom title.

**Request:**
```json
{
  "templateKey": "early_bird"
}
```
or:
```json
{
  "title": "Custom Challenge Title"
}
```

**Errors:**
- `403` — Not the current Deuce King

---

### POST /api/groups/:groupId/challenge/complete 🔑

Marks the current challenge as completed for the authenticated user.

**Response:** Completion object.

---

## Passport (Location History)

### GET /api/passport 🔑 👑

Returns the authenticated user's passport stamps and stats.

**Response:**
```json
{
  "stamps": [
    {
      "id": "stamp-uuid",
      "city": "New York",
      "country": "United States",
      "countryCode": "US",
      "region": "NY",
      "latitude": "40.7128",
      "longitude": "-74.0060",
      "logCount": 5,
      "firstVisit": "2026-01-15T00:00:00.000Z",
      "lastVisit": "2026-03-10T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalCountries": 3,
    "totalCities": 8,
    "totalLogs": 42
  }
}
```

---

### GET /api/passport/:userId 🔓

Public share view of a user's passport. No auth required.

**Response:** Same as `GET /api/passport` plus `user: { id, username, firstName, profileImageUrl }`.

---

### DELETE /api/passport 🔑

Deletes all passport location data for the authenticated user (privacy).

**Response:** `{ "message": "Passport data deleted" }`

---

## Social Sharing

### GET /api/share/streak/:userId 🔓

Returns share card data for a user's streak (used by the frontend share card component).

**Response:**
```json
{
  "username": "jordan",
  "currentStreak": 5,
  "longestStreak": 12,
  "totalLogs": 42,
  "squadCount": 2,
  "memberSince": "2026-01-01T00:00:00.000Z"
}
```

---

### GET /api/og/streak/:userId 🔓

Returns an HTML page with OG meta tags for social sharing a user's streak card. Designed for link crawlers (Twitter/Discord unfurls).

**Response:** `text/html` with OpenGraph and Twitter Card meta tags.

---

### GET /api/og/invite/:inviteCode 🔓

Returns an HTML page with OG meta tags for a group invite link. Validates invite UUID format to prevent injection.

**Response:** `text/html` with rendered invite card and CTA button.

---

### GET /api/users/:username/legacy 🔓

Returns legacy wall stats for a user by username.

**Response:**
```json
{
  "totalLogs": 42,
  "longestStreak": 12,
  "bestDay": { "date": "2026-03-01", "count": 3 },
  "memberSince": "2026-01-01T00:00:00.000Z",
  "title": "Seasoned Squatter"
}
```

---

## Admin Endpoints

### GET /api/admin/stats 🔧

Returns aggregate platform stats. Requires `X-Admin-Key` header.

```
GET /api/admin/stats
X-Admin-Key: <ADMIN_KEY>
```

**Response:** Stats object from `storage.getAdminStats()`.

**Errors:**
- `401` — Missing or invalid key

---

## Internal Endpoints

These are intended for cron jobs and internal service-to-service calls. Require `X-Internal-Key` header.

### POST /api/internal/streak-check 🔧

Triggers streak notifications for all groups. Run daily by cron.

```
POST /api/internal/streak-check
X-Internal-Key: <INTERNAL_API_KEY>
```

**Response:** Summary from `checkAllGroupStreaksAndNotify()`.

---

### POST /api/internal/crown-transfer 🔧

Calculates weekly Deuce Kings across all groups and transfers crowns. Run weekly (Monday) by cron.

```
POST /api/internal/crown-transfer
X-Internal-Key: <INTERNAL_API_KEY>
```

**Response:**
```json
{
  "processed": 12,
  "results": [
    { "groupId": "...", "winner": "user_abc123" },
    { "groupId": "...", "winner": null, "error": "No logs this period" }
  ]
}
```

---

### GET /api/internal/errors 🔧

Returns recent server errors from the in-memory error tracker.

```
GET /api/internal/errors?limit=50
X-Internal-Key: <INTERNAL_API_KEY>
```

**Query params:** `limit` (default 50, max 200)

**Response:** `{ "errors": [...], "count": 12 }`

---

### GET /api/internal/health/detailed 🔧

Returns detailed health including DB pool stats and memory usage.

```
GET /api/internal/health/detailed
X-Internal-Key: <INTERNAL_API_KEY>
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-13T10:00:00.000Z",
  "uptime": 86400.5,
  "db": {
    "connected": true,
    "poolTotal": 10,
    "poolIdle": 8,
    "poolWaiting": 0
  },
  "memory": {
    "rss": "120 MB",
    "heapUsed": "80 MB",
    "heapTotal": "100 MB",
    "external": "5 MB"
  },
  "avgResponseTimeMs": 12
}
```

---

## Error Response Format

All error responses follow a consistent shape:

```json
{ "message": "Human-readable error description" }
```

Premium upgrade errors include additional fields:

```json
{
  "message": "Premium required for this feature",
  "feature": "squad_spy",
  "upgrade": true
}
```

| Status | Meaning |
|---|---|
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 402 | Premium required |
| 403 | Forbidden (authenticated but not authorized) |
| 404 | Resource not found |
| 429 | Rate limited |
| 500 | Internal server error |
| 503 | Service degraded (DB unreachable) |
