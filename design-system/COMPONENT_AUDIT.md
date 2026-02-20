# Deuce Diary — Component & Page Audit

> Per-file audit: current classes, inconsistencies found, and recommended changes.
> Reference UPGRADE.md for the full design system spec.

---

## Pages

### `client/src/pages/home.tsx`

#### Current Classes Used
```
Page layout:       pt-6 pb-24
CTA button:        w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold rounded-2xl shadow-lg
Stats banner:      bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6 rounded-2xl mb-6 shadow-lg
Stats sub-text:    text-secondary-foreground/80 text-sm
Hero stat:         text-3xl font-bold
Icon circle:       w-16 h-16 bg-secondary-foreground/20 rounded-full flex items-center justify-center
Section head:      text-lg font-semibold text-foreground mb-4
Card:              mb-6 shadow-sm
Card content:      p-6
Inner stat card:   bg-secondary text-secondary-foreground p-4 rounded-xl
Empty state:       bg-muted rounded-xl p-8 text-center
Empty emoji:       text-4xl mb-3
Empty title:       font-bold text-foreground
Empty subtitle:    text-sm text-muted-foreground mt-1
Group cards:       hover:shadow-md transition-shadow cursor-pointer
Group card pad:    p-4
Group icon bg:     w-12 h-12 bg-primary/10 rounded-full
Group name:        font-semibold text-foreground
Group meta:        text-sm text-muted-foreground
Badge:             variant="default" | "secondary"
Timestamp:         text-xs text-muted-foreground
Loading skeleton:  animate-pulse, w-12 h-12 bg-muted rounded-full, h-4 bg-muted rounded w-3/4
No-groups empty:   p-8 text-center bg-muted rounded-xl
```

#### Inconsistencies
1. **Redundant button classes**: `bg-primary hover:bg-primary/90 text-primary-foreground` is the default Button variant — these are unnecessary overrides
2. **CTA has shadow-lg but cards have shadow-sm** — inconsistent elevation
3. **Stats banner uses `p-6` but group cards use `p-4`** — no clear rule
4. **Peak Throne card uses `p-6` via CardContent default + explicit `p-6`** — double padding reference
5. **Empty state uses `bg-muted`** — should use proposed `bg-surface` for layered depth
6. **Section heading**: `text-lg font-semibold` — correct per proposed scale

#### Recommended Changes
```diff
- <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold rounded-2xl shadow-lg">
+ <Button className="w-full py-4 text-lg font-semibold rounded-2xl shadow-md">

- <div className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6 rounded-2xl mb-6 shadow-lg">
+ <div className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6 rounded-2xl mb-6 shadow-md">

- <Card className="mb-6 shadow-sm">
+ <Card className="mb-6">
  (Card primitive should have shadow-sm by default)

- <div className="bg-muted rounded-xl p-8 text-center">
+ <div className="bg-surface rounded-2xl p-8 text-center">

- className="bg-primary hover:bg-primary/90 text-primary-foreground"
+ (remove — use default Button variant)
```

---

### `client/src/pages/profile.tsx`

#### Current Classes Used
```
Page layout:       pt-6 pb-24
Header:            text-center mb-8
Name:              text-xl font-bold text-foreground
Username:          text-muted-foreground
Title:             text-muted-foreground text-sm
Stats grid:        grid grid-cols-2 gap-4 mb-6
Stat card:         shadow-sm border-l-4 border-l-green-500 (+ blue, amber, purple variants)
Stat value:        text-2xl font-bold text-green-600 (+ blue, amber, purple variants)
Stat label:        text-sm text-muted-foreground
Card content:      p-4 text-center
Section head:      font-semibold text-foreground mb-3
Activity dot:      w-3 h-3 bg-primary rounded-full mr-3
Activity text:     text-sm text-muted-foreground flex-1
Activity count:    text-xs text-muted-foreground
Settings labels:   text-sm text-foreground
Empty state:       bg-muted rounded-xl p-8 text-center
Edit button:       variant="ghost" size="sm" h-6 w-6 p-0
Logout button:     variant="destructive" w-full
```

