-- ============================================================================
-- P1.1.5 — Seed Data: "Anxiety Toolkit" Journey
-- 28 nodes across 4 sections — the first complete mental health journey
-- Run AFTER all three mental health migration files
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Insert the Anxiety Toolkit journey template
-- --------------------------------------------------------------------------
INSERT INTO journey_templates (
  id, slug, title, description, icon_url, color_scheme, sort_order, is_active, version,
  category, difficulty, estimated_days, total_nodes, color_theme_key, icon_key
) VALUES (
  'b1000000-aaaa-4000-8000-000000000001',
  'anxiety-toolkit',
  'Anxiety Toolkit',
  'Learn to understand, challenge, and manage anxiety with proven CBT techniques. Build your personal coping toolkit in 2 weeks.',
  NULL,
  'blue',
  1,
  true,
  1,
  'anxiety',
  'beginner',
  14,
  28,
  'blue',
  'shield-check'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  estimated_days = EXCLUDED.estimated_days,
  total_nodes = EXCLUDED.total_nodes,
  is_active = EXCLUDED.is_active;

-- --------------------------------------------------------------------------
-- 2. Insert 4 sections (units)
-- --------------------------------------------------------------------------

-- Section 1: Understanding Anxiety
INSERT INTO journey_template_units (
  id, journey_id, unit_number, title, description, color_scheme, mascot_placements, unlock_rule
) VALUES (
  'b1100000-aaaa-4000-8000-000000000001',
  'b1000000-aaaa-4000-8000-000000000001',
  1,
  'Understanding Anxiety',
  'Learn what anxiety is, how it works in your brain and body, and why it feels the way it does.',
  'blue',
  '[{"afterNodeIndex": 3, "position": "right", "message": "You''re learning fast! 🧠"}]'::jsonb,
  'sequential'
) ON CONFLICT (journey_id, unit_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Section 2: Challenging Anxious Thoughts
INSERT INTO journey_template_units (
  id, journey_id, unit_number, title, description, color_scheme, mascot_placements, unlock_rule
) VALUES (
  'b1100000-aaaa-4000-8000-000000000002',
  'b1000000-aaaa-4000-8000-000000000001',
  2,
  'Challenging Anxious Thoughts',
  'Spot the thinking traps anxiety uses and learn to challenge them with evidence.',
  'purple',
  '[{"afterNodeIndex": 4, "position": "left", "message": "Thought detective mode! 🔍"}]'::jsonb,
  'sequential'
) ON CONFLICT (journey_id, unit_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Section 3: Calming Your Body
INSERT INTO journey_template_units (
  id, journey_id, unit_number, title, description, color_scheme, mascot_placements, unlock_rule
) VALUES (
  'b1100000-aaaa-4000-8000-000000000003',
  'b1000000-aaaa-4000-8000-000000000001',
  3,
  'Calming Your Body',
  'Master breathing, grounding, and relaxation techniques that calm your nervous system.',
  'green',
  '[{"afterNodeIndex": 2, "position": "right", "message": "Breathe... you''re doing great 🌿"}]'::jsonb,
  'sequential'
) ON CONFLICT (journey_id, unit_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Section 4: Your Anxiety Action Plan
INSERT INTO journey_template_units (
  id, journey_id, unit_number, title, description, color_scheme, mascot_placements, unlock_rule
) VALUES (
  'b1100000-aaaa-4000-8000-000000000004',
  'b1000000-aaaa-4000-8000-000000000001',
  4,
  'Your Anxiety Action Plan',
  'Build your personal coping toolkit and create an emergency action plan.',
  'orange',
  '[{"afterNodeIndex": 2, "position": "left", "message": "You''ve got this! 💪"}]'::jsonb,
  'sequential'
) ON CONFLICT (journey_id, unit_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- --------------------------------------------------------------------------
-- 3. Insert nodes — Section 1: Understanding Anxiety (7 nodes)
-- --------------------------------------------------------------------------
INSERT INTO journey_template_nodes (
  id, unit_id, node_index, node_type, task_id, rewards,
  title, description, content, xp_reward, estimated_minutes, icon_key, variant_key
) VALUES

-- Node 1: Mood Check
(
  'b1110000-aaaa-4000-8000-000000000001',
  'b1100000-aaaa-4000-8000-000000000001',
  0, 'mood_check', 'anxiety_s1_mood1',
  '[{"type": "xp", "amount": 5, "icon": "⚡"}]'::jsonb,
  'How anxious do you feel?',
  'Rate your current anxiety level before we begin.',
  '{
    "prompt": "How anxious do you feel right now?",
    "scale": 5,
    "note_enabled": true,
    "labels": ["Not at all", "A little", "Moderate", "Quite a bit", "Extremely"]
  }'::jsonb,
  5, 1, 'mirror', 'mood_check'
),

-- Node 2: Learn — What is Anxiety?
(
  'b1110000-aaaa-4000-8000-000000000002',
  'b1100000-aaaa-4000-8000-000000000001',
  1, 'learn', 'anxiety_s1_learn1',
  '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb,
  'What is Anxiety?',
  'Understand your brain''s built-in alarm system.',
  '{
    "cards": [
      {
        "text": "Anxiety is your brain''s alarm system. It evolved to protect you from danger — like a smoke detector for your mind.",
        "visual_key": "brain_alarm"
      },
      {
        "text": "When the alarm goes off, your body floods with adrenaline. Heart races, palms sweat, breathing speeds up. This is the fight-or-flight response.",
        "visual_key": "fight_flight"
      },
      {
        "text": "The problem? Your brain can''t tell the difference between a tiger and a work email. It triggers the same alarm for both.",
        "visual_key": "tiger_vs_email"
      },
      {
        "text": "Anxiety isn''t a flaw — it''s a feature that''s misfiring. You don''t need to eliminate it. You need to recalibrate the alarm.",
        "visual_key": "recalibrate"
      },
      {
        "text": "Key Takeaway: Anxiety is your brain''s protection system working overtime. The goal isn''t to remove it — it''s to turn down the sensitivity.",
        "visual_key": "summary_alarm"
      }
    ]
  }'::jsonb,
  10, 3, 'book-open', 'learn'
),

-- Node 3: Learn — The Anxiety Cycle
(
  'b1110000-aaaa-4000-8000-000000000003',
  'b1100000-aaaa-4000-8000-000000000001',
  2, 'learn', 'anxiety_s1_learn2',
  '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb,
  'The Anxiety Cycle',
  'See how thoughts, feelings, and actions create a loop.',
  '{
    "cards": [
      {
        "text": "Anxiety works in a cycle — like three gears turning together. A thought triggers a feeling, which drives an action, which creates a new thought.",
        "visual_key": "three_gears"
      },
      {
        "text": "Example: You think ''I''ll embarrass myself'' (thought) → You feel dread and nausea (feeling) → You cancel plans (action).",
        "visual_key": "cycle_example"
      },
      {
        "text": "Canceling feels like relief — but it teaches your brain the situation WAS dangerous. Next time, the alarm is even louder.",
        "visual_key": "avoidance_trap"
      },
      {
        "text": "The good news: you can interrupt the cycle at ANY gear. Change the thought, manage the feeling, OR choose a different action.",
        "visual_key": "break_cycle"
      },
      {
        "text": "Key Takeaway: Anxiety is a cycle of thoughts → feelings → avoidance. Breaking any part of the cycle weakens the whole loop.",
        "visual_key": "summary_cycle"
      }
    ]
  }'::jsonb,
  10, 3, 'book-open', 'learn'
),

-- Node 4: Exercise — Map Your Personal Anxiety Cycle
(
  'b1110000-aaaa-4000-8000-000000000004',
  'b1100000-aaaa-4000-8000-000000000001',
  3, 'exercise', 'anxiety_s1_exercise1',
  '[{"type": "xp", "amount": 20, "icon": "⚡"}]'::jsonb,
  'Map Your Anxiety Cycle',
  'Identify the thoughts, feelings, and actions in your own anxiety.',
  '{
    "steps": [
      {
        "prompt": "Think of a recent situation where you felt anxious. Describe what happened in 1-2 sentences.",
        "input_type": "text",
        "placeholder": "e.g., I had to give a presentation at work..."
      },
      {
        "prompt": "What thoughts went through your mind?",
        "input_type": "text",
        "placeholder": "e.g., Everyone will think I''m unprepared..."
      },
      {
        "prompt": "What did you feel in your body and emotions?",
        "input_type": "picker",
        "options": ["Racing heart", "Sweating", "Nausea", "Tight chest", "Dizziness", "Shaking", "Dread", "Panic", "Irritability", "Difficulty breathing"]
      },
      {
        "prompt": "What did you do (or avoid doing) because of the anxiety?",
        "input_type": "text",
        "placeholder": "e.g., I asked a colleague to present instead..."
      },
      {
        "prompt": "Looking at your cycle: thought → feeling → action. Can you see how they connect?",
        "input_type": "text",
        "placeholder": "Reflect on the pattern you notice..."
      }
    ]
  }'::jsonb,
  20, 5, 'dumbbell', 'exercise'
),

-- Node 5: Journal — Describe your last anxiety spike
(
  'b1110000-aaaa-4000-8000-000000000005',
  'b1100000-aaaa-4000-8000-000000000001',
  4, 'journal', 'anxiety_s1_journal1',
  '[{"type": "xp", "amount": 15, "icon": "⚡"}]'::jsonb,
  'Your Anxiety Story',
  'Write about a recent moment when anxiety showed up.',
  '{
    "prompt": "Describe the last time you felt a spike of anxiety. What was happening? What did your body feel like? What did you do? Don''t worry about grammar or length — just write honestly.",
    "mood_before": true,
    "mood_after": true,
    "voice_enabled": false,
    "tags": ["anxiety", "awareness", "section1"]
  }'::jsonb,
  15, 4, 'pencil', 'journal'
),

