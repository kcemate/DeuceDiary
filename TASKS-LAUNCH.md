# Deuce Diary — Launch Readiness Tasks (Grok 4.20 Review, 2026-03-06)
# TARGET: App Store submission in 2 days (March 8)

## LAUNCH BLOCKERS (Must fix before submission)

### Backend
- [ ] **LB-1** `server/routes/webhooks/revenuecat.ts` — Create RevenueCat webhook handler. POST `/api/webhooks/revenuecat` validates signature, maps `app_user_id` → userId, updates `users.subscription` + `subscriptionExpiresAt`, resets `streakInsuranceUsed`. Without this, purchases never unlock premium.
- [ ] **LB-2** `server/index.ts` — Fix CORS for mobile. Add `exp://*`, `http://localhost:8081`, and handle `null` origin for iOS WebView cases.
- [ ] **LB-3** `server/routes.ts` — After `POST /api/deuces`, call `broadcastToGroup(groupId, { type: 'new_deuce', deuce })` for real-time feed updates.
- [ ] **LB-4** `server/streakNotifications.ts` — Verify `checkAllGroupStreaksAndNotify` is complete, sends notifications, and respects `streakInsuranceUsed`.
- [ ] **LB-5** `shared/schema.ts` — Verify referrals table is complete. Run `drizzle-kit generate:pg` if needed.

### Mobile
- [ ] **LB-6** `hooks/useRevenueCat.ts` — After successful purchase, immediately call backend `/api/user/subscription` to sync (don't wait for webhook).
- [ ] **LB-7** `hooks/useAuth.ts` — Add retry + loading state for Clerk auth sync race condition on first login.
- [ ] **LB-8** `app.json` + Info.plist — Add privacy manifest, `NSUserTrackingUsageDescription` for analytics/RevenueCat/Notifications. Apple rejects without it.
- [ ] **LB-9** `hooks/useDeepLink.ts` + `app/invite/[code].tsx` — Add error boundary + fallback for malformed invite codes.

## LAUNCH IMPORTANT (Fix before submission — high rejection/polish risk)

### Backend
- [ ] **LI-1** `server/storage.ts` — `softDeleteUser` must cascade to entries/members for GDPR/App Store privacy review.
- [ ] **LI-2** `server/premiumAuth.ts` — Ensure consistent 403 JSON shape for mobile paywall interceptor.
- [ ] **LI-3** `server/routes.ts` — Add rate limiting on `/api/deuces` specifically.
- [ ] **LI-4** `server/notifications.ts` — Deduplicate tokens in `sendGroupPushNotification` to prevent duplicate pushes.

### Mobile
- [ ] **LI-5** `app/(tabs)/home/index.tsx` — FlatList `keyExtractor` should use `item.id`, not index.
- [ ] **LI-6** `app/components/PaywallModal.tsx` — Add loading state on purchase buttons to prevent double-tap.
- [ ] **LI-7** `hooks/usePaywall.tsx` — Fix `SUPPRESSED_SEGMENTS` reference (undefined → will throw).
- [ ] **LI-8** Add proper `expo-notifications` entitlement + `requestPermissionsAsync` flow.
- [ ] **LI-9** `app/_layout.tsx` — Fix onboarding skip race condition with Clerk fresh install.

### Shared
- [ ] **LI-10** `shared/schema.ts` — Username regex `^[a-zA-Z0-9_ ]+$` allows spaces. Change to `^[a-zA-Z0-9_]+$` + migration fix.
- [ ] **LI-11** Add `lastLoggedAt` column + index on `deuceEntries` for streak calculation performance.

## POST-LAUNCH (Can wait)
- iOS widget implementation
- Full analytics dashboard
- Spy mode
- Share card OG image polish
- Referral leaderboard polish
- Custom themes backend
- Sentry source maps for mobile

---

**Summary:** Code quality is high, 360 tests passing, production live. 9 blockers + 11 important items. Focus on subscription sync (RevenueCat webhook + immediate sync), CORS, and privacy manifest first.
