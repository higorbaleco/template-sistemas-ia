# 📋 Task Specs Detalhadas — Fase 1

**Quebra por Sprint:** Cada task é uma unidade implementável isoladamente + testável localmente.

---

## SPRINT 1: Data Layer + Achievements

### Task 1.1: Funções Calculadora em `calc.ts`

**Arquivos:** `src/lib/calc.ts`

**Adicionar estas exportações:**

1. **`getMonthBounds(anchor = todayISO()): { start: string; end: string }`**
   - Calcula primeiro e último dia do mês calendário do `anchor`
   - Retorna `{ start: "2026-08-01", end: "2026-08-31" }`
   - Usado por: calculadora, dashboard reorder (resolveCurrentMonthGoal), gauge "Mês atual"

2. **`resolveCurrentMonthGoal(goals: Goal[], primaryGoalId?: string, anchor = todayISO()): Goal | undefined`**
   - Calcula qual meta mostrar por padrão (mês-cêntrica)
   - Lógica: (1) se meta pinada é ativa neste mês, retorna; (2) senão retorna meta do mês com endDate mais próxima; (3) senão cai back no behavior antigo (primaryGoal or goals[0])
   - Usado por: index.tsx (Today dashboard)

3. **`goalTaskPaceBreakdown(goal: Goal, tasks: Task[], executions: Execution[]): BreakdownTask[]`**
   ```ts
   type BreakdownTask = {
     taskId: string; taskName: string; unit: string; expectedQty: number;
     qtyPerDayNeeded: number; qtyPerWeekNeeded: number; 
     currentQtyPerDay: number; weight: 1|2|3;
   }
   ```
   - Só retorna array não-vazio se `goal.type === "execution"`
   - Cálculo: `ratio = perDayNeeded / 100`, `qtyPerDayNeeded = task.expectedQty * ratio`
   - `currentQtyPerDay` = média de `taskExecution(task.id, date, executions)` sobre últimos 7 goal-days
   - Usado por: `/calculadora` (tabela de tarefas)

4. **`goalSalesPaceBreakdown(goal: Goal, sales: Sale[], realized: number, pace: ReturnType<typeof goalPace>): SalesBreakdown | null`**
   ```ts
   type SalesBreakdown = { ticket: number; salesPerDayNeeded: number; salesPerWeekNeeded: number; currentSalesPerDay: number }
   ```
   - Só se `goal.type === "financial"`, senão retorna null
   - `ticket = realized / validSalesForGoal(goal, sales).length` (reusar lógica inline do metas.$id.tsx:76)
   - Usado por: `/calculadora` (card de vendas)

5. **`whatIfCompletionDate(goal: Goal, realized: number, hypotheticalDailyRate: number, anchor = todayISO(), maxDays = 730): WhatIfResult`**
   ```ts
   type WhatIfResult = {
     completionDate: string | null; daysNeeded: number; 
     deltaDaysVsDeadline: number; status: "before"|"on"|"after"|"unreachable"
   }
   ```
   - Simula: se eu fizer X por dia, quando termino?
   - Andar dia-a-dia a partir de `anchor`, só acumular em `isGoalDay(goal, date)`, parar quando soma >= remaining
   - Se taxa <= 0 e remaining > 0: `status: "unreachable"`, `completionDate: null`
   - Capear iteração em `maxDays` (segurança)
   - Usado por: `/calculadora` (what-if interativo)

**Testes locais:**
```bash
# Chamar direto em um terminal REPL:
import { getMonthBounds, whatIfCompletionDate } from '@/lib/calc'
// Deve retornar datas válidas, status corretos
```

---

### Task 1.2: Consolidação de Streaks

**Arquivos:** `src/lib/calc.ts`, `src/routes/index.tsx`

**Ações:**

1. **Deletar** `computeStreak` function (`calc.ts` linhas 995-1012)
2. **Deletar** seu único call site em `index.tsx` (linhas 17 import, 97-100 const streak)
3. **Remover** Flame chip antigo de `index.tsx` (linhas 136-143 section que renderiza streak)
   - Isso será substituído por `GamificationStrip.tsx` em Sprint 1.3

**Validação:** grep `computeStreak` em todo src/ deve retornar ZERO matches após esta task.

---

### Task 1.3: Store Gamificação

**Arquivos:** `src/lib/store.ts`

