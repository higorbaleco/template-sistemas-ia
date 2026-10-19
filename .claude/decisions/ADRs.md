# ADRs: Architecture Decision Records (DEC-001 a DEC-010)

**Versão 1.0** · 2026-10-11 · Status: Consolidação Phase 1 · Owner: A00 (Coordenador)

Decisões arquiteturais tomadas com rationale, alternativas consideradas e trade-offs documentados. Cada ADR é uma decisão congelada que não será revistada sem novo ADR.

---

## ADR-001: Next.js App Router + TypeScript (DEC-001)

**Decisão:** Usar Next.js 16 App Router com TypeScript strict mode.

**Contexto:**
- Necessário BFF + UI no mesmo stack para entregar rápido
- Quatro agentes (A03 frontend, A04 backend) precisam compartilhar tipos
- Necessário servidor para guardar chave GPT Maker
- Requisito de internacionalização pt-BR

**Alternativas avaliadas:**
1. **Remix** — Mais agnóstico, maior flexibilidade. Rejeitado: menos ecosistema pt-BR, mais setup.
2. **SvelteKit** — Mais leve. Rejeitado: menor comunidade, menos ferramentas.
3. **Astro** — Mais simples. Rejeitado: menos suporte a data fetching complexo.
4. **Express + React separados** — Mais flexível. Rejeitado: duplicação de lógica, overhead de coordenação.

**Decisão:** Next.js App Router
- Comunidade grande
- TypeScript first-class
- BFF nativo (route handlers)
- Middleware para tenant guards
- Vercel/Railway suporte
- Internacionalização com next-intl

**Trade-offs:**
- Acoplamento Next.js (reversível com wrapper API)
- Menos flexibilidade que Express (aceitável para MVP)

**Rationale:**
Velocidade de entrega > flexibilidade futura. Reversível se necessário.

**Aprovação:** ✅ DEC-001 congelado

---

## ADR-002: PostgreSQL + Auth.js + Drizzle (Sem Supabase) (DEC-002)

**Decisão:** Usar PostgreSQL + Auth.js + Drizzle, rejeitando Supabase.

**Contexto:**
- Usuário já tem chave API GPT Maker
- Quer integrar apenas essa chave no backend próprio
- Supabase adiciona overhead de Postgre gerenciado + Auth
- Necessário isolamento rigoroso por organização (Supabase RLS não é suficiente para compliance)
- Necessário compatibilidade com Railway ou Render.com

**Alternativas avaliadas:**
1. **Supabase (Postgres + Auth gerenciado)** — Integração rápida. Rejeitado:
   - RLS não resolve isolamento em cache, job storage, S3
   - Adiciona custo extra de auth
   - Menos controle de tenant guards server-side
   - Vendor lock-in inicial

2. **Firebase Realtime** — Simples. Rejeitado:
   - Sem SQL nativo
   - Pricing é imprevisível em escala
   - Risco de integração com GPT Maker difícil

3. **MongoDB** — Flexível. Rejeitado:
   - Overkill para schema relacional
   - Menos experiência do time em NoSQL

**Decisão:** PostgreSQL + Auth.js + Drizzle
- PostgreSQL: padrão, maduro, Rails heritage
- Auth.js: agnóstico, OAuth built-in, session control
- Drizzle: schema/migrations tipadas, SQL explícito

**Trade-offs:**
- Mais setup inicial (não gerenciado)
- Infraestrutura a gerenciar (Railway ou self-hosted)
- Escalabilidade repousa em Postgres (resolúvel com read replicas)

**Rationale:**
Controle > gerenciado. Isolamento por organização exige validação server-side que Supabase RLS não garante.

**Aprovação:** ✅ DEC-002 congelado

---

## ADR-003: Drizzle no MVP (DEC-003)

**Decisão:** Usar Drizzle ORM para schema e migrations.

**Contexto:**
- Rejeitamos Supabase (DEC-002), logo não usamos Supabase migrations
- Necessário schema tipado (TypeScript)
- Migrations devem ser versionadas e refletir schema
- Deve suportar constraints compostas (`organization_id` + `id`)

**Alternativas avaliadas:**
1. **Prisma** — Popular, muito setup. Rejeitado:
   - Prisma Client é mais pesado
   - Schema DSL é agnóstico (menos SQL explícito)
   - Migrações são automáticas (risco de alterações imprevistas)

2. **TypeORM** — Completo. Rejeitado:
   - Mais overhead
   - Menos intuitivo para migrations

3. **Sequelize** — Legacy. Rejeitado:
   - Menos TypeScript-first

**Decisão:** Drizzle
- Schema em TypeScript + migrations em SQL explícito
- Suporta constraints compostas
- Migrations versionadas (auditoria clara)
- Integração com Zod (validação)

**Trade-offs:**
- Menos abstraído que Prisma (mais SQL para aprender)
- Comunidade menor (mas cresce rápido)

**Rationale:**
SQL explícito > ORM automático para isolamento por organização. Constraints compostas são críticas.

**Aprovação:** ✅ DEC-003 congelado

---

## ADR-004: pg-boss para Filas (DEC-004)

