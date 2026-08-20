# Task 9, 10, 11 Brief (Can parallelize or do late-stage)

## Task 9: React Dashboard (Independent)

**Files:**
- Create: `src/frontend/components/Dashboard.tsx`
- Create: `src/frontend/components/SendForm.tsx`
- Create: `src/frontend/components/MessageList.tsx`
- Create: `src/frontend/api/messages.ts`
- Create: `src/frontend/hooks/useMessages.ts`
- Create: `src/frontend/types.ts`

**Purpose:** UI scaffolding for send form, message list, dashboard layout.

**Note:** This is scaffolded; full React bundling (webpack/Vite) is v2+ work. This task creates component files ready for integration.

**See plan Task 9 for exact code.**

---

## Task 10: Jest Configuration & Test Suite

**Files:**
- Create: `jest.config.js`
- Create: `tests/jest-setup.ts`

**Purpose:** Configure Jest with TypeScript support, set coverage thresholds.

**Coverage targets:**
- 85%+ on API routes
- 90%+ on queue service

**Steps:**
1. Create `jest.config.js` (exact from plan Task 10, Step 1)
2. Create `tests/jest-setup.ts` (exact from plan Task 10, Step 2)
3. Run `npm test` to verify configuration
4. Commit

**See plan Task 10 for exact code.**

---

## Task 11: Docker Compose & Local Dev Verification

**Files:**
- Already created in Task 1; this task verifies

**Purpose:** Ensure Docker Compose, migrations, API health, and message flow work end-to-end.

**Steps (all from plan Task 11):**
1. `docker compose up -d`
2. Wait for services healthy
3. `docker exec disparador_api npx prisma migrate dev`
4. `curl http://localhost:3000/health` → verify OK
5. Insert test org in DB
6. Test API authentication
7. Create test instance via API
8. Start queue worker
9. Send test message via API
10. Verify message in queue
11. `docker compose down`
12. Commit

**See plan Task 11 for exact shell commands.**

---

## Global Constraints (bind all three)
- TypeScript strict mode on all code (Tasks 9, 10)
- Jest coverage: 85%+ routes, 90%+ services (Task 10)
- Docker setup must work locally without manual steps (Task 11)
