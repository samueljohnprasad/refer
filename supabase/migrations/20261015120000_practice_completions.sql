create table if not exists public.practice_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  practice_session_id uuid not null,
  path_id text,
  path_version integer,
  practice_ref jsonb not null,
  source_kind text not null,
  source_id text not null,
  completion_kind text not null default 'submitted',
  completed_at timestamptz not null default now(),
  evidence_key text not null,
  schema_version integer not null default 1,
  unique (user_id, practice_session_id)
);

alter table public.practice_completions enable row level security;

create policy "Users can read their practice completions"
  on public.practice_completions for select
  using (auth.uid() = user_id);

create policy "Users can create their practice completions"
  on public.practice_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their practice completions"
  on public.practice_completions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists practice_completions_user_completed_at_idx
  on public.practice_completions (user_id, completed_at desc);