**Adicionar:**

1. **New type:**
   ```ts
   export interface BadgeUnlock {
     id: string;
     badgeId: string;
     unlockedAt: string; // ISO date
   }
   ```

2. **In `PersistedState` interface (line ~140):**
   ```ts
   interface PersistedState {
     // ... existing fields
     badgeUnlocks: BadgeUnlock[];
   }
   ```

3. **In `emptyPersistedState()`:** adiciona `badgeUnlocks: []`

4. **In `normalizePersistedState()`:** adiciona `badgeUnlocks: state?.badgeUnlocks ?? []`

5. **In `getPersistedSnapshot()`:** retorna badgeUnlocks

6. **In `stateToCloud()`:** inclui badgeUnlocks

7. **In `cloudToState()`:** retorna badgeUnlocks

8. **New store action:**
   ```ts
   unlockBadge: (badgeId: string) => {
     const existing = get().badgeUnlocks.some(b => b.badgeId === badgeId);
     if (!existing) {
       set({
         badgeUnlocks: [
           ...get().badgeUnlocks,
           { id: nanoid(), badgeId, unlockedAt: todayISO() }
         ]
       });
     }
   }
   ```

**Testes:** 
- Chamar `useStore.getState().unlockBadge("streak_7")` 2x — deve ser idempotente
- Recarregar page — badgeUnlocks deve persistir em localStorage

---

### Task 1.4: Cloud Sync para Badges

**Arquivos:** `src/lib/cloud-sync.ts`

**Adicionar (espelhando pattern de `dm_time_logs`):**

1. **Serializers:**
   ```ts
   const badgeToRow = (unlock: BadgeUnlock, deviceId: string) => ({
     id: unlock.id, device_id: deviceId, badge_id: unlock.badgeId,
     unlocked_at: unlock.unlockedAt
   })
   
   const rowToBadge = (row: any): BadgeUnlock => ({
     id: row.id, badgeId: row.badge_id, unlockedAt: row.unlocked_at
   })
   ```

2. **In `CloudSnapshot` type:** adiciona `badgeUnlocks: BadgeUnlock[]`

3. **In `loadCloudSnapshot(deviceId)`:** adiciona ao `Promise.all`:
   ```ts
   const badgesResp = await supabase()
     .from("dm_badges")
     .select("*")
     .eq("device_id", deviceId);
   // ... handle error, map via rowToBadge
   ```

4. **In `pushFullSnapshot(deviceId, snap)`:** adiciona upsert:
   ```ts
   const badgesToUpsert = snap.badgeUnlocks.map(b => badgeToRow(b, deviceId));
   await supabase().from("dm_badges").upsert(badgesToUpsert, { onConflict: "id" });
   ```

5. **In `syncDiff` function (lines ~380+):** adiciona bloco analogous ao timeLogs:
   ```ts
   const {added, modified, deleted} = diffCollection(
     old.badgeUnlocks, new.badgeUnlocks, "id"
   );
   if (added.length || modified.length || deleted.length) {
     if (added.length || modified.length) {
       const rows = [...added, ...modified].map(b => badgeToRow(b, deviceId));
       await supabase().from("dm_badges").upsert(rows);
     }
     if (deleted.length) {
       await supabase().from("dm_badges").delete()
         .in("id", deleted.map(b => b.id));
     }
   }
   ```

**Testes:** 
- Supabase não vai ter a tabela até migration rodar (task 1.5), então teste será skip por enquanto
- Após migration: unlock badge, check Supabase UI que row aparece

---

### Task 1.5: Supabase Migration

**Arquivo:** `supabase/migrations/<timestamp>_add_dm_badges.sql` (NEW)

**Conteúdo:** Cria tabela `dm_badges`, espelhando estrutura de outras `dm_*`:

```sql
create table public.dm_badges (
  id text primary key,
  device_id text not null,
  badge_id text not null,
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índice
create index on public.dm_badges(device_id);

-- RLS (lê/escreve tudo — padrão do app)
alter table public.dm_badges enable row level security;

drop policy if exists "dm_badges public access" on public.dm_badges;
create policy "dm_badges public access"
on public.dm_badges
for all
using (true)
with check (true);

-- Trigger de updated_at (padrão)
create or replace function public.update_dm_badges_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_dm_badges_updated_at on public.dm_badges;
create trigger update_dm_badges_updated_at
before update on public.dm_badges
for each row
execute function public.update_dm_badges_updated_at();
```

