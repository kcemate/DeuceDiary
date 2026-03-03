# Deuce Diary — REST API Reference

**Base URL:** `https://deuce-diary-web-production.up.railway.app`
**Auth:** Clerk JWT (production) or session (development)
**Content-Type:** `application/json` (unless noted)

---

## Table of Contents

- [Authentication](#authentication)
- [Health & Admin](#health--admin)
- [Webhooks](#webhooks)
- [Auth / User](#auth--user)
- [Groups](#groups)
- [Invites](#invites)
- [Locations](#locations)
- [Deuce Entries](#deuce-entries)
- [Reactions](#reactions)
- [Streaks](#streaks)
- [Leaderboard](#leaderboard)
- [Referrals](#referrals)
- [Subscriptions](#subscriptions)
- [Analytics (Premium)](#analytics-premium)
- [Challenges (Premium)](#challenges-premium)
- [Theme (Premium)](#theme-premium)
- [Squad Spy (Premium)](#squad-spy-premium)
- [Throne Broadcast (Premium)](#throne-broadcast-premium)
- [Notifications](#notifications)
- [Custom Reminder (Premium)](#custom-reminder-premium)
- [Public Profiles](#public-profiles)
- [Internal Endpoints](#internal-endpoints)
- [WebSocket](#websocket)
- [Error Codes](#error-codes)

---

## Authentication

### Production (Clerk JWT)
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <clerk_jwt_token>
```

### Development (Session)
In development mode, session-based auth is available:
- `POST /api/login` with `{ "username": "..." }` to create a session
- `GET /api/logout` to destroy the session

### Internal Endpoints
Internal endpoints use header-based API keys:
- **Admin:** `X-Admin-Key` header
- **Internal:** `X-Internal-Key` header

---

## Health & Admin

### GET /api/health

Check server and database connectivity.

**Auth:** None

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-03T12:00:00.000Z",
  "uptime": 86400.123,
  "db": "connected"
}
```

**Response (503):**
```json
{
  "status": "degraded",
  "timestamp": "2026-03-03T12:00:00.000Z",
  "uptime": 86400.123,
  "db": "disconnected"
}
```

---

### GET /api/admin/stats

System-wide statistics.

**Auth:** `X-Admin-Key` header

**Response (200):**
```json
{
  "totalUsers": 1500,
  "premiumUsers": 120,
  "activeUsersToday": 85,
  "totalDeuces": 24500,
  "deucesToday": 312,
  "totalGroups": 340,
  "activeGroups": 180,
  "avgStreak": 4.2
}
```

**Errors:**
| Code | Message |
|------|---------|
| 401 | Unauthorized |

---

## Webhooks

### POST /api/webhooks/clerk

Clerk user sync webhook. Handles `user.created` and `user.updated` events.

**Auth:** Svix signature verification (headers: `svix-id`, `svix-timestamp`, `svix-signature`)

**Request body:** Clerk webhook event payload (raw JSON)

**Response (200):**
```json
{ "received": true }
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Missing svix headers |
| 400 | Invalid webhook signature |
| 500 | Webhook secret not configured |

---

### POST /api/webhooks/revenuecat

RevenueCat subscription webhook. Handles purchase, renewal, cancellation, and expiration events.

**Auth:** None (server-to-server, should be restricted by IP in production)

**Request body:**
```json
{
  "event": {
    "type": "INITIAL_PURCHASE",
    "app_user_id": "user_abc123",
    "expiration_at_ms": 1735689600000
  }
}
```

**Supported event types:** `INITIAL_PURCHASE`, `RENEWAL`, `PRODUCT_CHANGE`, `CANCELLATION`, `EXPIRATION`

**Response (200):**
```json
{ "received": true }
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Invalid payload |

---

## Auth / User

### GET /api/auth/user

Fetch the authenticated user's profile.

**Auth:** Required

**Response (200):**
```json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "firstName": "Giovanni",
  "lastName": "Labs",
  "username": "gio",
  "profileImageUrl": "/uploads/user_abc123-1709500800000.jpg",
  "deuceCount": 42,
  "subscription": "premium",
  "subscriptionExpiresAt": "2027-03-03T00:00:00.000Z",
  "streakInsuranceUsed": false,
  "theme": "midnight",
  "referralCode": "ABC12345",
  "title": "Regular",
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

**Title tiers:** Rookie (0-9), Regular (10-49), Veteran (50-99), Elite (100-499), Legend (500+)

---

### PUT /api/auth/user

Update the authenticated user's username.

**Auth:** Required

**Request body:**
```json
{ "username": "newusername" }
```

**Response (200):** Updated user object

**Errors:**
| Code | Message |
|------|---------|
| 400 | Username already taken |

---

### POST /api/auth/user/profile-picture

Upload a profile picture. Image is resized to 200x200 JPEG.

**Auth:** Required
**Content-Type:** `multipart/form-data`
**Field name:** `profilePicture`
**Limits:** 5MB max, images only (MIME type must start with `image/`)

**Response (200):** Updated user object with new `profileImageUrl`

**Errors:**
| Code | Message |
|------|---------|
| 400 | No file uploaded |

---

## Groups

### POST /api/groups

Create a new group (squad). Free users limited to 3 squads.

**Auth:** Required

**Request body:**
```json
{
  "name": "Morning Squad",
  "description": "Early risers only"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | 1-100 chars |
| description | string | No | max 500 chars |

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Morning Squad",
  "description": "Early risers only",
  "createdBy": "user_abc123",
  "createdAt": "2026-03-03T12:00:00.000Z"
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Invalid group data: name is required (max 100 chars) |
| 403 | Upgrade to Premium for unlimited squads |

---

### GET /api/groups

List all groups the authenticated user belongs to.

**Auth:** Required

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Morning Squad",
    "description": "Early risers only",
    "createdBy": "user_abc123",
    "createdAt": "2026-03-03T12:00:00.000Z",
    "memberCount": 4,
    "entryCount": 127
  }
]
```

---

### GET /api/groups/:groupId

Get group details including members and recent entries.

**Auth:** Required (must be a member of the group)

**Response (200):**
```json
{
  "group": {
    "id": "uuid",
    "name": "Morning Squad",
    "description": "Early risers only",
    "createdBy": "user_abc123"
  },
  "members": [
    {
      "userId": "user_abc123",
      "role": "member",
      "user": {
        "username": "gio",
        "profileImageUrl": "/uploads/...",
        "deuceCount": 42
      }
    }
  ],
  "entries": [
    {
      "id": "uuid",
      "userId": "user_abc123",
      "groupId": "uuid",
      "location": "Home",
      "thoughts": "Great morning routine",
      "loggedAt": "2026-03-03T08:00:00.000Z",
      "user": { "username": "gio", "profileImageUrl": "..." }
    }
  ]
}
```

**Errors:**
| Code | Message |
|------|---------|
| 403 | Not authorized |
| 404 | Group not found |

---

### GET /api/groups/preview/:inviteCode

Public group preview for invite landing pages. No auth required.

**Auth:** None

**Response (200):**
```json
{
  "name": "Morning Squad",
  "memberCount": 4,
  "deuceCount": 127
}
```

**Errors:**
| Code | Message |
|------|---------|
| 404 | Invite not found or expired |
| 404 | Group not found |

---

## Invites

### POST /api/groups/:groupId/invite

Create an invite link for a group. Invites expire after 7 days.

**Auth:** Required (must be a member)

**Response (200):**
```json
{
  "inviteLink": "https://deuce-diary-web-production.up.railway.app/join/uuid",
  "id": "uuid"
}
```

**Errors:**
| Code | Message |
|------|---------|
| 403 | Not authorized |

---

### POST /api/join/:inviteId

Join a group via invite link. Free users limited to 3 squads.

**Auth:** Required

**Response (200):**
```json
{
  "group": {
    "id": "uuid",
    "name": "Morning Squad"
  }
}
```

If already a member:
```json
{
  "group": { "id": "uuid", "name": "Morning Squad" },
  "message": "Already a member of this group"
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Invalid or expired invite |
| 403 | Upgrade to Premium for unlimited squads |

---

## Locations

### GET /api/locations

List all available locations.

**Auth:** None

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Home",
    "isDefault": true,
    "createdBy": null
  },
  {
    "id": 2,
    "name": "Office",
    "isDefault": true,
    "createdBy": null
  }
]
```

---

### POST /api/locations

Create a custom location.

**Auth:** Required

**Request body:**
```json
{ "name": "Starbucks" }
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | 1-100 chars |

**Response (200):**
```json
{
  "id": 5,
  "name": "Starbucks",
  "isDefault": false,
  "createdBy": "user_abc123"
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Location name is required |
| 400 | Location already exists |

---

## Deuce Entries

### POST /api/deuces

Log a deuce entry. Rate limited to 10 logs per user per UTC day.

**Auth:** Required

**Request body:**
```json
{
  "groupIds": ["uuid1", "uuid2"],
  "location": "Home",
  "thoughts": "What a morning",
  "loggedAt": "2026-03-03T08:15:00.000Z",
  "ghost": false
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| groupIds | string[] | No* | Array of group UUIDs |
| groupId | string | No* | Single group UUID (backward compat) |
| location | string | Yes | 1-200 chars |
| thoughts | string | No | max 500 chars |
| loggedAt | string\|null | No | ISO 8601 datetime, defaults to now |
| ghost | boolean | No | If true, no WebSocket notification sent |

*At least one of `groupIds` or `groupId` must be provided.

**Response (200):**
```json
{
  "entries": [
    {
      "id": "uuid",
      "userId": "user_abc123",
      "groupId": "uuid1",
      "location": "Home",
      "thoughts": "What a morning",
      "loggedAt": "2026-03-03T08:15:00.000Z",
      "ghost": false
    }
  ],
  "count": 1
}
```

**Side effects:**
- Increments user's deuce count
- Recalculates group streak(s)
- Broadcasts WebSocket notification (unless ghost=true)
- Tracks `log_created` analytics event

**Errors:**
| Code | Message |
|------|---------|
| 400 | Invalid deuce entry data |
| 400 | At least one group must be selected |
| 400 | Thought must be 500 characters or less |
| 403 | Not authorized for group {groupId} |
| 429 | Throne limit reached for today. Come back tomorrow. |

---

### GET /api/deuces

Fetch the deuce feed.

**Auth:** Required

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| groupId | string | Filter by group (optional). If omitted, returns entries from all user's groups. |

**Response (200):** Array of deuce entry objects (max 50), most recent first.
```json
[
  {
    "id": "uuid",
    "userId": "user_abc123",
    "groupId": "uuid",
    "location": "Home",
    "thoughts": "Great session",
    "loggedAt": "2026-03-03T08:15:00.000Z",
    "user": {
      "username": "gio",
      "profileImageUrl": "/uploads/..."
    }
  }
]
```

**Errors:**
| Code | Message |
|------|---------|
| 403 | Not authorized |

---

## Reactions

### POST /api/entries/:entryId/reactions

Add an emoji reaction to a deuce entry.

**Auth:** Required (must be in the same group)

**Request body:**
```json
{ "emoji": "💩" }
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| emoji | string | Yes | 1-10 chars |

**Response (200):**
```json
{
  "id": 1,
  "entryId": "uuid",
  "userId": "user_abc123",
  "emoji": "💩"
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Emoji is required |
| 400 | You've already reacted with this emoji |
| 403 | Not authorized to react to this entry |
| 404 | Entry not found |

---

### DELETE /api/entries/:entryId/reactions

Remove a reaction.

**Auth:** Required

**Request body:**
```json
{ "emoji": "💩" }
```

**Response (200):**
```json
{ "message": "Reaction removed" }
```

---

### GET /api/entries/:entryId/reactions

List all reactions on an entry.

**Auth:** Required

**Response (200):**
```json
[
  {
    "id": 1,
    "entryId": "uuid",
    "userId": "user_abc123",
    "emoji": "💩"
  }
]
```

---

## Streaks

### GET /api/groups/:groupId/streak

Get the current streak status for a group.

**Auth:** Required (must be a member)

**Response (200):**
```json
{
  "currentStreak": 12,
  "longestStreak": 30,
  "memberCount": 4,
  "logsToday": [
    {
      "userId": "user_abc123",
      "username": "gio",
      "hasLogged": true,
      "profileImageUrl": "/uploads/..."
    },
    {
      "userId": "user_def456",
      "username": "kyle",
      "hasLogged": false,
      "profileImageUrl": null
    }
  ]
}
```

**Notes:**
- `currentStreak` resets to 0 if `lastStreakDate` is not today or yesterday (gap detected).
- Streak advances only when ALL members have logged for the day.

---

### POST /api/groups/:groupId/streak/check

Check if a group's streak is at risk (any member hasn't logged today).

**Auth:** Required (must be a member)

**Response (200):**
```json
{
  "atRisk": true,
  "missingMembers": ["kyle", "jordan"]
}
```

---

## Leaderboard

### GET /api/groups/:groupId/leaderboard

Group member rankings by total deuce count.

**Auth:** Required (must be a member)

**Response (200):**
```json
[
  {
    "userId": "user_abc123",
    "username": "gio",
    "profileImageUrl": "/uploads/...",
    "deuceCount": 42
  },
  {
    "userId": "user_def456",
    "username": "kyle",
    "profileImageUrl": null,
    "deuceCount": 38
  }
]
```

---

## Referrals

### GET /api/referral

Get the authenticated user's referral code, link, and count.

**Auth:** Required

**Response (200):**
```json
{
  "code": "ABC12345",
  "referralCount": 3,
  "referralLink": "https://deuce-diary-web-production.up.railway.app/join?ref=ABC12345"
}
```

---

### POST /api/referral/apply

Redeem a referral code.

**Auth:** Required

**Request body:**
```json
{ "code": "ABC12345" }
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| code | string | Yes | 1-20 chars |

**Response (200):**
```json
{
  "ok": true,
  "referrerUsername": "gio"
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Referral code is required |
| 400 | Invalid referral code |
| 400 | Cannot use your own referral code |
| 400 | You have already used a referral code |

---

### GET /api/referral/stats

Detailed referral analytics.

**Auth:** Required
**Premium:** `referral_stats`

**Response (200):** Referral statistics object.

---

## Subscriptions

### GET /api/subscription

Get the authenticated user's subscription status and features.

**Auth:** Required

**Response (200):**
```json
{
  "tier": "premium",
  "expiresAt": "2027-03-03T00:00:00.000Z",
  "features": [
    "custom_themes",
    "streak_insurance",
    "gold_badge",
    "priority_support",
    "detailed_analytics"
  ]
}
```

Free tier returns `{ "tier": "free", "expiresAt": null, "features": [] }`.

---

### POST /api/subscription/upgrade

Upgrade subscription (dev mode — no real payment processing).

**Auth:** Required

**Request body:**
```json
{ "plan": "monthly" }
```

| Field | Type | Required | Values |
|-------|------|----------|--------|
| plan | string | Yes | `monthly` (1 month) or `annual` (1 year) |

**Response (200):** Updated user object with new subscription.

---

### POST /api/subscription/streak-insurance

Use monthly streak insurance to preserve at-risk streaks.

**Auth:** Required
**Premium:** `streak_insurance`

**Response (200):**
```json
{
  "used": true,
  "extended": true,
  "message": "Streak preserved!"
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Streak insurance already used this month |

---

## Analytics (Premium)

### GET /api/analytics/me

User analytics: logs per week, typical patterns.

**Auth:** Required
**Premium:** `analytics`

**Response (200):** Analytics object with weekly stats and patterns.

---

### GET /api/analytics/most-deuces

User's highest-log day.

**Auth:** Required
**Premium:** `analytics`

**Response (200):**
```json
{
  "date": "2026-02-14",
  "count": 5
}
```

---

### GET /api/users/:userId/weekly-report

Weekly Throne Report. Use `me` as userId for the authenticated user.

**Auth:** Required
**Premium:** `analytics`

**Response (200):** Weekly report object with stats, patterns, and highlights.

---

## Challenges (Premium)

### GET /api/challenges/today

Fetch today's daily challenge.

**Auth:** Required
**Premium:** `daily_challenges`

**Response (200):**
```json
{
  "challenge": "Log before 8 AM",
  "date": "2026-03-03",
  "completed": false
}
```

**Challenge rotation:** `Log before 8 AM`, `Log at work`, `Log on a weekend`, `3-day streak`, `Log twice today`

---

### POST /api/challenges/complete

Mark today's challenge as complete. Awards +1 streak bonus.

**Auth:** Required
**Premium:** `daily_challenges`

**Response (200):**
```json
{
  "completion": {
    "userId": "user_abc123",
    "challengeDate": "2026-03-03"
  },
  "bonusAwarded": true
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Challenge already completed today |

---

## Theme (Premium)

### GET /api/user/theme

Fetch the user's theme preference.

**Auth:** Required
**Premium:** `custom_themes`

**Response (200):**
```json
{ "theme": "midnight" }
```

---

### PUT /api/user/theme

Update the user's theme.

**Auth:** Required
**Premium:** `custom_themes`

**Request body:**
```json
{ "theme": "midnight" }
```

| Field | Type | Required | Values |
|-------|------|----------|--------|
| theme | string | Yes | `default`, `dark`, `cream`, `midnight` |

**Response (200):**
```json
{ "theme": "midnight" }
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Invalid theme. Must be one of: default, dark, cream, midnight |

---

## Squad Spy (Premium)

### GET /api/groups/:groupId/spy

Typical log hour per group member.

**Auth:** Required (must be a member)
**Premium:** `squad_spy`

**Response (200):** Array of member typical log hours.

---

## Throne Broadcast (Premium)

### POST /api/squads/:id/broadcast

Send a milestone broadcast to a group.

**Auth:** Required (must be a member)
**Premium:** `throne_broadcast`

**Request body:**
```json
{ "milestone": "100 deuces!" }
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| milestone | string | Yes | 1-200 chars |

**Response (200):**
```json
{
  "broadcast": {
    "id": 1,
    "groupId": "uuid",
    "userId": "user_abc123",
    "milestone": "100 deuces!"
  },
  "tokenCount": 3
}
```

---

## Notifications

### POST /api/notifications/register

Register a push notification token.

**Auth:** Required

**Request body:**
```json
{
  "token": "ExponentPushToken[xxxxxx]",
  "platform": "ios"
}
```

| Field | Type | Required | Values |
|-------|------|----------|--------|
| token | string | Yes | 1-500 chars |
| platform | string | Yes | `ios` or `android` |

**Response (200):**
```json
{ "ok": true }
```

---

### DELETE /api/push/unregister

Unregister a push notification token.

**Auth:** Required

**Request body:**
```json
{ "token": "ExponentPushToken[xxxxxx]" }
```

**Response (200):**
```json
{ "ok": true }
```

---

## Custom Reminder (Premium)

### PUT /api/notifications/reminder

Set a daily reminder time.

**Auth:** Required
**Premium:** `custom_reminder`

**Request body:**
```json
{
  "hour": 20,
  "minute": 0
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| hour | integer | Yes | 0-23 |
| minute | integer | Yes | 0-59 |

**Response (200):**
```json
{
  "reminderHour": 20,
  "reminderMinute": 0
}
```

---

## Public Profiles

### GET /api/users/:username/legacy

Public user profile wall.

**Auth:** None

**Response (200):**
```json
{
  "totalLogs": 42,
  "longestStreak": 30,
  "bestDay": {
    "date": "2026-02-14",
    "count": 5
  },
  "memberSince": "2026-01-15T10:00:00.000Z",
  "title": "Regular"
}
```

**Errors:**
| Code | Message |
|------|---------|
| 404 | User not found |

---

## Internal Endpoints

### POST /api/internal/streak-check

Trigger streak check for all groups. Used by cron jobs and manual triggers.

**Auth:** `X-Internal-Key` header

**Response (200):** Streak check summary object.

---

### GET /api/internal/health/detailed

Detailed health check with DB pool stats, memory, uptime, and response times.

**Auth:** `X-Internal-Key` header

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-03T12:00:00.000Z",
  "uptime": 86400.123,
  "db": {
    "connected": true,
    "poolTotal": 20,
    "poolIdle": 18,
    "poolWaiting": 0
  },
  "memory": {
    "rss": "85.2 MB",
    "heapUsed": "42.1 MB",
    "heapTotal": "65.3 MB",
    "external": "2.1 MB"
  },
  "avgResponseTimeMs": 45.2
}
```

---

### GET /api/internal/errors

Fetch recent error log entries.

**Auth:** `X-Internal-Key` header

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 50 | Max errors to return |

**Response (200):**
```json
{
  "errors": [
    {
      "timestamp": "2026-03-03T12:00:00.000Z",
      "method": "POST",
      "path": "/api/deuces",
      "statusCode": 500,
      "message": "Connection refused",
      "stack": "Error: Connection refused\n    at ...",
      "userId": "user_abc123"
    }
  ],
  "count": 1
}
```

---

## WebSocket

**Endpoint:** `ws://<host>/ws`

### Join a Group
```json
{ "type": "join_group", "groupId": "uuid" }
```

### Incoming Messages

**Deuce logged (broadcast to group):**
```json
{
  "type": "deuce_logged",
  "message": "gio logged a new deuce",
  "entry": {
    "id": "uuid",
    "userId": "user_abc123",
    "groupId": "uuid",
    "location": "Home",
    "user": { "username": "gio" }
  },
  "userId": "user_abc123"
}
```

Ghost logs (`ghost: true`) do not trigger WebSocket notifications.

---

## Error Codes

### Global Errors

| Code | Message | Description |
|------|---------|-------------|
| 400 | Various | Validation error (see endpoint-specific messages) |
| 401 | Unauthorized | Missing or invalid auth token / API key |
| 403 | Not authorized | User not a member of the requested group |
| 403 | Premium required | Feature requires premium subscription. Response includes `{ upgrade: true, feature: "feature_name" }` |
| 404 | Not found | Resource does not exist |
| 429 | Too many requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled server error |

### Rate Limits

| Scope | Limit | Window |
|-------|-------|--------|
| Global API | 100 requests | 1 minute |
| Auth endpoints | 10 requests | 1 minute |
| Deuce logging endpoint | 30 requests | 1 minute |
| Per-user daily deuce logs | 10 logs | 1 UTC day |

### Premium Features

| Feature Key | Endpoint |
|-------------|----------|
| `custom_themes` | GET/PUT /api/user/theme |
| `streak_insurance` | POST /api/subscription/streak-insurance |
| `squad_spy` | GET /api/groups/:groupId/spy |
| `analytics` | GET /api/analytics/me, /api/analytics/most-deuces, /api/users/:userId/weekly-report |
| `daily_challenges` | GET /api/challenges/today, POST /api/challenges/complete |
| `custom_reminder` | PUT /api/notifications/reminder |
| `throne_broadcast` | POST /api/squads/:id/broadcast |
| `referral_stats` | GET /api/referral/stats |
