# Task 6, 7, 8 Brief (Can parallelize)

These three tasks can run in parallel after Task 5 completes. Each creates independent route files.

## Task 6: Message Routes

**Files:**
- Create: `src/api/routes/messages.ts`
- Create: `tests/api/routes/messages.test.ts`

**Endpoints:**
- `POST /api/v1/messages` — enqueue
- `GET /api/v1/messages` — list (paginated)
- `GET /api/v1/messages/:id` — detail
- `DELETE /api/v1/messages/:id` — cancel

**Route registration:** After Task 5 completes, Task 6 must update `src/api/index.ts` to register:
```typescript
import messagesRouter from './routes/messages';
app.use('/api/v1', authMiddleware, messagesRouter);
```

**See plan Task 6 for exact code and TDD steps.**

---

## Task 7: Instance Routes

**Files:**
- Create: `src/api/routes/instances.ts`
- Create: `tests/api/routes/instances.test.ts`

**Endpoints:**
- `POST /api/v1/instances` — create
- `GET /api/v1/instances` — list
- `GET /api/v1/instances/:id/qr` — QR code
- `DELETE /api/v1/instances/:id` — logout

**Route registration:** After Task 5, update `src/api/index.ts`:
```typescript
import instancesRouter from './routes/instances';
app.use('/api/v1', authMiddleware, instancesRouter);
```

**See plan Task 7 for exact code and TDD steps.**

---

## Task 8: Webhooks

**Files:**
- Create: `src/api/routes/webhooks.ts`
- Create: `tests/api/routes/webhooks.test.ts`

**Endpoint:**
- `POST /webhooks/evolution` — no auth, validates `x-api-key` secret header

**Route registration:** After Task 5, update `src/api/index.ts`:
```typescript
import webhooksRouter from './routes/webhooks';
app.use('/webhooks', webhooksRouter); // NO auth required (uses secret header)
```

**Key:** This route does NOT use `authMiddleware` — it validates webhook secret instead.

**See plan Task 8 for exact code and TDD steps.**

---

## Global Constraints (bind all three)
- All routes must filter by `organization_id` (Tasks 6, 7 only — Task 8 validates secret)
- Multi-tenant isolation is critical
- TDD: test first, implement, test passes, commit
- Test coverage: 85%+ on routes
