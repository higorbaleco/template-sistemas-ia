# Task 5: Auth Middleware & Core API Setup

**Files:**
- Create: `src/middleware/auth.ts`
- Create: `src/api/index.ts`
- Update: `src/index.ts` (replace empty with real server code)
- Create: `tests/middleware/auth.test.ts`

**Interfaces:**
- Consumes: `getPrisma()`, JWT secret from env
- Produces:
  - `authMiddleware(req, res, next)` — validates Bearer API key, sets `req.organizationId`
  - Express app with CORS, error handling, health check

## Key Requirements

- `authMiddleware` must validate `Authorization: Bearer {api_key}` header
- Must set `req.organizationId` from database lookup
- All routes except `/health` must use auth
- Strict mode TypeScript on all code

## TDD Steps

1. Write failing test: `tests/middleware/auth.test.ts` (exact code from plan Task 5, Step 1)
2. Run test to verify FAIL
3. Implement `src/middleware/auth.ts` (exact from plan Step 3)
4. Implement `src/api/index.ts` (exact from plan Step 4)
5. Implement `src/index.ts` (replace empty; exact from plan Step 5)
6. Run tests; verify PASS
7. Commit

**See plan Task 5 Steps 1-7 for exact code.**

## Global Constraints (bind this task)
- All API routes require `Authorization: Bearer {api_key}` header
- Multi-tenant isolation: `organizationId` set in auth middleware
- TypeScript strict mode
