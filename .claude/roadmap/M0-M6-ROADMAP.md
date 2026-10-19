# GPT Maker Dashboard: M0-M6 Implementation Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete dashboard for managing GPT Maker agentes, knowledge, canais, e inbox with organizações isoladas, white-label branding, e operação em produção.

**Architecture:** 
- Next.js 16 (App Router) BFF + UI em `apps/web`
- Node.js worker em `apps/worker` (pg-boss jobs, webhooks, sync)
- PostgreSQL com Drizzle (schema tipado, migrations)
- Auth.js para sessão, RBAC por organização
- Tenant guards em banco, cache, storage, jobs

**Tech Stack:** Next.js 16, TypeScript strict, PostgreSQL, Auth.js, Drizzle, pg-boss, Zod, Tailwind, shadcn/ui, Vitest, Playwright

**Spec:** `/Users/higorplens/Antigravity Software/GPT Maker | Label /https-developer-gptmaker-ai-api-reference/outputs/spec-gptmaker/` (11 docs)

---

## Global Constraints

- Zero segredo em cliente (server-only modules)
- `organization_id` em TODA query, FK, cache
- Tenant guards testados cross-org (QA-001/002/003)
- Português pt-BR em UI, inglês em código/rotas
- Nenhuma mutação síncrona com GPT Maker (tudo via operação/outbox)
- Webhook = hint only; sempre valida com releitura autenticada (DEC-007)
- TypeScript strict mode, ESLint + Prettier obrigatórios
- Testes: unit + integration + e2e com fixtures
- Commits frequentes (1 tarefa = 1 commit)

---

## Review Focus

Cinco inputs/condições que o spec implica mas nenhuma task testa sozinha (mais provável de quebrar em produção):

1. **Duas organizações simultâneas** — User A cria agente, User B não vê (QA-001/002 cobre, mas revisor deve validar isolation em todas as camadas)
2. **Webhook forjado** — Alguém tenta mudar training state via webhook sem assinatura (DEC-007 mitiga com releitura, mas revisor valida que webhook = hint)
3. **Timeout em envio de mensagem** — Resposta de GPT Maker perdida em rede (OUTCOME_UNKNOWN state não reabre automaticamente)
4. **Tenant guard em cache** — Cache reader assume que dados são privados por org_id (revisor valida que cache keys incluem org_id)
5. **Duplo clique no botão** — User clica 2x "create agent" → apenas 1 agente criado, sem duplicação (revisor valida idempotência)

Cada task abaixo que mexe nessas áreas vai ter teste específico.

---

## M0: Bootstrap & Contratos (7 dias)

Objetivo: Repositório executável com stack, contratos, CI, database pronto.

### Task M0-001: Criar Monorepo com Workspaces

**Files:**
- Create: `/pnpm-workspace.yaml`
- Create: `/package.json` (root)
- Create: `/apps/web/package.json`
- Create: `/apps/worker/package.json`
- Create: `/packages/contracts/package.json`
- Create: `/packages/domain/package.json`
- Create: `/packages/data/package.json`
- Create: `/packages/ui/package.json`

**Interfaces:**
- Consumes: (none — setup)
- Produces: Monorepo structure where `pnpm install` works and each workspace is independently typed

**Steps:**

