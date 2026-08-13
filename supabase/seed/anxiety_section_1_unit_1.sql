-- Anxiety, Section 1, Unit 1: The Alarm System
-- Inserts the published course shell and the seven currently available lessons.
-- Run after the Journey v5 migration. Stable UUIDs and upserts make reruns safe.

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
  FROM jsonb_to_recordset($course$[
  {
    "source_id": "anxiety",
    "title": "Anxiety: From Alarm to Action",
    "description": "Understand the anxiety alarm and separate strong feelings from evidence.",
    "icon_url": "anxiety",
    "color_hex": "5F7F58",
    "order_index": 1,
    "is_published": true,
    "domain": "mental_health_psychoeducation",
    "target_audience": "Adults with no prior CBT knowledge who experience worry, avoidance, reassurance seeking, panic-like sensations, or social and performance anxiety",
    "total_lessons": 7,
    "total_duration_weeks": 1,
    "sessions_per_week": 5,
    "session_duration_minutes": [
      5,
      9
    ]
  }
]$course$::jsonb) AS row(
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
  FROM jsonb_to_recordset($section$[
  {
    "source_id": "anxiety-s1-understand-the-alarm",
    "course_source_id": "anxiety",
    "title": "Understand the Alarm",
    "order_index": 1,
    "narrative_hook": "Anxiety is a protection system. Learn what it reports and what it cannot prove.",
    "badge_on_complete": "Alarm Mapper",
    "difficulty_range": [
      0.08,
      0.3
    ],
    "objectives": {
      "identify": "Name the body, prediction, and urge parts of the alarm.",
      "distinguish": "Separate alarm from danger, fear from anxiety, and intensity from evidence.",
      "explain": "Reconstruct how the alarm sequence can make danger feel certain.",
      "apply": "Use the alarm map in a changed situation."
    },
    "concepts_introduced": [
      "protective_alarm",
      "body_alarm",
      "threat_prediction",
      "protective_urges",
      "fear_and_anxiety",
      "intensity_not_probability"
    ]
  }
]$section$::jsonb) AS row(
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
  FROM jsonb_to_recordset($unit$[
  {
    "source_id": "anxiety-s1-u1-the-alarm-system",
    "section_source_id": "anxiety-s1-understand-the-alarm",
    "title": "The Alarm System",
    "icon_key": "unit-icon",
    "order_index": 1
  }
]$unit$::jsonb) AS row(
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
  FROM jsonb_to_recordset($nodes$[
  {
    "source_id": "anxiety-s1-u1-n1-anxiety-has-a-job",
    "unit_source_id": "anxiety-s1-u1-the-alarm-system",
    "title": "Anxiety Has a Job",
    "type": "lesson",
    "content_type": "lesson",
    "pass_threshold": 80,
    "order_index": 0,
    "estimated_mins": 5,
    "icon": "book",
    "new_concepts": [
      "protective_alarm"
    ],
    "review_concepts": [],
    "prerequisites": []
  },
  {
    "source_id": "anxiety-s1-u1-n2-how-the-body-prepares",
    "unit_source_id": "anxiety-s1-u1-the-alarm-system",
    "title": "How the Body Prepares",
    "type": "lesson",
    "content_type": "lesson",
    "pass_threshold": 80,
    "order_index": 1,
    "estimated_mins": 6,
    "icon": "book",
    "new_concepts": [
      "body_alarm"
    ],
    "review_concepts": [
      "protective_alarm"
    ],
    "prerequisites": [
      "protective_alarm"
    ]
  },
  {
    "source_id": "anxiety-s1-u1-n3-how-the-mind-predicts",
    "unit_source_id": "anxiety-s1-u1-the-alarm-system",
    "title": "How the Mind Predicts",
    "type": "lesson",
    "content_type": "lesson",
    "pass_threshold": 80,
    "order_index": 2,
    "estimated_mins": 8,
    "icon": "book",
    "new_concepts": [
      "threat_prediction"
    ],
    "review_concepts": [
      "protective_alarm",
      "body_alarm"
    ],
    "prerequisites": [
      "protective_alarm",
      "body_alarm"
    ]
  },
  {
    "source_id": "anxiety-s1-u1-n4-how-urges-protect",
    "unit_source_id": "anxiety-s1-u1-the-alarm-system",
    "title": "How Urges Protect",
    "type": "lesson",
    "content_type": "lesson",
    "pass_threshold": 80,
    "order_index": 3,
    "estimated_mins": 9,
    "icon": "book",
    "new_concepts": [
      "protective_urges"
    ],
    "review_concepts": [
      "body_alarm",
      "threat_prediction"
    ],
    "prerequisites": [
      "threat_prediction"
    ]
  },
  {
    "source_id": "anxiety-s1-u1-n5-fear-and-anxiety",
    "unit_source_id": "anxiety-s1-u1-the-alarm-system",
    "title": "Fear and Anxiety",
    "type": "lesson",
    "content_type": "lesson",
    "pass_threshold": 80,
    "order_index": 4,
    "estimated_mins": 7,
    "icon": "book",
    "new_concepts": [
      "fear_and_anxiety"
    ],
    "review_concepts": [
      "body_alarm",
      "threat_prediction",
      "protective_urges"
    ],
    "prerequisites": [
      "protective_alarm",
      "body_alarm"
    ]
  },
  {
    "source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence",
    "unit_source_id": "anxiety-s1-u1-the-alarm-system",
    "title": "Intensity Is Not Evidence",
    "type": "lesson",
    "content_type": "lesson",
    "pass_threshold": 80,
    "order_index": 5,
    "estimated_mins": 8,
    "icon": "book",
    "new_concepts": [
      "intensity_not_probability"
    ],
    "review_concepts": [],
    "prerequisites": [
      "protective_alarm",
      "body_alarm",
      "threat_prediction"
    ]
  },
  {
    "source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint",
    "unit_source_id": "anxiety-s1-u1-the-alarm-system",
    "title": "Alarm-System Checkpoint",
    "type": "checkpoint",
    "content_type": "checkpoint",
    "pass_threshold": 70,
    "order_index": 6,
    "estimated_mins": 9,
    "icon": "checkpoint",
    "new_concepts": [],
    "review_concepts": [
      "protective_alarm",
      "body_alarm",
      "threat_prediction",
      "protective_urges",
      "fear_and_anxiety",
      "intensity_not_probability"
    ],
    "prerequisites": [
      "protective_alarm",
      "body_alarm",
      "threat_prediction",
      "protective_urges",
      "fear_and_anxiety",
      "intensity_not_probability"
    ]
  }
]$nodes$::jsonb) AS row(
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
  FROM jsonb_to_recordset($exercises$[
  {
    "source_id": "anxiety-s1-u1-n1-anxiety-has-a-job-alarm-intuition",
    "node_source_id": "anxiety-s1-u1-n1-anxiety-has-a-job",
    "order_index": 0,
    "type": "intuition_check",
    "phase": "warmup",
    "duration_seconds": 25,
    "scaffold_level": 1,
    "difficulty": 0.08,
    "is_scored": false,
    "concept": "protective_alarm",
    "content": {
      "category": "intuition_check",
      "format": "intuition_check",
      "completionMode": "direct",
      "title": "What does your gut say?",
      "instruction": "Choose what feels more useful.",
      "prompt": "When anxiety appears, what does it prove?",
      "options": [
        {
          "id": "danger",
          "label": "Something bad is definitely happening"
        },
        {
          "id": "alarm",
          "label": "My protection system noticed possible danger"
        }
      ],
      "bestOptionId": "alarm",
      "revealTitle": "An alarm is a signal",
      "reveal": "Anxiety means the protection system has switched on. It does not confirm that the threat is real or likely.",
      "alternateReveal": "It can feel certain because the alarm is loud. The feeling is real, but certainty is not evidence.",
      "primaryLabel": "Continue",
      "waitingPrimaryLabel": "Choose above"
    }
  },
  {
    "source_id": "anxiety-s1-u1-n1-anxiety-has-a-job-smoke-alarm-rule",
    "node_source_id": "anxiety-s1-u1-n1-anxiety-has-a-job",
    "order_index": 1,
    "type": "concept_card",
    "phase": "teach",
    "duration_seconds": 35,
    "scaffold_level": 1,
    "difficulty": 0.1,
    "is_scored": false,
    "concept": "protective_alarm",
    "content": {
      "category": "concept_card",
      "format": "concept_card",
      "completionMode": "direct",
      "variant": "myth",
      "title": "A sensitive alarm can still work",
      "instruction": "Keep this rule for the next exercise.",
      "primaryLabel": "Continue",
      "myth": "If anxiety is strong, the danger must be serious.",
      "reality": "Anxiety is designed to protect quickly. It can react to uncertainty, memories, or predictions before the facts are clear.",
      "note": "The alarm deserves attention. It does not get the final vote on danger."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n1-anxiety-has-a-job-alarm-twin-case",
    "node_source_id": "anxiety-s1-u1-n1-anxiety-has-a-job",
    "order_index": 2,
    "type": "twin_case",
    "phase": "distinguish",
    "duration_seconds": 55,
    "scaffold_level": 2,
    "difficulty": 0.15,
    "is_scored": true,
    "concept": "protective_alarm",
    "content": {
      "category": "twin_case",
      "format": "twin_case",
      "completionMode": "direct",
      "title": "Match the two alarms",
      "instruction": "Match each signal with what it can tell us.",
      "leftTitle": "SIGNAL",
      "rightTitle": "WHAT WE KNOW",
      "pairs": [
        {
          "id": "smoke",
          "left": "Smoke alarm rings",
          "right": "It detected a possible fire"
        },
        {
          "id": "heart",
          "left": "Heart races before speaking",
          "right": "The body prepared for a possible threat"
        },
        {
          "id": "toast",
          "left": "Burnt toast sets it off",
          "right": "A loud alarm can be mistaken"
        },
        {
          "id": "meeting",
          "left": "A meeting sets anxiety off",
          "right": "Discomfort does not confirm danger"
        }
      ],
      "rightOrderIds": [
        "meeting",
        "smoke",
        "toast",
        "heart"
      ],
      "rule": "An alarm reports possible danger. It does not prove danger.",
      "body": "The response can be real and strong even when the situation is safe enough to approach.",
      "next": "Now use the rule in a new situation."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n1-anxiety-has-a-job-alarm-transfer",
    "node_source_id": "anxiety-s1-u1-n1-anxiety-has-a-job",
    "order_index": 3,
    "type": "course_choice",
    "phase": "transfer",
    "duration_seconds": 50,
    "scaffold_level": 3,
    "difficulty": 0.18,
    "is_scored": true,
    "concept": "protective_alarm",
    "content": {
      "category": "course_choice",
      "format": "course_choice",
      "title": "Read the alarm",
      "instruction": "Choose what the facts support.",
      "context": "Leena sees an email titled “Can we talk tomorrow?” Her stomach drops and her mind says she is about to lose her job.",
      "prompt": "What is the most accurate first reading?",
      "options": [
        {
          "id": "alarm",
          "label": "Her alarm reacted to uncertainty; the email does not yet prove the outcome",
          "isCorrect": true,
          "feedback": "Right. The body response is real, while the meaning is still uncertain."
        },
        {
          "id": "proof",
          "label": "The stomach drop proves she will lose her job",
          "feedback": "A body signal cannot confirm what the email means."
        },
        {
          "id": "ignore",
          "label": "She should ignore every anxious signal",
          "feedback": "Anxiety can point to something worth checking. The skill is to check facts without treating the alarm as proof."
        }
      ],
      "feedbackTitle": "Signal before conclusion",
      "feedbackTakeaway": "You can respect the alarm and still wait for evidence.",
      "workedExample": "Name the alarm, name what is known, and leave the unknown open.",
      "primaryLabel": "Check answer",
      "retryPhase": "choice"
    }
  },
  {
    "source_id": "anxiety-s1-u1-n2-how-the-body-prepares-body-story",
    "node_source_id": "anxiety-s1-u1-n2-how-the-body-prepares",
    "order_index": 0,
    "type": "story_walkthrough",
    "phase": "model",
    "duration_seconds": 55,
    "scaffold_level": 1,
    "difficulty": 0.1,
    "is_scored": false,
    "concept": "body_alarm",
    "content": {
      "category": "story_walkthrough",
      "format": "story_walkthrough",
      "completionMode": "direct",
      "title": "The body moves first",
      "instruction": "Follow one ordinary alarm response.",
      "beats": [
        {
          "id": "cue",
          "kicker": "THE CUE",
          "title": "Mina hears her name",
          "body": "She is asked to speak next in a meeting.",
          "icon": "zap"
        },
        {
          "id": "prepare",
          "kicker": "THE PREPARATION",
          "title": "Her body changes",
          "body": "Her heart speeds up, her mouth feels dry, and her shoulders tighten.",
          "icon": "activity"
        },
        {
          "id": "action",
          "kicker": "THE JOB",
          "title": "Attention narrows",
          "body": "Her system shifts energy toward quick action before the situation is fully understood.",
          "icon": "activity"
        }
      ],
      "insight": {
        "title": "Preparation can feel like danger",
        "body": "The sensations are real. Familiar anxiety sensations can show body preparation, but new, severe, or concerning physical symptoms need medical assessment."
      }
    }
  },
  {
    "source_id": "anxiety-s1-u1-n2-how-the-body-prepares-body-layer-zoom",
    "node_source_id": "anxiety-s1-u1-n2-how-the-body-prepares",
    "order_index": 1,
    "type": "layer_zoom",
    "phase": "teach",
    "duration_seconds": 45,
    "scaffold_level": 2,
    "difficulty": 0.13,
    "is_scored": false,
    "concept": "body_alarm",
    "content": {
      "category": "layer_zoom",
      "format": "layer_zoom",
      "title": "One moment, three layers",
      "instruction": "Open each layer.",
      "layers": [
        {
          "kicker": "SITUATION",
          "title": "A name is called",
          "body": "Mina is asked to speak next in a meeting."
        },
        {
          "kicker": "BODY ALARM",
          "title": "The system prepares",
          "body": "Her heart speeds up, her mouth feels dry, and her shoulders tighten."
        },
        {
          "kicker": "FUNCTION",
          "title": "The body gets ready",
          "body": "More alertness and muscle readiness would help if quick action were needed."
        }
      ],
      "insight": "The body can prepare before the mind knows whether the situation is dangerous, difficult, or simply important."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n2-how-the-body-prepares-surge-shape",
    "node_source_id": "anxiety-s1-u1-n2-how-the-body-prepares",
    "order_index": 2,
    "type": "surge_diagram",
    "phase": "model",
    "duration_seconds": 35,
    "scaffold_level": 1,
    "difficulty": 0.12,
    "is_scored": false,
    "concept": "body_alarm",
    "content": {
      "category": "surge_diagram",
      "format": "surge_diagram",
      "title": "An alarm changes over time",
      "instruction": "Read the shape.",
      "diagramTitle": "Activation rises, peaks, and can fall",
      "peakLabel": "strongest point",
      "fadeLabel": "body adjusts",
      "axisLabel": "time",
      "explanation": "Anxiety sensations can rise quickly because the system values speed. If the situation stays safe enough, the body can update and activation can fall.",
      "note": "The exact shape and timing vary. Do not assume an unfamiliar or severe physical symptom is anxiety."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n2-how-the-body-prepares-body-preparation-transfer",
    "node_source_id": "anxiety-s1-u1-n2-how-the-body-prepares",
    "order_index": 3,
    "type": "lever_scenario",
    "phase": "transfer",
    "duration_seconds": 65,
    "scaffold_level": 3,
    "difficulty": 0.21,
    "is_scored": true,
    "concept": "body_alarm",
    "content": {
      "category": "lever_scenario",
      "format": "lever_scenario",
      "completionMode": "direct",
      "title": "Read what the body is doing",
      "instruction": "Choose what the moment supports.",
      "capability": "You can recognize body preparation without using it to predict the outcome.",
      "variants": [
        {
          "sceneLabel": "MEETING · 10:15AM",
          "scene": "Nora is called to present. Her heart speeds up, her palms feel warm, and her attention locks onto the first slide.",
          "prompt": "What is the most accurate reading?",
          "clue": "Focus on the job of the body changes.",
          "worked": "The body increased alertness and readiness before Nora began. That preparation cannot tell us how the presentation will go.",
          "options": [
            {
              "id": "prepare",
              "label": "Her body is preparing for quick action and focused attention",
              "isCorrect": true,
              "feedback": "Yes. These changes fit short-term preparation for an important moment."
            },
            {
              "id": "outcome",
              "label": "Her body proves the presentation will go badly",
              "feedback": "Body preparation cannot predict how the presentation will go."
            },
            {
              "id": "broken",
              "label": "The sensations mean her body is failing",
              "feedback": "The sensations can be uncomfortable while still serving a protective preparation response."
            }
          ]
        },
        {
          "sceneLabel": "STREET · 7:30PM",
          "scene": "Arun hears footsteps behind him on a busy, well-lit street. His shoulders tighten and his walking pace increases. He turns and sees another commuter.",
          "prompt": "What do the body changes establish?",
          "clue": "Separate fast preparation from the meaning of the cue.",
          "worked": "Arun's system prepared before the footsteps were fully understood. Looking back supplied new information about the situation.",
          "options": [
            {
              "id": "fast-alarm",
              "label": "His alarm prepared him before the cue was fully understood",
              "isCorrect": true,
              "feedback": "Right. Fast preparation came before a clearer reading of the situation."
            },
            {
              "id": "danger-proof",
              "label": "The tight shoulders prove the footsteps were dangerous",
              "feedback": "The body response was real, but it did not identify who made the sound or why."
            },
            {
              "id": "imaginary",
              "label": "The sensations were imaginary because the commuter was safe",
              "feedback": "The sensations were real preparation, even though the cue became less threatening after checking."
            }
          ]
        }
      ]
    }
  },
  {
    "source_id": "anxiety-s1-u1-n3-how-the-mind-predicts-prediction-lens",
    "node_source_id": "anxiety-s1-u1-n3-how-the-mind-predicts",
    "order_index": 0,
    "type": "lens_replay",
    "phase": "notice",
    "duration_seconds": 50,
    "scaffold_level": 2,
    "difficulty": 0.14,
    "is_scored": false,
    "concept": "threat_prediction",
    "content": {
      "category": "lens_replay",
      "format": "lens_replay",
      "title": "Find what the mind added",
      "instruction": "Tap the highlighted lines.",
      "diaryLabel": "MONDAY · 4:20PM",
      "segments": [
        {
          "text": "My manager wrote, “Can we talk tomorrow?” "
        },
        {
          "text": "My stomach dropped. ",
          "key": "BODY ALARM",
          "response": "The protection system switched on quickly."
        },
        {
          "text": "I knew I was getting fired. ",
          "key": "PREDICTION",
          "response": "This is one possible outcome presented as certainty."
        },
        {
          "text": "The message did not say what the meeting was about.",
          "key": "KNOWN FACT",
          "response": "The meaning is still open."
        }
      ],
      "insight": "Anxiety often closes an information gap with the most threatening prediction. A prediction can feel certain before it is tested."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n3-how-the-mind-predicts-two-minds-dialogue",
    "node_source_id": "anxiety-s1-u1-n3-how-the-mind-predicts",
    "order_index": 1,
    "type": "dialogue",
    "phase": "teach",
    "duration_seconds": 50,
    "scaffold_level": 2,
    "difficulty": 0.15,
    "is_scored": false,
    "concept": "threat_prediction",
    "content": {
      "category": "dialogue",
      "format": "dialogue",
      "title": "Same message, two readings",
      "instruction": "Follow both minds.",
      "messages": [
        {
          "id": "event",
          "name": "MESSAGE",
          "side": "left",
          "text": "Can we talk tomorrow?"
        },
        {
          "id": "alarm",
          "name": "ALARM MIND",
          "side": "right",
          "text": "This must be bad. Prepare for the worst."
        },
        {
          "id": "checking",
          "name": "CHECKING MIND",
          "side": "left",
          "text": "I notice the alarm. The reason for the meeting is still unknown."
        },
        {
          "id": "response",
          "name": "CHECKING MIND",
          "side": "left",
          "text": "I can prepare for the conversation without treating one prediction as fact."
        }
      ],
      "insight": "The goal is not forced positivity. It is moving from one untested conclusion to a more accurate range of possibilities."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n3-how-the-mind-predicts-prediction-discovery",
    "node_source_id": "anxiety-s1-u1-n3-how-the-mind-predicts",
    "order_index": 2,
    "type": "guided_discovery_trail",
    "phase": "reason",
    "duration_seconds": 70,
    "scaffold_level": 2,
    "difficulty": 0.17,
    "is_scored": false,
    "concept": "threat_prediction",
    "content": {
      "category": "guided_discovery_trail",
      "format": "guided_discovery_trail",
      "completionMode": "direct",
      "title": "Follow the evidence gap",
      "instruction": "Choose one clue at a time.",
      "questions": [
        {
          "id": "trail-friend-fact",
          "prompt": "A friend has not replied since morning. What is known?",
          "summary": "Only the missing reply is known.",
          "options": [
            {
              "id": "trail-friend-fact-event",
              "label": "There is no reply yet",
              "response": "This describes the event without deciding what it means."
            },
            {
              "id": "trail-friend-fact-cause",
              "label": "The friend is upset",
              "response": "That could be true, but the reason is still unknown."
            }
          ]
        },
        {
          "id": "trail-thought-gap",
          "prompt": "The mind says, “I must have done something wrong.” What changed?",
          "summary": "A prediction filled an evidence gap.",
          "options": [
            {
              "id": "trail-thought-gap-evidence",
              "label": "New evidence arrived",
              "response": "No new evidence arrived; the mind supplied one possible explanation."
            },
            {
              "id": "trail-thought-gap-prediction",
              "label": "One prediction filled the gap",
              "response": "Uncertainty became one threatening conclusion."
            }
          ]
        },
        {
          "id": "trail-accurate-reading",
          "prompt": "What keeps the reading accurate while the reason is unknown?",
          "summary": "Event and prediction can stay separate.",
          "options": [
            {
              "id": "trail-accurate-reading-worst",
              "label": "Treat the worst possibility as preparation",
              "response": "Preparation can help, but possibility does not become fact."
            },
            {
              "id": "trail-accurate-reading-separate",
              "label": "Name the event and prediction separately",
              "response": "The concern stays visible without closing the evidence gap."
            }
          ]
        }
      ],
      "stamp": "EVENT AND PREDICTION SEPARATED"
    }
  },
  {
    "source_id": "anxiety-s1-u1-n3-how-the-mind-predicts-prediction-rule",
    "node_source_id": "anxiety-s1-u1-n3-how-the-mind-predicts",
    "order_index": 3,
    "type": "invent_first",
    "phase": "infer",
    "duration_seconds": 60,
    "scaffold_level": 3,
    "difficulty": 0.2,
    "is_scored": true,
    "concept": "threat_prediction",
    "content": {
      "category": "invent_first",
      "format": "invent_first",
      "title": "Invent the rule",
      "instruction": "Find what separates the readings.",
      "cases": [
        {
          "id": "certain",
          "name": "Nia",
          "reading": "says, “No reply means I offended her.”",
          "outcome": "one meaning",
          "isCalm": false
        },
        {
          "id": "positive",
          "name": "Omar",
          "reading": "says, “No reply means everything is fine.”",
          "outcome": "one meaning",
          "isCalm": false
        },
        {
          "id": "open",
          "name": "Tara",
          "reading": "says, “There is no reply yet. I do not know why.”",
          "outcome": "facts stay open",
          "isCalm": true
        }
      ],
      "options": [
        {
          "id": "certainty",
          "label": "Choose the most comforting explanation",
          "feedback": "Comfort can help, but a comforting guess is still a guess."
        },
        {
          "id": "separate",
          "label": "Separate what happened from what it might mean",
          "isCorrect": true,
          "feedback": "Yes. This keeps observation and prediction distinct."
        },
        {
          "id": "worst",
          "label": "Prepare by accepting the worst explanation",
          "feedback": "Treating the worst possibility as settled closes the evidence gap too early."
        }
      ],
      "rule": "Name what happened before naming what it means.",
      "body": "The event may be clear while its meaning remains uncertain. Accuracy keeps that gap open.",
      "next": "Now watch how a prediction can change the next part of the alarm cycle."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n3-how-the-mind-predicts-prediction-machine",
    "node_source_id": "anxiety-s1-u1-n3-how-the-mind-predicts",
    "order_index": 4,
    "type": "what_if_machine",
    "phase": "simulate",
    "duration_seconds": 60,
    "scaffold_level": 2,
    "difficulty": 0.18,
    "is_scored": false,
    "concept": "threat_prediction",
    "content": {
      "category": "what_if_machine",
      "format": "what_if_machine",
      "completionMode": "direct",
      "title": "What if one guess becomes a fact?",
      "instruction": "Predict, then run the chain.",
      "options": [
        {
          "id": "settles",
          "label": "The alarm settles because the mind found an answer"
        },
        {
          "id": "grows",
          "label": "The alarm grows around the untested answer"
        },
        {
          "id": "proves",
          "label": "The answer becomes more accurate"
        }
      ],
      "steps": [
        "A friend has not replied for six hours.",
        "Nia predicts, “I offended her.”",
        "Her body responds as if rejection is already happening.",
        "She checks the phone repeatedly and notices every minute of silence."
      ],
      "rule": "An untested prediction can become fuel for the alarm that produced it.",
      "takeaway": "Opening the meaning does not remove uncertainty. It stops one possibility from pretending to be the result."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n4-how-urges-protect-urge-cards",
    "node_source_id": "anxiety-s1-u1-n4-how-urges-protect",
    "order_index": 0,
    "type": "learn_cards",
    "phase": "teach",
    "duration_seconds": 80,
    "scaffold_level": 1,
    "difficulty": 0.13,
    "is_scored": true,
    "concept": "protective_urges",
    "content": {
      "category": "learn_cards",
      "format": "learn_cards",
      "title": "Meet four protective urges",
      "instruction": "Read the cards, then answer one recall.",
      "primaryLabel": "Check answer",
      "waitingPrimaryLabel": "Choose above",
      "retryPhase": "recall",
      "feedbackTitle": "Protection can take many forms",
      "feedbackTakeaway": "An urge is the alarm proposing an action. It is not a command.",
      "cards": [
        {
          "id": "fight",
          "kicker": "FIGHT",
          "title": "Push against the threat",
          "body": "Arguing, becoming sharp, or trying to control can be attempts to regain safety."
        },
        {
          "id": "flight",
          "kicker": "FLIGHT",
          "title": "Move away",
          "body": "Leaving, cancelling, or avoiding can quickly reduce contact with possible danger."
        },
        {
          "id": "freeze",
          "kicker": "FREEZE",
          "title": "Pause and go still",
          "body": "The mind may go blank while the system waits for more information."
        },
        {
          "id": "safety",
          "kicker": "SEEK SAFETY",
          "title": "Get certainty or protection",
          "body": "Checking, reassurance, and over-preparing can make uncertainty feel smaller for a while."
        }
      ],
      "recall": {
        "prompt": "Before sending an email, Dev asks three people to confirm every sentence. Which urge fits best?",
        "correctOptionId": "safety",
        "options": [
          {
            "id": "fight",
            "label": "Fight"
          },
          {
            "id": "freeze",
            "label": "Freeze"
          },
          {
            "id": "safety",
            "label": "Seek safety"
          }
        ]
      },
      "feedback_correct": "Right. Reassurance can be the alarm trying to remove uncertainty.",
      "feedback_incorrect": "Repeated confirmation is a safety-seeking urge: an attempt to feel certain before acting.",
      "workedExample": "The system predicts danger, then proposes a protective action such as fight, flight, freeze, or seeking safety."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n4-how-urges-protect-urge-chain",
    "node_source_id": "anxiety-s1-u1-n4-how-urges-protect",
    "order_index": 1,
    "type": "guided_recall_chips",
    "phase": "retrieve",
    "duration_seconds": 50,
    "scaffold_level": 2,
    "difficulty": 0.18,
    "is_scored": true,
    "concept": "protective_urges",
    "content": {
      "category": "guided_recall_chips",
      "format": "guided_recall_chips",
      "completionMode": "direct",
      "title": "Rebuild the protection chain",
      "instruction": "Tap the parts in order.",
      "prompt": "What happens from uncertainty to action?",
      "chips": [
        "protective urge",
        "uncertain event",
        "body alarm",
        "threat prediction"
      ],
      "answer": [
        "uncertain event",
        "body alarm",
        "threat prediction",
        "protective urge"
      ]
    }
  },
  {
    "source_id": "anxiety-s1-u1-n4-how-urges-protect-urge-function-match",
    "node_source_id": "anxiety-s1-u1-n4-how-urges-protect",
    "order_index": 2,
    "type": "lever_match",
    "phase": "associate",
    "duration_seconds": 70,
    "scaffold_level": 2,
    "difficulty": 0.19,
    "is_scored": false,
    "concept": "protective_urges",
    "content": {
      "category": "lever_match",
      "format": "lever_match",
      "completionMode": "direct",
      "title": "Match each urge to its job",
      "instruction": "Tap one urge and one protective job.",
      "clue": "Ask what the proposed action tries to change right away.",
      "pairs": [
        {
          "id": "fight",
          "left": "Fight",
          "right": "Push back or regain control"
        },
        {
          "id": "flight",
          "left": "Flight",
          "right": "Create distance from possible danger"
        },
        {
          "id": "freeze",
          "left": "Freeze",
          "right": "Pause while the system searches for safety"
        },
        {
          "id": "safety",
          "left": "Seek safety",
          "right": "Reduce uncertainty or get protection"
        }
      ],
      "rightOrder": [
        "freeze",
        "safety",
        "fight",
        "flight"
      ],
      "feedbackTitle": "Different actions, one protective aim",
      "feedback": "Each urge tries to reduce possible danger through a different action.",
      "capability": "You can identify an urge by the job it is trying to do."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n4-how-urges-protect-urge-shelf",
    "node_source_id": "anxiety-s1-u1-n4-how-urges-protect",
    "order_index": 3,
    "type": "toolkit_shelf",
    "phase": "classify",
    "duration_seconds": 50,
    "scaffold_level": 2,
    "difficulty": 0.17,
    "is_scored": false,
    "concept": "protective_urges",
    "content": {
      "category": "toolkit_shelf",
      "format": "toolkit_shelf",
      "completionMode": "direct",
      "title": "What is the alarm proposing?",
      "instruction": "Tap a moment and read its protective job.",
      "tools": [
        {
          "label": "Flight",
          "use": "move away"
        },
        {
          "label": "Freeze",
          "use": "pause action"
        },
        {
          "label": "Seek safety",
          "use": "reduce uncertainty"
        }
      ],
      "moments": [
        {
          "label": "Cancel before the social event",
          "toolIndex": 0,
          "key": "FLIGHT",
          "response": "The alarm proposes distance from possible rejection."
        },
        {
          "label": "Mind goes blank when called on",
          "toolIndex": 1,
          "key": "FREEZE",
          "response": "The system pauses while it searches for a safe response."
        },
        {
          "label": "Ask three people if the message is okay",
          "toolIndex": 2,
          "key": "SEEK SAFETY",
          "response": "The alarm asks for certainty before allowing action."
        }
      ],
      "note": "The same person can have different protective urges in different moments."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n4-how-urges-protect-urge-private-check",
    "node_source_id": "anxiety-s1-u1-n4-how-urges-protect",
    "order_index": 4,
    "type": "private_check",
    "phase": "reflect",
    "duration_seconds": 45,
    "scaffold_level": 2,
    "difficulty": 0.16,
    "is_scored": false,
    "concept": "protective_urges",
    "content": {
      "category": "private_check",
      "format": "private_check",
      "completionMode": "direct",
      "title": "Which protective moves feel familiar?",
      "instruction": "Choose any that fit, or choose none.",
      "items": [
        "I cancel before I know what will happen",
        "My mind goes blank when attention turns to me",
        "I ask for reassurance before I act",
        "I become sharp when I feel cornered"
      ],
      "feedbackTitle": "Protective moves, not personal flaws",
      "feedback": "These actions can be the alarm trying to create distance, certainty, control, or time. Naming the job creates room for choice."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n4-how-urges-protect-urge-transfer",
    "node_source_id": "anxiety-s1-u1-n4-how-urges-protect",
    "order_index": 5,
    "type": "lever_scenario",
    "phase": "transfer",
    "duration_seconds": 65,
    "scaffold_level": 3,
    "difficulty": 0.23,
    "is_scored": true,
    "concept": "protective_urges",
    "content": {
      "category": "lever_scenario",
      "format": "lever_scenario",
      "completionMode": "direct",
      "title": "Name the urge, keep the choice",
      "instruction": "Read the moment and name the function.",
      "capability": "You can recognize a protective urge without treating it as a command.",
      "variants": [
        {
          "sceneLabel": "FRIDAY · 6:20PM",
          "scene": "Jo feels tense before a social event. Her mind predicts rejection and she wants to cancel immediately.",
          "prompt": "What is the clearest reading?",
          "clue": "Look at the action the alarm proposes.",
          "worked": "The prediction is rejection. Cancelling creates distance, so the proposed protective action is flight.",
          "options": [
            {
              "id": "flight",
              "label": "The alarm is proposing flight",
              "isCorrect": true,
              "feedback": "Yes. Cancelling would move Jo away from possible rejection."
            },
            {
              "id": "proof",
              "label": "The urge proves the event is unsafe",
              "feedback": "The urge shows the alarm's proposal, not the event's actual safety."
            },
            {
              "id": "fake",
              "label": "The urge is not real",
              "feedback": "The urge is real even when its prediction is incomplete."
            }
          ]
        }
      ]
    }
  },
  {
    "source_id": "anxiety-s1-u1-n5-fear-and-anxiety-term-map-recall",
    "node_source_id": "anxiety-s1-u1-n5-fear-and-anxiety",
    "order_index": 0,
    "type": "recall_warmup",
    "phase": "retrieve",
    "duration_seconds": 45,
    "scaffold_level": 2,
    "difficulty": 0.16,
    "is_scored": false,
    "concept": "protective_urges",
    "content": {
      "category": "recall_warmup",
      "format": "recall_warmup",
      "completionMode": "direct",
      "title": "Bring back three parts of the alarm",
      "instruction": "Recall each answer, then reveal.",
      "cards": [
        {
          "question": "What do we call the body's preparation for possible danger?",
          "answer": "Body alarm."
        },
        {
          "question": "What do we call the meaning the mind adds about what may happen?",
          "answer": "Threat prediction."
        },
        {
          "question": "What do we call the action the alarm proposes next?",
          "answer": "Protective urge."
        }
      ],
      "successPrimaryLabel": "Continue"
    }
  },
  {
    "source_id": "anxiety-s1-u1-n5-fear-and-anxiety-fear-anxiety-compare",
    "node_source_id": "anxiety-s1-u1-n5-fear-and-anxiety",
    "order_index": 1,
    "type": "same_but_different",
    "phase": "distinguish",
    "duration_seconds": 55,
    "scaffold_level": 2,
    "difficulty": 0.18,
    "is_scored": false,
    "concept": "fear_and_anxiety",
    "content": {
      "category": "same_but_different",
      "format": "same_but_different",
      "title": "Fear and anxiety",
      "instruction": "Open each difference.",
      "leftHeading": "FEAR",
      "rightHeading": "ANXIETY",
      "rows": [
        {
          "question": "Where is the threat?",
          "left": "Here or happening now",
          "right": "Expected or imagined ahead"
        },
        {
          "question": "What does attention track?",
          "left": "Immediate danger cues",
          "right": "Signs of what might happen"
        },
        {
          "question": "What action feels urgent?",
          "left": "Protect now",
          "right": "Prevent, prepare, or avoid"
        }
      ],
      "tell": "Fear responds to a threat in the present. Anxiety prepares for a threat that may happen. Both use the same protection system."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n5-fear-and-anxiety-anxiety-transfer",
    "node_source_id": "anxiety-s1-u1-n5-fear-and-anxiety",
    "order_index": 2,
    "type": "lever_scenario",
    "phase": "transfer",
    "duration_seconds": 65,
    "scaffold_level": 3,
    "difficulty": 0.22,
    "is_scored": true,
    "concept": "fear_and_anxiety",
    "content": {
      "category": "lever_scenario",
      "format": "lever_scenario",
      "completionMode": "direct",
      "title": "Find future preparation",
      "instruction": "Choose the process most visible in the moment.",
      "capability": "You can identify anxiety as preparation for a possible future threat.",
      "variants": [
        {
          "sceneLabel": "NEXT WEEK · FLIGHT",
          "scene": "Priya's flight is next week. Each time she imagines boarding, her stomach tightens and she wants to avoid choosing a seat.",
          "prompt": "Which process is most visible?",
          "clue": "Look at when the possible threat is expected.",
          "worked": "The flight is not happening now. Priya's body and attention are preparing for a possible future threat, which fits anxiety.",
          "options": [
            {
              "id": "anxiety",
              "label": "Anxiety preparing for a possible future threat",
              "isCorrect": true,
              "feedback": "Yes. Her protection system is preparing for something expected later."
            },
            {
              "id": "fear",
              "label": "Fear responding to danger happening now",
              "feedback": "The flight is next week, so the threat is anticipated rather than present."
            },
            {
              "id": "certainty",
              "label": "Proof that the flight will be unsafe",
              "feedback": "The body response does not establish what will happen on the flight."
            }
          ]
        },
        {
          "sceneLabel": "NEXT MONTH · PERFORMANCE",
          "scene": "Leo's performance is next month. Seeing the stage makes him tense and alert, and he wants to stop attending rehearsals.",
          "prompt": "What best describes this response?",
          "clue": "Separate present danger from preparation for what may happen later.",
          "worked": "No performance is happening now. Leo's system is preparing for a possible future social threat, which fits anxiety.",
          "options": [
            {
              "id": "anxiety",
              "label": "Anxiety about a possible future threat",
              "isCorrect": true,
              "feedback": "Right. The alertness and avoidance urge are organized around a future event."
            },
            {
              "id": "fear",
              "label": "Fear of immediate danger on the stage",
              "feedback": "The performance is not happening now, so immediate danger is not the clearest fit."
            },
            {
              "id": "present",
              "label": "A response to danger happening now",
              "feedback": "The performance is still in the future, so this is anticipatory anxiety."
            }
          ]
        }
      ]
    }
  },
  {
    "source_id": "anxiety-s1-u1-n5-fear-and-anxiety-fear-anxiety-production",
    "node_source_id": "anxiety-s1-u1-n5-fear-and-anxiety",
    "order_index": 3,
    "type": "fill_blank",
    "phase": "produce",
    "duration_seconds": 65,
    "scaffold_level": 4,
    "difficulty": 0.22,
    "is_scored": true,
    "concept": "fear_and_anxiety",
    "content": {
      "category": "fill_blank",
      "format": "fill_blank",
      "completionMode": "direct",
      "title": "Name the process",
      "instruction": "Type the missing word.",
      "capability": "You can distinguish fear from anxiety by locating the threat in time.",
      "variants": [
        {
          "pre": "A response to danger happening now is closer to",
          "post": ".",
          "answers": [
            "fear"
          ],
          "exampleWords": [
            "fear",
            "anxiety"
          ],
          "correctFeedback": "Yes. Fear is organized around a threat in the present.",
          "incorrectFeedback": "Look for the process tied most closely to danger happening now.",
          "workedExample": "A car moves toward you in the road. The immediate response is fear."
        },
        {
          "pre": "Preparation for a threat that may happen later is closer to",
          "post": ".",
          "answers": [
            "anxiety"
          ],
          "exampleWords": [
            "fear",
            "anxiety"
          ],
          "correctFeedback": "Right. Anxiety prepares for a possible threat ahead.",
          "incorrectFeedback": "Look at whether the threat is present or expected later.",
          "workedExample": "A presentation is next week. Preparing for possible rejection is closer to anxiety."
        }
      ]
    }
  },
  {
    "source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence-intensity-bet",
    "node_source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence",
    "order_index": 0,
    "type": "curiosity_bet",
    "phase": "predict",
    "duration_seconds": 35,
    "scaffold_level": 1,
    "difficulty": 0.12,
    "is_scored": false,
    "concept": "intensity_not_probability",
    "content": {
      "category": "curiosity_bet",
      "format": "curiosity_bet",
      "completionMode": "direct",
      "title": "Place a bet",
      "instruction": "Choose before seeing the answer.",
      "question": "Anxiety rises from 4 out of 10 to 9 out of 10. What definitely increased?",
      "options": [
        "The chance of danger",
        "The alarm system's activation",
        "The accuracy of the prediction"
      ],
      "bestAnswerIndex": 1,
      "answer": "The alarm system's activation"
    }
  },
  {
    "source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence-intensity-trap",
    "node_source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence",
    "order_index": 1,
    "type": "common_trap",
    "phase": "teach",
    "duration_seconds": 50,
    "scaffold_level": 2,
    "difficulty": 0.16,
    "is_scored": false,
    "concept": "intensity_not_probability",
    "content": {
      "category": "common_trap",
      "format": "common_trap",
      "title": "The trap that feels convincing",
      "instruction": "See what the shortcut misses.",
      "trapTitle": "I feel terrified, so this must be dangerous.",
      "trapBody": "The mind uses the strength of the feeling as evidence about the outside world.",
      "relief": "Treating the feeling as proof can make a quick decision feel certain.",
      "rebound": "Avoidance prevents new information, so the same alarm may feel even more convincing next time.",
      "counterMove": "Measure two things separately: how intense the alarm feels and what current evidence says about danger."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence-intensity-diary",
    "node_source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence",
    "order_index": 2,
    "type": "annotated_diary",
    "phase": "model",
    "duration_seconds": 35,
    "scaffold_level": 1,
    "difficulty": 0.14,
    "is_scored": false,
    "concept": "intensity_not_probability",
    "content": {
      "category": "annotated_diary",
      "format": "annotated_diary",
      "completionMode": "direct",
      "title": "Two ratings in one moment",
      "instruction": "Read the annotation.",
      "diary": "The elevator doors closed. My anxiety was 8 out of 10. The elevator was operating normally and had passed inspection.",
      "annotation": "Alarm intensity: high. Current evidence of danger: low. Both facts can be true at the same time.",
      "note": "Care for the distress. Use evidence to judge the situation."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence-intensity-evidence-cases",
    "node_source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence",
    "order_index": 3,
    "type": "twin_case",
    "phase": "distinguish",
    "duration_seconds": 70,
    "scaffold_level": 3,
    "difficulty": 0.24,
    "is_scored": true,
    "concept": "intensity_not_probability",
    "content": {
      "category": "twin_case",
      "format": "twin_case",
      "completionMode": "direct",
      "title": "Match feeling strength with evidence",
      "instruction": "Match each moment with the most accurate reading.",
      "leftTitle": "MOMENT",
      "rightTitle": "ACCURATE READING",
      "pairs": [
        {
          "id": "elevator",
          "left": "8 out of 10 anxiety in an inspected elevator",
          "right": "High alarm, low current danger evidence"
        },
        {
          "id": "smoke",
          "left": "3 out of 10 concern while smoke is visible in the kitchen",
          "right": "Mild alarm, clear external cue to check"
        },
        {
          "id": "presentation",
          "left": "9 out of 10 anxiety before a familiar presentation",
          "right": "High alarm, outcome still unknown"
        },
        {
          "id": "gas",
          "left": "2 out of 10 concern after smelling gas near the stove",
          "right": "Low alarm, external evidence still matters"
        }
      ],
      "rightOrderIds": [
        "presentation",
        "gas",
        "elevator",
        "smoke"
      ],
      "rule": "Feeling strength and situation evidence answer different questions.",
      "body": "High alarm can appear with little danger evidence. Low alarm does not erase an external cue that needs attention.",
      "next": "Use both measures before reaching a conclusion."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence-evidence-meter",
    "node_source_id": "anxiety-s1-u1-n6-intensity-is-not-evidence",
    "order_index": 4,
    "type": "association_meter",
    "phase": "apply",
    "duration_seconds": 65,
    "scaffold_level": 3,
    "difficulty": 0.24,
    "is_scored": false,
    "concept": "intensity_not_probability",
    "content": {
      "category": "association_meter",
      "format": "association_meter",
      "completionMode": "direct",
      "title": "What gets the final vote?",
      "instruction": "Try different ways of reading the alarm.",
      "leftLabel": "FEELING AS PROOF",
      "rightLabel": "FEELING PLUS EVIDENCE",
      "initialCaption": "The alarm is loud. The conclusion is still open.",
      "choices": [
        {
          "label": "Treat 9 out of 10 anxiety as 9 out of 10 danger",
          "delta": -20,
          "caption": "Intensity has replaced evidence."
        },
        {
          "label": "Rate the feeling, then list what is happening now",
          "delta": 25,
          "caption": "The feeling and the facts have separate places."
        },
        {
          "label": "Compare the prediction with past safe outcomes",
          "delta": 20,
          "caption": "Past outcomes add evidence without denying the feeling."
        }
      ],
      "rule": "Alarm intensity and danger probability are different measures.",
      "takeaway": "A strong feeling deserves support. A conclusion about danger needs evidence from the situation."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint-unit-recall",
    "node_source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint",
    "order_index": 0,
    "type": "recall_warmup",
    "phase": "retrieve",
    "duration_seconds": 55,
    "scaffold_level": 2,
    "difficulty": 0.18,
    "is_scored": false,
    "concept": "protective_alarm",
    "content": {
      "category": "recall_warmup",
      "format": "recall_warmup",
      "completionMode": "direct",
      "title": "Bring back the alarm map",
      "instruction": "Recall each answer, then reveal.",
      "cards": [
        {
          "question": "What does anxiety detect?",
          "answer": "Possible danger, not confirmed danger."
        },
        {
          "question": "What can the body do next?",
          "answer": "Prepare for action with changes in heart rate, breathing, attention, and muscle tension."
        },
        {
          "question": "What can the mind add?",
          "answer": "A prediction about what may happen."
        },
        {
          "question": "What can follow the prediction?",
          "answer": "A protective urge such as fight, flight, freeze, or seeking safety."
        },
        {
          "question": "What separates fear from anxiety?",
          "answer": "Fear responds to a present threat. Anxiety prepares for a possible future threat."
        },
        {
          "question": "What does intensity measure?",
          "answer": "Alarm activation, not the probability of danger."
        }
      ],
      "successPrimaryLabel": "Continue"
    }
  },
  {
    "source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint-alarm-map-explanation",
    "node_source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint",
    "order_index": 1,
    "type": "teach_back_chain",
    "phase": "explain",
    "duration_seconds": 80,
    "scaffold_level": 4,
    "difficulty": 0.27,
    "is_scored": true,
    "concept": "protective_alarm",
    "content": {
      "title": "Build the explanation",
      "instruction": "Put the causal steps in order.",
      "message": "Why can anxiety feel like proof even when the outcome is still uncertain?",
      "steps": [
        {
          "id": "evidence",
          "label": "The outcome still needs separate evidence",
          "order": 4
        },
        {
          "id": "cue",
          "label": "A cue or uncertainty activates the alarm",
          "order": 1
        },
        {
          "id": "response",
          "label": "The body prepares and a protective urge follows",
          "order": 3
        },
        {
          "id": "prediction",
          "label": "The mind adds a threat prediction",
          "order": 2
        }
      ],
      "transfer": {
        "prompt": "Which explanation stays useful?",
        "options": [
          {
            "id": "transfer-evidence",
            "label": "Keep evidence separate",
            "isSupported": true,
            "response": "The sequence explains the alarm while leaving the outcome open.",
            "takeaway": "An alarm can feel convincing without confirming danger."
          },
          {
            "id": "transfer-proof",
            "label": "Alarm proves danger",
            "isSupported": false,
            "response": "The alarm can be strong without proving the outcome.",
            "takeaway": "Check evidence separately from the body alarm."
          },
          {
            "id": "transfer-ignore",
            "label": "Ignore the alarm",
            "isSupported": false,
            "response": "The alarm deserves care, but it does not settle the facts.",
            "takeaway": "Notice the signal and check what is known."
          }
        ]
      }
    }
  },
  {
    "source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint-alarm-map-story",
    "node_source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint",
    "order_index": 2,
    "type": "story_serial",
    "phase": "apply",
    "duration_seconds": 90,
    "scaffold_level": 3,
    "difficulty": 0.24,
    "is_scored": false,
    "concept": "protective_alarm",
    "content": {
      "category": "story_serial",
      "format": "story_serial",
      "completionMode": "direct",
      "title": "Walk both alarm paths",
      "instruction": "Choose one path, then rewind.",
      "episodeLabel": "ONE INVITE · TWO READINGS",
      "opening": "Sam receives a meeting invite with no explanation. His chest tightens and he wants to cancel.",
      "branches": [
        {
          "choice": "Treat the alarm as proof",
          "label": "PROOF PATH",
          "beats": [
            "Sam decides the meeting must be bad.",
            "His body prepares as if the predicted outcome is already happening.",
            "Cancelling brings quick relief, but the meaning of the invite remains untested."
          ]
        },
        {
          "choice": "Separate alarm from evidence",
          "label": "MAP PATH",
          "beats": [
            "Sam names the tight chest as body preparation.",
            "He labels “This will be bad” as a prediction and cancelling as a flight urge.",
            "He checks the invite facts before deciding what action fits."
          ]
        }
      ],
      "reflectionPrompt": "What changed between the paths?",
      "reflectionOptions": [
        {
          "id": "alarm",
          "label": "The first path had stronger anxiety",
          "feedback": "Both paths began with the same body alarm. The difference was how Sam read it."
        },
        {
          "id": "reading",
          "label": "The second path separated prediction from evidence",
          "feedback": "Yes. The alarm stayed real while the conclusion remained open to evidence."
        },
        {
          "id": "certainty",
          "label": "The second path guaranteed a good meeting",
          "feedback": "No outcome was guaranteed. The second path was more accurate about what was known."
        }
      ],
      "stamp": "ALARM MAP USED",
      "hook": "Now apply the map without the story prompts."
    }
  },
  {
    "source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint-unit-checkpoint",
    "node_source_id": "anxiety-s1-u1-n7-alarm-system-checkpoint",
    "order_index": 3,
    "type": "course_checkpoint",
    "phase": "checkpoint",
    "duration_seconds": 225,
    "scaffold_level": 3,
    "difficulty": 0.3,
    "is_scored": true,
    "concept": "protective_alarm",
    "content": {
      "category": "course_checkpoint",
      "format": "course_checkpoint",
      "completionMode": "direct",
      "title": "Alarm-system checkpoint",
      "instruction": "Use the map in five changed situations.",
      "introTitle": "Read each signal accurately",
      "intro": "Separate what is happening, what the alarm predicts, and what the evidence supports.",
      "items": [
        {
          "concept": "Alarm versus danger",
          "context": "Kai feels a sudden jolt when a phone rings during a quiet evening.",
          "prompt": "What does the jolt establish?",
          "clue": "Separate the response from its cause.",
          "worked": "The jolt shows rapid alarm activation. The sound can be checked separately for danger.",
          "options": [
            {
              "label": "The alarm activated before the sound was understood",
              "isCorrect": true,
              "feedback": "Right. Fast protection can happen before accurate interpretation."
            },
            {
              "label": "The phone must contain bad news",
              "feedback": "The body response does not reveal what the call means."
            }
          ]
        },
        {
          "concept": "Body preparation",
          "context": "Mara's mouth becomes dry just before she introduces herself to a group.",
          "prompt": "Which reading fits the body map?",
          "clue": "What job is the protection system trying to do?",
          "worked": "The body has shifted toward action and alertness in response to a social challenge.",
          "options": [
            {
              "label": "Her body is preparing for a possible social threat",
              "isCorrect": true,
              "feedback": "Yes. Dry mouth can be part of short-term preparation."
            },
            {
              "label": "Her body proves the group will reject her",
              "feedback": "The sensation does not predict the group's response."
            }
          ]
        },
        {
          "concept": "Prediction and urge",
          "context": "After one small mistake, Sol thinks everyone noticed and wants to leave immediately.",
          "prompt": "What are the prediction and urge?",
          "clue": "Find the imagined outcome, then the proposed action.",
          "worked": "“Everyone noticed” is the threat prediction. Leaving is the flight urge proposed by the alarm.",
          "options": [
            {
              "label": "Prediction: everyone noticed. Urge: leave",
              "isCorrect": true,
              "feedback": "Right. Naming both parts creates room to check the facts."
            },
            {
              "label": "Fact: everyone noticed. Proof: leave",
              "feedback": "The thought is not yet established as fact, and an urge is not proof."
            }
          ]
        },
        {
          "concept": "Fear and anxiety",
          "context": "A bicycle swerves into Imani's path. She jumps back. The next day, she feels tense before using the same crossing.",
          "prompt": "Which reading separates the two moments?",
          "clue": "Locate each threat in time.",
          "worked": "Jumping back responds to a threat happening now, which fits fear. Tension before returning prepares for a possible future threat, which fits anxiety.",
          "options": [
            {
              "label": "The first moment is fear; the later anticipation is anxiety",
              "isCorrect": true,
              "feedback": "Right. Present threat and anticipated threat use the same alarm system at different times."
            },
            {
              "label": "Both moments prove the crossing is currently dangerous",
              "feedback": "The first moment contains an immediate threat. The later alarm anticipates what might happen."
            }
          ]
        },
        {
          "concept": "Intensity and evidence",
          "context": "A familiar elevator brings anxiety to 8 out of 10. It is operating normally and has just passed inspection.",
          "prompt": "Which conclusion uses both measures?",
          "clue": "Rate the feeling and the evidence separately.",
          "worked": "The alarm is highly activated. The available evidence does not show that the elevator is unsafe.",
          "options": [
            {
              "label": "High anxiety, with no new evidence of danger",
              "isCorrect": true,
              "feedback": "Exactly. Intensity and probability are separate."
            },
            {
              "label": "Eight out of ten anxiety means eight out of ten danger",
              "feedback": "An anxiety rating measures activation, not external probability."
            }
          ]
        }
      ],
      "revisitMessage": "Review the marked parts of the alarm map, then try them in another ordinary moment.",
      "solidMessage": "You can separate alarm, body preparation, prediction, urge, fear, anxiety, and evidence. The next unit builds on this map."
    }
  }
]$exercises$::jsonb) AS row(
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

DO $validation$
DECLARE
  inserted_node_count INT;
  inserted_exercise_count INT;
BEGIN
  SELECT COUNT(*)
  INTO inserted_node_count
  FROM nodes
  WHERE unit_id = pg_temp.seed_uuid('anxiety-s1-u1-the-alarm-system');

  SELECT COUNT(*)
  INTO inserted_exercise_count
  FROM exercises
  WHERE node_id IN (
    SELECT id
    FROM nodes
    WHERE unit_id = pg_temp.seed_uuid('anxiety-s1-u1-the-alarm-system')
  );

  IF inserted_node_count <> 7 THEN
    RAISE EXCEPTION
      'Anxiety Unit 1 seed expected 7 nodes but found %',
      inserted_node_count;
  END IF;

  IF inserted_exercise_count <> 32 THEN
    RAISE EXCEPTION
      'Anxiety Unit 1 seed expected 32 exercises but found %',
      inserted_exercise_count;
  END IF;
END
$validation$;

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
WHERE c.id = pg_temp.seed_uuid('anxiety')
  AND s.id = pg_temp.seed_uuid('anxiety-s1-understand-the-alarm')
  AND u.id = pg_temp.seed_uuid('anxiety-s1-u1-the-alarm-system')
GROUP BY c.id, c.title;
