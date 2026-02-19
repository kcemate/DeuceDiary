---
summary: "Entry point — overview of Deuce Diary, key decisions, and map to all skill nodes."
links: [architecture, auth, database, api, websocket, ios-rebuild, clerk-integration, deployment, dev-setup]
---
# Deuce Diary — Skill Graph Index

Deuce Diary is a mobile-first social app for logging bathroom thoughts ("deuces") within private friend groups. Users join groups via invite links, log entries with a location and optional thoughts, react to each other's posts with emoji, and receive real-time notifications. The backend is a stable Express + PostgreSQL API; the frontend is a React/Vite PWA with plans for a native iOS app.

---

## Synthesis — Key Decisions

- **Auth is dev-only username/password**: The current `replitAuth.ts` is a local-dev stub — POST /api/login accepts any username with no password. Production auth will be [[clerk-integration]]. Gate behind `NODE_ENV === 'production'`.
- **Multi-group deuce logging**: `POST /api/deuces` accepts a `groupIds` array and fans out one `deuceEntries` row per group in a single request, then broadcasts a WebSocket event to each group.
- **WebSocket is group-scoped**: Clients send `{ type: "join_group", groupId }` after connecting to `/ws`. The server tracks connections in a `Map<groupId, Set<WebSocket>>`. Only members of a group receive its broadcasts — see [[websocket]].
- **Schema is shared**: `shared/schema.ts` is imported by both the Express server and the Vite frontend via the `@shared` alias. It exports Drizzle table definitions, Zod validators, and inferred TypeScript types — see [[database]].
- **iOS rebuild is frontend-only**: The [[ios-rebuild]] plan keeps the Express API, schema, and business logic entirely as-is. Only the React web client gets replaced with a React Native/Expo app.
- **Profile pictures are server-processed**: Uploads go to `POST /api/auth/user/profile-picture`, processed by `sharp` to 200×200 JPEG, and served as static files under `/uploads/`.

---

## Architecture Overview

Full-stack TypeScript monolith: React/Vite frontend served by the same Express process that hosts the REST API and WebSocket server. PostgreSQL is the single datastore — sessions, user data, group data, and entries all live there. See [[architecture]] for the full picture.

---

## Topic Nodes

| Node | Summary |
|---|---|
| [[architecture]] | Full-stack overview — React/Vite, Express, PostgreSQL+Drizzle, WebSocket layer |
| [[auth]] | Dev username-only auth, session management, planned Clerk production auth |
| [[database]] | Drizzle ORM schema — 7 tables, relations, Zod validators |
| [[api]] | All REST endpoints grouped by domain with request/response shapes |
| [[websocket]] | Real-time layer — WS server, events, client connection pattern |
| [[ios-rebuild]] | Expo managed workflow rebuild plan — 5 phases, tech stack choices |
| [[clerk-integration]] | How to swap in Clerk for production auth — JWT middleware, webhooks |
| [[deployment]] | Current local dev setup, planned production targets, env vars |
| [[dev-setup]] | How to run the project locally from zero |
