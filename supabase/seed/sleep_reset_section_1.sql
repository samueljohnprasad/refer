-- Sleep Reset, Section 1: How Sleep Actually Works
-- Canonical server seed for the Sleep Reset course.
-- Run this after the Journey v5 schema migration to insert Sleep Reset as a
-- new published course. Stable UUIDs and upserts make accidental reruns safe.

BEGIN;

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS domain TEXT,
  ADD COLUMN IF NOT EXISTS target_audience TEXT,
  ADD COLUMN IF NOT EXISTS total_lessons INT,
  ADD COLUMN IF NOT EXISTS total_duration_weeks INT,
  ADD COLUMN IF NOT EXISTS sessions_per_week INT,
  ADD COLUMN IF NOT EXISTS session_duration_minutes INT[];

ALTER TABLE sections
  ADD COLUMN IF NOT EXISTS narrative_hook TEXT,
  ADD COLUMN IF NOT EXISTS badge_on_complete TEXT,
  ADD COLUMN IF NOT EXISTS difficulty_range NUMERIC[],
  ADD COLUMN IF NOT EXISTS objectives JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS concepts_introduced TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE nodes
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS new_concepts TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS review_concepts TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prerequisites TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE nodes DROP CONSTRAINT IF EXISTS nodes_type_check;
ALTER TABLE nodes
  ADD CONSTRAINT nodes_type_check
  CHECK (
    type IN (
      'lesson',
      'story',
      'quiz',
      'exercise',
      'practice',
      'challenge',
      'boss',
      'mood_check',
      'journal',
      'checkpoint',
      'chest',
      'trophy',
      'ai_insight'
    )
  );

CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  order_index INT NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  phase TEXT,
  duration_seconds INT,
  scaffold_level INT,
  difficulty NUMERIC,
  is_scored BOOLEAN NOT NULL DEFAULT false,
  concept TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (node_id, order_index)
);

CREATE INDEX IF NOT EXISTS idx_exercises_node_order
  ON exercises(node_id, order_index);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON exercises TO authenticated;
GRANT ALL ON exercises TO service_role;

DO $policy$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'exercises'
      AND policyname = 'read_exercises'
  ) THEN
    CREATE POLICY read_exercises
      ON exercises
      FOR SELECT
      USING (auth.role() = 'authenticated');
  END IF;
END
$policy$;

CREATE TEMP TABLE seed_sleep_reset_context (
  initialized BOOLEAN NOT NULL
) ON COMMIT DROP;

CREATE OR REPLACE FUNCTION pg_temp.seed_uuid(seed_value TEXT)
RETURNS UUID
LANGUAGE SQL
IMMUTABLE
STRICT
AS $function$
  SELECT (
    substr(md5(seed_value), 1, 8) || '-' ||
    substr(md5(seed_value), 9, 4) || '-' ||
    substr(md5(seed_value), 13, 4) || '-' ||
    substr(md5(seed_value), 17, 4) || '-' ||
    substr(md5(seed_value), 21, 12)
  )::uuid;
$function$;

CREATE OR REPLACE FUNCTION pg_temp.text_array(input_json JSONB)
RETURNS TEXT[]
LANGUAGE SQL
IMMUTABLE
AS $function$
  SELECT COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(input_json, '[]'::jsonb))),
    '{}'::text[]
  );
$function$;

CREATE OR REPLACE FUNCTION pg_temp.numeric_array(input_json JSONB)
RETURNS NUMERIC[]
LANGUAGE SQL
IMMUTABLE
AS $function$
  SELECT COALESCE(
    ARRAY(
      SELECT value::numeric
      FROM jsonb_array_elements_text(COALESCE(input_json, '[]'::jsonb))
    ),
    '{}'::numeric[]
  );
$function$;

WITH curriculum AS (
  SELECT *
  FROM jsonb_to_recordset('[{"source_id":"sleep-reset","title":"Sleep Reset","description":"Reclaim your nights, one small shift at a time","icon_url":"sleep-reset","color_hex":"5F7F58","order_index":0,"is_published":true,"domain":"sleep_wellness","target_audience":"Adults struggling with sleep onset, quality, or restless nights","total_lessons":10,"total_duration_weeks":2,"sessions_per_week":5,"session_duration_minutes":[3,7]}]'::jsonb) AS row(
    source_id TEXT,
    title TEXT,
    description TEXT,
    icon_url TEXT,
    color_hex TEXT,
    order_index INT,
    is_published BOOLEAN,
    domain TEXT,
    target_audience TEXT,
    total_lessons INT,
    total_duration_weeks INT,
    sessions_per_week INT,
    session_duration_minutes JSONB
  )
)
INSERT INTO courses (
  id,
  title,
  description,
  icon_url,
  color_hex,
  order_index,
  is_published,
  domain,
  target_audience,
  total_lessons,
  total_duration_weeks,
  sessions_per_week,
  session_duration_minutes
)
SELECT
  pg_temp.seed_uuid(source_id),
  title,
  description,
  icon_url,
  color_hex,
  order_index,
  is_published,
  domain,
  target_audience,
  total_lessons,
  total_duration_weeks,
  sessions_per_week,
  pg_temp.text_array(session_duration_minutes)::INT[]
FROM curriculum
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon_url = EXCLUDED.icon_url,
  color_hex = EXCLUDED.color_hex,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  domain = EXCLUDED.domain,
  target_audience = EXCLUDED.target_audience,
  total_lessons = EXCLUDED.total_lessons,
  total_duration_weeks = EXCLUDED.total_duration_weeks,
  sessions_per_week = EXCLUDED.sessions_per_week,
  session_duration_minutes = EXCLUDED.session_duration_minutes;

WITH curriculum AS (
  SELECT *
  FROM jsonb_to_recordset('[{"source_id":"s1_sleep_science","course_source_id":"sleep-reset","title":"How Sleep Actually Works","order_index":1,"narrative_hook":"You can''t fix what you don''t understand. Let''s demystify the engine.","badge_on_complete":"Sleep Scientist","difficulty_range":[0.1,0.3],"objectives":{"remember":"Name the three first sleep levers: sleep pressure, body clock, and arousal.","understand":"Explain sleep as a body rhythm, not a willpower test.","apply":"Choose one low-pressure cue without turning a hard night into self-blame."},"concepts_introduced":["sleep_levers","self_blame_reframe","body_clock","arousal","tiny_reset_cue","sleep_architecture","sleep_cycles","sleep_composition","circadian_rhythm","sleep_pressure","caffeine_sleep","alcohol_sleep","light_stress_disruptors","sleep_experiment"]}]'::jsonb) AS row(
    source_id TEXT,
    course_source_id TEXT,
    title TEXT,
    order_index INT,
    narrative_hook TEXT,
    badge_on_complete TEXT,
    difficulty_range JSONB,
    objectives JSONB,
    concepts_introduced JSONB
  )
)
INSERT INTO sections (
  id,
  course_id,
  title,
  order_index,
  narrative_hook,
  badge_on_complete,
  difficulty_range,
  objectives,
  concepts_introduced
)
SELECT
  pg_temp.seed_uuid(source_id),
  pg_temp.seed_uuid(course_source_id),
  title,
  order_index,
  narrative_hook,
  badge_on_complete,
  pg_temp.numeric_array(difficulty_range),
  objectives,
  pg_temp.text_array(concepts_introduced)