-- Node 6: Quiz — Understanding Anxiety
(
  'b1110000-aaaa-4000-8000-000000000006',
  'b1100000-aaaa-4000-8000-000000000001',
  5, 'quiz', 'anxiety_s1_quiz1',
  '[{"type": "xp", "amount": 15, "icon": "⚡"}]'::jsonb,
  'Understanding Anxiety',
  'Test what you''ve learned about how anxiety works.',
  '{
    "questions": [
      {
        "text": "What is anxiety, at its core?",
        "options": [
          "A personality flaw",
          "Your brain''s protection system working overtime",
          "A sign of weakness",
          "Something only some people experience"
        ],
        "correct_index": 1,
        "explanation": "Anxiety is your brain''s alarm system — it evolved to protect you. It''s not a flaw, it''s a feature that sometimes misfires."
      },
      {
        "text": "In the anxiety cycle, what happens after avoidance?",
        "options": [
          "The anxiety goes away permanently",
          "You feel relief but the cycle gets stronger next time",
          "Nothing — avoidance is the best strategy",
          "Your brain learns the situation is safe"
        ],
        "correct_index": 1,
        "explanation": "Avoidance gives temporary relief but teaches your brain the situation WAS dangerous, making the alarm louder next time."
      },
      {
        "text": "The three ''gears'' of the anxiety cycle are:",
        "options": [
          "Past, present, future",
          "Thoughts, feelings, actions",
          "Brain, body, behavior",
          "Trigger, response, recovery"
        ],
        "correct_index": 1,
        "explanation": "Thoughts → Feelings → Actions form the anxiety cycle. Changing any gear can break the loop."
      },
      {
        "text": "What''s the goal of managing anxiety?",
        "options": [
          "Eliminate anxiety completely",
          "Never feel nervous again",
          "Recalibrate your brain''s alarm sensitivity",
          "Avoid all stressful situations"
        ],
        "correct_index": 2,
        "explanation": "You can''t (and shouldn''t) eliminate anxiety. The goal is to turn down the sensitivity so it fires only when truly needed."
      }
    ]
  }'::jsonb,
  15, 3, 'help-circle', 'quiz'
),

