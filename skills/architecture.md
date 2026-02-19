---
summary: "Full-stack overview — React/Vite frontend, Express backend, PostgreSQL+Drizzle, WebSocket layer."
links: [auth, database, api, websocket]
---
# Architecture

Deuce Diary is a TypeScript monolith. A single Express process serves the REST [[api]], hosts the [[websocket]] server, and — in production — serves the compiled React bundle as static files. There is no separate API gateway, no microservices, and no CDN in the current setup.

---

## Frontend

- **Framework**: React 18 with TypeScript
- **Build tool**: Vite (dev server with HMR; `vite build` for production)
- **Routing**: Wouter (lightweight, ~2 KB — no React Router)
- **Server state**: TanStack Query (React Query) — all API calls go through query/mutation hooks
- **UI primitives**: Radix UI + shadcn/ui components, Tailwind CSS
- **Real-time**: Native browser WebSocket client — connects to `/ws` on the same origin

The client lives in `client/`. The `@shared` import alias points to `shared/` so the frontend can import Drizzle types and Zod schemas without a separate package boundary.

---

## Backend

- **Runtime**: Node.js with Express.js, TypeScript compiled via `tsx` in dev / `esbuild` in prod
- **[[auth]]**: Local dev auth in `server/replitAuth.ts` — session-based, PostgreSQL-backed
- **[[database]]**: Drizzle ORM against PostgreSQL; schema in `shared/schema.ts`
- **[[websocket]]**: `ws` library, `WebSocketServer` attached to the HTTP server at path `/ws`
- **Image processing**: `multer` (upload) + `sharp` (resize to 200×200 JPEG)
- **File uploads**: Stored under `dist/public/uploads/`, served as static files

The server entry point is `server/index.ts`. It creates the Express app, registers routes via `registerRoutes()` (which also creates the HTTP + WS servers), then starts listening.

---

## Database

PostgreSQL is the single datastore for everything: application data, user sessions, and group membership. Drizzle ORM provides a type-safe query builder and `drizzle-kit` handles migrations via `npm run db:push`. See [[database]] for the full schema.

---

## Data Flow — Logging a Deuce

1. Frontend calls `POST /api/deuces` with `{ groupIds[], location, thoughts, loggedAt }`.
2. Server validates membership for each groupId, creates one `deuceEntries` row per group.
3. Server increments the user's `deuceCount` once (not per group).
4. Server calls `broadcastToGroup()` for each groupId, emitting a `deuce_logged` event over [[websocket]].
5. All connected group members receive the event and TanStack Query invalidates the group's entry list.

---

## Directory Structure

```
/
├── client/          React/Vite app
├── server/          Express + WS server
│   ├── index.ts     Entry point
│   ├── routes.ts    All API routes + WS server
│   ├── replitAuth.ts  Auth middleware
│   ├── storage.ts   DB access layer
│   └── db.ts        Drizzle client
├── shared/
│   └── schema.ts    Drizzle tables + Zod schemas (shared by both sides)
└── dist/            Build output (gitignored)
```
