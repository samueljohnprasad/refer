create table if not exists public.insight_time_contexts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  timezone text not null,
  timezone_epoch integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists public.insight_observations (
  observation_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null,
  source_id text not null,
  practice_session_id uuid not null,
  insight_family text not null,
  evidence_key text not null,
  observed_at timestamptz not null,
  local_date date not null,
  timezone text not null,
  timezone_epoch integer not null,
  schema_version integer not null default 1,
  metrics jsonb not null,
  updated_at timestamptz not null default now(),
  unique (user_id, source_id, insight_family)
);

alter table public.insight_time_contexts enable row level security;
alter table public.insight_observations enable row level security;

create policy "Users can manage their insight time context"
  on public.insight_time_contexts for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can read their insight observations"
  on public.insight_observations for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can write their insight observations"
  on public.insight_observations for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their insight observations"
  on public.insight_observations for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists insight_observations_user_observed_at_idx
  on public.insight_observations (user_id, observed_at desc);

create index if not exists insight_observations_user_family_idx
  on public.insight_observations (user_id, insight_family, observed_at desc);
