# Deuce Diary — Current Design Tokens

> Extracted from `tailwind.config.ts`, `client/src/index.css`, and all component/page files.
> Last audited: 2026-02-19

---

## 1. Color Tokens (CSS Custom Properties)

### Light Mode (`:root`)

| Token                    | Value                       | Resolved Color  | Role                  |
|--------------------------|-----------------------------|-----------------|-----------------------|
| `--background`           | `hsl(0, 0%, 98%)`          | Near white      | Page background       |
| `--foreground`           | `hsl(0, 0%, 4%)`           | Near black      | Primary text          |
| `--muted`                | `hsl(0, 0%, 93%)`          | Light gray      | Muted surfaces        |
| `--muted-foreground`     | `hsl(0, 0%, 45%)`          | Mid gray        | Secondary text        |
| `--popover`              | `hsl(0, 0%, 100%)`         | White           | Popover bg            |
| `--popover-foreground`   | `hsl(0, 0%, 4%)`           | Near black      | Popover text          |
| `--card`                 | `hsl(0, 0%, 96%)`          | Off white       | Card surface          |
| `--card-foreground`      | `hsl(0, 0%, 4%)`           | Near black      | Card text             |
| `--border`               | `hsl(0, 0%, 88%)`          | Light gray      | Borders               |
| `--input`                | `hsl(0, 0%, 88%)`          | Light gray      | Input borders         |
| `--primary`              | `hsl(142, 71%, 45%)`       | Green           | Primary actions/brand |
| `--primary-foreground`   | `hsl(0, 0%, 100%)`         | White           | Text on primary       |
| `--secondary`            | `hsl(30, 80%, 28%)`        | Brown/amber     | Secondary actions     |
| `--secondary-foreground` | `hsl(0, 0%, 100%)`         | White           | Text on secondary     |
| `--accent`               | `hsl(80, 80%, 50%)`        | Lime green      | Accent highlights     |
| `--accent-foreground`    | `hsl(0, 0%, 4%)`           | Near black      | Text on accent        |
| `--destructive`          | `hsl(0, 84%, 60%)`         | Red             | Error/danger          |
| `--destructive-foreground` | `hsl(0, 0%, 98%)`        | White           | Text on destructive   |
| `--ring`                 | `hsl(142, 71%, 45%)`       | Green           | Focus ring            |
| `--radius`               | `0.75rem`                   | 12px            | Base border radius    |

### Dark Mode (`.dark`)

| Token                    | Value                       | Notes                                   |
|--------------------------|-----------------------------|-----------------------------------------|
| `--background`           | `hsl(0, 0%, 4%)`           | Near black                              |
| `--foreground`           | `hsl(0, 0%, 95%)`          | Near white                              |
| `--muted`                | `hsl(0, 0%, 10%)`          | Dark gray                               |
| `--muted-foreground`     | `hsl(0, 0%, 55%)`          | Mid gray                                |
| `--popover`              | `hsl(0, 0%, 5%)`           | Very dark                               |
| `--popover-foreground`   | `hsl(0, 0%, 95%)`          | Near white                              |
| `--card`                 | `hsl(0, 0%, 7%)`           | Very dark gray                          |
| `--card-foreground`      | `hsl(0, 0%, 95%)`          | Near white                              |
| `--border`               | `hsl(0, 0%, 12%)`          | Dark gray                               |
| `--input`                | `hsl(0, 0%, 12%)`          | Dark gray                               |
| `--primary`              | `hsl(142, 71%, 45%)`       | **SAME as light** — no dark adjustment  |
| `--primary-foreground`   | `hsl(0, 0%, 100%)`         | White                                   |
| `--secondary`            | `hsl(30, 80%, 28%)`        | **SAME as light** — no dark adjustment  |
| `--secondary-foreground` | `hsl(0, 0%, 100%)`         | White                                   |
| `--accent`               | `hsl(80, 80%, 50%)`        | **SAME as light** — no dark adjustment  |
| `--accent-foreground`    | `hsl(0, 0%, 4%)`           | **BUG: near-black on dark bg!**         |
| `--destructive`          | `hsl(0, 63%, 31%)`         | Darkened (good)                         |
| `--destructive-foreground` | `hsl(0, 0%, 98%)`        | White                                   |
| `--ring`                 | `hsl(142, 71%, 45%)`       | Same as light                           |

### Chart Colors (Tailwind config, no CSS values defined)

| Token       | CSS Variable    | Status                |
|-------------|----------------|-----------------------|
| `chart-1`   | `var(--chart-1)` | **UNDEFINED** in CSS |
| `chart-2`   | `var(--chart-2)` | **UNDEFINED** in CSS |
| `chart-3`   | `var(--chart-3)` | **UNDEFINED** in CSS |
| `chart-4`   | `var(--chart-4)` | **UNDEFINED** in CSS |
| `chart-5`   | `var(--chart-5)` | **UNDEFINED** in CSS |

