# 📊 Data Schema Changes — Fase 1

**Todas as mudanças necessárias ao modelo de dados, persistência e sincronização.**

---

## Zustand Store (`src/lib/store.ts`)

### New Type

```typescript
export interface BadgeUnlock {
  id: string;              // nanoid(), unique per unlock
  badgeId: string;         // Reference to ACHIEVEMENTS.id
  unlockedAt: string;      // ISO date string
}
```

### Updated `PersistedState` Interface

```typescript
interface PersistedState {
  // ... existing fields
  profile: Profile;
  goals: Goal[];
  tasks: Task[];
  executions: Execution[];
  timeLogs: TimeLog[];
  sales: Sale[];
  measurements: Measurement[];
  products: Product[];
  primaryGoalId?: string;
  
  // NEW:
  badgeUnlocks: BadgeUnlock[];
}
```

### Updated Store State

```typescript
interface State extends PersistedState {
  hydrated: boolean;
  activeTimer?: { taskId: string; startedAt: string };
  
  // existing actions...
  
  // NEW action:
  unlockBadge: (badgeId: string) => void;
}
```

### Updates to Functions

**`emptyPersistedState()`:**
```typescript
const emptyPersistedState = (): PersistedState => ({
  profile: { name: "Você", minDailyPercent: 60 },
  goals: [],
  tasks: [],
  executions: [],
  timeLogs: [],
  sales: [],
  measurements: [],
  products: [],
  primaryGoalId: undefined,
  badgeUnlocks: [],  // NEW
});
```

**`normalizePersistedState(state)`:**
```typescript
const normalizePersistedState = (state: Partial<PersistedState> | undefined): PersistedState => ({
  // ... existing
  badgeUnlocks: state?.badgeUnlocks ?? [],  // NEW
});
```

**`getPersistedSnapshot()`:**
```typescript
const getPersistedSnapshot = (): PersistedState => {
  const state = useStore.getState();
  return {
    // ... existing
    badgeUnlocks: state.badgeUnlocks,  // NEW
  };
};
```

**`stateToCloud(state)`:**
```typescript
const stateToCloud = (state: PersistedState): CloudSnapshot => ({
  // ... existing
  badgeUnlocks: state.badgeUnlocks,  // NEW
});
```

**`cloudToState(snap)`:**
```typescript
const cloudToState = (snap: CloudSnapshot): PersistedState => ({
  // ... existing
  badgeUnlocks: snap.badgeUnlocks.map(b => normalizeGamificationUnlock(b)),  // NEW
});
```

### New Normalizer Helper (add to store.ts end)

```typescript
const normalizeGamificationUnlock = (unlock: Partial<BadgeUnlock>): BadgeUnlock => ({
  id: unlock.id ?? nanoid(),
  badgeId: unlock.badgeId ?? "",
  unlockedAt: unlock.unlockedAt ?? new Date().toISOString(),
});
```

### Store Action Implementation

```typescript
// In the create() callback, in the returned actions object:
unlockBadge: (badgeId: string) => {
  const existing = get().badgeUnlocks.some(b => b.badgeId === badgeId);
  if (!existing) {
    set({
      badgeUnlocks: [
        ...get().badgeUnlocks,
        { id: nanoid(), badgeId, unlockedAt: todayISO() },
      ],
    });
  }
},
```

---

## Supabase Cloud Sync (`src/lib/cloud-sync.ts`)

### Updated `CloudSnapshot` Type

```typescript
interface CloudSnapshot {
  // ... existing
  profile?: { name: string; minDailyPercent: number; primaryGoalId?: string };
  goals: Goal[];
  tasks: Task[];
  executions: Execution[];
  sales: Sale[];
  products: Product[];
  timeLogs: TimeLog[];
  measurements: Measurement[];
  
  // NEW:
  badgeUnlocks: BadgeUnlock[];
}
```

### New Serializers

Add alongside existing `goalToRow`, `taskToRow`, etc:

```typescript
const badgeToRow = (unlock: BadgeUnlock, deviceId: string) => ({
  id: unlock.id,
  device_id: deviceId,
  badge_id: unlock.badgeId,
  unlocked_at: new Date(unlock.unlockedAt).toISOString(),
});

const rowToBadge = (row: any): BadgeUnlock => ({
  id: row.id,
  badgeId: row.badge_id,
  unlockedAt: row.unlocked_at,
});
```

### Updated `loadCloudSnapshot(deviceId)`

In the `Promise.all()` array (around line 239-249), add:

```typescript
const badgesResp = await supabase()
  .from("dm_badges")
  .select("*")
  .eq("device_id", deviceId);

const badgeUnlocks = !badgesResp.error
  ? (badgesResp.data || []).map(rowToBadge)
  : [];
```

Then in the return statement, add to `CloudSnapshot`:

```typescript
return {
  // ... existing fields
  badgeUnlocks,  // NEW
};
```

### Updated `pushFullSnapshot(deviceId, snap)`

After existing `supabase().from(...).upsert(...)` calls (around line 275+), add:

```typescript
const badgesToUpsert = snap.badgeUnlocks.map(b => badgeToRow(b, deviceId));
await supabase()
  .from("dm_badges")
  .upsert(badgesToUpsert, { onConflict: "id" });
```

