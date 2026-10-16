-- Migration: 20261015190000_journal_reflection_lineage.sql
-- Description: Creates canonical journal_reflection_lineage table with atomic cascade, RLS, and atomic RPC for CAP-3.

create table if not exists public.journal_reflection_lineage (
  id uuid primary key default gen_random_uuid(),
  journal_record_id bigint not null unique references public.journal_records(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  path_id text not null,
  path_version integer not null,
  practice_session_id uuid not null,
  practice_ref jsonb not null,
  reflection_prompt_id text not null,
  source text not null default 'guided',
  schema_version integer not null default 1,
  created_at timestamptz not null default now(),
  constraint check_guided_source check (source = 'guided')
);

alter table public.journal_reflection_lineage enable row level security;

revoke all on table public.journal_reflection_lineage from public, anon, authenticated;
grant select, insert, update, delete on table public.journal_reflection_lineage to authenticated;

create policy "journal reflection lineage select own"
  on public.journal_reflection_lineage for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "journal reflection lineage insert own"
  on public.journal_reflection_lineage for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "journal reflection lineage update own"
  on public.journal_reflection_lineage for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "journal reflection lineage delete own"
  on public.journal_reflection_lineage for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists idx_journal_reflection_lineage_user_created_at
  on public.journal_reflection_lineage (user_id, created_at desc);

create index if not exists idx_journal_reflection_lineage_record
  on public.journal_reflection_lineage (journal_record_id);

-- Atomic RPC function to create journal record and reflection lineage in a single transaction
create or replace function public.create_guided_reflection_atomic(
  p_title text,
  p_transcripts text,
  p_input_type text,
  p_selected_date timestamptz,
  p_duration_seconds bigint,
  p_words_count integer,
  p_path_id text,
  p_path_version integer,
  p_practice_session_id uuid,
  p_practice_ref jsonb,
  p_reflection_prompt_id text
)
returns jsonb
language plpgsql
security invoker
as $$
declare
  v_user_id uuid;
  v_journal_id bigint;
  v_lineage_id uuid;
  v_result jsonb;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Unauthorized: user not authenticated';
  end if;

  -- 1. Insert into canonical journal_records
  insert into public.journal_records (
    user_id,
    title,
    transcripts,
    input_type,
    selected_date,
    duration_seconds,
    words_count
  ) values (
    v_user_id,
    p_title,
    p_transcripts,
    coalesce(p_input_type, 'text'),
    coalesce(p_selected_date, now()),
    coalesce(p_duration_seconds, 0),
    coalesce(p_words_count, 0)
  )
  returning id into v_journal_id;

  -- 2. Insert into journal_reflection_lineage
  insert into public.journal_reflection_lineage (
    journal_record_id,
    user_id,
    path_id,
    path_version,
    practice_session_id,
    practice_ref,
    reflection_prompt_id,
    source,
    schema_version
  ) values (
    v_journal_id,
    v_user_id,
    p_path_id,
    p_path_version,
    p_practice_session_id,
    p_practice_ref,
    p_reflection_prompt_id,
    'guided',
    1
  )
  returning id into v_lineage_id;

  -- 3. Construct and return result
  select jsonb_build_object(
    'journal_record_id', v_journal_id,
    'lineage_id', v_lineage_id,
    'path_id', p_path_id,
    'path_version', p_path_version,
    'practice_session_id', p_practice_session_id,
    'practice_ref', p_practice_ref,
    'reflection_prompt_id', p_reflection_prompt_id,
    'source', 'guided',
    'schema_version', 1
  ) into v_result;

  return v_result;
end;
$$;
