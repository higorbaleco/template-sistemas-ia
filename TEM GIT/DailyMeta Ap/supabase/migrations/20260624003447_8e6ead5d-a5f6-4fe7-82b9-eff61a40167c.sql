-- Cleanup old blob table
drop table if exists public.dailymeta_app_state;

-- Generic updated_at trigger
create or replace function public.dm_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PROFILES (one per device)
create table public.dm_profiles (
  device_id text primary key,
  name text not null default 'Você',
  min_daily_percent integer not null default 60,
  primary_goal_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.dm_profiles to anon, authenticated;
grant all on public.dm_profiles to service_role;
alter table public.dm_profiles enable row level security;
create policy "dm_profiles public read" on public.dm_profiles for select using (true);
create policy "dm_profiles public write" on public.dm_profiles for all using (true) with check (true);
create trigger dm_profiles_updated_at before update on public.dm_profiles
  for each row execute function public.dm_set_updated_at();

-- GOALS
create table public.dm_goals (
  id text primary key,
  device_id text not null,
  name text not null,
  type text not null,
  target numeric not null default 0,
  unit text not null default 'R$',
  start_date date not null,
  end_date date not null,
  starting_value numeric not null default 0,
  min_daily_percent integer not null default 60,
  color text not null default '#10b981',
  icon text not null default 'spark',
  category text not null default 'Comercial',
  cadence text not null default 'daily',
  weekdays jsonb not null default '[]'::jsonb,
  result_indicators jsonb not null default '[]'::jsonb,
  effort_indicators jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dm_goals_device_idx on public.dm_goals(device_id);
grant select, insert, update, delete on public.dm_goals to anon, authenticated;
grant all on public.dm_goals to service_role;
alter table public.dm_goals enable row level security;
create policy "dm_goals public read" on public.dm_goals for select using (true);
create policy "dm_goals public write" on public.dm_goals for all using (true) with check (true);
create trigger dm_goals_updated_at before update on public.dm_goals
  for each row execute function public.dm_set_updated_at();

-- TASKS
create table public.dm_tasks (
  id text primary key,
  device_id text not null,
  name text not null,
  category text not null default 'Comercial',
  goal_id text,
  indicator text,
  expected_qty numeric not null default 1,
  unit text not null default 'unid',
  estimated_minutes integer,
  actual_minutes integer,
  contribution_type text default 'direct',
  impact_level text default 'medium',
  time_category text default 'Outro',
  strategic_weight integer default 2,
  planned boolean default true,
  strategic boolean default false,
  measurable boolean default true,
  can_combo boolean default false,
  points_per_unit numeric default 1,
  points_per_completion numeric default 1,
  frequency text not null default 'daily',
  weekdays jsonb not null default '[]'::jsonb,
  weight integer not null default 2,
  points numeric not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dm_tasks_device_idx on public.dm_tasks(device_id);
grant select, insert, update, delete on public.dm_tasks to anon, authenticated;
grant all on public.dm_tasks to service_role;
alter table public.dm_tasks enable row level security;
create policy "dm_tasks public read" on public.dm_tasks for select using (true);
create policy "dm_tasks public write" on public.dm_tasks for all using (true) with check (true);
create trigger dm_tasks_updated_at before update on public.dm_tasks
  for each row execute function public.dm_set_updated_at();

-- EXECUTIONS
create table public.dm_executions (
  id text primary key,
  device_id text not null,
  task_id text not null,
  date date not null,
  quantity numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dm_executions_device_idx on public.dm_executions(device_id);
create index dm_executions_task_date_idx on public.dm_executions(task_id, date);
grant select, insert, update, delete on public.dm_executions to anon, authenticated;
grant all on public.dm_executions to service_role;
alter table public.dm_executions enable row level security;
create policy "dm_executions public read" on public.dm_executions for select using (true);
create policy "dm_executions public write" on public.dm_executions for all using (true) with check (true);
create trigger dm_executions_updated_at before update on public.dm_executions
  for each row execute function public.dm_set_updated_at();

-- SALES
create table public.dm_sales (
  id text primary key,
  device_id text not null,
  date date not null,
  value numeric not null default 0,
  product_id text,
  goal_id text,
  customer text,
  status text not null default 'paid',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dm_sales_device_idx on public.dm_sales(device_id);
grant select, insert, update, delete on public.dm_sales to anon, authenticated;
grant all on public.dm_sales to service_role;
alter table public.dm_sales enable row level security;
create policy "dm_sales public read" on public.dm_sales for select using (true);
create policy "dm_sales public write" on public.dm_sales for all using (true) with check (true);
create trigger dm_sales_updated_at before update on public.dm_sales
  for each row execute function public.dm_set_updated_at();

-- PRODUCTS
create table public.dm_products (
  id text primary key,
  device_id text not null,
  name text not null,
  default_price numeric not null default 0,
  color text not null default '#10b981',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dm_products_device_idx on public.dm_products(device_id);
grant select, insert, update, delete on public.dm_products to anon, authenticated;
grant all on public.dm_products to service_role;
alter table public.dm_products enable row level security;
create policy "dm_products public read" on public.dm_products for select using (true);
create policy "dm_products public write" on public.dm_products for all using (true) with check (true);
create trigger dm_products_updated_at before update on public.dm_products
  for each row execute function public.dm_set_updated_at();

-- TIME LOGS
create table public.dm_time_logs (
  id text primary key,
  device_id text not null,
  task_id text not null,
  goal_id text,
  category text not null default 'Outro',
  date date not null,
  start_at timestamptz,
  end_at timestamptz,
  duration_minutes integer not null default 0,
  contribution_type text not null default 'direct',
  impact_level text not null default 'medium',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dm_time_logs_device_idx on public.dm_time_logs(device_id);
grant select, insert, update, delete on public.dm_time_logs to anon, authenticated;
grant all on public.dm_time_logs to service_role;
alter table public.dm_time_logs enable row level security;
create policy "dm_time_logs public read" on public.dm_time_logs for select using (true);
create policy "dm_time_logs public write" on public.dm_time_logs for all using (true) with check (true);
create trigger dm_time_logs_updated_at before update on public.dm_time_logs
  for each row execute function public.dm_set_updated_at();

-- MEASUREMENTS
create table public.dm_measurements (
  id text primary key,
  device_id text not null,
  goal_id text not null,
  date date not null,
  value numeric not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dm_measurements_device_idx on public.dm_measurements(device_id);
grant select, insert, update, delete on public.dm_measurements to anon, authenticated;
grant all on public.dm_measurements to service_role;
alter table public.dm_measurements enable row level security;
create policy "dm_measurements public read" on public.dm_measurements for select using (true);
create policy "dm_measurements public write" on public.dm_measurements for all using (true) with check (true);
create trigger dm_measurements_updated_at before update on public.dm_measurements
  for each row execute function public.dm_set_updated_at();