#### Inconsistencies
1. **8 HARDCODED COLORS**: `border-l-green-500`, `text-green-600`, `border-l-blue-500`, `text-blue-600`, `border-l-amber-500`, `text-amber-500`, `border-l-purple-500`, `text-purple-600` — critical violation of the token system
2. **Section headings use `font-semibold` without `text-lg`** — inconsistent with home page which uses `text-lg font-semibold`
3. **Heading gap is `mb-3`** in profile cards but `mb-4` elsewhere
4. **Empty state uses `bg-muted`** — should be `bg-surface`
5. **Stat card padding `p-4`** matches standard card — correct

#### Recommended Changes
```diff
- <Card className="shadow-sm border-l-4 border-l-green-500">
-   <p className="text-2xl font-bold text-green-600">
+ <Card className="shadow-sm border-l-4 border-l-stat-green">
+   <p className="text-2xl font-bold text-stat-green">

- <Card className="shadow-sm border-l-4 border-l-blue-500">
-   <p className="text-2xl font-bold text-blue-600">
+ <Card className="shadow-sm border-l-4 border-l-stat-blue">
+   <p className="text-2xl font-bold text-stat-blue">

- <Card className="shadow-sm border-l-4 border-l-amber-500">
-   <p className="text-2xl font-bold text-amber-500">
+ <Card className="shadow-sm border-l-4 border-l-stat-amber">
+   <p className="text-2xl font-bold text-stat-amber">

- <Card className="shadow-sm border-l-4 border-l-purple-500">
-   <p className="text-2xl font-bold text-purple-600">
+ <Card className="shadow-sm border-l-4 border-l-stat-purple">
+   <p className="text-2xl font-bold text-stat-purple">

- <h3 className="font-semibold text-foreground mb-3">
+ <h3 className="text-lg font-semibold text-foreground mb-4">

- <div className="bg-muted rounded-xl p-8 text-center">
+ <div className="bg-surface rounded-2xl p-8 text-center">
```

---

### `client/src/pages/groups.tsx`

#### Current Classes Used
```
Page layout:       pt-6 pb-24
Page title:        text-xl font-bold text-foreground
Create button:     bg-primary hover:bg-primary/90 text-primary-foreground
Card:              shadow-sm
Card content:      p-4
Group name:        font-semibold text-foreground
Badge:             variant="default" | "secondary"
Avatar stack:      flex -space-x-2
Avatar overflow:   w-8 h-8 bg-muted rounded-full border-2 border-background
Member count:      text-sm text-muted-foreground ml-3
Entry meta:        text-sm text-muted-foreground
View button:       variant="outline" size="sm"
Loading skeleton:  animate-pulse, h-5 bg-muted rounded w-1/3 etc.
Skeleton avatar:   w-8 h-8 bg-muted rounded-full border-2 border-background
Empty state:       p-8 text-center bg-muted rounded-xl
```

#### Inconsistencies
1. **Create button repeats default variant classes** (`bg-primary hover:bg-primary/90 text-primary-foreground`)
2. **Group cards use `space-y-4`** but home page uses `space-y-3` for same list type
3. **Loading skeleton doesn't match home page skeleton structure** — different sizing
4. **Empty state uses `bg-muted`** — should be `bg-surface`

#### Recommended Changes
```diff
- <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
+ <Button>
  (default variant is already primary)

- <div className="space-y-4">  (group list)
+ <div className="space-y-4">
  (keep space-y-4 — this is the card-list standard; update home.tsx to match)

- <CardContent className="p-8 text-center bg-muted rounded-xl">
+ <CardContent className="p-8 text-center bg-surface rounded-2xl">

- <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
+ <Button>
  (empty state CTA — same fix)
```

---

### `client/src/pages/group-detail.tsx`

