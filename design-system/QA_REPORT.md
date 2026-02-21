# QA Report — Design System Bug Audit

**Date:** 2026-02-20
**Engineer:** Casey (QA)
**Files touched:** `client/src/index.css`, `client/src/pages/profile.tsx`

---

## Issues Fixed

### 1. Dark Mode Accent Foreground (P0 — Accessibility)
- **File:** `index.css` line 50 (`.dark` block)
- **Was:** `--accent-foreground: hsl(0, 0%, 4%)` (near-black text on dark accent surfaces — unreadable)
- **Now:** `--accent-foreground: hsl(38, 40%, 96%)` (cream/light — readable on dark backgrounds)

### 2. Hardcoded Colors in Profile (P1 — Token Compliance)
- **File:** `profile.tsx` lines 66, 80, 85
- **Was:** Raw Tailwind classes `text-blue-500`, `text-amber-500`, `bg-amber-500/20 text-amber-400`
- **Now:** Token-based classes:
  - Squads count: `text-secondary` (espresso brown token)
  - Peak Day count: `text-accent` (gold token)
  - Badge: `bg-accent/20 text-accent` (gold token)

### 3. Chart Color Tokens (P2 — Missing Definitions)
- **File:** `index.css` `:root` and `.dark` blocks
- **Was:** `--chart-1` through `--chart-5` referenced in `tailwind.config.ts` but never defined
- **Now:** Defined in both themes:
  - `:root` — green(142), brown(25), gold(45), blue(200), red(0) at standard lightness
  - `.dark` — same hues with +5-8% lightness boost for dark background legibility

### 4. Scrollbar Dark Mode (P2 — Visual Polish)
- **File:** `index.css` (end of file)
- **Was:** Single scrollbar thumb color `hsl(0, 0%, 25%)` with no dark variant (invisible on dark backgrounds)
- **Now:** Added `.dark ::-webkit-scrollbar-thumb` at `hsl(0, 0%, 55%)` and hover at `hsl(0, 0%, 70%)`

---

## Verification
- App confirmed running (HTTP 200) after each individual fix
- No CSS syntax errors introduced
- Both files re-read and validated after all changes
