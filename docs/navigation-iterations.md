# Navigation Autoresearch — Iteration Log

## Iteration 1: FAB-style Log button in center of bottom nav
**Commit:** `efcc7b24`
**Problem:** The primary action (Log a Deuce) was only accessible from the Home page as an inline button. Users on Squads, Passport, or Profile had to navigate back to Home first.
**Change:** Replaced the Bingo tab (center position) with a floating action button (FAB) for logging. The FAB rises above the nav bar with a green circular background, shadow, and scale-on-press feedback. It renders a `LogDeuceModal` directly from the nav component.
**Impact:** Primary action now accessible from every screen. Follows Instagram/Twitter FAB pattern. Bingo is still accessible from the Home page quick links strip.

## Iteration 2: Page transition animation
**Commit:** `0180ba86`
**Problem:** Route changes were instant with no visual feedback — felt jarring on mobile, broke the sense of spatial navigation.
**Change:** Added a `PageTransition` component in App.tsx that wraps route content with a fade-in + subtle upward slide animation (200ms ease-out, 6px Y offset). Uses `requestAnimationFrame` to trigger the animation on location change.
**CSS:** Added `@keyframes pageIn` and `.animate-page-in` class to index.css.
**Impact:** Navigation feels fluid and intentional. Lightweight — no animation library needed.

## Iteration 3: Standardized back navigation with BackHeader component
**Commit:** `d4277e5c`
**Problem:** Sub-pages (settings, premium, referral) had inconsistent back navigation — different styles (ArrowLeft icon vs `←` HTML entity), different placements (top vs bottom), different text.
**Change:** Created `BackHeader` component (`back-header.tsx`) with consistent pattern: left arrow + label + optional title divider. Applied to settings (back to Profile + "Theme" title), premium (back to Profile), and referral (back to Profile). Removed redundant bottom "Back to Profile" buttons.
**Impact:** Consistent navigation pattern across all sub-pages. Users always know how to go back.

## Iteration 4: Active tab filled icons + scale feedback
**Commit:** `47b610e1`
**Problem:** Active and inactive tabs only differed by color — subtle distinction, especially in poor lighting or for colorblind users.
**Change:** Refactored bottom nav to a data-driven array structure. Active tabs now get: filled icons (currentColor fill), bolder stroke (2.5 vs 1.75), subtle scale-up (105%), and letter-spacing expansion. Inactive tabs scale down on press (95%). All transitions are 200ms.
**Impact:** Stronger active state distinction. The data-driven structure also makes future nav changes easier.

## Iteration 5: Auto-hide bottom nav on scroll down
**Commit:** `2b7152f4`
**Problem:** The fixed bottom nav takes up ~70px of screen space on mobile, reducing content area especially on feed-heavy pages.
**Change:** Added `useHideOnScroll` hook using `requestAnimationFrame`-throttled scroll listener. Nav hides when scrolling down (10px+ delta, after 80px threshold) and reappears on any upward scroll (5px delta). 300ms ease-out slide transition.
**Impact:** More content space when reading the feed. Nav always accessible with a quick scroll up. Follows Instagram/TikTok pattern.

## Iteration 6: Tap active tab to scroll to top
**Commit:** `b4b44a27`
**Problem:** Tapping the already-active tab did nothing — wasted interaction opportunity. Standard mobile convention (iOS, Instagram, Twitter) is to scroll to top.
**Change:** Added click handler that checks if the tab is already active. If so, prevents Link navigation and triggers `window.scrollTo({ top: 0, behavior: "smooth" })`.
**Impact:** Users can quickly return to top of long feeds. Matches muscle memory from native apps.

## Iteration 7: Features section on Profile for Bingo + Premium
**Commit:** `2cc3e503`
**Problem:** Removing Bingo from the bottom nav (iteration 1) reduced its discoverability. Premium/Throne Room was only accessible from the Home page upsell card.
**Change:** Added a "Features" section to the Profile page with tappable rows for Deuce Bingo and Premium/Throne Room. Shows "Upgrade" badge for free users. Uses the same row pattern as the Settings section (emoji + label + chevron).
**Impact:** All features remain 2 taps away maximum. Profile becomes the hub for both features and settings.

---

## Summary of Navigation Architecture (After 7 Iterations)

### Bottom Nav (4 tabs + FAB)
```
[ Home ]  [ Squads ]  [ 🚽 LOG ]  [ Passport ]  [ Profile ]
```

### Page Hierarchy
```
Home (/)
├── Log Deuce (modal, via FAB from any page)
├── Quick Links → Bingo, Insurance, Analytics, Passport, Themes
└── Activity Feed + Squads List

Squads (/groups)
└── Group Detail (/groups/:id) — back to Squads

Passport (/passport)

Profile (/profile)
├── Features → Bingo (/bingo), Premium (/premium)
├── Settings → Theme (/settings), Referral (/referral)
└── Squads (tappable, links to group detail)
```

### Behaviors
- **FAB:** Accessible from every screen, opens LogDeuceModal
- **Auto-hide nav:** Slides down on scroll, up on scroll-up
- **Tap-to-top:** Re-tapping active tab scrolls to top
- **Page transitions:** 200ms fade+slide on route change
- **Back navigation:** Consistent BackHeader on all sub-pages
