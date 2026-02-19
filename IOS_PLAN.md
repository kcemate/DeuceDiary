# Deuce Diary — iOS Rebuild Plan

## Overview

Rebuild Deuce Diary as a native iOS app using **React Native + Expo**. The current web app has a solid backend API and data model — the rebuild strategy is to keep the server as-is and build a native client on top of it.

---

## 1. Tech Stack Choices

### Runtime: Expo (Managed Workflow)

**Why Expo over bare React Native:**
- Faster iteration: OTA updates via EAS Update (no App Store review for JS changes)
- Built-in camera, notifications, secure storage — no native config required
- EAS Build handles CI/CD, code signing, and TestFlight submission from the cloud
- Eject to bare workflow later if you ever need a custom native module

### Navigation: Expo Router (file-based)

- File-based routing mirrors web conventions (`app/(tabs)/index.tsx`)
- Deep link support built-in — important for invite links (`/join/:inviteId`)
- Typed routes with TypeScript out of the box

### State / Server Data: TanStack Query v5

- Already used in the web app — same mental model, same hooks
- Mutations with optimistic updates for snappy UX when logging a deuce

### UI: NativeWind (Tailwind for RN) + custom components

- Current web app is heavily Tailwind — NativeWind lets you reuse the same class names
- For complex components (bottom sheets, emoji pickers) use `@gorhom/bottom-sheet` and `expo-emoji-picker` / a custom picker

### Real-time: Native WebSocket API

