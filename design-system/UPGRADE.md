# Deuce Diary — Design System Upgrade Spec

> Author: Jordan (Frontend Architecture)
> Date: 2026-02-19
> Status: PROPOSED — awaiting implementation by Taylor

---

## 1. Color System

### Current Problems
- Primary/secondary/accent are identical in light and dark mode — no perceptual adjustment
- `--accent-foreground` is `hsl(0, 0%, 4%)` in dark mode — text on accent is invisible
- Profile stats grid uses 8 hardcoded Tailwind colors (`green-500`, `blue-500`, `amber-500`, `purple-500`)
- CSS gradients use raw HSL values that don't match any token
- Scrollbar uses hardcoded HSL with no dark mode support
- Chart and sidebar token families are referenced in config but never defined

### Proposed Color System

#### Core Semantic Tokens

Keep the shadcn/ui semantic structure (`primary`, `secondary`, `muted`, `accent`, `destructive`) but add:
- A **`surface`** token for elevated card backgrounds
- A **`success`** token (currently abusing `primary` green for success states)
- A **`warning`** token
- A **`info`** token
- Named stat-color tokens to replace hardcoded profile colors

#### Light Mode (`:root`)

```css
:root {
  /* --- Neutrals --- */
  --background: hsl(0, 0%, 98%);        /* unchanged */
  --foreground: hsl(0, 0%, 4%);         /* unchanged */
  --muted: hsl(0, 0%, 93%);             /* unchanged */
  --muted-foreground: hsl(0, 0%, 45%);  /* unchanged */

  /* --- Surfaces --- */
  --card: hsl(0, 0%, 100%);             /* CHANGED: pure white cards for contrast */
  --card-foreground: hsl(0, 0%, 4%);
  --popover: hsl(0, 0%, 100%);
  --popover-foreground: hsl(0, 0%, 4%);
  --surface: hsl(0, 0%, 96%);           /* NEW: for inner surfaces like empty states */
  --surface-foreground: hsl(0, 0%, 4%);

  /* --- Borders & Inputs --- */
  --border: hsl(0, 0%, 88%);            /* unchanged */
  --input: hsl(0, 0%, 88%);             /* unchanged */
  --ring: hsl(142, 71%, 45%);           /* unchanged */

  /* --- Brand Colors --- */
  --primary: hsl(142, 71%, 45%);        /* Deuce Green */
  --primary-foreground: hsl(0, 0%, 100%);

  --secondary: hsl(30, 80%, 32%);       /* Throne Brown — slightly lighter for readability */
  --secondary-foreground: hsl(0, 0%, 100%);

  --accent: hsl(80, 65%, 48%);          /* Lime — slightly desaturated for usability */
  --accent-foreground: hsl(0, 0%, 4%);

  /* --- Semantic Colors --- */
  --destructive: hsl(0, 84%, 60%);
  --destructive-foreground: hsl(0, 0%, 98%);

  --success: hsl(142, 71%, 45%);        /* NEW: same as primary for now */
  --success-foreground: hsl(0, 0%, 100%);

  --warning: hsl(38, 92%, 50%);         /* NEW: amber/orange */
  --warning-foreground: hsl(0, 0%, 4%);

  --info: hsl(217, 91%, 60%);           /* NEW: blue */
  --info-foreground: hsl(0, 0%, 100%);

  /* --- Stat Colors (replace hardcoded profile colors) --- */
  --stat-green: hsl(142, 71%, 45%);
  --stat-blue: hsl(217, 91%, 60%);
  --stat-amber: hsl(38, 92%, 50%);
  --stat-purple: hsl(262, 83%, 58%);

  /* --- Chart Colors --- */
  --chart-1: hsl(142, 71%, 45%);
  --chart-2: hsl(30, 80%, 32%);
  --chart-3: hsl(80, 65%, 48%);
  --chart-4: hsl(217, 91%, 60%);
  --chart-5: hsl(262, 83%, 58%);

  /* --- Radius --- */
  --radius: 0.75rem;
}
```

#### Dark Mode (`.dark`)

