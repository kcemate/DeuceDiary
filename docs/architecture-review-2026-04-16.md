# Architecture Review - DeuceDiary
**Date:** 2026-04-16  
**Day parity:** Even → DeuceDiary (as per cron schedule)  
**Reviewer:** Nemotron (CPO)  

## Executive Summary
DeuceDiary is a full-stack TypeScript application (iOS, web, PWA) with a Node.js/Express backend and a React/Capacitor frontend. The codebase lacks a conventional `src/` directory, with source scattered across `server/`, `client/`, `shared/`, `skills/`, `migrations/`, and scripts. Recent commits show heavy focus on iOS PWA features (push notifications, auth fallbacks, icon updates) and landing page tweaks, indicating active feature work but minimal architectural refactoring. The backend shows signs of accumulating coupling via barrel imports (`../storage`, `../lib/logger`) and a growing god module in `storage.ts`.

## Observations from Prescribed Commands
- `find src -name '*.ts' | head -50` → `find: src: No such file or directory`  
- `wc -l src/**/*.ts 2>/dev/null | sort -rn | head -20` → `zsh:1: no matches found: src/**/*.ts`  
- `grep -r 'import.*from' src/ | awk -F'from' '{print $2}' | sort | uniq -c | sort -rn | head -20` → `grep: src/: No such file or directory`  
- `git log --oneline --since='7 days ago'` → 32 commits (see excerpt below)

### Git Log Excerpt (last 7 days)
```
57a24365 fix: accept Clerk __session cookie as auth fallback for iOS PWA + retry getToken 3x
33a51bf6 fix: send Clerk JWT in push subscription requests for iOS PWA auth
5116aac7 fix: test-push admin auth — use safeKeyCompare directly instead of requireAdminKey which sends 401 early
8d61c9a1 fix: stop unregistering push service worker on app load
98d02388 feat: add push-subs debug endpoint for admin
2a256dbc fix: test-push endpoint accepts admin key with userId param
bd647ebc feat: add admin test-push endpoint for verifying push notifications
badd31b8 fix: hide push toggle on unsupported browsers, show 'Add to Home Screen' hint for iOS Safari
ecf255c8 fix: use Clerk signOut for logout instead of hitting missing /api/logout dev route
93e05856 fix: regenerate app icons - all cream paper, bold gold filigree, no blue on roll
ca8483a9 fix: update app icons with white toilet paper roll on navy background (resolves icon color issue)
2d1bc855 feat: add web push notifications for PWA
f358bc79 feat(landing): add mid-page CTA between features and how-it-works
7777e5b0 feat(landing): replace broken App Store placeholder with clean iOS teaser
db9131d4 feat(landing): fix misleading sign-up copy — use Clerk OAuth framing
71865e72 fix: zoom scroll & quill to fill icon - no white space
56744640 fix: fill icon corners with navy - no white gaps on iOS home screen
7d2b4ff2 fix: regenerate all icons with navy background (#0F1B2D)
31e4b9b4 feat: new app icon - scroll & quill on navy, full icon set, updated theme colors
a076209b fix(pwa): move SW cleanup into JS bundle (CSP-safe), add unsafe-inline for Clerk
ce41dc50 fix(cors): add deucediary.com to allowed origins, don't throw on CORS rejection
93ca549c fix(pwa): remove caching SW that was serving stale HTML on deploys, add self-unregister cleanup
7bed8f42 feat(pwa): add manifest, service worker, and app icons for PWA install
44720b4e feat: native Capacitor support — route API/WS calls to production backend in native mode, add CORS origins for Capacitor webviews
1a4a8fbb style: break long lines (>120 chars) in route files
6b974a75 refactor: migrate remaining safeParse calls to shared parseOrFail
f6f43624 refactor(fn-length): split predictions resolve and OG invite builder
04a669c1 refactor: extract shared validation and post-deuce side effects
d23911f3 fix(security): gate dev-mode subscription upgrade to non-production
89ed2459 fix(security): remove tracked secrets and centralise test credentials
a3127ebc chore: working changes from torque run + ratchet state updates
```

## Adapted Exploration (Actual TS Footprint)
### Largest TypeScript Files (excl. node_modules, dist, tests)
```plaintext
3111 ./server/storage.ts
 693 ./shared/schema.ts
 587 ./server/routes/groups.ts
 564 ./server/routes/battle.ts
 544 ./server/routes/deuces.ts
```

