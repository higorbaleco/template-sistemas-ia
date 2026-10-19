# BRIEF: A03 — Agente Frontend Web

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Responsável** pela implementação de todas as interfaces do painel SaaS. Constrói rotas, componentes reutilizáveis, formulários tipados, tabelas com paginação e polling, cache com React Query, e garante que a troca de organização limpa todo estado client-side. Integra wireframes de A02 com contratos de A04, valida tipos compartilhados, e entrega jornadas Playwright antes de cada marco.

**Dono:** A03 (você designa)

---

## Responsabilidades Principais

1. ✅ **Rotas & Layout Hierarchy**
   - Estruturar `apps/web/src/app/(auth)/` (login, registro, recovery)
   - Criar rotas de aplicação em `apps/web/src/app/app/[orgSlug]/` (dashboard, settings, colaboradores)
   - Implementar layout wrapper com suporte a multi-tenant (orgSlug dinâmico)
   - Validar que rota protegida bloqueia acesso sem token

2. ✅ **Componentes & Design System**
   - Auditar e completar shadcn/ui components (Card, Table, Form, Dialog, Select)
   - Implementar componentes de domínio (OrgSelector, RoleAvatarGroup, StatusBadge)
   - Garantir acessibilidade WCAG 2.1 AA (ARIA labels, keyboard nav, contrast)
   - Revisar que todos os componentes aceitam `className` para Tailwind override

3. ✅ **Formulários & Validação Client**
   - Tipificar todos os formulários com Zod (login, org creation, invite, settings)
   - Mapear schemas de A04 (request/response contracts) com `zod-to-form-data`
   - Implementar loading states, error boundaries, retry lógica
   - Testar duplo clique (QA-015): debounce submit, disable button durante requisição

4. ✅ **React Query & Polling**
   - Definir query keys em `packages/contracts/query-keys.ts` (estrutura aninhada por recurso)
   - Implementar hooks customizados (`useOrganization`, `useMembers`, `useSettings`)
   - Configurar polling automático para dados sensíveis (status de operações via OUTCOME_UNKNOWN)
   - Limpar cache ao trocar organização (`queryClient.clear()` no callback de orgSlug)

5. ✅ **Testes Playwright & Mobile**
   - Escrever jornadas end-to-end (autenticação → navegação → troca org → settings)
   - Validar responsividade em mobile (375px, 768px, 1024px breakpoints)
   - Testar acessibilidade com axe plugin no Playwright
   - Garantir que não haja segredo (API key, token) no bundle final

---

## Entrada Crítica

- ✅ Wireframes de A02 (lofi mockups de todas as telas)
- ✅ Contratos REST de A04 (ApiSuccess, ApiError, endpoints tipados)
- ✅ Componentes shadcn/ui base já importados em `packages/ui/`
- ✅ Schema Drizzle de A06 para validar tipos de dados
- ✅ CODEX.md com FRs de cada rota

---

## Saída Esperada

**M1 (10 dias):**
- Rotas (auth)/login, (auth)/register, app/[orgSlug]/dashboard implementadas
- Componentes básicos (OrgSelector, Table, Form) com testes de acessibilidade
- React Query setup com query keys centralizadas
- Playwright tests para 3 jornadas críticas (login → dashboard, trocar org, settings)

**M2-M3 (14 dias):**
- Todas as rotas secundárias implementadas (colaboradores, settings, audit)
- Tabelas com paginação, sorting, filtering
- Polling automático de OUTCOME_UNKNOWN
- 100% cobertura de acessibilidade (QA-017)

**M4 (7 dias):**
- Cache limpo corretamente ao trocar organização (QA-005)
- Mobile responsivo em todos os breakpoints (QA-016)
- Testes de duplo clique com debounce (QA-015)
- Zero segredo no bundle final

---

## Fase & Timeline

- **M1:** 10 dias (rotas, componentes, React Query setup)
- **M2-M3:** 14 dias (telas completas, acessibilidade, polling)
- **M4:** 7 dias (refinamento, mobile, tests finais)
- **Paralelo com A04:** Interface sempre aguarda endpoints de A04

---

## Gate de Saída (M4)

✅ **Pós-M1:**
- [ ] 3 rotas de autenticação navegáveis
- [ ] Componentes básicos com ARIA labels
- [ ] React Query hooks criados e tipados
- [ ] 3 Playwright tests passando

✅ **Pós-M2:**
- [ ] 8+ rotas implementadas
- [ ] Tabelas com paginação
- [ ] Polling de OUTCOME_UNKNOWN funcional
- [ ] axe audit zero violations em 5 telas principais

✅ **Pós-M3:**
- [ ] Todas as rotas de CODEX.md implementadas
- [ ] QA-017 (acessibilidade) 100%
- [ ] QA-016 (mobile) validado em 3 devices reais
- [ ] Zero props não mapeados; tipos compartilhados com A04

✅ **Pós-M4:**
- [ ] QA-005 (trocar org limpa cache) ✓
- [ ] QA-015 (duplo clique) ✓
- [ ] Bundle sem segredo `npm run build && grep -r "process.env.SECRET" dist/`
- [ ] Todos os 10+ testes Playwright passando em CI
- [ ] Code coverage >75%

---

## QAs Associados

- **QA-005:** Trocar organização limpa queryClient (validar com `queryClient._queryCache.find()`)
- **QA-015:** Duplo clique em botão submit não cria duplicate requests
- **QA-016:** Interface responsiva 375px-1920px, sem horizontal scroll
- **QA-017:** Acessibilidade WCAG 2.1 AA (axe plugin zero violations)

---

## Skills Necessários

1. **Next.js 14+** — App Router, server components, client hooks
2. **Tailwind CSS** — utility-first styling, custom breakpoints
3. **shadcn/ui** — component composition, override via className
4. **React Query v5** — query keys, caching, polling
5. **Zod** — client-side schema validation
6. **Playwright** — end-to-end testing, accessibility audit
7. **TypeScript** — strict types, utility types para contratos

---

## Critério de Aceite

✅ **A03 terminou quando:**
- Nenhuma rota tem props sem tipo ou sem mapeamento em CODEX.md
- Todos os formulários usam Zod com schema espelhado de A04
- React Query hooks são centralizados em `packages/contracts/hooks/`
- Trocar `[orgSlug]` limpa cache imediatamente (teste automático)
- Duplo clique → sem duplicate request (validar em Network tab do Playwright)
- Acessibilidade: axe plugin zero violations em 5 telas críticas
- Mobile: sem horizontal scroll, touch targets ≥44px
- 100% das rotas em CODEX.md navegáveis
- Build final não expõe segredo no bundle

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| A04 atrasa endpoints | 🔴 Alta | Implementar mock com MSW, unblock com contratos Zod de CODEX.md |
| Cache não limpa ao trocar org | 🔴 Alta | **Bloqueia M4** — debug com React Query DevTools, validar `useEffect` em layout root |
| Acessibilidade complexa (datepicker) | 🟡 Média | Usar componente shadcn/ui que já passa axe ou integrar Radix UI |
| Playwright flaky em CI | 🟡 Média | Aumentar timeouts, adicionar `waitForLoadState('networkidle')` |
| Mobile não responsivo | 🟡 Média | Testar em device real (iOS Safari), não só DevTools emulation |

---

**Próximo passo:** Leia wireframes de A02, sincronize contratos com A04 em CODEX.md, crie estrutura de rotas em M1-001.

**Última atualização:** 2026-10-11 · **Owner:** A03 · **Status:** Pronto para Execução