-- Node 7: Chest — Unlock Quick Calm Breathing
(
  'b1110000-aaaa-4000-8000-000000000007',
  'b1100000-aaaa-4000-8000-000000000001',
  6, 'chest', 'anxiety_s1_chest1',
  '[{"type": "xp", "amount": 5, "icon": "⚡"}, {"type": "gems", "amount": 10, "icon": "💎"}]'::jsonb,
  'Reward Chest',
  'You''ve completed Section 1! Open your reward.',
  '{
    "reward_type": "audio",
    "reward_key": "quick_calm_breathing",
    "reward_name": "Quick Calm Breathing",
    "reward_description": "A 2-minute guided breathing exercise you can use anytime anxiety spikes.",
    "rarity": "uncommon"
  }'::jsonb,
  5, 1, 'gift', 'chest'
);

-- --------------------------------------------------------------------------
-- 4. Insert nodes — Section 2: Challenging Anxious Thoughts (8 nodes)
-- --------------------------------------------------------------------------
INSERT INTO journey_template_nodes (
  id, unit_id, node_index, node_type, task_id, rewards,
  title, description, content, xp_reward, estimated_minutes, icon_key, variant_key
) VALUES

-- Node 8: Mood Check
(
  'b1110000-aaaa-4000-8000-000000000008',
  'b1100000-aaaa-4000-8000-000000000002',
  0, 'mood_check', 'anxiety_s2_mood1',
  '[{"type": "xp", "amount": 5, "icon": "⚡"}]'::jsonb,
  'Mood Check-In',
  'How are you feeling as we start this section?',
  '{
    "prompt": "How anxious do you feel right now?",
    "scale": 5,
    "note_enabled": true,
    "labels": ["Not at all", "A little", "Moderate", "Quite a bit", "Extremely"]
  }'::jsonb,
  5, 1, 'mirror', 'mood_check'
),

-- Node 9: Learn — Cognitive Distortions of Anxiety
(
  'b1110000-aaaa-4000-8000-000000000009',
  'b1100000-aaaa-4000-8000-000000000002',
  1, 'learn', 'anxiety_s2_learn1',
  '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb,
  'Thinking Traps',
  'Your brain takes shortcuts that make anxiety worse.',
  '{
    "cards": [
      {
        "text": "Your brain processes 6,000+ thoughts a day. To keep up, it takes shortcuts. But sometimes those shortcuts distort reality.",
        "visual_key": "brain_shortcuts"
      },
      {
        "text": "These shortcuts are called ''thinking traps'' (or cognitive distortions). They''re automatic — you don''t choose them.",
        "visual_key": "thinking_traps"
      },
      {
        "text": "Anxiety loves three traps especially: Catastrophizing (worst-case spirals), Mind Reading (assuming what others think), and Fortune Telling (predicting disaster).",
        "visual_key": "top3_traps"
      },
      {
        "text": "The good news: once you can NAME a trap, it loses its power. ''Oh, that''s just catastrophizing'' is incredibly freeing.",
        "visual_key": "naming_power"
      },
      {
        "text": "Key Takeaway: Thinking traps are automatic distortions your brain uses. Naming them is the first step to freedom from anxious thoughts.",
        "visual_key": "summary_traps"
      }
    ]
  }'::jsonb,
  10, 3, 'book-open', 'learn'
),

-- Node 10: Learn — Top 5 Anxiety Distortions
(
  'b1110000-aaaa-4000-8000-000000000010',
  'b1100000-aaaa-4000-8000-000000000002',
  2, 'learn', 'anxiety_s2_learn2',
  '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb,
  'The Top 5 Anxiety Traps',
  'Learn to recognize the most common thinking traps in anxiety.',
  '{
    "cards": [
      {
        "text": "1. CATASTROPHIZING: Your brain jumps to the worst outcome. ''My boss wants to talk'' becomes ''I''m getting fired and my career is over.''",
        "visual_key": "catastrophizing"
      },
      {
        "text": "2. MIND READING: You assume you know what others think — and it''s always negative. ''She didn''t text back — she must hate me.''",
        "visual_key": "mind_reading"
      },
      {
        "text": "3. FORTUNE TELLING: You predict the future with certainty — and it''s always bad. ''This date will be a disaster. I just know it.''",
        "visual_key": "fortune_telling"
      },
      {
        "text": "4. ALL-OR-NOTHING: Everything is perfect or terrible, with no middle ground. ''If I don''t ace this, I''m a total failure.''",
        "visual_key": "all_or_nothing"
      },
      {
        "text": "5. EMOTIONAL REASONING: You treat feelings as facts. ''I feel like a fraud, so I must actually be incompetent.'' Feelings inform, but evidence decides.",
        "visual_key": "emotional_reasoning"
      }
    ]
  }'::jsonb,
  10, 3, 'book-open', 'learn'
),

