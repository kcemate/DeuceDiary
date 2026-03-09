# Theme System Iterations

## Iteration 1: Visually Distinct Themes + On-Brand Names

**Problem:** 3 of 4 themes were dark with barely distinguishable hue shifts (neutral dark, navy dark, purple dark). Kyle's feedback: "Some of them seem too similar."

**Changes:**
- **"Clean Sweep"** (default) — True dark, neutral blacks, green accents. The classic.
- **"Porcelain"** (cream) — Warm cream light theme. Porcelain Premium design. No changes needed.
- **"Sewer Pipe"** (dark) — Completely redesigned from navy to warm brown/amber industrial dark. Orange CTA, gold accents. Feels completely different from Clean Sweep.
- **"Royal Flush"** (midnight) — Saturated rich purple bg (+45→+45% saturation), purple CTA instead of green, bright gold accents, pink-red destructive. Feels premium and regal.

**Theme picker:** Added accent color dot on each swatch so users can see the personality at a glance.

**Key differentiators now:**
| Theme | Background | Primary CTA | Accent | Vibe |
|-------|-----------|-------------|--------|------|
| Clean Sweep | Neutral black | Green | Green | Classic dark mode |
| Porcelain | Warm cream | Green | Gold | Light, premium |
| Sewer Pipe | Warm brown | Orange | Gold | Industrial, earthy |
| Royal Flush | Deep purple | Purple | Gold | Regal, premium |

**Tests:** 461 passed, 0 failed.
**Files changed:** `client/src/index.css`, `client/src/pages/settings.tsx`

---
