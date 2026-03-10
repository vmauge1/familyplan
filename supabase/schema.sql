-- ─── FamilyPlan — Supabase schema ─────────────────────────────────────────
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists calendar_events (
  id           uuid    primary key default gen_random_uuid(),
  date         text    not null unique,   -- 'YYYY-MM-DD'
  vincent_work text,                      -- null | 'M' | 'AM' | 'N' | 'HN' | 'Repos' | 'CP'
  marie_work   text,
  perso        jsonb   not null default '[]',
  updated_at   timestamptz default now()
);

-- Index for fast date lookups
create index if not exists idx_calendar_events_date on calendar_events (date);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_calendar_events_updated_at
  before update on calendar_events
  for each row execute function set_updated_at();

-- Enable Row Level Security (RLS)
alter table calendar_events enable row level security;

-- ── Option A: fully public (no auth, everyone can read & write) ────────────
-- Use this for a family-only app without login
create policy "public_all" on calendar_events
  for all using (true) with check (true);

-- ── Option B: authenticated users only (uncomment to use) ─────────────────
-- drop policy if exists "public_all" on calendar_events;
-- create policy "auth_read"  on calendar_events for select using (auth.role() = 'authenticated');
-- create policy "auth_write" on calendar_events for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Enable Realtime
alter publication supabase_realtime add table calendar_events;