-- Node 11: Exercise — Spot the Distortion
(
  'b1110000-aaaa-4000-8000-000000000011',
  'b1100000-aaaa-4000-8000-000000000002',
  3, 'exercise', 'anxiety_s2_exercise1',
  '[{"type": "xp", "amount": 20, "icon": "⚡"}]'::jsonb,
  'Spot the Trap',
  'Can you identify which thinking trap is at work?',
  '{
    "steps": [
      {
        "prompt": "''I have a headache. It''s probably a brain tumor.'' Which thinking trap is this?",
        "input_type": "multi_choice",
        "options": ["Catastrophizing", "Mind Reading", "Fortune Telling", "All-or-Nothing", "Emotional Reasoning"],
        "correct_index": 0,
        "explanation": "This is catastrophizing — jumping to the worst possible outcome with little evidence."
      },
      {
        "prompt": "''My coworker didn''t say good morning. She must be angry at me.'' Which trap?",
        "input_type": "multi_choice",
        "options": ["Catastrophizing", "Mind Reading", "Fortune Telling", "All-or-Nothing", "Emotional Reasoning"],
        "correct_index": 1,
        "explanation": "This is mind reading — assuming you know what someone else is thinking without evidence."
      },
      {
        "prompt": "''If I speak up in the meeting, I''ll definitely say something stupid.'' Which trap?",
        "input_type": "multi_choice",
        "options": ["Catastrophizing", "Mind Reading", "Fortune Telling", "All-or-Nothing", "Emotional Reasoning"],
        "correct_index": 2,
        "explanation": "This is fortune telling — predicting a negative outcome with certainty before it happens."
      },
      {
        "prompt": "''I got one question wrong on the quiz, so the whole thing is ruined.'' Which trap?",
        "input_type": "multi_choice",
        "options": ["Catastrophizing", "Mind Reading", "Fortune Telling", "All-or-Nothing", "Emotional Reasoning"],
        "correct_index": 3,
        "explanation": "This is all-or-nothing thinking — seeing things in only two categories: perfect or terrible."
      },
      {
        "prompt": "''I feel like a fraud at work, so I must actually be incompetent.'' Which trap?",
        "input_type": "multi_choice",
        "options": ["Catastrophizing", "Mind Reading", "Fortune Telling", "All-or-Nothing", "Emotional Reasoning"],
        "correct_index": 4,
        "explanation": "This is emotional reasoning — treating feelings as proof of reality. Feelings are real, but they''re not always accurate reporters."
      }
    ]
  }'::jsonb,
  20, 4, 'dumbbell', 'exercise'
),

-- Node 12: Exercise — Thought Record
(
  'b1110000-aaaa-4000-8000-000000000012',
  'b1100000-aaaa-4000-8000-000000000002',
  4, 'exercise', 'anxiety_s2_exercise2',
  '[{"type": "xp", "amount": 20, "icon": "⚡"}]'::jsonb,
  'Thought Record',
  'The #1 CBT tool — challenge a real anxious thought.',
  '{
    "steps": [
      {
        "prompt": "Describe a recent situation that made you anxious. Just the facts — what happened?",
        "input_type": "text",
        "placeholder": "e.g., I had to make a phone call to schedule an appointment..."
      },
      {
        "prompt": "What emotions did you feel? Select all that apply, then rate the strongest one.",
        "input_type": "picker",
        "options": ["Anxious", "Scared", "Worried", "Panicked", "Nervous", "Dread", "Tense", "Overwhelmed"]
      },
      {
        "prompt": "Rate the intensity of your strongest emotion (0 = none, 100 = most intense ever).",
        "input_type": "slider",
        "min": 0,
        "max": 100,
        "step": 5,
        "label_min": "None",
        "label_max": "Extreme"
      },
      {
        "prompt": "What was the ''hot thought'' — the automatic thought that popped into your mind?",
        "input_type": "text",
        "placeholder": "e.g., I''ll say something stupid and they''ll judge me..."
      },
      {
        "prompt": "What evidence SUPPORTS this thought? (Be honest — what facts back it up?)",
        "input_type": "text",
        "placeholder": "e.g., I''ve stumbled over words before..."
      },
      {
        "prompt": "What evidence goes AGAINST this thought? (What facts contradict it?)",
        "input_type": "text",
        "placeholder": "e.g., Most calls go fine. People are usually patient..."
      },
      {
        "prompt": "Now write a more balanced thought — one that considers ALL the evidence.",
        "input_type": "text",
        "placeholder": "e.g., I sometimes feel nervous on calls, but most go fine. Even if I stumble, it''s not a disaster."
      }
    ]
  }'::jsonb,
  20, 7, 'dumbbell', 'exercise'
),