FROM curriculum
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  narrative_hook = EXCLUDED.narrative_hook,
  badge_on_complete = EXCLUDED.badge_on_complete,
  difficulty_range = EXCLUDED.difficulty_range,
  objectives = EXCLUDED.objectives,
  concepts_introduced = EXCLUDED.concepts_introduced;

WITH curriculum AS (
  SELECT *
  FROM jsonb_to_recordset('[{"source_id":"u1_1_sleep_mechanics","section_source_id":"s1_sleep_science","title":"Sleep Is Body Rhythm","icon_key":"unit-icon","order_index":1},{"source_id":"u1_2_sleep_disruptors","section_source_id":"s1_sleep_science","title":"What''s Stealing Your Sleep","icon_key":"unit-icon","order_index":2}]'::jsonb) AS row(
    source_id TEXT,
    section_source_id TEXT,
    title TEXT,
    icon_key TEXT,
    order_index INT
  )
)
INSERT INTO units (id, section_id, title, icon_key, order_index)
SELECT
  pg_temp.seed_uuid(source_id),
  pg_temp.seed_uuid(section_source_id),
  title,
  icon_key,
  order_index
FROM curriculum
ON CONFLICT (id) DO UPDATE SET
  section_id = EXCLUDED.section_id,
  title = EXCLUDED.title,
  icon_key = EXCLUDED.icon_key,
  order_index = EXCLUDED.order_index;

WITH curriculum AS (
  SELECT *
  FROM jsonb_to_recordset('[{"source_id":"u1_1_sleep_mechanics-n1","unit_source_id":"u1_1_sleep_mechanics","title":"Three Sleep Levers","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":0,"estimated_mins":4,"icon":"book","new_concepts":["sleep_levers","sleep_pressure","body_clock","arousal","self_blame_reframe"],"review_concepts":[],"prerequisites":[]},{"source_id":"u1_1_sleep_mechanics-n2","unit_source_id":"u1_1_sleep_mechanics","title":"Sleep Pressure and Sleep Cycles","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":1,"estimated_mins":6,"icon":"book","new_concepts":["sleep_pressure","sleep_cycles","sleep_architecture"],"review_concepts":["self_blame_reframe"],"prerequisites":[]},{"source_id":"u1_1_sleep_mechanics-n3","unit_source_id":"u1_1_sleep_mechanics","title":"Body Clock Cues","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":2,"estimated_mins":6,"icon":"book","new_concepts":["body_clock","circadian_rhythm"],"review_concepts":["sleep_pressure","self_blame_reframe"],"prerequisites":[]},{"source_id":"u1_1_sleep_mechanics-n4","unit_source_id":"u1_1_sleep_mechanics","title":"Arousal Reset","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":3,"estimated_mins":5,"icon":"book","new_concepts":["arousal","tiny_reset_cue"],"review_concepts":["sleep_pressure","body_clock","self_blame_reframe"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n1","unit_source_id":"u1_2_sleep_disruptors","title":"The Sleep Pressure System","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":0,"estimated_mins":5,"icon":"book","new_concepts":["sleep_pressure"],"review_concepts":["circadian_rhythm"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n2","unit_source_id":"u1_2_sleep_disruptors","title":"Caffeine and Sleep Pressure","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":1,"estimated_mins":5,"icon":"book","new_concepts":["caffeine_sleep"],"review_concepts":["sleep_pressure"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n3","unit_source_id":"u1_2_sleep_disruptors","title":"Alcohol and Sleep Quality","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":2,"estimated_mins":5,"icon":"book","new_concepts":["alcohol_sleep"],"review_concepts":["sleep_cycles","sleep_pressure"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n4","unit_source_id":"u1_2_sleep_disruptors","title":"Light, Stress and Wake-Time Drift","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":3,"estimated_mins":6,"icon":"book","new_concepts":["light_stress_disruptors"],"review_concepts":["sleep_pressure","circadian_rhythm"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n5","unit_source_id":"u1_2_sleep_disruptors","title":"Sleep Science Checkpoint","type":"checkpoint","content_type":"checkpoint","pass_threshold":80,"order_index":4,"estimated_mins":3,"icon":"checkpoint","new_concepts":[],"review_concepts":["sleep_architecture","sleep_cycles","circadian_rhythm","sleep_pressure","caffeine_sleep","alcohol_sleep","light_stress_disruptors"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n6_experiment","unit_source_id":"u1_2_sleep_disruptors","title":"Run One Small Sleep Experiment","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":5,"estimated_mins":6,"icon":"book","new_concepts":["sleep_experiment"],"review_concepts":["light_stress_disruptors","sleep_pressure","circadian_rhythm","tiny_reset_cue"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n6_claim","unit_source_id":"u1_2_sleep_disruptors","title":"Claim: sleep_scientist","type":"chest","content_type":"chest","pass_threshold":null,"order_index":6,"estimated_mins":0,"icon":"chest","new_concepts":[],"review_concepts":[],"prerequisites":[]},{"source_id":"u1_1_sleep_mechanics-n5_chest","unit_source_id":"u1_1_sleep_mechanics","title":"Claim: Mechanics Insight","type":"chest","content_type":"chest","pass_threshold":null,"order_index":4,"estimated_mins":0,"icon":"chest","new_concepts":[],"review_concepts":[],"prerequisites":[]},{"source_id":"u1_1_sleep_mechanics-n6_trophy","unit_source_id":"u1_1_sleep_mechanics","title":"Trophy: Sleep Mechanics","type":"trophy","content_type":"trophy","pass_threshold":null,"order_index":5,"estimated_mins":0,"icon":"trophy","new_concepts":[],"review_concepts":[],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n8_trophy","unit_source_id":"u1_2_sleep_disruptors","title":"Trophy: Sleep Disruptors","type":"trophy","content_type":"trophy","pass_threshold":null,"order_index":7,"estimated_mins":0,"icon":"trophy","new_concepts":[],"review_concepts":[],"prerequisites":[]}]'::jsonb) AS row(
    source_id TEXT,
    unit_source_id TEXT,
    title TEXT,
    type TEXT,
    content_type TEXT,
    pass_threshold INT,
    order_index INT,
    estimated_mins INT,
    icon TEXT,
    new_concepts JSONB,
    review_concepts JSONB,
    prerequisites JSONB
  )
)
INSERT INTO nodes (
  id,
  unit_id,
  title,
  type,
  content_id,
  content_type,
  pass_threshold,
  order_index,
  estimated_mins,
  icon,
  new_concepts,
  review_concepts,
  prerequisites
)
SELECT
  pg_temp.seed_uuid(source_id),
  pg_temp.seed_uuid(unit_source_id),
  title,
  type,
  pg_temp.seed_uuid(source_id),
  content_type,
  pass_threshold,
  order_index,
  estimated_mins,
  icon,
  pg_temp.text_array(new_concepts),
  pg_temp.text_array(review_concepts),
  pg_temp.text_array(prerequisites)
