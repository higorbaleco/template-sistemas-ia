# ✅ Verification Checklist — Fase 1

**Pré-requisito:** `npm run dev` rodando, app acessível em http://localhost:5173

**Responsável:** QA / Desenvolvedor após cada Sprint

---

## Sprint 1 Verification (Data Layer + Achievements)

### ✓ S1.1: Funções Calculadora Exportadas

**Como testar:**
1. Abrir DevTools (F12) → Console
2. Colar:
   ```javascript
   import { getMonthBounds, resolveCurrentMonthGoal, whatIfCompletionDate } from '@/lib/calc';
   const bounds = getMonthBounds();
   console.log(bounds); // { start: "2026-08-01", end: "2026-08-31" }
   ```
3. ✓ Retorna datas válidas do mês

**Checkpoints:**
- [ ] `getMonthBounds()` retorna `{ start, end }` corretos
- [ ] `resolveCurrentMonthGoal()` retorna Goal ou undefined
- [ ] `whatIfCompletionDate()` retorna `{ completionDate, status, ... }`
- [ ] Nenhum erro de import

---

### ✓ S1.2: Streaks Consolidados

**Como testar:**
1. Navegar Home (/)
2. Inspecionar código — procurar por `computeStreak`
3. ✓ Não deve encontrar imports/calls de `computeStreak`

**Checkpoints:**
- [ ] Grep `computeStreak` em `src/` retorna 0 hits
- [ ] Home renderiza sem Flame chip antigo
- [ ] Nenhum erro de undefined streak em console

---

### ✓ S1.3: Store Badges

**Como testar:**
1. DevTools Console:
   ```javascript
   import { useStore } from '@/lib/store';
   const store = useStore.getState();
   console.log(store.badgeUnlocks); // Should be []
   store.unlockBadge("streak_7");
   console.log(store.badgeUnlocks); // Should be [{ id: "...", badgeId: "streak_7", unlockedAt: "..." }]
   store.unlockBadge("streak_7"); // 2nd call, should be idempotent
   console.log(store.badgeUnlocks.length); // Should still be 1
   ```
2. Reload page
3. ```javascript
   console.log(useStore.getState().badgeUnlocks); // Should persist in localStorage
   ```

**Checkpoints:**
- [ ] `unlockBadge` idempotente (2x chama com mesmo ID = array com 1 item)
- [ ] Persiste em localStorage após reload

---

### ✓ S1.4: Cloud Sync Badges (Deferred)

**Nota:** Testado após Sprint 1.5 (migration aplicada)

**Como testar:**
1. Supabase: verificar que tabela `dm_badges` existe
2. Unlock um badge via store
3. Verificar que linha aparece em Supabase dashboard → SQL Editor:
   ```sql
   SELECT * FROM public.dm_badges;
   ```

**Checkpoints:**
- [ ] Tabela existe
- [ ] Upsert funciona (rows aparecem no Supabase)

---

### ✓ S1.5: Supabase Migration Aplicada

**Como testar:**
1. Terminal:
   ```bash
   supabase db push
   # ou check dashboard → SQL Editor
   ```
2. Verificar estrutura:
   ```sql
   \d dm_badges -- Postgres command, ou ver dashboard
   ```

**Checkpoints:**
- [ ] Migration rodou sem erros
- [ ] Tabela `dm_badges` existe em Supabase
- [ ] Colunas: id, device_id, badge_id, unlocked_at, created_at, updated_at

---

### ✓ S1.6: achievements.ts Hook

**Como testar:**
1. DevTools Console:
   ```javascript
   import { useLifetimeStats, ACHIEVEMENTS } from '@/lib/achievements';
   const stats = useLifetimeStats();
   console.log(stats); // LifetimeStats object
   console.log(stats.level, stats.lifetimePoints, stats.currentStreak);
   console.log(ACHIEVEMENTS.length); // Should be 8+
   ```

**Checkpoints:**
- [ ] Hook retorna LifetimeStats válido
- [ ] `level >= 1` (começar no nível 1)
- [ ] `currentStreak >= 0`
- [ ] `ACHIEVEMENTS` catálogo tem 8+ items
- [ ] Badge unlock side-effect roda (check console, nenhum error)

