# GO-NO-GO: Checklist de Readiness Antes do Kickoff M0

**Versão 1.0** · 2026-10-11 · Status: Phase 2 (Orquestração) · Owner: A00 (Coordenador)

Checklist objetivo para decidir se M0 pode começar (GO) ou se há bloqueador real (NO-GO). Todo item 🔴 precisa estar ✅ para GO. Itens 🟡 podem ficar pendentes com plano B documentado em BLOCKERS.md, sem bloquear o início de M0.

---

## I. Decisões de Negócio (usuário)

| # | Item | Prioridade | Status | Referência |
|---|---|---|---|---|
| 1 | Stack aprovada (Next.js + Node.js + PostgreSQL + Drizzle + pg-boss) | 🔴 | ⬜ | DEC-001 a DEC-004 |
| 2 | Escopo P0 confirmado (ver README.md "Escopo P0" em CODEX.md) | 🔴 | ⬜ | CODEX.md |
| 3 | Organização GitHub + nome do repositório definidos (PEND-002) | 🔴 | ⬜ | BLOCKERS.md |
| 4 | Ownership de agentes designado — quem é A00, quem é A04, etc. (PEND-010) | 🔴 | ⬜ | BLOCKERS.md |
| 5 | Identidade visual mínima (paleta placeholder aceita se marca final não estiver pronta) | 🟡 | ⬜ | PEND-001 |
| 6 | Hospedagem alvo decidida ou Railway aceito como padrão (PEND-003) | 🟡 | ⬜ | BLOCKERS.md |
| 7 | Credencial GPT Maker de staging solicitada (não precisa ter chegado ainda) (PEND-004) | 🟡 | ⬜ | BLOCKERS.md |

## II. Infraestrutura Técnica

| # | Item | Prioridade | Status | Referência |
|---|---|---|---|---|
| 8 | PostgreSQL local testado (`docker compose up` sobe sem erro) | 🔴 | ⬜ | BK-008 |
| 9 | Monorepo pnpm estruturado (`apps/web`, `apps/worker`, `packages/*`) | 🔴 | ⬜ | BK-001/002/003 |
| 10 | Template de CI (GitHub Actions) pronto, mesmo que local-only inicialmente | 🔴 | ⬜ | BK-007 |
| 11 | `.env.example` documentado, sem segredo real commitado | 🔴 | ⬜ | A09, A10 |

## III. Documentação & Agentes

| # | Item | Prioridade | Status | Referência |
|---|---|---|---|---|
| 12 | 11 specs lidas e consolidadas (CODEX.md) | 🔴 | ✅ | CODEX.md |
| 13 | MATRIX.md com 11 agentes e dependências claras | 🔴 | ✅ | MATRIX.md |
| 14 | ADRs.md com DEC-001 a DEC-010 congeladas | 🔴 | ✅ | ADRs.md |
| 15 | BLOCKERS.md com 20 pendências mapeadas | 🔴 | ✅ | BLOCKERS.md |
| 16 | 11 AGENT-BRIEFs (A00-A10) escritos e legíveis pelos agentes | 🔴 | ✅ | `.claude/agents/BRIEF-A00.md` a `BRIEF-A10.md` |
| 17 | M0-M6-ROADMAP.md com backlog BK-001 a BK-045 desdobrado | 🔴 | ✅ | M0-M6-ROADMAP.md |
| 18 | SKILLS-CATALOG.md mapeando skill obrigatório por agente/fase | 🟡 | ✅ | SKILLS-CATALOG.md |
| 19 | Cada agente confirmou ter lido seu próprio brief | 🔴 | ⬜ | — depende do usuário/agentes confirmarem |

## IV. Qualidade & Segurança (preparação, não execução)

| # | Item | Prioridade | Status | Referência |
|---|---|---|---|---|
| 20 | QA-001 a QA-021 definidos com critério de aceite claro | 🔴 | ✅ | CODEX.md § 09-QUALIDADE |
| 21 | Plano de teste cross-org (QA-001/002/003) entendido por A06/A08/A09 | 🔴 | ⬜ | BK-009 |
| 22 | Política de secrets (server-only, sem segredo em client) acordada | 🔴 | ⬜ | A09 |
| 23 | Convenção de log/auditoria (sem transcrição integral) acordada | 🟡 | ⬜ | QA-009 |

## V. Alinhamento de Expectativas

| # | Item | Prioridade | Status | Referência |
|---|---|---|---|---|
| 24 | Usuário entende que M6 não tem backlog fixo (é P1 aberto pós-piloto) | 🟡 | ⬜ | M0-M6-ROADMAP.md § M6 |
| 25 | Usuário aceita que "60+ issues M0" da sessão anterior foi corrigido para BK-001 a BK-010 (10 issues) | 🔴 | ⬜ | M0-M6-ROADMAP.md nota de reconciliação |
| 26 | Usuário sabe que M3 (canal real) depende de PEND-004 (credencial GPT Maker) resolvida | 🔴 | ⬜ | BLOCKERS.md |
| 27 | Cadência de sync semanal entre A00+A03+A04+A06 acordada | 🟡 | ⬜ | BRIEF-A00.md |

---

## Veredito

**GO se:** todos os itens 🔴 estão ✅.

**NO-GO parcial aceitável se:** apenas itens 🟡 estão pendentes — nesse caso, M0 pode começar com plano B documentado, mas o item pendente deve ter dono e data alvo antes do fim de M0.

**NO-GO total se:** qualquer item 🔴 da seção I, II ou III está ⬜ sem plano B.

---

## Status Atual (2026-10-11)

- **Itens 🔴 já resolvidos (documentação Phase 1-2):** 7 de 16 (itens 12-17, 20)
- **Itens 🔴 pendentes de ação do usuário/infra:** 9 (itens 1, 2, 3, 4, 8, 9, 10, 11, 19, 21, 22, 25, 26)
- **Veredito atual: NO-GO** — a documentação está pronta, mas decisões de negócio (stack final, repo, ownership) e setup de infraestrutura local ainda não foram confirmados nesta sessão.

**Próxima ação:** usuário resolve itens 1-4 da Seção I (decisões de negócio) e A00 inicia BK-001 (bootstrap do repo) assim que PEND-002 estiver resolvido.

---

**Última atualização:** 2026-10-11 · **Owner:** A00 (Coordenador) · **Status:** Phase 2 (Orquestração)
