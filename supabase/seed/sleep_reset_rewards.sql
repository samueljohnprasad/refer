-- Course Rewards MVP content. Run after all Sleep Reset section seeds.
BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.seed_uuid(seed_value TEXT)
RETURNS UUID LANGUAGE SQL IMMUTABLE STRICT AS $function$
  SELECT (
    substr(md5(seed_value), 1, 8) || '-' || substr(md5(seed_value), 9, 4) || '-' ||
    substr(md5(seed_value), 13, 4) || '-' || substr(md5(seed_value), 17, 4) || '-' ||
    substr(md5(seed_value), 21, 12)
  )::uuid;
$function$;

UPDATE courses
SET reward_content = jsonb_build_object(
  'title', 'Course complete',
  'acknowledgement', 'You finished the Sleep Reset learning path and practised a set of tools you can return to when useful.',
  'capabilityHeading', 'What you can take with you',
  'capabilitySummary', jsonb_build_array(
    'Explain how sleep pressure, body-clock cues, and arousal interact.',
    'Choose a breathing or body-based settling practice that fits the moment.',
    'Build a flexible wind-down routine around realistic evening cues.',
    'Test one sleep-supporting change at a time and learn from the result.'
  ),
  'reviewActionLabel', 'Review course',
  'doneActionLabel', 'Finish for now'
)
WHERE id = pg_temp.seed_uuid('sleep-reset');

CREATE TEMP TABLE reward_units (
  source_id text PRIMARY KEY,
  capability text NOT NULL,
  insight_title text NOT NULL,
  insight_body text NOT NULL
) ON COMMIT DROP;

INSERT INTO reward_units VALUES
  ('u1_1_sleep_mechanics', 'Explain how sleep pressure, body-clock cues, and arousal work together.', 'Sleep is a coordinated rhythm', 'A difficult night is not a willpower failure. Sleep pressure, timing cues, and arousal can pull in different directions.'),
  ('u1_2_sleep_disruptors', 'Recognise common sleep disruptors and choose one small experiment.', 'Small inputs can shift the system', 'Caffeine, alcohol, light, and stress affect different parts of sleep. Testing one change makes the result easier to read.'),
  ('u2_1_breathing', 'Choose a comfortable breathing pattern for settling, steadying attention, or preparing for sleep.', 'Match the breath to the moment', 'Belly breathing supports gentle settling. Box breathing gives attention a steady structure. The 4-7-8 pattern emphasizes a longer exhale. The useful choice is one that feels comfortable enough to repeat.'),
  ('u2_2_body_relaxation', 'Choose and follow a body scan or muscle-relaxation practice based on what you notice.', 'Notice first, then choose', 'A body scan helps you notice sensations without changing them. Progressive muscle relaxation adds gentle tension and release. Choose awareness when you want to check in, and active release when your body feels held or tight.'),
  ('u3_1_shift_into_night', 'Build a flexible wind-down sequence using a repeatable cue and gentler evening light.', 'A reliable cue can stay flexible', 'A wind-down routine does not need an exact start time. A small repeatable event, such as dimming lights or putting work away, can help mark the shift from daytime demands into night.'),
  ('u3_2_make_the_bedroom_work', 'Identify the strongest bedroom friction and choose one realistic adjustment.', 'Change the strongest friction first', 'A perfect bedroom is not required. Start with the one source of light, noise, temperature, or wakeful activity that affects the room most. One clear change is easier to test and maintain.'),
  ('u3_3_clear_test_personalize', 'Create a personal evening plan with a mind-clearing tool and one testable change.', 'One change gives clearer feedback', 'When several evening habits change together, it is difficult to know what helped. Capturing busy thoughts and testing one small adjustment at a time makes the result easier to understand.');

UPDATE units AS unit
SET reward_content = jsonb_build_object(
  'title', 'Unit complete',
  'capabilityLabel', 'You can now',
  'capabilityStatement', reward.capability,
  'primaryActionLabel', 'Back to path'
)
FROM reward_units AS reward
WHERE unit.id = pg_temp.seed_uuid(reward.source_id);

