# 🔄 Refactoring Roadmap — Catálogo de Treinos V2

**Status**: Production V1 complete (100%)  
**Next Phase**: Architecture cleanup + feature expansion  
**Estimated Timeline**: 2-3 sessions (4-6 hours)

---

## 🎯 REFACTORING PRIORITIES

### Priority 1: Code Architecture & Constants ⭐ START HERE

**Problem**: Magic strings scattered, repeated logic, hard to maintain

**Changes**:
```typescript
// Create src/constants/categories.ts
export const CATEGORY_IDS = {
  ACADEMIA: 'academia',
  FORCA: 'forca',
  FORCA_UTIL: 'forca-util',
  MILITAR: 'militar',
  CORPO_LIVRE: 'corpo-livre',
  CORRIDA: 'corrida',
  CONDICIONAMENTO: 'condicionamento',
  MOBILIDADE: 'mobilidade',
  RAPIDO: 'rapido'
} as const

// Create src/constants/exercises.ts
export const DIFFICULTY_LEVELS = {
  INICIANTE: 'iniciante',
  INTERMEDIARIO: 'intermediário',
  AVANCADO: 'avançado'
} as const

// Create src/utils/categoryHelper.ts
export function getCategoryName(id: string): string {
  const names = {
    [CATEGORY_IDS.ACADEMIA]: 'Academia',
    // ...
  }
  return names[id] || 'Desconhecido'
}
```

**Files to Create**:
- `src/constants/categories.ts`
- `src/constants/exercises.ts`
- `src/constants/ui.ts` (colors, sizes)
- `src/utils/categoryHelper.ts`
- `src/utils/exerciseHelper.ts`
- `src/utils/validators.ts`

**Files to Update**:
- `src/pages/Categoria.tsx` — use constants
- `src/pages/Treino.tsx` — use helpers
- `src/lib/store.ts` — add action creators

**Benefits**:
- Single source of truth for constants
- Type safety (as const + typeof for unions)
- Easier to maintain and test

---

### Priority 2: Extract Custom Hooks ⭐ AFTER PRIORITY 1

**Problem**: Component logic scattered, hard to reuse

**New Hooks**:

```typescript
// src/hooks/useWorkout.ts
export function useWorkout(treinoId?: string) {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const { done, percent } = useWorkoutStore().getProgress(...)
  
  useEffect(() => {
    // Load workout from workouts.json
  }, [treinoId])
  
  return { workout, done, percent }
}

// src/hooks/useExerciseDetails.ts
export function useExerciseDetails(exerciseId: string) {
  const exercise = useMemo(() => findExercise(exerciseId), [exerciseId])
  const [isExpanded, setIsExpanded] = useState(false)
  
  return { exercise, isExpanded, toggle: () => setIsExpanded(!isExpanded) }
}

// src/hooks/useWorkoutFilters.ts
export function useWorkoutFilters(workouts: Workout[]) {
  const [filters, setFilters] = useState({
    time: null,
    location: null,
    objective: null,
    equipment: null
  })
  
  const filtered = useMemo(() => filterWorkouts(workouts, filters), [workouts, filters])
  
  return { filters, setFilters, filtered }
}
```

**Files to Create**:
- `src/hooks/useWorkout.ts`
- `src/hooks/useExerciseDetails.ts`
- `src/hooks/useWorkoutFilters.ts`
- `src/hooks/useProfile.ts`

**Files to Update**:
- `src/pages/Treino.tsx` — use useWorkout
- `src/pages/Exercicios.tsx` — use useExerciseDetails, useWorkoutFilters
- `src/components/ExerciseAccordion.tsx` — use useExerciseDetails

**Benefits**:
- Reusable logic
- Easier to test
- Cleaner components

---

### Priority 3: Component Composition & Patterns

**Problem**: Components do too much, hard to test

**Refactoring**:

```typescript
// Before: ExerciseAccordion is a monolith
<ExerciseAccordion exercise={ex} label="" description="" />

// After: Composition pattern
<ExerciseItem exercise={ex}>
  <ExerciseHeader name={ex.nome} secondary={ex.nome_secundario} />
  <ExerciseContent>
    <ExerciseHowTo steps={ex.como_fazer} />
    <ExerciseCommonMistakes mistakes={ex.erros_comuns} />
    <ExerciseVariations easy={ex.versao_facil} hard={ex.versao_dificil} />
  </ExerciseContent>
</ExerciseItem>
```

**New Components**:
- `ExerciseHeader` (name + secondary name)
- `ExerciseContent` (expandable container)
- `ExerciseHowTo` (instruction list)
- `ExerciseCommonMistakes` (error list)
- `ExerciseVariations` (easy/hard versions)
- `WorkoutCard` (workout in list)
- `CategoryCard` (category in list)

**Benefits**:
- Smaller, testable units
- Easier to reuse
- Better accessibility
- Clearer data flow

---

### Priority 4: State Management Split

**Problem**: Single Zustand store mixing concerns

**Refactoring**:

```typescript
// src/lib/stores/workoutStore.ts (current logic)
export const useWorkoutStore = create<WorkoutState>()
  // perfil + checks

// src/lib/stores/uiStore.ts (new)
export const useUiStore = create<UiState>()
  .persist(...)
  .init({
    expandedExercise: null,
    activeTab: 'inicio',
    showConfirm: false,
    searchTerm: '',
    filterCategory: null
  })

// src/lib/stores/index.ts (barrel export)
export * from './workoutStore'
export * from './uiStore'
```

**Benefits**:
- Separation of concerns
- Easier to test each store independently
- Better performance (selective subscriptions)
- Cleaner component logic

---

### Priority 5: Add Comprehensive Testing

**Problem**: No unit tests, only E2E

**New Test Files**:

```typescript
// tests/unit/hooks/useWorkout.test.ts
describe('useWorkout', () => {
  it('should load workout from workouts.json', () => { ... })
  it('should return null for invalid treinoId', () => { ... })
})

// tests/unit/utils/categoryHelper.test.ts
describe('getCategoryName', () => {
  it('should return correct Portuguese name', () => { ... })
  it('should return "Desconhecido" for invalid id', () => { ... })
})

// tests/unit/components/CheckItem.test.ts
describe('CheckItem', () => {
  it('should toggle check on click', () => { ... })
  it('should persist to store', () => { ... })
})
```

**Setup**:
- Install Vitest + React Testing Library
- Update `vite.config.ts` with test configuration
- Add npm script: `npm run test:unit`

**Benefits**:
- Catch bugs early
- Refactoring confidence
- Documentation via tests

---

### Priority 6: Advanced Filtering System

**Problem**: No advanced filters (only search)

**New Features**:

```typescript
// src/components/FilterPanel.tsx
export function FilterPanel() {
  const { filters, setFilters } = useWorkoutFilters()
  
  return (
    <>
      <TimeFilter value={filters.time} onChange={(t) => setFilters({...filters, time: t})} />
      <LocationFilter value={filters.location} onChange={(l) => setFilters({...filters, location: l})} />
      <ObjectiveFilter value={filters.objective} onChange={(o) => setFilters({...filters, objective: o})} />
      <EquipmentFilter value={filters.equipment} onChange={(e) => setFilters({...filters, equipment: e})} />
      
      <button onClick={() => setFilters({})}>Limpar filtros</button>
    </>
  )
}

// Each filter is a small, reusable component
// Store filter state in useWorkoutFilters hook
// Pass filtered results down to list
```

**New Pages/Screens**:
- `/treinos` — All workouts with advanced filters
- Dynamic filtering with live results

**Benefits**:
- Better workout discovery
- Mobile-friendly filters
- Reusable filter components

---

### Priority 7: "Monte meu Treino" Wizard

**Problem**: Users can't generate custom workouts

