# M0-M6-ROADMAP: Backlog Desdobrado em Issues Sequenciadas

**Versão 1.0** · 2026-10-11 · Status: Phase 2 (Orquestração) · Owner: A00 (Coordenador)

Desdobra as 6 fases do roadmap (CODEX.md § 07-ROADMAP-E-BACKLOG.md) em 45 issues numeradas (BK-001 a BK-045), com dono, dependências, duração e critério de aceite. M6 é tratado como backlog P1 aberto (equipe expandida), sem numeração fixa — ver seção final.

**Nota de reconciliação:** a sessão anterior citou "60+ issues" para M0 em BRIEF-A00.md; esse número estava inflado. O backlog real de M0 é BK-001 a BK-010 (10 issues). BRIEF-A00.md deve ser corrigido para refletir este documento como fonte da verdade.

---

## Legenda

- **Dono:** agente(s) responsável(is) pela implementação
- **Depende de:** issues ou gates que precisam estar prontos antes de iniciar
- **Duração:** estimativa em dias-pessoa, não dias de calendário corrido
- **Critério de aceite:** condição objetiva e testável de "feito"

---

## M0 — Bootstrap, Contratos, CI (7 dias) · Gate G0

| ID | Título | Dono | Depende de | Duração | Critério de aceite |
|---|---|---|---|---|---|
| BK-001 | Criar repo GitHub privado + estrutura monorepo pnpm | A00, A10 | PEND-002 resolvido | 0.5d | Repo existe, `pnpm install` roda limpo, workspaces configurados |
| BK-002 | Scaffolding `apps/web` (Next.js 16 App Router + TS strict) | A03, A10 | BK-001 | 1d | `pnpm dev` serve página em branco; typecheck e lint passam |
| BK-003 | Scaffolding `apps/worker` (Node + pg-boss) | A07, A10 | BK-001 | 0.5d | Worker conecta no Postgres local e processa job de teste |
| BK-004 | Definir `packages/contracts` (ApiSuccess, ApiError, OperationRef) | A04 | BK-001 | 1d | Tipos exportados, usados por `apps/web` e `apps/worker` sem erro de build |
| BK-005 | Schema Drizzle base (organizations, organization_members, users) | A06 | BK-001 | 1.5d | Migration roda; FK composta `organization_id` obrigatória em tabelas de domínio |
| BK-006 | Config Auth.js (sessão, provider credentials) | A06 | BK-004 | 1d | Login de teste gera sessão válida; sem segredo exposto ao client |
| BK-007 | CI pipeline (GitHub Actions: lint, typecheck, build, test) | A10 | BK-002, BK-003 | 1d | Pipeline roda em <5 min e falha corretamente em PR com erro introduzido de propósito |
| BK-008 | Docker Compose local (Postgres + app + worker) | A10 | BK-005 | 0.5d | `docker compose up` sobe stack completa sem erro |
| BK-009 | Testes cross-org preliminares (QA-001 esqueleto) | A06, A08 | BK-005 | 1d | Teste automatizado prova que query sem `organization_id` falha/é rejeitada |
| BK-010 | ADRs + BLOCKERS sincronizados com estado real do bootstrap | A00 | BK-001 a BK-009 | 0.5d | ADRs.md/BLOCKERS.md refletem decisões efetivamente tomadas no código |

**Gate G0:** stack aprovada ✓ repo autorizado ✓ CI verde ✓ schema base validado ✓ contratos compilam em `apps/web` e `apps/worker`.

---

## M1 — Auth, Tenancy, Shell, Tenant Guards (10 dias) · Gate G1

| ID | Título | Dono | Depende de | Duração | Critério de aceite |
|---|---|---|---|---|---|
| BK-011 | Fluxo de login completo (UI-01) | A03, A06 | G0 | 1.5d | Login/logout funcional; erro de credencial mostra mensagem pt-BR clara |
| BK-012 | Seleção/troca de organização (UI-02) | A03, A04 | BK-011 | 1.5d | Troca de org limpa cache de query (QA-005); URL reflete `orgSlug` |
| BK-013 | RBAC: 7 papéis com matriz de permissões (FR-001/002/003) | A01, A06 | BK-005 | 2d | Cada papel testado nega ação fora de escopo; matriz documentada em `docs/product` |
| BK-014 | Tenant guard middleware (toda query exige `organization_id`) | A04, A06, A09 | BK-013 | 2d | QA-001/002 passam: dois tenants, zero vazamento, em teste automatizado |
| BK-015 | Revogação de membro bloqueia próxima ação (QA-003) | A04, A06 | BK-014 | 1d | Sessão de membro revogado é invalidada na próxima requisição, não só no próximo login |
| BK-016 | Shell de navegação autenticado (sidebar, header, org switcher) | A02, A03 | BK-012 | 1.5d | Shell navegável em desktop e mobile (QA-016); acessível por teclado |
| BK-017 | Onboarding assistido retomável (FR-004/005, UI-02) | A01, A03, A04 | BK-013 | 2d | Estado de onboarding persiste entre sessões; reload não perde progresso (QA-004) |
| BK-018 | Security review do fluxo de auth/tenancy | A09 | BK-011 a BK-017 | 1.5d | Zero achado OWASP P0; segredos confirmados server-only |

