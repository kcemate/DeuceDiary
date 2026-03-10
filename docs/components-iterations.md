# Components Autoresearch Iterations

Components improved: `reactions.tsx`, `ShareCardModal.tsx`, `create-group-modal.tsx`

---

## Iteration 1 — ShareCardModal: Apply dot-grid background texture

**Problem:** `DOT_GRID_BG` was defined at the top of `ShareCardModal.tsx` but never applied to any element, leaving the card without the intended Porcelain Premium texture.

**Change:** Applied `DOT_GRID_BG` as a `backgroundImage` layer on the share card `div`, layered over the existing cream gradient via CSS `background` shorthand split into two properties.

**Result:** Card now shows subtle dot-grid pattern matching the OG image aesthetic. Purely visual — no logic changes.

---

## Iteration 2 — Reactions: Sort picker emojis by entry popularity

**Problem:** The emoji picker always showed emojis in a fixed order, ignoring which emojis were already popular on the entry.

**Change:** Added `getSortedPickerEmojis()` that sorts `commonEmojis` by their usage count on the current entry (descending). Emojis with existing reactions float to the top of the picker grid, making the most contextually relevant choices immediately visible.

**Result:** Picker now surfaces the crowd's favorites first — feels more social and contextual.

---

## Iteration 3 — CreateGroupModal: Random witty placeholder names

**Problem:** The squad name input always showed "e.g. Morning Crew" — same every time, boring.

**Change:** Added `SQUAD_NAME_PLACEHOLDERS` array with 10 toilet-themed squad name ideas. A random one is selected via `useState(randomPlaceholder)` on mount so each modal open shows a fresh suggestion.

**Result:** More delightful and inspiring — users see "e.g. Flush Force" or "e.g. Toilet Titans" instead of the same generic placeholder.

---

## Iteration 4 — ShareCardModal: Rank progress bar

**Problem:** The share card showed rank title but no sense of progression — users couldn't see how close they were to leveling up.

**Change:** Added a horizontal progress bar below the stats row showing current rank → next rank with a gold fill percentage based on `rank.progressToNext`. Includes log count out of next rank threshold. Hidden when user is at max rank.

**Result:** Gamification context visible on the share card — adds urgency and motivation.

---

## Iteration 5 — Reactions: Random horizontal drift on emoji floaters

**Problem:** Floating emoji bursts always went straight up (left: 50%), making multiple reactions in quick succession look robotic.

**Change:** Added `dx` field to `Floater` (random ±18px). Applied as CSS custom property `--dx` on each floater span. Updated `@keyframes floatUp` to use `translateX(calc(var(--dx, 0) * 1px))` for organic diagonal drift.

**Result:** Each reaction burst drifts slightly left or right — feels alive and playful.

---

## Iteration 6 — CreateGroupModal: Expanded squad icon palette (12 → 24)

**Problem:** Only 12 icon options — felt limited, no bathroom/throne variety.

**Change:** Expanded `SQUAD_ICONS` to 24 emojis organized in 4 thematic rows (Throne essentials, Power & glory, Nature & beasts, Vibes). Added `max-h-48 overflow-y-auto` to the picker dropdown for graceful scrolling.

**Result:** 2× more icon choices covering toilet essentials (🧻, 🪠, 🚿) alongside the existing power and vibe options.

---

## Iteration 7 — Reactions: "Popular here" quick-react row in picker

**Problem:** Even with sorted picker emojis, users still had to scan the 2-row 5×2 grid to find the crowd favorites for this specific entry.

**Change:** Added a "Popular here" section at the top of the picker (when there are existing reactions). Shows the top 3 most-reacted emojis as wide buttons with count labels — a fast-path for joining the most popular reactions. Hidden when no reactions exist yet.

**Result:** Social proof + one-tap fast path for the most relevant reactions. Matches the UX pattern of apps like Slack, Discord, and GitHub.

---