---

## Sprint 2 Verification (Gamification UI + PeriodSelector)

### ✓ S2.1: UI Store `gamificationOpen` Flag

**Como testar:**
1. DevTools:
   ```javascript
   import { useUI } from '@/lib/ui-store';
   console.log(useUI.getState().gamificationOpen); // false
   useUI.getState().openGamification();
   console.log(useUI.getState().gamificationOpen); // true
   ```

**Checkpoints:**
- [ ] Flag flipa entre true/false
- [ ] Não persiste após reload (é UI state, não persisted)

---

### ✓ S2.2 & S2.3: GamificationStrip + Sheet Rendering

**Como testar:**
1. Navegar para qualquer página (Home, Metas, Progresso, etc)
2. Abaixo do header, deve aparecer **faixa cinza com:**
   - 🔥 flame icon + "Xd" (streak dias)
   - "Nv. Y" (level pill)
   - Barra horizontal de progresso até próximo nível
3. Click na faixa → folha modal abre (overlay escuro no fundo)
4. Folha mostra:
   - Nível grande (em anel/círculo)
   - Grade de estatísticas (Pontos, Streak, Melhor)
   - Grid de badges (locked = cinza/opaco, unlocked = colorido + data)
5. Click backdrop (fora da folha) → folha fecha
6. Verificar em **todas as páginas:** Home, Metas, Progresso, Tarefas, etc

**Checkpoints:**
- [ ] GamificationStrip visível em TODAS telas
- [ ] Valores (streak, nível) refletem store.badgeUnlocks + lifetime stats
- [ ] Click abre folha
- [ ] Folha mostra badges corretos
- [ ] Click backdrop fecha
- [ ] Nenhum erro em console

---

### ✓ S2.4: Flame Chip Removido de Home

**Como testar:**
1. Navegar Home (/)
2. Procurar por **antigo** flame chip no header direito
3. ✓ Não deve existir

**Checkpoints:**
- [ ] Nenhum Flame icon no header (agora só existe na GamificationStrip global)
- [ ] Home renderiza sem erro

---

### ✓ S2.5: PeriodSelector Component

**Como testar:**
1. Navegar /progresso
2. Procurar por seletor de período (deve estar onde era o toggle 7d/14d antes)
3. Verificar 4 pills: "7d", "14d", "30d", "Mês"
4. Click cada um → outros deselecionam
5. Se houver setas (prev/next), click prev → range label muda para semana anterior
6. Range label deve mostrar datas (ex: "Jan 1 - Jan 7")

**Checkpoints:**
- [ ] 4 pills renderizam
- [ ] Click period muda seleção
- [ ] Se houver nav anterior: datas mudam retroativamente
- [ ] Label de range atualiza
- [ ] Nenhum erro

---

### ✓ S2.6: Progresso.tsx Period Rewrite + Consistency Fix

**Como testar:**
1. /progresso, selecionar período "30d"
2. Verificar que gráfico + stats refletem 30 dias (não só 14)
3. Navegar para semana anterior (se houver prev)
4. Verificar que "Melhor streak" pode agora ser >= 14 dias (antes era capped em 14)
   - Se tiver streak de 30+ dias, deve aparecer aqui

**Checkpoints:**
- [ ] Período selector funciona
- [ ] Bar chart recomputa por período
- [ ] Consistency stats computadas em full-history (não capped)
- [ ] Gráfico interativo: click barra abre detalhe do dia

---

## Sprint 3 Verification (Charts + Dashboard + Calculadora)

### ✓ S3.1: Progresso Bar Chart → Recharts

**Como testar:**
1. /progresso
2. Procurar gráfico de barras (deve ser Recharts now, não CSS divs)
3. Verificar cores:
   - Dias bons (>= minDailyPercent) = verde/accent
   - Dias ruins (< minDailyPercent) = foreground com opacidade
4. Click em uma barra → sheet de detalhe abre
5. Tooltip ao hover deve mostrar %

**Checkpoints:**
- [ ] Gráfico renderiza (não CSS divs)
- [ ] Cores corretas
- [ ] Click interativo funciona
- [ ] Recharts library loaded sem erro

---

