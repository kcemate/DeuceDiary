---
summary: "Current local dev at :5001, planned production targets, required env vars, CI/CD via GitHub Actions."
links: [architecture]
---
# Deployment

---

## Current State — Local Dev

The app runs locally at `http://localhost:5001` (configured via `PORT=5001` in `.env`). The Express server handles both the API and static file serving in a single process. See [[architecture]] for how Vite dev server integrates.

```
npm run dev   → tsx watch server/index.ts (+ Vite HMR middleware attached)
```

The database is a local PostgreSQL instance (`postgresql://localhost/deucelocal` from `DATABASE_URL`).

---

## Production Build

```bash
# 1. Build React client
vite build           # outputs to dist/public/

# 2. Bundle Express server
esbuild server/...   # outputs to dist/server.js

# 3. Run
NODE_ENV=production npm start  # serves static from dist/public/
```

In production, `serveStatic(app)` replaces the Vite dev middleware. Static files (including profile picture uploads under `dist/public/uploads/`) must be persisted across deploys — use a persistent volume or move uploads to object storage (S3/R2) before going to production.

---

## Planned Production Targets

Any Node.js hosting platform with persistent PostgreSQL works. Leading candidates:

| Platform | Notes |
|---|---|
| **Railway** | One-click PostgreSQL addon, automatic deploys from GitHub |
| **Render** | Free tier PostgreSQL (limited), `render.yaml` for IaC |
| **Fly.io** | Docker-based, good for custom port config, volume support for uploads |

For the iOS rebuild, the backend must be publicly accessible (not `localhost`) before Phase 1 exits. Choose and deploy a platform before starting [[ios-rebuild]] Phase 1.

---

## Required Environment Variables

| Var | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | express-session signing secret | Yes (dev auth) |
| `NODE_ENV` | `development` or `production` | Yes |
| `PORT` | Listen port (default 5000 if unset) | Optional |
| `CLERK_SECRET_KEY` | Clerk backend key | Production only |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk web client key | Production only |
| `CLERK_WEBHOOK_SECRET` | svix webhook verification | Production only |

`SESSION_SECRET` can be dropped once [[clerk-integration]] replaces session-based auth in production.

---

## CI/CD — GitHub Actions

A minimal pipeline for production deploys:

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - run: npm run db:push   # apply schema changes
      # Deploy step varies by platform (Railway CLI, Render hook, Fly deploy)
```

For the iOS app, CI/CD is handled by **EAS Build** (Expo's cloud build service) — see [[ios-rebuild]] Phase 1.

---

## Database Migrations

Schema changes go through `drizzle-kit`:

```bash
npm run db:push   # push schema changes directly (dev/staging)
# or
npx drizzle-kit generate && npx drizzle-kit migrate  # generate SQL migrations
```

`db:push` is fine for development and early production. Switch to generated migrations for a team environment to get auditable, reversible schema changes.
