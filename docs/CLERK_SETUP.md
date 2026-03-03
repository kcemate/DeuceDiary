# Clerk Authentication Setup

Step-by-step guide to connect Clerk to Deuce Diary.

## 1. Create Clerk Application

1. Go to [clerk.com](https://clerk.com) and sign in
2. Click **Create application**
3. Name it `Deuce Diary` (or `Deuce Diary Dev` for staging)
4. Enable sign-in methods: **Email**, **Google**, **Apple** (for iOS)
5. Click **Create**

## 2. Get API Keys

From the Clerk dashboard sidebar:

1. Go to **API Keys**
2. Copy the **Publishable key** (starts with `pk_`)
3. Copy the **Secret key** (starts with `sk_`)

## 3. Configure Webhook Endpoint

1. Go to **Webhooks** in the Clerk dashboard sidebar
2. Click **Add Endpoint**
3. Set the URL to: `https://your-domain.com/api/webhooks/clerk`
   - For Railway: `https://deucediary-production.up.railway.app/api/webhooks/clerk`
4. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `session.created`
5. Click **Create**
6. Copy the **Signing Secret** (starts with `whsec_`)

## 4. Add Environment Variables

Set these in Railway (Settings > Variables):

```
CLERK_SECRET_KEY=sk_live_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

For local development, add to `.env` (never commit this file):

```
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

> Leave these blank/commented to use dev username auth (no Clerk needed locally).

## 5. Test the Integration

### Test webhook delivery

1. In the Clerk dashboard, go to **Webhooks** > your endpoint
2. Click **Testing** tab
3. Select `user.created` event
4. Click **Send Example**
5. Verify you get a `200` response with `{"received": true}`

### Test auth flow

1. Start the app with Clerk keys set
2. Sign in via the frontend
3. Check the server logs for `Clerk webhook: synced user ...`
4. Verify the user appears in the database

### Test user sync

After login, the frontend calls `POST /api/auth/sync` to ensure the user record exists and get profile + streak data.

## Architecture Notes

- **Dual-mode auth**: When `CLERK_SECRET_KEY` is set, the server verifies Clerk JWTs. When unset, it falls back to session-based dev auth (username login, no password).
- **Webhook handler**: `server/routes/webhooks.ts` — verifies svix signatures, handles `user.created`, `user.updated`, `user.deleted`, `session.created`.
- **Soft delete**: `user.deleted` sets `deleted_at` and anonymizes personal data (email, name, profile image cleared).
- **Sync endpoint**: `POST /api/auth/sync` — frontend calls this after Clerk login to upsert the user and get profile with streak data.
