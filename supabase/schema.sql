-- PediaSurgRx Complete Supabase Schema (Idempotent - Safe to re-run in Supabase SQL Editor)

-- 1. Pharmacist & Admin Profiles (must exist before is_admin() SQL function)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role text not null default 'pharmacist' check (role in ('admin', 'pharmacist')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper function to check if current user is an Admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

drop policy if exists "Users can read own profile or admin reads all" on public.profiles;
create policy "Users can read own profile or admin reads all"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id and role = 'pharmacist' and is_active = true);

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Auto-create profile when a new user signs up in Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'User'), '@', 1)),
    'pharmacist'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill profiles for any already-registered auth users
insert into public.profiles (id, email, display_name, role)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data->>'display_name', split_part(coalesce(email, 'User'), '@', 1)),
  'pharmacist'
from auth.users
on conflict (id) do nothing;

-- 2. Master Medications Formulary (shared across authenticated clinical pharmacists)
create table if not exists public.medications (
  id text primary key,
  trade_name text not null default '',
  generic_name text not null,
  arabic_name text not null default '',
  category text not null,
  diluent text not null default '0.9% NS',
  prep_instructions text not null default '',
  final_conc_mg_ml numeric not null default 1,
  dose_unit text not null default 'mg',
  high_alert boolean not null default false,
  route text not null default 'IV Infusion',
  stability text not null default '24h RT',
  reference text not null default 'Lexidrug Pediatric',
  is_custom boolean not null default false,
  presets jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.medications enable row level security;

drop policy if exists "Authenticated users can read medications" on public.medications;
create policy "Authenticated users can read medications"
  on public.medications for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert medications" on public.medications;
create policy "Authenticated users can insert medications"
  on public.medications for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update medications" on public.medications;
create policy "Authenticated users can update medications"
  on public.medications for update
  to authenticated
  using (true)
  with check (true);

-- 3. Saved patient regimens (cloud patient history)
create table if not exists public.patient_regimens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  patient_name text not null,
  mrn text not null default '',
  ward text not null default '',
  weight_kg numeric not null default 10,
  age_value text default '',
  age_unit text default 'years',
  renal_impairment boolean not null default false,
  base_date text not null,
  default_start_time text not null default '12:00',
  regimen jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.patient_regimens enable row level security;

drop policy if exists "Users can read own patients" on public.patient_regimens;
drop policy if exists "Users can read own patients or admin reads all" on public.patient_regimens;
create policy "Users can read own patients or admin reads all"
  on public.patient_regimens for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can insert own patients" on public.patient_regimens;
create policy "Users can insert own patients"
  on public.patient_regimens for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own patients" on public.patient_regimens;
create policy "Users can update own patients"
  on public.patient_regimens for update
  to authenticated
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can delete own patients" on public.patient_regimens;
create policy "Users can delete own patients"
  on public.patient_regimens for delete
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- 4. Platform Activity & Audit Logs
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null default '',
  user_name text not null default '',
  action text not null,
  details text not null default '',
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

drop policy if exists "Authenticated users can insert own activity logs" on public.activity_logs;
create policy "Authenticated users can insert own activity logs"
  on public.activity_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Only admins can read all activity logs" on public.activity_logs;
create policy "Only admins can read all activity logs"
  on public.activity_logs for select
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- TO PROMOTE AN ACCOUNT TO ADMIN, RUN THIS IN SUPABASE SQL EDITOR:
-- update public.profiles set role = 'admin' where email = 'YOUR_ADMIN_EMAIL';
-- ============================================================================