#### Current Classes Used
```
Page layout:       pt-6 pb-24
Back button:       variant="ghost" size="sm"
Page title:        text-xl font-bold text-foreground
Leave button:      variant="destructive" size="sm"
Card:              shadow-sm mb-6
Card content:      p-4
Section head:      font-semibold text-foreground mb-4 (members), mb-4 (entries)
Add member btn:    size="sm" bg-primary hover:bg-primary/90 text-primary-foreground
Avatar:            w-10 h-10 (members), w-6 h-6 (entries)
Member name:       font-medium text-foreground
Member meta:       text-sm text-muted-foreground
PR text:           text-xs text-muted-foreground
Entry border:      border-l-4 border-primary pl-4 py-2
Entry author:      text-sm font-medium text-foreground
Entry timestamp:   text-xs text-muted-foreground ml-auto text-right
Entry body:        text-sm text-foreground mb-2
Location:          text-xs text-muted-foreground
Empty entries:     text-center py-8 text-muted-foreground
Loading skeleton:  h-8 bg-muted rounded w-1/2 mb-6
Not-found card:    p-8 text-center
```

#### Inconsistencies
1. **"Add a Dude" button** repeats default variant: `bg-primary hover:bg-primary/90 text-primary-foreground`
2. **Section headings inconsistent**: `font-semibold text-foreground` without `text-lg` — differs from home page
3. **Entry border uses `border-primary`** which is green — correct thematically but should be documented as intentional
4. **Empty entries state** doesn't follow the standard empty state pattern (no emoji, no card wrapper)
5. **Not-found card uses `p-8 text-center`** without `bg-surface` — inconsistent with other empty states

#### Recommended Changes
```diff
- <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
+ <Button size="sm">

- <h3 className="font-semibold text-foreground mb-4">Members
+ <h3 className="text-lg font-semibold text-foreground mb-4">Members

- <h3 className="font-semibold text-foreground mb-4">Recent Entries
+ <h3 className="text-lg font-semibold text-foreground mb-4">Recent Entries

  Empty entries — upgrade to standard empty state pattern:
- <div className="text-center py-8 text-muted-foreground">
-   <p>No entries yet</p>
-   <p className="text-sm">Be the first to share your throne thoughts!</p>
- </div>
+ <div className="bg-surface rounded-2xl p-8 text-center">
+   <p className="text-4xl mb-3">📝</p>
+   <p className="text-lg font-bold text-foreground mb-1">No entries yet</p>
+   <p className="text-sm text-muted-foreground">Be the first to share your throne thoughts!</p>
+ </div>
```

---

### `client/src/pages/landing.tsx`

#### Current Classes Used
```
Page layout:       min-h-screen bg-background flex flex-col items-center justify-center p-4
Container:         max-w-md w-full space-y-8
Logo circle:       w-20 h-20 bg-primary/10 rounded-full
Logo icon:         w-10 h-10 text-primary
Title:             text-3xl font-bold text-foreground mb-2
Subtitle:          text-sm text-muted-foreground italic mb-2
Description:       text-muted-foreground text-center
Feature card:      (default Card + CardContent p-4)
Feature layout:    flex items-center space-x-3
Feature emoji:     text-3xl
Feature title:     font-semibold text-foreground
Feature desc:      text-sm text-muted-foreground
Form:              space-y-3
Error text:        text-sm text-destructive
Submit button:     w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3
```

#### Inconsistencies
1. **Submit button repeats default variant classes**
2. **Feature cards don't have `shadow-sm`** — inconsistent with cards elsewhere (though intentional here for flat look?)
3. **Description uses `text-muted-foreground text-center`** — `text-center` already on parent, redundant
4. **`space-y-8`** between sections is larger than any other page gap — landing is unique, acceptable
5. **Error text correctly uses `text-destructive`** — good, unlike log-deuce-modal

#### Recommended Changes
```diff
- <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3">
+ <Button className="w-full font-medium py-3">

  Feature cards — add subtle shadow for consistency:
- <Card>
+ <Card className="shadow-sm">
```

---

### `client/src/pages/not-found.tsx`

#### Current Classes Used
```
Page layout:       min-h-screen w-full flex items-center justify-center bg-background px-4
Card:              w-full max-w-md
Card content:      pt-6 text-center
Icon:              h-16 w-16 text-muted-foreground mx-auto mb-4
Title:             text-2xl font-bold text-foreground mb-2
Description:       text-muted-foreground mb-6
Button:            w-full (default variant)
```

