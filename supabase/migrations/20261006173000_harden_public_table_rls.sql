begin;

alter table public.support_messages enable row level security;
alter table public.user_preferences enable row level security;
alter table public.journal_records enable row level security;
alter table public.daily_moods enable row level security;
alter table public.moods enable row level security;
alter table public.test enable row level security;
alter table public.journal_ai enable row level security;
alter table public.daily_ai enable row level security;
alter table public.weekly_ai enable row level security;
alter table public.notification_templates enable row level security;
alter table public.bandit_arm_stats enable row level security;
alter table public.user_send_times enable row level security;
alter table public.monthly_ai enable row level security;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = any (array[
        'support_messages',
        'user_preferences',
        'journal_records',
        'daily_moods',
        'moods',
        'test',
        'journal_ai',
        'daily_ai',
        'weekly_ai',
        'notification_templates',
        'bandit_arm_stats',
        'user_send_times',
        'monthly_ai'
      ])
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      existing_policy.policyname,
      existing_policy.schemaname,
      existing_policy.tablename
    );
  end loop;
end
$$;

revoke all on table public.support_messages from public, anon, authenticated;
revoke all on table public.user_preferences from public, anon, authenticated;
revoke all on table public.journal_records from public, anon, authenticated;
revoke all on table public.daily_moods from public, anon, authenticated;
revoke all on table public.moods from public, anon, authenticated;
revoke all on table public.test from public, anon, authenticated;
revoke all on table public.journal_ai from public, anon, authenticated;
revoke all on table public.daily_ai from public, anon, authenticated;
revoke all on table public.weekly_ai from public, anon, authenticated;
revoke all on table public.notification_templates from public, anon, authenticated;
revoke all on table public.bandit_arm_stats from public, anon, authenticated;
revoke all on table public.user_send_times from public, anon, authenticated;
revoke all on table public.monthly_ai from public, anon, authenticated;

grant select, insert, delete on table public.support_messages to authenticated;
grant select, insert, update on table public.user_preferences to authenticated;
grant select, insert, update, delete on table public.journal_records to authenticated;
grant select, insert, update, delete on table public.daily_moods to authenticated;
grant select, insert, update, delete on table public.moods to authenticated;
grant select, insert, update, delete on table public.journal_ai to authenticated;
grant select, insert, update on table public.daily_ai to authenticated;
grant select, insert, update on table public.weekly_ai to authenticated;
grant select, insert, update on table public.monthly_ai to authenticated;

create policy "support messages select own"
on public.support_messages
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "support messages insert own user message"
on public.support_messages
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and is_support is false
);

create policy "support messages delete own"
on public.support_messages
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "user preferences select own"
on public.user_preferences
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "user preferences insert own"
on public.user_preferences
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "user preferences update own"
on public.user_preferences
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "journal records select own"
on public.journal_records
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "journal records insert own"
on public.journal_records
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "journal records update own"
on public.journal_records
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "journal records delete own"
on public.journal_records
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "daily moods select own"
on public.daily_moods
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "daily moods insert own"
on public.daily_moods
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "daily moods update own"
on public.daily_moods
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "daily moods delete own"
on public.daily_moods
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "moods select own"
on public.moods
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "moods insert own"
on public.moods
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "moods update own"
on public.moods
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "moods delete own"
on public.moods
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "journal ai select own"
on public.journal_ai
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "journal ai insert own"
on public.journal_ai
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "journal ai update own"
on public.journal_ai
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "journal ai delete own"
on public.journal_ai
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "daily ai select own"
on public.daily_ai
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "daily ai insert own"
on public.daily_ai
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "daily ai update own"
on public.daily_ai
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "weekly ai select own"
on public.weekly_ai
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "weekly ai insert own"
on public.weekly_ai
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "weekly ai update own"
on public.weekly_ai
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "monthly ai select own"
on public.monthly_ai
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "monthly ai insert own"
on public.monthly_ai
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "monthly ai update own"
on public.monthly_ai
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

commit;
