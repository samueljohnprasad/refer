-- Coping cards: user-saved reframes and insights from CBT exercises.
-- Each card stores the reframed thought/belief produced during an exercise,
-- so users can revisit their own wisdom during difficult moments.

create table coping_cards (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  exercise_type     text        not null,
  exercise_entry_id uuid        references exercise_entries(id) on delete set null,
  original_thought  text,
  reframe_text      text        not null,
  reframe_label     text        not null default 'Your reframe',
  starred           boolean     not null default false,
  archived          boolean     not null default false,
  created_at        timestamptz not null default now()
);

-- Users can only access their own cards
alter table coping_cards enable row level security;

create policy "Users manage own coping cards"
  on coping_cards
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Fast retrieval ordered by recency; partial index excludes archived
create index coping_cards_user_active_idx
  on coping_cards (user_id, created_at desc)
  where archived = false;

-- Starred cards need their own ordering lane
create index coping_cards_user_starred_idx
  on coping_cards (user_id, starred, created_at desc)
  where archived = false;
