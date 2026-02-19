---
summary: "Drizzle ORM schema — 7 tables plus sessions, relations, Zod validators, shared type exports."
links: [api]
---
# Database

The schema lives in `shared/schema.ts` and is imported by both the Express backend and the Vite frontend via the `@shared` alias. Drizzle ORM provides type-safe queries; `drizzle-kit` handles migrations via `npm run db:push`.

---

## Tables

### `sessions`
Managed by `connect-pg-simple` for express-session storage. Do not drop — it breaks auth.

| Column | Type | Notes |
|---|---|---|
| `sid` | varchar PK | Session ID |
| `sess` | jsonb | Session payload |
| `expire` | timestamp | Indexed for TTL cleanup |

### `users`
One row per authenticated user.

| Column | Type | Notes |
|---|---|---|
| `id` | varchar PK | Derived slug (dev) / Clerk ID (prod) |
| `email` | varchar unique | |
| `firstName`, `lastName` | varchar | |
| `username` | varchar unique | 3–20 chars, user-settable |
| `profileImageUrl` | varchar | Path under `/uploads/` |
| `deuceCount` | integer | Lifetime total, incremented on each POST /api/deuces |
| `createdAt`, `updatedAt` | timestamp | |

### `groups`
A named group that users belong to.

| Column | Type | Notes |
|---|---|---|
| `id` | varchar PK | UUID |
| `name` | varchar | Required |
| `description` | text | Optional |
| `createdBy` | varchar FK → users.id | |

### `groupMembers`
Join table linking users to groups.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `groupId` | varchar FK → groups.id | Cascade delete |
| `userId` | varchar FK → users.id | Cascade delete |
| `role` | varchar | `"member"` or `"admin"` (creator gets admin) |
| `joinedAt` | timestamp | |

### `deuceEntries`
The core content object — one row per group per deuce log (multi-group = multiple rows).

| Column | Type | Notes |
|---|---|---|
| `id` | varchar PK | UUID |
| `userId` | varchar FK → users.id | Cascade delete |
| `groupId` | varchar FK → groups.id | Cascade delete |
| `location` | varchar | Required |
| `thoughts` | text | Required (can be empty string) |
| `loggedAt` | timestamp | User-provided time; not the same as `createdAt` |
| `createdAt` | timestamp | Server insert time |

### `invites`
Time-limited invite tokens for joining a group.

| Column | Type | Notes |
|---|---|---|
| `id` | varchar PK | UUID (used in invite URL) |
| `groupId` | varchar FK → groups.id | Cascade delete |
| `createdBy` | varchar FK → users.id | Cascade delete |
| `expiresAt` | timestamp | 7 days from creation |

### `locations`
Selectable locations for deuce entries. 8 defaults seeded on startup; users can add custom ones.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `name` | varchar | Unique by name check in storage layer |
| `isDefault` | boolean | `true` for the 8 built-in locations |
| `createdBy` | varchar FK → users.id | Null for default locations |

### `reactions`
Emoji reactions on deuce entries. One row per (entry, user, emoji) combination — enforced by a unique constraint.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `entryId` | varchar FK → deuceEntries.id | Cascade delete |
| `userId` | varchar FK → users.id | Cascade delete |
| `emoji` | varchar(10) | e.g. "👍", "🔥" |
| Unique | (entryId, userId, emoji) | Prevents duplicate reactions |

---

## Key Relations

- `users` → `groupMembers` (many) → `groups` (many-to-many)
- `deuceEntries` → `reactions` (many)
- `groups` → `deuceEntries` (many), `invites` (many)

---

## Zod Validators & Type Exports

`shared/schema.ts` exports `createInsertSchema`-derived Zod schemas for server-side validation in [[api]] route handlers:

- `insertGroupSchema` — omits `id`, `createdAt`, `updatedAt`
- `insertDeuceEntrySchema` — omits `id`, `createdAt`
- `insertInviteSchema` — omits `id`, `createdAt`
- `insertReactionSchema` — omits `id`, `createdAt`
- `updateUserSchema` — validates username (3–20 chars, letters/numbers/underscores/spaces)

TypeScript types (`User`, `Group`, `DeuceEntry`, etc.) are inferred directly from the Drizzle table definitions via `$inferSelect` / `$inferInsert`.