FROM curriculum
ON CONFLICT (id) DO UPDATE SET
  unit_id = EXCLUDED.unit_id,
  title = EXCLUDED.title,
  type = EXCLUDED.type,
  content_id = EXCLUDED.content_id,
  content_type = EXCLUDED.content_type,
  pass_threshold = EXCLUDED.pass_threshold,
  order_index = EXCLUDED.order_index,
  estimated_mins = EXCLUDED.estimated_mins,
  icon = EXCLUDED.icon,
  new_concepts = EXCLUDED.new_concepts,
  review_concepts = EXCLUDED.review_concepts,
  prerequisites = EXCLUDED.prerequisites;


-- Cleanup removed exercises for u1_1_sleep_mechanics-n1
DELETE FROM exercises WHERE id IN (
  pg_temp.seed_uuid('u1_l1_sleep_lever_shelf'),
  pg_temp.seed_uuid('u1_l1_match_sleep_levers')
);


-- Cleanup removed exercises for Section 1 Cognitive Load Audit
DELETE FROM exercises WHERE id IN (
  pg_temp.seed_uuid('u1_l2_recall_warmup'),
  pg_temp.seed_uuid('u1_l2_pressure_terms'),
  pg_temp.seed_uuid('u1_l2_changed_night'),
  pg_temp.seed_uuid('u1_l2_pressure_action'),
  pg_temp.seed_uuid('u1_l3_cue_vs_rule'),
  pg_temp.seed_uuid('u1_l3_private_timing_check'),
  pg_temp.seed_uuid('u1_l3_clock_action'),
  pg_temp.seed_uuid('u1_l5_process_terms'),
  pg_temp.seed_uuid('u1_l5_model_takeaway'),
  pg_temp.seed_uuid('u1_l6_caffeine_curiosity'),
  pg_temp.seed_uuid('u1_l6_caffeine_plan'),
  pg_temp.seed_uuid('u1_l7_alcohol_match'),
  pg_temp.seed_uuid('u1_l7_alcohol_private_check'),
  pg_temp.seed_uuid('u1_l8_disruptor_diary'),
  pg_temp.seed_uuid('u1_l8_evening_comparison'),
  pg_temp.seed_uuid('u1_l8_wake_drift_what_if'),
  pg_temp.seed_uuid('u1_l8_disruptor_plan'),
  pg_temp.seed_uuid('u1_l10_experiment_recall'),
  pg_temp.seed_uuid('u1_l10_experiment_story'),
  pg_temp.seed_uuid('u1_l10_experiment_choice')
);

