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
