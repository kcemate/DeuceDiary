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
