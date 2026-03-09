# Theme System Iterations

## Iteration 1: Visually Distinct Themes + On-Brand Names

**Problem:** 3 of 4 themes were dark with barely distinguishable hue shifts (neutral dark, navy dark, purple dark). Kyle's feedback: "Some of them seem too similar."

**Changes:**
- **"Clean Sweep"** (default) — True dark, neutral blacks, green accents. The classic.
- **"Porcelain"** (cream) — Warm cream light theme. Porcelain Premium design. No changes needed.
- **"Sewer Pipe"** (dark) — Completely redesigned from navy to warm brown/amber industrial dark. Orange CTA, gold accents.
- **"Royal Flush"** (midnight) — Saturated rich purple bg, purple CTA instead of green, bright gold accents, pink-red destructive.

**Theme picker:** Added accent color dot on each swatch.

**Key differentiators:**
| Theme | Background | Primary CTA | Accent | Vibe |
|-------|-----------|-------------|--------|------|
| Clean Sweep | Neutral black | Green | Green | Classic dark mode |
| Porcelain | Warm cream | Green | Gold | Light, premium |
| Sewer Pipe | Warm brown | Orange | Gold | Industrial, earthy |
| Royal Flush | Deep purple | Purple | Gold | Regal, premium |

**Tests:** 461 passed. **Commit:** `76b41e67`

---

## Iteration 2: Two New Personality Themes

**Problem:** Even with 4 distinct themes, the palette lacked variety. No cool-toned option, no retro/warm option.

**Changes:**
- **"Splash Zone"** (ocean) — Deep teal bg, aqua/cyan primary CTA, bright cyan accents. Ocean vibes.
- **"Log Cabin"** (retro) — Warm dark brown, amber primary CTA, orange-red accents. Rustic retro.
- Updated theme grid from 4-col to 3-col for 6 themes.
- Both new themes premium-gated.
- Added `ocean` and `retro` to server-side validation (helpers.ts, routes.ts).

**Final theme spread:**
| Theme | Hue Family | Light/Dark | Premium |
|-------|-----------|-----------|---------|
| Clean Sweep | Neutral | Dark | Free |
| Porcelain | Warm cream | Light | Premium |
| Sewer Pipe | Brown/amber | Dark | Free |
| Royal Flush | Purple | Dark | Premium |
| Splash Zone | Teal/cyan | Dark | Premium |
| Log Cabin | Amber/wood | Dark | Premium |

**Tests:** 461 passed. **Commit:** `cd606198`

---

## Iteration 3: Mini-Preview Theme Picker

**Problem:** Color circles with accent dots didn't convey what a theme actually looks like.

**Changes:**
- Replaced circle swatches with mini preview cards showing:
  - Background color fill
  - Fake text lines in the theme's foreground color (title + subtitle)
  - Accent-colored CTA button bar
  - Theme name rendered in the theme's own colors
- Premium crown badge repositioned to top-right corner.

**Tests:** 461 passed. **Commit:** `ee0b5401`

---

## Iteration 4: WCAG AA Contrast Fix

**Problem:** Contrast audit found 3 themes failing WCAG AA for primary button text:
- Clean Sweep: green + white = 2.3:1 (needs 4.5:1)
- Porcelain: green + white = 2.3:1
- Sewer Pipe: orange + white = 2.75:1

**Fix:** Switched `--primary-foreground` from white to dark text on these 3 themes. Royal Flush, Splash Zone, and Log Cabin already used dark text on their primaries and passed.

**Tests:** 461 passed. **Commit:** `9cc1e78b`

---

## Summary

**Before:** 4 themes — 3 nearly identical dark themes with minor hue shifts, 1 light theme. Generic names.
**After:** 6 visually distinct themes with fun on-brand names, mini-preview picker cards, WCAG AA compliant contrast ratios, and a clear premium gating strategy (2 free, 4 premium).
