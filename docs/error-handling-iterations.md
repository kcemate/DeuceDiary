# Error Handling Iterations — Jordan (fix/location-test-and-error-handling)

## Summary
7 surgical error-handling fixes across the API. Focus areas: Zod validation gaps
returning 500 instead of 400, unvalidated path/query params causing DB errors,
missing input sanitization on public endpoints.

---

## Click 1 — PUT /api/auth/user: ZodError returns 500 instead of 400

**Gap:** `updateUserSchema.parse(req.body)` throws `ZodError` on invalid username
(too short, regex mismatch, missing). The catch block only handled `duplicate key
value` errors; ZodErrors fell through to `Errors.internal()` returning 500.

**Fix:** Added `ZodError` import and explicit check before the generic catch, mapping
Zod failures to `Errors.badRequest(res, firstMessage)`. Updated 9 tests in
`edge-cases.test.ts` and `routes-coverage.test.ts` that were asserting the old broken
500 behavior.

**Commit:** `7b7b10a5`

---

## Click 2 — GET /api/deuces (routes/deuces.ts): unvalidated groupId query param

**Gap:** The `groupId` query param was passed directly to `storage.isUserInGroup` without
UUID format validation. A non-UUID string would cause PostgreSQL to throw "invalid input
syntax for type uuid" — returned as 500.

**Fix:** Added UUID regex check before DB call in `routes/deuces.ts`. Returns 400 with
clear message for malformed input.

**Note:** `routes/deuces.ts` is not currently mounted (see click 4 for active code fix).

**Commit:** `90c238e1`

---

## Click 3 — createDeuceSchema: groupIds array elements not validated as UUIDs

**Gap:** `groupIds: z.array(z.string())` accepted any string. Non-UUID values in the
array reached `storage.isUserInGroup` and caused DB "invalid input syntax" errors.
Affected both `POST /api/deuces` and `POST /api/deuces/bulk`.

**Fix:** Changed schema to `z.array(z.string().uuid(...))` and `z.string().uuid(...)` for
`groupId`, so Zod rejects malformed IDs with a 400 before any DB interaction.

**Commit:** `7a5c9689`

---

## Click 4 — GET /api/deuces (routes.ts): same gap as click 2 in active code

**Gap:** The active route in `routes.ts` (not the unmounted `routes/deuces.ts`) also
lacked `groupId` query param UUID validation, allowing DB errors.

**Fix:** Added the same UUID regex guard to the active `GET /api/deuces` handler in
`routes.ts`.

**Commit:** `479e0d87`

---

## Click 5 — POST /api/auth/sync: no type safety on request body

**Gap:** `req.body` was used directly (`const clerkData = req.body`) with no schema
validation. Non-string field values (e.g., `{ "email": 12345 }`) or oversized strings
could cause DB errors or corrupt stored data.

**Fix:** Added `syncBodySchema` (Zod, all fields optional) that validates and caps
field lengths (email max 254, names max 100, username max 50, imageUrl max 2048).
Falls back to `req.user` values if body fails validation — no client-visible error.

**Commit:** `50f802a1`

---

## Click 6 — Public invite endpoints: unvalidated inviteCode causes DB 500

**Gap:** Three public endpoints (`GET /api/groups/preview/:inviteCode`,
`GET /api/groups/invite-preview/:inviteCode`, `GET /api/og/invite/:inviteCode`)
passed `inviteCode` directly to storage without UUID format check. Non-UUID input
caused PostgreSQL to throw, returning 500 to public (unauthenticated) callers.

**Fix:** Added UUID regex guard on each endpoint. Returns 404 for invalid formats
(consistent with "invite not found" behavior — avoids leaking format info).

**Commit:** `bb305f71`

---

## Click 7 — Public share card endpoints: unvalidated userId path param

**Gap:** `GET /api/share/streak/:userId` and `GET /api/og/streak/:userId` passed
`userId` directly to `storage.getShareCardData` with no character validation.
Malformed IDs containing special characters (`<`, `>`, spaces) could cause DB errors
or unexpected behavior on public-facing, unauthenticated routes.

**Fix:** Added `USER_ID_RE = /^[\w.\-]{1,128}$/` check before DB call. Returns 404
for invalid formats (same as "user not found").

**Commit:** `d6b67f48`
