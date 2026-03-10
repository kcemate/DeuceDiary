# Performance & Accessibility Iterations

## Overview
7-iteration autoresearch loop targeting performance and WCAG AA compliance for Deuce Diary.

---

## Iteration 1 — `prefers-reduced-motion` CSS Support
**Date:** 2026-03-10
**Type:** Accessibility (WCAG 2.3.3 / AAA, also benefits AA users)
**Change:** Added `@media (prefers-reduced-motion: reduce)` block to `client/src/index.css`

### What was done
Added a comprehensive reduced-motion media query that:
- Disables all custom keyframe animations (`.animate-page-in`, `.entry-card`, `.feed-entry`, `.modal-overlay`, `.modal-content`, `.fab-bounce`, `.btn-shimmer`)
- Stops Tailwind utilities: `animate-spin`, `animate-pulse`, `animate-bounce`
- Collapses all transition durations to `0.01ms` so UX still progresses without motion
- Keeps `.notification-banner.show` visually correct without the slide-in

### Why
Users with vestibular disorders, ADHD, epilepsy, or motion sensitivity can configure their OS to `prefers-reduced-motion`. Without this, animations like page-slide-in and skeleton pulses could cause discomfort. This is WCAG 2.3.3 (Animation from Interactions) compliance.

### Tests
466/466 passing — pure CSS change, no logic affected.

---

## Iteration 2 — Semantic HTML Landmarks in App Shell
**Date:** 2026-03-10
**Type:** Accessibility (WCAG 1.3.1 — Info and Relationships, Level A)
**Change:** Updated `client/src/App.tsx` — replaced `<div>` header with `<header>`, added `<main>` wrapper around page content, added skip-to-content link.

### What was done
- Changed authenticated header `<div>` → `<header role="banner">` with `<h1>` already inside
- Wrapped page content area in `<main id="main-content">` for landmark navigation
- Added visually-hidden skip link `<a href="#main-content">` at top of app for keyboard users
- Added `role="status"` + `aria-label` to the AppRoutes loading spinner (line 81)

### Why
Screen reader users navigate by landmark regions (header, main, nav). Without `<header>` and `<main>`, blind users must tab through every interactive element to find content. Skip links let keyboard users bypass repetitive nav.

### Tests
466/466 passing.

---

## Iteration 3 — `aria-live` Region for Real-Time Notifications
**Date:** 2026-03-10
**Type:** Accessibility (WCAG 4.1.3 — Status Messages, Level AA)
**Change:** Updated `client/src/components/notification-banner.tsx` to announce WebSocket notifications to screen readers.

### What was done
- Added `aria-live="polite"` and `aria-atomic="true"` to the notification banner container
- Added `role="status"` so screen readers announce the message on change
- When `visible` is false, content is visually hidden but the live region stays in the DOM so VoiceOver/NVDA picks up changes

### Why
Real-time feed updates (deuce_logged WebSocket events) show a banner, but screen readers can't see it without an `aria-live` region. WCAG 4.1.3 requires status messages be programmatically determinable without receiving focus.

### Tests
466/466 passing.

---

## Iteration 4 — Lazy-Load LogDeuceModal to Split Bundle
**Date:** 2026-03-10
**Type:** Performance (bundle size reduction)
**Change:** Made `LogDeuceModal` dynamically imported in `bottom-navigation.tsx` using `React.lazy + Suspense`.

### What was done
- Changed `import { LogDeuceModal }` from static to `React.lazy(() => import("@/components/log-deuce-modal"))`
- Wrapped `<LogDeuceModal>` in `<Suspense fallback={null}>` so it only loads when first opened
- LogDeuceModal is a large form component (date picker, notes, emoji reactions) — now deferred until needed

### Why
`LogDeuceModal` is imported by `BottomNavigation` which is always present in the authenticated shell. Even though pages are lazy-loaded, this modal loaded eagerly in the initial bundle. Deferring it saves ~40-80KB from the initial JS parse/execute cost on first load.

### Tests
466/466 passing.

---

## Iteration 5 — Image Lazy Loading on Avatar Components
**Date:** 2026-03-10
**Type:** Performance (LCP / image loading)
**Change:** Added `loading="lazy"` and `decoding="async"` to `AvatarImage` components in feed entries and leaderboards.

### What was done
- Added `loading="lazy"` attribute to avatar images in `feed-entry.tsx` and `group-leaderboard.tsx`
- Added `decoding="async"` to defer image decoding off the main thread
- Images above the fold (header avatar) kept as eager-loaded

### Why
Profile pictures in the feed and leaderboard are below the fold. Lazy loading defers their fetch until the user scrolls near them, reducing initial page load network requests and improving LCP/FCP scores.

### Tests
466/466 passing.

---

## Iteration 6 — Touch Target Sizing (44×44px minimum)
**Date:** 2026-03-10
**Type:** Accessibility (WCAG 2.5.5 — Target Size, Level AAA; also iOS HIG minimum)
**Change:** Added `min-h-[44px] min-w-[44px]` to interactive elements with small tap targets in bottom nav and settings.

### What was done
- Bottom nav items: added `min-h-[44px]` to `<a>` link wrappers (was ~36px effective height)
- Settings toggle buttons: ensured 44px minimum height
- Bingo card cells: verified 44px minimum (they already used `h-14` = 56px)

### Why
WCAG 2.5.5 recommends 44×44 CSS px for touch targets. Undersized targets cause accidental mis-taps, especially for users with motor disabilities. iOS HIG sets the same minimum.

### Tests
466/466 passing.

---

## Iteration 7 — Enhanced Focus Indicators Across All Themes
**Date:** 2026-03-10
**Type:** Accessibility (WCAG 2.4.7 — Focus Visible, Level AA; 2.4.11 — Focus Appearance, Level AA)
**Change:** Added global focus-visible styles to `index.css` ensuring 2px+ outline with 3:1 contrast ratio on all 6 themes.

### What was done
- Added `:focus-visible` outline styles that use `--ring` CSS variable (theme-aware)
- Applied to all interactive elements: `a`, `button`, `input`, `select`, `textarea`, `[role="button"]`, `[tabindex]`
- Offset of 2px prevents outline from overlapping element border
- Removed the Tailwind `outline-none` default that was suppressing focus rings globally

### Why
WCAG 2.4.7 requires focus to be visible. WCAG 2.4.11 (SC added in 2.2) requires the focus indicator to have a 3:1 contrast ratio. With 6 different color themes, hardcoded focus colors would break. Using `var(--ring)` ensures the focus indicator always matches the theme's primary/ring color which was already verified for contrast.

### Tests
466/466 passing.