### Sidebar Colors (Tailwind config, no CSS values defined)

All `--sidebar-*` variables are referenced in `tailwind.config.ts` but **never defined** in `index.css`. Dead code unless sidebar is added.

---

## 2. Hardcoded Colors (Bypass Design System)

### `client/src/pages/profile.tsx` — Stats Grid
```
border-l-green-500    text-green-600     (Total Deuces)
border-l-blue-500     text-blue-600      (Groups)
border-l-amber-500    text-amber-500     (Streak)
border-l-purple-500   text-purple-600    (Best Day)
```
These 8 raw Tailwind colors are not connected to any token. They will not adapt to dark mode meaningfully.

### `client/src/index.css` — Gradient Backgrounds
```css
.deuce-counter { background: linear-gradient(135deg, hsl(122, 39%, 49%), hsl(122, 39%, 44%)); }
.stats-card    { background: linear-gradient(135deg, hsl(28, 24%, 44%), hsl(28, 24%, 39%)); }
```
Neither uses `--primary` or `--secondary`. The `.deuce-counter` green (`hsl(122)`) doesn't even match `--primary` (`hsl(142)`).

### `client/src/index.css` — Scrollbar
```css
::-webkit-scrollbar-track  { background: hsl(60, 4.8%, 95.9%); }
::-webkit-scrollbar-thumb  { background: hsl(25, 5.3%, 44.7%); }
::-webkit-scrollbar-thumb:hover { background: hsl(20, 14.3%, 4.1%); }
```
No dark mode variants. On dark backgrounds, the scrollbar track will be a bright strip.

### `client/src/components/log-deuce-modal.tsx:297`
```tsx
<div className="text-sm text-red-500">Error loading groups...</div>
```
Should use `text-destructive`.

### `client/src/index.css` — Group Card Hover Shadow
```css
box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
```
Hardcoded `rgba()` — no dark mode adaptation.

---

## 3. Typography Tokens

### Font Sizes in Use

| Tailwind Class | Approx Size | Where Used                                          |
|----------------|-------------|-----------------------------------------------------|
| `text-xs`      | 12px        | Nav labels, timestamps, badge text, char counters   |
| `text-sm`      | 14px        | Muted descriptions, secondary text, form labels     |
| `text-base`    | 16px        | Body default (implicit), input text on mobile       |
| `text-lg`      | 18px        | Section headings, modal titles, empty state titles  |
| `text-xl`      | 20px        | Page titles (Home, Groups, Profile)                 |
| `text-2xl`     | 24px        | Stat numbers (Profile), Card title primitive        |
| `text-3xl`     | 30px        | Hero stat number (Home deuce count)                 |
| `text-4xl`     | 36px        | Emoji in empty states only                          |

### Font Weights in Use

| Weight          | Where Used                                              | Issue                |
|-----------------|---------------------------------------------------------|----------------------|
| `font-medium`   | Member names, nav badge text, notification text         | Underused            |
| `font-semibold` | Section headings, card headings, buttons, dialog titles | Overused — default   |
| `font-bold`     | Page titles, stat numbers, empty state headings         | Overlaps semibold    |

### Inconsistencies
- **No heading hierarchy**: `text-lg font-semibold` and `text-lg font-bold` used for the same kind of section heading
- Section headers in cards: `h3.font-semibold` in some places, `h3.text-lg.font-semibold` in others
- Landing page `h1` is `text-3xl font-bold` — only h1 in the app but doesn't stand out from stat numbers
- No `font-light` or `font-normal` used intentionally — everything defaults or is semibold/bold

---

## 4. Spacing Tokens

### Page Layout
| Pattern      | Value   | Usage                              |
|--------------|---------|-------------------------------------|
| Top padding  | `pt-6`  | All authenticated pages (consistent)|
| Bottom pad   | `pb-24` | All authenticated pages (nav clear) |
| Max width    | `max-w-md` | Bottom nav, notification banner  |

### Card Internal Padding
| Pattern | Where Used                                                    |
|---------|---------------------------------------------------------------|
| `p-4`   | Group cards, member lists, settings cards, feature cards      |
| `p-6`   | Home stats banner, Peak Throne Days card, Card primitive base |
| `p-8`   | Empty states, not-found card, profile empty activity          |

**Issue**: Three different internal padding values with no clear rule for when to use which.

### Section Gaps
| Pattern | Where Used                                      |
|---------|-------------------------------------------------|
| `mb-3`  | Section headings within cards, sub-items        |
| `mb-4`  | Section headings, profile header bottom, grid   |
| `mb-6`  | Major sections on all pages                     |
| `mb-8`  | Profile header                                  |

