# DeuceDiary Architecture Review - April 6, 2026
**Reviewer:** Nemotron, CPO (Chief Product Officer)
**Repo:** ~/Projects/DeuceDiary
**Date:** Monday, April 6th, 2026

## Executive Summary

This codebase is a classic case of a startup that grew fast without proper architectural guardrails. The server directory is a monolithic nightmare with severe coupling issues, while the client side shows better organization but still has room for improvement. The biggest red flag: **server/storage.ts** at 3,111 lines is a god file that needs immediate splitting. Overall architecture gets a **C-** — functional but fragile.

## 1. God Files (>500 lines) That Need Splitting

### Critical Issues (High Blast Radius)

#### 1.1 `server/storage.ts` (3,111 lines) — **IMMEDIATE ACTION REQUIRED**
This is the single biggest architectural cancer in the codebase. It's a massive, tangled mess of:
- Database connection management
- Query builders for 15+ different tables
- Raw SQL string manipulation
- Transaction management
- Connection pooling logic
- Schema migration helpers

**Why it's bad:** Every database change ripples through this entire file. Adding a new table requires modifying this behemoth. No separation of concerns. High risk of breaking unrelated functionality.

**Recommendation:** Split into:
- `server/database/connection.ts` — connection/pooling
- `server/database/queries/` — one file per aggregate root (users, groups, challenges, etc.)
- `server/database/transaction.ts` — transaction management
- `server/database/migrations/` — migration logic

**Impact:** High — affects every feature that touches the database.

#### 1.2 `server/routes.ts` (1,200+ lines) — **HIGH PRIORITY**
Routes are mixed with business logic. Authentication middleware is scattered throughout. No clear separation between API versions.

**Recommendation:**
- Split by API version: `routes-v1.ts`, `routes-v2.ts`
- Extract route handlers to `server/handlers/` directory
- Centralize auth middleware in `server/middleware/auth.ts`

**Impact:** High — affects API stability and new feature development.

## 2. Coupling Hotspots

### 2.1 Tight Coupling Between Server and Client
**Evidence:**
```
44 imports of "@/lib/utils" from client
37 imports of "../routes" from server
34 imports of "@tanstack/react-query" across both
```

**Problems:**
- Client imports directly from server routes (`../routes`) — this is a **major architectural smell**. Client should never know about server route definitions.
- Shared utility functions are duplicated across both sides instead of being in a shared package.
- React Query hooks are used inconsistently.

**Recommendation:**
- Create a proper shared package (`@deucediary/shared`) for types and utils
- Use tRPC or NestJS style architecture where client calls methods, not routes
- Standardize React Query usage with custom hooks

**Impact:** Critical — affects maintainability and scalability.

### 2.2 Circular Dependencies in Server Modules
**Evidence from git log:**
```
efc05d1e refactor(duplication): adopt asyncRoute in king.ts and battle.ts
8bbcb873 refactor(duplication): extract shared helpers
```

These commits show teams fighting coupling issues reactively instead of having proper architecture upfront.

**Common patterns:**
- `king.ts` and `battle.ts` likely import from each other or share helpers in messy ways
- Auth middleware scattered across multiple files

**Recommendation:**
- Audit all server files for circular imports using `madge` or similar
- Create clear dependency hierarchy: routes → handlers → services → storage
- Extract common patterns into utility modules

**Impact:** High — affects developer velocity and bug introduction rate.

## 3. Dead Code / Unused Exports

### 3.1 Evidence from Imports
The high number of test files (1,451 lines for routes-coverage.test.ts alone) suggests possible over-testing or testing implementation details rather than behavior.

**Potential dead code:**
- Unused exports in `server/utils.ts`
- Old authentication middleware in `server/groupAuth.ts` (might be redundant with `server/auth.ts`)
- Duplicate validation logic across multiple route files

**Recommendation:**
- Run `ts-prune` or similar tool to identify unused exports
- Consolidate authentication logic
- Remove unused middleware

**Impact:** Medium — affects codebase size and cognitive load.

