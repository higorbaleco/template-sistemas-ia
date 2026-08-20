# Task 4: Message Queue Service (Bull + Redis)

**Files:**
- Create: `src/services/queue.ts`
- Create: `src/workers/message-queue.ts`
- Create: `tests/services/queue.test.ts`

**Interfaces:**
- Consumes: `EvolutionClient`, `getPrisma()`, Redis
- Produces:
  - `class MessageQueueService { enqueue(), process() }`
  - Queue worker loop (runs on interval, processes pending messages)

## Key Logic (from plan)

1. Enqueue: message → DB with status `pending`
2. Worker loop every 5s: fetch pending messages, call Evolution API
3. Success: mark `sent`; Transient error: exponential backoff (5m → 10m → 20m... up to 24h, max 5 retries)
4. Permanent error: mark `failed`, no retry
5. All events → `message_logs` table

## Steps (TDD)

- [ ] **Step 1: Write test for MessageQueueService**

Create `tests/services/queue.test.ts` with exact code from plan Task 4, Step 1.

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/services/queue.test.ts
# Expected: FAIL - MessageQueueService is not defined
```

- [ ] **Step 3: Implement MessageQueueService**

Create `src/services/queue.ts` with exact code from plan Task 4, Step 3 (all interfaces, class, retry logic).

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/services/queue.test.ts
# Expected: PASS
```

- [ ] **Step 5: Create message queue worker script**

Create `src/workers/message-queue.ts` with exact code from plan Task 4, Step 5.

- [ ] **Step 6: Update package.json scripts**

Add to scripts object:
```json
"queue:worker": "ts-node src/workers/message-queue.ts"
```

- [ ] **Step 7: Commit**

```bash
git add src/services/queue.ts src/workers/message-queue.ts tests/services/queue.test.ts
git commit -m "feat: add MessageQueueService with Bull/Redis and exponential backoff retry logic"
```

## Global Constraints (bind this task)
- Retry logic: exponential backoff, max 5 retries over 24h (non-negotiable)
- All database queries must filter by `organization_id`
- TypeScript strict mode