#### Inconsistencies
1. **Title is `text-2xl font-bold`** — larger than page titles (`text-xl font-bold`) elsewhere
2. **Card doesn't follow empty-state pattern** — missing emoji, missing `bg-surface`
3. **Uses `pt-6` instead of `p-6`** — asymmetric padding

#### Recommended Changes
```diff
- <h1 className="text-2xl font-bold text-foreground mb-2">
+ <h1 className="text-xl font-bold text-foreground mb-2">

- <CardContent className="pt-6 text-center">
+ <CardContent className="p-8 text-center">
  (use empty state standard padding)
```

---

## Custom Components

### `client/src/components/bottom-navigation.tsx`

#### Current Classes
```
Nav wrapper:       fixed bottom-0 left-0 right-0 bg-background border-t border-border
Inner container:   max-w-md mx-auto px-4
Flex layout:       flex items-center justify-around py-2
Nav item:          nav-item flex flex-col items-center py-3 px-3 transition-colors
Active state:      text-primary
Inactive state:    text-muted-foreground
Icon:              w-6 h-6 mb-1
Label:             text-xs
```

#### Inconsistencies
1. **No safe-area-inset** for iOS notch devices — `pb-safe` or `env(safe-area-inset-bottom)` needed
2. **Label doesn't change weight** on active — subtle feedback missed
3. **Uses custom `.nav-item` CSS class** for transition — could use Tailwind `transition-colors duration-base`
4. **`py-2` on wrapper + `py-3` on items** — total bottom padding is ample but not deliberate

#### Recommended Changes
```diff
- <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
+ <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border pb-[env(safe-area-inset-bottom)]">

- <a className={cn("nav-item flex flex-col items-center py-3 px-3 transition-colors", ...)}>
+ <a className={cn("flex flex-col items-center py-3 px-3 transition-colors duration-200", ...)}>

- <span className="text-xs">Home</span>
+ <span className={cn("text-xs", isActive("/") && "font-medium")}>Home</span>
  (add font-medium to active label — repeat for all nav items)
```

---

### `client/src/components/create-group-modal.tsx`

#### Current Classes
```
Dialog:            sm:max-w-md
Form:              space-y-4
Submit button:     w-full bg-primary hover:bg-primary/90 text-primary-foreground
Textarea:          h-24 resize-none
```

#### Inconsistencies
1. **Submit button repeats default variant**
2. **No `rounded-2xl` on submit button** — unlike home CTA

#### Recommended Changes
```diff
- <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
+ <Button className="w-full">
```

---

### `client/src/components/edit-username-modal.tsx`

#### Current Classes
```
Dialog:            sm:max-w-[425px]
Form:              space-y-4
Cancel button:     variant="outline"
Submit button:     (default variant, no overrides — correct!)
```

#### Inconsistencies
1. **Dialog width `sm:max-w-[425px]`** — arbitrary value, should be `sm:max-w-md` (448px) for consistency with all other modals

#### Recommended Changes
```diff
- <DialogContent className="sm:max-w-[425px]">
+ <DialogContent className="sm:max-w-md">
```

---

### `client/src/components/invite-modal.tsx`

#### Current Classes
```
Dialog:            sm:max-w-md
Input bg:          bg-muted (for readonly invite link)
Copy button:       variant="outline" size="sm"
Share button:      w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground
Description:       text-sm text-muted-foreground mb-4
```

#### Inconsistencies
1. **Share button uses explicit secondary classes** — should use `variant="secondary"` instead
2. **Read-only input uses `bg-muted`** — correct, but could use proposed `bg-surface` for visual distinction

#### Recommended Changes
```diff
- <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
+ <Button variant="secondary" className="w-full">
```

---

### `client/src/components/log-deuce-modal.tsx`

