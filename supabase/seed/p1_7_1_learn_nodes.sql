-- ============================================================================
-- P1.7.1 — Learn Node Content Authoring
-- "Anxiety Toolkit" journey — all Learn nodes with card content JSONB
--
-- Rules: ≤40 words per card, friendly tone, no jargon, analogy-first
-- ============================================================================

-- We use a CTE to look up the journey + unit IDs so this seed is
-- portable across environments. Adjust the slug if needed.

-- --------------------------------------------------------------------------
-- 1. "What is Anxiety?" — 5 cards (Unit 1, Node 0)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "cards": [
    {
      "text": "Anxiety is your brain''s smoke alarm. It''s built to protect you — but sometimes it goes off when there''s no fire. That''s normal, and it''s fixable.",
      "visual_key": "smoke_alarm"
    },
    {
      "text": "Everyone experiences anxiety. It''s not a character flaw. Think of it like a volume knob — some people''s is turned up higher than others.",
      "visual_key": "volume_knob"
    },
    {
      "text": "Anxiety shows up in three places: your thoughts (''What if…''), your body (racing heart, tight chest), and your actions (avoiding things).",
      "visual_key": "three_channels"
    },
    {
      "text": "The good news? Each of those three channels is a lever you can learn to adjust. That''s what this journey teaches you.",
      "visual_key": "three_levers"
    },
    {
      "text": "You don''t need to eliminate anxiety — just turn the volume down to a useful level. Let''s start by understanding how it works.",
      "visual_key": "dial_down"
    }
  ]
}'::jsonb,
title = 'What is Anxiety?',
description = 'Understand what anxiety really is and why everyone has it.',
xp_reward = 10,
estimated_minutes = 3,
variant_key = 'learn'
WHERE task_id = 'learn_what_is_anxiety'
  AND node_type = 'learn';

-- --------------------------------------------------------------------------
-- 2. "The Anxiety Cycle" — 5 cards (Unit 1, Node 2)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "cards": [
    {
      "text": "Anxiety runs in a cycle — like three gears turning together. A thought triggers a feeling, the feeling drives a behavior, and the behavior feeds the thought.",
      "visual_key": "three_gears"
    },
    {
      "text": "Gear 1: Thoughts. ''I''m going to fail this meeting.'' Your brain predicts danger, even when evidence says otherwise. These are called ''cognitive distortions.''",
      "visual_key": "gear_thoughts"
    },
    {
      "text": "Gear 2: Feelings. That thought fires up your body — racing heart, sweaty palms, tight stomach. Your alarm system is now online.",
      "visual_key": "gear_feelings"
    },
    {
      "text": "Gear 3: Behaviors. To escape the feeling, you avoid, procrastinate, or seek reassurance. This feels better short-term but keeps the cycle spinning.",
      "visual_key": "gear_behaviors"
    },
    {
      "text": "The key insight: you can break the cycle at any gear. Change the thought, calm the body, or change the behavior. You''ll learn all three.",
      "visual_key": "break_cycle"
    }
  ]
}'::jsonb,
title = 'The Anxiety Cycle',
description = 'See how thoughts, feelings, and behaviors keep anxiety spinning.',
xp_reward = 10,
estimated_minutes = 3,
variant_key = 'learn'
WHERE task_id = 'learn_anxiety_cycle'
  AND node_type = 'learn';

-- --------------------------------------------------------------------------
-- 3. "Cognitive Distortions of Anxiety" — 5 cards (Unit 1, Node 4)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "cards": [
    {
      "text": "Cognitive distortions are thinking traps — patterns your brain falls into that make anxiety worse. They feel true, but they''re tricks of perspective.",
      "visual_key": "thinking_traps"
    },
    {
      "text": "Catastrophizing: jumping to the worst-case scenario. ''If I mess up this presentation, I''ll get fired and never find another job.'' The brain skips every middle step.",
      "visual_key": "catastrophizing"
    },
    {
      "text": "Fortune Telling: predicting the future with certainty. ''I just know this is going to go badly.'' But you''re not a psychic — you''re anxious.",
      "visual_key": "fortune_telling"
    },
    {
      "text": "Mind Reading: assuming you know what others think. ''They probably think I''m weird.'' In reality, most people are thinking about themselves.",
      "visual_key": "mind_reading"
    },
    {
      "text": "Recognizing the trap is the first step to escaping it. Next, you''ll learn to catch these patterns in your own thinking.",
      "visual_key": "escape_trap"
    }
  ]
}'::jsonb,
title = 'Cognitive Distortions of Anxiety',
description = 'Learn the three most common thinking traps anxiety uses.',
xp_reward = 10,
estimated_minutes = 3,
variant_key = 'learn'
WHERE task_id = 'learn_cognitive_distortions'
  AND node_type = 'learn';

