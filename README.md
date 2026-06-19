# DeuceDiary

DeuceDiary is a full-stack social tracking app with user accounts, groups, streaks, leaderboards, challenges, badges, notifications, and premium flows.

The project is useful as a portfolio sample because it spans product UX, authenticated API design, realtime/social mechanics, persistence, observability, and test coverage.

## What It Shows

- React web client with mobile-first UI patterns.
- Express API with typed validation and structured routes.
- Group and leaderboard mechanics for social engagement.
- Streaks, badges, weekly reports, referrals, and challenge flows.
- Push notification and websocket infrastructure.
- Clerk authentication integration plus local auth utilities.
- Database schema and migration workflow through Drizzle.
- Vitest and Supertest coverage across API, auth, edge cases, and UI components.

## Tech Stack

- React
- TypeScript
- Express
- Drizzle ORM
- PostgreSQL-compatible database tooling
- Clerk auth
- Vite
- Vitest
- Tailwind/Radix UI

## Run Locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Useful Commands

```bash
npm run check
npm test
npm run build
npm start
```

## Project Structure

```text
client/      React app and UI components
server/      Express API, auth, notifications, storage, tests
shared/      Shared schemas and types
migrations/  Database migrations
docs/        Operational and implementation notes
```

## Recruiter Notes

This repo is intentionally broader than a toy app. It demonstrates shipping a consumer product surface with backend behavior, monetization hooks, notifications, test coverage, and iterative hardening.