### Updated `syncDiff(old, new, deviceId)` Function

After the `timeLogs` diff block (around line 380+), add a parallel block:

```typescript
// Badges diff
const badgeDiff = diffCollection(old.badgeUnlocks, new.badgeUnlocks, "id");
if (badgeDiff.added.length || badgeDiff.modified.length || badgeDiff.deleted.length) {
  if (badgeDiff.added.length || badgeDiff.modified.length) {
    const rows = [...badgeDiff.added, ...badgeDiff.modified].map(b =>
      badgeToRow(b, deviceId)
    );
    await supabase()
      .from("dm_badges")
      .upsert(rows, { onConflict: "id" });
  }
  if (badgeDiff.deleted.length) {
    await supabase()
      .from("dm_badges")
      .delete()
      .in("id", badgeDiff.deleted.map(b => b.id));
  }
}
```

---

## Supabase Database (`supabase/migrations/`)

### New Migration File

**File:** `supabase/migrations/<TIMESTAMP>_add_dm_badges.sql`

```sql
-- Create dm_badges table (badges unlocked by users)
create table public.dm_badges (
  id text primary key,
  device_id text not null,
  badge_id text not null,
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for device queries
create index idx_dm_badges_device_id on public.dm_badges(device_id);

-- Enable RLS
alter table public.dm_badges enable row level security;

-- RLS policy: allow all reads/writes (same as other dm_* tables in this app)
drop policy if exists "dm_badges_all_access" on public.dm_badges;
create policy "dm_badges_all_access"
on public.dm_badges
for all
using (true)
with check (true);

-- Auto-update trigger for updated_at
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

-- Grant standard permissions (if needed)
grant all on public.dm_badges to authenticated, anon;
```

### How to Deploy

#### Option 1: Via Supabase CLI (Recommended)

```bash
# From repo root
supabase db push
```

#### Option 2: Manual via Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to "SQL Editor"
4. Create a new query
5. Paste the SQL from above
6. Execute

#### Option 3: CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Apply Supabase migrations
  run: |
    supabase db push
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```

---

## Achievements Engine (`src/lib/achievements.ts`)

### Type Definitions (not persisted)

```typescript
import type { LucideIcon } from "lucide-react";

export type LifetimeStats = {
  history: DaySummary[];
  currentStreak: number;
  bestStreak: number;
  consistencyRate: number;
  validDays: number;
  lifetimePoints: number;
  level: number;
  levelPcts: {
    level: number;
    floor: number;
    ceil: number;
    pct: number;
    pointsToNext: number;
  };
  unlockedBadgeIds: string[];
};

export type AchievementDef = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  check: (stats: LifetimeStats) => boolean;
};
```

### Computed Data Flow

```
Store (persisted)
├─ goals, tasks, executions, timeLogs, sales, measurements, badgeUnlocks
│
└─ useLifetimeStats() hook (computed on-demand)
   ├─ buildDayHistory(goals, tasks, executions, timeLogs, minPct, days, today)
   │  └─ returns: DaySummary[] (pct, points, maxPoints, classification per day)
   │
   ├─ buildConsistencyMetrics(history, minPct)
   │  └─ returns: { currentStreak, bestStreak, consistencyRate, validDays }
   │
   ├─ computeLifetimePoints(tasks, executions, goals, sales, measurements, timeLogs)
   │  └─ Σ dailyPoints(tasks, executions, date) ∀ date ∈ history
   │
   ├─ levelFromPoints(points)
   │  └─ Math.floor(Math.sqrt(points / 50)) + 1
   │
   └─ ACHIEVEMENTS.filter(a => a.check(stats))
      └─ for each matched badge: call store.unlockBadge(badge.id)
      └─ returns: unlockedBadgeIds from store.badgeUnlocks
```

**Key insight:** `LifetimeStats` is **never persisted** — it's recomputed every time `useLifetimeStats()` is called, deriving everything from the persisted `PersistedState`. Only `badgeUnlocks` array is persisted (as proof of unlock history).

---

## Type Evolution Summary

| Type | Change | Rationale |
|------|--------|-----------|
| `BadgeUnlock` | NEW | Track which badges unlocked, when |
| `PersistedState` | +badgeUnlocks | Persist badge unlock history |
| `CloudSnapshot` | +badgeUnlocks | Sync badges across devices |
| `LifetimeStats` | NEW (computed) | Single source of truth for gamification metrics |
| `AchievementDef` | NEW (fixed catalog) | Define badge unlock conditions |

---

## Backward Compatibility

- ✅ Old localStorage keys (`momentum-store-v1`) remain valid
- ✅ New field `badgeUnlocks` defaults to `[]` on first load (no data loss)
- ✅ Cloud sync round-trips are idempotent (safe to re-sync)
- ✅ No breaking changes to existing Goal/Task/Execution/Sale/Measurement/Product types

**Upgrade path:** Users with existing data will automatically get an empty `badgeUnlocks: []` on first app load after this release. Achievements will start from zero, unlocking as they meet conditions going forward. No data loss.

---

## Audit Trail

| Date | Change | Author |
|------|--------|--------|
| 2026-08-08 | Initial schema for Phase 1 | Claude Sonnet 5 |

---

**Last Updated:** 2026-08-08  
**Next Step:** Apply migration after code implementation ready