**Como rodar:** (usuario faz isso manualmente)
```bash
supabase db push
```

Ou copiar SQL direto em Supabase dashboard → SQL Editor.

---

### Task 1.6: Create `achievements.ts`

**Arquivo:** `src/lib/achievements.ts` (NEW)

**Exports:**

1. **`computeLifetimePoints(tasks, executions, goals, sales, measurements, timeLogs): number`**
   - Soma `dailyPoints(tasks, executions, date)` para cada dia desde `getHistoryStartDate(...)` até hoje
   - Cheap, reusar existing calc.ts helpers

2. **`levelFromPoints(points: number): number`**
   - Fórmula: `Math.floor(Math.sqrt(Math.max(0, points) / 50)) + 1`
   - Nota: divisor `50` é guess, precisa tuning

3. **`pointsForLevel(level: number): number`**
   - Inverso: `50 * (level - 1) ** 2`

4. **`levelProgress(points): { level, floor, ceil, pct, pointsToNext }`**
   - Retorna detalhe: em qual nível está, % até próximo nível, quantos pontos faltam

5. **`ACHIEVEMENTS: AchievementDef[]`**
   ```ts
   type AchievementDef = {
     id: string;
     name: string;
     description: string;
     icon: LucideIcon;
     check: (stats: LifetimeStats) => boolean;
   }
   
   // Starter catalog (8 badges):
   ACHIEVEMENTS = [
     { id: "streak_7", name: "Primeira Semana", ... check: stats => stats.bestStreak >= 7 },
     { id: "streak_30", name: "Um Mês Inteiro", ... },
     { id: "streak_100", name: "Centurião", ... },
     { id: "goal_completed", name: "Meta Batida", ... },
     { id: "goals_5", name: "Cinco Vitórias", ... },
     { id: "points_500", name: "Pontuador", ... },
     { id: "consistency_80", name: "Alta Consistência", ... },
     { id: "executions_100", name: "Cem Execuções", ... },
   ]
   ```

6. **`LifetimeStats` type:**
   ```ts
   type LifetimeStats = {
     history: DaySummary[];
     currentStreak: number;
     bestStreak: number;
     consistencyRate: number;
     validDays: number;
     lifetimePoints: number;
     level: number;
     levelPcts: { level, floor, ceil, pct, pointsToNext };
     unlockedBadgeIds: string[];
   }
   ```

7. **`useLifetimeStats(): LifetimeStats` hook**
   - Lê todos os slices necessários via `useStore`
   - Computa:
     - `history = buildDayHistory(goals, tasks, executions, timeLogs, minPct, daysBetween(getHistoryStartDate(...), today) + 1, today)`
     - `buildConsistencyMetrics(history, minPct)` → currentStreak, bestStreak, consistencyRate, validDays
     - `lifetimePoints = computeLifetimePoints(...)`
     - `level = levelFromPoints(lifetimePoints)`
     - `unlockedBadgeIds = store.badgeUnlocks.map(u => u.badgeId)`
   - Retorna `LifetimeStats` object
   - **NÃO persisted** — computed on-demand (muda toda vez que executions/goals mudam)

**Testes:**
```bash
# Chamar diretamente:
const stats = useLifetimeStats();
console.log(stats.level, stats.lifetimePoints, stats.currentStreak);
// Deve refletir dados reais do store
```

---

## SPRINT 2: Gamification UI + Period Filtering

### Task 2.1: UI Store `gamificationOpen`

**Arquivo:** `src/lib/ui-store.ts`

**Adicionar:**
```ts
interface UIState {
  // ... existing
  gamificationOpen: boolean;
  openGamification: () => void;
  closeGamification: () => void;
}

// In create():
gamificationOpen: false,
openGamification: () => set({ gamificationOpen: true }),
closeGamification: () => set({ gamificationOpen: false }),
```

---

### Task 2.2: Create `GamificationStrip.tsx`

**Arquivo:** `src/components/GamificationStrip.tsx` (NEW)

**Props:** none (lê de store)

