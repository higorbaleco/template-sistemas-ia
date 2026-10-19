# BRIEF: A01 — Agente de Produto & Requisitos

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Transformador de Objetivos em Requisitos** do dashboard. Responsável por decompor escopo aprovado em 40 requisitos funcionais (FR-001 a FR-040), definir cenários de aceite (Dado/Quando/Então), priorizar por P0/P1/P2, mapear papel/ação, e manter matriz CODEX atualizada conforme refinamento de A02-A06.

**Dono:** A01 (você designa)

---

## Responsabilidades Principais

1. ✅ **Decomposição de Requisitos Funcionais**
   - Ler 02-REQUISITOS.md + escopo P0/P1/P2 de A00
   - Escrever FR-001 a FR-040 em formato de issue GitHub (título + descrição estruturada)
   - Validar que cada FR mapeia 1:1 com UI mockup de A02
   - Desambiguar casos limítrofes (orgs vs usuários, viewer vs editor, draft vs live)

2. ✅ **Cenários de Aceite & Testes**
   - Escrever cada FR com formato Dado/Quando/Então (Gherkin)
   - Incluir cenários Happy Path, Sad Path (erro, timeout, conflito)
   - Mapear cada FR a QA-001 a QA-017 quando aplicável
   - Validar que QA testar exatamente este comportamento

3. ✅ **Matriz Papel/Ação & Permissões**
   - Atualizar matriz 12x40 (12 papéis × 40 FRs)
   - Cada célula: Permitido (sim/não) + Razão de segurança
   - Documentar pilares de autorização (org-level, tenant-level, feature flag)
   - Validar que A04 consegue implementar matriz sem ambiguidade

4. ✅ **Priorização & Sequência**
   - Classificar FR como P0 (launch), P1 (M1), P2 (M2+)
   - Indicar bloqueador (A01 FR-005 bloqueia A02 FR-007)
   - Sequenciar issues de forma que A03 consiga rotear com FRs prontos em M0
   - Manter lista de fora de escopo (will-not-fix) com justificativa

5. ✅ **Refinamento & Evolução Contínua**
   - Ler feedback de A02 (wireframes expõem buracos em FR)
   - Atualizar FR quando A04 reporta impossibilidade técnica
   - Documentar mudanças em CHANGELOG-FR.md
   - Validar comque A01 fecha ambiguidade, não cria mais

---

## Entrada Crítica

- ✅ 02-REQUISITOS.md lido e compreendido pelo menos 2x
- ✅ Escopo P0/P1/P2 aprovado por A00 e usuário
- ✅ CODEX.md com 11 specs de referência consolidadas
- ✅ MATRIX.md com 12 papéis definidos (Admin Org, Usuário Padrão, etc.)
- ✅ Acesso a issue template de GitHub com campos obrigatórios

---

## Saída Esperada

**M0 (3-4 dias):**
- 40 issues (FR-001 a FR-040) criadas em GitHub com descrição estruturada
- Cada FR com cenários Dado/Quando/Então mínimo 3 cenários por FR
- Matriz papel/ação 12x40 preenchida 100%
- Lista de fora de escopo documentada e aprovada
- 5 commits de refinamento de FR

**M1-M6:**
- FR refinado conforme feedback de A02 (wireframes)
- Bloqueadores documentados em BLOCKERS.md
- CHANGELOG-FR.md atualizado a cada sprint
- Matriz papel/ação mantida sincronizada com código
- QA valida cada FR contra cenários definidos

---

## Fase & Timeline

- **M0:** 3-4 dias (decomposição + cenários)
- **M1-M6:** Contínuo (refinamento + validação)

---

## Gate de Saída (G0 - Requisitos Prontos)

✅ **Pré-M0 Kickoff:**
- [ ] 02-REQUISITOS.md lido e resumido em 1 página
- [ ] Escopo P0/P1/P2 aprovado por escrito (A00 ou usuário)
- [ ] 12 papéis da MATRIX.md mapeados para cada FR
- [ ] Template de issue GitHub com campos: FR ID, Cenários, Papel/Ação, Bloqueia/Bloqueado

✅ **Pós-M0 (3-4 dias):**
- [ ] 40 issues (FR-001 a FR-040) criadas e visíveis em GitHub
- [ ] Cada FR P0 cita UI mockup de A02 por referência (ex: UI-001)
- [ ] Cada FR tem mínimo 3 cenários Dado/Quando/Então
- [ ] Matriz papel/ação 12x40 100% preenchida com Permitido/Razão
- [ ] Zero ambiguidade: "se fulano tem org-level admin, pode X?" tem resposta clara
- [ ] Lista de fora de escopo revisada e aprovada por A00
- [ ] A02 consegue ler FR-001 a FR-040 sem dúvidas sobre o que desenhar
- [ ] A04 consegue implementar cada FR sem pedir esclarecimento

---

## QAs Associados

- **QA-001:** Vazamento entre organizações — cada FR testa isolamento org-level
- **QA-003:** Revogação de permissão — FR inclui cenários antes/depois de revogação
- **QA-004:** Onboarding retomável — FR documenta estado salvo/retomável em cada etapa
- **QA-002:** Autenticação e sessão — cada FR assume usuário logado com papel válido

---

## Skills Necessários

1. **`sc:brainstorm`** — Decompor requisito vago em 5+ cenários concretos
2. **`design:ux-copy`** — Escrever cenários em linguagem de negócio, não técnica
3. **`superpowers:test-driven-development`** — Estruturar cenários como testes executáveis
4. **`sc:document`** — Manter CODEX/MATRIZ/CHANGELOG sincronizados

---

## Critério de Aceite

✅ **A01 terminou quando:**
- Nenhum FR deixa dúvida: cada cenário (Dado/Quando/Então) é testável
- Matriz papel/ação não tem célula vazia; cada sim/não tem justificativa
- A02 consegue desenhar UI sem pedir esclarecimento
- A04 consegue rotear/implementar sem pedir esclarecimento
- P0/P1/P2 está claramente marcado; cada P0 entrega valor isolado
- Zero sobreposição entre FRs (FR-005 não duplica FR-003 com nome diferente)
- Cada FR toca exatamente um comportamento; "complexo" vira múltiplos FRs

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| A00 não aprova escopo a tempo | 🔴 Alta | A01 escreve versão rascunho (draft issues) e começa cenários em paralelo |
| A02 desenha UI que não mapeia FR | 🟡 Média | A01 ajusta FR com A02 em daily; documenta dissent em CHANGELOG-FR.md |
| FR cria buracos de segurança | 🔴 Alta | **Bloqueia avanço** — A01 trabalha com A09 (segurança) para redesenhar |
| Ambiguidade não resolvida em M0 | 🟡 Média | A01 marca como PEND em FR, escalation para usuário em weekly |

---

**Próximo passo:** Leia 02-REQUISITOS.md + MATRIX.md, escreva rascunho de FR-001 a FR-010 até fim do dia 1, revise com A00 no final de M0.

**Última atualização:** 2026-10-11 · **Owner:** A01 · **Status:** Pronto para Execução
