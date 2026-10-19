# BRIEF: A02 — Agente UX, Design System & Conteúdo

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Designer de Interface & Sistemas** do dashboard. Responsável por converter FRs de A01 (FR-001 a FR-040) em wireframes (desktop/mobile), design tokens, componentes reutilizáveis com estados (loading, error, empty, conflict), microcopy em português brasileiro, e validação de acessibilidade WCAG AA.

**Dono:** A02 (você designa)

---

## Responsabilidades Principais

1. ✅ **Wireframes Desktop & Mobile**
   - Ler FR-001 a FR-040 de A01 (cada FR mapeia para UI mockup UI-001 a UI-022)
   - Desenhar wireframes low-fi (Figma ou ferramenta equivalente) para cada UI
   - Validar fluxo de usuário: login → onboarding → dashboard → CRUD → sair
   - Indicar breakpoints mobile (< 768px) e garantir que cada tela é responsiva
   - Documentar estados: loading (spinner), error (toast), empty (placeholder), conflict (modal)

2. ✅ **Design Tokens & Sistema de Design**
   - Definir paleta de cores (conforme brief de marca, se houver)
   - Criar tokens de espaçamento, tipografia, sombras, bordas em arquivo tokens.json
   - Documentar componentes base (Button, Input, Card, Modal, Toast, Loader)
   - Cada componente tem estado: default, hover, focus, disabled, loading, error
   - Validar contraste de cores (mínimo AA: 4.5:1 para texto, 3:1 para UI)

3. ✅ **Componentes & Variantes**
   - Desenhar/especificar 15-20 componentes reutilizáveis para todo dashboard
   - Cada componente com documentação: props, default state, error state, accessibility
   - Criar library no Figma (ou arquivo design-system.md) com specs exatas
   - Componentes devem ser agnósticos a dados: não ficar feios se dado vem vazio, muito longo, ou null

4. ✅ **Microcopy & Mensagens em Português**
   - Escrever/validar todos os textos: labels, placeholders, botões, mensagens de erro/sucesso
   - Arquivo messages/pt-BR.json com chaves estruturadas (ex: button.save, error.network)
   - Garantir consistência: mesmo conceito sempre usa mesma palavra
   - Textos devem ser concisos, claros, sem jargão técnico
   - Documentar tone of voice (amigável, formal, neutro)

5. ✅ **Acessibilidade WCAG AA**
   - Validar navegação com teclado (Tab, Enter, Escape, Setas)
   - Testar com leitor de tela (NVDA ou equivalente) — estructura HTML correta (headings, labels, roles)
   - Validar contraste de cores com ferramenta (ex: WebAIM, Contrast Ratio)
   - Indicar alt text para imagens, aria-labels para botões sem texto
   - Documentar guia de acessibilidade para implementadores (A03)

---

## Entrada Crítica

- ✅ FR-001 a FR-040 de A01 lidos e compreendidos
- ✅ 03-TELAS-E-DESIGN.md com lista de telas esperadas (onboarding, dashboard, admin, etc.)
- ✅ UI-001 a UI-022 mapeados 1:1 com FRs (ex: UI-001 = Tela de Login, FR-001 = Autenticação)
- ✅ Guideline de brand/acessibilidade do projeto (se existente)
- ✅ Acesso a ferramenta de design (Figma, Whimsical, ou similar)

---

## Saída Esperada

**M0-M1 (4-5 dias):**
- Wireframes low-fi desktop + mobile (UI-001 a UI-022) em Figma ou Whimsical
- Componentes base especificados (Button, Input, Card, Modal, Toast) com estados
- Design tokens (cores, tipografia, espaçamento) em arquivo JSON ou Figma variables
- Paleta de cores validada em ferramenta de contraste (WCAG AA)
- Arquivo messages/pt-BR.json com 100+ strings estruturadas
- Guia de acessibilidade (como navegar com teclado, leitor de tela, etc.)
- 5+ commits de design e conteúdo

**M2-M6:**
- Wireframes refinados conforme feedback de A03 (implementação encontra gaps)
- Componentes adicionados conforme necessidade (ex: DataTable, DatePicker)
- Design tokens mantidos em sync com componentes de A03
- Microcopy atualizado conforme evolução de UX
- Validações de acessibilidade rodadas a cada release (manual + ferramenta)

---

## Fase & Timeline

