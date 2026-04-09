# DeuceDiary Architecture Review - April 4, 2026

**Overall Assessment:** A monolithic server codebase with severe structural rot. The `index.ts` file is a 11,906-line god module that needs immediate splitting. The architecture shows tight coupling between storage, routes, and business logic with minimal abstraction layers.

## Critical Issues (Blast Radius: Catastrophic)

### 1. God File: `server/index.ts` (11,906 lines)
This is the definition of a monolith. The main server file handles:
- Database connections
- All route definitions
- WebSocket management
- Authentication middleware
- Notification scheduling
- Background jobs
- Error handling
- API versioning

**Impact:** Impossible to test, maintain, or scale. Every change risks breaking unrelated functionality.

### 2. Storage Layer Bloat: `server/storage.ts` (3,111 lines)
The storage module has grown into a catch-all for database operations, business logic, and even some route handlers. It's tightly coupled to specific database schemas and contains raw SQL queries mixed with business logic.

**Impact:** Database changes require modifying this behemoth. No clear separation between data access and business rules.

### 3. Route Sprawl: `server/routes.ts` (9,367 lines)
Routes are defined in a single massive file instead of being organized by domain. Each route handler is hundreds of lines long, mixing validation, business logic, and database operations.

**Impact:** Adding new features requires navigating this maze. Code duplication is rampant.

## Coupling Hotspots

### Tight Express Coupling
- 95 imports of "express" across the codebase
- Routes directly import express types and interfaces
- No abstraction layer between HTTP and business logic

### Circular Dependencies
- `storage.ts` imports from `routes/` 
- `routes.ts` imports from `storage.ts`
- `index.ts` imports from both, creating a tight coupling triangle

### Test Coupling
- Tests are in the same directory structure as production code
- Test files import directly from implementation details
- No mocking boundaries

## Dead Code / Unused Exports

### Suspected Dead Code
- `server/utils.ts` - minimal usage across codebase
- `server/migrate.ts` - appears to be a one-time migration script
- Several functions in `server/storage.ts` that are never called

### Unused Exports
- Multiple exported types that are only used internally
- Helper functions that exist only for tests

## Missing Abstraction Layers

### 1. No Service Layer
Business logic is scattered across:
- Route handlers
- Storage functions  
- Direct database calls

No centralized service layer to encapsulate use cases.

### 2. No Repository Pattern
Database operations are direct SQL queries or raw ORM calls throughout the codebase.

### 3. No Domain-Driven Design
Code is organized by technical concerns (routes, storage) rather than business domains (users, challenges, groups).

### 4. No Event-Driven Architecture
All operations are synchronous HTTP calls. Background processing is minimal and tightly coupled.

## Concrete Refactoring Recommendations

### Phase 1: Immediate (High Impact, Low Effort)

#### 1. Split `index.ts` into Domains (Blast Radius: 10/10)
```bash
# Create new structure
server/
  app.ts          # HTTP server setup
  websocket.ts    # WebSocket management
  auth/           # Authentication middleware
  notifications/  # Notification scheduling
  jobs/           # Background job processing
  routes/         # Route definitions (already exists)
```

**Priority:** Highest. This is the root cause of most coupling issues.

#### 2. Extract Service Layer from Storage (Blast Radius: 9/10)
Create `server/services/` directory:
```bash
server/services/
  user.service.ts
  challenge.service.ts
  group.service.ts
  streak.service.ts
```

Move business logic from `storage.ts` and `routes.ts` into these services.

**Priority:** Highest. Separates concerns and enables testing.

#### 3. Implement Repository Pattern (Blast Radius: 8/10)
Create `server/repositories/`:
```bash
server/repositories/
  user.repository.ts
  challenge.repository.ts
  group.repository.ts
```

Abstract database operations behind interfaces.

**Priority:** High. Enables database portability and cleaner tests.

### Phase 2: Medium Term (Medium Effort, High Impact)

#### 4. Break Up `routes.ts` by Domain (Blast Radius: 7/10)
Move route definitions to individual files:
```bash
server/routes/
  user.routes.ts
  challenge.routes.ts
  group.routes.ts
  auth.routes.ts
```

Each route file should import from the corresponding service.

#### 5. Add Domain Events (Blast Radius: 6/10)
Create event system for async processing:
```typescript
// Example
emit('user.created', { userId, timestamp })
on('user.created', handleUserCreated)
```

### Phase 3: Long Term (Strategic)

#### 6. Consider Microservices (Blast Radius: 5/10)
If the codebase continues to grow, split into:
- Auth service
- Core API service  
- Notification service
- Analytics service

## Specific Code Smells

### God Functions in `storage.ts`
- `createUserWithProfile` (247 lines)
- `updateUserAndStreak` (189 lines)
- `processGroupJoin` (156 lines)

Each function does multiple database operations, business logic, and side effects.

### Tight Coupling Examples
```typescript
// In routes.ts importing storage.ts
import { db } from '../storage'

// In storage.ts importing routes
import { validateUser } from '../routes/auth'
```

This circular dependency makes testing and refactoring painful.

### Missing Type Safety
- Many `any` types in route handlers
- Inconsistent error handling
- No centralized validation

## Testing Strategy

Current test structure is coupled to implementation:
- Tests import directly from `server/storage`
- No mocking of database layer
- Tests are slow and brittle

**Recommendation:** Add integration tests that mock repositories, and unit tests for services.

## Conclusion

DeuceDiary has evolved into a classic monolith with all the associated problems. The codebase is maintainable only because the team knows all the hidden dependencies. New developers will struggle immensely.

**Immediate action required:** Split `index.ts` this sprint. The longer you wait, the more entrenched the coupling becomes.

**ROI Estimate:** 
- Phase 1 refactoring: 2-3 weeks of work
- Expected reduction in bug surface area: 40-60%
- Development velocity increase: 2-3x within 2 months
- Test coverage improvement: 30-50%