-- Node 13: Journal — Rewrite your worry
(
  'b1110000-aaaa-4000-8000-000000000013',
  'b1100000-aaaa-4000-8000-000000000002',
  5, 'journal', 'anxiety_s2_journal1',
  '[{"type": "xp", "amount": 15, "icon": "⚡"}]'::jsonb,
  'Rewrite Your Worry',
  'Take your biggest worry and reframe it.',
  '{
    "prompt": "Write down your biggest current worry. Then, rewrite it as a balanced thought — one that a wise, caring friend might offer you. How does the rewritten version feel different?",
    "mood_before": false,
    "mood_after": true,
    "voice_enabled": false,
    "tags": ["anxiety", "cognitive_restructuring", "section2"]
  }'::jsonb,
  15, 4, 'pencil', 'journal'
),

-- Node 14: Quiz — Cognitive Distortions Master Test
(
  'b1110000-aaaa-4000-8000-000000000014',
  'b1100000-aaaa-4000-8000-000000000002',
  6, 'quiz', 'anxiety_s2_quiz1',
  '[{"type": "xp", "amount": 15, "icon": "⚡"}]'::jsonb,
  'Thinking Traps Master Test',
  'Can you spot and challenge the traps?',
  '{
    "questions": [
      {
        "text": "What is the purpose of a thought record?",
        "options": [
          "To write down positive affirmations",
          "To examine and reframe unhelpful thoughts using evidence",
          "To record everything that happened during the day",
          "To list all your worries"
        ],
        "correct_index": 1,
        "explanation": "A thought record helps you examine automatic thoughts by weighing evidence for and against them, then creating a balanced alternative."
      },
      {
        "text": "''Everyone at the party will judge my outfit.'' Which traps are at play?",
        "options": [
          "Mind Reading + Fortune Telling",
          "Catastrophizing + All-or-Nothing",
          "Emotional Reasoning + Labeling",
          "Overgeneralization + Blame"
        ],
        "correct_index": 0,
        "explanation": "You''re assuming what others think (mind reading) AND predicting a negative outcome (fortune telling) — a common combo in social anxiety."
      },
      {
        "text": "When challenging a thought, which question is MOST helpful?",
        "options": [
          "Why am I so anxious?",
          "What would I tell a friend who had this thought?",
          "How can I stop thinking about this?",
          "Why does this always happen to me?"
        ],
        "correct_index": 1,
        "explanation": "Asking ''What would I tell a friend?'' creates distance from the thought and activates your compassionate, rational side."
      },
      {
        "text": "A balanced thought should be:",
        "options": [
          "Always positive and optimistic",
          "Realistic and evidence-based, even if not perfectly positive",
          "The exact opposite of the negative thought",
          "Something you don''t actually believe"
        ],
        "correct_index": 1,
        "explanation": "Balanced thoughts must feel believable and be based on evidence. Forced positivity doesn''t work — realistic reframing does."
      },
      {
        "text": "Sarah thinks: ''I ALWAYS mess everything up.'' Which trap is this?",
        "options": [
          "Catastrophizing",
          "Emotional Reasoning",
          "Overgeneralization",
          "Personalization"
        ],
        "correct_index": 2,
        "explanation": "The word ''ALWAYS'' is a red flag for overgeneralization — taking one event and turning it into a rule about everything."
      },
      {
        "text": "After completing a thought record, your emotion intensity should ideally:",
        "options": [
          "Drop to zero",
          "Decrease somewhat as you see the evidence more clearly",
          "Stay exactly the same",
          "Increase because you''re paying attention to it"
        ],
        "correct_index": 1,
        "explanation": "The goal isn''t to eliminate the emotion — it''s to reduce its intensity by seeing the situation more accurately."
      }
    ]
  }'::jsonb,
  15, 3, 'help-circle', 'quiz'
),

-- Node 15: Checkpoint — Thought Challenger badge
(
  'b1110000-aaaa-4000-8000-000000000015',
  'b1100000-aaaa-4000-8000-000000000002',
  7, 'checkpoint', 'anxiety_s2_checkpoint1',
  '[{"type": "xp", "amount": 50, "icon": "⚡"}, {"type": "gems", "amount": 15, "icon": "💎"}]'::jsonb,
  'Section Complete!',
  'You''ve earned the Thought Challenger badge!',
  '{
    "badge_key": "thought_challenger",
    "badge_name": "Thought Challenger",
    "badge_description": "You can spot thinking traps and challenge them with evidence.",
    "skills_recap": [
      "Identified the 5 most common anxiety thinking traps",
      "Completed your first Thought Record",
      "Practiced reframing anxious thoughts with evidence"
    ],
    "show_mood_comparison": true
  }'::jsonb,
  50, 2, 'star', 'checkpoint'
);

-- --------------------------------------------------------------------------
-- 5. Insert nodes — Section 3: Calming Your Body (7 nodes)
-- --------------------------------------------------------------------------
INSERT INTO journey_template_nodes (
  id, unit_id, node_index, node_type, task_id, rewards,
  title, description, content, xp_reward, estimated_minutes, icon_key, variant_key
) VALUES

-- Node 16: Mood Check
(
  'b1110000-aaaa-4000-8000-000000000016',
  'b1100000-aaaa-4000-8000-000000000003',
  0, 'mood_check', 'anxiety_s3_mood1',
  '[{"type": "xp", "amount": 5, "icon": "⚡"}]'::jsonb,
  'Mood Check-In',
  'How are you feeling before we work on body calming?',
  '{
    "prompt": "How tense does your body feel right now?",
    "scale": 5,
    "note_enabled": true,
    "labels": ["Very relaxed", "Mostly calm", "A bit tense", "Quite tense", "Very tense"]
  }'::jsonb,
  5, 1, 'mirror', 'mood_check'
),