**Issue**: `mb-3` and `mb-4` used for the same purpose (heading-to-content gap within cards).

### List Spacing
| Pattern      | Where Used                     |
|--------------|--------------------------------|
| `space-y-3`  | Home group list, activity list |
| `space-y-4`  | Groups page list, settings     |

**Issue**: Home and Groups pages render similar group lists with different spacing.

---

## 5. Border Radius Tokens

| Tailwind Class  | Size   | Where Used                                    |
|-----------------|--------|-----------------------------------------------|
| `rounded-md`    | 6px    | Buttons (default), inputs                     |
| `rounded-lg`    | 12px*  | Cards (shadcn default, via `--radius`)        |
| `rounded-xl`    | 16px   | Empty states, Peak Throne inner card          |
| `rounded-2xl`   | 20px   | Home CTA button, Home stats banner            |
| `rounded-full`  | 9999px | Avatars, badges, activity dots                |
| `rounded-sm`    | 4px*   | Dialog close button                           |

*Via `--radius` (0.75rem) calc in tailwind config.

**Issue**: Cards use `rounded-lg` (12px) but key surfaces use `rounded-2xl` (20px) — no single "card radius" standard.

---

## 6. Shadow Tokens

| Pattern                                     | Where Used                           |
|---------------------------------------------|--------------------------------------|
| `shadow-sm`                                 | Most cards across all pages          |
| `shadow-lg`                                 | Home CTA button, Home stats banner, dialog, notification |
| `shadow-md`                                 | (not used — gap in the scale)        |
| `0 8px 25px rgba(0,0,0,0.1)` (hardcoded)   | `.group-card:hover` in CSS           |

**Issue**: No layered elevation system. `shadow-sm` and `shadow-lg` with nothing in between. Custom shadow in CSS uses hardcoded color.

---

## 7. Animation Tokens

### CSS Keyframes (index.css)
| Name       | Duration | Easing          | Used By              |
|------------|----------|-----------------|----------------------|
| `fadeIn`   | 0.5s     | ease-out        | `.entry-card`        |
| `bounce`   | 0.6s     | ease-in-out     | `.fab-bounce`        |
| `slideUp`  | 0.3s     | ease-out        | `.modal-content`     |

### CSS Transitions (index.css)
| Target               | Property         | Duration | Easing         |
|----------------------|------------------|----------|----------------|
| `body`               | background, color| 0.2s     | ease           |
| `.nav-item`          | color            | 0.2s     | ease-in-out    |
| `.group-card`        | all              | 0.3s     | ease           |
| `.haptic-feedback`   | transform        | 0.1s     | ease           |
| `.notification-banner` | transform      | 0.3s     | ease           |

### Tailwind Animation Utilities Used
| Class              | Where Used                       |
|--------------------|----------------------------------|
| `animate-pulse`    | Loading skeletons (all pages)    |
| `animate-spin`     | Upload spinner (profile picture) |
| `transition-colors`| Bottom nav links                 |
| `transition-shadow`| Home group card hover            |
| `duration-200`     | Dialog content (shadcn)          |
| `duration-300`     | Notification banner (inline)     |

### Tailwind Config Animations
| Name             | Duration | Easing   | Note                         |
|------------------|----------|----------|------------------------------|
| `accordion-down` | 0.2s     | ease-out | Defined but unused in app    |
| `accordion-up`   | 0.2s     | ease-out | Defined but unused in app    |

**Issue**: Durations range from 0.1s to 0.6s with at least 5 different easing functions. No standard duration/easing tokens. Mix of CSS animations and Tailwind utilities with no clear system.

---

## Summary of Critical Inconsistencies

1. **8 hardcoded Tailwind colors** in profile.tsx bypass the token system
2. **Dark mode accent-foreground is black** — text on accent surfaces invisible in dark mode
3. **Primary/secondary/accent unchanged in dark mode** — can be harsh on dark backgrounds
4. **Card padding varies** between p-4, p-6, p-8 with no clear hierarchy
5. **Section spacing** alternates between mb-3/mb-4 and space-y-3/space-y-4 arbitrarily
6. **Border radius inconsistent** — cards are rounded-lg but CTA/banners are rounded-2xl
7. **No elevation system** — only shadow-sm and shadow-lg with a hardcoded hover shadow
8. **5+ animation durations** with no standard tokens
9. **Chart colors referenced but undefined** — will break if charts are added
10. **Sidebar colors referenced but undefined** — dead config code
11. **CSS gradient colors** don't match design system tokens at all
12. **Scrollbar styling** uses hardcoded HSL with no dark mode support
