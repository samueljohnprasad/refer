-- ============================================================================
-- P1.7.3 — Quiz Node Content Authoring
-- "Anxiety Toolkit" journey — all Quiz nodes
--
-- Rules: instant feedback, explain wrong answers, progressive difficulty
-- JSONB: QuizContent { questions: QuizQuestion[] }
-- QuizQuestion: { text, options: string[], correct_index: number, explanation: string }
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. "Understanding Anxiety" Quiz — 4 questions (end of Unit 1)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "questions": [
    {
      "text": "What is the best analogy for anxiety described in this section?",
      "options": [
        "A broken engine that needs replacing",
        "A smoke alarm that sometimes goes off without fire",
        "A disease that must be cured",
        "A personality trait you''re born with"
      ],
      "correct_index": 1,
      "explanation": "Anxiety is like a smoke alarm — it''s a built-in protection system. It''s not broken; sometimes it just fires when there''s no real danger. And you can learn to adjust its sensitivity."
    },
    {
      "text": "The ''Anxiety Cycle'' runs through three gears. What are they?",
      "options": [
        "Sleep → Energy → Mood",
        "Thoughts → Feelings → Behaviors",
        "Past → Present → Future",
        "Stress → Anxiety → Depression"
      ],
      "correct_index": 1,
      "explanation": "The three gears are Thoughts (what your brain says), Feelings (what your body does), and Behaviors (what you do or avoid). They keep each other spinning — but you can break the cycle at any gear."
    },
    {
      "text": "You think: ''My friend didn''t text back — they must hate me.'' Which cognitive distortion is this?",
      "options": [
        "Catastrophizing",
        "Overgeneralizing",
        "Mind Reading",
        "Should Statements"
      ],
      "correct_index": 2,
      "explanation": "Mind Reading is assuming you know what someone else is thinking without evidence. Your friend could be busy, asleep, or just forgot — there are dozens of explanations more likely than ''they hate me.''"
    },
    {
      "text": "Which statement about anxiety is TRUE?",
      "options": [
        "The goal is to eliminate anxiety completely",
        "Anxiety is always a sign something is wrong",
        "You can break the anxiety cycle at any of the three gears",
        "Avoiding feared situations is the best long-term strategy"
      ],
      "correct_index": 2,
      "explanation": "You don''t need to eliminate anxiety — just turn it down to a useful level. You can intervene at thoughts (reframe), feelings (calm the body), or behaviors (face the fear gradually). Avoidance actually makes anxiety worse over time."
    }
  ]
}'::jsonb,
title = 'Understanding Anxiety',
description = 'Test what you''ve learned about anxiety, the cycle, and thinking traps.',
xp_reward = 15,
estimated_minutes = 4,
variant_key = 'quiz'
WHERE task_id = 'quiz_understanding_anxiety'
  AND node_type = 'quiz';

-- --------------------------------------------------------------------------
-- 2. "Cognitive Distortions Master Test" — 6 questions (end of Unit 2)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "questions": [
    {
      "text": "You get a B+ on an exam. You think: ''Anything less than an A is a failure.'' Which distortion?",
      "options": [
        "Emotional Reasoning",
        "All-or-Nothing Thinking",
        "Fortune Telling",
        "Labeling"
      ],
      "correct_index": 1,
      "explanation": "All-or-Nothing Thinking sees only two categories: perfect or failure. A B+ is actually a strong result — but this distortion erases the middle ground."
    },
    {
      "text": "After one awkward date, you think: ''I''ll never find anyone. I always ruin things.'' Identify the trap.",
      "options": [
        "Mind Reading",
        "Should Statements",
        "Overgeneralizing",
        "Catastrophizing"
      ],
      "correct_index": 2,
      "explanation": "Overgeneralizing turns one event into ''always'' or ''never.'' One awkward date is one data point, not a life sentence."
    },
    {
      "text": "You feel anxious before a flight. You think: ''I feel scared, so the plane must be dangerous.'' Which distortion?",
      "options": [
        "Emotional Reasoning",
        "Fortune Telling",
        "Catastrophizing",
        "Mind Reading"
      ],
      "correct_index": 0,
      "explanation": "Emotional Reasoning: ''I feel it, therefore it''s true.'' Fear of flying doesn''t make flying dangerous. Feelings are signals, not facts."
    },
    {
      "text": "A colleague doesn''t say good morning. You think: ''She''s angry at me about yesterday''s meeting.'' Best response?",
      "options": [
        "Confront her immediately to clear the air",
        "Recognize this is Mind Reading and consider other explanations",
        "Avoid her for the rest of the day",
        "Assume you''re right and apologize preemptively"
      ],
      "correct_index": 1,
      "explanation": "The best response is to catch the Mind Reading trap and generate alternatives: she might be distracted, tired, or didn''t see you. Don''t act on assumptions."
    },
    {
      "text": "You think: ''I should be over my anxiety by now. Everyone else handles stress fine.'' Which TWO distortions are present?",
      "options": [
        "Should Statements + Mind Reading",
        "Labeling + Fortune Telling",
        "Catastrophizing + Emotional Reasoning",
        "All-or-Nothing + Overgeneralizing"
      ],
      "correct_index": 0,
      "explanation": "''I should'' is a Should Statement — rigid rules that create guilt. ''Everyone else handles stress fine'' is Mind Reading — you''re assuming you know others'' inner experience. Most people struggle; they just hide it."
    },
    {
      "text": "You made a mistake at work. The most helpful self-talk is:",
      "options": [
        "''I''m such an idiot — I can''t do anything right.''",
        "''It doesn''t matter, mistakes don''t mean anything.''",
        "''I made a mistake. That''s normal. What can I learn from this?''",
        "''I should never make mistakes — I need to be perfect.''"
      ],
      "correct_index": 2,
      "explanation": "Option C is balanced thinking — acknowledging the mistake without Labeling (''I''m an idiot''), dismissing (''doesn''t matter''), or Should Statements (''I should be perfect''). It''s honest and forward-looking."
    }
  ]
}'::jsonb,
title = 'Cognitive Distortions Master Test',
description = 'Can you identify the thinking traps and choose the best response?',
xp_reward = 20,
estimated_minutes = 6,
variant_key = 'quiz'
WHERE task_id = 'quiz_distortions_master'
  AND node_type = 'quiz';