```css
.dark {
  /* --- Neutrals --- */
  --background: hsl(0, 0%, 4%);
  --foreground: hsl(0, 0%, 95%);
  --muted: hsl(0, 0%, 10%);
  --muted-foreground: hsl(0, 0%, 55%);

  /* --- Surfaces --- */
  --card: hsl(0, 0%, 8%);               /* CHANGED: slightly lighter for card lift */
  --card-foreground: hsl(0, 0%, 95%);
  --popover: hsl(0, 0%, 8%);            /* CHANGED: match card */
  --popover-foreground: hsl(0, 0%, 95%);
  --surface: hsl(0, 0%, 12%);           /* NEW: inner surfaces */
  --surface-foreground: hsl(0, 0%, 95%);

  /* --- Borders & Inputs --- */
  --border: hsl(0, 0%, 15%);            /* CHANGED: slightly more visible */
  --input: hsl(0, 0%, 15%);
  --ring: hsl(142, 60%, 50%);           /* slightly brighter for dark */

  /* --- Brand Colors (adjusted for dark) --- */
  --primary: hsl(142, 60%, 50%);        /* CHANGED: brighter green on dark */
  --primary-foreground: hsl(0, 0%, 4%); /* CHANGED: dark text on bright green */

  --secondary: hsl(30, 70%, 40%);       /* CHANGED: lighter brown for dark */
  --secondary-foreground: hsl(0, 0%, 100%);

  --accent: hsl(80, 55%, 55%);          /* CHANGED: lighter lime for dark */
  --accent-foreground: hsl(0, 0%, 4%);  /* FIXED: was black, now intentional */

  /* --- Semantic Colors --- */
  --destructive: hsl(0, 63%, 31%);
  --destructive-foreground: hsl(0, 0%, 98%);

  --success: hsl(142, 60%, 50%);
  --success-foreground: hsl(0, 0%, 4%);

  --warning: hsl(38, 85%, 55%);
  --warning-foreground: hsl(0, 0%, 4%);

  --info: hsl(217, 85%, 65%);
  --info-foreground: hsl(0, 0%, 4%);

  /* --- Stat Colors (slightly brighter for dark) --- */
  --stat-green: hsl(142, 60%, 50%);
  --stat-blue: hsl(217, 85%, 65%);
  --stat-amber: hsl(38, 85%, 55%);
  --stat-purple: hsl(262, 75%, 65%);

  /* --- Chart Colors --- */
  --chart-1: hsl(142, 60%, 50%);
  --chart-2: hsl(30, 70%, 40%);
  --chart-3: hsl(80, 55%, 55%);
  --chart-4: hsl(217, 85%, 65%);
  --chart-5: hsl(262, 75%, 65%);

  --radius: 0.75rem;
}
```

#### Tailwind Config Additions

Add to `theme.extend.colors`:

```ts
surface: {
  DEFAULT: "var(--surface)",
  foreground: "var(--surface-foreground)",
},
success: {
  DEFAULT: "var(--success)",
  foreground: "var(--success-foreground)",
},
warning: {
  DEFAULT: "var(--warning)",
  foreground: "var(--warning-foreground)",
},
info: {
  DEFAULT: "var(--info)",
  foreground: "var(--info-foreground)",
},
stat: {
  green: "var(--stat-green)",
  blue: "var(--stat-blue)",
  amber: "var(--stat-amber)",
  purple: "var(--stat-purple)",
},
```

Remove the entire `sidebar` block (unused).

---

## 2. Typography Scale

### Current State
Sizes used: `text-xs`, `text-sm`, `text-base` (implicit), `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl` (emoji only).

Weights used: `font-medium`, `font-semibold`, `font-bold`.

No heading hierarchy — `font-semibold` and `font-bold` overlap on same-size headings.

### Proposed Type Scale

Define clear roles for each text style:

| Role             | Class Combo                        | Use Case                                |
|------------------|------------------------------------|-----------------------------------------|
| **Display**      | `text-3xl font-bold`               | Hero stats, landing title               |
| **Page Title**   | `text-xl font-bold`                | Page-level headings (Home, Groups, etc) |
| **Section Head** | `text-lg font-semibold`            | Card section titles, modal titles       |
| **Card Title**   | `text-base font-semibold`          | Group name, member name in lists        |
| **Body**         | `text-sm font-normal`              | Primary body text, descriptions         |
| **Caption**      | `text-xs font-medium`              | Timestamps, badges, counters            |
| **Label**        | `text-sm font-medium`              | Form labels, settings labels            |
| **Overline**     | `text-xs font-semibold uppercase tracking-wide` | Category labels (future use) |

