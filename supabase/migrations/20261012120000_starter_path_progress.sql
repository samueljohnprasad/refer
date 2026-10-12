-- Durable, user-owned StarterPath progress. Path definitions stay in app code.
create table if not exists public.user_starter_path_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  path_id text not null,
  path_version integer not null,
  status text not null default 'active' check (status in ('active', 'completed')),
  last_completed_step text,
  last_idempotency_key text,
  next_action jsonb not null,
  revision bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, path_id, path_version)
);

alter table public.user_preferences
  add column if not exists active_path_id text;

alter table public.user_starter_path_progress
  add column if not exists last_idempotency_key text;

alter table public.user_starter_path_progress enable row level security;

drop policy if exists "starter path progress owner read" on public.user_starter_path_progress;
create policy "starter path progress owner read"
  on public.user_starter_path_progress for select
  using (auth.uid() = user_id);

drop policy if exists "starter path progress owner write" on public.user_starter_path_progress;
create policy "starter path progress owner write"
  on public.user_starter_path_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.user_starter_path_progress from public, anon;
grant select, insert, update, delete on table public.user_starter_path_progress to authenticated;

create or replace function public.complete_starter_path_step(
  p_path_id text,
  p_path_version integer,
  p_expected_revision bigint,
  p_step_id text,
  p_next_action jsonb,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  result_row public.user_starter_path_progress;
begin
  select * into result_row
  from public.user_starter_path_progress
  where user_id = auth.uid()
    and path_id = p_path_id
    and path_version = p_path_version;

  if result_row.last_idempotency_key = p_idempotency_key then
    return to_jsonb(result_row);
  end if;

  update public.user_starter_path_progress
  set last_completed_step = p_step_id,
      last_idempotency_key = p_idempotency_key,
      next_action = p_next_action,
      revision = revision + 1,
      updated_at = now()
  where user_id = auth.uid()
    and path_id = p_path_id
    and path_version = p_path_version
    and revision = p_expected_revision
  returning * into result_row;

  if not found then
    raise exception using errcode = '40001', message = 'starter_path_revision_conflict';
  end if;

  return to_jsonb(result_row);
end;
$$;

grant execute on function public.complete_starter_path_step(text, integer, bigint, text, jsonb, text)
  to authenticated;
