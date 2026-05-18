-- ============================================================================
-- Anxiety Toolkit — v5 Seed
-- Run directly in Supabase SQL Editor (not a tracked migration).
-- Requires 20260428000000_journey_map_v5.sql to have been applied first.
-- ============================================================================

-- Older local/remote copies of journey_map_v5 may be missing the one-row-per-node
-- uniqueness that these upserts rely on. Create the matching unique indexes so
-- `ON CONFLICT (node_id)` works when this seed is pasted into Supabase SQL Editor.
CREATE UNIQUE INDEX IF NOT EXISTS lesson_contents_node_id_key   ON lesson_contents (node_id);
CREATE UNIQUE INDEX IF NOT EXISTS quiz_contents_node_id_key     ON quiz_contents (node_id);
CREATE UNIQUE INDEX IF NOT EXISTS exercise_contents_node_id_key ON exercise_contents (node_id);
CREATE UNIQUE INDEX IF NOT EXISTS practice_contents_node_id_key ON practice_contents (node_id);
CREATE UNIQUE INDEX IF NOT EXISTS story_contents_node_id_key    ON story_contents (node_id);

-- ── Course ───────────────────────────────────────────────────────────────────

INSERT INTO courses (id, title, description, color_hex, order_index, is_published)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Anxiety Toolkit',
  'Learn to understand, challenge, and manage anxiety with proven CBT techniques. Build your personal coping toolkit in 2 weeks.',
  '3B82F6',
  1,
  true
) ON CONFLICT (id) DO UPDATE SET
  title        = EXCLUDED.title,
  description  = EXCLUDED.description,
  is_published = EXCLUDED.is_published;

-- ── Sections ─────────────────────────────────────────────────────────────────