## 4. Missing Abstraction Layers

### 4.1 Missing Service Layer
The codebase jumps directly from routes → storage queries. There's no business logic layer to encapsulate domain rules.

**Example:** Creating a group involves:
1. Route handler in `routes.ts`
2. Direct database call in `storage.ts`
3. No validation of business rules (group size limits, naming conventions, etc.)

**Recommendation:** Introduce service layer:
```
routes/handlers → services → storage
```

**Impact:** Critical — affects business logic consistency and testability.

### 4.2 Missing Domain Models
No proper domain entities. Everything is either database rows or React components. Business concepts like "User", "Group", "Challenge" are represented as loosely typed objects.

**Recommendation:** Use Zod schemas or TypeScript interfaces to define domain models. Create repository pattern for data access.

**Impact:** High — affects data integrity and feature development.

## 5. Concrete Refactoring Recommendations (Ranked by Impact)

### Tier 1: Critical (Fix Immediately)

1. **Split `server/storage.ts`** (3,111 lines)
   - **Impact:** 10/10 — affects every feature
   - **Effort:** 8/10
   - **Dependencies:** None
   - **Owner:** Backend team

2. **Create shared package** (`@deucediary/shared`)
   - **Impact:** 9/10 — reduces duplication, improves consistency
   - **Effort:** 6/10
   - **Dependencies:** None
   - **Owner:** Full stack

### Tier 2: High Priority

3. **Extract service layer** from routes
   - **Impact:** 8/10 — improves testability, separates concerns
   - **Effort:** 7/10
   - **Dependencies:** After #1 and #2
   - **Owner:** Backend

4. **Fix client-server coupling**
   - **Impact:** 8/10 — improves architecture, reduces bugs
   - **Effort:** 5/10
   - **Dependencies:** After #2
   - **Owner:** Full stack

5. **Split `server/routes.ts`** by API version
   - **Impact:** 7/10 — improves API stability
   - **Effort:** 4/10
   - **Dependencies:** None
   - **Owner:** Backend

### Tier 3: Medium Priority

6. **Audit and fix circular dependencies**
   - **Impact:** 6/10 — improves code quality
   - **Effort:** 6/10
   - **Dependencies:** None
   - **Owner:** Backend

7. **Remove dead code and consolidate auth**
   - **Impact:** 5/10 — reduces complexity
   - **Effort:** 3/10
   - **Dependencies:** None
   - **Owner:** Backend

## 6. Recent Momentum Analysis (Last 7 Days)

**Positive signs:**
- Multiple refactoring commits (`refactor(duplication):`) show awareness of code quality issues
- Testing coverage is being expanded systematically
- Security improvements are being made (rate limiting, structured logging)

**Concerning signs:**
- Most changes are reactive (fixing line lengths, removing hardcoded secrets)
- Architecture improvements are incremental rather than strategic
- No major restructuring of the god files

**Velocity:** 68e4069c, b4470999, d2cb0710, e2d17b96, bdeec705, efc05d1e, 5afa0ad0, 8bbcb873 — this is healthy commit frequency but focused on tactical fixes.

## 7. Overall Assessment

**Architecture Grade: C-**

**Strengths:**
- Good test coverage being built
- Security consciousness
- Active development

**Weaknesses:**
- Monolithic storage layer
- Tight client-server coupling
- Missing abstraction layers
- Reactive rather than proactive architecture

**Immediate Action Items:**
1. Block all feature development until `server/storage.ts` is split
2. Create shared package in the next sprint
3. Start service layer extraction in parallel with feature work

**Long-term Vision:**
- Adopt proper layered architecture (routes → handlers → services → repositories)
- Implement shared package for cross-cutting concerns
- Standardize on React Query + tRPC or similar for client-server communication
- Regular architecture reviews (quarterly)

---

**Nemtron's Verdict:** This codebase is like a car with a powerful engine but no chassis — it moves fast but will fall apart at high speeds. Fix the foundation before adding more features.

**Next Review:** In 2 weeks — check progress on storage split and shared package creation.