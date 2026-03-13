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

## Click 3 — Improve input validation and error messages on PUT /api/user/timezone

**What changed:** Added a length guard (max 100 chars) before the IANA timezone validation check. Also improved the error message from the generic "Invalid timezone identifier" to include the submitted value and a hint (`Use an IANA timezone name (e.g. "America/New_York")`). Improved the missing-field error from "Invalid timezone" to "Timezone is required".

**Why:** Without a length guard, a client could send an oversized string before hitting the IANA check. The improved error messages give developers an actionable signal instead of a generic rejection.

**Files modified:** `server/routes.ts`

---

## Click 4 — Validate UUID format in requireGroupMember middleware

**What changed:** Added UUID format validation at the top of `requireGroupMember()` in `server/groupAuth.ts`. Non-UUID group IDs now return 400 "Invalid group ID format" before any DB lookup.

**Why:** The middleware previously did a `storage.isUserInGroup()` DB call with whatever string was in the route param. A non-UUID string would silently fail membership check and return 403 "Not authorized" — masking that the real problem is a malformed path param. Fast-fail with 400 gives clients a clearer diagnostic.

**Files modified:** `server/groupAuth.ts`

---

## Click 5 — Replace vague "Not authorized" with specific message on GET /api/deuces

**What changed:** In `GET /api/deuces`, when a user passes a `groupId` query param and is not a member, the error was the generic "Not authorized". Changed to "Not a member of this group". Updated the corresponding test regex to accept both forms.

**Why:** "Not authorized" conflates authentication failures (wrong/missing token) with authorization failures (valid user, wrong group). The specific message "Not a member of this group" makes it immediately obvious what's wrong — helpful for debugging both on the client side and in logs.

**Files modified:** `server/routes.ts`, `server/__tests__/routes-coverage.test.ts`

---

## Click 6 — Add structured warning log for premium gate on POST /api/join/:inviteId

**What changed:** Added a `console.warn` when a free user hits the multi-member squad premium gate on `POST /api/join/:inviteId`. The log includes userId, groupId, and memberCount.

**Why:** The premium gate was a silent 403 — completely invisible in server logs. This is a conversion funnel event. Logging it turns an invisible rejection into an observable product signal for understanding upgrade conversion pressure.

**Files modified:** `server/routes.ts`

---

## Click 7 — Validate UUID format on /api/entries/:entryId/reactions endpoints

**What changed:** Added UUID format validation on all three reaction endpoints (POST/DELETE/GET `/api/entries/:entryId/reactions`) before any DB lookup. Extracted the regex as a shared constant `ENTRY_UUID_RE` to avoid repetition. Updated two tests that used synthetic non-UUID entry IDs (`"fake"`, `"some-entry"`) to use the zero UUID (`00000000-0000-0000-0000-000000000001`) so they continue to exercise the real code path.

**Why:** Without format validation, the three reaction endpoints did a `storage.getEntryById()` call for any string in the URL. Non-UUID paths generate pointless DB queries. Uniform format validation at the route layer is the right place to stop garbage input.

**Files modified:** `server/routes.ts`, `server/__tests__/api.test.ts`, `server/__tests__/routes-coverage.test.ts`