WITH curriculum AS (
  SELECT *
  FROM jsonb_to_recordset('[{"source_id":"u1_l1_sleep_system_intuition","node_source_id":"u1_1_sleep_mechanics-n1","order_index":0,"type":"intuition_check","phase":"warmup","duration_seconds":20,"scaffold_level":1,"difficulty":0.1,"is_scored":false,"concept":"self_blame_reframe","content":{"category":"intuition_check","format":"intuition_check","completionMode":"direct","title":"What does your gut say?","prompt":"After a bad night, what gives you more control next?","options":[{"id":"effort","label":"Trying harder to make sleep happen"},{"id":"system","label":"Understanding the sleep system"}],"bestOptionId":"system","reveal":"Pressure, clock, and arousal shape sleep. They shift without you failing.","alternateReveal":"Effort raises arousal. The sleep map is a kinder tool.","primaryLabel":"Continue","waitingPrimaryLabel":"Choose above"}},{"source_id":"u1_l1_three_sleep_levers","node_source_id":"u1_1_sleep_mechanics-n1","order_index":1,"type":"learn_cards","phase":"introduce","duration_seconds":30,"scaffold_level":2,"difficulty":0.15,"is_scored":false,"concept":"sleep_levers","content":{"category":"learn_cards","format":"learn_cards","title":"Meet the three levers","instruction":"Three short cards, then one quick recall.","primaryLabel":"Continue","waitingPrimaryLabel":"Continue","cards":[{"id":"sleep-pressure","kicker":"Lever 1 of 3","title":"Sleep pressure","body":"The need for sleep builds while you are awake. Sleep and naps release some of that pressure."},{"id":"body-clock","kicker":"Lever 2 of 3","title":"Body clock","body":"Light and repeated wake times help your body expect sleep and alertness at roughly the right time."},{"id":"arousal","kicker":"Lever 3 of 3","title":"Arousal","body":"Your body can be tired and still alert. Worry, clock-checking, and trying to force sleep can turn this lever up."}]}},{"source_id":"u1_l1_use_sleep_map","node_source_id":"u1_1_sleep_mechanics-n1","order_index":2,"type":"lever_scenario","phase":"challenge","duration_seconds":50,"scaffold_level":3,"difficulty":0.22,"is_scored":true,"concept":"self_blame_reframe","content":{"category":"lever_scenario","format":"lever_scenario","completionMode":"direct","title":"Use the sleep map","instruction":"Read the moment, then choose the most useful explanation.","capability":"You can read a hard night without blaming yourself.","variants":[{"sceneLabel":"TUESDAY · 11:40PM","scene":"• Awake since 7am\n• Checks work email at 11:40pm\n• Heart starts racing","prompt":"Which reading is most useful?","clue":"She is already tired. Look for the lever that explains alertness.","worked":"The email raised arousal. A hard night here is an alertness problem, not personal failure.","options":[{"id":"arousal","label":"Arousal spiked (Stress)","isCorrect":true,"feedback":"Yes. She''s tired, but her body is on alert. Reduce effort to let alertness drop."},{"id":"more-pressure","label":"Pressure dropped (Not tired)","feedback":"She''s already tired. The issue is high alertness from the email, not lack of pressure."},{"id":"missed-window","label":"Missed sleep window","feedback":"Myths about ''windows'' add stress. The real clue is the work email raised alertness."}]},{"sceneLabel":"SATURDAY · 10:30PM","scene":"• 2-hour evening nap\n• Feels calm\n• Not sleepy at 10:30pm","prompt":"Which reading is most useful now?","clue":"He is calm. Think about what sleep does to built-up pressure.","worked":"The evening nap released sleep pressure. He is not broken; sleep need will build later.","options":[{"id":"lower-pressure","label":"Pressure dropped (Nap)","isCorrect":true,"feedback":"Right. The nap released sleep pressure. Nothing is broken."},{"id":"clock-shifted","label":"Clock shifted (Weekend)","feedback":"While true, the nap directly burnt off the sleep pressure needed for bedtime."},{"id":"force-sleep","label":"Must try harder","feedback":"Trying harder raises arousal. Better to just wait for pressure to rebuild."}]}],"waitingPrimaryLabel":"Choose above"}},{"source_id":"u1_l2_sleep_cycle_myth","node_source_id":"u1_1_sleep_mechanics-n2","order_index":0,"type":"concept_card","phase":"teach","duration_seconds":30,"scaffold_level":1,"difficulty":0.08,"is_scored":false,"concept":"sleep_cycles","content":{"category":"concept_card","format":"concept_card","completionMode":"direct","variant":"myth","title":"One waking is not a broken night","primaryLabel":"Continue","myth":"Waking at 3am means my sleep system has failed.","reality":"Sleep moves through changing cycles.\n\nLater sleep often has more REM, so vivid dreams and brief wakings can happen without meaning anything is broken.","note":"A less frightening explanation leaves room for sleep to return."}},{"source_id":"u1_l2_pressure_cards","node_source_id":"u1_1_sleep_mechanics-n2","order_index":1,"type":"learn_cards","phase":"introduce","duration_seconds":75,"scaffold_level":1,"difficulty":0.12,"is_scored":true,"concept":"sleep_pressure","content":{"category":"learn_cards","format":"learn_cards","title":"Sleep pressure builds","cards":[{"id":"pressure-builds","kicker":"THE NEED","title":"Pressure builds while awake","body":"Time awake gradually increases the need for sleep. Sleep lowers that pressure; a long nap can lower it before bedtime."},{"id":"early-night","kicker":"EARLY NIGHT","title":"Early sleep is deeper","body":"Deep sleep is usually more common earlier in the night. This is one reason the first part of sleep can feel physically restorative."},{"id":"late-night","kicker":"LATE NIGHT","title":"Later sleep has more REM","body":"REM sleep tends to occupy more of the later cycles. A brief waking then is not proof that your sleep is broken."}],"recall":{"prompt":"After a long evening nap, which lever may be lower at bedtime?","correctOptionId":"pressure","options":[{"id":"pressure","label":"Sleep pressure"},{"id":"arousal","label":"Arousal"},{"id":"clock","label":"Body clock"}]},"feedback_correct":"Right. The nap released some sleep pressure.","feedback_incorrect":"A long nap can lower the sleep pressure that would otherwise build toward bedtime.","workedExample":"Sleep pressure builds during wakefulness and is released by sleep or naps. Sleep stages also shift across the night."}},{"source_id":"u1_l3_evening_comparison","node_source_id":"u1_1_sleep_mechanics-n3","order_index":0,"type":"evening_comparison","phase":"compare","duration_seconds":45,"scaffold_level":2,"difficulty":0.16,"is_scored":false,"concept":"circadian_rhythm","content":{"category":"evening_comparison","format":"evening_comparison","completionMode":"direct","primaryLabel":"Continue","title":"Two weeks, one body clock","columns":[{"heading":"Week A","rows":["Wake time shifts 3 hours","Workday light only","Groggy Monday"],"outcome":"Mixed timing cues"},{"heading":"Week B","rows":["Wake time stays within 1 hour","Morning light daily","Stable Monday"],"outcome":"Clearer timing cues"}],"explanation":"Consistent cues help your body clock stay predictable."}},{"source_id":"u1_l3_clock_diary","node_source_id":"u1_1_sleep_mechanics-n3","order_index":1,"type":"annotated_diary","phase":"notice","duration_seconds":45,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"body_clock","content":{"category":"annotated_diary","format":"annotated_diary","completionMode":"direct","primaryLabel":"Continue","title":"A timing thought, annotated","instruction":"See the cue, the story, and the kinder reading.","diary":"“I was not sleepy at 10pm. My body clock is broken, so tomorrow will be awful.”","annotation":"The first sentence is an observation. The second turns one evening into a verdict. Light, wake time, and routine can shift timing gradually; one late night is not proof of failure.","note":"Keep the observation. Drop the verdict."}},{"source_id":"u1_l4_alarm_dialogue","node_source_id":"u1_1_sleep_mechanics-n4","order_index":0,"type":"dialogue","phase":"notice","duration_seconds":45,"scaffold_level":1,"difficulty":0.1,"is_scored":false,"concept":"arousal","content":{"category":"dialogue","format":"dialogue","completionMode":"direct","title":"Two voices at 2:17am","instruction":"Tap through the tired body and the alarm story.","beats":[{"id":"body","type":"passive","speaker":"Tired body","side":"left","message":"I feel heavy. I want to rest.","historySummary":"Body wants rest"},{"id":"alarm","type":"passive","speaker":"Alarm story","side":"right","message":"Check the time again. If you do not sleep now, tomorrow is ruined.","historySummary":"Alarm demands sleep"},{"id":"body-again","type":"passive","speaker":"Tired body","side":"left","message":"I am tired and alert at the same time. That feels bad, but it is not proof I am broken.","historySummary":"Alert but not broken"},{"id":"map","type":"passive","speaker":"A kinder map","side":"right","message":"Arousal can keep the body watchful. Lower the fight; do not demand instant sleep.","historySummary":"Lower the fight"}],"insight":"Sleep pressure and arousal can point in different directions. Naming the alert system gives you room to soften it."}},{"source_id":"u1_l4_try_harder_paradox","node_source_id":"u1_1_sleep_mechanics-n4","order_index":1,"type":"paradox_card","phase":"experiment","duration_seconds":45,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"arousal","content":{"category":"paradox_card","format":"paradox_card","completionMode":"direct","title":"Try harder to sleep","instruction":"Push the button and watch what the alarm learns.","expectation":"More effort should make sleep happen faster. That is how effort works for most tasks.","reality":"“SLEEP NOW” sounds like an emergency. Clock-checking and forcing keep attention on threat.","openingCaption":"It is 2:17am. What happens when you push harder?","captions":["You tell yourself to relax. Now you are checking whether you are relaxed.","You count the hours left. The alarm hears a deadline.","Your body gets more watchful because the struggle is still active.","The harder you push, the more sleep becomes a performance test."],"stopCaption":"You stop pushing. Feet on the floor, one longer exhale, and room for the wave to pass.","rule":"Forcing calm can feed the alarm.","takeaway":"Stopping the struggle is not giving up. It removes one source of fuel and lets the body settle in its own time.","expectationHeading":"Expectation","expectationText":"More effort → sleep faster","resultHeading":"What happened","resultText":"More effort → more alertness","gaugeHeading":"Body alertness","gaugeLeftLabel":"Calm","gaugeRightLabel":"Wired","explanationHeading":"Why this happens","explanationText":"Sleep is an involuntary process. The more you try to force it, the more your brain treats being awake as a threat, which triggers your fight-or-flight response and keeps you awake."}},{"source_id":"u1_l4_sleep_thought_experiment","node_source_id":"u1_1_sleep_mechanics-n4","order_index":2,"type":"white_bear_experiment","phase":"experiment","duration_seconds":45,"scaffold_level":2,"difficulty":0.12,"is_scored":false,"concept":"arousal","content":{"category":"white_bear_experiment","format":"white_bear_experiment","completionMode":"direct","title":"Do not think about sleep","instruction":"For ten seconds, whatever you do, do not think about sleep.","options":[{"id":"thought","label":"Sleep came to mind quickly"},{"id":"monitoring","label":"I kept checking whether I was thinking about sleep"}],"rule":"Thought suppression can keep the thought active.","body":"Trying not to think about sleep makes you monitor for sleep. That monitoring keeps attention switched on. This is one reason “just stop thinking” can backfire at night.","fix":"The counter-move is softer: notice the thought, then return attention to a neutral body cue without arguing with it."}},{"source_id":"u1_l4_arousal_timer","node_source_id":"u1_1_sleep_mechanics-n4","order_index":3,"type":"surge_timer","phase":"understand","duration_seconds":45,"scaffold_level":2,"difficulty":0.1,"is_scored":false,"concept":"arousal","content":{"category":"surge_timer","format":"surge_timer","completionMode":"direct","primaryLabel":"Continue","title":"The alert wave has a timer","instruction":"Move the slider and watch the body’s surge fade.","numberToKeep":"the peak does not last forever. The body can begin settling even before you find the perfect technique."}},{"source_id":"u1_l4_long_exhale","node_source_id":"u1_1_sleep_mechanics-n4","order_index":4,"type":"breathing_round","phase":"practice","duration_seconds":60,"scaffold_level":2,"difficulty":0.12,"is_scored":false,"concept":"tiny_reset_cue","content":{"category":"breathing_round","format":"breathing_round","completionMode":"direct","primaryLabel":"Continue","title":"One longer exhale","instruction":"One gentle round to ease alertness.","variation":"The goal is less struggling, not instant sleep."}},{"source_id":"u1_l5_two_process_layers","node_source_id":"u1_2_sleep_disruptors-n1","order_index":0,"type":"layer_zoom","phase":"trace","duration_seconds":50,"scaffold_level":1,"difficulty":0.16,"is_scored":false,"concept":"sleep_pressure","content":{"title":"Zoom in on the late nap","instruction":"Zoom in one layer at a time.","layers":[{"id":"nap-layer-event","label":"Event","title":"A long nap ends at 6pm","body":"At 11pm, the person feels calm but is not sleepy yet."},{"id":"nap-layer-pressure","label":"Sleep pressure","title":"Sleep pressure is lower","body":"The nap released some of the need that usually builds across the evening."},{"id":"nap-layer-timing","label":"Timing","title":"The body clock keeps its rhythm","body":"Clock timing and sleep pressure are meeting differently tonight, which explains the pattern without diagnosing the person."}],"insight":"Late sleep can reflect changed pressure, timing, or both; the model offers a clue, not a verdict."}},{"source_id":"u1_l5_two_process_story","node_source_id":"u1_2_sleep_disruptors-n1","order_index":1,"type":"story_walkthrough","phase":"story","duration_seconds":60,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"sleep_pressure","content":{"category":"story_walkthrough","format":"story_walkthrough","completionMode":"direct","primaryLabel":"Next","title":"Mina’s two-process night","instruction":"Tap through the night at your pace.","beats":[{"id":"nap","kicker":"6PM · THE NAP","title":"Pressure gets a release","body":"Mina wakes from a long nap feeling better. The nap has also released some sleep pressure before bedtime.","icon":"moon"},{"id":"bedtime","kicker":"11PM · THE MISMATCH","title":"Calm, but not sleepy","body":"Her body clock is moving toward night, but the need for sleep is lower than usual. The two systems are not lining up in the same way tonight.","icon":"activity"},{"id":"next-day","kicker":"THE NEXT CLUE","title":"One night is not a diagnosis","body":"Mina notes the nap, the timing, and how the night unfolds. She gathers a pattern instead of turning one night into a verdict.","icon":"zap"}],"insight":{"title":"The useful question","body":"When pressure and clock timing do not line up, observe the pattern. The goal is understanding, not perfect control."}}},{"source_id":"u1_l5_two_process_check","node_source_id":"u1_2_sleep_disruptors-n1","order_index":2,"type":"course_choice","phase":"apply","duration_seconds":45,"scaffold_level":3,"difficulty":0.2,"is_scored":true,"concept":"sleep_pressure","content":{"category":"course_choice","format":"course_choice","title":"Use both parts of the map","instruction":"Choose the explanation that fits best.","context":"Ravi sleeps late after a long evening nap. The next morning, he wakes at his usual time but feels groggy.","prompt":"Which reading uses the two-process model without blame?","options":[{"id":"both","label":"The nap changed sleep pressure, while the usual wake cue still shaped morning timing","isCorrect":true,"feedback":"Right. The nap and the regular wake cue can both matter. One night does not prove a broken system."},{"id":"pressure-only","label":"Only sleep pressure matters; timing cues do nothing","feedback":"The model has two parts. A nap may change pressure while the body clock keeps its own rhythm."},{"id":"willpower","label":"Ravi should force an earlier bedtime to make up for it","feedback":"Forcing a schedule is not the model. Start by observing which part changed."}],"feedbackTitle":"Two clues, one night","feedbackTakeaway":"You can use a sleep model without turning it into a new rule to fear.","workedExample":"A late nap can lower sleep pressure, while a regular wake cue still arrives in the morning. Both signals can be true at once.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l6_caffeine_evidence","node_source_id":"u1_2_sleep_disruptors-n2","order_index":0,"type":"evidence_bite","phase":"understand","duration_seconds":45,"scaffold_level":1,"difficulty":0.1,"is_scored":false,"concept":"caffeine_sleep","content":{"category":"evidence_bite","format":"evidence_bite","completionMode":"direct","primaryLabel":"Continue","title":"The caffeine clue","instruction":"One finding, with its limits.","finding":"Caffeine can make you feel less sleepy while the underlying need for sleep is still building.","confidence":"Strong","confidenceWhy":"Caffeine’s sleep effects are well studied, but the timing and size of the effect vary with dose, biology, medicines, pregnancy, and sensitivity.","note":"The evidence supports a pattern question, not one universal cutoff for everyone."}},{"source_id":"u1_l6_caffeine_what_if","node_source_id":"u1_2_sleep_disruptors-n2","order_index":1,"type":"what_if_machine","phase":"experiment","duration_seconds":60,"scaffold_level":2,"difficulty":0.16,"is_scored":false,"concept":"caffeine_sleep","content":{"category":"what_if_machine","format":"what_if_machine","completionMode":"direct","title":"What if you move one drink earlier?","instruction":"Predict first, then run the small experiment.","options":[{"id":"clearer","label":"Sleepiness may feel clearer later"},{"id":"same","label":"Nothing will change at all"},{"id":"worse","label":"One change will prove the whole answer"}],"steps":["Choose one usual drink and note its time and amount.","For a few comparable nights, move only that drink earlier or leave it unchanged.","Notice bedtime sleepiness, settling, and next-morning rest, not just one moment.","Use the pattern as information. Keep what helps; drop the rule if it does not fit."],"rule":"One small comparison beats a universal caffeine rule.","takeaway":"The aim is not to prove caffeine is good or bad. It is to learn whether timing and amount matter for you."}},{"source_id":"u1_l6_caffeine_scenario","node_source_id":"u1_2_sleep_disruptors-n2","order_index":2,"type":"course_choice","phase":"transfer","duration_seconds":45,"scaffold_level":3,"difficulty":0.2,"is_scored":true,"concept":"caffeine_sleep","content":{"category":"course_choice","format":"course_choice","title":"Read the afternoon coffee","instruction":"Choose the most careful explanation.","context":"Priya drinks a large coffee at 3pm and feels wired at 11pm. She wants to know whether the coffee could be part of the pattern.","prompt":"What is the best next step?","options":[{"id":"observe","label":"Compare caffeine timing and sleep across several nights","isCorrect":true,"feedback":"Yes. A pattern is more useful than a single guess."},{"id":"certain","label":"Assume the coffee is definitely the only cause","feedback":"Caffeine may contribute, but sleep usually has more than one influence."},{"id":"ignore","label":"Assume caffeine cannot affect sleep after lunch","feedback":"Some people remain sensitive for many hours."}],"feedbackTitle":"Use the model carefully","feedbackTakeaway":"A personal pattern beats a rigid universal rule.","workedExample":"Caffeine may contribute to later alertness. Observe timing, amount, and sleep before deciding what to change.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l7_alcohol_evidence","node_source_id":"u1_2_sleep_disruptors-n3","order_index":0,"type":"evidence_bite","phase":"understand","duration_seconds":45,"scaffold_level":1,"difficulty":0.1,"is_scored":false,"concept":"alcohol_sleep","content":{"category":"evidence_bite","format":"evidence_bite","completionMode":"direct","primaryLabel":"Continue","title":"The whole-night finding","instruction":"One finding, with its limits.","finding":"Alcohol may make falling asleep feel easier while changing later sleep and increasing wakefulness for some people.","confidence":"Strong","confidenceWhy":"The broad early-night/later-night pattern is well studied, but the size of the effect varies with dose, timing, biology, and the person’s sleep context.","note":"A changed night is worth noticing; it is not a moral judgement or a diagnosis."}},{"source_id":"u1_l7_alcohol_story","node_source_id":"u1_2_sleep_disruptors-n3","order_index":1,"type":"timeline_rewind","phase":"story","duration_seconds":75,"scaffold_level":2,"difficulty":0.18,"is_scored":false,"concept":"alcohol_sleep","content":{"category":"timeline_rewind","format":"timeline_rewind","title":"Arun’s two versions of the night","setup":"Arun has a drink in the evening and falls asleep quickly.","prompt":"How would you read the night?","timelineEvents":[{"time":"11:00 PM","description":"Arun has a drink and falls asleep quickly."},{"time":"2:30 AM","description":"Wakes up feeling hot and restless."},{"time":"4:15 AM","description":"Briefly wakes again."},{"time":"7:00 AM","description":"Alarm rings. Feels unrefreshed."}],"paths":[{"id":"first-hour","choiceLabel":"It seems like the drink helped","visibleEventCount":1,"interpretation":"Sleep arrives quickly, so Arun assumes the drink helped the whole night. The early benefit felt real, but it wasn''t the whole story."},{"id":"whole-night","choiceLabel":"I’d want to see the whole night","visibleEventCount":4,"interpretation":"Arun notes the drink’s timing, then notices both sleep onset and later waking. He has a pattern to discuss, not a verdict about his character."}],"reflectionQuestion":"What did the first hour hide?","reflectionOptions":[{"id":"later-sleep","label":"Later sleep quality can differ from sleep onset","isCorrect":true},{"id":"one-cause","label":"One drink proves the exact cause","isCorrect":false}],"finalInsight":{"headline":"FIRST HOUR ≠ WHOLE NIGHT","body":"Falling asleep quickly and sleeping well across the night are different questions."}}},{"source_id":"u1_l7_alcohol_scenario","node_source_id":"u1_2_sleep_disruptors-n3","order_index":2,"type":"course_choice","phase":"transfer","duration_seconds":50,"scaffold_level":3,"difficulty":0.22,"is_scored":true,"concept":"alcohol_sleep","content":{"category":"course_choice","format":"course_choice","title":"Read the second half","instruction":"Choose the most grounded explanation.","context":"Arun falls asleep quickly after drinking, then wakes several times later and feels unrefreshed.","prompt":"What could be part of the explanation?","options":[{"id":"architecture","label":"Alcohol may have changed sleep architecture and increased later disruption","isCorrect":true,"feedback":"Yes. The whole-night pattern matters, not only how fast sleep began."},{"id":"proof","label":"The pattern proves one exact biological cause","feedback":"Several factors can affect sleep. Keep the explanation bounded."},{"id":"character","label":"Arun is weak for needing alcohol to sleep","feedback":"Moral judgement does not explain the sleep pattern and can make help harder to seek."}],"feedbackTitle":"Look at the whole night","feedbackTakeaway":"Sleep onset and sleep quality are different questions.","workedExample":"Alcohol can change the shape of the night. If drinking or sleep disruption is worrying, professional support is appropriate.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l8_disruptor_layers","node_source_id":"u1_2_sleep_disruptors-n4","order_index":0,"type":"layer_zoom","phase":"trace","duration_seconds":50,"scaffold_level":1,"difficulty":0.14,"is_scored":false,"concept":"light_stress_disruptors","content":{"title":"Zoom in on one disrupted evening","instruction":"Zoom in one layer at a time.","layers":[{"id":"disrupted-layer-cues","label":"Cues","title":"Bright light, stress, and a late plan","body":"Several small signals arrive close to bedtime and across the weekend."},{"id":"disrupted-layer-body","label":"Body","title":"Alertness receives more cues than rest","body":"Light and stress can keep arousal up while a changing schedule gives the clock mixed timing cues."},{"id":"disrupted-layer-pattern","label":"Pattern","title":"Monday feels harder without one villain","body":"The useful move is to name the strongest clue first, then change one thing gently."}],"insight":"Naming light, stress, and wake-time drift separately keeps the next small experiment precise."}},{"source_id":"u1_l8_disruptor_evidence","node_source_id":"u1_2_sleep_disruptors-n4","order_index":1,"type":"evidence_bite","phase":"evidence","duration_seconds":40,"scaffold_level":1,"difficulty":0.12,"is_scored":false,"concept":"light_stress_disruptors","content":{"category":"evidence_bite","format":"evidence_bite","completionMode":"direct","title":"The clue is not a character flaw","instruction":"Open the short research note.","finding":"Evening light, stress, and changing wake times can each shift sleep timing or alertness.","confidence":"moderate, with context","confidenceWhy":"These cues affect people differently. Research supports looking for patterns, not blaming one cue for every hard night.","note":"Use evidence to choose a small observation, not a perfect rule."}},{"source_id":"u1_l8_disruptor_scenario","node_source_id":"u1_2_sleep_disruptors-n4","order_index":2,"type":"course_choice","phase":"transfer","duration_seconds":45,"scaffold_level":3,"difficulty":0.2,"is_scored":true,"concept":"light_stress_disruptors","content":{"category":"course_choice","format":"course_choice","title":"Read Monday morning","instruction":"Choose the clearest pattern.","context":"Dara wakes at 7am on weekdays but sleeps until 10am on both weekend days. Monday feels groggy.","prompt":"What is a useful first hypothesis?","options":[{"id":"drift","label":"The weekend shift may be giving the clock mixed cues","isCorrect":true,"feedback":"Yes. Timing is a reasonable place to look before making a judgement."},{"id":"lazy","label":"Dara is simply lazy","feedback":"A schedule pattern is not a moral label."},{"id":"certain","label":"The weekend shift is definitely the only cause","feedback":"It is a hypothesis, not a diagnosis. Other factors can matter too."}],"feedbackTitle":"Hypothesis, not verdict","feedbackTakeaway":"You can investigate a cue without overclaiming.","workedExample":"Weekend drift is one plausible timing clue. Observe it alongside light, stress, and sleep quality.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l9_reframe_broken","node_source_id":"u1_2_sleep_disruptors-n5","order_index":0,"type":"interactive_reframe","phase":"review","duration_seconds":45,"scaffold_level":2,"difficulty":0.15,"is_scored":false,"concept":"sleep_levers_reframe","content":{"category":"interactive_reframe","format":"interactive_reframe","title":"After a hard night...","heroWrongText":"“My body is broken.”","question":"What should you look at first?","correctOption":"What might have changed","wrongOption":"Whether I need to try harder","wrongPathTitle":"Whether I need to try harder","wrongCascade":["TRY HARDER","“Is it working yet?”","more checking","more pressure"],"correctHeroMorph":"“Something may have shifted.”","correctCascade":["WHAT CHANGED?","timing · pressure · arousal","nap · light · stress · routine...","something I can investigate"],"correctFinale":"Same night.\nDifferent story."}},{"source_id":"u1_l9_checkpoint_review","node_source_id":"u1_2_sleep_disruptors-n5","order_index":1,"type":"course_checkpoint","phase":"review","duration_seconds":150,"scaffold_level":3,"difficulty":0.28,"is_scored":true,"concept":"sleep_architecture","content":{"category":"course_checkpoint","format":"course_checkpoint","completionMode":"direct","title":"Sleep science checkpoint","instruction":"A calm mixed review. Use the map without memory pressure.","introTitle":"Let’s see what stuck.","intro":"4 quick questions about the sleep system.\nA miss just gives you something to revisit.","introTag":"4 QUESTIONS · ~1 MIN","items":[{"concept":"Sleep pressure","context":"A late afternoon nap makes bedtime feel less sleepy.","prompt":"What might explain it?","clue":"What builds while you stay awake?","worked":"Wakefulness builds sleep pressure. A long or late nap can release some of that pressure before bedtime.","options":[{"label":"Some sleep pressure was released during the nap","isCorrect":true,"feedback":"Late nap\n↓\nsome sleep pressure released\n↓\nless sleepy at bedtime"},{"label":"My body probably needs a later bedtime now","isCorrect":false,"feedback":"Late nap\n↓\nsome sleep pressure released\n↓\nless sleepy at bedtime"}]},{"concept":"Timing cues","context":"Bright light, a replayed work message, and a three-hour Sunday sleep-in happen together.","prompt":"What makes the next step more useful?","clue":"Separate the clues before changing them.","worked":"Light, stress, and wake-time drift are different cues. Separating them lets one small experiment teach you something.","options":[{"label":"Name each cue, then test one small change","isCorrect":true,"feedback":"Multiple cues\n↓\nseparate clues\n↓\nclearer experiment"},{"label":"Change every routine at once","isCorrect":false,"feedback":"Multiple cues\n↓\nseparate clues\n↓\nclearer experiment"}]},{"concept":"Small experiment","prompt":"What makes a sleep experiment useful?","clue":"A good experiment teaches, even when sleep is imperfect.","worked":"Change one cue, observe several nights, and treat the result as information rather than a pass or fail.","options":[{"label":"One cue, several observations, no self-blame","isCorrect":true,"feedback":"Single cue\n↓\nrepeated observation\n↓\nclearer pattern"},{"label":"A perfect result on the first night","isCorrect":false,"feedback":"Single cue\n↓\nrepeated observation\n↓\nclearer pattern"}]},{"concept":"Body clock","context":"I was not sleepy at 10pm after a relaxing weekend with late mornings.","prompt":"Which reading keeps learning open?","clue":"Look for the timing shift before blaming your sleep ability.","worked":"A later weekend schedule shifts your body clock timing.","options":[{"label":"The later mornings shifted my clock timing for tonight","isCorrect":true,"feedback":"Weekend sleep-in\n↓\nclock timing shifted\n↓\nlater sleepiness"},{"label":"My body clock has completely failed","isCorrect":false,"feedback":"Weekend sleep-in\n↓\nclock timing shifted\n↓\nlater sleepiness"}]}],"revisitMessage":"The marked ideas are worth a short revisit before changing your routine. Nothing is lost.","solidMessage":"The map is holding. Next, use it to run one small experiment and read what changes."}},{"source_id":"u1_l10_experiment_twin_cases","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":0,"type":"twin_case","phase":"distinguish","duration_seconds":55,"scaffold_level":2,"difficulty":0.22,"is_scored":true,"concept":"sleep_experiment","content":{"category":"twin_case","format":"twin_case","completionMode":"direct","title":"Signal or verdict?","instruction":"Match each observation with the reading that keeps learning open.","leftTitle":"OBSERVATION","rightTitle":"USEFUL READING","pairs":[{"id":"one-night","left":"One rough night after a late coffee","right":"A clue worth repeating before deciding"},{"id":"three-nights","left":"Three nights improve after earlier coffee","right":"A pattern that supports one small change"},{"id":"no-change","left":"No clear change after one dim-light evening","right":"Not enough evidence yet; keep the question small"},{"id":"stressful-day","left":"A stressful day and a hard night together","right":"Several cues may overlap; avoid a single-cause verdict"}],"rightOrderIds":["stressful-day","one-night","no-change","three-nights"],"rule":"Observation becomes learning when you separate a clue from a conclusion.","body":"You can notice a pattern without demanding certainty from a small sample.","next":"The next card follows one person through that kind of experiment."}},{"source_id":"u1_l10_experiment_evidence","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":1,"type":"evidence_bite","phase":"evidence","duration_seconds":40,"scaffold_level":1,"difficulty":0.16,"is_scored":false,"concept":"sleep_experiment","content":{"category":"evidence_bite","format":"evidence_bite","completionMode":"direct","title":"Why one week teaches more","instruction":"Open the research note.","finding":"Repeated observations are more useful than one sleep score because sleep changes with stress, timing, light, and ordinary life.","confidence":"strong practical rule","confidenceWhy":"A short run of observations cannot prove a cause, but it can reveal a pattern worth testing again.","note":"Track only what helps answer your question."}},{"source_id":"u1_l10_experiment_plan","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":2,"type":"if_then_plan","phase":"plan","duration_seconds":50,"scaffold_level":2,"difficulty":0.18,"is_scored":false,"concept":"sleep_experiment","content":{"category":"if_then_plan","format":"if_then_plan","completionMode":"direct","title":"Set up the next small test","instruction":"Choose one cue and one way to observe it.","cues":["my weekend wake time drifts later","bright light stays on late","a stressful call follows me toward bed","I take a late nap and feel less sleepy"],"actions":["keep wake time closer to weekdays for several days","dim one light for the last hour","write one line about the call, then return to a neutral cue","note the nap time and compare the next bedtime"],"privacy":"Saved privately. No reminders unless you ask.","feedbackTitle":"Your question is ready","feedback":"A small experiment gives the next week a clear question. Keep the result private, review it gently, and change only one cue at a time."}}]'::jsonb) AS row(
    source_id TEXT,
    node_source_id TEXT,
    order_index INT,
    type TEXT,
    phase TEXT,
    duration_seconds INT,
    scaffold_level INT,
    difficulty NUMERIC,
    is_scored BOOLEAN,
    concept TEXT,
    content JSONB
  )
)