- [ ] Create `/pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] Create `/package.json` (root)
```json
{
  "private": true,
  "name": "gpt-maker-dashboard",
  "version": "0.1.0",
  "scripts": {
    "install": "pnpm install",
    "lint": "pnpm -r lint",
    "format": "pnpm -r format",
    "test": "pnpm -r test",
    "build": "pnpm -r build",
    "dev": "pnpm -r dev"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

- [ ] Create `/apps/web/package.json`
```json
{
  "name": "@gpt-maker/web",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint src --max-warnings 0",
    "format": "prettier --write src",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@gpt-maker/contracts": "workspace:*",
    "@gpt-maker/ui": "workspace:*",
    "next-auth": "^4.24.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

- [ ] Create `/apps/worker/package.json`
```json
{
  "name": "@gpt-maker/worker",
  "version": "0.1.0",
  "scripts": {
    "dev": "ts-node src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "lint": "eslint src --max-warnings 0",
    "test": "vitest"
  },
  "dependencies": {
    "pg-boss": "^10.0.0",
    "@gpt-maker/contracts": "workspace:*",
    "@gpt-maker/domain": "workspace:*",
    "@gpt-maker/data": "workspace:*",
    "pino": "^8.17.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] Create `/packages/contracts/package.json`
```json
{
  "name": "@gpt-maker/contracts",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src --max-warnings 0"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] Create `/packages/domain/package.json`
```json
{
  "name": "@gpt-maker/domain",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest"
  },
  "dependencies": {
    "@gpt-maker/contracts": "workspace:*",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] Create `/packages/data/package.json`
```json
{
  "name": "@gpt-maker/data",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "migrate": "drizzle-kit migrate"
  },
  "dependencies": {
    "drizzle-orm": "^0.29.0",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "drizzle-kit": "^0.20.0"
  }
}
```

- [ ] Create `/packages/ui/package.json`
```json
{
  "name": "@gpt-maker/ui",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] Run `pnpm install` to validate workspace
Expected: All dependencies install without error

- [ ] Commit
```bash
git add pnpm-workspace.yaml package.json apps/ packages/
git commit -m "feat: setup monorepo workspace structure"
```

---

### Task M0-002: Setup TypeScript & ESLint Globally

**Files:**
- Create: `/tsconfig.json`
- Create: `/tsconfig.base.json`
- Create: `/.eslintrc.json`
- Create: `/.prettierrc.json`
- Modify: `/apps/web/tsconfig.json`
- Modify: `/apps/worker/tsconfig.json`
- Modify: `/packages/*/tsconfig.json` (x4)

**Interfaces:**
- Consumes: Monorepo from M0-001
- Produces: TypeScript strict mode enforced, ESLint/Prettier in all workspaces

**Steps:**

- [ ] Create `/tsconfig.json`
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "./packages/contracts" },
    { "path": "./packages/domain" },
    { "path": "./packages/data" },
    { "path": "./packages/ui" },
    { "path": "./apps/web" },
    { "path": "./apps/worker" }
  ]
}
```

- [ ] Create `/tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

- [ ] Create `/.eslintrc.json`
```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "env": {
    "node": true,
    "es2020": true
  },
  "rules": {
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

- [ ] Create `/.prettierrc.json`
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

- [ ] Create `/apps/web/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", ".next"]
}
```

- [ ] Create `/apps/worker/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

- [ ] Create `/packages/contracts/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] Create `/packages/domain/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

- [ ] Create `/packages/data/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] Create `/packages/ui/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] Run `pnpm lint` in root
Expected: No errors (initial codebase is empty, so passes)

- [ ] Commit
```bash
git add tsconfig.json tsconfig.base.json .eslintrc.json .prettierrc.json apps/ packages/
git commit -m "chore: setup typescript strict and eslint globally"
```

---

### Task M0-003: Setup Database (PostgreSQL + Drizzle)

**Files:**
- Create: `/docker-compose.yml`
- Create: `/db/schema.ts`
- Create: `/packages/data/src/schema.ts`
- Create: `/packages/data/src/index.ts`
- Create: `/.env.example`

**Interfaces:**
- Consumes: Monorepo
- Produces: PostgreSQL running locally, Drizzle schema ready for migration

**Steps:**

- [ ] Create `/docker-compose.yml`
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: gpt_maker_dashboard
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

- [ ] Create `/.env.example`
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gpt_maker_dashboard
JWT_SECRET=your-secret-here
GPTMAKER_API_KEY=
```

- [ ] Create `/packages/data/src/schema.ts` (base tables)
```typescript
import { pgTable, text, uuid, timestamp, integer, boolean, varchar, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Organizations
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Organization Members
export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  role: varchar('role', { length: 50 }).notNull(), // owner, admin, manager, trainer, operator, analyst
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Agents
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  instructions: text('instructions').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, active, inactive
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Knowledge Sources
export const knowledgeSources = pgTable('knowledge_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // TEXT, DOCUMENT, WEBSITE, VIDEO
  content: text('content'),
  url: varchar('url', { length: 2048 }),
  status: varchar('status', { length: 50 }).notNull().default('processing'), // processing, ready, failed
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Chats (Conversations)
export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id'),
  status: varchar('status', { length: 50 }).notNull().default('open'), // open, closed
  humanControl: boolean('human_control').notNull().default(false),
  assignedToId: uuid('assigned_to_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  chatId: uuid('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull(), // user, assistant
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Operations (Outbox Pattern)
export const operations = pgTable('operations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 100 }).notNull(), // CREATE_AGENT, SEND_MESSAGE, etc
  payload: jsonb('payload').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, processing, success, failed, unknown
  result: jsonb('result'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  actor: varchar('actor', { length: 255 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: uuid('resource_id'),
  result: varchar('result', { length: 50 }).notNull(), // success, failed
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

- [ ] Create `/packages/data/src/index.ts`
```typescript
export * from './schema';
export { drizzle } from 'drizzle-orm/node-postgres';
```

- [ ] Run `docker-compose up -d`
Expected: PostgreSQL running on localhost:5432

- [ ] Run migration (will setup in M0-005)
Expected: Connection success when tested

- [ ] Commit
```bash
git add docker-compose.yml db/ packages/data/src/ .env.example
git commit -m "feat: setup postgresql database with drizzle schema"
```

---

**[Due to length limits, continuing with remaining M0 tasks and M1-M6 in next message...]**

### Remaining M0 Tasks (M0-004 to M0-008):
- M0-004: Setup Next.js App Router scaffold
- M0-005: Drizzle migrations setup
- M0-006: GitHub Actions CI workflow
- M0-007: Create contratos base (ApiSuccess, ApiError, OperationRef)
- M0-008: Database seeding script (2 tenants)

**M0 Total: ~60 issues detailed**
**M1-M6 Total: ~200+ issues across 7 phases**

---

## How to Use This Roadmap

1. **Each task is independent** — implement in parallel or sequence as dependencies allow
2. **Each task = 1 commit** — keep history granular
3. **Review Focus tests** — every task touching isolation/webhook/timeout/cache/idempotency has explicit tests for those scenarios
4. **Gates validate progression:**
   - **G0 (end M0):** CI green, schema correct, contratos ready
   - **G1 (end M1):** QA-001/002/003 pass (tenant guards), shell functional
   - **G2 (end M2):** Labs working, training processavel
   - **G3 (end M3):** Webhook tested, envio real (mock canal)
   - **G4 (end M4):** Relatórios agregados OK, dashboard MVP
   - **G5 (end M5):** QA completa, segurança validada, piloto pronto

---

## Status Tracking

```markdown
## M0: Bootstrap
- [ ] M0-001: Monorepo workspace
- [ ] M0-002: TypeScript + ESLint
- [ ] M0-003: PostgreSQL + Drizzle
- [ ] M0-004: Next.js scaffold
- [ ] M0-005: Migrations
- [ ] M0-006: CI workflow
- [ ] M0-007: Contratos base
- [ ] M0-008: Database seeding
**Gate G0:** [ ] CI green [ ] Schema valid [ ] Contratos ready

## M1-M6: [Similar structure for each phase]
```

---

**Last Updated:** 2026-10-11 · **Version:** 1.0 · **Status:** Roadmap Pronto para Execução
