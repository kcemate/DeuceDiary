---
summary: "iOS rebuild plan — Expo managed workflow, Expo Router, TanStack Query, NativeWind, Clerk, 5 phases."
links: [clerk-integration, auth, api]
---
# iOS Rebuild

The strategy is a **frontend rewrite only**. The Express [[api]], PostgreSQL schema, and business logic are kept as-is — they are already mobile-compatible REST endpoints. The rebuild replaces the React/Vite web client with a React Native/Expo app.

---

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Runtime | Expo (managed workflow) | OTA updates (EAS Update), no native config, eject path available |
| Navigation | Expo Router (file-based) | Deep links for `/join/:inviteId` invite URLs built-in |
| Server state | TanStack Query v5 | Already used in web app — same hooks, same mental model |
| Styling | NativeWind (Tailwind for RN) | Reuse Tailwind class names from web app |
| Auth | [[clerk-integration]] | Native iOS SDK, Face ID/Touch ID, phone auth, pre-built UI |
| Real-time | Native WebSocket API | RN ships it built-in; wrap in `useGroupSocket` hook |
| Push notifications | Expo Notifications + APNs | Foreground/background delivery, permission prompts |
| CI/CD | EAS Build + TestFlight | Cloud code signing, no Xcode required locally |

---

## What Gets Reused vs Rebuilt

**Keep as-is (server-side):** `shared/schema.ts` types, `server/routes.ts`, `server/storage.ts`, all business logic, WebSocket server.

**Portable with minor changes:** Zod schemas/types, TanStack Query fetch logic (RN has `fetch` built-in), date-fns utilities.

**Must be rebuilt:** All React components (DOM doesn't run in RN), Tailwind CSS → NativeWind, `useAuth.ts` → Clerk RN SDK, landing page → native onboarding, file upload → `expo-image-picker`.

---

## 5 Phases

### Phase 1 — Foundation (Week 1–2)
- Expo app with TypeScript template
- Expo Router bottom tab shell (Feed | Log | Profile)
- TanStack Query wired to API base URL
- [[clerk-integration]] for dev + prod environments
- EAS Build → TestFlight for internal testers

**Exit criteria:** App boots on simulator; login/logout via Clerk works.

### Phase 2 — Read Path (Week 3–4)
- Home screen: group list with member counts and last activity
- Group Detail: FlatList of entries with pull-to-refresh + infinite scroll
- Profile screen: deuce count, personal record display
- `useGroupSocket` hook for live [[websocket]] notifications

**Exit criteria:** Testers can browse groups and see live updates.

### Phase 3 — Write Path (Week 5–6)
- Log Deuce bottom sheet: location picker, time picker, multi-group selector, thought input
- Emoji reactions with optimistic updates
- Profile picture upload via `expo-image-picker`
- Username editing

**Exit criteria:** Full read-write parity with web app.

### Phase 4 — Native Polish (Week 7–8)
- Push notifications: APNs token registration, server-side push on new deuce
- Invite flow: `expo-sharing` + deep link handler for `/join/:inviteId`
- Haptic feedback on deuce log (`expo-haptics`)
- Skeleton loaders, error/empty states, app icon, splash screen

**Exit criteria:** App feels native; invite links open the app.

### Phase 5 — App Store Submission (Week 9)
- Privacy policy URL
- App Store screenshots (EAS Submit)
- Production [[clerk-integration]] environment + backend deployed off Replit

**Exit criteria:** App live on App Store.

---

## Backend Additions Required

| Addition | Why |
|---|---|
| `expo_push_token` column on `users` | Store APNs token for push |
| `POST /api/auth/push-token` | Register device token after login |
| Expo Push API call in `broadcastToGroup()` | Push to offline users |
| Clerk JWT middleware | Replace session-based [[auth]] in production |
| `POST /api/auth/sync` webhook | Clerk → DB user sync on sign-up/update |

---

## Monorepo Option

If web and iOS coexist long-term, consider:
```
/
├── apps/web/       (current Vite app)
├── apps/mobile/    (Expo app)
├── packages/api-types/  (shared Zod schemas + TS types)
└── server/         (shared Express backend)
```
Use `pnpm workspaces` or Turborepo. `shared/schema.ts` moves to `packages/api-types`.

---

## Current Status

**Expo project scaffolded** at `~/Projects/DeuceDiaryMobile`:
- Expo Router with 3-tab bottom nav (Home, Groups, Profile)
- Login screen with username input + API call to `POST /api/auth/login`
- TanStack Query + Axios API client configured
- Deep link scheme: `deucediary://`
- API base URL via `EXPO_PUBLIC_API_URL` env var (default: `http://localhost:5001`)