**Render:**
- Full-width horizontal strip (abaixo do header)
- Conteúdo: flame icon + `{currentStreak}d` label + level pill ("Nv. {level}") + horizontal points-to-next-level bar
- `onClick={() => useUI.getState().openGamification()}`
- Lê `useLifetimeStats()` para streak/level/progress
- **Side effect**: `useEffect` que diffs `ACHIEVEMENTS.filter(a => a.check(stats))` contra `badgeUnlocks` e chama `useStore.getState().unlockBadge(id)` para novos desbloqueios

**Estilos:** Tailwind, rematch "sempre visível" UI de `Sidebar`/`BottomNav` (compacto, leve)

**Testes:**
- Render sem erros
- Click abre sheet (testado em 2.3)
- Side effect desbloqueio funciona (depois de 2.3)

---

### Task 2.3: Create `GamificationSheet.tsx`

**Arquivo:** `src/components/GamificationSheet.tsx` (NEW)

**Props:**
```ts
interface Props {
  open: boolean;
  onClose: () => void;
}
```

**Render** (using exact bottom-sheet pattern from AddSheet/TaskCreator):
```tsx
{open && (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
    <div className="absolute left-0 right-0 bottom-0 bg-card rounded-t-[2rem] safe-bottom">
      <header>
        <h2>Gamificação</h2>
        <button onClick={onClose}><X /></button>
      </header>
      <main className="px-6 pb-6 space-y-6">
        {/* Level ring */}
        <div className="text-center">
          <div className="size-32 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">{stats.level}</p>
              <p className="text-xs text-muted-foreground">Nível</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{stats.levelPcts.pct}% até próximo nível</p>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Pontos" value={stats.lifetimePoints} />
          <Stat label="Streak" value={`${stats.currentStreak}d`} />
          <Stat label="Melhor" value={`${stats.bestStreak}d`} />
        </div>
        
        {/* Badges grid */}
        <div>
          <h3>Conquistas</h3>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {ACHIEVEMENTS.map(badge => {
              const unlocked = stats.unlockedBadgeIds.includes(badge.id);
              return (
                <div key={badge.id} className={`rounded-lg p-3 text-center ${unlocked ? 'bg-secondary' : 'bg-secondary/30 opacity-50'}`}>
                  <badge.icon className="size-6 mx-auto mb-1" />
                  <p className="text-xs font-semibold">{badge.name}</p>
                  {unlocked && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {store.badgeUnlocks.find(u => u.badgeId === badge.id)?.unlockedAt.split('T')[0]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  </div>
)}
```

**Testes:**
- Open/close funciona
- Mostra nível/pontos corretos
- Badges locked vs unlocked têm estilos diferentes

---

### Task 2.4: AppShell Integration + Remove Old Flame

**Arquivo:** `src/components/AppShell.tsx`, `src/routes/index.tsx`

**Em AppShell.tsx:**
1. Import `GamificationStrip` + `GamificationSheet`
2. Adicionar após `</header>`: `<GamificationStrip />`
3. Adicionar com outros overlays (Sidebar, AddSheet): `<GamificationSheet open={gamificationOpen} onClose={closeGamification} />`

**Em index.tsx:**
1. Remover import/consts de `computeStreak` (já deletados em 1.2)
2. Remover Flame chip section (linhas 136-143 eram)
3. Remover `useUI.getState().openSidebar` call from header `right` slot (era `<button onClick={openSidebar}...><Flame />...`)

**Testes:**
- Home page renderiza sem Flame chip antigo
- GamificationStrip visível em todas as páginas
- Click no strip abre sheet
- Sheet fecha on backdrop click

---

### Task 2.5: Create `PeriodSelector.tsx`

**Arquivo:** `src/components/PeriodSelector.tsx` (NEW)

**Props:**
```ts
interface Props {
  value: PeriodKey; // "7d" | "14d" | "30d" | "month"
  onChange: (p: PeriodKey) => void;
  anchor?: string; // ISO date, defaults to today
  onAnchorChange?: (a: string) => void;
  minAnchor?: string; // earliest allowed date
}
```

**Render:**
- Segmented pill row (styled like current trendWindow toggle) com 4 botões: 7d, 14d, 30d, Mês
- Se `onAnchorChange` supplied: prev/next chevrons + range label ("Jan 1 - Jan 7" etc)
- Range computed via `getPeriodRange(value, anchor)` + labels via `periodLabel(value)`

