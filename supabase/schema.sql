-- PediaSurgRx Complete Supabase Schema (Run in Supabase SQL Editor)

-- 1. Master Medications Formulary (shared across authenticated clinical pharmacists)
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

create policy "Authenticated users can read medications"
  on public.medications for select
  to authenticated
  using (true);

create policy "Authenticated users can insert medications"
  on public.medications for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update medications"
  on public.medications for update
  to authenticated
  using (true)
  with check (true);

-- 2. Saved patient regimens (cloud patient history per pharmacist)
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

create policy "Users can read own patients"
  on public.patient_regimens for select
  using (auth.uid() = user_id);

create policy "Users can insert own patients"
  on public.patient_regimens for insert
  with check (auth.uid() = user_id);

create policy "Users can update own patients"
  on public.patient_regimens for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own patients"
  on public.patient_regimens for delete
  using (auth.uid() = user_id);