### ✓ S3.2: Goal Card Sparklines

**Como testar:**
1. /metas (goals list)
2. Cada card de meta deve mostrar **mini-gráfico** entre a barra de progresso e o grid 2x2
3. Gráfico colorido com cor da meta (goal.color)
4. Mini-gráfico mostra tendência dos últimos 7 dias

**Checkpoints:**
- [ ] Sparkline renderiza por goal
- [ ] Cor = goal.color
- [ ] Animação suave (não tremulante)

---

### ✓ S3.3: Today "Mês Atual" Gauge

**Como testar:**
1. Home (/)
2. Procurar card "Mês Atual" (deve estar #3 na nova ordem)
3. Gauge radial mostra % de dias do mês meeting minDailyPercent
4. Número central (ex: "65%")
5. Aumentar execuções → % deve subir

**Checkpoints:**
- [ ] Gauge renderiza
- [ ] Percentage correto
- [ ] Atualiza ao mudar execuções
- [ ] Radial chart renderiza (Recharts)

---

### ✓ S3.4: Metas.index "Nível" Fix

**Como testar:**
1. /metas (goals list)
2. Header superior direito deve mostrar "Nível" label + valor numérico (ex: "Nv. 3")
3. Não mais mostra "%" como antes
4. Valor deve refletir `useLifetimeStats().level`

**Checkpoints:**
- [ ] Chip mostra "Nv. X" (não percentual)
- [ ] Valor correto (coerente com faixa de gamificação)
- [ ] Atualiza quando nível sobe

---

### ✓ S3.5: Dashboard Reorder + resolveCurrentMonthGoal

**Como testar:**
1. Home (/)
2. Verificar **nova ordem** (top → bottom):
   1. Greeting + date
   2. Hero goal card
   3. **NEW** "Mês Atual" gauge
   4. "Progresso diário" bar
   5. "Foco de agora"
   6. "Próxima melhor ação"
   7. "Tarefas de hoje"
   8. **NEW** Calculadora teaser card
   9. "Indicadores"
   10. 2x2 mini-cards (simplified)
   11. "Falta pouco"

3. Criar 2 metas: Uma ativa neste mês, outra que terminou mês passado
4. Pinstar a meta de mês passado como "Meta principal"
5. Home deve mostrar a meta deste mês, com rótulo "Meta do mês" (não "Meta principal")
6. Se primeira meta fosse pinada, label seria "Meta principal" (já que cobre este mês)

**Checkpoints:**
- [ ] Ordem visual correta (18-item lista)
- [ ] Meta do mês selecionada mesmo se different do pinned
- [ ] Rótulo dinâmico ("Meta do mês" vs "Meta principal")
- [ ] Calculadora teaser card existe com botão "Abrir Calculadora"
- [ ] Mini-cards: "Falta" e "Projeção" foram removidas (só ritmo semanal)

---

### ✓ S3.6: `/calculadora` Route

**Como testar:**
1. Home, click em "Abrir Calculadora" (no novo card)
   - Ou navegar `/calculadora` direto
2. Página abre com:
   - Seletor de meta (dropdown)
   - Cards de stats: Falta, Dias restantes, Ritmo necessário, Ritmo atual
   - (Se meta execution) Tabela com tarefas linked + qty/dia necessária
   - (Se meta financial) Card com ticket médio + vendas/dia necessárias
   - Campo "E se eu fizer X/dia?"
   - Gráfico de trajetória (atual vs necessária)
   - Link "Ver meta" de volta para /metas/$id

3. **Interatividade:**
   - Dropdown de meta: selecionar outra → stats mudam
   - Campo "E se": digitar número → data projetada de conclusão muda **ao vivo**
   - Gráfico atualiza com what-if line

4. **Validações:**
   - Se meta não existe: EmptyState
   - Se taxa impossível (taxa=0 e falta alcançar): "Irrealizável"
   - Se projeção past deadline: "+X dias após prazo"

**Checkpoints:**
- [ ] Route `/calculadora` abre sem erro
- [ ] Seletor de meta funciona
- [ ] Breakdown table/card renderiza correto
- [ ] What-if interativo (live input → live date update)
- [ ] Gráfico renderiza (AreaChart ou LineChart)
- [ ] Sem error no console

---

## Integration + Full Flow Testing

### ✓ Cross-Feature: Gamification + Achievements Auto-Unlock

**Como testar:**
1. Start fresh (ou reset badges via: `useStore.getState().badgeUnlocks = []`)
2. Register execuções/vendas for ~7 dias consecutivos (minDailyPercent)
3. GamificationStrip deve mostrar `streak = 7`
4. Abrir GamificationSheet
5. Badge "Primeira Semana" deve estar **desbloqueado** (colorido + data de unlock)
6. Quebrar streak (um dia sem execução minDailyPercent)
7. Voltar pra GamificationSheet
8. Streak agora = 0, mas badge continua desbloqueado (histórico)

**Checkpoints:**
- [ ] Badge unlock automático quando condição atingida
- [ ] Desbloqueio persiste mesmo após resetar streak
- [ ] Multiple badges desbloqueados em paralelo (5+ goals = "Cinco Vitórias", etc)

---

### ✓ Cross-Feature: Period Filter + Charts Sync

**Como testar:**
1. /progresso, selecionar "7d"
2. Barra mostra 7 dias
3. Selecionar "30d"
4. Barra recomputa, mostra 30 dias
5. Naveguar para mês anterior (prev arrow)
6. Gráfico reflete dados daquele mês (histórico)
7. Voltar (next arrow)
8. Volta pra hoje

**Checkpoints:**
- [ ] Período filtering atua em tempo real
- [ ] Histórico navegável
- [ ] Dados corretos por período

---

### ✓ Cross-Feature: Store Sync + Badges Persist

**Como testar:**
1. Unlock um badge
2. Reload página (`Ctrl+R` ou close/reopen tab)
3. GamificationSheet deve mostrar o badge ainda desbloqueado

**Checkpoints:**
- [ ] localStorage persiste badges após reload
- [ ] Cloud sync (se Supabase configurado): trocar aba/dispositivo → badges sincronizam

---

### ✓ Cross-Feature: Dashboard → Calculadora → Goal Detail

**Como testar:**
1. Home: click card de meta → abre /metas/$id (goal detail)
2. Goal detail: procurar link "Calculadora" ou botão → navega /calculadora com essa meta pré-selecionada
3. Calculadora: verificar que meta correta está selecionada
4. Click "Ver meta" em baixo → volta /metas/$id

**Checkpoints:**
- [ ] Links bidirecionais funcionam
- [ ] Contexto (meta selecionada) mantido

---

## Final Smoke Tests

### ✓ No Console Errors

**Como testar:**
1. DevTools → Console
2. Navegar todas as páginas: Home, Metas, Progresso, Tarefas, Calculadora
3. ✓ Nenhum erro (warnings OK)

**Checkpoints:**
- [ ] Console limpo (sem erro em vermelho)

---

### ✓ Responsive Design

**Como testar:**
1. DevTools → Device toggle (mobile, tablet, desktop)
2. Testar tudo em mobile (375px) + desktop (1280px)
3. Layouts não quebram

**Checkpoints:**
- [ ] Mobile: GamificationStrip readable, PeriodSelector responsivo, charts não ultrapassam tela
- [ ] Desktop: layouts mantêm proporção

---

### ✓ Dark Mode (Tailwind Ready)

**Como testar:**
1. Sistema dark mode (se implementado na app): toggle
2. Charts + novos componentes seguem tema

**Checkpoints:**
- [ ] Colors adaptam a dark mode (Recharts usa CSS vars, devia funcionar)

---

## Sign-Off Checklist

| Item | Verificado | Responsável | Data |
|------|-----------|-------------|------|
| S1 Data Layer | ☐ | | |
| S2 Gamification UI | ☐ | | |
| S3 Charts + Calculadora | ☐ | | |
| Cross-feature integration | ☐ | | |
| No console errors | ☐ | | |
| Responsive OK | ☐ | | |
| Production-ready | ☐ | | |

---

## Known Issues / Workarounds

_(None yet — fill as bugs are found post-launch)_

---

**Last Updated:** 2026-08-08  
**Owner:** QA / Dev Team  
**Review Frequency:** Per Sprint
