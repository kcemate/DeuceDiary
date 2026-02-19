---
summary: "How to run Deuce Diary locally — prerequisites, .env, install, db:push, dev server."
links: [database, auth]
---
# Dev Setup

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 22+ | Use `nvm` or `fnm` to manage versions |
| PostgreSQL | 16+ | Must be running locally |
| npm | bundled with Node | Or use `pnpm` / `bun` |

---

## 1. Clone & Install

```bash
git clone <repo-url>
cd DeuceDiary
npm install
```

---

## 2. Create the Database

```bash
# In psql or via createdb CLI
createdb deucelocal
```

---

## 3. Configure `.env`

The repo ships with a `.env` (not gitignored — intentionally committed as a dev default). It contains:

```env
DATABASE_URL=postgresql://localhost/deucelocal
SESSION_SECRET=local-dev-secret-change-in-prod
NODE_ENV=development
PORT=5001
```

Adjust `DATABASE_URL` if your Postgres user or host differs (e.g. `postgresql://user:pass@localhost/deucelocal`).

Do **not** put real secrets in this file — it's for local dev only. Production secrets go in the hosting platform's environment config.

---

## 4. Push the Schema

```bash
npm run db:push
```

This runs `drizzle-kit push` and creates all tables in the `deucelocal` database. Re-run after any changes to `shared/schema.ts`. See [[database]] for the full table list.

The `sessions` table is auto-created by `connect-pg-simple` on first server start (it has `createTableIfMissing: true`), but it's also covered by the Drizzle schema push.

---

## 5. Run the Dev Server

```bash
npm run dev
```

This starts `tsx` in watch mode for the Express server. Vite's dev server is attached to the same HTTP server — no separate `npm run dev:client` needed. The app is available at:

```
http://localhost:5001
```

---

## 6. Log In

The [[auth]] system in dev mode accepts any username with no password. On the landing page, enter any name and click Login. A user row is created (or upserted) in the [[database]] automatically.

---

## Common Issues

| Problem | Fix |
|---|---|
| `ECONNREFUSED` on startup | PostgreSQL isn't running — start it with `brew services start postgresql@16` or equivalent |
| `relation "sessions" does not exist` | Run `npm run db:push` first |
| Port 5001 already in use | Change `PORT` in `.env` or kill the process on 5001 |
| Schema mismatch errors after a pull | Run `npm run db:push` to sync schema |

---

## Useful Scripts

```bash
npm run dev       # start dev server with hot reload
npm run build     # production build (vite + esbuild)
npm start         # run production build
npm run db:push   # sync Drizzle schema to DB
```
