# DeuceDiary Architecture Review - 2026-05-02

## Overview
DeuceDiary is a full-stack TypeScript application with a React/Vite frontend (`client/`) and a Node.js/Express backend (`server/`). The project uses Vitest for testing, Drizzle ORM for database interactions, and appears to be a social/battle-oriented app (based on commit messages). The source code does not follow a conventional `src/` directory at the root; instead, source lives directly under `client/` and `server/` directories.

## File Size Analysis (Top 20 Largest TypeScript Files)
```
1613 total
     218 ./client/src/hooks/useWebSocket.ts
     208 ./client/src/lib/queryClient.ts
     191 ./client/src/hooks/use-toast.ts
     155 ./client/src/hooks/usePushNotifications.ts
     122 ./client/src/lib/offlineQueue.ts
     107 ./client/src/hooks/useAuth.ts
      96 ./client/src/hooks/useOfflineSync.ts
      65 ./client/src/lib/authUtils.ts
      64 ./client/src/hooks/useMutationWithToast.ts
      52 ./client/src/lib/userUtils.ts
      37 ./client/src/lib/gamification.ts
      26 ./client/src/lib/logger.ts
      25 ./client/src/hooks/use-share.ts
      22 ./client/src/hooks/useNetworkStatus.ts
      21 ./client/src/lib/api-base.ts
      20 ./client/src/components/WeeklyThroneReport.test.ts
      19 ./client/src/components/Onboarding.test.ts
      15 ./client/src/components/ShareCardModal.test.ts
      14 ./client/src/lib/logger.ts
```
*Observations:*
- Largest files are under 220 lines, indicating reasonably sized modules.
- Hooks and lib directories contain significant business logic.
- Test files appear within `client/src/` (e.g., `*.test.ts`), contributing to the size list.

## Import Coupling (Top 20 Most Imported Modules)
```
95  "express";
  63  "vitest";
  37  "http";
  35  "supertest";
  34  "../routes";
  33  "./test-constants";
  14  "../storage";
  11  "@shared/schema";
  11  "../replitAuth";
  11  "../lib/logger";
  10  "zod";
  10  "uuid";
   9  "path";
   9  "./lib/logger";
   8  "drizzle-orm";
   8  "../premiumAuth";
   6  "./storage";
   6  "../db";
   5  "ws";
   5  "./helpers";
```
*Observations:*
- Heavy coupling to Express (95 imports) indicates backend is tightly coupled to the Express framework.
- High counts for `vitest`, `supertest`, `http` reflect test files importing testing utilities.
- Frequent relative imports like `../routes`, `../storage`, `../lib/logger` show tight coupling between backend modules.
- Imports of `@shared/schema` suggest some code sharing between client and server (likely TypeScript interfaces).

## Recent Git Activity (Last 7 Days)
No commits in the last 7 days. Most recent commit: `67ad4875` (2026-04-17) - "fix: enlarge battle grids — Standard 10x7, Quick 7x7 (was 7x3 and 3x3)".

## Issues & Recommendations (Ranked by Blast Radius)

### 1. Project Staleness (Blast Radius: Entire Project)
- **Issue:** No commits in over two weeks. Last commit dated 2026-04-17. Development appears stalled.
- **Impact:** High risk of technical debt accumulation, missed opportunities, and potential abandonment.
- **Recommendation:** Immediately verify project status with stakeholders. If active, schedule a short sprint to clear backlog and establish a regular commit cadence. Consider adding a automated heartbeat reminder.

### 2. Test Files Mingled with Source (Blast Radius: Medium-High)
- **Issue:** Test files (`*.test.ts`) reside under `client/src/` alongside production code. This can cause confusion and increase the blast radius of changes (e.g., refactoring might inadvertently affect test files).
- **Impact:** Medium - complicates navigation and may lead to accidental inclusion of test code in production builds.
- **Recommendation:** Move all test files to a dedicated `__tests__` or `test` directory mirroring the source structure, or adopt a convention like placing tests next to the file they test but with clear naming (e.g., `Component.test.tsx` is acceptable if the project standardizes it). Ensure build configurations exclude test files from production bundles.

### 3. Lack of Conventional `src` Directory (Blast Radius: Medium)
- **Issue:** The project does not use a top-level `src/` directory; source is split between `client/` and `server/` at the root. This deviates from common TypeScript/React/Node.js conventions and may confuse new contributors.
- **Impact:** Medium - increases cognitive overhead and may lead to inconsistent file organization.
- **Recommendation:** Consider restructuring to place all TypeScript source under a `src/` directory with subdirectories for `client/` and `server/` (or adopt a monorepo layout with `packages/`). If the current structure is intentional, document it clearly in `CONTRIBUTING.md`.

### 4. High Coupling to Express (Blast Radius: Medium)
- **Issue:** Backend modules import `express` frequently (95 times), indicating tight coupling to the Express framework.
- **Impact:** Medium - makes it harder to swap frameworks or test backend logic in isolation.
- **Recommendation:** Abstract HTTP handling behind a thin interface (e.g., define route handlers as functions that accept request/response objects, or use a lightweight routing layer). This will improve testability and flexibility.

### 5. Fragmented Utilities and Hooks (Blast Radius: Low-Medium)
- **Observation:** Many small utility files (`lib/*.ts`) and hook files (`hooks/*.ts`). While not inherently bad, excessive fragmentation can lead to duplicated effort and unclear ownership.
- **Impact:** Low-Medium - may increase time to locate appropriate utility.
- **Recommendation:** Conduct a utilities audit: consolidate related functions into fewer, logically grouped modules (e.g., `authUtils.ts`, `apiUtils.ts`). Ensure each file has a clear, single responsibility.

---
*Review conducted by Nemotron (CPO) as part of daily architecture review cycle. Alternating between Ratchet and DeuceDiary repositories based on day-of-month parity.*