**Decisão:** Usar pg-boss para processamento assíncrono.

**Contexto:**
- Necessário queue para jobs duráveis
- Mutar dados em GPT Maker é lento (5-30s)
- Mutar deve ser assíncrono via operação/outbox
- Redis não está em infraestrutura (Railway não tem Redis nativo)
- PostgreSQL já está disponível

**Alternativas avaliadas:**
1. **BullMQ + Redis** — Popular, rápido. Rejeitado:
   - Redis extra = custo/complexidade
   - Menos durável em falhas

2. **AWS SQS** — Gerenciado. Rejeitado:
   - Vendor lock-in
   - Custo adicional

3. **Inngest** — Serverless. Rejeitado:
   - Overhead novo
   - Overkill para MVP

**Decisão:** pg-boss
- Jobs duráveis em Postgres
- Suporta retry, schedule, delay
- Integração com Drizzle
- Sem infraestrutura extra

**Trade-offs:**
- Menos rápido que Redis (aceitável para pilot)
- Polling em lugar de pub/sub (aceitável para volume pilot)

**Rationale:**
Durabilidade + simplicidade > velocidade. PostgreSQL já é SPOF, logo usar Postgres para jobs simplifica.

**Aprovação:** ✅ DEC-004 congelado

---

## ADR-005: Repositório Único Privado (DEC-005)

**Decisão:** Usar monorepo único (não fragmentado em micro-repos).

**Contexto:**
- Tipos de domínio compartilhados entre A03 (frontend), A04 (backend), A07 (worker)
- Sincronização manual de tipos = churn
- Necessário CODEOWNERS único para guardarail
- CI simples (um workflow, um deploy)

**Alternativas avaliadas:**
1. **Monorepo com workspaces** — Sim, mantém esse caminho.
2. **Micro-repos com versionamento de tipos** — Rejeitado:
   - Coordenação extra
   - Versioning overhead
   - Risco de divergência

**Decisão:** Monorepo único com pnpm workspaces
```
monorepo/
  apps/web (Next.js BFF + UI)
  apps/worker (Node jobs)
  packages/contracts (tipos compartilhados)
  packages/domain (lógica comum)
  packages/data (Drizzle schema)
  packages/ui (componentes)
```

**Trade-offs:**
- Menos modularidade (reversível: extrair pacotes depois)
- Build pode ser mais lento (aceitável com cache)

**Rationale:**
Compartilhamento de tipos > modularidade prematura. Reversível.

**Aprovação:** ✅ DEC-005 congelado

---

## ADR-006: UI pt-BR, Código/Rotas em Inglês (DEC-006)

**Decisão:** Interface em português, código/rotas em inglês.

**Contexto:**
- Produto local (pt-BR)
- Código técnico em inglês é padrão
- Rotas em português quebram SEO e integração
- Mensagens de erro e UI precisam pt-BR

**Alternativas avaliadas:**
1. **Tudo em português** — Coerência. Rejeitado:
   - Rotas em português (complexidade)
   - Código em português (não-padrão)

2. **Tudo em inglês** — Padrão técnico. Rejeitado:
   - UI alienígena para usuário final pt-BR

**Decisão:**
- Código: inglês (variáveis, funções, rotas)
- UI: português (labels, mensagens, documentação)
- I18n com next-intl

**Trade-offs:**
- Coerência reduzida entre código e UI
- Tradução é overhead (aceitável)

**Rationale:**
Experiência de usuário pt-BR > consistência técnica. Padrão de mercado.

**Aprovação:** ✅ DEC-006 congelado

---

## ADR-007: Polling com Snapshots Locais (DEC-007)

**Decisão:** Usar polling com snapshots locais em lugar de webhook-first.

**Contexto:**
- GPT Maker webhooks não têm assinatura confirmada (GM-002)
- Webhook sem assinatura = risco de forjar estado falso
- Necessário validação com releitura autenticada mesmo com webhook
- MVP não precisa tempo real (5-10s de latência é aceitável)

**Alternativas avaliadas:**
1. **Webhook-first** — Tempo real. Rejeitado:
   - Assinatura não confirmada (GM-002)
   - Webhook perdido = gap de estado
   - Precisaria polling de fallback mesmo assim

2. **Polling puro (sem webhook)** — Simples. Sim, mantém esse caminho.

**Decisão:**
- Polling a cada 5-10s de estado de agentes, canais, trainings
- Snapshots locais em Postgres (cache)
- Webhook como "hint" se existir (validação com releitura)
- Sem automaticidade de webhook

**Trade-offs:**
- Latência ~5-10s (aceitável para pilot)
- Mais queries (mitigado com cache)
- Espera por webhook-first resolve GM-002 antes de produção

**Rationale:**
Confiabilidade > latência. Polling é garantido; webhook é hint.

**Aprovação:** ✅ DEC-007 congelado

---

## ADR-008: Capabilities por Organização/Canal (DEC-008)

**Decisão:** Feature flags por organização e canal para capabilities.

**Contexto:**
- Cada "capacidade" (DOCUMENT upload, WEBSITE, VIDEO, HTTP tools) depende de homologação
- Documentação OpenAPI ≠ testado em conta real com dados reais
- UI não deve prometer recurso não homologado

