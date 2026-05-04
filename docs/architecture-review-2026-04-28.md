# Architecture Review - DeuceDiary
Date: 2026-04-28

## 1. File List (first 20 TypeScript files)
client/src/App.test.ts
client/src/components/create-group-modal.test.ts
client/src/components/Badge.test.ts
client/src/components/back-header.test.ts
client/src/components/battle-challenge-modal.test.ts
client/src/components/WeeklyThroneReport.test.ts
client/src/components/bottom-navigation.test.ts
client/src/components/ShareCardModal.test.ts
client/src/components/Onboarding.test.ts
client/src/components/bingo-nudge.test.ts
client/src/components/error-boundary.test.ts
client/src/components/edit-username-modal.test.ts
client/src/components/bingo-strip.test.ts
client/src/components/battle-grid.test.ts
client/src/hooks/useMutationWithToast.ts
client/src/hooks/usePushNotifications.ts
client/src/hooks/use-share.ts
client/src/hooks/use-toast.ts
client/src/hooks/useAuth.ts
client/src/hooks/useOfflineSync.ts

## 2. Largest Files by Line Count (top 20)
41207 total
    3111 server/storage.ts
    1452 server/__tests__/routes-coverage.test.ts
    1413 server/__tests__/edge-cases.test.ts
    1277 server/__tests__/api.test.ts
    1230 server/__tests__/api-v2.test.ts
    1208 server/__tests__/battle.test.ts
    1061 server/__tests__/tier-rules.test.ts
    1056 server/__tests__/king.test.ts
     971 server/__tests__/auth-security.test.ts
     929 server/__tests__/new-features.test.ts
     917 server/__tests__/referral.test.ts
     901 server/__tests__/premium-flow.test.ts
     879 server/__tests__/streak-concurrent.test.ts
     801 server/__tests__/passport.test.ts
     774 server/__tests__/bingo-coverage.test.ts
     740 server/__tests__/api-premium.test.ts
     737 server/__tests__/push.test.ts
     693 shared/schema.ts
     687 server/__tests__/share-card.test.ts

## 3. Import Coupling Analysis (top 20)
95  "express";
  63  "vitest";
  44  "react"
  44  "@/lib/utils"
  37  "http";
  35  "supertest";
  34  "../routes";
  33  "@tanstack/react-query";
  33  "@/components/ui/button";
  33  "./test-constants";
  32  "react";
  29  "wouter";
  21  "@/lib/queryClient";
  21  "@/hooks/useAuth";
  20  "@/hooks/use-toast";
  19  "lucide-react"
  14  "@/hooks/useMutationWithToast";
  14  "../storage";
  13  "@shared/schema";
  13  "@/lib/logger";

## 4. Recent Activity (last 7 days)
(no output)

## 5. Findings & Recommendations

### Findings
- **Largest file**: `server/storage.ts` is exceptionally large at 3111 lines, indicating a potential god object or lack of separation of concerns.
- **Test file size**: Many test files appear in the top 20 largest files (e.g., routes-coverage.test.ts at 1452 lines), suggesting test files are large and may be testing too much per file or lacking proper mocking/isolation.
- **Import coupling**: Heavy reliance on "express" (95 occurrences), indicating tight coupling to the Express framework. Also high usage of "@/lib/utils" (44) and "react" (44, duplicate due to case?). There are also many relative imports like "../routes" and "../storage".
- **Recent activity**: No commits in the past 7 days (based on git log output). Development appears stalled.

### Recommendations (ordered by blast radius)
1. **Refactor storage.ts**: Break down server/storage.ts into smaller, focused modules (e.g., separate concerns like user storage, battle storage, item storage). Aim for <500 lines per file.
2. **Decouple from Express**: Consider abstracting Express-specific code behind interfaces or using a cleaner architecture (e.g., separating routing from business logic) to reduce direct express imports throughout the codebase.
3. **Reduce utility bloat**: Examine "@/lib/utils" to see if it's a catch-all module; split into more specific utility modules (e.g., authUtils, formatUtils, etc.) to improve maintainability.
4. **Modularize test files**: Split large test files into multiple files per unit or feature (e.g., separate tests for each route or controller). This improves test readability and maintainability.
5. **Increase development cadence**: With zero commits in the last week, identify blockers and set small, achievable goals to restart momentum. Consider daily commits for minor improvements or bug fixes.

-- 
Review completed by Nemotron (CPO).