INSERT INTO sections (id, course_id, title, order_index) VALUES
  ('00000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Understanding Anxiety',         1),
  ('00000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Challenging Anxious Thoughts',  2),
  ('00000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Calming Your Body',             3),
  ('00000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Your Anxiety Action Plan',      4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, order_index = EXCLUDED.order_index;

-- ── Units — Section 1 ────────────────────────────────────────────────────────

INSERT INTO units (id, section_id, title, icon_key, order_index) VALUES
  ('00000002-0001-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', 'What Anxiety Is',       'brain',   1),
  ('00000002-0001-0000-0000-000000000002', '00000001-0000-0000-0000-000000000001', 'Map Your Anxiety Cycle','cycle',   2),
  ('00000002-0001-0000-0000-000000000003', '00000001-0000-0000-0000-000000000001', 'Reflect & Review',      'reflect', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, order_index = EXCLUDED.order_index;

-- ── Units — Section 2 ────────────────────────────────────────────────────────

INSERT INTO units (id, section_id, title, icon_key, order_index) VALUES
  ('00000002-0002-0000-0000-000000000001', '00000001-0000-0000-0000-000000000002', 'Thinking Traps',        'thought', 1),
  ('00000002-0002-0000-0000-000000000002', '00000001-0000-0000-0000-000000000002', 'Challenge the Thought', 'shield',  2),
  ('00000002-0002-0000-0000-000000000003', '00000001-0000-0000-0000-000000000002', 'Master the Skill',      'star',    3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, order_index = EXCLUDED.order_index;

-- ── Units — Section 3 ────────────────────────────────────────────────────────

INSERT INTO units (id, section_id, title, icon_key, order_index) VALUES
  ('00000002-0003-0000-0000-000000000001', '00000001-0000-0000-0000-000000000003', 'Body-Mind Basics',  'heart', 1),
  ('00000002-0003-0000-0000-000000000002', '00000001-0000-0000-0000-000000000003', 'Quick Calm Tools',  'wind',  2),
  ('00000002-0003-0000-0000-000000000003', '00000001-0000-0000-0000-000000000003', 'Deep Relaxation',   'moon',  3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, order_index = EXCLUDED.order_index;

-- ── Units — Section 4 ────────────────────────────────────────────────────────

INSERT INTO units (id, section_id, title, icon_key, order_index) VALUES
  ('00000002-0004-0000-0000-000000000001', '00000001-0000-0000-0000-000000000004', 'Build Your Toolkit', 'toolbox', 1),
  ('00000002-0004-0000-0000-000000000002', '00000001-0000-0000-0000-000000000004', 'Practice Your Plan', 'target',  2),
  ('00000002-0004-0000-0000-000000000003', '00000001-0000-0000-0000-000000000004', 'Finish Strong',      'trophy',  3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, order_index = EXCLUDED.order_index;

-- ============================================================================
-- NODES + CONTENT — Section 1, Unit 1: What Anxiety Is
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0001-0001-0000-000000000001', '00000002-0001-0000-0000-000000000001', 'What is Anxiety?',    'lesson', 'lesson', NULL, 1, 3),
  ('00000003-0001-0001-0000-000000000002', '00000002-0001-0000-0000-000000000001', 'The Anxiety Cycle',   'lesson', 'lesson', NULL, 2, 3),
  ('00000003-0001-0001-0000-000000000003', '00000002-0001-0000-0000-000000000001', 'Anxiety Basics Quiz', 'quiz',   'quiz',   70,   3, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO lesson_contents (node_id, screens) VALUES (
  '00000003-0001-0001-0000-000000000001',
  '[
    {"order":1,"type":"text","body":"Anxiety is your brain''s alarm system. It evolved to protect you from danger — like a smoke detector for your mind."},
    {"order":2,"type":"text","body":"When the alarm goes off, your body floods with adrenaline. Heart races, palms sweat, breathing speeds up. This is the fight-or-flight response."},
    {"order":3,"type":"text","body":"The problem? Your brain can''t tell the difference between a tiger and a work email. It triggers the same alarm for both."},
    {"order":4,"type":"text","body":"Anxiety isn''t a flaw — it''s a feature that''s misfiring. You don''t need to eliminate it. You need to recalibrate the alarm."},
    {"order":5,"type":"text","body":"Key Takeaway: Anxiety is your brain''s protection system working overtime. The goal isn''t to remove it — it''s to turn down the sensitivity."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET screens = EXCLUDED.screens;

INSERT INTO lesson_contents (node_id, screens) VALUES (
  '00000003-0001-0001-0000-000000000002',
  '[
    {"order":1,"type":"text","body":"Anxiety works in a cycle — like three gears turning together. A thought triggers a feeling, which drives an action, which creates a new thought."},
    {"order":2,"type":"text","body":"Example: You think ''I''ll embarrass myself'' (thought) → You feel dread and nausea (feeling) → You cancel plans (action)."},
    {"order":3,"type":"text","body":"Canceling feels like relief — but it teaches your brain the situation WAS dangerous. Next time, the alarm is even louder."},
    {"order":4,"type":"text","body":"The good news: you can interrupt the cycle at ANY gear. Change the thought, manage the feeling, OR choose a different action."},
    {"order":5,"type":"text","body":"Key Takeaway: Anxiety is a cycle of thoughts → feelings → avoidance. Breaking any part of the cycle weakens the whole loop."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET screens = EXCLUDED.screens;

INSERT INTO quiz_contents (node_id, questions) VALUES (
  '00000003-0001-0001-0000-000000000003',
  '[
    {"id":"q1","order":1,"type":"single_choice","text":"What is the main purpose of anxiety?",
     "options":[{"id":"a","text":"To make you feel bad","isCorrect":false},{"id":"b","text":"To protect you from danger","isCorrect":true},{"id":"c","text":"To cause avoidance","isCorrect":false},{"id":"d","text":"To release adrenaline","isCorrect":false}],
     "explanation":"Anxiety is your brain''s built-in alarm system designed to protect you from danger."},
    {"id":"q2","order":2,"type":"single_choice","text":"In the anxiety cycle, avoidance makes anxiety...",
     "options":[{"id":"a","text":"Weaker over time","isCorrect":false},{"id":"b","text":"Stay the same","isCorrect":false},{"id":"c","text":"Stronger over time","isCorrect":true},{"id":"d","text":"Disappear","isCorrect":false}],
     "explanation":"Avoidance teaches your brain the situation was truly dangerous, making the alarm louder next time."},
    {"id":"q3","order":3,"type":"true_false","text":"You can interrupt the anxiety cycle by changing just one part of it.",
     "options":[{"id":"true","text":"True","isCorrect":true},{"id":"false","text":"False","isCorrect":false}],
     "explanation":"Breaking any gear in the cycle — thought, feeling, or action — weakens the whole loop."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET questions = EXCLUDED.questions;

-- ============================================================================
-- NODES + CONTENT — Section 1, Unit 2: Map Your Anxiety Cycle
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0001-0002-0000-000000000001', '00000002-0001-0000-0000-000000000002', 'Your Anxiety Triggers', 'exercise', 'exercise', NULL, 1, 5),
  ('00000003-0001-0002-0000-000000000002', '00000002-0001-0000-0000-000000000002', 'A Day in the Cycle',    'story',    'story',    NULL, 2, 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO exercise_contents (node_id, instruction, steps) VALUES (
  '00000003-0001-0002-0000-000000000001',
  'Map your personal anxiety cycle by reflecting on a recent moment of anxiety.',
  '[
    {"order":1,"type":"text","body":"Think of a recent situation where you felt anxious. It could be small or big."},
    {"order":2,"type":"prompt","body":"Describe the situation in a few words.","responseType":"free_text"},
    {"order":3,"type":"prompt","body":"What thought went through your head?","responseType":"free_text"},
    {"order":4,"type":"prompt","body":"How intense was the anxiety? (1 = mild, 5 = overwhelming)","responseType":"scale"},
    {"order":5,"type":"prompt","body":"What did you do in response?","responseType":"free_text"},
    {"order":6,"type":"text","body":"You''ve just mapped your anxiety cycle. Recognizing the pattern is the first step to changing it."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

INSERT INTO story_contents (node_id, dialogues) VALUES (
  '00000003-0001-0002-0000-000000000002',
  '[
    {"order":1,"type":"dialogue","speaker":"narrator","text":"It''s Monday morning. Alex wakes up and immediately checks their phone."},
    {"order":2,"type":"dialogue","speaker":"narrator","text":"There''s a message from their manager: ''Can we chat today?''"},
    {"order":3,"type":"dialogue","speaker":"character","text":"My heart just dropped. What did I do wrong?"},
    {"order":4,"type":"dialogue","speaker":"narrator","text":"Alex''s mind starts racing. By 9am, they''ve imagined every worst-case scenario."},
    {"order":5,"type":"choice","text":"Alex is about to send a frantic reply. What should they do instead?","options":[{"text":"Pause and name the feeling","next":"pause"},{"text":"Avoid the manager all day","next":"avoid"}]},
    {"order":6,"type":"dialogue","speaker":"narrator","text":"Pausing helps Alex notice they''re catastrophizing. The meeting turns out to be about a new project."},
    {"order":7,"type":"dialogue","speaker":"character","text":"My brain made up the worst story. Next time I''ll try to catch it earlier."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET dialogues = EXCLUDED.dialogues;

-- ============================================================================
-- NODES + CONTENT — Section 1, Unit 3: Reflect & Review
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0001-0003-0000-000000000001', '00000002-0001-0000-0000-000000000003', 'Section 1 Checkpoint', 'quiz', 'quiz', 75, 1, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO quiz_contents (node_id, questions) VALUES (
  '00000003-0001-0003-0000-000000000001',
  '[
    {"id":"q1","order":1,"type":"single_choice","text":"The anxiety cycle connects thoughts, feelings, and...",
     "options":[{"id":"a","text":"Sleep","isCorrect":false},{"id":"b","text":"Actions","isCorrect":true},{"id":"c","text":"Memories","isCorrect":false},{"id":"d","text":"Diet","isCorrect":false}],
     "explanation":"The anxiety cycle is: thought → feeling → action → new thought."},
    {"id":"q2","order":2,"type":"true_false","text":"Avoidance is an effective long-term strategy for managing anxiety.",
     "options":[{"id":"true","text":"True","isCorrect":false},{"id":"false","text":"False","isCorrect":true}],
     "explanation":"Avoidance provides short-term relief but reinforces the anxiety cycle, making it worse over time."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET questions = EXCLUDED.questions;

-- ============================================================================
-- NODES + CONTENT — Section 2, Unit 1: Thinking Traps
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0002-0001-0000-000000000001', '00000002-0002-0000-0000-000000000001', 'Common Thinking Traps', 'lesson',   'lesson',   NULL, 1, 3),
  ('00000003-0002-0001-0000-000000000002', '00000002-0002-0000-0000-000000000001', 'Spot the Trap',         'exercise', 'exercise', NULL, 2, 5),
  ('00000003-0002-0001-0000-000000000003', '00000002-0002-0000-0000-000000000001', 'Thinking Traps Quiz',   'quiz',     'quiz',     70,   3, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO lesson_contents (node_id, screens) VALUES (
  '00000003-0002-0001-0000-000000000001',
  '[
    {"order":1,"type":"text","body":"Thinking traps are automatic thought patterns that make anxiety worse. They feel true — but they distort reality."},
    {"order":2,"type":"text","body":"Catastrophising: Expecting the worst outcome. ''I''ll fail this presentation and lose my job.''"},
    {"order":3,"type":"text","body":"Mind reading: Assuming you know what others think. ''Everyone thinks I''m incompetent.''"},
    {"order":4,"type":"text","body":"All-or-nothing thinking: Seeing things as black or white. ''If I''m not perfect, I''m a failure.''"},
    {"order":5,"type":"text","body":"Overgeneralising: Drawing sweeping conclusions. ''This always happens to me.''"},
    {"order":6,"type":"text","body":"Key Takeaway: Naming the trap is the first step to challenging it. You can''t fight what you can''t see."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET screens = EXCLUDED.screens;

INSERT INTO exercise_contents (node_id, instruction, steps) VALUES (
  '00000003-0002-0001-0000-000000000002',
  'Practice identifying thinking traps in your own thoughts.',
  '[
    {"order":1,"type":"text","body":"Recall a recent anxious thought — something that worried you this week."},
    {"order":2,"type":"prompt","body":"Write the anxious thought.","responseType":"free_text"},
    {"order":3,"type":"prompt","body":"Which thinking trap does it match? (catastrophising / mind reading / all-or-nothing / overgeneralising)","responseType":"free_text"},
    {"order":4,"type":"prompt","body":"How strongly do you believe this thought? (1 = barely, 5 = completely)","responseType":"scale"},
    {"order":5,"type":"text","body":"Great — you''ve named the trap. In the next unit, you''ll learn to challenge it with evidence."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

INSERT INTO quiz_contents (node_id, questions) VALUES (
  '00000003-0002-0001-0000-000000000003',
  '[
    {"id":"q1","order":1,"type":"single_choice","text":"''Everyone noticed me stumble on stage. They all think I''m a fool.'' This is an example of...",
     "options":[{"id":"a","text":"Catastrophising","isCorrect":false},{"id":"b","text":"Mind reading","isCorrect":true},{"id":"c","text":"Overgeneralising","isCorrect":false},{"id":"d","text":"All-or-nothing","isCorrect":false}],
     "explanation":"Mind reading means assuming you know what others are thinking — usually something negative."},
    {"id":"q2","order":2,"type":"single_choice","text":"''I got one answer wrong, so I completely failed the test.'' This is...",
     "options":[{"id":"a","text":"Mind reading","isCorrect":false},{"id":"b","text":"All-or-nothing","isCorrect":true},{"id":"c","text":"Catastrophising","isCorrect":false},{"id":"d","text":"Overgeneralising","isCorrect":false}],
     "explanation":"All-or-nothing thinking sees only total success or total failure, ignoring the middle ground."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET questions = EXCLUDED.questions;

-- ============================================================================
-- NODES + CONTENT — Section 2, Unit 2: Challenge the Thought
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0002-0002-0000-000000000001', '00000002-0002-0000-0000-000000000002', 'The Evidence Test', 'exercise', 'exercise', NULL, 1, 6),
  ('00000003-0002-0002-0000-000000000002', '00000002-0002-0000-0000-000000000002', 'Reframe Practice',  'exercise', 'exercise', NULL, 2, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO exercise_contents (node_id, instruction, steps) VALUES (
  '00000003-0002-0002-0000-000000000001',
  'Challenge an anxious thought using the evidence test — a core CBT technique.',
  '[
    {"order":1,"type":"text","body":"The evidence test asks: what facts support this thought, and what facts contradict it?"},
    {"order":2,"type":"prompt","body":"Write an anxious thought you have.","responseType":"free_text"},
    {"order":3,"type":"prompt","body":"List one piece of evidence SUPPORTING this thought.","responseType":"free_text"},
    {"order":4,"type":"prompt","body":"List one piece of evidence AGAINST this thought.","responseType":"free_text"},
    {"order":5,"type":"prompt","body":"After weighing the evidence, how strongly do you believe the thought? (1-5)","responseType":"scale"},
    {"order":6,"type":"text","body":"Looking for evidence forces your brain out of emotional reasoning and into rational thinking."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

INSERT INTO exercise_contents (node_id, instruction, steps) VALUES (
  '00000003-0002-0002-0000-000000000002',
  'Practice reframing — turning a distorted thought into a balanced one.',
  '[
    {"order":1,"type":"text","body":"A balanced thought isn''t blindly positive — it''s realistic. It holds both the fear and the evidence."},
    {"order":2,"type":"prompt","body":"Write the anxious thought you tested.","responseType":"free_text"},
    {"order":3,"type":"prompt","body":"Now write a more balanced version that includes both perspectives.","responseType":"free_text"},
    {"order":4,"type":"prompt","body":"How much calmer do you feel with the balanced thought? (1-5)","responseType":"scale"}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

-- ============================================================================
-- NODES + CONTENT — Section 2, Unit 3: Master the Skill (Challenge)
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0002-0003-0000-000000000001', '00000002-0002-0000-0000-000000000003', 'Section 2 Challenge', 'challenge', 'quiz', 75, 1, 6)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO quiz_contents (node_id, questions) VALUES (
  '00000003-0002-0003-0000-000000000001',
  '[
    {"id":"q1","order":1,"type":"single_choice","text":"What is the first step in the evidence test?",
     "options":[{"id":"a","text":"Write a positive affirmation","isCorrect":false},{"id":"b","text":"Identify the anxious thought","isCorrect":true},{"id":"c","text":"Avoid the triggering situation","isCorrect":false},{"id":"d","text":"Call a friend for reassurance","isCorrect":false}],
     "explanation":"You must first identify and write out the anxious thought before you can examine the evidence."},
    {"id":"q2","order":2,"type":"true_false","text":"A balanced thought must always be positive.",
     "options":[{"id":"true","text":"True","isCorrect":false},{"id":"false","text":"False","isCorrect":true}],
     "explanation":"A balanced thought is realistic, not blindly positive. It acknowledges both the fear and the evidence against it."},
    {"id":"q3","order":3,"type":"single_choice","text":"Which technique asks: what facts support this thought, and what facts contradict it?",
     "options":[{"id":"a","text":"Mindfulness","isCorrect":false},{"id":"b","text":"The evidence test","isCorrect":true},{"id":"c","text":"Journalling","isCorrect":false},{"id":"d","text":"Deep breathing","isCorrect":false}],
     "explanation":"The evidence test is the core CBT technique for challenging thinking traps."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET questions = EXCLUDED.questions;

-- ============================================================================
-- NODES + CONTENT — Section 3, Unit 1: Body-Mind Basics
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0003-0001-0000-000000000001', '00000002-0003-0000-0000-000000000001', 'How Anxiety Lives in the Body', 'lesson',   'lesson',   NULL, 1, 3),
  ('00000003-0003-0001-0000-000000000002', '00000002-0003-0000-0000-000000000001', 'Body Scan',                     'practice', 'practice', NULL, 2, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO lesson_contents (node_id, screens) VALUES (
  '00000003-0003-0001-0000-000000000001',
  '[
    {"order":1,"type":"text","body":"Anxiety doesn''t just live in your mind — it lives in your body. Tight chest, shallow breathing, tense shoulders are all anxiety signals."},
    {"order":2,"type":"text","body":"This mind-body connection runs both ways. Calm the body, and you can calm the mind."},
    {"order":3,"type":"text","body":"Your nervous system has two modes: fight-or-flight (sympathetic) and rest-and-digest (parasympathetic). Anxiety is stuck in fight-or-flight."},
    {"order":4,"type":"text","body":"Breathing, grounding, and progressive relaxation all activate the parasympathetic system — your body''s built-in off switch."},
    {"order":5,"type":"text","body":"Key Takeaway: Calming the body is not a distraction from anxiety. It is a direct intervention in the anxiety cycle."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET screens = EXCLUDED.screens;

INSERT INTO practice_contents (node_id, instruction, steps, repeat_count) VALUES (
  '00000003-0003-0001-0000-000000000002',
  'Scan your body from head to toe to notice where you''re holding tension.',
  '[
    {"order":1,"type":"instruction","instruction":"Sit comfortably. Close your eyes or soften your gaze. Take a slow breath in and out."},
    {"order":2,"type":"timed","instruction":"Bring attention to your head and face. Notice any tension. Breathe into it.","durationSecs":15},
    {"order":3,"type":"timed","instruction":"Move to your shoulders and neck. Are they tight? Let them drop slightly.","durationSecs":15},
    {"order":4,"type":"timed","instruction":"Check your chest and belly. Is your breathing shallow? Let your belly soften.","durationSecs":15},
    {"order":5,"type":"timed","instruction":"Scan down your arms to your hands. Unclench your fists. Relax your fingers.","durationSecs":15},
    {"order":6,"type":"timed","instruction":"Now your legs and feet. Release any gripping. Feel the ground beneath you.","durationSecs":15},
    {"order":7,"type":"instruction","instruction":"Take a final deep breath. Notice how your body feels now compared to when you started."}
  ]',
  1
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

-- ============================================================================
-- NODES + CONTENT — Section 3, Unit 2: Quick Calm Tools
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0003-0002-0000-000000000001', '00000002-0003-0000-0000-000000000002', 'Box Breathing',       'practice', 'practice', NULL, 1, 4),
  ('00000003-0003-0002-0000-000000000002', '00000002-0003-0000-0000-000000000002', '5-4-3-2-1 Grounding', 'practice', 'practice', NULL, 2, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO practice_contents (node_id, instruction, steps, repeat_count) VALUES (
  '00000003-0003-0002-0000-000000000001',
  'Box breathing (4-4-4-4) activates your parasympathetic nervous system in minutes.',
  '[
    {"order":1,"type":"instruction","instruction":"Box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4. We''ll do 4 rounds."},
    {"order":2,"type":"timed","instruction":"Inhale slowly through your nose for 4 counts.","durationSecs":4},
    {"order":3,"type":"timed","instruction":"Hold your breath — don''t tense up.","durationSecs":4},
    {"order":4,"type":"timed","instruction":"Exhale slowly through your mouth.","durationSecs":4},
    {"order":5,"type":"timed","instruction":"Hold — empty lungs, stay relaxed.","durationSecs":4},
    {"order":6,"type":"instruction","instruction":"That''s one round. Repeat 3 more times at your own pace."}
  ]',
  4
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps, repeat_count = EXCLUDED.repeat_count;

INSERT INTO practice_contents (node_id, instruction, steps, repeat_count) VALUES (
  '00000003-0003-0002-0000-000000000002',
  'The 5-4-3-2-1 grounding technique anchors you in the present when anxiety spikes.',
  '[
    {"order":1,"type":"instruction","instruction":"Grounding pulls you out of your anxious thoughts and back into your senses. Let''s go."},
    {"order":2,"type":"timed","instruction":"Name 5 things you can SEE right now. Look around slowly.","durationSecs":20},
    {"order":3,"type":"timed","instruction":"Name 4 things you can physically FEEL. Clothes, floor, air.","durationSecs":15},
    {"order":4,"type":"timed","instruction":"Name 3 things you can HEAR right now.","durationSecs":15},
    {"order":5,"type":"timed","instruction":"Name 2 things you can SMELL (or like the smell of).","durationSecs":10},
    {"order":6,"type":"timed","instruction":"Name 1 thing you can TASTE right now.","durationSecs":8},
    {"order":7,"type":"instruction","instruction":"Notice how you feel now. Your brain can''t be fully anxious and fully present at the same time."}
  ]',
  1
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

-- ============================================================================
-- NODES + CONTENT — Section 3, Unit 3: Deep Relaxation
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0003-0003-0000-000000000001', '00000002-0003-0000-0000-000000000003', 'Progressive Muscle Relaxation', 'practice', 'practice', NULL, 1, 7),
  ('00000003-0003-0003-0000-000000000002', '00000002-0003-0000-0000-000000000003', 'Calming Tools Quiz',            'quiz',     'quiz',     70,   2, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO practice_contents (node_id, instruction, steps, repeat_count) VALUES (
  '00000003-0003-0003-0000-000000000001',
  'Progressive muscle relaxation (PMR) systematically releases tension throughout the body.',
  '[
    {"order":1,"type":"instruction","instruction":"Find a comfortable position. We''ll tense and release each muscle group. Tense for 5 sec, release, notice the difference."},
    {"order":2,"type":"timed","instruction":"Clench your fists tightly. Feel the tension.","durationSecs":5},
    {"order":3,"type":"timed","instruction":"Release. Feel the warmth and relaxation flood your hands.","durationSecs":10},
    {"order":4,"type":"timed","instruction":"Tense your shoulders — shrug them up to your ears.","durationSecs":5},
    {"order":5,"type":"timed","instruction":"Drop your shoulders. Feel the release.","durationSecs":10},
    {"order":6,"type":"timed","instruction":"Tighten your stomach muscles.","durationSecs":5},
    {"order":7,"type":"timed","instruction":"Release and breathe.","durationSecs":10},
    {"order":8,"type":"instruction","instruction":"Notice how much more relaxed your body feels. PMR trains your body to recognise and release tension on demand."}
  ]',
  1
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

INSERT INTO quiz_contents (node_id, questions) VALUES (
  '00000003-0003-0003-0000-000000000002',
  '[
    {"id":"q1","order":1,"type":"single_choice","text":"Box breathing uses a pattern of...",
     "options":[{"id":"a","text":"3-3-3-3","isCorrect":false},{"id":"b","text":"4-4-4-4","isCorrect":true},{"id":"c","text":"5-5-5-5","isCorrect":false},{"id":"d","text":"6-2-6-2","isCorrect":false}],
     "explanation":"Box breathing uses 4 counts for each phase: inhale, hold, exhale, hold."},
    {"id":"q2","order":2,"type":"single_choice","text":"How many senses does the 5-4-3-2-1 grounding technique use?",
     "options":[{"id":"a","text":"3","isCorrect":false},{"id":"b","text":"4","isCorrect":false},{"id":"c","text":"5","isCorrect":true},{"id":"d","text":"6","isCorrect":false}],
     "explanation":"5-4-3-2-1 uses all 5 senses: sight, touch, hearing, smell, and taste."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET questions = EXCLUDED.questions;

-- ============================================================================
-- NODES + CONTENT — Section 4, Unit 1: Build Your Toolkit
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0004-0001-0000-000000000001', '00000002-0004-0000-0000-000000000001', 'Your Personal Toolkit', 'exercise', 'exercise', NULL, 1, 6),
  ('00000003-0004-0001-0000-000000000002', '00000002-0004-0000-0000-000000000001', 'Emergency Action Plan', 'exercise', 'exercise', NULL, 2, 6)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO exercise_contents (node_id, instruction, steps) VALUES (
  '00000003-0004-0001-0000-000000000001',
  'Build your personal anxiety toolkit — a list of go-to strategies that work for you.',
  '[
    {"order":1,"type":"text","body":"A personal toolkit means you don''t have to think under pressure. You have a pre-built list of strategies to reach for."},
    {"order":2,"type":"prompt","body":"Which thinking technique helped you most? (e.g. evidence test, reframing)","responseType":"free_text"},
    {"order":3,"type":"prompt","body":"Which body technique helped you most? (e.g. box breathing, grounding, body scan)","responseType":"free_text"},
    {"order":4,"type":"prompt","body":"Name one person you can reach out to when anxiety peaks.","responseType":"free_text"},
    {"order":5,"type":"prompt","body":"Rate how confident you feel using these tools now (1 = not at all, 5 = very)","responseType":"scale"},
    {"order":6,"type":"text","body":"Your toolkit is personal. Keep adding to it. The more you practice, the faster these tools work."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

INSERT INTO exercise_contents (node_id, instruction, steps) VALUES (
  '00000003-0004-0001-0000-000000000002',
  'Create a step-by-step emergency action plan for your next anxiety spike.',
  '[
    {"order":1,"type":"text","body":"An emergency plan removes decision-making in the moment — when anxiety is high and thinking is hard."},
    {"order":2,"type":"prompt","body":"Step 1 (30 seconds): What will you do first when anxiety spikes?","responseType":"free_text"},
    {"order":3,"type":"prompt","body":"Step 2 (2 minutes): Which calming technique will you use?","responseType":"free_text"},
    {"order":4,"type":"prompt","body":"Step 3 (5 minutes): How will you challenge the anxious thought?","responseType":"free_text"},
    {"order":5,"type":"prompt","body":"Who can you message or call if the plan isn''t working?","responseType":"free_text"},
    {"order":6,"type":"text","body":"Save this plan. Read it before a situation you know triggers anxiety. Review it after — does it need adjusting?"}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET instruction = EXCLUDED.instruction, steps = EXCLUDED.steps;

-- ============================================================================
-- NODES + CONTENT — Section 4, Unit 2: Practice Your Plan
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0004-0002-0000-000000000001', '00000002-0004-0000-0000-000000000002', 'The Presentation Scenario', 'story', 'story', NULL, 1, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO story_contents (node_id, dialogues) VALUES (
  '00000003-0004-0002-0000-000000000001',
  '[
    {"order":1,"type":"dialogue","speaker":"narrator","text":"Tomorrow you have a big presentation. The anxious thoughts have started."},
    {"order":2,"type":"dialogue","speaker":"character","text":"I''m going to blank completely. Everyone will see how nervous I am."},
    {"order":3,"type":"choice","text":"What should you do first?","options":[{"text":"Name the thinking trap","next":"name"},{"text":"Cancel the presentation","next":"cancel"}]},
    {"order":4,"type":"dialogue","speaker":"narrator","text":"Good. You recognise this as catastrophising. Now use the evidence test."},
    {"order":5,"type":"dialogue","speaker":"character","text":"Evidence against: I''ve done presentations before. I prepared well. My manager said I''m ready."},
    {"order":6,"type":"choice","text":"You still feel anxious. What next?","options":[{"text":"Try box breathing","next":"breathe"},{"text":"Scroll social media","next":"scroll"}]},
    {"order":7,"type":"dialogue","speaker":"narrator","text":"After box breathing, your heart rate drops. You feel grounded enough to prepare."},
    {"order":8,"type":"dialogue","speaker":"character","text":"I used my toolkit — and it worked. I''m ready."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET dialogues = EXCLUDED.dialogues;

-- ============================================================================
-- NODES + CONTENT — Section 4, Unit 3: Finish Strong (Boss)
-- ============================================================================

INSERT INTO nodes (id, unit_id, title, type, content_type, pass_threshold, order_index, estimated_mins) VALUES
  ('00000003-0004-0003-0000-000000000001', '00000002-0004-0000-0000-000000000003', 'Anxiety Toolkit — Final Boss', 'boss', 'quiz', 80, 1, 8)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, type = EXCLUDED.type;

INSERT INTO quiz_contents (node_id, questions) VALUES (
  '00000003-0004-0003-0000-000000000001',
  '[
    {"id":"q1","order":1,"type":"single_choice","text":"What is the anxiety cycle?",
     "options":[{"id":"a","text":"Sleep → mood → energy","isCorrect":false},{"id":"b","text":"Thought → feeling → action","isCorrect":true},{"id":"c","text":"Trigger → avoidance → relief","isCorrect":false},{"id":"d","text":"Stress → breath → calm","isCorrect":false}],
     "explanation":"The anxiety cycle: a thought triggers a feeling, which drives an action, which creates a new thought."},
    {"id":"q2","order":2,"type":"single_choice","text":"Which breathing technique uses a 4-4-4-4 pattern?",
     "options":[{"id":"a","text":"Diaphragmatic breathing","isCorrect":false},{"id":"b","text":"Box breathing","isCorrect":true},{"id":"c","text":"4-7-8 breathing","isCorrect":false},{"id":"d","text":"Pursed-lip breathing","isCorrect":false}],
     "explanation":"Box breathing: inhale 4, hold 4, exhale 4, hold 4."},
    {"id":"q3","order":3,"type":"single_choice","text":"''This ALWAYS happens to me'' is an example of which thinking trap?",
     "options":[{"id":"a","text":"All-or-nothing","isCorrect":false},{"id":"b","text":"Mind reading","isCorrect":false},{"id":"c","text":"Overgeneralising","isCorrect":true},{"id":"d","text":"Catastrophising","isCorrect":false}],
     "explanation":"Overgeneralising draws broad sweeping conclusions from single events (''always'', ''never'', ''everyone'')."},
    {"id":"q4","order":4,"type":"true_false","text":"The goal of CBT is to eliminate anxiety completely.",
     "options":[{"id":"true","text":"True","isCorrect":false},{"id":"false","text":"False","isCorrect":true}],
     "explanation":"The goal is to recalibrate anxiety — to turn down the sensitivity of your alarm system, not remove it."},
    {"id":"q5","order":5,"type":"single_choice","text":"What does the 5-4-3-2-1 grounding technique primarily target?",
     "options":[{"id":"a","text":"Thinking traps","isCorrect":false},{"id":"b","text":"Your 5 senses","isCorrect":true},{"id":"c","text":"Muscle tension","isCorrect":false},{"id":"d","text":"Breathing rhythm","isCorrect":false}],
     "explanation":"5-4-3-2-1 anchors you to the present through your 5 senses: sight, touch, hearing, smell, taste."}
  ]'
) ON CONFLICT (node_id) DO UPDATE SET questions = EXCLUDED.questions;