**Gate G1:** login + organização + tenant guards + QA-001/002/003 verdes ✓ shell navegável ✓ onboarding retomável.

---

## M2 — Agentes, Labs, Conhecimento TEXT/DOCUMENT (14 dias) · Gate G2

| ID | Título | Dono | Depende de | Duração | Critério de aceite |
|---|---|---|---|---|---|
| BK-019 | Adaptador GPT Maker: client HTTP tipado (stub + 72 operações mapeadas) | A05 | G1 | 2.5d | Todas as 72 operações de API-MATRIX.md mapeadas ou rejeitadas com razão documentada |
| BK-020 | Capabilities por organização/canal (DEC-008) | A05, A04 | BK-019 | 1.5d | UI só libera ação se capability homologada (QA-011) |
| BK-021 | CRUD de agentes (listar, criar, editar, ativar/inativar) (FR-006/007/008, UI-07/08/09) | A04, A03 | BK-019 | 2.5d | CRUD completo com testes negativos cross-org |
| BK-022 | Laboratório de teste isolado (FR-009, UI-10) | A03, A05 | BK-021 | 2d | Mensagens de teste não vazam para canais reais nem para outra organização |
| BK-023 | Conhecimento TEXT — upload e processamento (FR-010, UI-11) | A07, A04 | BK-021 | 2d | Upload duplicado (duplo clique) não cria duas sources (QA-012) |
| BK-024 | Conhecimento DOCUMENT — upload e processamento (FR-011, UI-12) | A07, A04 | BK-023 | 2d | Estado de training coeso: PROCESSING → READY ou FAILED, nunca travado (QA-013) |
| BK-025 | Worker: job handlers de sync agente/treinamento | A07 | BK-003, BK-021 | 2d | Retry idempotente; teste injeta timeout/duplicação sem duplicar efeito |
| BK-026 | UX: estados de loading/error/empty/conflict nos componentes de agente e conhecimento | A02, A03 | BK-021, BK-023 | 1.5d | Todos os estados têm wireframe e implementação correspondente, sem dado falso |
| BK-027 | Testes E2E: criar agente → treinar → testar no labs | A08 | BK-022, BK-024 | 2d | Jornada completa roda verde em Playwright, incluindo mobile |
| BK-028 | Security review do adaptador e pipeline de treinamento | A09 | BK-019 a BK-025 | 1.5d | Sem credencial GPT Maker em código; logs de treinamento sem conteúdo integral (QA-009) |

**Gate G2:** agentes/conhecimento integrados ✓ labs funciona com mock e com adapter real ✓ capabilities documentadas.

---

## M3 — Canais, Inbox, Handoff, Envio (18 dias) · Gate G3

| ID | Título | Dono | Depende de | Duração | Critério de aceite |
|---|---|---|---|---|---|
| BK-029 | Conexão de canal piloto (FR-023/024, UI-15) | A05, A07 | G2 | 2.5d | Canal real conectado em staging; webhook registrado e validado (QA-010) |
| BK-030 | Webhook receiver + validação por releitura autenticada | A07, A09 | BK-029 | 2d | Webhook nunca muda estado sem releitura confirmada na API GPT Maker |
| BK-031 | Inbox: listar e deduplicar chats (FR-015, UI-04) | A04, A03 | BK-029 | 2.5d | Fila deduplicada e ordenada por regra definida (QA-006) |
| BK-032 | Assumir/devolver chat com atribuição exclusiva (FR-016, UI-05) | A04, A07 | BK-031 | 2d | Duplo clique de dois atendentes gera conflito visível, não dois donos (QA-014) |
| BK-033 | Envio de mensagem textual com outbox assíncrono (FR-018, UI-05) | A04, A07 | BK-032 | 2.5d | OUTCOME_UNKNOWN tratado como estado de primeira classe, sem retry cego (QA-007) |
| BK-034 | Reconciliação de OUTCOME_UNKNOWN (worker job) | A07 | BK-033 | 2d | Job de reconciliação resolve ou confirma outcome em até N minutos, testado com atraso/out-of-order (QA-008) |
| BK-035 | Contatos: listagem e vínculo com chats (FR-021, UI-14) | A04, A03 | BK-031 | 1.5d | Contato único por canal+organização, sem duplicação cross-org |
| BK-036 | Handoff entre atendentes com histórico preservado | A04, A03 | BK-032 | 2d | Histórico de conversa não se perde na troca de atendente |
| BK-037 | Testes E2E: canal real → inbox → assumir → enviar → handoff | A08 | BK-033, BK-036 | 2d | Jornada completa roda verde, incluindo cenário de OUTCOME_UNKNOWN simulado |
| BK-038 | Security review de canais e webhooks | A09 | BK-029 a BK-034 | 1.5d | Assinatura de webhook validada; `organization_id` presente em toda mensagem (QA-020) |

