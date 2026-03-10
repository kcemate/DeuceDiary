# Misc Components — Autoresearch Iterations

## Session: 2026-03-09

**Components touched:** `WeeklyThroneReport.tsx`, `premium-gate.tsx`, `not-found.tsx`
**Tests:** 466 passing throughout all iterations

---

### Iter 1 — PremiumGate: Feature list + social proof
**Commit:** `7d0552df`

**Change:** Replaced the bare "Upgrade to Premium" overlay with a full card containing:
- 4 generic premium feature bullets + a `FEATURE_BULLETS` lookup map for feature-specific context
- "Join thousands living their best throne life" social proof tagline
- "From $2.99/mo · Cancel anytime" reassurance

**Why:** The gate was visually barren and unconvincing. Users need to understand *what* they're buying before they click.

**Outcome:** Gate now serves as a mini landing page per feature. Linter also added per-feature bullet sets for Bingo, Insurance, Themes, Analytics, Gold Badge.

---

### Iter 2 — NotFound: Spinning toilet + random flush copy
**Commit:** `6e232935`

**Change:**
- Replaced static bouncing 🧻 with a slowly rotating 🚽 (6s spin — drain effect)
- Added 5 random flush-humor copy variants picked at page load
- Added "let us know" link for authenticated users

**Why:** The copy was static and could be funnier. The bouncing TP felt disconnected from the drain/throne theme.

**Outcome:** Linter also added a `THRONE_FACTS` array, a random fact card, and a "View my profile instead →" secondary CTA — page became substantially richer.

---

### Iter 3 — WeeklyThroneReport: Streak tier badge in header
**Commit:** `99592bdc`

**Change:** Added a color-coded streak tier pill (Starter/Bronze/Silver/Gold/Diamond) below the personalized headline using the existing `getStreakTier` helper from `lib/gamification.ts`.

**Why:** The header had the date and headline but no visual "status" indicator. The tier badge adds visual hierarchy and makes the streak feel rewarding.

**Outcome:** Badge color matches tier exactly (espresso for Starter, gold for Gold, cyan for Diamond, etc.).

---

### Iter 4 — WeeklyThroneReport: Prominent funniest-entry quote card
**Commit:** `43c78cc0`

**Change:**
- Removed funniest entry from cramped 2×2 grid (was the 5th item in a 2-col grid)
- Stats grid is now a clean 2×2 (4 remaining stats)
- Added full-width styled quote card below the grid showing up to 72 chars + reaction count

**Why:** A truncated thought crammed into a tiny cell loses all its humor. A quote card with proper breathing room turns it into a highlight.

---

### Iter 5 — PremiumGate: Pulsing gold crown animation
**Commit:** `2d8fe20f`

**Change:** Added `crownPulse` CSS keyframe animation to the 👑 icon — subtle scale (1.0→1.08) + drop-shadow glow on a 2.4s ease-in-out loop.

**Why:** The static crown emoji didn't draw the eye. A gentle glow pulse communicates "premium" without being distracting.

---

### Iter 6 — NotFound: Porcelain Premium card frame + brand footer
**Commit:** `1eb28068`

**Change:**
- Wrapped 404 content in a rounded card with gold gradient accent top bar
- Card uses the Porcelain Premium background gradient + gold border + shadow
- Brand footer "🚽 Deuce Diary · Drop a log. Leave a mark." at bottom

**Why:** The 404 page was floating freely on the bg. Wrapping in the brand card makes it feel intentional and consistent with the design system.

---

### Iter 7 — WeeklyThroneReport: Weekly score progress bar
**Commit:** `d2953d7f`

**Change:** Added a 5px progress bar inside the hero stat card showing % progress toward a 7-deuce "perfect week":
- Gold bar while < 7 deuces, green bar at 100%
- Shows "Perfect week! 🏆" or "N to go for a perfect week"
- Score % shown right-aligned above bar

**Why:** The total count as a raw number doesn't tell you how *good* the week was. Contextualizing it against the 7-deuce goal turns a stat into a motivational target.

---

## Summary

| Component | Before | After |
|---|---|---|
| `WeeklyThroneReport` | Basic stat grid, bar chart, share btn | + Streak tier badge, dedicated quote card, weekly score progress bar |
| `PremiumGate` | Crown + upgrade btn | + Feature bullets per feature, social proof, price hint, crown pulse animation |
| `NotFound` | Bouncing TP, static copy | + Floating emoji trio, random flush copy, throne fact card, brand card frame, brand footer |
