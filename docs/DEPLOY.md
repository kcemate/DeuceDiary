# Deuce Diary — Deploy Guide

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | No | Server port (default: 5000, Render uses 10000) |
| `NODE_ENV` | Yes | Set to `production` |
| `SESSION_SECRET` | Yes | Random string for session encryption |
| `CLERK_SECRET_KEY` | Yes | Clerk backend API key |
| `CLERK_WEBHOOK_SECRET` | No | Clerk webhook signing secret |
| `INTERNAL_API_KEY` | No | Key for internal cron endpoints |

---

## Option 1: Render (easiest — one click)

The repo includes `render.yaml` for Blueprint deploys.

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect the GitHub repo — Render reads `render.yaml` automatically
4. Set the Clerk env vars when prompted (marked `sync: false`)
5. Click **Apply** — Render provisions the DB, builds, and deploys

**Kyle must do:**
- Create a Clerk project and paste `CLERK_SECRET_KEY` into Render env vars
- After deploy, run DB migrations: open the Render shell and run `npm run db:push`

---

## Option 2: Railway (quick — CLI)

The repo includes `railway.toml`. Railway auto-detects Nixpacks builds.

```bash
# Install CLI
npm i -g @railway/cli

# Login and init
railway login
railway init

# Provision Postgres
railway add --plugin postgresql

# Set env vars
railway variables set NODE_ENV=production
railway variables set SESSION_SECRET=$(openssl rand -hex 32)
railway variables set CLERK_SECRET_KEY=sk_live_...

# Deploy
railway up
```

**Kyle must do:**
- `railway login` with his account
- Set `CLERK_SECRET_KEY` via `railway variables set`
- After deploy: `railway run npm run db:push`

---

## Option 3: Docker (works anywhere)

```bash
# Build
docker build -t deuce-diary .

# Run (example with local Postgres)
docker run -d \
  -p 10000:10000 \
  -e PORT=10000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@host:5432/deuce_diary \
  -e SESSION_SECRET=$(openssl rand -hex 32) \
  -e CLERK_SECRET_KEY=sk_live_... \
  -v deuce-uploads:/app/dist/public/uploads \
  deuce-diary
```

For **Fly.io**:
```bash
fly launch --image deuce-diary
fly postgres create --name deuce-diary-db
fly postgres attach deuce-diary-db
fly secrets set SESSION_SECRET=$(openssl rand -hex 32) CLERK_SECRET_KEY=sk_live_...
```

**Kyle must do:**
- Provide a PostgreSQL instance (Neon, Supabase, RDS, etc.)
- Set `CLERK_SECRET_KEY`
- Run `npm run db:push` against the production DB to create tables

---

## Post-Deploy Checklist

- [ ] Verify `/api/health` returns 200
- [ ] Run `npm run db:push` against production DB
- [ ] Set Clerk webhook URL to `https://<domain>/api/webhooks/clerk`
- [ ] Test login flow end-to-end
