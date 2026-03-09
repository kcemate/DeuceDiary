# Home Motivation Loops — Iteration Log

## Goal
Move key motivation loops (rank, streak, badges) from the Profile page to the Home page. Make users want to log by putting progress front and center.

## Refactoring: Shared Gamification Helpers
- Extracted `THRONE_RANKS`, `getThroneRank`, `getStreakTier`, `MILESTONES` to `client/src/lib/gamification.ts`
- Profile page now imports from shared module instead of defining locally
- Eliminates duplication between home and profile

---

## Iteration 1: Rank + XP Progress Bar
**Component:** `client/src/components/rank-strip.tsx`

- Compact card showing current rank icon, level number, and title
- Progress bar with gradient (primary → accent) toward next rank
- Shows "X more to [Next Rank Title]" below the bar
- Taps through to profile for full details
- Added to both free and premium home layouts

**Result:** Gives users immediate sense of progression. The "X more to unlock" creates a clear goal loop.

---

## Iteration 2: Streak Progress Bar
**Component:** `client/src/components/streak-strip.tsx`

- Compact card with streak tier icon and colored tier label
- Shows current streak days with flame icon
- Progress bar colored to match current tier
- "Xd to [Next Tier Icon] [Next Tier]" shows what's next
- Background has subtle tier-colored tint
- Premium only (requires groups data for streak calculation)

**Result:** Streak visibility on home creates daily urgency. Tier progression (Starter → Bronze → Silver → Gold → Diamond) gives long-term goals.

---

## Iteration 3: Next Badge Teaser
**Component:** `client/src/components/next-badge-teaser.tsx`

- Shows the next unlockable milestone with exact progress (X/Y count)
- Gold gradient progress bar for milestone badges
- Falls back to next locked achievement badge if all milestones are done
- "X more to unlock" creates the "just one more" loop
- Available for both free and premium users

**Result:** Creates a clear "just one more deuce" motivation. Progress bars with exact counts make the goal feel achievable.

---

## Layout
The motivation strips are stacked vertically between the greeting and the Log Deuce CTA:

```
Greeting ("Good morning, username")
├── Rank Strip (Lvl X — Title + progress bar)
├── Streak Strip (Xd streak + tier progress) [premium only]
├── Next Badge Teaser (milestone/badge + progress bar)
Log Deuce Button
Stats / Feed / Squads
```

All strips are compact (single row with icon + text + progress bar), keeping the feed above the fold on most devices.
