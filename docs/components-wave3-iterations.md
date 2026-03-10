# Components Wave 3 — Iteration Log

Components: Reactions, ShareCardModal, CreateGroupModal
Design: Porcelain Premium (cream bg, espresso text, green CTAs, gold accents)

---

## Iterations

### Reactions

| # | Change | Commit |
|---|--------|--------|
| 1 | Floating emoji burst on add — emoji rises & fades above pill (floatUp keyframe, useRef ID counter) | 2e871a2f |
| 2 | Picker slide-in animation (pickerSlideIn keyframe) + "Your reactions" row at top of picker | 38b814da |
| 3 | hover:scale-110 on picker emoji buttons for tactile feel | 38b814da |
| 4 | getSortedPickerEmojis — emojis sorted by most-used on this entry first | eb47e55c |
| 5 | "Show less" collapse toggle when all reactions expanded (chevron-up button) | eb47e55c |

### ShareCardModal

| # | Change | Commit |
|---|--------|--------|
| 1 | Gold accent bar at top + premium cream gradient card | ec3c841d |
| 2 | Brand watermark with tagline "Drop a log. Leave a mark." + member-since date | 21af6efe |
| 3 | Stats panel with emoji icons (💩🏆👥) + vertical dividers in rounded bg | b52e9cf2 |
| 4 | Preview link button + compact copy icon + "Share your streak · embarrass your friends" tagline | 5e254f47 |
| 5 | Dot-grid SVG background pattern on card + pulsing fire emoji animation (firePulse keyframe) | a7b71a2f |

### CreateGroupModal

| # | Change | Commit |
|---|--------|--------|
| 1 | Emoji icon picker (12 toilet-themed icons) + character counters on name/desc | d51aac24 |
| 2 | Inline name validation (border-destructive + ⚠️ message), click-outside dismiss overlay, loading spinner | 6257366d |
| 3 | Success state — in-modal card showing squad icon + name + "Your squad is live! 🎉" + invite hint | 38b814da |
| 4 | Live squad name preview pill ("Preview: 🚽 Morning Crew") shown as user types | 30a7e388 |