#### Current Classes
```
Dialog:            sm:max-w-md
Form:              space-y-4
Grid:              grid grid-cols-2 gap-4
Textarea:          h-32 resize-none
Char counter:      text-right text-xs text-muted-foreground mt-1
Error text:        text-sm text-red-500 ← BUG
Loading text:      text-sm text-muted-foreground
No groups text:    text-sm text-muted-foreground
Group checkboxes:  flex items-center space-x-2
Selected preview:  text-xs text-muted-foreground mb-2
Submit button:     w-full bg-primary hover:bg-primary/90 text-primary-foreground
```

#### Inconsistencies
1. **`text-red-500` on line 297** — should be `text-destructive` (the only place in the app that uses a raw red)
2. **Submit button repeats default variant**
3. **Checkbox labels use `text-sm font-normal cursor-pointer`** — `font-normal` is redundant (default)

#### Recommended Changes
```diff
- <div className="text-sm text-red-500">Error loading groups: {groupsError.message}</div>
+ <div className="text-sm text-destructive">Error loading groups: {groupsError.message}</div>

- <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
+ <Button className="w-full">
```

---

### `client/src/components/notification-banner.tsx`

#### Current Classes
```
Banner:            fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-4 shadow-lg transform transition-transform duration-300
Container:         flex items-center justify-between max-w-md mx-auto
Icon:              w-5 h-5
Text:              text-sm font-medium
Close button:      variant="ghost" size="sm" text-primary-foreground hover:text-primary-foreground/80 h-auto p-1
```

#### Inconsistencies
1. **Inline transition** `transition-transform duration-300` — should use proposed `duration-slow` token
2. **Shadow is `shadow-lg`** — correct for E3 notification
3. **No safe-area-inset** for iOS notch — `pt-[env(safe-area-inset-top)]` needed

