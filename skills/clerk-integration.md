---
summary: "Clerk production auth — dual-mode JWT middleware, ClerkProvider, webhook DB sync. Implemented."
links: [auth, database]
---
# Clerk Integration

**Status: Implemented (dual-mode).** Clerk activates when `CLERK_SECRET_KEY` is set; dev username auth is the fallback. The switch is based on env vars, not `NODE_ENV`.

---

## Backend — JWT Middleware (Implemented)

`server/replitAuth.ts` exports a dual-mode `isAuthenticated` middleware:

1. If `CLERK_SECRET_KEY` is set → verifies `Authorization: Bearer <jwt>` via `createClerkClient().verifyToken()`. The Clerk user ID (`payload.sub`) maps to `users.id`.
2. Otherwise → checks `req.session.userId` (dev mode).

Session middleware is always mounted (harmless in Clerk mode, required for dev mode). The `sessions` table remains unused when Clerk is active.

---

## Frontend (Web) — ClerkProvider (Implemented)

`client/src/main.tsx` conditionally wraps `<App />` in `<ClerkProvider>` when `VITE_CLERK_PUBLISHABLE_KEY` is set.

`client/src/hooks/useAuth.ts` exports either:
- `useClerkAuthHook` — uses `useUser()` / `useAuth()` from `@clerk/clerk-react`, syncs the JWT getter to `auth-token.ts`, fetches app user from `/api/auth/user`.
- `useDevAuth` — the original session-cookie query.

`client/src/lib/auth-token.ts` holds a `getToken` function pointer. `queryClient.ts` calls `getAuthToken()` before every fetch to attach `Authorization: Bearer <token>` when in Clerk mode.

---

## Frontend (iOS) — Clerk RN SDK

```tsx
import { ClerkProvider, useSignIn, useAuth } from "@clerk/clerk-expo";

<ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>
```

Use `useSignIn` / `useSignUp` hooks on the auth screens. Clerk's RN SDK supports Face ID / Touch ID and phone number auth out of the box. See [[ios-rebuild]] Phase 1 for integration timing.

---

## Webhook — Syncing Users to DB (Implemented)

`POST /api/webhooks/clerk` in `server/routes.ts`:
- Registered before session middleware (needs raw body for svix signature verification).
- Verifies `svix-id`, `svix-timestamp`, `svix-signature` headers against `CLERK_WEBHOOK_SECRET`.
- On `user.created` / `user.updated`, calls `storage.upsertUser()` with the Clerk user data.
- Only mounted when `clerkEnabled` is true.

---

## Env Vars Required

| Var | Where |
|---|---|
| `CLERK_SECRET_KEY` | Server (backend JWT verification) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Web client |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | iOS client |
| `CLERK_WEBHOOK_SECRET` | Server (svix signature verification) |

---

## Alternative: Supabase Auth

If the team also wants to migrate the database to Supabase (Postgres-compatible), Supabase Auth + RLS can replace both the custom session auth and some of the `isUserInGroup` checks. Supabase Realtime could also replace the custom [[websocket]] server. However, it's more infrastructure to manage and a larger migration than Clerk alone.