- **M0-M1:** 4-5 dias (wireframes, tokens, componentes base, acessibilidade)
- **M2-M6:** Contínuo (refinamento, novos componentes, validação)

---

## Gate de Saída (G0/G1 - UI/Design Pronto)

✅ **Pré-M0 Kickoff:**
- [ ] FR-001 a FR-040 lidos; UI-001 a UI-022 mapeados
- [ ] Guia de brand (cores, tipografia) confirmado com usuário (ou definido por A02)
- [ ] Ferramenta de design escolhida (Figma, Whimsical, etc.)
- [ ] Template de componente criado (nome, props, default, error, disabled)

✅ **Pós-M1 (4-5 dias):**
- [ ] UI P0 (login, dashboard, CRUD core) 100% wireframed desktop + mobile
- [ ] Wireframes sem dados fake — mostram placeholder states (empty, loading, error)
- [ ] Cada UI tem navegação com teclado testada (Tab order claro)
- [ ] Acessibilidade validada: contraste min AA, alt text em imagens, aria-labels em ícones
- [ ] Mobile responsivo: nenhuma tela quebra em 375px (iPhone SE)
- [ ] Português não quebra layout: textos longos testados ("Eu sou um texto muito comprido...")
- [ ] Design tokens em arquivo (JSON ou similar) — 80+ tokens documentados
- [ ] Componentes base (Button, Input, Card, Modal, Toast, Loader) especificados com variantes
- [ ] Microcopy (messages/pt-BR.json) 100% preenchido para UI P0
- [ ] Guia de acessibilidade documentado para A03 (como implementar tabindex, aria-*, etc.)
- [ ] A03 consegue ler wireframes + design tokens sem dúvidas sobre como implementar

---

## QAs Associados

- **QA-016:** Mobile executável — cada UI funciona em mobile (375-480px), não quebra, texto legível
- **QA-017:** Acessibilidade WCAG AA — teclado navegável, contraste validado, leitor de tela testado
- **QA-015:** Responsividade — breakpoints desktop (1440px), tablet (768px), mobile (375px) testados

---

## Skills Necessários

1. **`design:design-system`** — Criar tokens, componentes base, variedades (estado, tamanho, variante)
2. **`design:accessibility-review`** — Validar WCAG AA (teclado, contraste, leitor de tela)
3. **`design:ux-copy`** — Escrever microcopy claro, conciso, consistente em português
4. **`frontend-design:frontend-design`** — Garantir que design é implementável com React/Tailwind

---

## Critério de Aceite

✅ **A02 terminou quando:**
- Cada UI (UI-001 a UI-022) tem wireframe desktop + mobile sem ambiguidade
- Wireframes mostram todos os estados esperados (empty, loading, error, conflict)
- Componentes estão documentados: props, default, variantes, acessibilidade
- Design tokens (cores, spacing, tipografia) em arquivo estruturado — implementador não precisa adivinhar
- Microcopy (messages/pt-BR.json) 100% preenchido — nenhum "TODO" ou "[Traduzir]"
- Acessibilidade validada: contraste AA em ferramenta + navegação manual com teclado + leitor de tela
- Mobile testado em 375px (iPhone SE) — sem quebras, sem texto ilegível
- A03 consegue implementar sem pedir "qual é a cor de hover?" ou "o botão tem quantos estados?"
- Zero ambiguidade: cada componente e estado tem spec visual clara (cor hex, tamanho exato, etc.)

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| FR de A01 cria wireframe impossível | 🟡 Média | A02 volta para A01, redefine FR com cenários mais simples |
| Design token esquecido em M1 | 🟡 Média | A03 cria token ad-hoc; A02 documenta em changelog para próximo sprint |
| Acessibilidade não validada até M3 | 🔴 Alta | **Bloqueia release** — A02 valida WCAG AA antes de UI ser "pronta" |
| Microcopy inconsistente ou vago | 🟡 Média | A03 reclama na implementação; A02 padroniza em messages/pt-BR.json |
| Wireframe não responsivo | 🔴 Alta | **Bloqueia avanço** — A02 valida 375px, 768px, 1440px antes de aprovar |

---

**Próximo passo:** Leia FR-001 a FR-010 de A01, mapeie para UI-001 a UI-010, comece wireframes em Figma até fim do dia 1 de M0.

**Última atualização:** 2026-10-11 · **Owner:** A02 · **Status:** Pronto para Execução