-- Node 17: Learn — The Body-Mind Connection
(
  'b1110000-aaaa-4000-8000-000000000017',
  'b1100000-aaaa-4000-8000-000000000003',
  1, 'learn', 'anxiety_s3_learn1',
  '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb,
  'The Body-Mind Connection',
  'Your body and mind are a two-way street.',
  '{
    "cards": [
      {
        "text": "Anxiety doesn''t just live in your head — it lives in your body. Racing heart, tight shoulders, shallow breathing. Your body IS the anxiety.",
        "visual_key": "body_anxiety"
      },
      {
        "text": "Here''s the powerful secret: the connection goes BOTH ways. Calm the body, and the mind follows.",
        "visual_key": "two_way_street"
      },
      {
        "text": "Deep breathing activates your parasympathetic nervous system — the ''rest and digest'' mode that counteracts fight-or-flight.",
        "visual_key": "parasympathetic"
      },
      {
        "text": "Key Takeaway: You can''t always control your thoughts, but you CAN control your breathing. And that changes everything.",
        "visual_key": "summary_body"
      }
    ]
  }'::jsonb,
  10, 2, 'book-open', 'learn'
),

-- Node 18: Exercise — 5-4-3-2-1 Grounding
(
  'b1110000-aaaa-4000-8000-000000000018',
  'b1100000-aaaa-4000-8000-000000000003',
  2, 'exercise', 'anxiety_s3_exercise1',
  '[{"type": "xp", "amount": 20, "icon": "⚡"}]'::jsonb,
  '5-4-3-2-1 Grounding',
  'Use your senses to anchor yourself in the present moment.',
  '{
    "steps": [
      {
        "prompt": "Name 5 things you can SEE right now. Look around carefully.",
        "input_type": "text",
        "placeholder": "e.g., my phone, the ceiling fan, a blue mug, my cat, the window...",
        "haptic": "light"
      },
      {
        "prompt": "Name 4 things you can TOUCH or feel right now.",
        "input_type": "text",
        "placeholder": "e.g., the fabric of my shirt, the cool table surface...",
        "haptic": "light"
      },
      {
        "prompt": "Name 3 things you can HEAR right now. Listen carefully.",
        "input_type": "text",
        "placeholder": "e.g., birds outside, the hum of the AC, my breathing...",
        "haptic": "light"
      },
      {
        "prompt": "Name 2 things you can SMELL right now (or like to smell).",
        "input_type": "text",
        "placeholder": "e.g., coffee, fresh laundry...",
        "haptic": "medium"
      },
      {
        "prompt": "Name 1 thing you can TASTE right now (or take a sip of water).",
        "input_type": "text",
        "placeholder": "e.g., mint toothpaste, water...",
        "haptic": "heavy"
      },
      {
        "prompt": "How present do you feel now compared to before? Rate 1-10.",
        "input_type": "slider",
        "min": 1,
        "max": 10,
        "step": 1,
        "label_min": "Still distracted",
        "label_max": "Fully present"
      }
    ]
  }'::jsonb,
  20, 4, 'dumbbell', 'exercise'
),

-- Node 19: Exercise — Box Breathing
(
  'b1110000-aaaa-4000-8000-000000000019',
  'b1100000-aaaa-4000-8000-000000000003',
  3, 'exercise', 'anxiety_s3_exercise2',
  '[{"type": "xp", "amount": 20, "icon": "⚡"}]'::jsonb,
  'Box Breathing',
  'A simple 4-4-4-4 breathing technique used by Navy SEALs.',
  '{
    "exercise_type": "breathing",
    "steps": [
      {
        "prompt": "Find a comfortable position. We''ll do 4 rounds of box breathing: inhale 4 seconds, hold 4, exhale 4, hold 4.",
        "input_type": "text",
        "placeholder": "Tap Continue when you''re ready..."
      }
    ],
    "breathing_config": {
      "pattern": "box",
      "inhale_seconds": 4,
      "hold_in_seconds": 4,
      "exhale_seconds": 4,
      "hold_out_seconds": 4,
      "rounds": 4,
      "visual": "square"
    }
  }'::jsonb,
  20, 3, 'dumbbell', 'exercise'
),

-- Node 20: Exercise — Progressive Muscle Relaxation
(
  'b1110000-aaaa-4000-8000-000000000020',
  'b1100000-aaaa-4000-8000-000000000003',
  4, 'exercise', 'anxiety_s3_exercise3',
  '[{"type": "xp", "amount": 20, "icon": "⚡"}]'::jsonb,
  'Progressive Muscle Relaxation',
  'Tense and release your muscles to melt away physical tension.',
  '{
    "exercise_type": "body_scan",
    "steps": [
      {
        "prompt": "We''ll go through your body, tensing each area for 5 seconds then releasing for 10 seconds. Notice the difference between tension and relaxation.",
        "input_type": "text",
        "placeholder": "Tap Continue when you''re ready..."
      }
    ],
    "body_scan_config": {
      "areas": [
        {"name": "Feet", "tense_seconds": 5, "release_seconds": 10, "instruction": "Curl your toes tightly... now release."},
        {"name": "Calves", "tense_seconds": 5, "release_seconds": 10, "instruction": "Point your toes up toward your shins... now release."},
        {"name": "Thighs", "tense_seconds": 5, "release_seconds": 10, "instruction": "Squeeze your thigh muscles... now release."},
        {"name": "Abdomen", "tense_seconds": 5, "release_seconds": 10, "instruction": "Tighten your stomach muscles... now release."},
        {"name": "Hands", "tense_seconds": 5, "release_seconds": 10, "instruction": "Make tight fists... now release and spread your fingers."},
        {"name": "Arms", "tense_seconds": 5, "release_seconds": 10, "instruction": "Flex your biceps... now release."},
        {"name": "Shoulders", "tense_seconds": 5, "release_seconds": 10, "instruction": "Shrug your shoulders up to your ears... now drop them."},
        {"name": "Face", "tense_seconds": 5, "release_seconds": 10, "instruction": "Scrunch your whole face tightly... now release and let it go soft."}
      ]
    }
  }'::jsonb,
  20, 5, 'dumbbell', 'exercise'
),

