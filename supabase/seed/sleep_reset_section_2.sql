-- Sleep Reset, Section 2: Calm the Body
-- Seeds all lessons in section-2-exercises.yaml and course-outline.yaml.
-- The outline supplies the authored mechanics for l12-l18.
-- Run after sleep_reset_section_1.sql. Stable UUIDs and upserts make reruns safe.

BEGIN;

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
  FROM jsonb_to_recordset($json$
    [
      {
        "source_id": "s2_calm_the_body",
        "course_source_id": "sleep-reset",
        "title": "Calm the Body",
        "order_index": 2,
        "narrative_hook": "Your nervous system learned to stay on guard. Now we teach it to stand down.",
        "badge_on_complete": "Body Calm",
        "difficulty_range": [0.30, 0.60],
        "objectives": {
          "remember": "Name three breathing techniques and the specific use case for each.",
          "understand": "Explain how slow breathing activates the parasympathetic system.",
          "apply": "Complete a full body scan and PMR exercise independently.",
          "analyze": "Identify which technique fits your personal tension pattern."
        },
        "concepts_introduced": [
          "stress_response_basics",
          "belly_breathing",
          "box_breathing",
          "breathing_478",
          "breathing_comparison",
          "body_scan",
          "progressive_muscle_relaxation",
          "body_relaxation_choice"
        ]
      }
    ]
  $json$::jsonb) AS row(
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
  FROM jsonb_to_recordset($json$
    [
      {
        "source_id": "u2_1_breathing",
        "section_source_id": "s2_calm_the_body",
        "title": "Breathing as a Switch",
        "icon_key": "unit-icon",
        "order_index": 1
      },
      {
        "source_id": "u2_2_body_relaxation",
        "section_source_id": "s2_calm_the_body",
        "title": "Reading and Releasing the Body",
        "icon_key": "unit-icon",
        "order_index": 2
      }
    ]
  $json$::jsonb) AS row(
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
  FROM jsonb_to_recordset($json$
    [
      {
        "source_id": "u2_1_breathing-n1",
        "unit_source_id": "u2_1_breathing",
        "title": "Your Nervous System at Night",
        "type": "lesson",
        "content_type": "lesson",
        "pass_threshold": 80,
        "order_index": 0,
        "estimated_mins": 9,
        "icon": "book",
        "new_concepts": ["stress_response_basics"],
        "review_concepts": ["light_stress_disruptors"],
        "prerequisites": []
      },
      {
        "source_id": "u2_1_breathing-n2",
        "unit_source_id": "u2_1_breathing",
        "title": "The Belly Breath",
        "type": "lesson",
        "content_type": "lesson",
        "pass_threshold": 80,
        "order_index": 1,
        "estimated_mins": 10,
        "icon": "book",
        "new_concepts": ["belly_breathing"],
        "review_concepts": ["stress_response_basics"],
        "prerequisites": []
      },
      {
        "source_id": "u2_1_breathing-n3",
        "unit_source_id": "u2_1_breathing",
        "title": "Box Breathing",
        "type": "lesson",
        "content_type": "lesson",
        "pass_threshold": 80,
        "order_index": 2,
        "estimated_mins": 11,
        "icon": "book",
        "new_concepts": ["box_breathing"],
        "review_concepts": ["belly_breathing", "stress_response_basics"],
        "prerequisites": []
      },
      {
        "source_id": "u2_1_breathing-n4",
        "unit_source_id": "u2_1_breathing",
        "title": "4-7-8: The Sleep Breath",
        "type": "lesson",
        "content_type": "lesson",
        "pass_threshold": 80,
        "order_index": 3,
        "estimated_mins": 10,
        "icon": "book",
        "new_concepts": ["breathing_478"],
        "review_concepts": ["box_breathing", "belly_breathing"],
        "prerequisites": []
      },
      {
        "source_id": "u2_1_breathing-n5",
        "unit_source_id": "u2_1_breathing",
        "title": "Comparing Your 3 Breathing Tools",
        "type": "lesson",
        "content_type": "lesson",
        "pass_threshold": 80,
        "order_index": 4,
        "estimated_mins": 11,
        "icon": "book",
        "new_concepts": ["breathing_comparison"],
        "review_concepts": ["belly_breathing", "box_breathing", "breathing_478"],
        "prerequisites": []
      },
      {
        "source_id": "u2_2_body_relaxation-n1",
        "unit_source_id": "u2_2_body_relaxation",
        "title": "Body Scan Basics",
        "type": "lesson",
        "content_type": "lesson",
        "pass_threshold": 80,
        "order_index": 0,
        "estimated_mins": 11,
        "icon": "book",
        "new_concepts": ["body_scan"],
        "review_concepts": ["breathing_478", "stress_response_basics"],
        "prerequisites": []
      },
      {
        "source_id": "u2_2_body_relaxation-n2",
        "unit_source_id": "u2_2_body_relaxation",
        "title": "Progressive Muscle Relaxation",
        "type": "lesson",
        "content_type": "lesson",
        "pass_threshold": 80,
        "order_index": 1,
        "estimated_mins": 12,
        "icon": "book",
        "new_concepts": ["progressive_muscle_relaxation"],
        "review_concepts": ["body_scan", "belly_breathing"],
        "prerequisites": []
      },
      {
        "source_id": "u2_2_body_relaxation-n3",
        "unit_source_id": "u2_2_body_relaxation",
        "title": "When to Use Each: Body Scan vs PMR",
        "type": "lesson",
        "content_type": "lesson",
        "pass_threshold": 80,
        "order_index": 2,
        "estimated_mins": 12,
        "icon": "book",
        "new_concepts": ["body_relaxation_choice"],
        "review_concepts": ["body_scan", "progressive_muscle_relaxation"],
        "prerequisites": []
      },
      {
        "source_id": "u2_2_body_relaxation-n4",
        "unit_source_id": "u2_2_body_relaxation",
        "title": "Body Calm Checkpoint",
        "type": "checkpoint",
        "content_type": "checkpoint",
        "pass_threshold": 80,
        "order_index": 3,
        "estimated_mins": 10,
        "icon": "checkpoint",
        "new_concepts": [],
        "review_concepts": ["body_scan", "progressive_muscle_relaxation", "box_breathing", "belly_breathing", "breathing_478", "breathing_comparison", "body_relaxation_choice"],
        "prerequisites": []
      }
    ]
  $json$::jsonb) AS row(
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
  FROM jsonb_to_recordset($json$
    [
      {
        "source_id": "u2_l10_nervous_system_cards",
        "node_source_id": "u2_1_breathing-n1",
        "order_index": 0,
        "type": "learn_cards",
        "phase": "warmup",
        "duration_seconds": 40,
        "scaffold_level": 1,
        "difficulty": 0.10,
        "is_scored": false,
        "concept": "stress_response_basics",
        "content": {
          "category": "learn_cards",
          "format": "learn_cards",
          "title": "Your nervous system at night",
          "instruction": "Three short cards, then one quick recall.",
          "cards": [
            {
              "id": "on-mode",
              "kicker": "MODE 1",
              "title": "ON keeps you alert",
              "body": "Fight-or-flight helps the body respond to pressure. The heart can race and muscles can tense."
            },
            {
              "id": "off-mode",
              "kicker": "MODE 2",
              "title": "OFF helps you settle",
              "body": "Rest-and-digest supports a calmer body. This is the direction sleep needs."
            },
            {
              "id": "night-switch",
              "kicker": "THE NIGHT CLUE",
              "title": "Stress can keep the switch on",
              "body": "Work thoughts, caffeine, and bright screens can keep the body alert even when you feel tired."
            }
          ],
          "recall": {
            "prompt": "Which mode helps the body settle for sleep?",
            "correctOptionId": "off",
            "options": [
              {"id": "on", "label": "Fight-or-flight — ON"},
              {"id": "off", "label": "Rest-and-digest — OFF"}
            ]
          },
          "feedback_correct": "Right. Rest-and-digest supports the calmer state sleep needs.",
          "feedback_incorrect": "Fight-or-flight keeps the body ready for action. Rest-and-digest is the calmer direction.",
          "workedExample": "A racing heart and clenched jaw point to ON. Slower breathing can help the body move toward OFF."
        }
      },
      {
        "source_id": "u2_l10_sympathetic_choice",
        "node_source_id": "u2_1_breathing-n1",
        "order_index": 1,
        "type": "course_choice",
        "phase": "introduce",
        "duration_seconds": 25,
        "scaffold_level": 2,
        "difficulty": 0.15,
        "is_scored": true,
        "concept": "stress_response_basics",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Read the ON signal",
          "instruction": "Choose what the body is doing.",
          "prompt": "When fight-or-flight is active, what is most likely?",
          "options": [
            {
              "id": "alert",
              "label": "The heart speeds up, muscles tense, and the body stays alert",
              "isCorrect": true,
              "feedback": "Right. The body is preparing for action, not settling for sleep."
            },
            {
              "id": "relaxed",
              "label": "The body relaxes and prepares for sleep",
              "feedback": "That describes the calmer rest-and-digest direction, not fight-or-flight."
            },
            {
              "id": "nothing",
              "label": "Nothing changes in the body",
              "feedback": "Fight-or-flight changes heart rate, muscle tension, and alertness."
            }
          ],
          "feedbackTitle": "The body is on guard",
          "feedbackTakeaway": "You can recognize a body that is ready for action.",
          "workedExample": "A racing heart, tight muscles, and a wired feeling are useful clues that the body is still on guard.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l10_bedtime_scenario",
        "node_source_id": "u2_1_breathing-n1",
        "order_index": 2,
        "type": "course_choice",
        "phase": "challenge",
        "duration_seconds": 45,
        "scaffold_level": 3,
        "difficulty": 0.22,
        "is_scored": true,
        "concept": "stress_response_basics",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Name the bedtime mode",
          "instruction": "Follow the body clues.",
          "context": "It is 11pm. Work stress is replaying. Your heart is racing, your jaw is clenched, and you feel wired.",
          "prompt": "Which nervous-system direction fits best?",
          "options": [
            {
              "id": "on",
              "label": "Fight-or-flight — ON",
              "isCorrect": true,
              "feedback": "Exactly. The heart, jaw, and wired feeling all point to a body on guard."
            },
            {
              "id": "off",
              "label": "Rest-and-digest — OFF",
              "feedback": "A calmer heart and softer muscles would fit OFF more closely."
            },
            {
              "id": "both",
              "label": "There is no useful pattern here",
              "feedback": "The body clues form a clear pattern: alertness is still high."
            }
          ],
          "feedbackTitle": "Follow the body, not blame",
          "feedbackTakeaway": "You can spot the ON pattern from physical clues.",
          "workedExample": "The body is acting as if action is needed. A calming cue can send a different signal without forcing sleep.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l10_private_wired_check",
        "node_source_id": "u2_1_breathing-n1",
        "order_index": 3,
        "type": "private_check",
        "phase": "cooldown",
        "duration_seconds": 50,
        "scaffold_level": 1,
        "difficulty": 0.10,
        "is_scored": false,
        "concept": "stress_response_basics",
        "content": {
          "category": "private_check",
          "format": "private_check",
          "title": "When bedtime feels wired",
          "instruction": "Tick any clues you have noticed. Choose none if they do not fit.",
          "items": [
            "Work or tomorrow keeps replaying",
            "My heart feels faster",
            "My jaw or shoulders feel tight",
            "I feel tired and alert at the same time"
          ],
          "feedbackTitle": "Clues, not failures",
          "feedback": "These signals can show that the body is still on guard. The next lesson gives you one gentle way to respond."
        }
      },
      {
        "source_id": "u2_l10_clarity_check",
        "node_source_id": "u2_1_breathing-n1",
        "order_index": 4,
        "type": "intuition_check",
        "phase": "cooldown",
        "duration_seconds": 15,
        "scaffold_level": 1,
        "difficulty": 0.10,
        "is_scored": false,
        "concept": "stress_response_basics",
        "content": {
          "category": "intuition_check",
          "format": "intuition_check",
          "completionMode": "direct",
          "title": "Does the switch idea help?",
          "instruction": "Choose the closest answer. This is not scored.",
          "prompt": "Does ON and OFF make a wired night easier to understand?",
          "options": [
            {"id": "not-yet", "label": "Not yet"},
            {"id": "a-little", "label": "A little"},
            {"id": "somewhat", "label": "Somewhat"},
            {"id": "clear", "label": "Clear"},
            {"id": "very-clear", "label": "Very clear"}
          ],
          "bestOptionId": "very-clear",
          "revealTitle": "A useful first map",
          "reveal": "You can now name the alert direction and the calmer direction.",
          "alternateReveal": "Keep the simple map: racing and tense points toward ON; slower and softer points toward OFF.",
          "primaryLabel": "Continue",
          "waitingPrimaryLabel": "Choose above"
        }
      },
      {
        "source_id": "u2_l11_recall_off_mode",
        "node_source_id": "u2_1_breathing-n2",
        "order_index": 0,
        "type": "course_choice",
        "phase": "warmup",
        "duration_seconds": 20,
        "scaffold_level": 2,
        "difficulty": 0.15,
        "is_scored": true,
        "concept": "stress_response_basics",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Bring the switch back",
          "instruction": "Choose the calmer direction.",
          "prompt": "Which mode tells the body that it can stand down?",
          "options": [
            {
              "id": "off",
              "label": "Rest-and-digest — OFF",
              "isCorrect": true,
              "feedback": "Right. This is the calmer direction belly breathing supports."
            },
            {
              "id": "on",
              "label": "Fight-or-flight — ON",
              "feedback": "ON keeps the body ready for action."
            }
          ],
          "feedbackTitle": "The calmer direction",
          "workedExample": "Belly breathing is one way to give the body a slower, safer rhythm.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l11_belly_breath_cards",
        "node_source_id": "u2_1_breathing-n2",
        "order_index": 1,
        "type": "learn_cards",
        "phase": "introduce",
        "duration_seconds": 50,
        "scaffold_level": 1,
        "difficulty": 0.12,
        "is_scored": false,
        "concept": "belly_breathing",
        "content": {
          "category": "learn_cards",
          "format": "learn_cards",
          "title": "The belly breath",
          "instruction": "Learn the shape, reason, and rhythm.",
          "cards": [
            {
              "id": "shape",
              "kicker": "THE SHAPE",
              "title": "Let the belly expand",
              "body": "Breathe slowly so the belly moves more than the upper chest. Keep the breath comfortable, not forced."
            },
            {
              "id": "reason",
              "kicker": "THE SIGNAL",
              "title": "A slower rhythm can feel safer",
              "body": "Slow breathing can support the rest-and-digest direction and help the body settle."
            },
            {
              "id": "rhythm",
              "kicker": "THE RHYTHM",
              "title": "In for 4, out for 6",
              "body": "Let the exhale last a little longer than the inhale. Stop or return to normal breathing if you feel uncomfortable."
            }
          ],
          "recall": {
            "prompt": "Which rhythm matches this belly breath?",
            "correctOptionId": "four-six",
            "options": [
              {"id": "four-six", "label": "In for 4, out for 6"},
              {"id": "fast", "label": "Fast, shallow breaths"},
              {"id": "hold", "label": "Hold as long as possible"}
            ]
          },
          "feedback_correct": "Right. The exhale is slightly longer and the breath stays comfortable.",
          "feedback_incorrect": "Use a gentle rhythm: in for 4 and out for 6. Do not force or strain.",
          "workedExample": "Let the belly expand for four counts, then soften the breath out for six counts."
        }
      },
      {
        "source_id": "u2_l11_chest_breathing_check",
        "node_source_id": "u2_1_breathing-n2",
        "order_index": 2,
        "type": "course_choice",
        "phase": "challenge",
        "duration_seconds": 25,
        "scaffold_level": 2,
        "difficulty": 0.20,
        "is_scored": true,
        "concept": "belly_breathing",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Slow and deep is different",
          "instruction": "Choose true or false.",
          "prompt": "Fast, shallow chest breathing sends the same calming cue as slow belly breathing.",
          "options": [
            {
              "id": "false",
              "label": "False",
              "isCorrect": true,
              "feedback": "Right. Rhythm and depth change the body signal."
            },
            {
              "id": "true",
              "label": "True",
              "feedback": "Fast, shallow breathing is more closely linked with alertness."
            }
          ],
          "feedbackTitle": "The rhythm matters",
          "workedExample": "A comfortable belly breath is slower and uses a slightly longer exhale.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l11_guided_private_practice",
        "node_source_id": "u2_1_breathing-n2",
        "order_index": 3,
        "type": "private_check",
        "phase": "practice",
        "duration_seconds": 120,
        "scaffold_level": 3,
        "difficulty": 0.24,
        "is_scored": false,
        "concept": "belly_breathing",
        "content": {
          "category": "private_check",
          "format": "private_check",
          "title": "Try five gentle breaths",
          "instruction": "In for 4, out for 6. Then tick anything you noticed.",
          "items": [
            "My belly moved more than my chest",
            "The longer exhale felt comfortable",
            "My body felt a little softer",
            "I preferred returning to normal breathing"
          ],
          "feedbackTitle": "Your response is information",
          "feedback": "A subtle shift counts. No shift also counts as useful information. Keep the breath comfortable and never force it."
        }
      },
      {
        "source_id": "u2_l11_belly_breath_use_case",
        "node_source_id": "u2_1_breathing-n2",
        "order_index": 4,
        "type": "course_choice",
        "phase": "consolidate",
        "duration_seconds": 25,
        "scaffold_level": 2,
        "difficulty": 0.18,
        "is_scored": true,
        "concept": "belly_breathing",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Where can you use it?",
          "instruction": "Choose the broadest useful answer.",
          "prompt": "When can belly breathing be useful?",
          "options": [
            {
              "id": "anytime",
              "label": "Any time I want a gentle calming cue",
              "isCorrect": true,
              "feedback": "Exactly. It can be used at a desk, in traffic, or while settling at night."
            },
            {
              "id": "bedtime",
              "label": "Only at bedtime",
              "feedback": "Bedtime is one use, but the technique is not limited to sleep."
            },
            {
              "id": "panic",
              "label": "Only during intense panic",
              "feedback": "It can also be used for ordinary stress or a mildly alert body."
            }
          ],
          "feedbackTitle": "A general-purpose tool",
          "feedbackTakeaway": "You can use one gentle breath pattern in several settings.",
          "workedExample": "Use it when the body feels on guard. Keep it comfortable and stop if it feels worse.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l11_belly_breath_summary",
        "node_source_id": "u2_1_breathing-n2",
        "order_index": 5,
        "type": "one_line_reveal",
        "phase": "cooldown",
        "duration_seconds": 30,
        "scaffold_level": 1,
        "difficulty": 0.10,
        "is_scored": false,
        "concept": "belly_breathing",
        "content": {
          "category": "one_line_reveal",
          "format": "one_line_reveal",
          "completionMode": "direct",
          "title": "Keep one rhythm",
          "instruction": "Tap to complete the idea.",
          "firstLine": "Breathe in gently for 4.",
          "secondLine": "Let the breath out for 6.",
          "completionNote": "One idea, one tap. That’s the whole exercise.",
          "whyTitle": "Why it matters",
          "why": "The slightly longer exhale gives you a simple, general-purpose calming cue. Next comes Box Breathing for sharper daytime stress."
        }
      },
      {
        "source_id": "u2_l12_box_recall",
        "node_source_id": "u2_1_breathing-n3",
        "order_index": 0,
        "type": "course_choice",
        "phase": "warmup",
        "duration_seconds": 20,
        "scaffold_level": 2,
        "difficulty": 0.18,
        "is_scored": true,
        "concept": "belly_breathing",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Recall the belly breath",
          "instruction": "Choose the rhythm you learned.",
          "prompt": "Which pattern is the general-purpose belly breath?",
          "options": [
            {"id": "four-six", "label": "In for 4, out for 6", "isCorrect": true, "feedback": "Right. A slightly longer exhale is the belly-breath pattern."},
            {"id": "four-box", "label": "In 4, hold 4, out 4, hold 4", "feedback": "That is Box Breathing, the new tool in this lesson."}
          ],
          "feedbackTitle": "One rhythm remembered",
          "workedExample": "Belly breathing is gentle and flexible: in for 4, out for 6.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l12_box_cards",
        "node_source_id": "u2_1_breathing-n3",
        "order_index": 1,
        "type": "learn_cards",
        "phase": "introduce",
        "duration_seconds": 55,
        "scaffold_level": 1,
        "difficulty": 0.20,
        "is_scored": false,
        "concept": "box_breathing",
        "content": {
          "category": "learn_cards",
          "format": "learn_cards",
          "title": "Four equal sides",
          "instruction": "Learn the shape and its best use.",
          "cards": [
            {"id": "shape", "kicker": "THE SHAPE", "title": "4 · 4 · 4 · 4", "body": "Breathe in for 4, hold for 4, breathe out for 4, then hold for 4."},
            {"id": "purpose", "kicker": "THE PURPOSE", "title": "Steady during a stress spike", "body": "The equal count gives your attention a clear job and can help the body feel controlled rather than rushed."},
            {"id": "use", "kicker": "BEST FIT", "title": "Acute daytime stress", "body": "Try it before a difficult call or when stress suddenly rises. At bedtime, choose a gentler pattern if holds feel activating."}
          ],
          "recall": {
            "prompt": "What makes Box Breathing a box?",
            "correctOptionId": "equal",
            "options": [
              {"id": "equal", "label": "Four equal phases"},
              {"id": "long-out", "label": "Only a long exhale"}
            ]
          },
          "feedback_correct": "Right. Each side lasts four counts.",
          "feedback_incorrect": "A box has four equal sides: inhale, hold, exhale, hold.",
          "workedExample": "In 1-2-3-4, hold 1-2-3-4, out 1-2-3-4, hold 1-2-3-4."
        }
      },
      {
        "source_id": "u2_l12_box_practice",
        "node_source_id": "u2_1_breathing-n3",
        "order_index": 2,
        "type": "private_check",
        "phase": "practice",
        "duration_seconds": 90,
        "scaffold_level": 3,
        "difficulty": 0.28,
        "is_scored": false,
        "concept": "box_breathing",
        "content": {
          "category": "private_check",
          "format": "private_check",
          "title": "Try four boxes",
          "instruction": "Use 4-4-4-4. Keep each hold comfortable.",
          "items": [
            "The equal count held my attention",
            "My breathing felt steadier",
            "The holds felt comfortable",
            "I preferred normal breathing"
          ],
          "feedbackTitle": "Comfort comes first",
          "feedback": "Box Breathing is one option for a short stress reset. Shorten the count or stop if holding your breath feels uncomfortable."
        }
      },
      {
        "source_id": "u2_l12_box_use_case",
        "node_source_id": "u2_1_breathing-n3",
        "order_index": 3,
        "type": "course_choice",
        "phase": "consolidate",
        "duration_seconds": 30,
        "scaffold_level": 3,
        "difficulty": 0.30,
        "is_scored": true,
        "concept": "box_breathing",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Choose the sharp reset",
          "instruction": "Match the tool to the moment.",
          "context": "It is 3pm. A difficult call starts in two minutes. Your heart is racing and you need to feel steady and alert.",
          "prompt": "Which breathing tool fits best?",
          "options": [
            {"id": "box", "label": "Box Breathing for four rounds", "isCorrect": true, "feedback": "Yes. Its equal phases fit a short daytime stress reset."},
            {"id": "sleep", "label": "Use a bedtime-only routine", "feedback": "This moment needs a brief daytime tool, not a sleep routine."},
            {"id": "force", "label": "Hold each breath as long as possible", "feedback": "Long forced holds can increase discomfort. Keep the count steady and comfortable."}
          ],
          "feedbackTitle": "Box fits the moment",
          "feedbackTakeaway": "Use Box Breathing for a brief, acute daytime stress spike.",
          "workedExample": "Before a tense meeting: four comfortable rounds of 4-4-4-4, then return to normal breathing.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l13_box_recall",
        "node_source_id": "u2_1_breathing-n4",
        "order_index": 0,
        "type": "course_choice",
        "phase": "warmup",
        "duration_seconds": 20,
        "scaffold_level": 2,
        "difficulty": 0.22,
        "is_scored": true,
        "concept": "box_breathing",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Name the box",
          "instruction": "Choose its defining feature.",
          "prompt": "What makes Box Breathing different?",
          "options": [
            {"id": "equal", "label": "Four equal phases", "isCorrect": true, "feedback": "Right. Inhale, hold, exhale, and hold use the same count."},
            {"id": "long-exhale", "label": "An exhale twice as long as the inhale", "feedback": "A long exhale belongs to the sleep-focused pattern coming next."}
          ],
          "feedbackTitle": "Four equal sides",
          "workedExample": "4 in, 4 hold, 4 out, 4 hold.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l13_sleep_breath_cards",
        "node_source_id": "u2_1_breathing-n4",
        "order_index": 1,
        "type": "learn_cards",
        "phase": "introduce",
        "duration_seconds": 55,
        "scaffold_level": 1,
        "difficulty": 0.24,
        "is_scored": false,
        "concept": "breathing_478",
        "content": {
          "category": "learn_cards",
          "format": "learn_cards",
          "title": "The 4-7-8 sleep breath",
          "instruction": "Learn the rhythm without forcing it.",
          "cards": [
            {"id": "rhythm", "kicker": "THE RHYTHM", "title": "In 4 · hold 7 · out 8", "body": "Breathe in through the nose, pause comfortably, then let the breath out slowly through the mouth."},
            {"id": "key", "kicker": "THE KEY", "title": "The exhale is longest", "body": "A longer exhale can support the calmer rest-and-digest direction while you settle for sleep."},
            {"id": "fit", "kicker": "BEST FIT", "title": "Sleep onset", "body": "Try four rounds when you are in bed with a racing mind. Shorten the count or breathe normally if the hold feels uncomfortable."}
          ],
          "recall": {
            "prompt": "Which part lasts longest?",
            "correctOptionId": "exhale",
            "options": [
              {"id": "inhale", "label": "The inhale"},
              {"id": "exhale", "label": "The exhale"},
              {"id": "same", "label": "All parts are equal"}
            ]
          },
          "feedback_correct": "Right. The eight-count exhale is the longest part.",
          "feedback_incorrect": "In 4, hold 7, out 8. The exhale lasts longest.",
          "workedExample": "Use a gentle pace: in 1-2-3-4, pause to 7, then slowly out to 8."
        }
      },
      {
        "source_id": "u2_l13_sleep_breath_practice",
        "node_source_id": "u2_1_breathing-n4",
        "order_index": 2,
        "type": "private_check",
        "phase": "practice",
        "duration_seconds": 120,
        "scaffold_level": 3,
        "difficulty": 0.32,
        "is_scored": false,
        "concept": "breathing_478",
        "content": {
          "category": "private_check",
          "format": "private_check",
          "title": "Try four sleep breaths",
          "instruction": "Use 4-7-8, or shorten every count if needed.",
          "items": [
            "The long exhale felt settling",
            "My thoughts slowed a little",
            "A shorter count fit me better",
            "I preferred normal breathing"
          ],
          "feedbackTitle": "Fit matters more than perfect counting",
          "feedback": "This helps some people and not others. Your response is not a test. Keep only the version that feels safe and comfortable."
        }
      },
      {
        "source_id": "u2_l13_sleep_breath_use_case",
        "node_source_id": "u2_1_breathing-n4",
        "order_index": 3,
        "type": "course_choice",
        "phase": "consolidate",
        "duration_seconds": 30,
        "scaffold_level": 3,
        "difficulty": 0.34,
        "is_scored": true,
        "concept": "breathing_478",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Choose the sleep breath",
          "instruction": "Match the pattern to the moment.",
          "context": "You are already in bed. Your body is safe, but tomorrow keeps running through your mind.",
          "prompt": "Which tool is designed for this moment?",
          "options": [
            {"id": "four-seven-eight", "label": "Four comfortable rounds of 4-7-8", "isCorrect": true, "feedback": "Yes. The long exhale makes this the sleep-onset tool."},
            {"id": "box", "label": "A sharp daytime Box Breathing reset", "feedback": "Box Breathing fits acute daytime stress more closely."},
            {"id": "force", "label": "Keep repeating until sleep happens", "feedback": "Breathing is a calming cue, not a way to force sleep. Stop when the rounds are complete."}
          ],
          "feedbackTitle": "A bedtime fit",
          "feedbackTakeaway": "4-7-8 is an option for settling at sleep onset.",
          "workedExample": "Do four rounds, notice the effect, then let sleep arrive on its own.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l14_three_tools_cards",
        "node_source_id": "u2_1_breathing-n5",
        "order_index": 0,
        "type": "learn_cards",
        "phase": "warmup",
        "duration_seconds": 50,
        "scaffold_level": 1,
        "difficulty": 0.26,
        "is_scored": false,
        "concept": "breathing_comparison",
        "content": {
          "category": "learn_cards",
          "format": "learn_cards",
          "title": "Three tools, three jobs",
          "instruction": "Keep one clear use for each.",
          "cards": [
            {"id": "belly", "kicker": "BELLY · 4-6", "title": "Gentle, general calm", "body": "Use it during ordinary stress, at your desk, in traffic, or while settling."},
            {"id": "box", "kicker": "BOX · 4-4-4-4", "title": "Acute daytime reset", "body": "Use it when stress spikes and you want a short, structured focus."},
            {"id": "sleep", "kicker": "4-7-8", "title": "Sleep onset", "body": "Use the longer exhale in bed when your mind is still active."}
          ],
          "recall": {
            "prompt": "Which tool is the general-purpose option?",
            "correctOptionId": "belly",
            "options": [
              {"id": "belly", "label": "Belly breathing"},
              {"id": "box", "label": "Box Breathing"},
              {"id": "sleep", "label": "4-7-8"}
            ]
          },
          "feedback_correct": "Right. Belly breathing is the flexible, anytime tool.",
          "feedback_incorrect": "Keep the simple map: belly anytime, box for a daytime spike, 4-7-8 for sleep onset.",
          "workedExample": "Ordinary tension at lunch: belly. Pre-meeting spike: box. Racing mind in bed: 4-7-8."
        }
      },
      {
        "source_id": "u2_l14_daytime_match",
        "node_source_id": "u2_1_breathing-n5",
        "order_index": 1,
        "type": "course_choice",
        "phase": "challenge",
        "duration_seconds": 30,
        "scaffold_level": 3,
        "difficulty": 0.38,
        "is_scored": true,
        "concept": "breathing_comparison",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "A stress spike at work",
          "instruction": "Choose the closest fit.",
          "context": "Your manager asks for an unexpected presentation. Your heart jumps and you have one minute before you begin.",
          "prompt": "Which breathing tool fits best?",
          "options": [
            {"id": "box", "label": "Box Breathing", "isCorrect": true, "feedback": "Right. A short structured reset fits an acute daytime spike."},
            {"id": "belly", "label": "Belly breathing is the only correct tool", "feedback": "Belly breathing may help, but Box Breathing is the closer match for a sharp daytime spike."},
            {"id": "sleep", "label": "4-7-8 until you feel sleepy", "feedback": "4-7-8 is framed for sleep onset, not becoming sleepy before a presentation."}
          ],
          "feedbackTitle": "Match the job",
          "workedExample": "One minute before a demanding task: four equal phases can give attention a steady structure.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l14_bedtime_match",
        "node_source_id": "u2_1_breathing-n5",
        "order_index": 2,
        "type": "course_choice",
        "phase": "challenge",
        "duration_seconds": 30,
        "scaffold_level": 3,
        "difficulty": 0.40,
        "is_scored": true,
        "concept": "breathing_comparison",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "A busy mind in bed",
          "instruction": "Choose the closest fit.",
          "context": "It is bedtime. Your body is not very tense, but your thoughts are still moving quickly.",
          "prompt": "Which tool is designed for sleep onset?",
          "options": [
            {"id": "sleep", "label": "4-7-8 breathing", "isCorrect": true, "feedback": "Right. Its longer exhale is the sleep-onset pattern."},
            {"id": "box", "label": "Box Breathing", "feedback": "Box Breathing is the sharper daytime reset."},
            {"id": "none", "label": "No breathing tool can be used", "feedback": "A breathing tool can be tried gently, without demanding that it make sleep happen."}
          ],
          "feedbackTitle": "Use the sleep-onset tool",
          "workedExample": "Four comfortable rounds of 4-7-8, then stop counting and let the body settle.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l14_personal_breath_choice",
        "node_source_id": "u2_1_breathing-n5",
        "order_index": 3,
        "type": "intuition_check",
        "phase": "cooldown",
        "duration_seconds": 30,
        "scaffold_level": 1,
        "difficulty": 0.18,
        "is_scored": false,
        "concept": "breathing_comparison",
        "content": {
          "category": "intuition_check",
          "format": "intuition_check",
          "completionMode": "direct",
          "title": "Which feels most natural?",
          "instruction": "Choose your starting tool. This is not scored.",
          "prompt": "Which breathing pattern would you try first?",
          "options": [
            {"id": "belly", "label": "Belly breathing · 4-6"},
            {"id": "box", "label": "Box Breathing · 4-4-4-4"},
            {"id": "sleep", "label": "Sleep breath · 4-7-8"},
            {"id": "normal", "label": "Normal breathing for now"}
          ],
          "bestOptionId": "belly",
          "revealTitle": "Your fit matters",
          "reveal": "Start with the pattern that feels easiest to repeat. A useful tool does not need to feel dramatic.",
          "alternateReveal": "There is no required favorite. You can choose a different tool for a different moment.",
          "primaryLabel": "Continue",
          "waitingPrimaryLabel": "Choose above"
        }
      },
      {
        "source_id": "u2_l15_body_scan_cards",
        "node_source_id": "u2_2_body_relaxation-n1",
        "order_index": 0,
        "type": "learn_cards",
        "phase": "introduce",
        "duration_seconds": 55,
        "scaffold_level": 1,
        "difficulty": 0.30,
        "is_scored": false,
        "concept": "body_scan",
        "content": {
          "category": "learn_cards",
          "format": "learn_cards",
          "title": "A body scan notices",
          "instruction": "Learn what the practice does and does not ask.",
          "cards": [
            {"id": "what", "kicker": "WHAT", "title": "Move attention slowly", "body": "Notice the jaw, shoulders, arms, chest, belly, legs, and feet one area at a time."},
            {"id": "how", "kicker": "HOW", "title": "Name what is already there", "body": "Tight, loose, warm, cool, heavy, light, or hard to notice are all valid observations."},
            {"id": "not", "kicker": "IMPORTANT", "title": "Do not force relaxation", "body": "The task is awareness only. Notice for a few breaths, then move on without fixing the sensation."}
          ],
          "recall": {
            "prompt": "What is the main job of a body scan?",
            "correctOptionId": "notice",
            "options": [
              {"id": "notice", "label": "Notice sensations without changing them"},
              {"id": "force", "label": "Make every muscle relax"}
            ]
          },
          "feedback_correct": "Right. A body scan trains awareness, not forced relaxation.",
          "feedback_incorrect": "The task is to notice. Relaxation may happen, but it is not a requirement.",
          "workedExample": "Jaw: tight. Shoulders: warm. Hands: hard to notice. Name each, then move on."
        }
      },
      {
        "source_id": "u2_l15_scan_misconception",
        "node_source_id": "u2_2_body_relaxation-n1",
        "order_index": 1,
        "type": "course_choice",
        "phase": "challenge",
        "duration_seconds": 30,
        "scaffold_level": 3,
        "difficulty": 0.36,
        "is_scored": true,
        "concept": "body_scan",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Notice without fixing",
          "instruction": "Choose the body-scan response.",
          "context": "During a body scan, you notice that your shoulders are tight.",
          "prompt": "What do you do next?",
          "options": [
            {"id": "notice", "label": "Notice the tightness for a few breaths, then move on", "isCorrect": true, "feedback": "Exactly. Awareness is the whole practice."},
            {"id": "force", "label": "Push the shoulders down until they relax", "feedback": "That turns noticing into effort. The scan does not require changing the sensation."},
            {"id": "fail", "label": "Stop because tightness means the scan failed", "feedback": "Finding tightness means you noticed accurately. That is success in a body scan."}
          ],
          "feedbackTitle": "Awareness is enough",
          "feedbackTakeaway": "A tense area is information, not a failed scan.",
          "workedExample": "Say quietly, “shoulders feel tight,” stay for three breaths, then move to the arms.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l15_guided_scan",
        "node_source_id": "u2_2_body_relaxation-n1",
        "order_index": 2,
        "type": "private_check",
        "phase": "practice",
        "duration_seconds": 180,
        "scaffold_level": 3,
        "difficulty": 0.38,
        "is_scored": false,
        "concept": "body_scan",
        "content": {
          "category": "private_check",
          "format": "private_check",
          "title": "Scan from head to feet",
          "instruction": "Notice each area for three breaths. Do not change it.",
          "items": [
            "Jaw and face noticed",
            "Shoulders, arms, and hands noticed",
            "Chest and belly noticed",
            "Legs and feet noticed"
          ],
          "feedbackTitle": "You practised attention",
          "feedback": "The goal was noticing, even if nothing relaxed. You can use this scan when thoughts are loud or when you are unsure where tension sits."
        }
      },
      {
        "source_id": "u2_l15_scan_summary",
        "node_source_id": "u2_2_body_relaxation-n1",
        "order_index": 3,
        "type": "one_line_reveal",
        "phase": "cooldown",
        "duration_seconds": 25,
        "scaffold_level": 1,
        "difficulty": 0.20,
        "is_scored": false,
        "concept": "body_scan",
        "content": {
          "category": "one_line_reveal",
          "format": "one_line_reveal",
          "completionMode": "direct",
          "title": "Keep the difference clear",
          "instruction": "Tap to complete the idea.",
          "firstLine": "A body scan notices tension.",
          "secondLine": "The next tool actively releases it.",
          "why": "Body scan is awareness. Progressive Muscle Relaxation adds deliberate tension and release."
        }
      },
      {
        "source_id": "u2_l16_scan_recall",
        "node_source_id": "u2_2_body_relaxation-n2",
        "order_index": 0,
        "type": "course_choice",
        "phase": "warmup",
        "duration_seconds": 20,
        "scaffold_level": 2,
        "difficulty": 0.30,
        "is_scored": true,
        "concept": "body_scan",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Recall awareness",
          "instruction": "Choose the body-scan job.",
          "prompt": "During a body scan, what are you practising?",
          "options": [
            {"id": "notice", "label": "Noticing without forcing change", "isCorrect": true, "feedback": "Right. Body scan is awareness."},
            {"id": "tense", "label": "Tensing every muscle as hard as possible", "feedback": "Tension and release belongs to PMR, and it should never be forced."}
          ],
          "feedbackTitle": "Awareness comes first",
          "workedExample": "Notice “jaw tight” and move on. No fixing required.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l16_pmr_cards",
        "node_source_id": "u2_2_body_relaxation-n2",
        "order_index": 1,
        "type": "learn_cards",
        "phase": "introduce",
        "duration_seconds": 60,
        "scaffold_level": 1,
        "difficulty": 0.34,
        "is_scored": false,
        "concept": "progressive_muscle_relaxation",
        "content": {
          "category": "learn_cards",
          "format": "learn_cards",
          "title": "Tense, release, notice",
          "instruction": "Learn the three-part PMR cycle.",
          "cards": [
            {"id": "tense", "kicker": "1 · TENSE", "title": "Use gentle effort for 5 seconds", "body": "Choose one muscle group. Create clear but comfortable tension. Never tense an injured or painful area."},
            {"id": "release", "kicker": "2 · RELEASE", "title": "Let go fully", "body": "Stop the effort instead of lowering it slowly. Feel the immediate contrast."},
            {"id": "notice", "kicker": "3 · NOTICE", "title": "Rest for about 30 seconds", "body": "Notice warmth, heaviness, softness, or no change before moving to the next group."}
          ],
          "recall": {
            "prompt": "What teaches the body the difference?",
            "correctOptionId": "contrast",
            "options": [
              {"id": "contrast", "label": "The contrast between tension and release"},
              {"id": "force", "label": "Keeping muscles tense for as long as possible"}
            ]
          },
          "feedback_correct": "Right. PMR makes the contrast easier to feel.",
          "feedback_incorrect": "PMR uses brief, comfortable tension followed by a full release.",
          "workedExample": "Clench both fists gently for 5 seconds, release, then notice for 30 seconds."
        }
      },
      {
        "source_id": "u2_l16_pmr_practice",
        "node_source_id": "u2_2_body_relaxation-n2",
        "order_index": 2,
        "type": "private_check",
        "phase": "practice",
        "duration_seconds": 360,
        "scaffold_level": 3,
        "difficulty": 0.42,
        "is_scored": false,
        "concept": "progressive_muscle_relaxation",
        "content": {
          "category": "private_check",
          "format": "private_check",
          "title": "Try a short PMR sequence",
          "instruction": "For each safe area: tense 5 seconds, release, then notice.",
          "items": [
            "Hands and forearms",
            "Shoulders",
            "Face and jaw",
            "Legs and feet"
          ],
          "feedbackTitle": "Contrast is the lesson",
          "feedback": "Notice what changed after release. Skip any painful or injured area, and stop if tension creates discomfort."
        }
      },
      {
        "source_id": "u2_l16_pmr_check",
        "node_source_id": "u2_2_body_relaxation-n2",
        "order_index": 3,
        "type": "course_choice",
        "phase": "consolidate",
        "duration_seconds": 30,
        "scaffold_level": 3,
        "difficulty": 0.42,
        "is_scored": true,
        "concept": "progressive_muscle_relaxation",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Keep PMR active",
          "instruction": "Choose true or false.",
          "prompt": "PMR and a body scan are the same because both involve noticing the body.",
          "options": [
            {"id": "false", "label": "False", "isCorrect": true, "feedback": "Right. PMR adds deliberate tension and release; body scan only notices."},
            {"id": "true", "label": "True", "feedback": "Both use attention, but PMR includes an action cycle that body scan does not."}
          ],
          "feedbackTitle": "Awareness versus action",
          "feedbackTakeaway": "Body scan notices. PMR tenses, releases, and notices the contrast.",
          "workedExample": "Tight shoulders: a scan names the tightness. PMR gently lifts, holds, and releases them.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l17_difference_recall",
        "node_source_id": "u2_2_body_relaxation-n3",
        "order_index": 0,
        "type": "course_choice",
        "phase": "warmup",
        "duration_seconds": 25,
        "scaffold_level": 2,
        "difficulty": 0.36,
        "is_scored": true,
        "concept": "body_relaxation_choice",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Name the active tool",
          "instruction": "Choose the technique with an action cycle.",
          "prompt": "Which technique deliberately tenses and releases muscles?",
          "options": [
            {"id": "pmr", "label": "Progressive Muscle Relaxation", "isCorrect": true, "feedback": "Right. PMR uses tension, release, and contrast."},
            {"id": "scan", "label": "Body scan", "feedback": "A body scan notices sensations without trying to change them."}
          ],
          "feedbackTitle": "PMR is active",
          "workedExample": "Hands tight? PMR can clench and release them. A scan would simply notice the tightness.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l17_racing_mind_case",
        "node_source_id": "u2_2_body_relaxation-n3",
        "order_index": 1,
        "type": "course_choice",
        "phase": "challenge",
        "duration_seconds": 35,
        "scaffold_level": 3,
        "difficulty": 0.46,
        "is_scored": true,
        "concept": "body_relaxation_choice",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Busy mind, little tension",
          "instruction": "Choose the closest starting tool.",
          "context": "At 11pm, your thoughts are racing, but your muscles do not feel especially tight.",
          "prompt": "Where would you start?",
          "options": [
            {"id": "scan", "label": "Body scan", "isCorrect": true, "feedback": "Yes. Moving attention through the body can interrupt the thought loop without adding effort."},
            {"id": "pmr", "label": "PMR is always required", "feedback": "PMR may still help, but without clear muscle tension, a body scan is the simpler starting point."},
            {"id": "force", "label": "Try harder to make sleep happen", "feedback": "More sleep effort can add pressure. Choose a calm practice, then let sleep happen on its own."}
          ],
          "feedbackTitle": "Start with awareness",
          "workedExample": "Follow jaw, shoulders, hands, belly, legs, and feet. Notice each without fixing it.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l17_tense_body_case",
        "node_source_id": "u2_2_body_relaxation-n3",
        "order_index": 2,
        "type": "course_choice",
        "phase": "challenge",
        "duration_seconds": 35,
        "scaffold_level": 3,
        "difficulty": 0.48,
        "is_scored": true,
        "concept": "body_relaxation_choice",
        "content": {
          "category": "course_choice",
          "format": "course_choice",
          "title": "Tight jaw and shoulders",
          "instruction": "Choose the closest starting tool.",
          "context": "You wake at 3am feeling anxious. Your jaw and shoulders are clearly tight.",
          "prompt": "Which technique fits the tension pattern?",
          "options": [
            {"id": "pmr", "label": "Gentle PMR", "isCorrect": true, "feedback": "Right. The tension-release contrast directly fits clear muscle tightness."},
            {"id": "scan", "label": "A body scan can only be used when tense", "feedback": "A scan could identify tension, but PMR is the more direct action when tight muscles are already clear."},
            {"id": "ignore", "label": "Ignore the body and force sleep", "feedback": "Forcing sleep adds effort. A brief body tool can address the tension without demanding sleep."}
          ],
          "feedbackTitle": "Use action for clear tension",
          "workedExample": "Gently tense the shoulders for 5 seconds, release, and notice the contrast before moving on.",
          "primaryLabel": "Check answer"
        }
      },
      {
        "source_id": "u2_l17_personal_body_choice",
        "node_source_id": "u2_2_body_relaxation-n3",
        "order_index": 3,
        "type": "intuition_check",
        "phase": "cooldown",
        "duration_seconds": 30,
        "scaffold_level": 1,
        "difficulty": 0.22,
        "is_scored": false,
        "concept": "body_relaxation_choice",
        "content": {
          "category": "intuition_check",
          "format": "intuition_check",
          "completionMode": "direct",
          "title": "Choose your body tool",
          "instruction": "Pick what feels easier to repeat. This is not scored.",
          "prompt": "Which starting point feels more natural?",
          "options": [
            {"id": "scan", "label": "Notice sensations · body scan"},
            {"id": "pmr", "label": "Actively release · PMR"},
            {"id": "depends", "label": "It depends on the night"},
            {"id": "neither", "label": "Neither for now"}
          ],
          "bestOptionId": "depends",
          "revealTitle": "Use the clue in front of you",
          "reveal": "Start with a scan when you are unsure. If you find clear tightness, switch to PMR.",
          "alternateReveal": "Preference supports consistency. You can begin with either safe, comfortable practice.",
          "primaryLabel": "Continue",
          "waitingPrimaryLabel": "Choose above"
        }
      },
      {
        "source_id": "u2_l18_full_body_scan",
        "node_source_id": "u2_2_body_relaxation-n4",
        "order_index": 0,
        "type": "private_check",
        "phase": "review",
        "duration_seconds": 300,
        "scaffold_level": 2,
        "difficulty": 0.30,
        "is_scored": false,
        "concept": "body_scan",
        "content": {
          "category": "private_check",
          "format": "private_check",
          "title": "Five-minute body scan",
          "instruction": "Notice each area without trying to relax it.",
          "items": [
            "Face and jaw",
            "Shoulders, arms, and hands",
            "Chest and belly",
            "Hips, legs, and feet"
          ],
          "feedbackTitle": "Awareness completed",
          "feedback": "You practised noticing without forcing a result. What you felt stays private and is never scored."
        }
      },
      {
        "source_id": "u2_l18_full_pmr",
        "node_source_id": "u2_2_body_relaxation-n4",
        "order_index": 1,
        "type": "private_check",
        "phase": "review",
        "duration_seconds": 600,
        "scaffold_level": 2,
        "difficulty": 0.32,
        "is_scored": false,
        "concept": "progressive_muscle_relaxation",
        "content": {
          "category": "private_check",
          "format": "private_check",
          "title": "Full PMR practice",
          "instruction": "For each safe area: tense 5 seconds, release, then rest and notice.",
          "items": [
            "Hands and arms",
            "Shoulders and face",
            "Belly and back",
            "Legs and feet"
          ],
          "feedbackTitle": "Action completed",
          "feedback": "You practised the tension-release contrast. Skip painful or injured areas. A shorter sequence is still a valid tool."
        }
      },
      {
        "source_id": "u2_l18_body_calm_checkpoint",
        "node_source_id": "u2_2_body_relaxation-n4",
        "order_index": 2,
        "type": "course_checkpoint",
        "phase": "checkpoint",
        "duration_seconds": 180,
        "scaffold_level": 3,
        "difficulty": 0.40,
        "is_scored": true,
        "concept": "body_relaxation_choice",
        "content": {
          "category": "course_checkpoint",
          "format": "course_checkpoint",
          "completionMode": "direct",
          "title": "Body Calm checkpoint",
          "instruction": "Use the right tool in five changed moments.",
          "introTitle": "Choose by purpose, not pressure",
          "intro": "Review the three breathing tools and the difference between awareness and action.",
          "items": [
            {
              "concept": "Belly breathing",
              "context": "You feel ordinary tension while waiting in a long queue.",
              "prompt": "Which breathing tool is the flexible, general-purpose choice?",
              "clue": "Look for the anytime tool.",
              "worked": "Belly breathing uses a gentle 4-in, 6-out rhythm and can be used in many settings.",
              "options": [
                {"label": "Belly breathing", "isCorrect": true, "feedback": "Right. It is the general-purpose calming cue."},
                {"label": "4-7-8 only", "feedback": "4-7-8 is framed for settling at sleep onset."}
              ]
            },
            {
              "concept": "Box Breathing",
              "context": "A difficult daytime conversation starts in one minute and your heart is racing.",
              "prompt": "Which tool best fits the acute stress spike?",
              "clue": "Which pattern gives four equal phases and a short structure?",
              "worked": "Box Breathing uses 4-4-4-4 for a brief, controlled daytime reset.",
              "options": [
                {"label": "Box Breathing", "isCorrect": true, "feedback": "Right. The equal count fits a brief daytime reset."},
                {"label": "Force a long breath hold", "feedback": "Forced holds can increase discomfort. Box counts stay equal and comfortable."}
              ]
            },
            {
              "concept": "4-7-8 breathing",
              "context": "You are in bed and tomorrow's tasks keep moving through your mind.",
              "prompt": "Which breathing pattern was designed for sleep onset?",
              "clue": "Find the pattern with the longest exhale.",
              "worked": "4-7-8 ends with an eight-count exhale and is used for settling at bedtime.",
              "options": [
                {"label": "4-7-8 breathing", "isCorrect": true, "feedback": "Right. Its long exhale makes it the sleep-onset option."},
                {"label": "Box Breathing until sleep is forced", "feedback": "Box is the daytime reset, and no breathing pattern should be used to force sleep."}
              ]
            },
            {
              "concept": "Body scan",
              "context": "Your mind is busy, but you are not sure whether your body is tense.",
              "prompt": "Which technique is the simplest starting point?",
              "clue": "Start with awareness when the body pattern is unclear.",
              "worked": "A body scan notices each area without trying to change it. If clear tension appears, you can switch tools.",
              "options": [
                {"label": "Body scan", "isCorrect": true, "feedback": "Right. Awareness helps you read the body before choosing an action."},
                {"label": "Tense every muscle immediately", "feedback": "When tension is unclear, begin by noticing rather than adding effort."}
              ]
            },
            {
              "concept": "Progressive Muscle Relaxation",
              "context": "Your shoulders and hands are clearly tight after waking at 3am.",
              "prompt": "Which technique directly uses tension and release?",
              "clue": "Choose the active body tool.",
              "worked": "PMR gently tenses one safe muscle group, releases it, and notices the contrast.",
              "options": [
                {"label": "Progressive Muscle Relaxation", "isCorrect": true, "feedback": "Right. PMR directly practises release when muscles feel tight."},
                {"label": "Body scan, because it actively releases muscles", "feedback": "A body scan notices. PMR is the technique that adds tension and release."}
              ]
            }
          ],
          "revisitMessage": "Revisit the marked tool, then use the simple map: belly anytime, box for a daytime spike, 4-7-8 for sleep onset, scan to notice, PMR to release.",
          "solidMessage": "You can match breathing and body tools to their purpose without forcing a result."
        }
      },
      {
        "source_id": "u2_l18_favorite_tool",
        "node_source_id": "u2_2_body_relaxation-n4",
        "order_index": 3,
        "type": "intuition_check",
        "phase": "reflection",
        "duration_seconds": 35,
        "scaffold_level": 1,
        "difficulty": 0.20,
        "is_scored": false,
        "concept": "body_relaxation_choice",
        "content": {
          "category": "intuition_check",
          "format": "intuition_check",
          "completionMode": "direct",
          "title": "Your first body-calm tool",
          "instruction": "Choose what you would actually use. This is not scored.",
          "prompt": "Which practice felt most natural?",
          "options": [
            {"id": "scan", "label": "Body scan"},
            {"id": "pmr", "label": "Progressive Muscle Relaxation"},
            {"id": "both", "label": "Both, for different nights"},
            {"id": "neither", "label": "Neither yet"}
          ],
          "bestOptionId": "both",
          "revealTitle": "A personal toolkit",
          "reveal": "Use awareness when the body pattern is unclear and active release when muscles are tight.",
          "alternateReveal": "No technique must work for everyone. Keep what feels safe and useful; leave the rest.",
          "primaryLabel": "Continue",
          "waitingPrimaryLabel": "Choose above"
        }
      },
      {
        "source_id": "u2_l18_body_calm_milestone",
        "node_source_id": "u2_2_body_relaxation-n4",
        "order_index": 4,
        "type": "section_milestone",
        "phase": "completion",
        "duration_seconds": 30,
        "scaffold_level": 1,
        "difficulty": 0.10,
        "is_scored": false,
        "concept": "body_relaxation_choice",
        "content": {
          "category": "section_milestone",
          "format": "section_milestone",
          "completionMode": "direct",
          "closedTitle": "Your body-calm toolkit is ready",
          "closedBody": "Open the milestone to finish Calm the Body.",
          "badge": "BODY CALM",
          "openTitle": "You can choose, not force",
          "openBody": "You now have three breathing patterns and two body practices, each with a different job.",
          "nextLabel": "Next:",
          "nextTitle": "Design Your Evening.",
          "nextBody": "Build conditions that make these tools easier to use."
        }
      }
    ]
  $json$::jsonb) AS row(
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
  AND s.id = pg_temp.seed_uuid('s2_calm_the_body')
GROUP BY c.id, c.title;