- React Native ships with the WebSocket API natively — zero changes needed to the WebSocket logic
- Wrap in a custom `useGroupSocket` hook (mirrors the web app's usage)

### Push Notifications: Expo Notifications + APNs

- `expo-notifications` handles APNs registration, permission prompts, and foreground/background delivery
- Server sends push via Expo Push API (or raw APNs) when a new deuce is logged
- Store `expoToken` on the user record in the DB (add a column)

### Auth: Clerk (production recommendation)

See Section 4 for full auth strategy.

---

## 2. What Can Be Reused from the Current Codebase

### Keep as-is (server-side)
| Asset | Notes |
|---|---|
| `shared/schema.ts` | Drizzle schema is backend-only; copy types to shared package |
| `server/routes.ts` | All API routes work for mobile too — REST is mobile-friendly |
| `server/storage.ts` | Zero changes needed |
| All business logic | Group management, invite flow, reactions, analytics |
| WebSocket server | Works with native WS client |

### Portable to mobile with minor changes
| Asset | Notes |
|---|---|
| Zod schemas / types | Import directly if using a monorepo, or copy to `shared/` |
| TanStack Query fetch logic | Swap `window.fetch` for RN-compatible fetch (built in) |
| Date formatting utilities | `date-fns` works in RN |

### Must be rebuilt
| Asset | Reason |
|---|---|
| All React components | Web DOM components don't run in RN |
| Tailwind CSS | Replace with NativeWind or StyleSheet |
| `client/src/hooks/useAuth.ts` | Rewrite for Clerk's RN SDK |
| Landing page | Replace with native onboarding screens |
| File upload (profile pics) | Use `expo-image-picker` instead of `<input type=file>` |

---

## 3. Auth Strategy for Production

### Recommended: Clerk

**Why Clerk:**
- Native iOS SDK with biometric login (Face ID / Touch ID) out of the box
- Handles phone number auth (great for a social app — no email needed)
- Pre-built UI components for React Native (sign-in, sign-up, profile)
- Webhooks to sync user creation/updates to your Postgres DB
- Free tier is generous; pricing scales reasonably

**Implementation sketch:**
1. Wrap app in `<ClerkProvider>` with your publishable key
2. Use `useSignIn` / `useSignUp` hooks for the auth screens
3. Use `useAuth()` to get a JWT for authenticated API requests
4. Server-side: verify the JWT with Clerk's SDK in `isAuthenticated` middleware — replace the current session-based check
5. On first login, create/update the user row in your DB via a Clerk webhook

**Alternative: Supabase Auth**
- Good if you also want to migrate the database to Supabase (Postgres-compatible)
- RLS (row-level security) could replace some of your `isUserInGroup` checks
- Supabase Realtime could replace the custom WebSocket server
- More infrastructure to manage than Clerk

**Keep local dev auth for dev builds** — the current username-only dev auth is perfect for simulators and local testing. Gate Clerk behind `process.env.NODE_ENV === 'production'`.

---

## 4. What Needs to Be Rebuilt from Scratch

### Screens (all new native components)
- **Onboarding / Auth** — Clerk sign-in, social login buttons, Face ID prompt
- **Home / Feed** — FlatList of groups with last activity
- **Group Detail** — FlatList of deuce entries with pull-to-refresh
- **Log Deuce** — Bottom sheet with location picker, time picker, multi-group selector, thought input
- **Profile** — Avatar (expo-image-picker upload), username edit, deuce count, personal record
- **Invite** — Share sheet integration via `expo-sharing`
- **Notifications** — Push notification permission request, in-app toast

### Navigation shell
- Bottom tab bar with: Feed | Log | Profile
- Stack navigators inside each tab
- Deep link handler for `/join/:inviteId` invite URLs

### Native integrations
- `expo-notifications` — push tokens, foreground handlers
- `expo-image-picker` — profile picture selection + upload
- `expo-sharing` — share invite links natively
- `expo-haptics` — satisfying feedback when logging a deuce
- `@react-native-async-storage/async-storage` — persist query cache between sessions

---

## 5. Phased Milestones

### Phase 1: Foundation (Week 1–2)
- [ ] `npx create-expo-app --template` with TypeScript
- [ ] Set up Expo Router with bottom tab shell
- [ ] Configure TanStack Query with your existing API base URL
- [ ] Integrate Clerk (dev + prod environments)
- [ ] CI: EAS Build + TestFlight distribution for internal testers

**Exit criteria:** App boots on simulator and device; login/logout works via Clerk

---

### Phase 2: Core Screens — Read Path (Week 3–4)
- [ ] Home: group list with member counts and last activity
- [ ] Group Detail: entry feed (FlatList, pull-to-refresh, infinite scroll)
- [ ] Profile screen with deuce count and personal record display
- [ ] WebSocket hook for real-time entry notifications

**Exit criteria:** Tester can browse groups and see live updates

---

### Phase 3: Write Path (Week 5–6)
- [ ] Log Deuce bottom sheet (location, thoughts, time, multi-group select)
- [ ] Emoji reactions with optimistic updates
- [ ] Profile picture upload via `expo-image-picker`
- [ ] Username editing

**Exit criteria:** Full read-write parity with the web app

---

### Phase 4: Native Polish (Week 7–8)
- [ ] Push notifications (APNs token registration, server-side push on new deuce)
- [ ] Invite flow: share link via `expo-sharing`, deep link handling
- [ ] Haptic feedback on deuce log
- [ ] Skeleton loaders, error states, empty states
- [ ] App icon, splash screen, launch screen (Expo's `app.json`)

**Exit criteria:** App feels native; invite links open the app correctly

---

### Phase 5: App Store Submission (Week 9)
- [ ] Privacy policy URL (required by App Store)
- [ ] App Store screenshots (EAS Submit can automate this)
- [ ] Respond to App Review questions
- [ ] Production Clerk environment and backend deployed (non-Replit)

**Exit criteria:** App live on App Store

---

## 6. Backend Additions Needed

| Addition | Why |
|---|---|
| Add `expo_push_token` column to `users` | Store APNs token for push notifications |
| `POST /api/auth/push-token` route | Register device token after login |
| Call Expo Push API in `broadcastToGroup()` | Send push to users not connected via WebSocket |
| Clerk JWT middleware | Replace session-based `isAuthenticated` in production |
| `POST /api/auth/sync` webhook endpoint | Clerk → DB user sync on sign-up/update |

All other existing routes work as-is for mobile.

---

## 7. Monorepo Consideration

If the web app stays alive alongside the iOS app, consider a simple monorepo:

```
/
├── apps/
│   ├── web/          (current Next/Vite app)
│   └── mobile/       (Expo app)
├── packages/
│   └── api-types/    (shared Zod schemas + TS types)
└── server/           (shared Express backend)
```

Use `pnpm workspaces` or Turborepo. The `shared/schema.ts` types move to `packages/api-types` and get imported by both apps.

---

## Summary

The rebuild is primarily a **frontend rewrite** — the Express API, PostgreSQL schema, and business logic are all solid and mobile-compatible. The main work is native screen development, Clerk integration for auth, and push notification wiring. With Expo, the full cycle from zero to TestFlight is achievable in ~9 weeks for a small team.