-- Node 21: Journal — Which technique worked best?
(
  'b1110000-aaaa-4000-8000-000000000021',
  'b1100000-aaaa-4000-8000-000000000003',
  5, 'journal', 'anxiety_s3_journal1',
  '[{"type": "xp", "amount": 15, "icon": "⚡"}]'::jsonb,
  'Your Calming Toolkit',
  'Reflect on which body-calming technique felt most helpful.',
  '{
    "prompt": "You just tried three body-calming techniques: 5-4-3-2-1 Grounding, Box Breathing, and Progressive Muscle Relaxation. Which one felt most natural to you? Which one calmed you the most? When would you use each one?",
    "mood_before": false,
    "mood_after": true,
    "voice_enabled": false,
    "tags": ["anxiety", "body_calming", "technique_preference", "section3"]
  }'::jsonb,
  15, 4, 'pencil', 'journal'
),

-- Node 22: Chest — Sleep Body Scan
(
  'b1110000-aaaa-4000-8000-000000000022',
  'b1100000-aaaa-4000-8000-000000000003',
  6, 'chest', 'anxiety_s3_chest1',
  '[{"type": "xp", "amount": 5, "icon": "⚡"}, {"type": "gems", "amount": 10, "icon": "💎"}]'::jsonb,
  'Reward Chest',
  'A special reward for calming your body!',
  '{
    "reward_type": "audio",
    "reward_key": "sleep_body_scan",
    "reward_name": "Sleep Body Scan",
    "reward_description": "A 10-minute guided body scan meditation designed to help you drift off to sleep.",
    "rarity": "rare"
  }'::jsonb,
  5, 1, 'gift', 'chest'
);

-- --------------------------------------------------------------------------
-- 6. Insert nodes — Section 4: Your Anxiety Action Plan (6 nodes)
-- --------------------------------------------------------------------------
INSERT INTO journey_template_nodes (
  id, unit_id, node_index, node_type, task_id, rewards,
  title, description, content, xp_reward, estimated_minutes, icon_key, variant_key
) VALUES

-- Node 23: Mood Check
(
  'b1110000-aaaa-4000-8000-000000000023',
  'b1100000-aaaa-4000-8000-000000000004',
  0, 'mood_check', 'anxiety_s4_mood1',
  '[{"type": "xp", "amount": 5, "icon": "⚡"}]'::jsonb,
  'Mood Check-In',
  'Final section! How are you feeling?',
  '{
    "prompt": "As we head into the final section, how anxious do you feel?",
    "scale": 5,
    "note_enabled": true,
    "labels": ["Not at all", "A little", "Moderate", "Quite a bit", "Extremely"]
  }'::jsonb,
  5, 1, 'mirror', 'mood_check'
),

-- Node 24: Learn — Building Your Coping Toolkit
(
  'b1110000-aaaa-4000-8000-000000000024',
  'b1100000-aaaa-4000-8000-000000000004',
  1, 'learn', 'anxiety_s4_learn1',
  '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb,
  'Your Coping Toolkit',
  'You''ve learned several techniques — now build your personal plan.',
  '{
    "cards": [
      {
        "text": "Over this journey, you''ve learned thought skills (spot traps, thought records) and body skills (grounding, breathing, PMR). That''s a real toolkit.",
        "visual_key": "toolkit_overview"
      },
      {
        "text": "Not every technique works for every person or situation. The key is knowing YOUR go-to moves.",
        "visual_key": "personal_toolkit"
      },
      {
        "text": "Think of it like a first-aid kit: you want 2-3 quick techniques for in-the-moment anxiety, and 1-2 deeper techniques for when you have more time.",
        "visual_key": "first_aid"
      },
      {
        "text": "Key Takeaway: Your anxiety emergency plan should have quick relief tools AND deeper techniques. You''ll build yours next.",
        "visual_key": "summary_plan"
      }
    ]
  }'::jsonb,
  10, 2, 'book-open', 'learn'
),

