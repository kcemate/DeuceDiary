# Deployment Log — Railway

**Date:** 2026-02-20
**Agent:** Riley (DevOps)
**Status:** BLOCKED — Railway CLI requires interactive login

---

## What Was Done

1. **Installed Railway CLI** — `npm install -g @railway/cli` (success)
2. **Added `/api/health` endpoint** — `server/routes.ts` now has an unauthenticated health check at `/api/health` returning `{ status: 'ok', timestamp: '...' }`
3. **Created `railway.toml`** — Build config with nixpacks, health check, and restart policy
4. **Verified `package.json` scripts** — `npm run build` and `npm start` are correctly configured:
   - Build: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
   - Start: `NODE_ENV=production node dist/index.js`

---

## Blocker

Railway CLI login requires an interactive terminal. The `railway login` and `railway login --browserless` commands both fail with "Cannot login in non-interactive mode" in the Claude Code shell. No `RAILWAY_TOKEN` environment variable is set.

---

## Manual Steps for Kyle

Open a regular terminal in `~/Projects/DeuceDiary` and run these commands in order:

### Step 1: Login
```bash
railway login
```
This opens a browser for OAuth. Follow the prompts to authenticate.

### Step 2: Verify login
```bash
railway whoami
```

### Step 3: Initialize project
```bash
railway init
# When prompted, name the project: deuce-diary
```

### Step 4: Provision PostgreSQL
```bash
railway add --plugin postgresql
```
Wait for provisioning, then verify:
```bash
railway variables
```
Railway auto-injects `DATABASE_URL` — confirm it appears in the output.

### Step 5: Set environment variables
```bash
railway variables set NODE_ENV=production
railway variables set SESSION_SECRET=48c5f5d01fbbb0cdfb4137c64c1ae4b352563cd0cd66fb5084d22264ead64e5c
railway variables set PORT=5001
```

**Note:** For production with Clerk auth, also set:
```bash
railway variables set CLERK_SECRET_KEY=<your-clerk-secret-key>
railway variables set VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
railway variables set CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>
```

### Step 6: Deploy
```bash
railway up --detach
```

### Step 7: Watch logs
```bash
railway logs --tail 20
```

### Step 8: Get public URL
```bash
railway domain
```
This generates a `*.up.railway.app` domain.

### Step 9: Verify deployment
```bash
# Health check
curl -s https://<your-domain>.up.railway.app/api/health

# Auth endpoint (should return 401 if not logged in — that's correct)
curl -s -o /dev/null -w '%{http_code}' https://<your-domain>.up.railway.app/api/auth/user
```

### Step 10: Push schema to Railway database
```bash
railway run npm run db:push
```

---

## Environment Variables (names only)

| Variable | Source |
|---|---|
| `DATABASE_URL` | Auto-injected by Railway PostgreSQL plugin |
| `NODE_ENV` | Set manually → `production` |
| `SESSION_SECRET` | Set manually |
| `PORT` | Set manually → `5001` |
| `CLERK_SECRET_KEY` | Set manually (when enabling Clerk) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Set manually (when enabling Clerk) |
| `CLERK_WEBHOOK_SECRET` | Set manually (when enabling Clerk) |

---

## Files Changed

- `server/routes.ts` — Added `/api/health` endpoint (unauthenticated)
- `railway.toml` — Created with nixpacks builder, health check, and restart policy

---

## Next Steps

1. **Kyle runs the manual steps above** to complete the Railway deployment
2. **Run `railway run npm run db:push`** to apply the Drizzle schema to the Railway PostgreSQL
3. **Configure Clerk for production** — set Clerk env vars if using Clerk auth in prod
4. **Set up custom domain** (optional) — `railway domain add yourdomain.com`
5. **Configure Clerk webhook** — point Clerk webhook to `https://<domain>/api/webhooks/clerk`
6. **Move uploads to object storage** — profile picture uploads currently go to local filesystem (`dist/public/uploads/`), which won't persist across Railway deploys. Migrate to S3/R2/Cloudflare before production use.
7. **Set up GitHub auto-deploy** — link the Railway project to the GitHub repo for automatic deploys on push to `main`
