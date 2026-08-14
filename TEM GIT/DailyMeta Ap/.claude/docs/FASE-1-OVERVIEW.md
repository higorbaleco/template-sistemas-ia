# 📋 Fase 1: Dashboard Gamificado + Calculadora Invertida

**Status:** 🟡 Planned | **Modelo:** Claude Sonnet 5  
**Data de Criação:** 2026-08-08 | **Escopo:** Dashboard reorg, Gamificação, Calculadora, Charts  
**Fases Posteriores:** 2 (Kanban), 3 (Web Push), 4 (Whisper)

---

## 🎯 Objetivo Geral da Fase 1

Transformar DailyMeta de um MVP "funcional mas genérico" em uma ferramenta **comercial gamificada** com:

1. ✅ **Dashboard mês-cêntrico** — prioriza a meta do mês atual, oferece filtros de histórico.
2. ✅ **Gráficos de verdade** — Recharts em vez de CSS divs (polido, theme-aware, interativo).
3. ✅ **Calculadora Invertida** — entrada: meta + prazos → saída: quanto fazer por dia/semana + simulador "e se?".
4. ✅ **Gamificação completa** — níveis, pontos acumulados, streaks consolidados, 8+ badges, widget Duolingo-style.
5. ✅ **UX otimizada** — reordenação do dashboard por importância/relevância.

**Resultado esperado:** Um usuário abre o app, vê claramente:
- Qual é a meta do mês
- Seu progresso hoje (gauge + tarefas)
- Que streak mantém e nível atingiu (widget gamificado global)
- Quanto precisa fazer por dia pra bater a meta (calculadora)
- Gráficos interativos de histórico

---

## 📦 Componentes Principais (Alto Nível)

| Componente | Arquivo(s) | Tipo | Status |
|------------|-----------|------|--------|
| **Reverse Calculator Engine** | `calc.ts` | Lógica | ✏️ Adicionar |
| **Gamification Data** | `store.ts`, `cloud-sync.ts` | Persistência | ✏️ Adicionar |
| **Achievements & Levels** | `achievements.ts` (NEW) | Lógica | 🆕 Criar |
| **GamificationStrip** | `components/GamificationStrip.tsx` (NEW) | UI | 🆕 Criar |
| **GamificationSheet** | `components/GamificationSheet.tsx` (NEW) | UI | 🆕 Criar |
| **PeriodSelector** | `components/PeriodSelector.tsx` (NEW) | UI | 🆕 Criar |
| **Calculadora Route** | `routes/calculadora.tsx` (NEW) | Página | 🆕 Criar |
| **Charts** | Vários (progresso, index, calculadora) | UI | ✏️ Modificar |
| **Dashboard Reorder** | `routes/index.tsx` | UI | ✏️ Modificar |
| **Period Filtering** | `routes/progresso.tsx` | UI | ✏️ Modificar |

---

## 📐 Arquitetura de Dados

```
┌─ Zustand Store (store.ts)
│  ├─ Goals, Tasks, Executions, Sales, etc (existente)
│  └─ ✨ NEW: badgeUnlocks: BadgeUnlock[]
│
├─ Supabase (cloud-sync.ts)
│  ├─ 8 tabelas normalizadas (existente)
│  └─ ✨ NEW: dm_badges table + serializers
│
└─ Computação (achievements.ts, calc.ts)
   ├─ useLifetimeStats() → {currentStreak, bestStreak, lifetimePoints, level, unlocks}
   ├─ ACHIEVEMENTS[] → {id, name, description, check: fn}
   ├─ goalPaceBreakdown functions → {perDayNeeded per-task}
   └─ whatIfCompletionDate → {projectedDate}
```

---

## 🏗️ Dependências Técnicas

**Já presentes (reusar):**
- React 19, TanStack Start, TanStack React Query, Zustand
- Tailwind v4, Radix UI, shadcn components
- Recharts (instalado mas não usado — vamos ativar)
- date-fns, nanoid, zod
- Supabase (auth + storage + realtime — só storage é novo)

**Novas dependências (avaliar):**
- Nenhuma — tudo feito com stack existente

---

## 📅 Roadmap de Implementação (Sequencial)

### Phase 1.1: Data Layer (Sprint 1)
- [ ] `calc.ts`: +7 funções export (`getMonthBounds`, `resolveCurrentMonthGoal`, breakdown/what-if funcs)
- [ ] `store.ts`: +BadgeUnlock type, +unlockBadge action, round-trip Supabase
- [ ] `cloud-sync.ts`: +dm_badges serializers, select/upsert logic
- [ ] Supabase migration: `add_dm_badges.sql` (manual apply)

### Phase 1.2: Achievements (Sprint 1)
- [ ] `achievements.ts` (NEW): ACHIEVEMENTS catalog, useLifetimeStats hook
- [ ] Consolidar streaks: delete `computeStreak`, usar `useLifetimeStats().currentStreak` everywhere

