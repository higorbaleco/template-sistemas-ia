# 📚 DailyMeta — Fase 1 Documentation

Documentação interna completa para implementação da **Fase 1: Dashboard Gamificado + Calculadora Invertida**.

---

## 📖 Documentos

### 1. **FASE-1-OVERVIEW.md** (Comece aqui)
Visão geral executiva da Fase 1:
- Objetivo geral e componentes principais
- Arquitetura de dados em alto nível
- Roadmap de implementação (sprints)
- Padrões de código para reusar
- Checklist geral de implementação

**Ideal para:** Entender escopo, arquitetura, roadmap

---

### 2. **TASK-SPECS.md** (Detalhes de implementação)
Especificação granular de cada task:
- Sprint 1: Data Layer + Achievements
- Sprint 2: Gamification UI + Period Filtering
- Sprint 3: Charts + Dashboard + Calculadora
- Sprint 4: Integration + Testing

Cada task tem:
- Arquivos para modificar
- Funções/componentes a criar
- Código exemplo (pseudo-code)
- Checkpoints de teste local
- Estimativa de horas

**Ideal para:** Implementar cada task, validar localmente

---

### 3. **DATA-SCHEMA.md** (Modelo de dados)
Todas as mudanças ao schema de dados:
- Tipos novos (`BadgeUnlock`, `LifetimeStats`, `AchievementDef`)
- Updates ao `PersistedState` + Store
- Updates ao Cloud Sync (`cloud-sync.ts`)
- Nova migração Supabase (`dm_badges` table)
- Data flow diagram

**Ideal para:** Entender persistência, sincronização, backward compatibility

---

### 4. **VERIFICATION-CHECKLIST.md** (QA)
Checklist manual para testar cada Sprint:
- S1: Data layer (funções, store, cloud-sync)
- S2: Gamification UI (strip, sheet, period selector)
- S3: Charts e Calculadora
- Integration tests (cross-feature)
- Smoke tests (console, responsive, dark mode)
- Sign-off checklist

**Ideal para:** QA validar após cada Sprint, antes de merge

---

## 🚀 Como Começar

### Fluxo Recomendado

1. **Leia primeiro:** `FASE-1-OVERVIEW.md` (15 min) — entenda o escopo e arquitetura
2. **Implemente:** Siga `TASK-SPECS.md` na ordem sugerida (Sprint 1 → 4)
   - Cada task é ~1-2h de trabalho
   - Teste localmente conforme avança
3. **Valide:** Use `VERIFICATION-CHECKLIST.md` para QA após cada Sprint
4. **Deploy:** Siga etapas de "How to Run" em `FASE-1-OVERVIEW.md`

### Estrutura de Diretório

```
.claude/docs/
├── README.md (este arquivo)
├── FASE-1-OVERVIEW.md (visão geral)
├── TASK-SPECS.md (especificação granular)
├── DATA-SCHEMA.md (modelo de dados)
└── VERIFICATION-CHECKLIST.md (QA)
```

---

## 🎯 Objetivos da Fase 1

✅ Dashboard mês-cêntrico (mostra meta do mês por padrão)  
✅ Gráficos com Recharts (em vez de CSS divs)  
✅ Calculadora Invertida (simule quanto fazer/dia pra bater meta)  
✅ Gamificação completa (níveis, pontos, streaks, badges, widget)  
✅ UX otimizada (reordenação dashboard por importância)

---

## 📋 Componentes Principais

| Componente | Arquivo | Tipo | Status |
|----------|---------|------|--------|
| **Funções de cálculo** | `calc.ts` | +7 funções | ✏️ Adicionar |
| **Achievements** | `achievements.ts` (NEW) | Lógica | 🆕 Criar |
| **GamificationStrip** | `GamificationStrip.tsx` (NEW) | UI | 🆕 Criar |
| **GamificationSheet** | `GamificationSheet.tsx` (NEW) | UI | 🆕 Criar |
| **PeriodSelector** | `PeriodSelector.tsx` (NEW) | UI | 🆕 Criar |
| **Calculadora** | `calculadora.tsx` (NEW) | Página | 🆕 Criar |
| **Charts** | Vários | Recharts | ✏️ Modificar |
| **Dashboard** | `index.tsx` | UI | ✏️ Reordenar |

---

## 🔄 Data Flow