**Testes:**
- Click cada período muda value
- Prev/next shift anchor
- Label atualiza corretamente

---

### Task 2.6: Rewrite `progresso.tsx` Period Integration

**Arquivo:** `src/routes/progresso.tsx`

**Mudanças:**

1. **Replace** hardcoded toggle (linhas 177-182) com `<PeriodSelector value={period} onChange={setPeriod} anchor={anchor} onAnchorChange={setAnchor} />`

2. **Fix consistency stats:** antes computadas em hardcoded 14d, agora:
   - Manter full `useLifetimeStats()` hook call (cria `history` com TODOS os dias)
   - Filtrar `history` por período: `displayDays = history.filter(d => isDateInRange(d.date, ...getPeriodRange(period, anchor)))`
   - Passar full-history `history` (não `displayDays`) para `buildConsistencyMetrics` → currentStreak/bestStreak não ficam capped em 14d

3. **Bug fix:** `buildDayHistory` antes chamado como `buildDayHistory(goals, tasks, executions, timeLogs, minPct, 14)` hardcoded — agora passar `displayDays.length` (ou deixar a full history, filtrar depois)

**Testes:**
- Alterna período, gráfico + stats mudam
- Navega histórico, labels corretos
- Best streak >= 14 agora é possível

---

## SPRINT 3: Charts + Dashboard Reorder + Calculadora

### Task 3.1: Progresso Bar Chart → Recharts

**Arquivo:** `src/routes/progresso.tsx` linhas 185-236

**Substituir** CSS-div bar com:
```tsx
<ChartContainer config={{ pct: { label: "Execução diária", color: "#10b981" } }}>
  <BarChart data={displayDays} onClick={(state) => {
    if (state.activeTooltipIndex !== undefined) {
      setSelectedDay(displayDays[state.activeTooltipIndex].date);
    }
  }}>
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="pct">
      {displayDays.map((day, idx) => (
        <Cell key={idx} fill={day.pct >= minDailyPercent ? "var(--color-accent)" : "rgba(var(--foreground), 0.7)"} />
      ))}
    </Bar>
    <ReferenceLine y={minDailyPercent} strokeDasharray="4 4" stroke="var(--color-accent)" />
  </BarChart>
</ChartContainer>
```

**Deletar** antigas CSS divs (linhas 186-215 aprox)

**Testes:**
- Barra renderiza com cores corretas
- Click abre DayDetailSheet

---

### Task 3.2: Goal Card Sparklines

**Arquivo:** `src/routes/metas.index.tsx`

**Adicionar** entre `<div className="mt-4 h-2 rounded-full">` (linhas 176-181) e `<div className="mt-4 grid grid-cols-2">` (linha 183):

```tsx
<div className="mt-3 h-12">
  <ChartContainer config={{ value: { color: goal.color } }}>
    <AreaChart data={buildGoalDailySeries(goal, tasks, executions, sales, measurements, 7)}>
      <Area dataKey="value" stroke={goal.color} fill={goal.color} fillOpacity={0.1} isAnimationActive={false} />
    </AreaChart>
  </ChartContainer>
</div>
```

**New helper** em `calc.ts`:
```ts
export function buildGoalDailySeries(goal: Goal, tasks: Task[], executions: Execution[], sales: Sale[], measurements: Measurement[], days: number): {date: string, value: number}[] {
  // Para cada um dos últimos `days` dias, compute goalRealized(goal, ...)
  // Retorna array para Recharts Area chart
}
```

**Testes:**
- Sparkline renderiza por goal
- Cor matches goal.color

---

### Task 3.3: Today "Mês Atual" Gauge

**Arquivo:** `src/routes/index.tsx`

**Adicionar** seção nova (será inserida em ordem em 3.5):

```tsx
<section className="px-6 py-5">
  <div className="rounded-[2rem] bg-card p-5 ring-1 ring-border">
    <p className="text-sm text-muted-foreground font-medium">Mês Atual</p>
    <h3 className="text-lg font-semibold mt-1">Consistência do Mês</h3>
    
    <div className="mt-4 h-24">
      <ChartContainer config={{ consistency: { color: "var(--color-accent)" } }}>
        <RadialBarChart data={[{ name: "Dias", value: monthConsistencyPct }]} innerRadius={60}>
          <RadialBar dataKey="value" fill="var(--color-accent)" />
          <text x="50%" y="50%" textAnchor="middle" dy={4} className="text-2xl font-bold fill-foreground">
            {monthConsistencyPct}%
          </text>
        </RadialBarChart>
      </ChartContainer>
    </div>
  </div>
</section>
```