INSERT INTO exercises (
  id,
  node_id,
  order_index,
  type,
  phase,
  duration_seconds,
  scaffold_level,
  difficulty,
  is_scored,
  concept,
  content
)
SELECT
  pg_temp.seed_uuid(source_id),
  pg_temp.seed_uuid(node_source_id),
  order_index,
  type,
  phase,
  duration_seconds,
  scaffold_level,
  difficulty,
  is_scored,
  concept,
  content
FROM curriculum
ON CONFLICT (id) DO UPDATE SET
  node_id = EXCLUDED.node_id,
  order_index = EXCLUDED.order_index,
  type = EXCLUDED.type,
  phase = EXCLUDED.phase,
  duration_seconds = EXCLUDED.duration_seconds,
  scaffold_level = EXCLUDED.scaffold_level,
  difficulty = EXCLUDED.difficulty,
  is_scored = EXCLUDED.is_scored,
  concept = EXCLUDED.concept,
  content = EXCLUDED.content;

UPDATE exercises
SET content = $content$
{
  "category": "lever_scenario",
  "format": "lever_scenario",
  "completionMode": "direct",
  "hideFooterUntilReady": true,
  "title": "Use the sleep map",
  "instruction": "Read the moment.",
  "capability": "Tired and wired can happen together.",
  "variants": [
    {
      "sceneLabel": "TUESDAY · 11:40PM",
      "scene": "• Awake since 7am\n• Checks work email at 11:40pm\n• Heart starts racing",
      "prompt": "What best explains what’s happening?",
      "clue": "She is already tired. Look for the clue that explains her alertness.",
      "worked": "Checking work pushed her tired body into alert mode.",
      "options": [
        {"id": "arousal", "label": "Her stress response switched on", "isCorrect": true, "feedback": "Checking work has pushed her tired body into alert mode."},
        {"id": "more-pressure", "label": "She simply isn’t tired yet", "feedback": "She’s already tired. Her racing heart points to increased alertness instead."},
        {"id": "missed-window", "label": "She missed her sleep window", "feedback": "Her racing heart points to alertness, not a missed sleep window."}
      ]
    },
    {
      "sceneLabel": "SATURDAY · 10:30PM",
      "scene": "• 2-hour evening nap\n• Feels calm\n• Not sleepy at 10:30pm",
      "prompt": "What best explains what’s happening?",
      "clue": "He is calm. Think about what the nap changed.",
      "worked": "The evening nap lowered his sleep pressure, so he may not feel sleepy yet.",
      "options": [
        {"id": "lower-pressure", "label": "His nap lowered his sleep pressure", "isCorrect": true, "feedback": "The nap released some sleep pressure, so he may not feel sleepy yet."},
        {"id": "clock-shifted", "label": "His body clock changed for the weekend", "feedback": "The nap is the clearest clue here. It lowered the sleep pressure built during the day."},
        {"id": "force-sleep", "label": "He needs to try harder to sleep", "feedback": "Trying harder can raise alertness. His sleep pressure needs time to rebuild."}
      ]
    }
  ],
  "waitingPrimaryLabel": "Choose an answer"
}
$content$::jsonb
WHERE type = 'lever_scenario'
  AND content->>'title' = 'Use the sleep map';