```
┌─── Zustand Store ─────────────────────────┐
│                                            │
│  PersistedState:                          │
│  ├─ goals, tasks, executions, ...        │
│  └─ ✨ badgeUnlocks (NEW)                 │
│                                            │
│  Actions:                                 │
│  ├─ addGoal, updateGoal, deleteGoal      │
│  ├─ addTask, updateTask, deleteTask      │
│  └─ ✨ unlockBadge(id) (NEW)              │
│                                            │
└────────────┬───────────────────────────────┘
             │
             └─→ Zustand Persist Plugin
                  │
                  ├─→ localStorage (immediate)
                  │
                  └─→ Cloud Sync (debounced 500ms)
                       │
                       └─→ Supabase (8 tables, normalized)
                            │
                            └─→ ✨ dm_badges (NEW table)

┌─── useLifetimeStats() Hook ─────────────────────┐
│ (Computed on-demand, never persisted)           │
│                                                  │
│ Inputs: Store slice (goals, tasks, executions)  │
│ Outputs: LifetimeStats {                        │
│   history: DaySummary[],                        │
│   currentStreak: number,                        │
│   lifetimePoints: number,                       │
│   level: number,                                │
│   unlockedBadgeIds: string[],                   │
│   ...                                           │
│ }                                               │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 📊 Estimativa de Esforço

| Sprint | Tasks | Horas |
|--------|-------|-------|
| **1: Data Layer** | 6 | 8-10h |
| **2: Gamification UI** | 6 | 10-12h |
| **3: Charts + Dashboard** | 6 | 12-14h |
| **4: Integration + QA** | | 4-6h |
| **Total** | **18** | **34-42h** |

---

## ✅ Padrões de Código (Reusar)

### Bottom-Sheet CRUD Modal
Arquivo: `src/routes/tarefas.tsx` linhas 218-495

Padrão usado para: AddSheet, TaskCreator, SaleSheet, ProductSheet, e novos: GamificationSheet

### Zustand Store Hook
Arquivo: `src/lib/store.ts`

Padrão usado para: store central, e novo: useLifetimeStats() hook

### Recharts Chart Component
Arquivo: `src/components/ui/chart.tsx`

Padrão usado para: ChartContainer + ChartConfig, aplicar em progresso bar, sparklines, gauge, trajectory

---

## 🐛 Debugging

### Como debugar store mutations:
```javascript
// DevTools Console
import { useStore } from '@/lib/store';
const store = useStore.getState();
console.log(store); // inspect all state
store.unlockBadge("streak_7"); // test action
```

### Como debugar achievements:
```javascript
import { useLifetimeStats, ACHIEVEMENTS } from '@/lib/achievements';
const stats = useLifetimeStats();
console.log(stats); // lifetime stats
console.log(ACHIEVEMENTS.filter(a => a.check(stats))); // which badges should unlock
```

### Como debugar cloud-sync:
```javascript
// Check Supabase dashboard → SQL Editor
SELECT * FROM public.dm_badges WHERE device_id = 'YOUR_DEVICE_ID';
```

---

## 🚀 Deployment Steps

### Pre-Deploy

1. ✅ All tasks implemented (Sprints 1-4)
2. ✅ Verification checklist passed
3. ✅ No console errors
4. ✅ Tested on mobile + desktop

### Deploy

```bash
# 1. Apply Supabase migration (if not already)
supabase db push

# 2. Build
npm run build

# 3. Test production build locally
npm run preview

# 4. Deploy to hosting
# (via Vercel, Netlify, Railway, etc)
```

### Post-Deploy

1. ✅ QA in production environment
2. ✅ Monitor error tracking (if configured)
3. ✅ Collect user feedback
4. ✅ Plan Fase 2 (Kanban)

---

## 📌 Important Notes

- **No breaking changes:** Users with existing data get `badgeUnlocks: []` on first load — no data loss
- **Judgment calls approved:** All 7 judgment calls have been documented in plan for post-implementation review
- **Fases 2-4:** Kanban, Web Push, Whisper are OUT-OF-SCOPE for Fase 1
- **Backward compatible:** Old localStorage format still valid, new fields default to empty/zero

---

## 🔗 External Resources

- **Recharts Docs:** https://recharts.org/
- **TanStack Router:** https://tanstack.com/router/latest
- **Zustand:** https://github.com/pmndrs/zustand
- **Tailwind v4:** https://tailwindcss.com/
- **Supabase:** https://supabase.com/docs

---

## 📞 Contact / Questions

For questions during implementation:
1. Refer to relevant doc (TASK-SPECS for granular details)
2. Check Verification Checklist for expected output
3. Review Data-Schema for model changes
4. Look at padrões de código for existing patterns to copy

---

## 📝 Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-08-08 | Initial documentation | Claude Sonnet 5 |

---

**Status:** 🟡 Ready for Implementation  
**Last Updated:** 2026-08-08  
**Next Phase:** Fase 2 (Kanban)
