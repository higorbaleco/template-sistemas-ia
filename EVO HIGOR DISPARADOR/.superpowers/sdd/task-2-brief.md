# Task 2: Prisma ORM & Database Migrations

**Files:**
- Create: `prisma/schema.prisma`
- Create: `.env` (copy from .env.example)
- Create: `src/db.ts`

**Interfaces:**
- Produces: 
  - Prisma client initialization
  - TypeScript types for all models (Organization, Instance, MessageQueue, etc.)
  - Functions: `getPrisma(): PrismaClient`

## Steps

- [ ] **Step 1: Initialize Prisma**

```bash
cd "/Users/higorplens/Antigravity Software/EVO HIGOR DISPARADOR"
npm install
npx prisma init
```

- [ ] **Step 2: Create .env (development)**

```bash
cp .env.example .env
# Edit .env and ensure DATABASE_URL points to local postgres:5432
# For Docker compose: DATABASE_URL=postgresql://postgres:password@postgres:5432/disparador
```

- [ ] **Step 3: Create prisma/schema.prisma**

[Full schema content from plan Task 2, Step 3 — exactly as written, including all models and relations]

- [ ] **Step 4: Create src/db.ts**

[Full code from plan Task 2, Step 4 — exactly as written]

- [ ] **Step 5: Run Prisma migrations**

```bash
cd "/Users/higorplens/Antigravity Software/EVO HIGOR DISPARADOR"
npx prisma migrate dev --name init
```

Expected output: Migration created and applied successfully, Prisma client generated.

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma src/db.ts .env
git commit -m "feat: add Prisma ORM with database schema (organizations, instances, message_queues, logs)"
```

## Global Constraints (bind this task)
- Node.js 20.11.0 LTS minimum
- TypeScript strict mode enabled
- All database queries must filter by `organization_id`
- Multi-tenant isolation is critical