**New helper** em `calc.ts`:
```ts
export function getMonthConsistencyPercent(goals: Goal[], tasks: Task[], executions: Execution[], timeLogs: TimeLog[], minPct: number, anchor = todayISO()): number {
  // Conta quantos dias do mês atual meeting minDailyPercent vs total dias do mês
  // Retorna %
}
```

**Testes:**
- Gauge renderiza
- % atualiza conforme executions mudam

---

### Task 3.4: Metas.index "Nível" Fix

**Arquivo:** `src/routes/metas.index.tsx` linhas 81-86

**Substituir:**
```tsx
<div className="shrink-0 rounded-2xl bg-background/10 px-3 py-2 text-right">
  <p className="text-[10px] uppercase tracking-[0.28em] text-background/55 font-semibold">
    Nível
  </p>
  <p className="text-2xl font-semibold text-accent">{overview.avg}%</p>
</div>
```

**Por:**
```tsx
{(() => {
  const stats = useLifetimeStats();
  return (
    <div className="shrink-0 rounded-2xl bg-background/10 px-3 py-2 text-right">
      <p className="text-[10px] uppercase tracking-[0.28em] text-background/55 font-semibold">
        Nível
      </p>
      <p className="text-2xl font-semibold text-accent">Nv. {stats.level}</p>
    </div>
  );
})()}
```

**Delete** `overview.avg` computation (linhas 60-62) — já não é usado

**Testes:**
- Chip mostra nível real (ex "Nv. 3")
- Level aumenta conforme pontos aumentam

---

### Task 3.5: Dashboard Reorder + ResolveCurrentMonthGoal

**Arquivo:** `src/routes/index.tsx`

**Mudanças:**

1. **Import** `resolveCurrentMonthGoal` from calc.ts
2. **Replace** linha 59: `const primary = resolveCurrentMonthGoal(goals, primaryGoalId) ?? goals[0]`
3. **Update** rótulo "Meta principal" → "Meta do mês" se dynamic (linha ~164-166, na hero card):
   ```tsx
   const isPrimaryMetaAtual = primary?.id === primaryGoalId;
   // render:
   <span className="text-[11px]">{isPrimaryMetaAtual ? "Meta principal" : "Meta do mês"}</span>
   ```

4. **Reorder sections** (remover antiga, inserir nova ordem):
   - KEEP: greeting + date header
   - MOVE: hero goal card (2)
   - **ADD**: mês gauge card (3) [from 3.3]
   - MOVE: progresso diário bar (4) [was 6]
   - MOVE: "Foco de agora" card (5) [was 3]
   - MOVE: "Próxima melhor ação" card (6) [was 4]
   - MOVE: tarefas de hoje (7) [was 7]
   - **ADD**: calculadora teaser card (8) [new]
   - MOVE: indicadores (9) [was 5]
   - MODIFY: 2x2 mini-cards (10) [was 8, remover "Falta" e "Projeção"]
   - KEEP: "Falta pouco" section (11) [was 9]

5. **Calculadora teaser** (novo card a inserir no passo 4.8):
   ```tsx
   <section className="px-6 pb-5">
     <div className="rounded-[2rem] bg-accent/5 p-5 ring-1 ring-border">
       <h3 className="font-semibold mb-2">Simulador de Ritmo</h3>
       <p className="text-sm text-muted-foreground mb-4">Descubra quanto você precisa fazer por dia para alcançar a meta</p>
       <Link to="/calculadora" className="inline-flex items-center gap-1.5 rounded-lg bg-accent text-background px-4 py-2 text-sm font-semibold">
         Abrir Calculadora <ArrowRight className="size-4" />
       </Link>
     </div>
   </section>
   ```

**Testes:**
- Home renderiza em nova ordem
- Meta do mês rótulo correto
- Click em Calculadora navega pra `/calculadora`

---

### Task 3.6: Create `/calculadora` Route

**Arquivo:** `src/routes/calculadora.tsx` (NEW)

**Structure:**

