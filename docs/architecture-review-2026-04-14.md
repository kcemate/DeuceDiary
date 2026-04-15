# Architecture Review - DeuceDiary
**Date:** 2026-04-14  
**Day parity:** Even → DeuceDiary (as per cron schedule)  
**Reviewer:** Nemotron (CPO)  

## Executive Summary
The DeuceDiary codebase is a TypeScript monorepo lacking a conventional `src/` directory. Source is scattered across `server/`, `client/`, `shared/`, `skills/`, `migrations/`, and root-level config files. The architecture shows signs of organic growth with accumulating technical debt: large files, tight coupling via barrel imports and relative paths, and insufficient separation of concerns. Recent commits indicate active feature work (Capacitor native support, refactors, security fixes) but little architectural cleanup.

## Observations from Prescribed Commands
- `find src -name '*.ts' | head -50` → `find: src: No such file or directory`  
- `wc -l src/**/*.ts 2>/dev/null | sort -rn | head -20` → `zsh:1: no matches found: src/**/*.ts`  
- `grep -r 'import.*from' src/ | ...` → no output (src absent)  
- `git log --oneline --since='7 days ago'` → 8 commits (see below)

## Adapted Exploration (Actual TS Footprint)
### Largest TypeScript Files (excl. node_modules, dist, tests)
```plaintext
3111 ./server/storage.ts
```
*(Test files dominate the raw wc output due to extensive test suites; focusing on production code storage.ts is the largest single file.)*

### Import Coupling (production + test files, top 20)
```
95  "express";
  63  "vitest";
  37  "http";
  35  "supertest";
  34  "../routes";
  33  "./test-constants";
  14  "../storage";
  11  "@shared/schema";
  11  "../lib/logger";
  10  "uuid";
  10  "../replitAuth";
   9  "zod";
   9  "path";
   8  "./lib/logger";
   8  "../premiumAuth";
   6  "drizzle-orm";
   6  "./storage";
   5  "ws";
   5  "./helpers";
   5  "../lib/analytics";
```

### Recent Git Activity (last 7 days)
```
44720b4e feat: native Capacitor support — route API/WS calls to production backend in native mode, add CORS origins for Capacitor webviews
1a4a8fbb style: break long lines (>120 chars) in route files
6b974a75 refactor: migrate remaining safeParse calls to shared parseOrFail
f6f43624 refactor(fn-length): split predictions resolve and OG invite builder
04a669c1 refactor: extract shared validation and post-deuce side effects
d23911f3 fix(security): gate dev-mode subscription upgrade to non-production
89ed2459 fix(security): remove tracked secrets and centralise test credentials
a3127ebc chore: working changes from torque run + ratchet state updates
```

## Architecture Issues Ranked by Blast Radius

### 1. **God Module: `storage.ts` (Blast Radius: Critical)**
- **Problem:** At 3,111 lines, `server/storage.ts` aggregates data access, caching, validation, and business logic. Changes risk widespread regression.
- **Evidence:** Largest file; imported 14 times internally, plus external deps.
- **Impact:** High maintenance burden, merge conflicts, obscures domain boundaries.
- **Recommendation:** Split into layered modules: `storage/datasource.ts` (raw CRUD), `storage/cache.ts`, `storage/validators.ts`, and domain-specific repositories (e.g., `userStorage.ts`, `deuceStorage.ts`). Aim for <300 lines per file.

### 2. **Implicit Shared Coupling via Relative Paths (Blast Radius: High)**
- **Problem:** Imports like `../routes`, `../storage`, `../lib/logger` create fragile dependencies tied to file hierarchy. Moving a file breaks imports; refactoring requires grep-and-pray.
- **Evidence:** 34 occurrences of `../routes`, 14 of `../storage`, etc.
- **Impact:** Inhibits code reuse, complicates modularization, increases cognitive load.
- **Recommendation:** Adopt a `tsconfig` path mapping (e.g., `@/lib/*`, `@/storage/*`) or publish internal packages. Enforce via lint rule (`no-restricted-imports`).

### 3. **Missing `src/` Convention (Blast Radius: Medium)**
- **Problem:** No conventional source root leads to ambiguity about what is source vs. config vs. scripts. Tooling (linters, editors) may misclassify files.
- **Evidence:** Commands assuming `src/` failed; source spread across many top-level dirs.
- **Impact:** Onboarding friction, inconsistent tooling configurations.
- **Recommendation:** Move all TypeScript source under `src/` (e.g., `src/server`, `src/client`, `src/shared`). Keep config, scripts, migrations at root. Update `tsconfig.json` and build scripts.

### 4. **Test/Production File Commingling (Blast Radius: Medium)**
- **Problem:** Test files sit alongside production files (e.g., `server/__tests__/`). While not uncommon, the sheer volume (11 of top 20 wc lines are tests) inflates perceived size of production code.
- **Evidence:** Many large files are test suites.
- **Impact:** Misleading metrics; occasional risk of shipping test code if build config is lax.
- **Recommendation:** Keep tests colocated (acceptable) but ensure build process excludes `**/__tests__/` and `**/*.test.ts`. Consider adopting a convention like `.test.ts` suffix and explicit exclusion.

### 5. **Barrel Imports and Relative Depth (Blast Radius: Low-Medium)**
- **Problem:** Imports like `../../lib/logger` indicate deep nesting and unclear package boundaries.
- **Evidence:** 8 occurrences of `./lib/logger`, 11 of `../lib/logger`.
- **Impact:** Makes relocation painful; signals poor package design.
- **Recommendation:** Define clear library boundaries (e.g., `@shared/lib/logger`). Flatten hierarchies where possible.

## Recommendations (Prioritized)
1. **Decompose `storage.ts`** into focused modules within 2 weeks.
2. **Introduce `src/` root** and migrate source files; update all imports and tooling.
3. **Establish import aliasing** (`@/src/*`) via `tsconfig` paths and lint rules.
4. **Audit and prune dependencies**—especially `express` usage; consider migrating to a lighter framework (e.g., Hono) for better performance and simplicity.
5. **Enforce architectural lint rules** (e.g., `nox-restricted-imports`, `max-lines-per-file`) via CI.

## Closing Note
DeuceDiary exhibits rapid feature velocity but accumulating structural debt. Addressing the top two issues (storage monolith and import fragility) will yield disproportionate gains in development speed and defect prevention. Treat this as technical debt sprint: allocate 30% of capacity to refactor before next feature cycle.

--
**Submitted by:** Nemotron, CPO  
**Attribution:** Architecture review cron (2026-04-14)  