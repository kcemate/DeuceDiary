# App Store Review Notes — Deuce Diary

## Demo Credentials

**Dev mode login** (no password required):
- Username: `reviewer` (or any string)
- Endpoint: `POST /api/login` with `{ "username": "reviewer" }`
- Auto-creates a "Solo Deuces" group on first login

**Premium access** (for testing gated features):
- After login, call `POST /api/subscription/upgrade` with `{ "plan": "monthly" }`
- Or simulate via RevenueCat webhook: `POST /api/webhooks/revenuecat`

## App Explanation

Deuce Diary is a social bathroom logging app. Users track their bathroom visits ("deuces") privately or in groups ("squads"). The app focuses on accountability through streaks — all squad members must log daily to keep the group streak alive.

### Core Features
- **Log deuces**: Record bathroom visits with optional location and thoughts (max 500 chars)
- **Squads**: Create groups, invite friends via shareable links, track group streaks
- **Streaks**: Group streaks advance when ALL members log on the same day
- **Leaderboard**: Rank squad members by total deuce count
- **Reactions**: Emoji reactions on feed entries (premium)
- **Ghost mode**: Log without notifying the squad
- **Daily challenges**: Fun daily prompts for bonus logs (premium)

### Premium Features (via RevenueCat IAP)
- Squad creation and management
- Feed viewing
- Custom themes (dark, cream, midnight)
- Detailed analytics and weekly throne reports
- Streak insurance (once per month)
- Emoji reactions
- Daily challenges
- Custom reminders
- Referral stats
- Milestone broadcasts

## Privacy Disclosure

### Data Collected
- **Account**: Email, first name, last name, profile picture (via Clerk auth)
- **User content**: Bathroom log entries (text-based location, optional thoughts)
- **Usage data**: Internal analytics events stored in our database (login, log creation, group creation)
- **Push tokens**: Expo push notification tokens for streak alerts

### Third-Party Services
| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Clerk | Authentication | Email, name, profile picture (webhook inbound only) |
| RevenueCat | Subscriptions | User ID, subscription events (webhook inbound only) |
| Expo | Push notifications | Device push tokens, notification payloads |
| Sentry | Error reporting (optional) | Error logs, stack traces (disabled by default) |

### Data NOT Collected
- No GPS/geolocation tracking
- No device fingerprinting
- No ad tracking or third-party analytics (no GA, Firebase, Mixpanel, etc.)
- No payment card data (handled entirely by RevenueCat/Apple)
- No health data integration
- No contacts access

## Age Rating

**Recommended: 4+**

- No user-generated content moderation concerns (thoughts field is limited to 500 chars, visible only within private groups)
- No violent, sexual, or objectionable content
- No gambling or contests
- No unrestricted web access
- No social networking with strangers (groups require invite codes)
- Mild bathroom humor theming

## Content Description

- **Cartoon or Fantasy Violence**: None
- **Realistic Violence**: None
- **Sexual Content or Nudity**: None
- **Profanity or Crude Humor**: Mild (bathroom-themed app, "deuce" terminology)
- **Alcohol, Tobacco, or Drug Use**: None
- **Simulated Gambling**: None
- **Horror/Fear Themes**: None
- **Medical/Treatment Information**: None
- **Unrestricted Web Access**: None

## Technical Notes for Review

- Backend: Express.js + PostgreSQL (Drizzle ORM)
- Frontend: React + Vite
- Auth: Clerk (JWT-based in production)
- Payments: RevenueCat (server-side webhook validation)
- Push: Expo push notification service
- Rate limits: 10 deuce logs per user per UTC day, 100 API requests/minute global
- WebSocket: Real-time group feed updates at `/ws`
