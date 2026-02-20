# CEO Design Memo — Deuce Diary Redesign
_2026-02-19 | Giovanni_

## The Problem

The current design is functional but forgettable. It looks like a Tailwind starter template with green buttons. The copy has personality — the design doesn't. A user landing on this app wouldn't know it's different from any other generic social app.

**The gap:** We have an irreverent, funny concept with a bland face. That mismatch kills trust and virality.

---

## The Target Feeling

When someone opens Deuce Diary, they should feel like they just walked into a funny group chat. Warm. In on the joke. Slightly unhinged in the best way.

**Design should feel like:** Bold, confident, slightly chaotic-good. Not startup-generic. Not childish. Grown adults being proudly weird about something mundane.

**Emotional target:** The first reaction should be a laugh or a smile — not "oh, another app."

---

## Competitive Design References

### What to Study:
1. **BeReal** — Raw, authentic feed energy. No polish theater. The design says "we're not trying too hard" which makes it feel real.
2. **Duolingo** — Gamification done right. Every streak, every stat, every badge makes you want to tap again. The owl is annoying and you love it.
3. **Cash App** — Dark first. Big bold numbers. Green used sparingly but powerfully. Feels premium despite being simple.
4. **Strava** — Activity feed as social proof. Stats displayed like trophies. Group dynamics built around shared embarrassing moments.
5. **Gas App (2022-2023)** — Proved anonymous social + friend groups + humor = viral. The UI was clean and fast. The concept did the heavy lifting.

### What to Avoid:
- **Notion syndrome:** Over-engineered "clean" that feels cold
- **Light mode default:** Gen Z lives in dark mode
- **Pastel anything:** Soft colors say "wellness app"
- **Too many whitespace:** Empty space should feel intentional, not lazy

---

## iOS 2025 Design Trends (My Intel)

1. **Material You influence on iOS** — Adaptive, dynamic color. Background tints that shift based on context.
2. **Thick, heavy typography** — font-weight 800-900 for hero numbers and headlines. Tabular nums for stats.
3. **Frosted glass / backdrop-blur** — for nav bars, bottom sheets, modals
4. **Pill-shaped buttons** — fully rounded (rounded-full) for primary CTAs
5. **Gradient accents** — not pastel gradients, vivid to vivid. Green-to-lime. Or brand color to transparent.
6. **Bottom sheet everything** — native-feeling modal interactions
7. **High contrast dark mode** — near-black (#0A0A0A) backgrounds, not zinc-900

---

## Screen-by-Screen Priorities (CEO View)

### Landing/Login
**Priority:** Make the first impression hit. Right now it's polite. It should be a gut-punch.
- Hero headline needs to be HUGE — 3xl or 4xl, font-black
- The toilet icon/logo should be the visual anchor, not a tiny header item
- 'Enter the Throne Room' should feel like a portal — full width, pill-shaped, gradient

### Home
**Priority:** The 'Log a Deuce' button is the entire product. It should be unmissable.
- Make it the biggest element on the page. Pill-shaped. Gradient. Animated pulse or glow.
- Stats below feel like data — make them feel like achievements
- The feed is where retention lives — even the empty state should make you want to fill it

### Groups
**Priority:** Social proof and FOMO.
- Empty state needs to sell the dream — not just 'no groups yet' but what it LOOKS LIKE when your group is active

### Profile
**Priority:** Pride. Make users proud of their numbers.
- Stats should look like trophies, not a spreadsheet
- The streak 🔥 number should be huge and orange
- 'Throne Philosopher' is great — make it a real badge they want to show off

---

## The One Thing

If we only do one thing right: **make the Log a Deuce button an event**. It should feel like hitting the Uber button. You know something is happening. Satisfying. Obvious. Unmissable.

Everything else is set dressing.

---

_This memo feeds into Taylor's redesign, Jordan's design system spec, and Casey's UX audit._
_Compile all outputs into design-system/FINAL_BRIEF.md by 5 AM._
