# API Test Report — dd-11

**Date:** 2026-02-20
**Author:** Casey (QA Engineer)
**File:** `server/__tests__/api.test.ts`

---

## Summary

| Metric       | Value        |
|-------------|-------------|
| Total tests | 22          |
| Passed      | 22          |
| Failed      | 0           |
| Pass rate   | **100%**    |
| Duration    | ~52ms       |

---

## Coverage by Domain

### Auth (7 tests)
- Login with new username (creates user, returns `{ ok: true }`)
- Login with existing username (idempotent upsert)
- Login with empty username (400)
- Login with missing username body (400)
- GET /api/auth/user when authenticated (returns user object)
- GET /api/auth/user when not authenticated (401)
- Logout clears session (subsequent auth/user returns 401)

### Groups (7 tests)
- Create group (authenticated) returns group with id
- Create group (unauthenticated) returns 401
- GET /api/groups returns user's groups array
- Join via invite (valid) adds user to group
- Join via invite (invalid) returns 400
- GET /api/groups/:id (member) returns group, members, entries
- GET /api/groups/:id (non-member) returns 403

### Deuces / Entries (5 tests)
- POST /api/deuces creates entry in specified group
- POST /api/deuces unauthenticated returns 401
- Deuce appears in group detail entries with user data
- POST /api/entries/:id/reactions adds reaction
- GET /api/entries/:id/reactions returns reactions array with user

### Edge Cases (3 tests)
- Logging deuce to non-member group returns 403
- Duplicate reaction (same user+entry+emoji) returns 400
- Very long thoughts text (2000 chars) accepted without error

---

## Bugs / Observations

1. **No `GET /api/deuces` feed endpoint.** The spec references `GET /api/deuces` and `GET /api/deuces?groupId=x`, but no such route exists. Deuce entries are only accessible via `GET /api/groups/:groupId` (which returns `{ group, members, entries }`). Consider adding a dedicated feed endpoint if a cross-group feed is desired.

2. **No server-side validation on `thoughts` length.** The `thoughts` column is `text` (unlimited). A 2000+ char string is accepted. If there's a UX expectation of a max length, it should be enforced server-side (e.g., zod `.max(1000)` on the insert schema).

3. **Logout returns 302 redirect, not JSON.** `GET /api/logout` redirects to `/` after destroying the session. A `POST /api/auth/logout` returning `{ ok: true }` would be more API-friendly for SPA clients.

4. **Login does not return the user object.** `POST /api/login` returns `{ ok: true }`. The client must make a separate `GET /api/auth/user` call to fetch user data. Consider returning the user object directly from login for fewer round-trips.

5. **`POST /api/groups/join` route does not exist.** Joining uses `POST /api/join/:inviteId` with a UUID invite ID, not an invite code. The spec's mention of `inviteCode` and `/api/groups/join` doesn't match the actual API.

6. **Auto-created "Solo Deuces" group.** `GET /api/auth/user` auto-creates a default group for users with zero groups. This is a side-effect on a GET endpoint — ideally this would be handled during user creation or via a dedicated onboarding flow.

---

## Test Infrastructure

- **Framework:** Vitest 3.x + Supertest
- **Mocking:** In-memory storage implementation replaces DB layer; express-session MemoryStore replaces pg session store
- **Isolation:** `memStore._reset()` in `beforeEach` ensures clean state per test
- **Config:** `vitest.config.ts` with path aliases matching tsconfig
- **Script:** `npm test` → `vitest run`
