---
summary: "iOS build stack — Expo structure, App Store Connect, RevenueCat integration"
links: [ios-rebuild, clerk-integration, deployment]
researched: "2026-02-20 by Grok 4"
---

# Deuce Diary — iOS Build Reference

## 1. Expo Project Structure (SDK 52 / Router v4)

### File Tree

```
deuce-diary-mobile/
├── app/                              # Expo Router v4 (auto-generates nav)
│   ├── _layout.tsx                   # Root: Auth gate (Clerk SignedIn/SignedOut), QueryClientProvider
│   ├── (tabs)/                       # Tab navigator group
│   │   ├── _layout.tsx               # Bottom tab bar (home, squads, profile)
│   │   ├── home/
│   │   │   └── index.tsx             # Live feed — WebSocket + TanStack Query
│   │   ├── squads/
│   │   │   ├── index.tsx             # Squads list
│   │   │   └── [squadId].tsx         # Squad detail feed
│   │   └── profile/
│   │       ├── index.tsx             # Stats, settings
│   │       └── edit.tsx              # Edit username, avatar
│   ├── modals/
│   │   └── log-a-deuce.tsx           # Bottom sheet modal (@gorhom/bottom-sheet v5)
│   ├── invite/
│   │   └── [token].tsx               # Deep link handler (deucediary://invite/TOKEN)
│   ├── auth/
│   │   ├── sign-in.tsx               # Username-only (dev) or Clerk (prod)
│   │   └── sign-up.tsx
│   └── index.tsx                     # Splash / redirect
├── components/
│   ├── FeedItem.tsx
│   ├── BottomSheetWrapper.tsx
│   ├── TabBarIcon.tsx
│   └── AuthGate.tsx
├── hooks/
│   ├── useAuth.ts                    # Clerk useUser/useSession wrapper
│   ├── useGroupSocket.ts             # WebSocket hook (native WS API)
│   ├── useDeuceLogger.ts             # Modal state + log mutation
│   └── useQueryFeed.ts               # TanStack Query feed hook
├── services/
│   ├── authService.ts                # Dev mock or Clerk
│   ├── notificationService.ts        # expo-notifications + APNs
│   └── deepLinkService.ts            # expo-linking v13
├── api/
│   ├── index.ts                      # Axios client, baseURL, Clerk token interceptor
│   ├── deuces.ts                     # getFeed(), postDeuce(), addReaction()
│   ├── squads.ts                     # listSquads(), joinSquad(), createSquad()
│   └── auth.ts                       # login(), getUser()
├── types/
│   ├── api.types.ts                  # Deuce, Squad, User, Reaction
│   ├── auth.types.ts
│   └── navigation.types.ts
├── constants/
│   └── colors.ts                     # Porcelain Premium palette
├── assets/
├── app.json                          # Bundle ID, deep link scheme, Clerk key
├── eas.json                          # Build profiles (development, preview, production)
└── package.json
```

### Key packages
- `expo-router@^4.0`
- `@clerk/clerk-expo@^2.5`
- `@tanstack/react-query@^5.2`
- `@gorhom/bottom-sheet@^5.1`
- `nativewind@^4.0` (Tailwind for RN)
- `expo-notifications`
- `expo-linking@^13`
- `expo-image-picker`

---

## 2. App Store Connect Setup

### Before You Start
- Apple Developer Account ($99/year)
- App Store Connect API Key (Users and Access → Keys)
- EAS CLI: `npm install -g eas-cli` (v6.2+)

### Bundle ID
`com.deucediary.app` — set in `app.json` under `expo.ios.bundleIdentifier`

### Capabilities to Enable
- ✅ Push Notifications (APNs auth key)
- ✅ Sign In with Apple (Clerk handles this)
- ✅ Background Modes → Remote Notifications
- ✅ Background Modes → Background Fetch

### Privacy Manifest (`PrivacyInfo.xcprivacy`)
Required for iOS 17+. Add via Expo config plugin or prebuild.
- Declare `NSUserDefaults` (Clerk session storage)
- Declare `CLLocationManager` if location is used
- Apple auto-rejects if APIs are used without declaration

