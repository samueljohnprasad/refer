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
  FROM jsonb_to_recordset('[{"source_id":"sleep-reset","title":"Sleep Reset","description":"Reclaim your nights, one small shift at a time","icon_url":"moon","color_hex":"5F7F58","order_index":0,"is_published":true,"domain":"sleep_wellness","target_audience":"Adults struggling with sleep onset, quality, or restless nights","total_lessons":10,"total_duration_weeks":2,"sessions_per_week":5,"session_duration_minutes":[3,7]}]'::jsonb) AS row(
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
  FROM jsonb_to_recordset('[{"source_id":"u1_1_sleep_mechanics-n1","unit_source_id":"u1_1_sleep_mechanics","title":"Three Sleep Levers","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":0,"estimated_mins":4,"icon":"book","new_concepts":["sleep_levers","sleep_pressure","body_clock","arousal","self_blame_reframe"],"review_concepts":[],"prerequisites":[]},{"source_id":"u1_1_sleep_mechanics-n2","unit_source_id":"u1_1_sleep_mechanics","title":"Sleep Pressure and Sleep Cycles","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":1,"estimated_mins":6,"icon":"book","new_concepts":["sleep_pressure","sleep_cycles","sleep_architecture"],"review_concepts":["self_blame_reframe"],"prerequisites":[]},{"source_id":"u1_1_sleep_mechanics-n3","unit_source_id":"u1_1_sleep_mechanics","title":"Body Clock Cues","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":2,"estimated_mins":6,"icon":"book","new_concepts":["body_clock","circadian_rhythm"],"review_concepts":["sleep_pressure","self_blame_reframe"],"prerequisites":[]},{"source_id":"u1_1_sleep_mechanics-n4","unit_source_id":"u1_1_sleep_mechanics","title":"Arousal Reset","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":3,"estimated_mins":5,"icon":"book","new_concepts":["arousal","tiny_reset_cue"],"review_concepts":["sleep_pressure","body_clock","self_blame_reframe"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n1","unit_source_id":"u1_2_sleep_disruptors","title":"The Sleep Pressure System","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":0,"estimated_mins":5,"icon":"book","new_concepts":["sleep_pressure"],"review_concepts":["circadian_rhythm"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n2","unit_source_id":"u1_2_sleep_disruptors","title":"Caffeine and Sleep Pressure","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":1,"estimated_mins":5,"icon":"book","new_concepts":["caffeine_sleep"],"review_concepts":["sleep_pressure"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n3","unit_source_id":"u1_2_sleep_disruptors","title":"Alcohol and Sleep Quality","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":2,"estimated_mins":5,"icon":"book","new_concepts":["alcohol_sleep"],"review_concepts":["sleep_cycles","sleep_pressure"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n4","unit_source_id":"u1_2_sleep_disruptors","title":"Light, Stress and Wake-Time Drift","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":3,"estimated_mins":6,"icon":"book","new_concepts":["light_stress_disruptors"],"review_concepts":["sleep_pressure","circadian_rhythm"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n5","unit_source_id":"u1_2_sleep_disruptors","title":"Sleep Science Checkpoint","type":"checkpoint","content_type":"checkpoint","pass_threshold":80,"order_index":4,"estimated_mins":3,"icon":"checkpoint","new_concepts":[],"review_concepts":["sleep_architecture","sleep_cycles","circadian_rhythm","sleep_pressure","caffeine_sleep","alcohol_sleep","light_stress_disruptors"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n6_experiment","unit_source_id":"u1_2_sleep_disruptors","title":"Run One Small Sleep Experiment","type":"lesson","content_type":"lesson","pass_threshold":80,"order_index":5,"estimated_mins":6,"icon":"book","new_concepts":["sleep_experiment"],"review_concepts":["light_stress_disruptors","sleep_pressure","circadian_rhythm","tiny_reset_cue"],"prerequisites":[]},{"source_id":"u1_2_sleep_disruptors-n6_claim","unit_source_id":"u1_2_sleep_disruptors","title":"Claim: sleep_scientist","type":"chest","content_type":"chest","pass_threshold":null,"order_index":6,"estimated_mins":0,"icon":"chest","new_concepts":[],"review_concepts":[],"prerequisites":[]}]'::jsonb) AS row(
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

WITH curriculum AS (
  SELECT *
  FROM jsonb_to_recordset('[{"source_id":"u1_l1_sleep_system_intuition","node_source_id":"u1_1_sleep_mechanics-n1","order_index":0,"type":"intuition_check","phase":"warmup","duration_seconds":20,"scaffold_level":1,"difficulty":0.1,"is_scored":false,"concept":"self_blame_reframe","content":{"category":"intuition_check","format":"intuition_check","completionMode":"direct","title":"What does your gut say?","instruction":"Choose what feels more useful.","prompt":"After a bad night, what gives you more control next?","options":[{"id":"effort","label":"Trying harder to make sleep happen"},{"id":"system","label":"Understanding which sleep lever shifted"}],"bestOptionId":"system","revealTitle":"A kinder starting point","reveal":"Sleep is shaped by pressure, body clock, and arousal. These can shift without you failing.","alternateReveal":"Trying harder is understandable, but effort can raise arousal. A body-system map gives you something kinder and more useful.","primaryLabel":"Continue","waitingPrimaryLabel":"Choose above"}},{"source_id":"u1_l1_three_sleep_levers","node_source_id":"u1_1_sleep_mechanics-n1","order_index":1,"type":"learn_cards","phase":"introduce","duration_seconds":75,"scaffold_level":2,"difficulty":0.15,"is_scored":true,"concept":"sleep_levers","content":{"category":"learn_cards","format":"learn_cards","title":"Meet the three levers","instruction":"Three short cards, then one quick recall.","primaryLabel":"Check answer","waitingPrimaryLabel":"Choose above","retryPhase":"recall","feedbackTitle":"Why it fits","feedbackTakeaway":"You can tell tiredness from a body that is still alert.","cards":[{"id":"sleep-pressure","kicker":"Lever 1 of 3","title":"Sleep pressure","body":"The need for sleep builds while you are awake. Sleep and naps release some of that pressure."},{"id":"body-clock","kicker":"Lever 2 of 3","title":"Body clock","body":"Light and repeated wake times help your body expect sleep and alertness at roughly the right time."},{"id":"arousal","kicker":"Lever 3 of 3","title":"Arousal","body":"Your body can be tired and still alert. Worry, clock-checking, and trying to force sleep can turn this lever up."}],"recall":{"prompt":"You feel tired, but your heart is racing and you keep checking the time. Which lever is loudest?","correctOptionId":"arousal","options":[{"id":"pressure","label":"Sleep pressure"},{"id":"clock","label":"Body clock"},{"id":"arousal","label":"Arousal"}]},"feedback_correct":"Right. Tiredness can be present while arousal keeps the body alert.","feedback_incorrect":"The racing heart and clock-checking point to arousal: the body is still on alert.","workedExample":"Pressure is the need for sleep. The body clock guides timing. Arousal is how alert or settled the body feels."}},{"source_id":"u1_l1_sleep_lever_shelf","node_source_id":"u1_1_sleep_mechanics-n1","order_index":2,"type":"toolkit_shelf","phase":"explore","duration_seconds":30,"scaffold_level":2,"difficulty":0.15,"is_scored":false,"concept":null,"content":{"category":"toolkit_shelf","format":"toolkit_shelf","completionMode":"direct","title":"Which lever is speaking?","instruction":"Tap a sleep moment. The matching lever lights up.","tools":[{"label":"Sleep pressure","use":"need for sleep"},{"label":"Body clock","use":"sleep timing"},{"label":"Arousal","use":"alert or settled"}],"moments":[{"label":"Not sleepy after a long evening nap","toolIndex":0,"key":"SLEEP PRESSURE","response":"The nap released some pressure. The body may need more awake time before sleepiness builds again."},{"label":"Sleep and wake times drift much later on weekends","toolIndex":1,"key":"BODY CLOCK","response":"Changing timing gives the clock mixed cues. Repeated light and wake-time cues guide it gradually."},{"label":"Tired, but clock-checking keeps the body keyed up","toolIndex":2,"key":"AROUSAL","response":"The need for sleep is there, but the body is still on alert. Softer effort helps this lever settle."}],"note":"A hard night can involve more than one lever. Start with the strongest clue.","primaryLabel":"Continue","waitingPrimaryLabel":"Tap a moment above"}},{"source_id":"u1_l1_match_sleep_levers","node_source_id":"u1_1_sleep_mechanics-n1","order_index":3,"type":"lever_match","phase":"practice","duration_seconds":45,"scaffold_level":2,"difficulty":0.2,"is_scored":false,"concept":null,"content":{"category":"lever_match","format":"lever_match","completionMode":"direct","title":"Match the sleep levers","instruction":"Tap a lever, then match what it does.","pairs":[{"id":"pressure","left":"Sleep pressure","right":"Builds while you are awake"},{"id":"clock","left":"Body clock","right":"Uses light and timing cues"},{"id":"arousal","left":"Arousal","right":"Sets how alert the body feels"}],"rightOrder":["arousal","pressure","clock"],"clue":"Sleep pressure builds with awake time.","feedbackTitle":"The three-part map","feedback":"Pressure builds the need for sleep. The body clock guides timing. Arousal determines whether the body feels alert or settled.","capability":"You can name the three forces shaping a night.","waitingPrimaryLabel":"Match all pairs"}},{"source_id":"u1_l1_use_sleep_map","node_source_id":"u1_1_sleep_mechanics-n1","order_index":4,"type":"lever_scenario","phase":"challenge","duration_seconds":50,"scaffold_level":3,"difficulty":0.22,"is_scored":true,"concept":"self_blame_reframe","content":{"category":"lever_scenario","format":"lever_scenario","completionMode":"direct","title":"Use the sleep map","instruction":"Read the moment, then choose the most useful explanation.","capability":"You can read a hard night without blaming yourself.","variants":[{"sceneLabel":"TUESDAY · 11:40PM","scene":"Maya has been awake since 7am and feels tired. After a work message, she keeps checking the time and thinking, ‘I have to sleep now.’ Her heart speeds up.","prompt":"Which reading is most useful?","clue":"She is already tired. Look for the lever that explains alertness.","worked":"Maya already has sleep pressure. The work message, clock-checking, and effort raised arousal. A hard night here is a body-alertness problem, not a personal failure.","options":[{"id":"arousal","label":"Her arousal rose; soften effort and let the body settle","isCorrect":true,"feedback":"Yes. She is tired, but her body is on alert. Reducing pressure and clock-checking gives arousal room to fall."},{"id":"more-pressure","label":"She needs to stay awake longer to build more pressure","feedback":"She is already tired after a full day awake. More wake time misses the stronger clue: her body became more alert after the message."},{"id":"failure","label":"She is failing because tired people should sleep immediately","feedback":"Tiredness does not switch sleep on by command. Arousal can stay high without saying anything about her effort or character."}]},{"sceneLabel":"SATURDAY · 10:30PM","scene":"Sam took a two-hour nap at 6pm. He feels calm, but he is not sleepy at his usual bedtime.","prompt":"Which reading is most useful now?","clue":"He is calm. Think about what sleep does to built-up pressure.","worked":"The evening nap released some sleep pressure. Sam is not broken and does not need to force sleep; his need for sleep may simply build later tonight.","options":[{"id":"lower-pressure","label":"The nap released some sleep pressure","isCorrect":true,"feedback":"Right. Sleep releases pressure, so an evening nap can move sleepiness later without meaning anything is wrong."},{"id":"broken-clock","label":"His body clock is permanently broken","feedback":"One evening nap does not prove a broken clock. The clearest immediate change is lower sleep pressure."},{"id":"force-sleep","label":"He should try harder until sleep happens","feedback":"Trying harder cannot rebuild pressure on command and may raise arousal. The useful move is understanding the system."}]}],"waitingPrimaryLabel":"Choose above"}},{"source_id":"u1_l2_recall_warmup","node_source_id":"u1_1_sleep_mechanics-n2","order_index":0,"type":"recall_warmup","phase":"retrieve","duration_seconds":30,"scaffold_level":1,"difficulty":0.08,"is_scored":false,"concept":"sleep_levers","content":{"category":"recall_warmup","format":"recall_warmup","title":"Bring the map back","instruction":"Answer in your head, then reveal each card.","cards":[{"question":"What builds while you are awake?","answer":"Sleep pressure is the body’s growing need for sleep."},{"question":"What sets the timing of sleepiness?","answer":"The body clock, shaped by light, timing, and routine."},{"question":"What can keep the alarm switched on?","answer":"Arousal is stress activation that makes settling harder."}],"successPrimaryLabel":"Continue"}},{"source_id":"u1_l2_sleep_cycle_myth","node_source_id":"u1_1_sleep_mechanics-n2","order_index":1,"type":"concept_card","phase":"teach","duration_seconds":30,"scaffold_level":1,"difficulty":0.08,"is_scored":false,"concept":"sleep_cycles","content":{"category":"concept_card","format":"concept_card","completionMode":"direct","variant":"myth","title":"One waking is not a broken night","instruction":"Keep this explanation close for the next exercise.","primaryLabel":"Continue","myth":"Waking at 3am means my sleep system has failed.","reality":"Sleep moves through changing cycles. Later sleep often has more REM, so vivid dreams and brief wakings can happen without meaning anything is broken.","note":"A less frightening explanation leaves room for sleep to return."}},{"source_id":"u1_l2_pressure_cards","node_source_id":"u1_1_sleep_mechanics-n2","order_index":2,"type":"learn_cards","phase":"introduce","duration_seconds":75,"scaffold_level":1,"difficulty":0.12,"is_scored":true,"concept":"sleep_pressure","content":{"category":"learn_cards","format":"learn_cards","title":"Sleep pressure builds","instruction":"See how sleep need and sleep stages change across a night.","cards":[{"id":"pressure-builds","kicker":"THE NEED","title":"Pressure builds while awake","body":"Time awake gradually increases the need for sleep. Sleep lowers that pressure; a long nap can lower it before bedtime."},{"id":"early-night","kicker":"EARLY NIGHT","title":"Early sleep is deeper","body":"Deep sleep is usually more common earlier in the night. This is one reason the first part of sleep can feel physically restorative."},{"id":"late-night","kicker":"LATE NIGHT","title":"Later sleep has more REM","body":"REM sleep tends to occupy more of the later cycles. A brief waking then is not proof that your sleep is broken."}],"recall":{"prompt":"After a long evening nap, which lever may be lower at bedtime?","correctOptionId":"pressure","options":[{"id":"pressure","label":"Sleep pressure"},{"id":"arousal","label":"Arousal"},{"id":"clock","label":"Body clock"}]},"feedback_correct":"Right. The nap released some sleep pressure.","feedback_incorrect":"A long nap can lower the sleep pressure that would otherwise build toward bedtime.","workedExample":"Sleep pressure builds during wakefulness and is released by sleep or naps. Sleep stages also shift across the night."}},{"source_id":"u1_l2_pressure_terms","node_source_id":"u1_1_sleep_mechanics-n2","order_index":3,"type":"fill_blank","phase":"retrieve","duration_seconds":45,"scaffold_level":2,"difficulty":0.2,"is_scored":true,"concept":"sleep_architecture","content":{"category":"fill_blank","format":"fill_blank","completionMode":"direct","title":"Name what is happening","instruction":"Type the missing sleep term. Close spellings count.","capability":"You can name the two sleep ideas without turning them into a rule to fear.","variants":[{"pre":"The need for sleep builds while we are","post":".","answers":["awake","awake for longer"],"exampleWords":["awake","asleep","worried"],"correctFeedback":"Yes. Time awake gradually builds sleep pressure; sleep and naps release some of it.","incorrectFeedback":"Look for the state that lets sleep pressure build: time spent not sleeping.","workedExample":"Sleep pressure builds while we are awake. A long late nap can release some of that pressure before bedtime."},{"pre":"Later sleep cycles usually contain more","post":" sleep.","answers":["rem","dream","dreaming"],"exampleWords":["REM","deep","still"],"correctFeedback":"Right. REM tends to take up more of the later cycles, so vivid dreams or a brief waking can be ordinary.","incorrectFeedback":"Think of the sleep stage linked with more vivid dreaming later in the night.","workedExample":"Later sleep often has more REM. A vivid dream or brief waking is not proof that sleep has failed."}]}},{"source_id":"u1_l2_changed_night","node_source_id":"u1_1_sleep_mechanics-n2","order_index":4,"type":"course_choice","phase":"transfer","duration_seconds":45,"scaffold_level":3,"difficulty":0.22,"is_scored":true,"concept":"sleep_cycles","content":{"category":"course_choice","format":"course_choice","title":"Explain the changed night","instruction":"Choose the most useful reading of what changed.","context":"Jules takes a long nap at 5pm, is calm but not sleepy at 11pm, then wakes briefly after a vivid dream.","prompt":"Which explanation uses the sleep map without blame?","options":[{"id":"map","label":"The nap lowered pressure, and later REM can make vivid dreams or brief waking more noticeable","isCorrect":true,"feedback":"Right. Two ordinary sleep processes explain the changed night without calling it failure."},{"id":"broken","label":"The sleep system is broken because Jules woke up","feedback":"A brief waking does not diagnose a broken system. Look at the nap and the changing cycles."},{"id":"force","label":"Jules should force sleep so the night is not wasted","feedback":"Urgency can raise arousal. A calmer explanation gives sleep more room."}],"feedbackTitle":"Why this map fits","feedbackTakeaway":"You can explain a changed night without making it a verdict about yourself.","workedExample":"A late nap can lower pressure, while later REM can make dreams and brief wakings more noticeable. Both are information, not failure.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l2_pressure_action","node_source_id":"u1_1_sleep_mechanics-n2","order_index":5,"type":"intuition_check","phase":"apply","duration_seconds":30,"scaffold_level":2,"difficulty":0.18,"is_scored":false,"concept":"sleep_pressure","content":{"category":"intuition_check","format":"intuition_check","completionMode":"direct","title":"Protect the pressure","instruction":"Choose the smallest useful experiment.","prompt":"Which experiment gives sleep pressure more room to build?","options":[{"id":"protect-pressure","label":"Keep a long late nap from becoming the default"},{"id":"force-bedtime","label":"Go to bed earlier and try harder"},{"id":"judge-night","label":"Treat one late bedtime as proof something is wrong"}],"bestOptionId":"protect-pressure","revealTitle":"Small experiment","reveal":"Notice what happens when a long late nap is shorter or earlier. Treat it as information, not a rule you must perform perfectly.","alternateReveal":"A small observation is more useful than forcing bedtime or judging one night.","primaryLabel":"Continue","waitingPrimaryLabel":"Choose an experiment"}},{"source_id":"u1_l3_evening_comparison","node_source_id":"u1_1_sleep_mechanics-n3","order_index":0,"type":"evening_comparison","phase":"compare","duration_seconds":45,"scaffold_level":2,"difficulty":0.16,"is_scored":false,"concept":"circadian_rhythm","content":{"category":"evening_comparison","format":"evening_comparison","completionMode":"direct","primaryLabel":"Continue","title":"Two weeks, one body clock","instruction":"Compare the cues each week gives the clock.","columns":[{"heading":"Week A","rows":["Wake at 7am on workdays, 10am on weekends","Morning light only on workdays","Monday feels out of step"],"outcome":"Mixed timing cues"},{"heading":"Week B","rows":["Wake within about an hour most days","Notice morning light when possible","Monday has less catching up"],"outcome":"Clearer timing cues"}],"explanation":"Neither week is a pass or fail. Repeated light and wake-time cues simply give the clock clearer information.","note":"The useful change is repeatability, not perfect control."}},{"source_id":"u1_l3_clock_diary","node_source_id":"u1_1_sleep_mechanics-n3","order_index":1,"type":"annotated_diary","phase":"notice","duration_seconds":45,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"body_clock","content":{"category":"annotated_diary","format":"annotated_diary","completionMode":"direct","primaryLabel":"Continue","title":"A timing thought, annotated","instruction":"See the cue, the story, and the kinder reading.","diary":"“I was not sleepy at 10pm. My body clock is broken, so tomorrow will be awful.”","annotation":"The first sentence is an observation. The second turns one evening into a verdict. Light, wake time, and routine can shift timing gradually; one late night is not proof of failure.","note":"Keep the observation. Drop the verdict."}},{"source_id":"u1_l3_cue_vs_rule","node_source_id":"u1_1_sleep_mechanics-n3","order_index":2,"type":"same_but_different","phase":"distinguish","duration_seconds":60,"scaffold_level":2,"difficulty":0.2,"is_scored":false,"concept":"body_clock","content":{"category":"same_but_different","format":"same_but_different","completionMode":"direct","title":"A cue is not a rule","instruction":"Tap each row to see the difference.","leftHeading":"Helpful cue","rightHeading":"Rigid rule","rows":[{"question":"Morning light","left":"Notice natural light when you can; it gives timing information.","right":"If I miss it once, the whole schedule is ruined."},{"question":"Wake time","left":"Try a steadier time most days, adjusted to real life.","right":"Wake at one exact minute or I have failed."},{"question":"Bedtime","left":"Let sleepiness and context guide the next step.","right":"Force sleep at the planned time no matter what."}],"tell":"Cues give the body clock information. Rules turn information into pressure."}},{"source_id":"u1_l3_private_timing_check","node_source_id":"u1_1_sleep_mechanics-n3","order_index":3,"type":"private_check","phase":"notice","duration_seconds":45,"scaffold_level":2,"difficulty":0.1,"is_scored":false,"concept":"body_clock","content":{"category":"private_check","format":"private_check","completionMode":"direct","primaryLabel":"Continue","title":"Notice your timing cues","instruction":"Tick any that feel familiar or choose none.","items":["My wake time shifts by several hours across the week","I get much less morning light on some days","I try to force the same bedtime even when I am not sleepy","I treat one late night as proof my sleep is broken"],"feedbackTitle":"Patterns, not verdicts","feedback":"Whatever you ticked, these are timing patterns to observe, not character flaws. Choose one cue you can repeat without turning it into a test."}},{"source_id":"u1_l3_clock_action","node_source_id":"u1_1_sleep_mechanics-n3","order_index":4,"type":"intuition_check","phase":"apply","duration_seconds":30,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"body_clock","content":{"category":"intuition_check","format":"intuition_check","completionMode":"direct","title":"Pick one observation","instruction":"Choose the smallest thing to notice this week.","prompt":"Which plan gives your body clock information without adding pressure?","options":[{"id":"wake","label":"Notice when I wake, without forcing an exact time"},{"id":"light","label":"Notice morning light on one ordinary day"},{"id":"both","label":"Notice both, but change only one thing at a time"}],"bestOptionId":"both","revealTitle":"Observe, do not police","reveal":"A small observation can teach you how your clock responds. The goal is information, not a perfect schedule.","alternateReveal":"Pick one cue that feels realistic. You can learn from it without making it a new rule.","primaryLabel":"Continue","waitingPrimaryLabel":"Choose an observation"}},{"source_id":"u1_l4_alarm_dialogue","node_source_id":"u1_1_sleep_mechanics-n4","order_index":0,"type":"dialogue","phase":"notice","duration_seconds":45,"scaffold_level":1,"difficulty":0.1,"is_scored":false,"concept":"arousal","content":{"category":"dialogue","format":"dialogue","completionMode":"direct","title":"Two voices at 2:17am","instruction":"Tap through the tired body and the alarm story.","messages":[{"id":"body","name":"Tired body","side":"left","text":"I feel heavy. I want to rest."},{"id":"alarm","name":"Alarm story","side":"right","text":"Check the time again. If you do not sleep now, tomorrow is ruined."},{"id":"body-again","name":"Tired body","side":"left","text":"I am tired and alert at the same time. That feels bad, but it is not proof I am broken."},{"id":"map","name":"A kinder map","side":"right","text":"Arousal can keep the body watchful. Lower the fight; do not demand instant sleep."}],"insight":"Sleep pressure and arousal can point in different directions. Naming the alert system gives you room to soften it."}},{"source_id":"u1_l4_try_harder_paradox","node_source_id":"u1_1_sleep_mechanics-n4","order_index":1,"type":"paradox_card","phase":"experiment","duration_seconds":45,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"arousal","content":{"category":"paradox_card","format":"paradox_card","completionMode":"direct","title":"Try harder to sleep","instruction":"Push the button and watch what the alarm learns.","expectation":"More effort should make sleep happen faster. That is how effort works for most tasks.","reality":"“SLEEP NOW” sounds like an emergency. Clock-checking and forcing keep attention on threat.","openingCaption":"It is 2:17am. What happens when you push harder?","captions":["You tell yourself to relax. Now you are checking whether you are relaxed.","You count the hours left. The alarm hears a deadline.","Your body gets more watchful because the struggle is still active.","The harder you push, the more sleep becomes a performance test."],"stopCaption":"You stop pushing. Feet on the floor, one longer exhale, and room for the wave to pass.","rule":"Forcing calm can feed the alarm.","takeaway":"Stopping the struggle is not giving up. It removes one source of fuel and lets the body settle in its own time."}},{"source_id":"u1_l4_sleep_thought_experiment","node_source_id":"u1_1_sleep_mechanics-n4","order_index":2,"type":"white_bear_experiment","phase":"experiment","duration_seconds":45,"scaffold_level":2,"difficulty":0.12,"is_scored":false,"concept":"arousal","content":{"category":"white_bear_experiment","format":"white_bear_experiment","completionMode":"direct","title":"Do not think about sleep","instruction":"For ten seconds, whatever you do, do not think about sleep.","options":[{"id":"thought","label":"Sleep came to mind quickly"},{"id":"monitoring","label":"I kept checking whether I was thinking about sleep"}],"rule":"Thought suppression can keep the thought active.","body":"Trying not to think about sleep makes you monitor for sleep. That monitoring keeps attention switched on. This is one reason “just stop thinking” can backfire at night.","fix":"The counter-move is softer: notice the thought, then return attention to a neutral body cue without arguing with it."}},{"source_id":"u1_l4_arousal_timer","node_source_id":"u1_1_sleep_mechanics-n4","order_index":3,"type":"surge_timer","phase":"understand","duration_seconds":45,"scaffold_level":2,"difficulty":0.1,"is_scored":false,"concept":"arousal","content":{"category":"surge_timer","format":"surge_timer","completionMode":"direct","primaryLabel":"Continue","title":"The alert wave has a timer","instruction":"Move the slider and watch the body’s surge fade.","numberToKeep":"the peak does not last forever. The body can begin settling even before you find the perfect technique."}},{"source_id":"u1_l4_long_exhale","node_source_id":"u1_1_sleep_mechanics-n4","order_index":4,"type":"breathing_round","phase":"practice","duration_seconds":60,"scaffold_level":2,"difficulty":0.12,"is_scored":false,"concept":"tiny_reset_cue","content":{"category":"breathing_round","format":"breathing_round","completionMode":"direct","primaryLabel":"Continue","title":"One longer exhale","instruction":"Try one gentle round. This is not a test of sleepiness.","useFor":"For: giving an alert body a softer signal","notFor":"Not for: forcing sleep to happen now","steps":[{"number":"4","label":"IN · EASY"},{"number":"8","label":"OUT · SLOW"},{"number":"×1","label":"ROUND · ~12S"}],"mechanism":"A longer, comfortable exhale can become a simple body cue for easing the struggle. Stop if it feels uncomfortable and return to normal breathing.","variation":"The goal is a small shift toward less fighting, not instant sleep or perfect breathing."}},{"source_id":"u1_l5_two_process_layers","node_source_id":"u1_2_sleep_disruptors-n1","order_index":0,"type":"layer_zoom","phase":"trace","duration_seconds":50,"scaffold_level":1,"difficulty":0.16,"is_scored":false,"concept":"sleep_pressure","content":{"category":"layer_zoom","format":"layer_zoom","completionMode":"direct","title":"Zoom in on the late nap","instruction":"Tap through the layers of one ordinary night.","layers":[{"kicker":"THE EVENT","title":"A long nap ends at 6pm","body":"At 11pm, the person feels calm but is not sleepy yet."},{"kicker":"THE BODY","title":"Sleep pressure is lower","body":"The nap released some of the need that usually builds across the evening."},{"kicker":"THE TIMING","title":"The body clock still has its own rhythm","body":"Clock timing and sleep pressure are meeting differently tonight. That explains the pattern without diagnosing the person."}],"insight":"When sleep is late, ask which part changed: pressure, timing, or both. A model gives you a clue; it does not give you a verdict."}},{"source_id":"u1_l5_two_process_story","node_source_id":"u1_2_sleep_disruptors-n1","order_index":1,"type":"story_walkthrough","phase":"story","duration_seconds":60,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"sleep_pressure","content":{"category":"story_walkthrough","format":"story_walkthrough","completionMode":"direct","primaryLabel":"Next","title":"Mina’s two-process night","instruction":"Tap through the night at your pace.","beats":[{"id":"nap","kicker":"6PM · THE NAP","title":"Pressure gets a release","body":"Mina wakes from a long nap feeling better. The nap has also released some sleep pressure before bedtime.","icon":"moon"},{"id":"bedtime","kicker":"11PM · THE MISMATCH","title":"Calm, but not sleepy","body":"Her body clock is moving toward night, but the need for sleep is lower than usual. The two systems are not lining up in the same way tonight.","icon":"activity"},{"id":"next-day","kicker":"THE NEXT CLUE","title":"One night is not a diagnosis","body":"Mina notes the nap, the timing, and how the night unfolds. She gathers a pattern instead of turning one night into a verdict.","icon":"zap"}],"insight":{"title":"The useful question","body":"When pressure and clock timing do not line up, observe the pattern. The goal is understanding, not perfect control."}}},{"source_id":"u1_l5_process_terms","node_source_id":"u1_2_sleep_disruptors-n1","order_index":2,"type":"term_chip","phase":"define","duration_seconds":45,"scaffold_level":2,"difficulty":0.12,"is_scored":false,"concept":"sleep_architecture","content":{"category":"term_chip","format":"term_chip","completionMode":"direct","title":"Two terms to keep","instruction":"Tap both panels to see how the parts work together.","word":"Two-process model","definition":"Sleep pressure and circadian timing are different systems. Sleep becomes easier when their signals line up, but people and nights vary.","panels":[{"id":"pressure","label":"PROCESS S · TAP TO OPEN","revealLabel":"PROCESS S · THE NEED","example":"A long day awake builds sleep pressure.","explanation":"Process S is the growing need for sleep. Sleep and naps release some of that pressure."},{"id":"clock","label":"PROCESS C · TAP TO OPEN","revealLabel":"PROCESS C · THE TIMING","example":"Light and repeated timing cues shape alertness.","explanation":"Process C is circadian timing: a rhythm that helps organize alertness and sleep across the day."}],"note":"The two processes interact; neither one is a moral score."}},{"source_id":"u1_l5_two_process_check","node_source_id":"u1_2_sleep_disruptors-n1","order_index":3,"type":"course_choice","phase":"apply","duration_seconds":45,"scaffold_level":3,"difficulty":0.2,"is_scored":true,"concept":"sleep_pressure","content":{"category":"course_choice","format":"course_choice","title":"Use both parts of the map","instruction":"Choose the explanation that fits best.","context":"Ravi sleeps late after a long evening nap. The next morning, he wakes at his usual time but feels groggy.","prompt":"Which reading uses the two-process model without blame?","options":[{"id":"both","label":"The nap changed sleep pressure, while the usual wake cue still shaped morning timing","isCorrect":true,"feedback":"Right. The nap and the regular wake cue can both matter. One night does not prove a broken system."},{"id":"pressure-only","label":"Only sleep pressure matters; timing cues do nothing","feedback":"The model has two parts. A nap may change pressure while the body clock keeps its own rhythm."},{"id":"willpower","label":"Ravi should force an earlier bedtime to make up for it","feedback":"Forcing a schedule is not the model. Start by observing which part changed."}],"feedbackTitle":"Two clues, one night","feedbackTakeaway":"You can use a sleep model without turning it into a new rule to fear.","workedExample":"A late nap can lower sleep pressure, while a regular wake cue still arrives in the morning. Both signals can be true at once.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l5_model_takeaway","node_source_id":"u1_2_sleep_disruptors-n1","order_index":4,"type":"one_line_reveal","phase":"remember","duration_seconds":30,"scaffold_level":1,"difficulty":0.08,"is_scored":false,"concept":"sleep_pressure","content":{"category":"one_line_reveal","format":"one_line_reveal","completionMode":"direct","title":"One line to remember","instruction":"Tap to complete the thought.","firstLine":"When sleep is off…","secondLine":"…ask which system changed before you blame yourself.","why":"The question keeps the model useful. Pressure, timing, naps, light, and arousal can all change a night; noticing the clue gives you a next step without demanding certainty."}},{"source_id":"u1_l6_caffeine_evidence","node_source_id":"u1_2_sleep_disruptors-n2","order_index":0,"type":"evidence_bite","phase":"understand","duration_seconds":45,"scaffold_level":1,"difficulty":0.1,"is_scored":false,"concept":"caffeine_sleep","content":{"category":"evidence_bite","format":"evidence_bite","completionMode":"direct","primaryLabel":"Continue","title":"The caffeine clue","instruction":"One finding, with its limits.","finding":"Caffeine can make you feel less sleepy while the underlying need for sleep is still building.","confidence":"Strong","confidenceWhy":"Caffeine’s sleep effects are well studied, but the timing and size of the effect vary with dose, biology, medicines, pregnancy, and sensitivity.","note":"The evidence supports a pattern question, not one universal cutoff for everyone."}},{"source_id":"u1_l6_caffeine_curiosity","node_source_id":"u1_2_sleep_disruptors-n2","order_index":1,"type":"curiosity_bet","phase":"bet","duration_seconds":30,"scaffold_level":1,"difficulty":0.08,"is_scored":false,"concept":"caffeine_sleep","content":{"category":"curiosity_bet","format":"curiosity_bet","completionMode":"direct","title":"Place a useful bet","instruction":"Commit before the answer.","question":"What gives the clearest answer about caffeine and your sleep?","options":["A universal cutoff that works for everyone","Your timing, amount, sensitivity, and sleep pattern together","One difficult night treated as proof"],"bestAnswerIndex":1,"answer":"Your own pattern, observed across more than one night."}},{"source_id":"u1_l6_caffeine_what_if","node_source_id":"u1_2_sleep_disruptors-n2","order_index":2,"type":"what_if_machine","phase":"experiment","duration_seconds":60,"scaffold_level":2,"difficulty":0.16,"is_scored":false,"concept":"caffeine_sleep","content":{"category":"what_if_machine","format":"what_if_machine","completionMode":"direct","title":"What if you move one drink earlier?","instruction":"Predict first, then run the small experiment.","options":[{"id":"clearer","label":"Sleepiness may feel clearer later"},{"id":"same","label":"Nothing will change at all"},{"id":"worse","label":"One change will prove the whole answer"}],"steps":["Choose one usual drink and note its time and amount.","For a few comparable nights, move only that drink earlier or leave it unchanged.","Notice bedtime sleepiness, settling, and next-morning rest, not just one moment.","Use the pattern as information. Keep what helps; drop the rule if it does not fit."],"rule":"One small comparison beats a universal caffeine rule.","takeaway":"The aim is not to prove caffeine is good or bad. It is to learn whether timing and amount matter for you."}},{"source_id":"u1_l6_caffeine_scenario","node_source_id":"u1_2_sleep_disruptors-n2","order_index":3,"type":"course_choice","phase":"transfer","duration_seconds":45,"scaffold_level":3,"difficulty":0.2,"is_scored":true,"concept":"caffeine_sleep","content":{"category":"course_choice","format":"course_choice","title":"Read the afternoon coffee","instruction":"Choose the most careful explanation.","context":"Priya drinks a large coffee at 3pm and feels wired at 11pm. She wants to know whether the coffee could be part of the pattern.","prompt":"What is the best next step?","options":[{"id":"observe","label":"Compare caffeine timing and sleep across several nights","isCorrect":true,"feedback":"Yes. A pattern is more useful than a single guess."},{"id":"certain","label":"Assume the coffee is definitely the only cause","feedback":"Caffeine may contribute, but sleep usually has more than one influence."},{"id":"ignore","label":"Assume caffeine cannot affect sleep after lunch","feedback":"Some people remain sensitive for many hours."}],"feedbackTitle":"Use the model carefully","feedbackTakeaway":"A personal pattern beats a rigid universal rule.","workedExample":"Caffeine may contribute to later alertness. Observe timing, amount, and sleep before deciding what to change.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l6_caffeine_plan","node_source_id":"u1_2_sleep_disruptors-n2","order_index":4,"type":"if_then_plan","phase":"plan","duration_seconds":45,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"caffeine_sleep","content":{"category":"if_then_plan","format":"if_then_plan","completionMode":"direct","title":"Build a caffeine experiment","instruction":"Choose one moment and one thing to notice.","cues":["I have caffeine after lunch","I feel wired at bedtime","I want to know whether caffeine is part of my pattern"],"actions":["note the time and amount, then notice sleepiness later","compare a few similar nights before changing anything big","try moving one drink earlier and observe what changes"],"privacy":"Saved privately. No reminders unless you ask.","feedbackTitle":"Pattern before policy","feedback":"A small comparison gives you more useful information than a permanent rule. If sleep problems persist, a clinician can help assess the whole picture."}},{"source_id":"u1_l7_alcohol_evidence","node_source_id":"u1_2_sleep_disruptors-n3","order_index":0,"type":"evidence_bite","phase":"understand","duration_seconds":45,"scaffold_level":1,"difficulty":0.1,"is_scored":false,"concept":"alcohol_sleep","content":{"category":"evidence_bite","format":"evidence_bite","completionMode":"direct","primaryLabel":"Continue","title":"The whole-night finding","instruction":"One finding, with its limits.","finding":"Alcohol may make falling asleep feel easier while changing later sleep and increasing wakefulness for some people.","confidence":"Strong","confidenceWhy":"The broad early-night/later-night pattern is well studied, but the size of the effect varies with dose, timing, biology, and the person’s sleep context.","note":"A changed night is worth noticing; it is not a moral judgement or a diagnosis."}},{"source_id":"u1_l7_alcohol_story","node_source_id":"u1_2_sleep_disruptors-n3","order_index":1,"type":"story_serial","phase":"story","duration_seconds":75,"scaffold_level":2,"difficulty":0.18,"is_scored":false,"concept":"alcohol_sleep","content":{"category":"story_serial","format":"story_serial","completionMode":"direct","title":"Arun’s two versions of the night","instruction":"Choose a path, then rewind to see the other one.","episodeLabel":"ONE NIGHT · TWO READINGS","opening":"Arun drinks in the evening and falls asleep quickly. He wants to know whether the first hour tells the whole story.","branches":[{"id":"first-hour","choice":"Judge the night by how fast sleep began","label":"THE FIRST-HOUR READING","beats":["Sleep arrives quickly, so Arun assumes the drink helped the whole night.","Later, he wakes several times and feels unrefreshed. The first hour did not show the whole pattern.","The early benefit felt real, but it was not the same as restorative sleep across the night."]},{"id":"whole-night","choice":"Read the whole night before deciding","label":"THE WHOLE-NIGHT READING","beats":["Arun notes the drink’s timing and amount, then notices both sleep onset and later waking.","He keeps the explanation bounded: alcohol may contribute, but other sleep factors can matter too.","He has a pattern to discuss, not a verdict about his character or one guaranteed cause."]}],"reflectionPrompt":"What did the first hour hide?","reflectionOptions":[{"id":"later-sleep","label":"Later sleep quality can differ from sleep onset","feedback":"Yes. Falling asleep quickly and sleeping well across the night are different questions."},{"id":"one-cause","label":"One drink proves the exact cause","feedback":"Keep the reading careful. Alcohol may contribute, but one night rarely proves one exact cause."}],"stamp":"Read the whole night, not just the first hour.","hook":"A private pattern check comes next."}},{"source_id":"u1_l7_alcohol_match","node_source_id":"u1_2_sleep_disruptors-n3","order_index":2,"type":"twin_case","phase":"match","duration_seconds":45,"scaffold_level":2,"difficulty":0.16,"is_scored":true,"concept":"alcohol_sleep","content":{"category":"twin_case","format":"twin_case","completionMode":"direct","title":"Match the two halves","instruction":"Tap an effect, then its most useful explanation.","leftTitle":"What you notice","rightTitle":"What it may mean","pairs":[{"id":"onset","left":"Falling asleep faster","right":"Early-night sedation can feel helpful"},{"id":"waking","left":"Waking more later","right":"Sleep may be more fragmented in the second half"},{"id":"morning","left":"Feeling unrefreshed","right":"The whole night matters, not only sleep onset"}],"rightOrderIds":["morning","onset","waking"],"rule":"Sleep onset and sleep quality are different questions.","body":"Match the observation to a bounded explanation. The pattern can be real without proving one exact cause.","next":"Now apply the whole-night reading to a new example."}},{"source_id":"u1_l7_alcohol_scenario","node_source_id":"u1_2_sleep_disruptors-n3","order_index":3,"type":"course_choice","phase":"transfer","duration_seconds":50,"scaffold_level":3,"difficulty":0.22,"is_scored":true,"concept":"alcohol_sleep","content":{"category":"course_choice","format":"course_choice","title":"Read the second half","instruction":"Choose the most grounded explanation.","context":"Arun falls asleep quickly after drinking, then wakes several times later and feels unrefreshed.","prompt":"What could be part of the explanation?","options":[{"id":"architecture","label":"Alcohol may have changed sleep architecture and increased later disruption","isCorrect":true,"feedback":"Yes. The whole-night pattern matters, not only how fast sleep began."},{"id":"proof","label":"The pattern proves one exact biological cause","feedback":"Several factors can affect sleep. Keep the explanation bounded."},{"id":"character","label":"Arun is weak for needing alcohol to sleep","feedback":"Moral judgement does not explain the sleep pattern and can make help harder to seek."}],"feedbackTitle":"Look at the whole night","feedbackTakeaway":"Sleep onset and sleep quality are different questions.","workedExample":"Alcohol can change the shape of the night. If drinking or sleep disruption is worrying, professional support is appropriate.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l7_alcohol_private_check","node_source_id":"u1_2_sleep_disruptors-n3","order_index":4,"type":"private_check","phase":"notice","duration_seconds":45,"scaffold_level":2,"difficulty":0.1,"is_scored":false,"concept":"alcohol_sleep","content":{"category":"private_check","format":"private_check","completionMode":"direct","primaryLabel":"Continue","title":"A private pattern check","instruction":"Tick any that feel familiar or choose none.","items":["I fall asleep quickly after drinking but wake more later","I use alcohol because I hope it will make sleep easier","I notice a different next morning after drinking","I would like to discuss alcohol and sleep with a qualified clinician"],"feedbackTitle":"Patterns, not shame","feedback":"Whatever you ticked, this stays private and is not scored. Alcohol and sleep concerns are worth support, not moral judgement."}},{"source_id":"u1_l8_disruptor_layers","node_source_id":"u1_2_sleep_disruptors-n4","order_index":0,"type":"layer_zoom","phase":"trace","duration_seconds":50,"scaffold_level":1,"difficulty":0.14,"is_scored":false,"concept":"light_stress_disruptors","content":{"category":"layer_zoom","format":"layer_zoom","completionMode":"direct","title":"Zoom in on one disrupted evening","instruction":"Tap through the cue, the body, and the timing effect.","layers":[{"kicker":"THE CUES","title":"Bright light, a stressful message, and a late wake-up plan","body":"Several small signals arrive close to bedtime and across the weekend."},{"kicker":"THE BODY","title":"Alertness gets more information than rest","body":"Light and stress can keep arousal up while a changing schedule gives the clock mixed timing cues."},{"kicker":"THE PATTERN","title":"Monday feels harder without a single villain","body":"The useful move is to name the strongest clue first, then change one thing gently."}],"insight":"Light, stress, and wake-time drift are different clues. Naming the clue keeps a small experiment more precise."}},{"source_id":"u1_l8_disruptor_evidence","node_source_id":"u1_2_sleep_disruptors-n4","order_index":1,"type":"evidence_bite","phase":"evidence","duration_seconds":40,"scaffold_level":1,"difficulty":0.12,"is_scored":false,"concept":"light_stress_disruptors","content":{"category":"evidence_bite","format":"evidence_bite","completionMode":"direct","title":"The clue is not a character flaw","instruction":"Open the short research note.","finding":"Evening light, stress, and changing wake times can each shift sleep timing or alertness.","confidence":"moderate, with context","confidenceWhy":"These cues affect people differently. Research supports looking for patterns, not blaming one cue for every hard night.","note":"Use evidence to choose a small observation, not a perfect rule."}},{"source_id":"u1_l8_disruptor_diary","node_source_id":"u1_2_sleep_disruptors-n4","order_index":2,"type":"annotated_diary","phase":"notice","duration_seconds":35,"scaffold_level":1,"difficulty":0.12,"is_scored":false,"concept":"light_stress_disruptors","content":{"category":"annotated_diary","format":"annotated_diary","completionMode":"direct","title":"A Sunday night, in one line","instruction":"Notice the clues without judging the person.","diary":"11:20pm. The room is bright, I keep replaying a work message, and I plan to sleep late tomorrow.","annotation":"Three different clues appear together: light, stress, and wake-time drift. Naming them separately makes the next experiment clearer.","note":"One difficult night can teach you something without defining you."}},{"source_id":"u1_l8_evening_comparison","node_source_id":"u1_2_sleep_disruptors-n4","order_index":3,"type":"evening_comparison","phase":"compare","duration_seconds":45,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"light_stress_disruptors","content":{"category":"evening_comparison","format":"evening_comparison","completionMode":"direct","primaryLabel":"Continue","title":"Two Sunday evenings","instruction":"Compare the cues each routine gives the body.","columns":[{"heading":"Routine A","rows":["Bright room and phone until bed","A work message gets replayed","Wake time shifts three hours on Sunday"],"outcome":"More mixed signals"},{"heading":"Routine B","rows":["Dimmer light for the last hour","The message is written down for tomorrow","Wake time stays closer to weekdays"],"outcome":"Clearer cues"}],"explanation":"Neither routine is a moral pass or fail. The second gives the clock and alarm fewer competing signals.","note":"Change one cue first so you can learn what matters."}},{"source_id":"u1_l8_wake_drift_what_if","node_source_id":"u1_2_sleep_disruptors-n4","order_index":4,"type":"what_if_machine","phase":"experiment","duration_seconds":60,"scaffold_level":2,"difficulty":0.16,"is_scored":false,"concept":"circadian_rhythm","content":{"category":"what_if_machine","format":"what_if_machine","completionMode":"direct","title":"What if Sunday shifts three hours?","instruction":"Predict first, then follow the timing clue.","options":[{"id":"mixed","label":"Monday may feel out of step"},{"id":"proof","label":"It proves something is wrong with me"},{"id":"none","label":"Wake time never affects timing"}],"steps":["Dara wakes at 7am on weekdays and 10am on Sunday.","The body clock receives a larger timing shift than usual.","Monday arrives at the weekday time, but the rhythm has less time to adjust.","Dara treats this as a clue to observe, not a verdict or a universal rule."],"rule":"Wake-time drift can make timing feel harder without making the body broken.","takeaway":"A useful experiment changes one timing cue gently and watches the pattern over several days."}},{"source_id":"u1_l8_disruptor_scenario","node_source_id":"u1_2_sleep_disruptors-n4","order_index":5,"type":"course_choice","phase":"transfer","duration_seconds":45,"scaffold_level":3,"difficulty":0.2,"is_scored":true,"concept":"light_stress_disruptors","content":{"category":"course_choice","format":"course_choice","title":"Read Monday morning","instruction":"Choose the clearest pattern.","context":"Dara wakes at 7am on weekdays but sleeps until 10am on both weekend days. Monday feels groggy.","prompt":"What is a useful first hypothesis?","options":[{"id":"drift","label":"The weekend shift may be giving the clock mixed cues","isCorrect":true,"feedback":"Yes. Timing is a reasonable place to look before making a judgement."},{"id":"lazy","label":"Dara is simply lazy","feedback":"A schedule pattern is not a moral label."},{"id":"certain","label":"The weekend shift is definitely the only cause","feedback":"It is a hypothesis, not a diagnosis. Other factors can matter too."}],"feedbackTitle":"Hypothesis, not verdict","feedbackTakeaway":"You can investigate a cue without overclaiming.","workedExample":"Weekend drift is one plausible timing clue. Observe it alongside light, stress, and sleep quality.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l8_disruptor_plan","node_source_id":"u1_2_sleep_disruptors-n4","order_index":6,"type":"if_then_plan","phase":"plan","duration_seconds":45,"scaffold_level":2,"difficulty":0.14,"is_scored":false,"concept":"light_stress_disruptors","content":{"category":"if_then_plan","format":"if_then_plan","completionMode":"direct","title":"Build one timing plan","instruction":"Choose one cue and one small response.","cues":["the evening gets very bright","a stressful thought follows me toward bed","my weekend wake time shifts by several hours"],"actions":["dim one light and notice what changes","write the thought down, then return to a neutral cue","try a wake time closer to weekdays and observe Monday"],"privacy":"Saved privately. No reminders unless you ask.","feedbackTitle":"One cue, one response","feedback":"A small plan makes the pattern testable. You do not need to change light, stress, and wake time all at once."}},{"source_id":"u1_l9_checkpoint_review","node_source_id":"u1_2_sleep_disruptors-n5","order_index":0,"type":"course_checkpoint","phase":"review","duration_seconds":150,"scaffold_level":3,"difficulty":0.28,"is_scored":true,"concept":"sleep_architecture","content":{"category":"course_checkpoint","format":"course_checkpoint","completionMode":"direct","title":"Sleep science checkpoint","instruction":"A calm mixed review. Use the map without memory pressure.","introTitle":"Look for the pattern","intro":"Four short questions revisit the levers and disruptors. A miss only marks a useful revisit; it does not erase progress.","items":[{"concept":"Sleep levers","context":"After a hard night, a person says, “My body is broken.”","prompt":"What is the kinder, more useful reading?","clue":"Think system, not character.","worked":"Pressure, clock, and arousal can shift. Naming the lever gives you a next question without turning a night into a verdict.","options":[{"label":"A sleep lever may have shifted; the person has not failed","isCorrect":true,"feedback":"Right. Sleep is a body system with changing levers, not a test of worth."},{"label":"The person needs more discipline","feedback":"That adds blame without explaining the pattern. Look for the lever first."}]},{"concept":"Sleep pressure","context":"A late afternoon nap makes bedtime feel less sleepy.","prompt":"Which lever is a useful first place to look?","clue":"What builds while you stay awake?","worked":"Wakefulness builds sleep pressure. A long or late nap can release some of that pressure before bedtime.","options":[{"label":"Pressure was partly released before bed","isCorrect":true,"feedback":"Yes. The nap may have changed sleep pressure; it is a clue, not a moral error."},{"label":"The body forgot how to sleep","feedback":"One changed night does not mean the system is broken. Follow the pressure clue."}]},{"concept":"Timing cues","context":"Bright light, a replayed work message, and a three-hour Sunday sleep-in happen together.","prompt":"What makes the next step more useful?","clue":"Separate the clues before changing them.","worked":"Light, stress, and wake-time drift are different cues. Separating them lets one small experiment teach you something.","options":[{"label":"Name each cue, then test one small change","isCorrect":true,"feedback":"Right. Several cues can coexist without one being the whole cause."},{"label":"Change every routine at once","feedback":"Changing everything makes the result hard to read. Start with one cue."}]},{"concept":"Small experiment","prompt":"What makes a sleep experiment useful?","clue":"A good experiment teaches, even when sleep is imperfect.","worked":"Change one cue, observe several nights, and treat the result as information rather than a pass or fail.","options":[{"label":"One cue, several observations, no self-blame","isCorrect":true,"feedback":"Exactly. The goal is a clearer pattern, not a perfect night on demand."},{"label":"A perfect result on the first night","feedback":"One night is noisy. Repeated, low-pressure observation teaches more."}]}],"revisitMessage":"The marked ideas are worth a short revisit before changing your routine. Nothing is lost.","solidMessage":"The map is holding. Next, use it to run one small experiment and read what changes."}},{"source_id":"u1_l10_experiment_recall","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":0,"type":"recall_warmup","phase":"retrieve","duration_seconds":40,"scaffold_level":2,"difficulty":0.2,"is_scored":false,"concept":"sleep_experiment","content":{"category":"recall_warmup","format":"recall_warmup","completionMode":"direct","title":"Retrieve before you change","instruction":"Recall the rule, then reveal it.","cards":[{"question":"What does a useful sleep experiment change first?","answer":"One clear cue. Do not change every part of the night at once."},{"question":"How long should you observe before judging the pattern?","answer":"Several ordinary nights, because one night is noisy."},{"question":"What does a difficult result mean?","answer":"It is information for the next question, not proof that you failed."}]}},{"source_id":"u1_l10_experiment_twin_cases","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":1,"type":"twin_case","phase":"distinguish","duration_seconds":55,"scaffold_level":2,"difficulty":0.22,"is_scored":true,"concept":"sleep_experiment","content":{"category":"twin_case","format":"twin_case","completionMode":"direct","title":"Signal or verdict?","instruction":"Match each observation with the reading that keeps learning open.","leftTitle":"OBSERVATION","rightTitle":"USEFUL READING","pairs":[{"id":"one-night","left":"One rough night after a late coffee","right":"A clue worth repeating before deciding"},{"id":"three-nights","left":"Three nights improve after earlier coffee","right":"A pattern that supports one small change"},{"id":"no-change","left":"No clear change after one dim-light evening","right":"Not enough evidence yet; keep the question small"},{"id":"stressful-day","left":"A stressful day and a hard night together","right":"Several cues may overlap; avoid a single-cause verdict"}],"rightOrderIds":["stressful-day","one-night","no-change","three-nights"],"rule":"Observation becomes learning when you separate a clue from a conclusion.","body":"You can notice a pattern without demanding certainty from a small sample.","next":"The next card follows one person through that kind of experiment."}},{"source_id":"u1_l10_experiment_story","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":2,"type":"story_walkthrough","phase":"follow","duration_seconds":55,"scaffold_level":2,"difficulty":0.2,"is_scored":false,"concept":"sleep_experiment","content":{"category":"story_walkthrough","format":"story_walkthrough","completionMode":"direct","title":"Maya runs one small test","instruction":"Follow the week without chasing a perfect night.","beats":[{"id":"choose","kicker":"SUNDAY","title":"Maya chooses one cue","body":"She keeps her wake time closer to weekdays. She does not also overhaul light, caffeine, and bedtime.","icon":"moon"},{"id":"observe","kicker":"MONDAY–WEDNESDAY","title":"The nights are mixed","body":"One night is better, one is ordinary, and one is rough after a stressful day. Maya records the pattern without scoring herself.","icon":"activity"},{"id":"review","kicker":"THURSDAY","title":"She asks a smaller question","body":"Did the steadier wake time change morning alertness at all? The answer can guide the next experiment.","icon":"zap"}],"insight":{"title":"The experiment worked","body":"Even mixed results can show what to keep observing. Learning is the outcome, not a perfect sleep score."}}},{"source_id":"u1_l10_experiment_evidence","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":3,"type":"evidence_bite","phase":"evidence","duration_seconds":40,"scaffold_level":1,"difficulty":0.16,"is_scored":false,"concept":"sleep_experiment","content":{"category":"evidence_bite","format":"evidence_bite","completionMode":"direct","title":"Why one week teaches more","instruction":"Open the research note.","finding":"Repeated observations are more useful than one sleep score because sleep changes with stress, timing, light, and ordinary life.","confidence":"strong practical rule","confidenceWhy":"A short run of observations cannot prove a cause, but it can reveal a pattern worth testing again.","note":"Track only what helps answer your question."}},{"source_id":"u1_l10_experiment_choice","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":4,"type":"course_choice","phase":"transfer","duration_seconds":50,"scaffold_level":3,"difficulty":0.24,"is_scored":true,"concept":"sleep_experiment","content":{"category":"course_choice","format":"course_choice","title":"Read the week without blaming yourself","instruction":"Choose the conclusion the notes can actually support.","context":"For four nights, Ren kept wake time steady. Two mornings felt easier. One night followed a late stressful call and was rough.","prompt":"What is the most useful conclusion?","options":[{"id":"pattern","label":"Steadier timing may help, while stress still changes the picture","isCorrect":true,"feedback":"Yes. The notes support a cautious pattern, not a single-cause verdict."},{"id":"proof","label":"Steady wake time fixes sleep for everyone","feedback":"That overclaims. A personal experiment teaches one context, not a universal rule."},{"id":"failure","label":"The experiment failed because one night was rough","feedback":"One rough night is part of the data. Look at the whole small run."}],"feedbackTitle":"A useful pattern","feedbackTakeaway":"The next question can stay small and specific.","workedExample":"Keep the wake-time cue for a few more days, or compare it with the stress-call nights. Change one thing at a time.","primaryLabel":"Check answer","retryPhase":"choice"}},{"source_id":"u1_l10_experiment_plan","node_source_id":"u1_2_sleep_disruptors-n6_experiment","order_index":5,"type":"if_then_plan","phase":"plan","duration_seconds":50,"scaffold_level":2,"difficulty":0.18,"is_scored":false,"concept":"sleep_experiment","content":{"category":"if_then_plan","format":"if_then_plan","completionMode":"direct","title":"Set up the next small test","instruction":"Choose one cue and one way to observe it.","cues":["my weekend wake time drifts later","bright light stays on late","a stressful call follows me toward bed","I take a late nap and feel less sleepy"],"actions":["keep wake time closer to weekdays for several days","dim one light for the last hour","write one line about the call, then return to a neutral cue","note the nap time and compare the next bedtime"],"privacy":"Saved privately. No reminders unless you ask.","feedbackTitle":"Your question is ready","feedback":"A small experiment gives the next week a clear question. Keep the result private, review it gently, and change only one cue at a time."}}]'::jsonb) AS row(
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