### Import Coupling (production TS files, top 20)
```
26  "express";
  14  "vitest";
  13  "../storage";
  11  "@shared/schema";
  11  "../replitAuth";
  10  "../lib/logger";
   9  "zod";
   9  "./lib/logger";
   8  "path";
   8  "drizzle-orm";
   7  "uuid";
   7  "../premiumAuth";
   6  "./storage";
   6  "../db";
   5  "./helpers";
   4  "fs";
   4  "@tanstack/react-query";
   4  "./logger";
   4  "../lib/analytics";
   4  "../groupAuth";
```

## Architecture Issues Ranked by Blast Radius

### 1. **God Module: `storage.ts` (Blast Radius: Critical)**
- **Problem:** At 3,111 lines, `server/storage.ts` aggregates data access, caching, validation, and business logic. Changes risk widespread regression.
- **Evidence:** Largest file; imported 13 times internally (`../storage`), plus external deps.
- **Impact:** High maintenance burden, merge conflicts, obscures domain boundaries.
- **Recommendation:** Split into layered modules: `storage/datasource.ts` (raw CRUD), `storage/cache.ts`, `storage/validators.ts`, and domain-specific repositories (e.g., `userStorage.ts`, `deuceStorage.ts`). Aim for <300 lines per file.

### 2. **Missing `src/` Convention (Blast Radius: High)**
- **Problem:** No conventional source root leads to ambiguity about what is source vs. config vs. scripts. Tooling (linters, editors) may misclassify files. Commands assuming `src/` fail.
- **Evidence:** All three prescribed commands failed due to missing `src/`.
- **Impact:** Onboarding friction, inconsistent tooling configurations, complicates onboarding new engineers.
- **Recommendation:** Move all TypeScript source under `src/` (e.g., `src/server`, `src/client`, `src/shared`). Keep config, scripts, migrations at root. Update `tsconfig.json` and build scripts.

### 3. **Implicit Shared Coupling via Relative Paths (Blast Radius: Medium-High)**
- **Problem:** Imports like `../storage`, `../lib/logger`, `../replitAuth` create fragile dependencies tied to file hierarchy. Moving a file breaks imports; refactoring requires grep-and-pray.
- **Evidence:** 13 occurrences of `../storage`, 10 of `../lib/logger`, 11 of `../replitAuth`.
- **Impact:** Inhibits code reuse, complicates modularization, increases cognitive load.
- **Recommendation:** Adopt a `tsconfig` path mapping (e.g., `@/lib/*`, `@/storage/*`, `@/shared/*`). Enforce via lint rule (`no-restricted-imports`).

### 4. **Barrel Imports and Deep Nesting (Blast Radius: Medium)**
- **Problem:** Imports like `./lib/logger` indicate deep nesting and unclear package boundaries.
- **Evidence:** 9 occurrences of `./lib/logger`.
- **Impact:** Makes relocation painful; signals poor package design.
- **Recommendation:** Define clear library boundaries (e.g., `@shared/lib/logger`). Flatten hierarchies where possible.

### 5. **Test/Production File Commingling (Blast Radius: Low-Medium)**
- **Problem:** Test files sit alongside production files (e.g., `server/__tests__/`). While not uncommon, the presence of `vitest` as the 2nd top import suggests significant test suite size.
- **Evidence:** 14 occurrences of `vitest` in coupling list.
- **Impact:** Slow test suites; occasional risk of shipping test code if build config is lax.
- **Recommendation:** Keep tests colocated but ensure build process excludes `**/__tests__/` and `**/*.test.ts`. Consider adopting a convention like `.test.ts` suffix and explicit exclusion.

## Recommendations (Prioritized)
1. **Decompose `storage.ts`** into focused modules within 2 weeks.
2. **Introduce `src/` root** and migrate source files; update all imports and tooling.
3. **Establish import aliasing** (`@/src/*`) via `tsconfig` paths and lint rules.
4. **Audit and prune dependencies**—especially `express` usage; consider migrating to a lighter framework (e.g., Hono) for better performance and simplicity.
5. **Enforce architectural lint rules** (e.g., `nox-restricted-imports`, `max-lines-per-file`) via CI.

## Closing Note
DeuceDiary exhibits rapid feature velocity (especially PWA/iOS) but accumulating structural debt. Addressing the top two issues (storage monolith and missing src/ convention) will yield disproportionate gains in development speed and defect prevention. Treat this as technical debt sprint: allocate 30% of capacity to refactor before next feature cycle.
--
**Submitted by:** Nemotron, CPO  
**Attribution:** Architecture review cron (2026-04-16)  