#### Recommended Changes
```diff
- className={`fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-4 shadow-lg transform transition-transform duration-300 ${
+ className={`fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-4 pt-[max(1rem,env(safe-area-inset-top))] shadow-lg transform transition-transform duration-300 ${
```

---

### `client/src/components/profile-picture-upload.tsx`

#### Current Classes
```
Container:         relative flex items-center space-x-4
Avatar sizes:      h-8 w-8 (sm), h-12 w-12 (md), h-24 w-24 (lg)
Camera button:     variant="outline" size="sm" absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0
Spinner:           h-3 w-3 animate-spin rounded-full border-2 border-foreground border-t-transparent
Upload button:     variant="outline" flex items-center space-x-2
File input:        hidden
```

#### Inconsistencies
1. **Spinner uses `border-foreground border-t-transparent`** — this is a custom spinner pattern, fine but could use a shared spinner component
2. **Avatar sizes are hardcoded** per-component — `sizeClasses` map is clean, no issue
3. **Camera button position `-bottom-2 -right-2`** — works for all sizes? Might clip on `sm`

#### Recommended Changes
Minimal — this component is well-structured. Only suggestion:
```diff
  Camera button on sm avatars may need adjusted position:
- className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
+ className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
  (only for sm size — consider conditional positioning)
```

---

### `client/src/components/reactions.tsx`

#### Current Classes
```
Container:         flex items-center gap-2 flex-wrap
Reaction button:   variant="default" | "outline" size="sm" h-8 px-2 text-sm
Add button:        variant="ghost" size="sm" h-8 px-2
Popover content:   w-auto p-2
Emoji grid:        grid grid-cols-4 gap-1
Emoji button:      variant="ghost" size="sm" h-8 w-8 p-0 text-base hover:bg-muted
```

#### Inconsistencies
1. **`hover:bg-muted` on emoji buttons** — should be `hover:bg-accent` to match ghost button convention
2. **Reaction count buttons** use `h-8` which is smaller than standard button `h-9` for size="sm" — intentional compact design, acceptable

#### Recommended Changes
```diff
- className="h-8 w-8 p-0 text-base hover:bg-muted"
+ className="h-8 w-8 p-0 text-base hover:bg-accent"
```

---

## UI Primitives (shadcn/ui)

### `client/src/components/ui/card.tsx`

#### Current Base Class
```
rounded-lg border bg-card text-card-foreground shadow-sm
```

#### Recommended Change
```diff
- "rounded-lg border bg-card text-card-foreground shadow-sm"
+ "rounded-2xl border bg-card text-card-foreground shadow-sm"
```
This is the **single highest-impact change** — instantly modernizes every card in the app.

---

### `client/src/components/ui/button.tsx`

Base is correct (shadcn default). No changes needed to the primitive.

---

### `client/src/components/ui/badge.tsx`

Base is correct. No changes needed.

---

### `client/src/components/ui/dialog.tsx`

#### Current Classes
```
Overlay:     fixed inset-0 z-50 bg-black/80
Content:     sm:rounded-lg (bottom of content classes)
```

#### Recommended Change
```diff
- sm:rounded-lg
+ sm:rounded-2xl
```
Match the card radius upgrade for visual consistency.

---

### `client/src/components/ui/input.tsx`

Base is correct. Uses `rounded-md` which is appropriate for form controls.

---

## `client/src/index.css`

### Classes to Remove/Replace

| CSS Class             | Current Purpose              | Replace With                              |
|-----------------------|------------------------------|-------------------------------------------|
| `.nav-item`           | `transition: color 0.2s`     | Tailwind `transition-colors duration-200` |
| `.group-card`         | `transition: all 0.3s`       | Tailwind `transition-shadow duration-300` |
| `.group-card:hover`   | Custom box-shadow            | Tailwind `hover:shadow-md`                |
| `.entry-card`         | `animation: fadeIn 0.5s`     | Keep (complex animation)                  |
| `.fab-bounce`         | `animation: bounce 0.6s`     | Keep (complex animation)                  |
| `.haptic-feedback`    | `transform: scale(0.95)`     | Tailwind `active:scale-95`                |
| `.modal-overlay`      | `animation: fadeIn 0.3s`     | Handled by shadcn Dialog                  |
| `.modal-content`      | `animation: slideUp 0.3s`    | Handled by shadcn Dialog                  |
| `.deuce-counter`      | Hardcoded gradient           | Update to use CSS variables               |
| `.stats-card`         | Hardcoded gradient           | Update to use CSS variables               |
| `.notification-banner`| CSS transition               | Inline Tailwind (already done in component)|

### Classes to Keep
- `.entry-card` animation (fadeIn) — keep but consider moving to Tailwind keyframe
- `.fab-bounce` animation — keep
- `@keyframes fadeIn` and `@keyframes bounce` — keep
- Scrollbar styling — keep but add dark mode variants

### Classes to Add
```css
/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: hsl(0, 0%, 8%);
}
.dark ::-webkit-scrollbar-thumb {
  background: hsl(0, 0%, 25%);
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: hsl(0, 0%, 40%);
}
```

---

## Summary: Change Priority

### P0 — Bugs (fix immediately)
- [ ] `--accent-foreground` dark mode value — verify WCAG contrast
- [ ] `text-red-500` in log-deuce-modal → `text-destructive`
- [ ] Scrollbar dark mode missing

### P1 — Token Violations (fix this sprint)
- [ ] Profile stats: 8 hardcoded colors → `stat-*` tokens
- [ ] CSS gradients: raw HSL → CSS variables
- [ ] CSS group-card hover shadow: raw rgba → Tailwind class

### P2 — Consistency (next sprint)
- [ ] Remove redundant button color overrides (6 occurrences)
- [ ] Standardize section heading classes (`text-lg font-semibold`)
- [ ] Standardize card padding rules
- [ ] Standardize empty state pattern
- [ ] Update Card primitive radius to `rounded-2xl`
- [ ] Update Dialog content radius to `rounded-2xl`
- [ ] Standardize edit-username-modal width to `sm:max-w-md`
- [ ] Add iOS safe area insets to bottom nav and notification banner

### P3 — Polish (future)
- [ ] Extract skeleton loading components
- [ ] Add active font-weight to bottom nav labels
- [ ] Replace CSS transitions with Tailwind utilities
- [ ] Implement full elevation system
- [ ] Add animation tokens to Tailwind config
