# Home Feed Iterations

Autoresearch iterations on the Home Feed — the first thing users see when they open the app.

---

## Iteration 1: Personalized Greeting + Compact Stats Strip

**Problem:** The home feed started with a generic Log Deuce button and two separate, large stat cards (Total Deuces and Peak Throne Days). This wasted prime above-the-fold real estate with low-density information and felt impersonal.

**Change:**
- Added a time-of-day greeting with username ("Good morning, @username")
- Replaced two separate stat cards with a compact 3-column stats strip: Total / Best Day / Squads
- Greeting subtitle shows lifetime deuce count or first-time message

**Result:** Reduced vertical space by ~60% while increasing information density. The feed immediately feels personal — users see their name and relevant stats at a glance.

**Commit:** `ea935cfa` — home feed: add personalized greeting + compact stats strip

---

## Iteration 2: Social Activity Feed from Squads

**Problem:** Despite being "The Strava of poop tracking," the home page had NO social feed. It was just stats + a list of groups. There was no visibility into what your squad members were doing — the core engagement loop was missing.

**Change:**
- Added a "Recent Drops" activity feed using the existing `/api/deuces` endpoint (cross-group, 15 entries)
- Feed entries show: avatar, username, group badge (linking to group), timestamp, thoughts, location, reactions
- Ghost drops are displayed anonymously
- Entries are grouped by date (Today / Yesterday / weekday labels) with count badges
- Feed skeleton loading state
- Empty state for when no entries exist yet

**Result:** The home page now functions as a true social feed. Users can see what their squad is doing, react to entries, and feel the activity of their community. This is the single most impactful change — it transforms a static dashboard into a living feed.

**Commit:** `f4452fa5` — home feed: add cross-squad social activity feed

---

## Iteration 3: Compress Premium Perks into Horizontal Scroll Strip

**Problem:** The Premium Perks Hub was a 2x3 grid of feature cards taking up significant vertical space. These were essentially navigation links dressed up as content — they pushed the actual feed content below the fold.

**Change:**
- Replaced the 2x3 grid with a compact horizontal scrollable pill strip
- Each pill: emoji + label in a rounded-full container
- Added Passport link (was missing from the old grid)
- Added `scrollbar-hide` CSS for clean horizontal scroll on all browsers

**Result:** Premium features are still one-tap accessible but now take up a single line (~40px) instead of ~200px. The activity feed and squads are visible much sooner when scrolling.

**Commit:** `2bffb80d` — home feed: compress premium perks into horizontal scroll strip

---

## Iteration 4: Polish Pass

**Problem:** Code cleanup and engagement improvements needed after the structural changes.

**Changes:**
- Removed unused `Card`/`CardContent` imports and `formatDate` function
- Added `scrollbar-hide` CSS utility class for horizontal scroll strips
- Always show Reactions component on feed entries (was previously hidden when no reactions existed), so users can always react — drives engagement
- Added personalized greeting to the free tier for consistency
- Tightened spacing (mb-10 → mb-6) for better visual rhythm

**Result:** Cleaner code, better mobile experience with hidden scrollbars, and more engagement opportunities through always-visible reaction buttons.

**Commit:** `53685cda` — home feed: polish pass — cleanup, scrollbar-hide, always-on reactions

---

## Summary

| # | Iteration | Lines Changed | Impact |
|---|-----------|--------------|--------|
| 1 | Greeting + Stats Strip | -74, +38 | Personal feel, compact stats |
| 2 | Social Activity Feed | +155 | Core social feed — biggest impact |
| 3 | Premium Perks Compression | -60, +17 | Freed space for feed content |
| 4 | Polish Pass | +27, -18 | Code quality + engagement |

**Before:** Static dashboard with separate stat cards, 2x3 premium grid, group list only.
**After:** Personalized greeting → CTA → compact stats → quick-access pills → social activity feed → squads.

The home feed now functions as a real social feed, not a settings page. Users see their name, their stats, their squad's recent activity, and can react — all above the fold on mobile.