CREATE TEMP TABLE lesson_rewards (source_id text PRIMARY KEY, takeaway text NOT NULL) ON COMMIT DROP;
INSERT INTO lesson_rewards VALUES
  ('u1_1_sleep_mechanics-n1', 'Sleep pressure, body-clock cues, and arousal are three different levers that shape sleep.'),
  ('u1_1_sleep_mechanics-n2', 'Sleep pressure builds with time awake while sleep cycles organise rest through the night.'),
  ('u1_1_sleep_mechanics-n3', 'Light and daily timing cues help set the body clock.'),
  ('u1_1_sleep_mechanics-n4', 'A small calming cue can lower effort when arousal is keeping the body alert.'),
  ('u1_2_sleep_disruptors-n1', 'Sleep pressure becomes stronger the longer you stay awake.'),
  ('u1_2_sleep_disruptors-n2', 'Caffeine can mask sleep pressure even while the need for sleep keeps building.'),
  ('u1_2_sleep_disruptors-n3', 'Alcohol may feel sedating while still disrupting sleep later in the night.'),
  ('u1_2_sleep_disruptors-n4', 'Light, stress, and changing wake times can each shift sleep timing.'),
  ('u1_2_sleep_disruptors-n5', 'The main sleep systems can be used together to explain a difficult night.'),
  ('u1_2_sleep_disruptors-n6_experiment', 'Changing one sleep input at a time makes the result easier to understand.'),
  ('u2_1_breathing-n1', 'The body can stay in an alert state after the day''s demands have ended.'),
  ('u2_1_breathing-n2', 'A gentle belly breath uses a comfortable inhale and a longer exhale.'),
  ('u2_1_breathing-n3', 'Box breathing gives attention a steady four-part pattern during a stress spike.'),
  ('u2_1_breathing-n4', 'The 4-7-8 pattern uses a longer exhale and can be shortened if the hold feels uncomfortable.'),
  ('u2_1_breathing-n5', 'Different breathing rhythms fit different moments; there is no single best pattern.'),
  ('u2_2_body_relaxation-n1', 'A body scan notices sensations without demanding that they change.'),
  ('u2_2_body_relaxation-n2', 'Progressive muscle relaxation uses gentle tension and release to make contrast noticeable.'),
  ('u2_2_body_relaxation-n3', 'Body scanning supports awareness, while muscle relaxation adds an active release step.'),
  ('u2_2_body_relaxation-n4', 'You can match a body-based practice to the signals you notice.'),
  ('u3_1_shift_into_night-n1', 'A short transition can help separate daytime demands from the next part of the evening.'),
  ('u3_1_shift_into_night-n2', 'A flexible wind-down range can survive late or unpredictable evenings.'),
  ('u3_1_shift_into_night-n3', 'A repeatable event can act as a switch cue without requiring an exact time.'),
  ('u3_1_shift_into_night-n4', 'Evening light carries timing information to the body clock.'),
  ('u3_1_shift_into_night-n5', 'Reducing one screen or light feature can be more realistic than disconnecting completely.'),
  ('u3_2_make_the_bedroom_work-n1', 'The strongest source of bedroom friction is the most useful place to begin.'),
  ('u3_2_make_the_bedroom_work-n2', 'One good-enough adjustment creates a clearer test than a full room overhaul.'),
  ('u3_2_make_the_bedroom_work-n3', 'Repeated wakeful activity can teach the bed to cue effort instead of sleep.'),
  ('u3_2_make_the_bedroom_work-n4', 'Following sleepiness and reducing awake time in bed can help rebuild the bed-sleep link.'),
  ('u3_2_make_the_bedroom_work-n5', 'Some sleep changes are safer with support from a qualified clinician.'),
  ('u3_3_clear_test_personalize-n1', 'Capturing a thought briefly can set it aside without solving it at bedtime.'),
  ('u3_3_clear_test_personalize-n2', 'A mind-clearing tool works best when it is small enough to use on an ordinary night.'),
  ('u3_3_clear_test_personalize-n3', 'Testing one change at a time makes the result easier to interpret.'),
  ('u3_3_clear_test_personalize-n4', 'A useful evening plan can combine flexible cues, a settling tool, and one clear experiment.');

UPDATE nodes AS node
SET reward_content = jsonb_build_object(
  'title', 'Lesson complete',
  'takeaway', reward.takeaway,
  'primaryActionLabel', 'Back to path'
)
FROM lesson_rewards AS reward
WHERE node.id = pg_temp.seed_uuid(reward.source_id);

DELETE FROM nodes
WHERE unit_id IN (SELECT pg_temp.seed_uuid(source_id) FROM reward_units)
  AND type IN ('chest', 'trophy');

WITH ranked AS (
  SELECT id, unit_id, row_number() OVER (PARTITION BY unit_id ORDER BY order_index, id) - 1 AS position,
    count(*) OVER (PARTITION BY unit_id) AS node_count
  FROM nodes
  WHERE unit_id IN (SELECT pg_temp.seed_uuid(source_id) FROM reward_units)
    AND type NOT IN ('chest', 'trophy')
)
UPDATE nodes AS node
SET order_index = ranked.position + CASE WHEN ranked.position >= ((ranked.node_count + 1) / 2) THEN 1 ELSE 0 END
FROM ranked
WHERE node.id = ranked.id;

INSERT INTO nodes (id, unit_id, title, type, content_type, order_index, estimated_mins, icon, reward_content)
SELECT pg_temp.seed_uuid(reward.source_id || '-reward-chest'), pg_temp.seed_uuid(reward.source_id),
  'Insight chest', 'chest', 'chest', (required.node_count + 1) / 2, 0, 'chest',
  jsonb_build_object('title', reward.insight_title, 'body', reward.insight_body,
    'claimActionLabel', 'Claim insight', 'primaryActionLabel', 'Back to path')
FROM reward_units AS reward
JOIN LATERAL (
  SELECT count(*)::int AS node_count FROM nodes
  WHERE unit_id = pg_temp.seed_uuid(reward.source_id) AND type NOT IN ('chest', 'trophy')
) AS required ON required.node_count >= 4;

INSERT INTO nodes (id, unit_id, title, type, content_type, order_index, estimated_mins, icon)
SELECT pg_temp.seed_uuid(reward.source_id || '-reward-trophy'), pg_temp.seed_uuid(reward.source_id),
  'Unit trophy', 'trophy', 'trophy', required.node_count + 1, 0, 'trophy'
FROM reward_units AS reward
JOIN LATERAL (
  SELECT count(*)::int AS node_count FROM nodes
  WHERE unit_id = pg_temp.seed_uuid(reward.source_id) AND type NOT IN ('chest', 'trophy')
) AS required ON true;

COMMIT;