### Key Changes
1. **Section headings**: Standardize to `text-lg font-semibold` everywhere (drop `font-bold` for section heads)
2. **Page titles**: Always `text-xl font-bold` — reserve `font-bold` for page-level only
3. **Stat numbers**: Use `text-2xl font-bold` for stats, `text-3xl font-bold` for the single hero stat
4. **Empty state titles**: `text-lg font-bold` (keep bold here — it's a content heading, not a section heading)
5. **Body text**: Prefer `text-sm` for descriptions, `text-xs` only for metadata (timestamps, counts)

### Font Weight Rule
- `font-bold` → Page titles and hero stats **only**
- `font-semibold` → Section headings, card titles, button text
- `font-medium` → Labels, captions, nav items
- `font-normal` → Body descriptions

---

## 3. Spacing System

### Current Problems
- Card padding alternates between `p-4`, `p-6`, `p-8` with no pattern
- Section gaps alternate between `mb-3`, `mb-4`, `mb-6`, `mb-8`
- List spacing alternates between `space-y-3` and `space-y-4`

### Proposed Spacing Tokens

Use Tailwind's 4px grid consistently:

| Token Name       | Tailwind Value | Px   | Use Case                              |
|------------------|----------------|------|----------------------------------------|
| `space-xs`       | `1` (0.25rem)  | 4px  | Tight inline gaps                      |
| `space-sm`       | `2` (0.5rem)   | 8px  | Icon-text gaps, badge padding          |
| `space-md`       | `4` (1rem)     | 16px | Standard card padding, list spacing    |
| `space-lg`       | `6` (1.5rem)   | 24px | Section gaps, page top padding         |
| `space-xl`       | `8` (2rem)     | 32px | Empty state padding, major separations |
| `space-2xl`      | `12` (3rem)    | 48px | Page sections (rare)                   |
| `space-page-b`   | `24` (6rem)    | 96px | Bottom nav clearance                   |

### Standardization Rules

1. **Card internal padding**: Always `p-4` for standard cards. Use `p-6` only for hero/stat cards. Use `p-8` only for empty states.
2. **Section gaps**: Always `mb-6` between major sections on a page.
3. **Heading-to-content gap**: Always `mb-4` after a section heading inside a card.
4. **List item spacing**: Always `space-y-3` for tight lists (members, activity), `space-y-4` for card lists (groups).
5. **Page layout**: Always `pt-6 pb-24` for authenticated pages.

---

## 4. Component Patterns

### 4a. Card Variants

Define three card presentations:

#### Standard Card
```tsx
<Card className="shadow-sm">
  <CardContent className="p-4">
    {/* content */}
  </CardContent>
</Card>
```

#### Hero/Stats Card
```tsx
<Card className="shadow-md rounded-2xl">
  <CardContent className="p-6">
    {/* content */}
  </CardContent>
</Card>
```

#### Empty State Card
```tsx
<Card>
  <CardContent className="p-8 text-center">
    <p className="text-4xl mb-3">{emoji}</p>
    <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    {/* optional CTA */}
  </CardContent>
</Card>
```

### 4b. Button Variants

#### Primary CTA (Full Width)
```tsx
<Button className="w-full rounded-2xl py-4 text-lg font-semibold shadow-md">
  {children}
</Button>
```
Note: Stop repeating `bg-primary hover:bg-primary/90 text-primary-foreground` inline — this is the Button default variant.

#### Standard Button
Use shadcn defaults. No className overrides needed for `variant="default"`.

#### Destructive Full Width
```tsx
<Button variant="destructive" className="w-full">
  {children}
</Button>
```

### 4c. Empty State Pattern

Every empty state should follow this structure:

```tsx
<div className="bg-surface rounded-2xl p-8 text-center">
  <p className="text-4xl mb-3">{emoji}</p>
  <p className="text-lg font-bold text-foreground mb-1">{title}</p>
  <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
  {action && (
    <div className="mt-4">
      <Button variant="outline">{actionLabel}</Button>
    </div>
  )}
</div>
```

Use `bg-surface` instead of `bg-muted` for empty states — gives a proper layered surface feel.

### 4d. Loading Skeleton Pattern

Standardize across all pages:

```tsx
<Card className="animate-pulse">
  <CardContent className="p-4">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-muted rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  </CardContent>
</Card>
```

Consider extracting a `<Skeleton />` wrapper component if the pattern repeats more than 3 times.

### 4e. Stat Card Pattern (Profile)

Replace hardcoded colors:

```tsx
<Card className="shadow-sm border-l-4" style={{ borderLeftColor: 'var(--stat-green)' }}>
  <CardContent className="p-4 text-center">
    <p className="text-2xl font-bold" style={{ color: 'var(--stat-green)' }}>{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </CardContent>
</Card>
```

Or better — add Tailwind utilities via the config:
```
border-l-stat-green  text-stat-green
border-l-stat-blue   text-stat-blue
border-l-stat-amber  text-stat-amber
border-l-stat-purple text-stat-purple
```

### 4f. Bottom Navigation

Current is fine structurally. Just ensure:
- Active state uses `text-primary` (already does)
- Inactive state uses `text-muted-foreground` (already does)
- Add `font-medium` to active label for emphasis

### 4g. Modal/Dialog Pattern

Standardize all dialogs:
- Use `sm:max-w-md` (425px variant should align to `sm:max-w-md`)
- All forms inside: `className="space-y-4"`
- Submit button: always last, always `w-full`
- Cancel button: `variant="outline"` when present

---

## 5. Shadows & Depth (Elevation System)

### Current State
Only `shadow-sm` and `shadow-lg` used. One hardcoded `rgba()` hover shadow. No dark mode shadow adaptation.

### Proposed Elevation System

| Level   | Tailwind Class | Use Case                                | Dark Mode Note              |
|---------|---------------|------------------------------------------|-----------------------------|
| **E0**  | (none)        | Flat surfaces, muted backgrounds         | —                           |
| **E1**  | `shadow-sm`   | Standard cards, inputs                   | Use ring-based border lift  |
| **E2**  | `shadow-md`   | Hovered cards, dropdowns                 | Slightly stronger           |
| **E3**  | `shadow-lg`   | Hero elements, CTAs, modals              | Use glow effect on brand    |
| **E4**  | `shadow-xl`   | Floating elements, notification banners  | Combine with border glow    |

### Implementation

Add custom shadow values to `tailwind.config.ts` that work in dark mode:

```ts
boxShadow: {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
},
```

For dark mode, rely on `border` emphasis rather than shadow (shadows are near-invisible on dark backgrounds). Add a pattern:

```
/* Dark mode card lift pattern */
dark:shadow-none dark:border-border dark:hover:border-primary/20
```

### Remove CSS Shadows
Delete the `.group-card:hover` hardcoded `box-shadow` from `index.css`. Replace with `hover:shadow-md transition-shadow`.

---

## 6. Border Radius

### Current State
Mixed usage: `rounded-lg` (cards), `rounded-xl` (inner surfaces), `rounded-2xl` (CTAs, stats), `rounded-md` (buttons, inputs), `rounded-full` (avatars).

### Proposed Standard

| Token          | Value  | Use Case                          |
|----------------|--------|-----------------------------------|
| `rounded-md`   | 6px    | Buttons, inputs, badges (keep)    |
| `rounded-lg`   | 12px   | Standard cards (shadcn default)   |
| `rounded-2xl`  | 20px   | Hero cards, CTAs, stat banners    |
| `rounded-full` | 9999px | Avatars, dots, pills              |

### Rules
1. **Cards**: Use `rounded-2xl` as the primary card radius (upgrade from `rounded-lg`)
2. **Inner surfaces**: Use `rounded-xl` for nested containers (empty states, inner stat blocks)
3. **Buttons**: Keep `rounded-md` for standard buttons, `rounded-2xl` for hero CTAs
4. **Inputs**: Keep `rounded-md`

### Implementation
Update the Card primitive's base class from `rounded-lg` to `rounded-2xl`:

```tsx
// card.tsx — change base class
"rounded-2xl border bg-card text-card-foreground shadow-sm"
```

This is the single highest-impact change. Instantly modernizes every card in the app.

---

## 7. Animation Tokens

### Current State
5+ different durations (0.1s–0.6s), 4+ different easing functions, mix of CSS keyframes and Tailwind utilities.

### Proposed Standard Tokens

#### Durations
| Token          | Value  | Use Case                          |
|----------------|--------|-----------------------------------|
| `duration-fast`  | 100ms  | Micro-interactions (scale, color) |
| `duration-base`  | 200ms  | Standard transitions              |
| `duration-slow`  | 300ms  | Overlays, modals, banners         |
| `duration-enter` | 400ms  | Page entries, list appearances    |

#### Easing
| Token          | Value                        | Use Case                  |
|----------------|------------------------------|---------------------------|
| `ease-out`     | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances (decelerate) |
| `ease-in`      | `cubic-bezier(0.55, 0, 1, 0.45)` | Exits (accelerate)    |
| `ease-spring`  | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounces    |

#### Add to `tailwind.config.ts`

```ts
transitionDuration: {
  fast: "100ms",
  base: "200ms",
  slow: "300ms",
  enter: "400ms",
},
transitionTimingFunction: {
  "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
  "in-expo": "cubic-bezier(0.55, 0, 1, 0.45)",
  "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
},
```

### CSS Cleanup
- Replace `.entry-card` animation (0.5s) with `duration-enter ease-out-expo` via Tailwind
- Replace `.group-card` transition (0.3s all) with `transition-shadow duration-slow`
- Replace `.nav-item` transition with `transition-colors duration-base`
- Replace `.haptic-feedback` with `active:scale-95 transition-transform duration-fast`
- Keep `.fab-bounce` and `slideUp` as CSS keyframes (complex multi-step animations)

---

## 8. Dark Mode Fixes (Immediate)

These are bugs, not preferences. Fix before any redesign work:

1. **`--accent-foreground` in dark mode**: Change from `hsl(0, 0%, 4%)` to `hsl(0, 0%, 4%)` — actually, since accent (`hsl(80, 80%, 50%)`) is a bright lime, dark text is correct. But verify contrast ratio (currently 3.8:1 — fails WCAG AA). Consider lightening accent in dark mode OR switching foreground to white.

2. **Scrollbar dark mode**: Add `.dark` scrollbar styles:
   ```css
   .dark ::-webkit-scrollbar-track { background: hsl(0, 0%, 8%); }
   .dark ::-webkit-scrollbar-thumb { background: hsl(0, 0%, 25%); }
   .dark ::-webkit-scrollbar-thumb:hover { background: hsl(0, 0%, 40%); }
   ```

3. **Group card hover shadow**: Replace `rgba(0, 0, 0, 0.1)` with `shadow-md` Tailwind class.

4. **log-deuce-modal.tsx line 297**: Change `text-red-500` to `text-destructive`.

5. **CSS gradient classes**: Update to use CSS variables:
   ```css
   .deuce-counter { background: linear-gradient(135deg, var(--primary), var(--primary) / 0.85); }
   .stats-card { background: linear-gradient(135deg, var(--secondary), var(--secondary) / 0.85); }
   ```

---

## 9. Migration Plan

### Phase 1: Tokens & Config (No Visual Change)
1. Update `tailwind.config.ts` with new color tokens (surface, success, warning, info, stat-*)
2. Add CSS variable definitions in `index.css`
3. Define chart colors
4. Remove unused sidebar config

### Phase 2: Bug Fixes (Immediate Quality)
1. Fix dark mode accent-foreground
2. Fix scrollbar dark mode
3. Replace hardcoded colors in profile.tsx
4. Replace hardcoded error color in log-deuce-modal
5. Fix gradient CSS classes

### Phase 3: Card & Spacing Standardization
1. Update Card primitive to `rounded-2xl`
2. Standardize card padding (p-4 standard, p-6 hero, p-8 empty)
3. Standardize section gaps to `mb-6`
4. Standardize list spacing

### Phase 4: Typography & Animation
1. Apply type scale hierarchy across all pages
2. Add animation tokens to config
3. Replace CSS transitions with Tailwind utilities where possible
4. Reduce index.css custom styles

### Phase 5: Elevation & Polish
1. Implement shadow scale
2. Add dark mode shadow-to-border patterns
3. Final visual QA pass

---

## 10. Files to Modify

| File | Changes |
|------|---------|
| `tailwind.config.ts` | Add surface, success, warning, info, stat-* colors. Add animation tokens. Remove sidebar config. |
| `client/src/index.css` | New CSS variables for all new tokens. Fix dark mode values. Dark scrollbar. Clean up gradients. |
| `client/src/components/ui/card.tsx` | Change base radius to `rounded-2xl` |
| `client/src/pages/profile.tsx` | Replace hardcoded stat colors with `stat-*` tokens |
| `client/src/pages/home.tsx` | Remove redundant `bg-primary hover:bg-primary/90` on buttons (already default) |
| `client/src/pages/groups.tsx` | Same button cleanup |
| `client/src/pages/landing.tsx` | Same button cleanup |
| `client/src/components/create-group-modal.tsx` | Same button cleanup |
| `client/src/components/log-deuce-modal.tsx` | Fix `text-red-500` → `text-destructive`. Same button cleanup. |
| `client/src/components/invite-modal.tsx` | Same button cleanup |
| `client/src/components/edit-username-modal.tsx` | Standardize dialog width to `sm:max-w-md` |
| `client/src/components/bottom-navigation.tsx` | Add `font-medium` to active label |