**Gate G3:** canal piloto recebe mensagem real ✓ webhook testado ✓ inbox/handoff/envio operacionais em staging.

---

## M4 — Relatórios, Operação, Dashboard (10 dias) · Gate G4

| ID | Título | Dono | Depende de | Duração | Critério de aceite |
|---|---|---|---|---|---|
| BK-039 | Dashboard básico (volume, fila, saúde) (FR-026, UI-03) | A04, A03 | G3 | 2.5d | Métricas agregadas por fuso e período claro (QA-021), sem dados falsos |
| BK-040 | Relatórios agregados (volume, fila, duração) (UI-17) | A04, A01 | BK-039 | 2d | Relatório exportável reflete dados reais de staging, não mock |
| BK-041 | Auditoria e `/ops` (FR-033/034/035/036, UI-21/22) | A04, A09 | BK-039 | 2.5d | Audit logs sem segredo ou transcrição integral (QA-009); ações sensíveis rastreadas por correlação |
| BK-042 | Exclusão assistida de organização/dados (FR-036, UI-20) | A04, A09 | BK-041 | 2d | Exclusão exige confirmação explícita e é auditada; não deixa dado órfão cross-org |

**Gate G4:** inbox/handoff/envio operacional ✓ dashboard mostra métricas reais ✓ auditoria completa.

---

## M5 — QA Completa, Segurança, Piloto (14 dias) · Gate G5

| ID | Título | Dono | Depende de | Duração | Critério de aceite |
|---|---|---|---|---|---|
| BK-043 | Cobertura QA-001 a QA-021 completa + relatório de cobertura | A08 | G4 | 4d | Bloqueadores (QA-001/002/003) 100%; P0 ≥80% de cobertura |
| BK-044 | Exercício de backup/restore + runbook de operação | A10, A08 | BK-043 | 3d | Restore testado recupera dados e auditoria sem perda (QA-018) |
| BK-045 | Piloto com organização real: checklist GO/NO-GO final | A00, A08, A09 | BK-043, BK-044 | 4d | Todos os itens do GO-NO-GO.md aprovados; piloto roda 48h sem incidente P0 |

**Gate G5:** QA completa ✓ backup/restore exercitado ✓ suporte definido ✓ piloto aprovado.

---

## M6 — P1: Automações, Integrações, Expansão (21 dias) · Sem gate fixo

M6 não tem backlog numerado fixo — é alimentado pelo aprendizado do piloto (M5) e por FRs P1/P2 ainda não detalhados nas specs originais. Ao entrar em M6:

1. A01 reabre `docs/product/*` e prioriza FRs P1 com base em feedback real do piloto.
2. A00 cria BK-046+ sob demanda, seguindo o mesmo formato desta tabela.
3. Equipe expandida — M6 assume que mais agentes/pessoas entram além dos 11 originais.

---

## Resumo de Paralelismo

```
M0 (A00,A10,A04,A06,A08) ──▶ G0
                               │
M1 (A03,A04,A06,A08,A09) ──▶ G1
                               │
       ┌───────────────────────┤
M2 (A05,A04,A07,A03,A02,A08) │
       └───────────────────────┤
                               ▼ G2
M3 (A05,A07,A04,A03,A08,A09) ──▶ G3
                               │
M4 (A04,A01,A08) ──────────────▶ G4
                               │
M5 (A08,A09,A00) ──────────────▶ G5
                               │
M6 (equipe expandida) ─────────▶ backlog aberto
```

A03+A04 trabalham em paralelo dentro de cada fase (frontend/backend), com A08/A09 revisando continuamente — não esperam o fim da fase para começar a testar/revisar.

---

**Última atualização:** 2026-10-11 · **Owner:** A00 (Coordenador) · **Status:** Phase 2 (Orquestração)