**Alternativas avaliadas:**
1. **Capabilities globais liberadas** — Simples. Rejeitado:
   - Risco de UI prometer WEBSITE quando só TEXT foi testado
   - White-label inclui capacidades por contrato

2. **Capabilities local registry** — Sim, mantém esse caminho.

**Decisão:**
- Tabela `capabilities` registra (organization_id, channel_id, capability_name, status)
- API bloqueia operação se capability não aprovado
- UI esconde botão se capability não aprovado
- Testes validam que capability não existente → bloqueio

**Trade-offs:**
- Overhead administrativo (mitigado com CLI/admin panel)
- UI precisa checkagem antes de cada operação

**Rationale:**
Segurança do usuário > experiência. Não posso prometer WEBSITE e falhar em produção.

**Aprovação:** ✅ DEC-008 congelado

---

## ADR-009: Onboarding Assistido para Workspace/Canal (DEC-009)

**Decisão:** Onboarding assistido (não autônomo) para workspace e canal iniciais.

**Contexto:**
- API pública de GPT Maker não garante criação de workspace completa
- Criação de canal pode exigir QR, autenticação browser, etc.
- White-label pode exigir passos no painel do fornecedor
- Piloto é "assistido" por operação; autonomia é P1

**Alternativas avaliadas:**
1. **Criação autônoma** — UX melhor. Rejeitado:
   - Não é garantida pela API
   - Risco de falha silenciosa

2. **Assistida com fallback autônomo** — Melhor. Mas:
   - Mais complexo
   - Exigência no GM-005 (criação de canal via API)

**Decisão:**
- Onboarding guia user até ponto de "provisionar workspace em fornecedor"
- Operação (platform_admin) provisiona e retorna ID
- Operação confirma que canal está conectado
- UI avança após confirmação
- P1 pode adicionar autonomia conforme GM-005/GM-006 evoluem

**Trade-offs:**
- Menos autonomia (aceitável para MVP)
- Escala requer automação (P1)

**Rationale:**
Confiabilidade > autonomia no piloto. Autonomia é P1.

**Aprovação:** ✅ DEC-009 congelado

---

## ADR-010: Mutação Externa Sempre Assíncrona (DEC-010)

**Decisão:** Toda mutação em GPT Maker via operação/outbox (assíncrono), nunca síncrono.

**Contexto:**
- HTTP timeout pode deixar estado indeterminado (OUTCOME_UNKNOWN)
- Se resposta é perdida em rede, não sabemos se mutação aconteceu
- Necessário reconciliação de OUTCOME_UNKNOWN depois
- Frontend precisa feedback imediato (operação registrada localmente)

**Alternativas avaliadas:**
1. **Síncrono com retry** — Simples. Rejeitado:
   - Retry cego = potencial duplicação
   - Timeout bloqueia user

2. **Assíncrono via operação** — Sim, mantém esse caminho.

**Decisão:**
- User action → cria operação local (estado `PENDING`)
- Worker processa operação (chamada remota)
- Resultado confirmado → estado `SUCCESS` ou `FAILED` ou `UNKNOWN`
- Se UNKNOWN, reconciliação valida depois
- UI mostra estado da operação em tempo real

**Trade-offs:**
- Complexidade extra (operação/outbox)
- Latência de feedback (mitigado com UI otimista)

**Rationale:**
Durabilidade > simplicidade. OUTCOME_UNKNOWN é realidade em sistemas distribuídos.

**Aprovação:** ✅ DEC-010 congelado

---

## Summary

| ADR | Decisão | Status | Alternativas rejeitadas | Rationale |
|---|---|---|---|---|
| 001 | Next.js + TypeScript | ✅ | Remix, SvelteKit, Astro, Express | Velocidade + ecosistema |
| 002 | PostgreSQL + Auth.js (sem Supabase) | ✅ | Supabase, Firebase | Controle de isolamento |
| 003 | Drizzle | ✅ | Prisma, TypeORM | SQL explícito + constraints compostas |
| 004 | pg-boss | ✅ | BullMQ + Redis, SQS, Inngest | Durabilidade + simplicidade |
| 005 | Monorepo único | ✅ | Micro-repos | Compartilhamento de tipos |
| 006 | UI pt-BR, código inglês | ✅ | Tudo português, tudo inglês | UX local + padrão técnico |
| 007 | Polling com snapshots | ✅ | Webhook-first | Confiabilidade |
| 008 | Capabilities por org/canal | ✅ | Globais | Segurança do usuário |
| 009 | Onboarding assistido | ✅ | Autônomo | Confiabilidade MVP |
| 010 | Mutação assíncrona | ✅ | Síncrona | Durabilidade |

---

**Próximas ações:**
- Cada ADR pode ser expandido em Decision Adr quando bloqueios surgirem
- Revisar ADRs antes de G0 gate
- Congelar todas as 10 decisões antes de M0 começar

**Última atualização:** 2026-10-11 · **Owner:** A00 · **Status:** Consolidação Phase 1