-- --------------------------------------------------------------------------
-- 4. "Top 5 Anxiety Distortions" — 5 cards (Unit 2, Node 0)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "cards": [
    {
      "text": "All-or-Nothing Thinking: seeing things in black and white. ''If it''s not perfect, it''s a total failure.'' Life has a million shades of grey.",
      "visual_key": "black_white"
    },
    {
      "text": "Overgeneralizing: one bad event becomes ''always.'' ''I stuttered once, so I''m terrible at speaking.'' One data point isn''t a pattern.",
      "visual_key": "overgeneralizing"
    },
    {
      "text": "Should Statements: rigid rules you place on yourself. ''I should be over this by now.'' Shoulds create guilt. Try replacing with ''I''d like to.''",
      "visual_key": "should_statements"
    },
    {
      "text": "Emotional Reasoning: feeling it, therefore it''s true. ''I feel like a failure, so I must be one.'' Feelings are data, not facts.",
      "visual_key": "emotional_reasoning"
    },
    {
      "text": "Labeling: slapping a permanent identity on yourself. ''I''m a loser'' instead of ''I made a mistake.'' You are not your worst moment.",
      "visual_key": "labeling"
    }
  ]
}'::jsonb,
title = 'Top 5 Anxiety Distortions',
description = 'One card per distortion — spot them in your own thinking.',
xp_reward = 10,
estimated_minutes = 3,
variant_key = 'learn'
WHERE task_id = 'learn_top5_distortions'
  AND node_type = 'learn';

-- --------------------------------------------------------------------------
-- 5. "The Body-Mind Connection" — 4 cards (Unit 2)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "cards": [
    {
      "text": "Your body and mind are teammates, not opponents. When anxiety fires in your brain, your body gets the memo instantly — tight muscles, shallow breathing.",
      "visual_key": "body_mind_link"
    },
    {
      "text": "The trick? It works both ways. Calm the body and the mind follows. That''s why breathing exercises actually work — you''re sending a ''safe'' signal upstream.",
      "visual_key": "bidirectional"
    },
    {
      "text": "Your vagus nerve is the express lane between body and brain. Deep belly breathing activates it, switching you from ''fight-or-flight'' to ''rest-and-digest.''",
      "visual_key": "vagus_nerve"
    },
    {
      "text": "Coming up: you''ll try breathing, grounding, and muscle relaxation — three body-based tools that calm anxiety in under 5 minutes.",
      "visual_key": "three_body_tools"
    }
  ]
}'::jsonb,
title = 'The Body-Mind Connection',
description = 'How calming your body calms your mind.',
xp_reward = 10,
estimated_minutes = 2,
variant_key = 'learn'
WHERE task_id = 'learn_body_mind'
  AND node_type = 'learn';

-- --------------------------------------------------------------------------
-- 6. "Building Your Personal Coping Toolkit" — 4 cards (Unit 3)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "cards": [
    {
      "text": "You''ve now learned thought tools (catching distortions), body tools (breathing, grounding), and behavior tools (facing fears gradually). That''s your toolkit.",
      "visual_key": "toolkit_overview"
    },
    {
      "text": "Not every tool works for every situation. Box breathing is great for a panic moment. Thought records are better for recurring worries. Match tool to situation.",
      "visual_key": "match_tool"
    },
    {
      "text": "The best toolkit is personal. Some people swear by grounding; others prefer journaling. Pay attention to what clicks for you.",
      "visual_key": "personal_fit"
    },
    {
      "text": "Next up: you''ll build your own Emergency Plan — your go-to 3-step response for when anxiety spikes. Ready?",
      "visual_key": "emergency_plan"
    }
  ]
}'::jsonb,
title = 'Building Your Personal Coping Toolkit',
description = 'Combine everything into your personal anxiety toolkit.',
xp_reward = 10,
estimated_minutes = 2,
variant_key = 'learn'
WHERE task_id = 'learn_coping_toolkit'
  AND node_type = 'learn';
