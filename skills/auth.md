---
summary: "Dev username-only auth, express-session with PostgreSQL store, planned Clerk production auth."
links: [clerk-integration, database]
---
# Auth

Authentication has two modes: a local dev stub for running outside Replit, and [[clerk-integration]] planned for production.

---

## Current Dev Auth (`server/replitAuth.ts`)

The current implementation is deliberately minimal — no passwords, no OAuth, no tokens. It exists so the team can run and test the app locally without any external auth service.

**Login flow:**
1. Client POSTs `{ username }` to `POST /api/login`.
2. Server derives a stable `userId` from the username: `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`.
3. Server upserts a user row in the [[database]] (`storage.upsertUser`).
4. Server stores `userId` in `req.session.userId` and saves the session.
5. Client gets `{ ok: true }` and redirects to the app.

**Logout:** `GET /api/logout` destroys the session and redirects to `/`.

**`isAuthenticated` middleware:**
- Reads `req.session.userId`.
- Calls `storage.getUser(userId)` — 401 if no session or user not found.
- Attaches the user object to `req.user` and calls `next()`.
- All protected routes use this middleware.

---

## Session Management

Sessions are stored in PostgreSQL via `connect-pg-simple`, in the `sessions` table (defined in `shared/schema.ts`). Key settings:

| Setting | Value |
|---|---|
| TTL | 7 days |
| Table | `sessions` |
| Cookie | `httpOnly: true`, `secure: false` (dev), `maxAge` 7 days |
| Secret | `SESSION_SECRET` env var |

The session store auto-creates the `sessions` table if missing (`createTableIfMissing: true`).

---

## Production Auth — Clerk (Implemented)

Clerk auth is integrated as a dual-mode system in `server/replitAuth.ts`:

- **Clerk mode** activates when `CLERK_SECRET_KEY` env var is set. The `isAuthenticated` middleware verifies `Authorization: Bearer <jwt>` via `@clerk/clerk-sdk-node`. User records are synced to the DB via a `POST /api/webhooks/clerk` endpoint (verified with svix).
- **Dev mode** activates when no `CLERK_SECRET_KEY` is set. The original session-based username login (`POST /api/login`) continues to work unchanged.

On the client, `@clerk/clerk-react`'s `ClerkProvider` wraps the app when `VITE_CLERK_PUBLISHABLE_KEY` is set (see `client/src/main.tsx`). The `useAuth` hook (`client/src/hooks/useAuth.ts`) exports either a Clerk-backed or dev-backed implementation based on the same env var. API requests automatically attach Bearer tokens in Clerk mode via `client/src/lib/auth-token.ts`.

To activate Clerk: uncomment and fill in `CLERK_SECRET_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`, and `CLERK_WEBHOOK_SECRET` in `.env`.

---

## User Record in DB

On first login, `storage.upsertUser` creates (or updates) a row in the `users` table with:
- `id` — derived slug (dev) or Clerk user ID (prod)
- `email` — auto-generated `name@localhost.dev` (dev) or real email (prod)
- `firstName`, `profileImageUrl` — populated by Clerk webhook in prod

Username (the display name users set themselves) is separate from the login credential — it's updated via `PUT /api/auth/user` and must be 3–20 characters, unique across all users.