-- Node 25: Exercise — Build Your Emergency Plan
(
  'b1110000-aaaa-4000-8000-000000000025',
  'b1100000-aaaa-4000-8000-000000000004',
  2, 'exercise', 'anxiety_s4_exercise1',
  '[{"type": "xp", "amount": 20, "icon": "⚡"}]'::jsonb,
  'Build Your Emergency Plan',
  'Choose your top techniques and create a plan.',
  '{
    "steps": [
      {
        "prompt": "When anxiety hits HARD and fast (panic level), which quick technique will you reach for first?",
        "input_type": "multi_choice",
        "options": ["Box Breathing (4-4-4-4)", "5-4-3-2-1 Grounding", "Cold water on face/wrists", "10 jumping jacks", "STOP technique (Stop, Take a breath, Observe, Proceed)"],
        "allow_multiple": true,
        "min_selections": 1
      },
      {
        "prompt": "When you have a few minutes to work through anxious THOUGHTS, which technique will you use?",
        "input_type": "multi_choice",
        "options": ["Thought Record", "Name the Thinking Trap", "Ask: What would I tell a friend?", "Write in journal", "Evidence For vs Against check"],
        "allow_multiple": true,
        "min_selections": 1
      },
      {
        "prompt": "When you have more time (10+ minutes) for deeper relaxation, what will you do?",
        "input_type": "multi_choice",
        "options": ["Progressive Muscle Relaxation", "Guided meditation", "Journaling about the anxiety", "Go for a walk", "Sleep Body Scan"],
        "allow_multiple": true,
        "min_selections": 1
      },
      {
        "prompt": "Who is one person you can reach out to when anxiety feels overwhelming?",
        "input_type": "text",
        "placeholder": "A friend, family member, therapist, helpline..."
      },
      {
        "prompt": "Write one kind thing you''d say to yourself during an anxious moment.",
        "input_type": "text",
        "placeholder": "e.g., This feeling will pass. I have tools to handle this."
      }
    ]
  }'::jsonb,
  20, 5, 'dumbbell', 'exercise'
),

-- Node 26: Practice — Apply toolkit to a scenario
(
  'b1110000-aaaa-4000-8000-000000000026',
  'b1100000-aaaa-4000-8000-000000000004',
  3, 'exercise', 'anxiety_s4_practice1',
  '[{"type": "xp", "amount": 20, "icon": "⚡"}]'::jsonb,
  'Practice: Apply Your Toolkit',
  'Use your new skills on a realistic scenario.',
  '{
    "steps": [
      {
        "prompt": "Scenario: You''re about to walk into a job interview. Your heart is racing, your palms are sweating, and your mind says ''You''re going to blow this.''\n\nFirst: What thinking trap is your mind using?",
        "input_type": "multi_choice",
        "options": ["Catastrophizing", "Fortune Telling", "Mind Reading", "All-or-Nothing", "Emotional Reasoning"],
        "correct_index": 1,
        "explanation": "''You''re going to blow this'' is fortune telling — predicting a negative outcome with certainty."
      },
      {
        "prompt": "Now challenge the thought. Write a balanced alternative to ''You''re going to blow this.''",
        "input_type": "text",
        "placeholder": "e.g., I''m nervous, which is normal. I prepared for this..."
      },
      {
        "prompt": "Your body is in fight-or-flight mode. Which quick technique from your plan would you use right now?",
        "input_type": "multi_choice",
        "options": ["Box Breathing", "5-4-3-2-1 Grounding", "Cold water on wrists", "STOP technique"],
        "allow_multiple": false
      },
      {
        "prompt": "Take 30 seconds to actually DO that technique right now. Then describe how you feel.",
        "input_type": "text",
        "placeholder": "I feel..."
      }
    ]
  }'::jsonb,
  20, 5, 'dumbbell', 'exercise'
),

-- Node 27: Mood Check — Final comparison
(
  'b1110000-aaaa-4000-8000-000000000027',
  'b1100000-aaaa-4000-8000-000000000004',
  4, 'mood_check', 'anxiety_s4_mood_final',
  '[{"type": "xp", "amount": 5, "icon": "⚡"}]'::jsonb,
  'Final Mood Check',
  'How anxious do you feel now compared to when you started?',
  '{
    "prompt": "You''ve completed the Anxiety Toolkit journey! How anxious do you feel right now?",
    "scale": 5,
    "note_enabled": true,
    "labels": ["Not at all", "A little", "Moderate", "Quite a bit", "Extremely"],
    "comparison_note": "Think back to your very first mood check on Day 1. Has anything shifted?"
  }'::jsonb,
  5, 1, 'mirror', 'mood_check'
),

-- Node 28: Checkpoint — Journey Complete!
(
  'b1110000-aaaa-4000-8000-000000000028',
  'b1100000-aaaa-4000-8000-000000000004',
  5, 'checkpoint', 'anxiety_s4_checkpoint_final',
  '[{"type": "xp", "amount": 100, "icon": "⚡"}, {"type": "gems", "amount": 25, "icon": "💎"}]'::jsonb,
  'Journey Complete!',
  'You''ve finished the Anxiety Toolkit! Celebrate your growth.',
  '{
    "badge_key": "anxiety_toolkit_complete",
    "badge_name": "Anxiety Warrior",
    "badge_description": "You completed the entire Anxiety Toolkit journey and built your personal coping plan.",
    "skills_recap": [
      "Understand how anxiety works (the alarm system and the cycle)",
      "Identify the top 5 anxiety thinking traps",
      "Complete a Thought Record to challenge anxious thoughts",
      "Use 5-4-3-2-1 Grounding when anxiety spikes",
      "Practice Box Breathing for quick calm",
      "Progressive Muscle Relaxation for deeper relaxation",
      "Built your personal Anxiety Emergency Plan"
    ],
    "show_mood_comparison": true,
    "is_journey_complete": true,
    "next_journey_suggestion": {
      "slug": "mood-lifter",
      "title": "Mood Lifter",
      "reason": "Now that you have anxiety tools, learn techniques to boost your overall mood."
    }
  }'::jsonb,
  100, 2, 'star', 'checkpoint'
);

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
