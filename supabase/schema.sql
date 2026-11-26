-- PediaSurgRx Supabase Schema (Run in Supabase SQL Editor)

-- 1. Pharmacist's customized formulary state
create table if not exists public.pharmacy_formulary_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  formulary jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.pharmacy_formulary_state enable row level security;

create policy "Users can read own formulary"
  on public.pharmacy_formulary_state for select
  using (auth.uid() = user_id);

create policy "Users can upsert own formulary"
  on public.pharmacy_formulary_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update own formulary"
  on public.pharmacy_formulary_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Saved patient regimens (cloud patient history)
create table if not exists public.patient_regimens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  patient_name text not null,
  mrn text not null default '',
  ward text not null default '',
  weight_kg numeric not null default 10,
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