### Phase 1.3: Gamification UI (Sprint 2)
- [ ] `ui-store.ts`: +gamificationOpen flag
- [ ] `GamificationStrip.tsx` (NEW): sempre visível, flame + streak + level + bar
- [ ] `GamificationSheet.tsx` (NEW): expandível, nível ring + pontos + badges
- [ ] `AppShell.tsx`: montar strip/sheet, remover Flame chip antigo de index

### Phase 1.4: Filtragem de Períodos (Sprint 2)
- [ ] `PeriodSelector.tsx` (NEW): segmented pills + nav anterior/próximo
- [ ] `progresso.tsx`: rewrite com PeriodSelector + full-history consistency

### Phase 1.5: Charts (Sprint 3)
- [ ] `progresso.tsx` bar chart: REPLACE CSS com Recharts
- [ ] `metas.index.tsx`: ADD sparklines aos cards
- [ ] `routes/index.tsx`: ADD gauge "Mês atual"
- [ ] `metas.index.tsx`: FIX "Nível" chip com valor real

### Phase 1.6: Dashboard Reorder + Calculadora (Sprint 3)
- [ ] `routes/index.tsx`: reorder sections + resolveCurrentMonthGoal
- [ ] `routes/calculadora.tsx` (NEW): route + UI + what-if interativo
- [ ] `progresso.tsx`: final refinement com trajectory chart

---

## 🔍 Padrões de Código (Copiar)

### Bottom-Sheet CRUD Modal (Reusado 3x)
Arquivo: `src/routes/tarefas.tsx` linhas 218-495

```tsx
// Padrão:
// 1. fixed inset-0 z-50 overlay (click fecho)
// 2. absolute bottom-0 bg-card rounded-t-[2rem] sheet
// 3. header (title + X close button)
// 4. form com controlled inputs via useState
// 5. submit handler chama store action

// Uso: GamificationSheet, qualquer nova modal
```

### Chart Component Pattern
Arquivo: `src/components/ui/chart.tsx`

```tsx
// Padrão:
// <ChartContainer config={ChartConfig}>
//   <BarChart data={data}>
//     <ChartTooltip />
//     <Bar dataKey="pct" />
//   </BarChart>
// </ChartContainer>
//
// ChartConfig usa CSS vars --color-<key>
// Tailwind vars disponíveis: --accent, --foreground, --muted-foreground
```

### Store Hook Pattern
Arquivo: `src/lib/store.ts`

```tsx
// Padrão:
// export const useStore = create<State>()(
//   persist(
//     (set, get) => ({
//       someField: initial,
//       someAction: (arg) => set({ ... })
//     }),
//     { name: "key", storage: createJSONStorage(...) }
//   )
// )
//
// Novo hook: useLifetimeStats (não persisted, computed)
```

---

## ✅ Checklist de Implementação

- [ ] **Sprint 1**: Data layer + achievements completas
- [ ] **Sprint 1 validação**: testado cálculo de level, badge unlock, streak
- [ ] **Sprint 2**: UI de gamificação + PeriodSelector
- [ ] **Sprint 2 validação**: GamificationStrip/Sheet renderizam, periodo filtra
- [ ] **Sprint 3**: Charts + Calculadora
- [ ] **Sprint 3 validação**: Recharts interativo, simulador "e se" funciona
- [ ] **Integração**: Todos componentes conectados, sem orphan state
- [ ] **Cloud sync**: badges persistem cross-device (post-migration)
- [ ] **Manual test** checklist (vide `VERIFICATION-CHECKLIST.md`)

---

## 🚀 Como Rodar Após Implementação

```bash
# 1. Instalar deps (se adicionar algo novo)
npm install

# 2. Aplicar migration Supabase (manual)
supabase db push  # ou copiar SQL para Supabase UI

# 3. Dev server
npm run dev

# 4. Testar checklist
# (vide VERIFICATION-CHECKLIST.md)

# 5. Build
npm run build
```

---

## 📌 Links Internos

- **Plano Detalhado**: `/Users/higorplens/.claude/plans/n-o-vou-mexer-em-dreamy-iverson.md`
- **Checklist Manual**: `.claude/docs/VERIFICATION-CHECKLIST.md`
- **Task Specs**: `.claude/docs/TASK-SPECS.md`
- **Data Schema Changes**: `.claude/docs/DATA-SCHEMA.md`
- **Roadmap Fases 2-4**: Roadmap geral do projeto (outro doc)

---

## ⚙️ Judgment Calls (Aprovados)

Todos os 7 judgment calls foram deixados para validação pós-planejamento (pendente aprovação do usuário).

---

**Última atualização:** 2026-08-08  
**Próximo passo:** Validar esta overview com o usuário, prosseguir para TASK-SPECS.md
