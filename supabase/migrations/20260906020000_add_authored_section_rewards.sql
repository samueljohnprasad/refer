-- Author production reward content for Sleep Reset Sections 2 and 3.
BEGIN;

CREATE TEMP TABLE authored_unit_rewards (
  unit_id uuid PRIMARY KEY,
  chest_id uuid UNIQUE NOT NULL,
  trophy_id uuid UNIQUE NOT NULL,
  chest_order integer NOT NULL,
  insight_title text NOT NULL,
  insight_body text NOT NULL,
  capability_statement text NOT NULL
) ON COMMIT DROP;

INSERT INTO authored_unit_rewards VALUES
  (
    '845d048e-ae56-8b90-e8b1-6cec17c9ef13',
    '4c8f6814-14c5-2f52-102b-3dd0f07d5e19',
    'e3733e01-867d-1d98-b07a-4f6c52eeb83e',
    3,
    'Match the breath to the moment',
    'Belly breathing supports gentle settling. Box breathing gives attention a steady structure. The 4-7-8 pattern emphasizes a longer exhale. The useful choice is one that feels comfortable enough to repeat.',
    'Choose a comfortable breathing pattern for settling, steadying attention, or preparing for sleep.'
  ),
  (
    '0520afb1-c530-0b59-287f-fff940d73bb0',
    'eb6983a8-54d3-d61d-c290-db93803b2730',
    'ac20c4b5-0c56-a74f-c86b-426687705ded',
    2,
    'Notice first, then choose',
    'A body scan helps you notice sensations without changing them. Progressive muscle relaxation adds gentle tension and release. Choose awareness when you want to check in, and active release when your body feels held or tight.',
    'Choose and follow a body scan or muscle-relaxation practice based on what you notice.'
  ),
  (
    '9f72aa56-4d3d-492e-ebe1-32495adb731f',
    '78c99df6-56d9-17a1-9ac2-437a48c14ec9',
    '44d7f585-983d-2e8f-a84c-40ac01cf686e',
    3,
    'A reliable cue can stay flexible',
    'A wind-down routine does not need an exact start time. A small repeatable event, such as dimming lights or putting work away, can help mark the shift from daytime demands into night.',
    'Build a flexible wind-down sequence using a repeatable cue and gentler evening light.'
  ),
  (
    '6bdfb938-76fd-9f14-fb8a-e646f759ad51',
    'b059065c-f64e-ffe2-8a7f-57561fb53a1c',
    '36b279cb-1cc0-9231-88e0-615db0005117',
    3,
    'Change the strongest friction first',
    'A perfect bedroom is not required. Start with the one source of light, noise, temperature, or wakeful activity that affects the room most. One clear change is easier to test and maintain.',
    'Identify the strongest bedroom friction and choose one realistic adjustment.'
  ),
  (
    'd2e5ba0d-3a63-8472-e9d1-16939749396e',
    'a4be3ae8-54d3-9eef-fd3d-1a082f64e96f',
    '6b0d0b44-0b9e-8f6e-1232-11ef655f168d',
    2,
    'One change gives clearer feedback',
    'When several evening habits change together, it is difficult to know what helped. Capturing busy thoughts and testing one small adjustment at a time makes the result easier to understand.',
    'Create a personal evening plan with a mind-clearing tool and one testable change.'
  );

UPDATE units AS unit
SET reward_content = jsonb_build_object(
  'title', 'Unit complete',
  'capabilityLabel', 'You can now',
  'capabilityStatement', reward.capability_statement,
  'primaryActionLabel', 'Back to path'
)
FROM authored_unit_rewards AS reward
WHERE unit.id = reward.unit_id;

UPDATE nodes AS node
SET order_index = node.order_index + 100
WHERE node.unit_id IN (SELECT unit_id FROM authored_unit_rewards);

WITH ranked_nodes AS (
  SELECT
    node.id,
    row_number() OVER (
      PARTITION BY node.unit_id
      ORDER BY node.order_index, node.id
    ) - 1 AS position,
    reward.chest_order
  FROM nodes AS node
  JOIN authored_unit_rewards AS reward ON reward.unit_id = node.unit_id
  WHERE node.type NOT IN ('chest', 'trophy')
)
UPDATE nodes AS node
SET order_index = ranked.position
  + CASE WHEN ranked.position >= ranked.chest_order THEN 1 ELSE 0 END
FROM ranked_nodes AS ranked
WHERE node.id = ranked.id;

INSERT INTO nodes (
  id,
  unit_id,
  title,
  type,
  content_type,
  order_index,
  estimated_mins,
  icon,
  reward_content
)
SELECT
  reward.chest_id,
  reward.unit_id,
  'Insight chest',
  'chest',
  'chest',
  reward.chest_order,
  0,
  'chest',
  jsonb_build_object(
    'title', reward.insight_title,
    'body', reward.insight_body,
    'claimActionLabel', 'Claim insight',
    'primaryActionLabel', 'Back to path'
  )
FROM authored_unit_rewards AS reward
ON CONFLICT (id) DO UPDATE SET
  unit_id = EXCLUDED.unit_id,
  title = EXCLUDED.title,
  type = EXCLUDED.type,
  content_type = EXCLUDED.content_type,
  order_index = EXCLUDED.order_index,
  estimated_mins = EXCLUDED.estimated_mins,
  icon = EXCLUDED.icon,
  reward_content = EXCLUDED.reward_content;

INSERT INTO nodes (
  id,
  unit_id,
  title,
  type,
  content_type,
  order_index,
  estimated_mins,
  icon
)
SELECT
  reward.trophy_id,
  reward.unit_id,
  'Unit trophy',
  'trophy',
  'trophy',
  required.node_count + 1,
  0,
  'trophy'
FROM authored_unit_rewards AS reward
JOIN LATERAL (
  SELECT count(*)::integer AS node_count
  FROM nodes
  WHERE unit_id = reward.unit_id
    AND type NOT IN ('chest', 'trophy')
) AS required ON true
ON CONFLICT (id) DO UPDATE SET
  unit_id = EXCLUDED.unit_id,
  title = EXCLUDED.title,
  type = EXCLUDED.type,
  content_type = EXCLUDED.content_type,
  order_index = EXCLUDED.order_index,
  estimated_mins = EXCLUDED.estimated_mins,
  icon = EXCLUDED.icon;

UPDATE nodes AS node
SET reward_content = jsonb_set(
  node.reward_content,
  '{claimActionLabel}',
  '"Claim insight"'::jsonb,
  true
)
FROM units AS unit, sections AS section
WHERE node.unit_id = unit.id
  AND unit.section_id = section.id
  AND section.course_id = '4684990b-bc14-799c-012a-9766336342f2'
  AND node.type = 'chest'
  AND node.reward_content IS NOT NULL;

COMMIT;
