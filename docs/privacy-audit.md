# Privacy Audit — Deuce Diary

**Audit date**: 2026-03-02
**Auditor**: Casey (QA)
**Scope**: Full server + client codebase scan

## Executive Summary

Deuce Diary has a **privacy-friendly architecture**. No third-party analytics SDKs, no ad tracking, no device fingerprinting, no geolocation. Data stays in the app's own PostgreSQL database. Only three external services receive data: Clerk (auth), RevenueCat (subscriptions), and Expo (push notifications) — all via one-way webhooks or minimal token delivery.

## Third-Party Services Audit

### Clerk (Authentication)
- **Package**: `@clerk/clerk-react`, `@clerk/clerk-sdk-node`
- **Data flow**: Inbound webhooks only (Clerk → App)
- **Data received**: User ID, email, first name, last name, profile image URL
- **Data sent to Clerk**: None (one-way webhook via Svix-verified `POST /api/webhooks/clerk`)
- **Can be disabled**: Yes (falls back to session-based dev auth when `CLERK_SECRET_KEY` is unset)
- **Verification**: Svix signature verification on all webhook payloads

### RevenueCat (Subscriptions)
- **Data flow**: Inbound webhooks only (RevenueCat → App)
- **Data received**: Event type, `app_user_id`, `expiration_at_ms`
- **Data sent to RevenueCat**: None (one-way webhook at `POST /api/webhooks/revenuecat`)
- **Events handled**: INITIAL_PURCHASE, RENEWAL, PRODUCT_CHANGE, CANCELLATION, EXPIRATION
- **Payment data**: Handled entirely by RevenueCat/Apple — NOT stored in app database

### Expo (Push Notifications)
- **Package**: `expo-server-sdk`
- **Data sent**: Push tokens, notification title/body, data payload `{type, groupId}`
- **Personal data sent**: None (no emails, names, or user content in push payloads)
- **Token storage**: `pushTokens` table (userId, token, platform)
- **User control**: Users can unregister tokens via `DELETE /api/push/unregister`
- **Cleanup**: Invalid/expired tokens automatically removed on `DeviceNotRegistered` error

### Sentry (Error Tracking) — OPTIONAL
- **Package**: `@sentry/node`
- **Status**: Disabled by default (`SENTRY_DSN` env var is empty)
- **Data sent when enabled**: Unhandled exception stack traces, error metadata
- **Does NOT capture**: User behavior, analytics events, personal data
- **Can be disabled**: Yes (omit `SENTRY_DSN`)

## Analytics Tracking Scan

### Internal Analytics (`server/lib/analytics.ts`)
- **Storage**: `analyticsEvents` table in own PostgreSQL database
- **NOT shared** with any third party
- **Events tracked** (6 total):
  | Event | Trigger | Properties |
  |-------|---------|------------|
  | `user_registered` | Clerk webhook (user.created) | userId |
  | `user_login` | GET /api/auth/user | userId |
  | `group_created` | POST /api/groups | userId |
  | `invite_sent` | POST /api/groups/:id/invite | userId |
  | `group_joined` | POST /api/join/:id | userId |
  | `log_created` | POST /api/deuces | userId, `{has_notes: boolean}` |

### Third-Party Analytics
- **Google Analytics**: NOT present
- **Firebase**: NOT present
- **Mixpanel**: NOT present
- **Amplitude**: NOT present
- **Segment**: NOT present
- **Facebook SDK**: NOT present
- **Any ad SDKs**: NOT present

### Client-Side Tracking
- **Tracking scripts in HTML**: None found (only Replit dev banner in development)
- **Tracking cookies**: None (only `connect.sid` session cookie)
- **localStorage**: Only `deuce-theme` (UI theme preference string)

## Personal Data Inventory

### Data Stored in Database

| Table | Personal Data Fields | Retention |
|-------|---------------------|-----------|
| `users` | email, firstName, lastName, username, profileImageUrl | Until account deletion |
| `deuceEntries` | userId, thoughts (free text, max 500 chars), location (text) | Until account deletion |
| `pushTokens` | userId, token, platform | Until unregistered |
| `groups` | createdBy (userId) | Until group deletion |
| `groupMembers` | userId, groupId, role | Until user leaves/removed |
| `invites` | createdBy, groupId | 7-day expiration |
| `reactions` | userId, entryId, emoji | Until removed |
| `referrals` | referrerId, refereeId | Permanent |
| `analyticsEvents` | userId, event name, properties (JSON) | Permanent |
| `sessions` | session data (userId) | 7-day TTL |

### Data NOT Collected
- GPS coordinates or precise location
- Device identifiers (IDFA, GAID, device ID)
- Browser fingerprints
- IP addresses (not logged by app code)
- Phone numbers
- Payment card details
- Health/medical data
- Contact lists
- Photos (except user-uploaded profile picture)
- Browsing history

## Cookie Audit

| Cookie | Purpose | Flags | Lifetime |
|--------|---------|-------|----------|
| `connect.sid` | Express session | httpOnly, secure (prod) | 7 days |

No third-party cookies. No tracking cookies.

## Security Measures

- Session cookies with `httpOnly` flag (no JS access)
- Svix signature verification on Clerk webhooks
- Admin endpoints protected by `X-Admin-Key` header
- Internal endpoints protected by `X-Internal-Key` header
- Rate limiting: 10 logs/day per user, 100 req/min global
- File upload: 5MB limit, image-only via multer + sharp
- Input validation: Zod schemas on user input
- Premium gating: 20+ endpoints require active subscription
- CORS: Restricted to specific allowed origins

## App Store Privacy Label Recommendations

### Data Used to Track You
**None** — No cross-app tracking, no ad networks, no third-party analytics.

### Data Linked to You
- **Contact Info**: Email address (for authentication via Clerk)
- **Identifiers**: User ID
- **Usage Data**: Internal analytics events (stored in own database)

### Data Not Linked to You
- None applicable (all stored data is linked to user ID)

### Data Not Collected
- Location, health, fitness, financial, contacts, browsing history, search history, sensitive info, diagnostics (beyond optional Sentry), advertising data

## Findings & Recommendations

### GREEN (No Issues)
1. No third-party analytics SDKs
2. No ad tracking or cross-app tracking
3. No device fingerprinting or geolocation
4. Minimal external data sharing (auth + subscriptions + push only)
5. All analytics stored internally
6. Session-only cookies with httpOnly

### YELLOW (Minor)
1. **Sentry DSN**: If enabled in production, ensure Sentry data processing agreement is in place
2. **Analytics events**: Consider adding a retention/purge policy for `analyticsEvents` table
3. **Profile pictures**: Uploaded to local filesystem (`dist/public/uploads/`) — consider CDN with access controls for production

### RED (None Found)
No critical privacy issues identified.

## Conclusion

Deuce Diary meets App Store privacy requirements. The app collects minimal personal data, uses no third-party analytics, and stores all user data in its own database. External service integrations (Clerk, RevenueCat, Expo) are limited to their specific purposes with no unnecessary data sharing.
