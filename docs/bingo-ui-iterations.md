# Bingo UI Iterations

## Iteration 1: Bingo Line Highlighting
**Commit:** `316db925`
**Problem:** No visual distinction when a row/col/diagonal is complete — users can't see their BINGO at a glance.
**Change:** Added `computeBingoLineIndices()` — detects complete rows, cols, diagonals. Squares on a completed line get a green border, `ring-2 ring-green-400` glow, and a star icon instead of the standard gold checkmark.
**Result:** BINGO! is now immediately visible without reading the status badge.
**Tests:** 466/466 ✅

## Iteration 2: Progress Bar with Milestone Markers
**Commit:** `7de3309a`
**Problem:** Progress bar showed a plain percentage number — no sense of milestones.
**Change:** Added tick marks at 20%/40%/60%/80% (5/10/15/20 squares), count labels beneath bar that go bold+green when reached, BINGO!/BLACKOUT! badges now stack neatly with tighter border styling.
**Result:** Users can see exactly how far they are from each 5-square milestone.
**Tests:** 466/466 ✅

## Iteration 3: Square Completion Pop Animation
**Commit:** `48e03f41`
**Problem:** Newly completed squares just did `animate-pulse` which is subtle and looping.
**Change:** Added `@keyframes squarePop` — scale up to 1.18x, bounce back to 0.95x, settle at 1x in 0.5s. Enlarged background icon to w-10/h-10 for more visual impact.
**Result:** Completing a square now feels physically satisfying — a quick pop.
**Tests:** 466/466 ✅

## Iteration 4: FREE Center Square + Sharper Uncompleted Text
**Commit:** `263d2ab4`
**Problem:** Center square looked identical to other uncompleted squares, despite being auto-complete. Uncompleted titles were thin.
**Change:** Index 12 gets a special primary-tinted gradient bg, "FREE" in bold primary color, and "Center" subtext. Uncompleted titles upgraded to `font-extrabold`. FREE square gets `border-primary/40`.
**Result:** The board's center is now visually anchored and the FREE square is unmissable.
**Tests:** 466/466 ✅

## Iteration 5: Leaderboard Medal Icons + Color-Coded Bars
**Commit:** `4a03b406`
**Problem:** Leaderboard was a flat list with no visual hierarchy — rank 1 looked identical to rank 10.
**Change:** Top 3 get 🥇🥈🥉 emoji medals. #1 row gets yellow-50 background highlight. Progress bars color-coded: amber=blackout, green=15+, primary=default. Month label added to header.
**Result:** Leaderboard is scannable at a glance — champions stand out instantly.
**Tests:** 466/466 ✅

## Iteration 6: Placeholder Grid Lock Overlay
**Commit:** `80d718cf`
**Problem:** Non-premium placeholder showed fake interactive buttons (Check Progress, Leaderboard) that implied functionality and confused users.
**Change:** Grid now blurred with `blur-[2px]` and overlaid with a frosted lock icon + "Unlock Deuce Bingo" copy + value prop text. Fake buttons removed. Progress bar shown at 30% opacity to tease the mechanic.
**Result:** Premium upsell is clear, non-deceptive, and drives upgrade intent.
**Tests:** 466/466 ✅

## Iteration 7: Improved Confetti + BLACKOUT Celebration Banner
**Commit:** `649c6017`
**Problem:** Confetti used `animate-bounce` (conflicts with inline `animation`) and only triggered on BLACKOUT. Celebration felt underwhelming.
**Change:** Rewrote confetti with horizontal sway via CSS custom property `--sway`. BLACKOUT: 70 pieces, 5s duration, animated gold banner overlay ("🏆 BLACKOUT! 🏆"). Any square completion now triggers a 2.5s confetti burst for immediate reward.
**Result:** Every completion feels rewarding; BLACKOUT is a full celebration moment.
**Tests:** 466/466 ✅