```tsx
export const Route = createFileRoute("/calculadora")({
  head: () => ({ meta: [{ title: "Calculadora — DailyMeta" }] }),
  component: Calculator,
});

function Calculator() {
  const goals = useStore(s => s.goals);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id);
  const goal = goals.find(g => g.id === selectedGoalId);
  
  if (!goal) return <EmptyState />;
  
  const realized = goalRealized(goal, ...);
  const pace = goalPace(goal, realized);
  const [hypotheticalRate, setHypotheticalRate] = useState(pace.perDayNeeded);
  const whatIf = whatIfCompletionDate(goal, realized, hypotheticalRate);
  
  return (
    <AppShell title="Calculadora Invertida">
      <section className="px-6 pt-5 space-y-5 pb-12">
        {/* Goal selector */}
        <div>
          <label>Qual meta?</label>
          <select value={selectedGoalId} onChange={e => setSelectedGoalId(e.target.value)}>
            {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        
        {/* Hero stats */}
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Falta" value={fmtValue(Math.max(0, goal.target - realized))} />
          <Metric label="Dias restantes" value={daysRemaining(goal)} />
          <Metric label="Ritmo necessário" value={`${pace.perDayNeeded}/dia`} />
          <Metric label="Ritmo atual" value={`${pace.perDayCurrent}/dia`} />
        </div>
        
        {/* Breakdown tables */}
        {goal.type === "execution" && (
          <BreakdownTable tasks={goalTaskPaceBreakdown(goal, tasks, executions)} />
        )}
        {goal.type === "financial" && (
          <SalesBreakdown sales={goalSalesPaceBreakdown(goal, sales, realized, pace)} />
        )}
        
        {/* What-if simulator */}
        <div>
          <label>E se eu fizer:</label>
          <input type="number" inputMode="decimal" value={hypotheticalRate} onChange={e => setHypotheticalRate(parseFloat(e.target.value))} />
          <p className="mt-2 text-sm">
            Conclusão projetada: {whatIf.completionDate} 
            ({whatIf.status === "unreachable" ? "Irrealizável" : `${whatIf.deltaDaysVsDeadline > 0 ? "+" : ""}${whatIf.deltaDaysVsDeadline}d vs prazo`})
          </p>
        </div>
        
        {/* Trajectory chart */}
        <TrajectoryChart goal={goal} currentPace={pace.perDayCurrent} neededPace={pace.perDayNeeded} projectedDate={whatIf.completionDate} />
        
        {/* CTA back */}
        <Link to={`/metas/${goal.id}`} className="inline-flex items-center gap-1 px-4 py-2 bg-foreground text-background rounded-lg">
          Ver meta <ArrowRight className="size-4" />
        </Link>
      </section>
    </AppShell>
  );
}
```

**Components to extract:**
- `<BreakdownTable tasks={BreakdownTask[]}/>` — tabela 2-col (tarefa + qty/dia)
- `<SalesBreakdown sales={SalesBreakdown} />` — card com ticket/vendas
- `<TrajectoryChart goal, currentPace, neededPace, projectedDate />` — Recharts `<AreaChart>` ou `<LineChart>` com 2 series

**Testes:**
- Route abre, loads default goal
- Dropdown muda goal
- What-if input muda data projetada ao vivo
- Charts renderizam

---

## SPRINT 4: Integration + Polish (Pós-implementação base)

### Task 4.1: Sidebar Link + CTAs

Adicionar link "Calculadora" em `src/components/Sidebar.tsx` (se não existir já). Adicionar CTAs em `metas.$id.tsx` (goal detail page).

### Task 4.2: Full Manual Testing

Rodar verification checklist completa (vide `VERIFICATION-CHECKLIST.md`).

### Task 4.3: Supabase Migration Deploy

Aplicar migration `dm_badges` em produção.

---

## Estimativa de Horas

| Sprint | Tasks | Est. Horas |
|--------|-------|-----------|
| 1 | Data layer (6 tasks) | 8-10h |
| 2 | UI + PeriodSelector (6 tasks) | 10-12h |
| 3 | Charts + Calculadora (6 tasks) | 12-14h |
| 4 | Integration + Testing | 4-6h |
| **Total** | **18 tasks** | **34-42h** |

---

**Última atualização:** 2026-08-08  
**Próximo:** Executar Sprint 1 tasks em ordem 1.1 → 1.6
