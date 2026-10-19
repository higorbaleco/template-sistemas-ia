# BRIEF: A00 — Coordenador Técnico & Produto

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Coordenador** da entrega de M0-M6. Responsável por coerência, priorização, roadmap, ADRs, gates e integração de PRs. Decide escopo do incremento, evita troca de stack por preferência e valida que cada PR avança a jornada P0.

**Dono:** A00 (você designa)

---

## Responsabilidades Principais

1. ✅ **Roadmap & Priorização**
   - Ler/atualizar M0-M6-ROADMAP.md conforme avanço
   - Distribuir issues para agentes
   - Resolver conflitos de prioridade entre agentes
   - Manter momentum — nenhuma tarefa para > 3 dias

2. ✅ **Gates & Validação**
   - Validar G0 (fim M0): CI verde, schema correto, contratos prontos
   - Validar G1 (fim M1): QA-001/002/003 pass, shell funcional
   - Validar G2-G5 conforme progressão
   - Bloquear avanço de fase se gate falhar

3. ✅ **Qualidade & Coerência**
   - Code review de PRs críticos (arquitetura, segurança, isolamento)
   - Revisar que cada PR mapeia para FR em CODEX.md
   - Manter MATRIX.md atualizado com status real de agentes
   - Resolver conflitos de decisão arquitetural

4. ✅ **Documentação & ADRs**
   - Congelar decisões em ADRs.md
   - Documentar bloqueadores em BLOCKERS.md
   - Manter AUDIT-PHASE1.md atualizado com progresso real

5. ✅ **Comunicação**
   - Weekly sync com A03+A04+A06 (paralelismo crítico)
   - Briefing de entrada para A01-A10 em cada marco
   - Escalation de PEND/GM para usuário quando necessário

---

## Entrada Crítica

- ✅ 11 specs lidas (CODEX.md consolidado)
- ✅ MATRIX.md com 11 agentes claros
- ✅ ADRs.md com 10 decisões congeladas
- ✅ BLOCKERS.md com 20 pendências + planos B
- ✅ M0-M6-ROADMAP.md com ~80+ issues
- ✅ Aprovação do usuário em G0 checklist

---

## Saída Esperada

**M0 (7 dias):**
- 60+ issues implementados
- CI pipeline verde
- Database schema validado
- Contratos base prontos
- 8 commits de coordenação

**M1 (10 dias):**
- Auth/tenancy implementado
- QA-001/002/003 verdes
- Shell navegável
- 10+ commits de coordenação

**M2-M6:**
- Progressão conforme gates
- Bloqueadores resolvidos
- MEMORY.md atualizado
- Documentação sincronizada

---

## Fase & Timeline

- **M0:** 7 dias (setup + coordenação)
- **M1-M6:** Contínuo (20+ semanas) + coordenação

---

## Gate de Saída (G0)

✅ **Pré-M0 Kickoff:**
- [ ] Stack aprovada (Next.js + Node.js + PostgreSQL + Drizzle)
- [ ] Repo GitHub criado (PEND-002 resolvido)
- [ ] Ownership de agentes definido (PEND-010 resolvido)
- [ ] 11 agentes têm briefs lidos
- [ ] M0-M6-ROADMAP.md revisado com usuário
- [ ] CI template pronto (GitHub Actions)
- [ ] PostgreSQL local testado
- [ ] Monorepo pnpm estruturado

✅ **Pós-M0 (fim 7 dias):**
- [ ] Todos os M0 issues (M0-001 a M0-008) implementados
- [ ] CI pipeline verde (lint + build + testes)
- [ ] Database schema validado (Drizzle migrations ok)
- [ ] Contratos base prontos (ApiSuccess, ApiError, OperationRef)
- [ ] 60+ commits de qualidade
- [ ] Zero vazamento cross-org em testes (QA-001 preliminar)
- [ ] ADRs.md + BLOCKERS.md atualizados

---

## QAs Associados

- **QA-001:** Zero vazamento entre organizações (testes cross-org)
- **QA-009:** Audit logs sem segredo ou transcrição integral
- **QA-010:** Webhook validado antes de mudar estado
- **Bloqueador:** Zero débito técnico em M0 que comprometa M1

---

## Skills Necessários

1. **`superpowers:writing-plans`** — Manter roadmap desdobrado
2. **`code-review`** — Revisar PRs críticos
3. **`sc:document`** — Manter CODEX/MATRIX/ADRs atualizados
4. **`superpowers:requesting-code-review`** — Formal review antes de gates

---

## Critério de Aceite

✅ **A00 terminou quando:**
- Nenhum agente fica bloqueado por A00 > 2 horas
- Roadmap reflete estado REAL, não desejo
- PRs críticos têm review explícito
- Gates validados com checklist objetivo
- Documentação (CODEX/MATRIX/ADRs/BLOCKERS) sincronizada com código
- Transição para A01-A10 é clara em cada marco

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| A00 vira gargalo | 🔴 Alta | Delegar PRs review para A09 (segurança) |
| Bloqueador PEND atrasa | 🟡 Média | Ativar plano B em BLOCKERS.md, notificar usuário |
| Decisão ADR contestada | 🟡 Média | Documentar dissent em ADRs.md, não voltar atrás |
| Gate falha no meio | 🔴 Alta | **Bloqueia avanço de fase** — investigar com agente responsável |

---

**Próximo passo:** Leia M0-M6-ROADMAP.md + MATRIX.md, distribua issues para A01-A10, comece M0-001 amanhã.

**Última atualização:** 2026-10-11 · **Owner:** A00 · **Status:** Pronto para Execução