**New Feature**:

```typescript
// src/pages/MonteTreinoWizard.tsx
export function MonteTreinoWizard() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  
  const steps = [
    { q: 'Quanto tempo você tem?', opts: ['15min', '30min', '45min', '60min', '90min'] },
    { q: 'Onde está?', opts: ['Academia', 'Casa', 'Rua', 'Qualquer lugar'] },
    { q: 'Objetivo de hoje?', opts: ['Força', 'Hipertrofia', 'Militar', 'Condicionamento', 'Mobilidade'] },
    { q: 'Foco?', opts: ['Full Body', 'Superior', 'Inferior', 'Push', 'Pull'] }
  ]
  
  // On complete: filter workouts by answers
  // Show matching workouts
}

// Route: /monte-treino
```

**Benefits**:
- Better UX for users unsure what to do
- Smart filtering algorithm
- Increases engagement

---

### Priority 8: Progressions System (Roadmap)

**Problem**: No progression paths (0 → first pull-up)

**Future Feature**:

```typescript
// src/data/progressions.json
{
  "pull-up-progression": {
    "name": "Do 0 para primeira barra fixa",
    "steps": [
      "dead-hang",
      "dead-hang-assisted",
      "scapular-pull",
      "negative-pull-up",
      "pull-up-assisted",
      "pull-up"
    ],
    "recommendedFrequency": "3x/week",
    "estimatedDuration": "8-12 weeks"
  }
}

// src/pages/Progression.tsx (show progression path)
// Track progress against progression goals
```

**Benefits**:
- Guides users through realistic goals
- Long-term engagement
- Sense of achievement

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Architecture (Session 1)
- [ ] Create constants files
- [ ] Create helper utilities
- [ ] Update components to use constants
- [ ] Run tests (should pass)
- [ ] Commit: `refactor: extract constants and helpers`

### Phase 2: Hooks & Components (Session 2)
- [ ] Create custom hooks
- [ ] Refactor pages to use hooks
- [ ] Break apart ExerciseAccordion
- [ ] Create composition-based components
- [ ] Run tests (add new unit tests)
- [ ] Commit: `refactor: extract hooks and composition components`

### Phase 3: State & Testing (Session 3)
- [ ] Split Zustand stores
- [ ] Add comprehensive unit tests
- [ ] Update E2E tests
- [ ] Test coverage >80%
- [ ] Commit: `refactor: split stores and add tests`

### Phase 4: Features (Session 4+)
- [ ] Add advanced filters
- [ ] Implement Monte Meu Treino wizard
- [ ] Add progressions system
- [ ] Enhance UX

---

## 🎯 SUCCESS CRITERIA

- [ ] All tests passing (unit + E2E)
- [ ] Code coverage >80%
- [ ] No TypeScript errors
- [ ] Bundle size <250 kB (no increase)
- [ ] Zero breaking changes to user experience
- [ ] All components <300 LOC
- [ ] All hooks are composable and reusable

---

## 📊 ESTIMATED EFFORT

| Priority | Task | Effort | Session |
|---|---|---|---|
| 1 | Extract constants | 1h | 1 |
| 2 | Custom hooks | 2h | 1-2 |
| 3 | Component composition | 2h | 2 |
| 4 | State split | 1h | 2 |
| 5 | Unit tests | 2h | 3 |
| 6 | Advanced filters | 2h | 4 |
| 7 | Monte Meu Treino | 3h | 4-5 |
| 8 | Progressions | 3h | 5+ |
| **TOTAL** | | **16h** | **5 sessions** |

---

## 🚀 START REFACTORING WHEN READY

```bash
# Session 1: Start with Priority 1
git checkout -b refactor/architecture
# Extract constants, create helpers
# Run tests
# Create PR

# When ready for Phase 2
git checkout -b refactor/hooks-components
# Create hooks, refactor components
# Add tests
# Create PR
```

---

**Ready to refactor when you are!** 💪
