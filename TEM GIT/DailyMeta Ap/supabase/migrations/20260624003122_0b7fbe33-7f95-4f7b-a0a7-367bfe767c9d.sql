create table if not exists public.dailymeta_app_state (
  device_id text primary key,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  payload jsonb not null
);

grant select, insert, update, delete on public.dailymeta_app_state to anon;
grant select, insert, update, delete on public.dailymeta_app_state to authenticated;
grant all on public.dailymeta_app_state to service_role;

alter table public.dailymeta_app_state enable row level security;

drop policy if exists "Allow public read app state" on public.dailymeta_app_state;
create policy "Allow public read app state"
on public.dailymeta_app_state
for select
using (true);

drop policy if exists "Allow public write app state" on public.dailymeta_app_state;
create policy "Allow public write app state"
on public.dailymeta_app_state
for all
using (true)
with check (true);