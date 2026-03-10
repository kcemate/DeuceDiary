# Clerk Billing Migration — Iteration Log

## Overview
Replaced RevenueCat with Clerk Billing for premium subscriptions.

---

## Iteration 1 — Frontend: Replace Premium Page with PricingTable

**Files changed:** `client/src/pages/premium.tsx`

- Removed manual upgrade UI (plan toggle, CTA button, dev-mode disclaimer)
- Removed `useMutation` for `/api/subscription/upgrade`
- Added `<PricingTable />` from `@clerk/clerk-react` for the upgrade view
- Premium check now uses `has({ plan: 'premium' })` from Clerk's `useAuth()` with DB fallback

---

## Iteration 2 — Frontend: Clerk `has()` for Premium Gating

**Files changed:** `client/src/components/premium-gate.tsx`, `client/src/hooks/useAuth.ts`

- `PremiumGate` component updated to check `has({ plan: 'premium' })` via `useAuth` from `@clerk/clerk-react`
- Falls back to `user.subscription === 'premium'` from DB for dev mode / pre-Billing
- Added `usePremium()` hook export in `useAuth.ts` — returns `boolean` for components needing a simple check

---

## Iteration 3 — Backend: Clerk JWT Claims in Premium Middleware

**Files changed:** `server/premiumAuth.ts`, `server/replitAuth.ts`

- `isAuthenticated` now stores decoded JWT payload as `req.clerkAuth`
- `requiresPremiumFor()` checks Clerk Billing plan from JWT claims first:
  - `clerkAuth.plan === 'premium'` (user-level plan)
  - `clerkAuth.o.per` (org permissions, comma-separated)
  - `clerkAuth.fea` (feature flags array)
- Falls back to DB subscription check for dev mode and backward compatibility

---

## Iteration 4 — Remove RevenueCat

**Files changed:** `server/routes.ts`, `server/routes/webhooks/revenuecat.ts` (deleted), `.env.example`

- Removed `registerRevenueCatWebhook` import and call from `routes.ts`
- Deleted `server/routes/webhooks/revenuecat.ts`
- Updated `.env.example` with Clerk Billing comment (no `REVENUECAT_WEBHOOK_SECRET`)
- Clerk webhook now always registered (not gated by `clerkEnabled`), since handler self-validates

---

## Iteration 5 — Clerk Subscription Webhook Sync

**Files changed:** `server/routes/webhooks.ts`

Added Clerk Billing event handlers:
- `subscription.created` + `subscription.updated`: if `status === 'active'` → upgrade to premium, reset streak insurance. Otherwise → downgrade to free.
- `subscription.deleted`: downgrade to free.
- DB `subscription` + `subscriptionExpiresAt` kept in sync for backward compat with backend middleware fallback.

---

## Iteration 6 — Tests Updated

**Files changed:** `server/__tests__/premium-flow.test.ts`, `server/__tests__/api-premium.test.ts`

- Replaced `"RevenueCat webhook → subscription state transitions"` describe block with `"Clerk subscription webhook → subscription state transitions"`
- Added `vi.mock("svix", ...)` to bypass Svix signature verification in tests
- Set `CLERK_WEBHOOK_SECRET=test-webhook-secret` in `beforeAll`
- All 466 tests passing ✓

---

## Architecture After Migration

```
Frontend:
  PricingTable (Clerk Billing) → user subscribes → Stripe processes payment
  has({ plan: 'premium' }) → real-time JWT gate check

Webhook:
  Clerk → POST /api/webhooks/clerk → subscription.created/updated/deleted
  → storage.updateUserSubscription() → keeps DB in sync

Backend:
  isAuthenticated → verifies JWT → sets req.user (DB) + req.clerkAuth (JWT)
  requiresPremiumFor(feature) → checks JWT claims OR DB subscription (fallback)
```

## Premium Features Gated (22 endpoints)
- Deuce Bingo (`bingo`)
- Streak Insurance (`streak_insurance`)
- Throne Analytics (`analytics`)
- Custom Themes (`custom_themes`)
- Poop Passport (`passport`)
- Daily Challenges (`daily_challenges`)
- Squad Spy (`squad_spy`)
- Report Export PDF (`report_export`)
- Throne Broadcast (`throne_broadcast`)
- Custom Reminder (`custom_reminder`)
- Referral Stats (`referral_stats`)