UPDATE exercises
SET content = $concept$
{
  "category": "concept_card",
  "format": "concept_card",
  "completionMode": "direct",
  "hideSkipAction": true,
  "variant": "myth",
  "title": "One waking is not a broken night",
  "myth": "Waking at 3am means my sleep system has failed.",
  "reality": "Sleep moves through changing cycles.\n\nLater sleep often has more REM, so vivid dreams and brief wakings can happen without meaning anything is broken.",
  "note": "A less frightening explanation leaves room for sleep to return.",
  "primaryLabel": "Continue"
}
$concept$::jsonb
WHERE type = 'concept_card'
  AND content->>'title' = 'One waking is not a broken night';

UPDATE exercises
SET content = $cards$
{
  "category": "learn_cards",
  "format": "learn_cards",
  "completionMode": "direct",
  "hideSkipAction": true,
  "title": "Sleep pressure builds",
  "primaryLabel": "Continue",
  "cards": [
    {
      "id": "pressure-builds",
      "title": "The longer you’re awake, the sleepier you become",
      "body": "Your need for sleep gradually builds while you're awake."
    },
    {
      "id": "sleep-releases",
      "title": "Sleep releases that pressure",
      "body": "As you sleep, some of that built-up need decreases."
    },
    {
      "id": "naps-lower-pressure",
      "title": "Long naps can reduce bedtime sleepiness",
      "body": "A long late nap can use some sleep pressure before bedtime."
    }
  ]
}
$cards$::jsonb
WHERE type = 'learn_cards'
  AND content->>'title' = 'Sleep pressure builds';

COMMIT;

SELECT
  c.id AS course_id,
  c.title AS course_title,
  COUNT(DISTINCT s.id) AS sections,
  COUNT(DISTINCT u.id) AS units,
  COUNT(DISTINCT n.id) AS nodes,
  COUNT(DISTINCT e.id) AS exercises
FROM courses c
JOIN sections s ON s.course_id = c.id
JOIN units u ON u.section_id = s.id
JOIN nodes n ON n.unit_id = u.id
LEFT JOIN exercises e ON e.node_id = n.id
WHERE c.id = pg_temp.seed_uuid('sleep-reset')
  AND s.id = pg_temp.seed_uuid('s1_sleep_science')
GROUP BY c.id, c.title;


COMMIT;
