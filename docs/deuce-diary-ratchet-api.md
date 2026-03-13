# Deuce Diary — API Error Handling Ratchet Run

Seven autonomous improvement clicks on API error handling. Each click = one focused change, passing tests, and a commit.

---

## Click 1 — Fix failing invite-flow test (test sync)

**What changed:** Updated `server/__tests__/invite-flow.test.ts` — the test "rejects already-consumed invite code" expected a 400 when a second user tried to join via an already-used invite. The feature was intentionally changed in commit `8c9aec44` so that invites are reusable (not deleted after first join). The test was asserting the old single-use behavior. Updated the test name and assertions to match the current design: a second user joining via the same invite code should get 200, not 400.

**Why:** The test was a false negative — it was failing not because of a bug, but because the product behavior was deliberately changed and the test wasn't updated. A failing test that tests the wrong thing is worse than no test.

**Files modified:** `server/__tests__/invite-flow.test.ts`

---

## Click 2 — Validate inviteId path param format on /api/join/:inviteId

**What changed:** Added UUID format validation for the `inviteId` path parameter on `POST /api/join/:inviteId`. Before, any string could be passed and would do a DB lookup that would always miss. Now malformed IDs (non-UUID strings) are rejected immediately with a 400 before any DB call.

**Why:** Defense-in-depth. Avoids unnecessary DB queries on obviously invalid input. Also returns a clearer error message ("Invalid invite code format") instead of the generic "Invalid or expired invite".

**Files modified:** `server/routes.ts`

---

## Click 3 — Validate inviteCode param on public group preview endpoints

**What changed:** Added UUID format validation on `GET /api/groups/preview/:inviteCode` and `GET /api/groups/invite-preview/:inviteCode`. Non-UUID invite codes are rejected with 400 before any storage call.

**Why:** Both endpoints are public (no auth). Without validation, a bot or crawler could fuzz them with arbitrary strings and generate DB query load. A quick format check at the route layer costs nothing and stops the noise.

**Files modified:** `server/routes.ts`

---

## Click 4 — Validate groupId UUID format on /api/groups/:groupId routes

**What changed:** Added explicit UUID validation for the `groupId` path parameter on `GET /api/groups/:groupId` and `DELETE /api/groups/:groupId/members/:userId`. Non-UUID group IDs now return 400 with "Invalid group ID" before any DB query.

**Why:** The `requireGroupMember()` middleware does a DB lookup with the raw `groupId`. A non-UUID string would silently fail the membership check and return 403 instead of 400, masking what the real problem is. Fast-failing with validation gives clients clearer errors.

**Files modified:** `server/routes.ts`

---

## Click 5 — Replace vague "Not authorized" error in /api/deuces with specific message

**What changed:** In `GET /api/deuces`, when a user passes a `groupId` query param and is not a member, the error was the generic "Not authorized". Changed to "Not a member of this group" to distinguish from auth failures.

**Why:** "Not authorized" conflates authentication failures (wrong/missing token) with authorization failures (valid user, wrong group). The specific message "Not a member of this group" makes it immediately obvious what's wrong — helpful for debugging both on the client side and in logs.

**Files modified:** `server/routes.ts`

---

## Click 6 — Add structured error log for /api/join/:inviteId 403 (premium gate)

**What changed:** In `POST /api/join/:inviteId`, the premium-gate branch (non-premium user trying to join a multi-member squad) was returning a 403 silently with no server-side log. Added a `console.warn` with userId, groupId, and member count so ops can see how often the premium gate is being hit.

**Why:** Silent 403s are invisible in server logs. This is a conversion funnel event — knowing how often free users hit the premium wall when joining squads is valuable product signal, and without a log it's invisible.

**Files modified:** `server/routes.ts`

---

## Click 7 — Validate timezone string length before IANA check on PUT /api/user/timezone

**What changed:** `PUT /api/user/timezone` accepted any string and passed it to `Intl.DateTimeFormat` for validation. Added an explicit length check (max 100 chars) before the IANA validation to reject obviously bogus payloads fast and with a clearer error.

**Why:** Without a length guard, a client could send a 50KB timezone string that gets passed into `Intl.DateTimeFormat`. The IANA check would still catch it, but the error message would be "Invalid timezone identifier" rather than something helpful. The length check ensures we fail fast and log a useful message.

**Files modified:** `server/routes.ts`