### App Privacy Labels
| Data Type | Collected | Linked to User | Used for Tracking |
|---|---|---|---|
| Coarse Location | Optional | No | No |
| User Content (posts) | Yes | Yes | No |
| User ID | Yes | Yes | No |
| Device ID | Yes | Yes | No |

### EAS Build + Submit
```bash
# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios
```

`eas.json` production profile:
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.deucediary.app",
        "autoIncrement": true
      }
    }
  }
}
```

### TestFlight
- Upload via `eas submit` → App Store Connect → TestFlight
- Internal testers: instant
- External testers: 1-2 day beta review for first build
- First App Store review: **2-5 days**

### What You Need Before First Submission
- [ ] Screenshots: iPhone 6.7" + 5.5" (10 per set minimum)
- [ ] App description + keywords
- [ ] Support URL + Privacy Policy URL
- [ ] Demo account (username to log in during review)
- [ ] Export compliance answered (almost always "No")
- [ ] App Review notes explaining WebSocket real-time behavior

---

## 3. RevenueCat Integration

### SDK
`@revenuecat/purchases-react-native` v7.x via Expo config plugin — works in managed workflow, no ejecting.

```json
// app.json
{
  "expo": {
    "plugins": [
      ["@revenuecat/purchases-react-native", {
        "iosProjectId": "your_rc_project_id"
      }]
    ]
  }
}
```

```ts
// Initialize in _layout.tsx
Purchases.configure({
  apiKey: IOS_RC_API_KEY,
  appUserID: user.id, // Clerk user ID for cross-device sync
});
```

⚠️ **Gotcha:** Expo Go does NOT support IAP. Use EAS Dev Build for testing.
⚠️ **Gotcha:** Test with RevenueCat sandbox users + Apple sandbox accounts.

### Entitlements Architecture

**Free (keep free — network effects depend on it):**
- Unlimited deuce logging
- All group/squad features
- Emoji reactions
- Real-time push notifications
- Basic profile + stats

**Porcelain Premium (paywall):**
- Custom themes (Porcelain, Midnight, Terracotta)
- Gold streak badge + streak insurance (miss a day, keep streak)
- Extended stats (peak day trends, reaction breakdown, monthly recap)
- Ad-free (if ads ever added)
- Priority in group feed (pinned reactions)
- Unlimited squads (free tier: 3 max)

**Rule:** Free users must be fully useful squad members. Never gate reactions, posting, or group participation — that kills the network.

### Pricing (Feb 2026 niche social apps)
| Plan | Price | Notes |
|---|---|---|
| Monthly | $2.99/mo | Low barrier, highest conversion |
| Annual | $19.99/yr ($1.67/mo) | 44% discount, push hard |
| Lifetime | $39.99 one-time | For superfans, limited-time offer at launch |

Lead with annual. Most niche social apps see 60-70% of premium revenue from annual subscribers.

### RevenueCat Free Tier (2026)
- Free up to **$2,500 MTR** (monthly tracked revenue)
- After that: 1% of revenue
- No seat limits, no feature limits on free tier

### Webhook → Express Backend

```json
// RevenueCat Dashboard → Webhooks → Add
{
  "url": "https://api.deucediary.app/webhooks/revenuecat",
  "events": ["INITIAL_PURCHASE", "RENEWAL", "CANCELLATION", "EXPIRATION"]
}
```

```ts
// server/routes/webhooks.ts
app.post('/webhooks/revenuecat', async (req, res) => {
  const event = req.body.event;
  const userId = event.app_user_id; // Clerk user ID you passed at init
  const isPremium = ['INITIAL_PURCHASE', 'RENEWAL'].includes(event.type);
  
  await db.update(users)
    .set({ isPremium, premiumExpiresAt: event.expiration_at_ms })
    .where(eq(users.id, userId));
  
  res.sendStatus(200);
});
```

Add `isPremium` boolean + `premiumExpiresAt` timestamp to the users table.

### Pitfalls
- Never trust client-side entitlement checks alone — always verify via backend/webhook
- Don't gate core social features (reactions, posting) — kills network
- Launch with annual as default option shown in paywall
- Set up sandbox testing before submitting to App Store
