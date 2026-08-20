# Task 3: Evolution API Bridge (Typed Wrapper)

**Files:**
- Create: `src/services/evolution.ts`
- Create: `tests/services/evolution.test.ts`

**Interfaces:**
- Consumes: Environment variables (`EVOLUTION_API_URL`, `EVOLUTION_API_KEY`)
- Produces: 
  - `class EvolutionClient { connectInstance(), sendMessage(), getInstanceStatus() }`
  - Types: `ConnectInstanceResponse`, `SendMessagePayload`, `SendMessageResponse`

## Steps (TDD)

- [ ] **Step 1: Write failing test for EvolutionClient**

Create `tests/services/evolution.test.ts` with the exact test code from plan Task 3, Step 1.

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/services/evolution.test.ts
# Expected: FAIL - EvolutionClient is not defined
```

- [ ] **Step 3: Implement EvolutionClient**

Create `src/services/evolution.ts` with the exact code from plan Task 3, Step 3 (all interfaces and class methods).

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/services/evolution.test.ts
# Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
git add src/services/evolution.ts tests/services/evolution.test.ts
git commit -m "feat: add EvolutionClient with typed wrapper for API calls"
```

## Global Constraints (bind this task)
- Node.js 20.11.0 LTS minimum
- TypeScript strict mode enabled
- All code must be strict-mode TypeScript
- TDD approach: test first, implement, test passes, commit
