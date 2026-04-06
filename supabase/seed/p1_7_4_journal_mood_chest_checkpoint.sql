-- ============================================================================
-- P1.7.4 — Journal + Mood Check + Chest + Checkpoint Content
-- "Anxiety Toolkit" journey — remaining node types
--
-- JSONB shapes:
-- JournalContent  { prompt, mood_before, mood_after, voice_enabled, tags? }
-- MoodCheckContent { prompt, scale, note_enabled, labels?, comparison_note? }
-- ChestContent     { reward_type, reward_key, reward_name, reward_description, rarity }
-- CheckpointContent { badge_key, badge_name, badge_description, skills_recap, show_mood_comparison, is_journey_complete?, next_journey_suggestion? }
-- ============================================================================

-- **************************************************************************
-- JOURNAL NODES (5)
-- **************************************************************************

-- --------------------------------------------------------------------------
-- Journal 1: "What Worry Lives in Your Head Right Now?"
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "Write about a worry that keeps coming back. Don''t filter or edit — just let the words out. What does this worry say to you? When does it show up most?",
  "mood_before": true,
  "mood_after": true,
  "voice_enabled": false,
  "tags": ["anxiety", "recurring_worry", "awareness"]
}'::jsonb,
title = 'What Worry Lives in Your Head Right Now?',
description = 'Get a recurring worry out of your head and onto the page.',
xp_reward = 10,
estimated_minutes = 5,
variant_key = 'journal'
WHERE task_id = 'journal_recurring_worry'
  AND node_type = 'journal';

-- --------------------------------------------------------------------------
-- Journal 2: "Letter to My Anxious Self"
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "Write a short letter to yourself during an anxious moment. What would you say to comfort yourself? What would a kind friend tell you?",
  "mood_before": true,
  "mood_after": true,
  "voice_enabled": false,
  "tags": ["self_compassion", "anxiety", "reframing"]
}'::jsonb,
title = 'Letter to My Anxious Self',
description = 'Write the words your anxious self needs to hear.',
xp_reward = 10,
estimated_minutes = 5,
variant_key = 'journal'
WHERE task_id = 'journal_letter_to_self'
  AND node_type = 'journal';

-- --------------------------------------------------------------------------
-- Journal 3: "Three Things That Went OK Today"
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "Anxiety makes us zoom in on what went wrong. Today, zoom out. Write three things that went OK — even small ones. A meal you enjoyed, a task you finished, a moment of calm.",
  "mood_before": false,
  "mood_after": true,
  "voice_enabled": false,
  "tags": ["gratitude", "positivity", "perspective"]
}'::jsonb,
title = 'Three Things That Went OK Today',
description = 'Counter the negativity bias by noticing what went right.',
xp_reward = 10,
estimated_minutes = 3,
variant_key = 'journal'
WHERE task_id = 'journal_three_ok_things'
  AND node_type = 'journal';

-- --------------------------------------------------------------------------
-- Journal 4: "What Would I Do If I Weren''t Afraid?"
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "If anxiety disappeared for one day, what would you do differently? Be specific — describe the day, the actions, the feelings. This isn''t fantasy; it''s a map of what matters to you.",
  "mood_before": true,
  "mood_after": true,
  "voice_enabled": false,
  "tags": ["values", "avoidance", "motivation"]
}'::jsonb,
title = 'What Would I Do If I Weren''t Afraid?',
description = 'Discover what anxiety has been keeping you from.',
xp_reward = 10,
estimated_minutes = 5,
variant_key = 'journal'
WHERE task_id = 'journal_without_fear'
  AND node_type = 'journal';

-- --------------------------------------------------------------------------
-- Journal 5: "My Anxiety Has Taught Me…"
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "Anxiety isn''t all bad — it often carries information. What has living with anxiety taught you? About yourself, about what you care about, about your strength?",
  "mood_before": false,
  "mood_after": true,
  "voice_enabled": false,
  "tags": ["reflection", "growth", "acceptance"]
}'::jsonb,
title = 'My Anxiety Has Taught Me…',
description = 'Find the hidden lessons in your experience with anxiety.',
xp_reward = 10,
estimated_minutes = 5,
variant_key = 'journal'
WHERE task_id = 'journal_anxiety_taught_me'
  AND node_type = 'journal';


-- **************************************************************************
-- MOOD CHECK NODES (5)
-- **************************************************************************

-- --------------------------------------------------------------------------
-- Mood Check 1: Beginning of journey (baseline)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "Before we begin — how anxious do you feel right now? There are no wrong answers.",
  "scale": 5,
  "note_enabled": true,
  "labels": ["Not at all", "A little", "Moderate", "Quite a bit", "Very much"]
}'::jsonb,
title = 'Baseline Mood Check',
description = 'Let''s see where you''re starting from.',
xp_reward = 5,
estimated_minutes = 1,
variant_key = 'mood_check'
WHERE task_id = 'mood_check_baseline'
  AND node_type = 'mood_check';

-- --------------------------------------------------------------------------
-- Mood Check 2: After learning about the anxiety cycle
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "Now that you understand the anxiety cycle — how does your anxiety feel compared to when you started?",
  "scale": 5,
  "note_enabled": true,
  "labels": ["Much less", "A bit less", "About the same", "A bit more", "Much more"],
  "comparison_note": "Compare with your baseline check-in at the start."
}'::jsonb,
title = 'Post-Learning Check-in',
description = 'How do you feel after understanding the cycle?',
xp_reward = 5,
estimated_minutes = 1,
variant_key = 'mood_check'
WHERE task_id = 'mood_check_post_learning'
  AND node_type = 'mood_check';

-- --------------------------------------------------------------------------
-- Mood Check 3: After first exercise (body tools)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "You just tried a body calming exercise. How does your body feel right now?",
  "scale": 5,
  "note_enabled": true,
  "labels": ["Very tense", "Somewhat tense", "Neutral", "Somewhat relaxed", "Very relaxed"]
}'::jsonb,
title = 'Post-Exercise Body Check',
description = 'Notice how your body feels after the exercise.',
xp_reward = 5,
estimated_minutes = 1,
variant_key = 'mood_check'
WHERE task_id = 'mood_check_post_exercise'
  AND node_type = 'mood_check';

-- --------------------------------------------------------------------------
-- Mood Check 4: Mid-journey check
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "You''re halfway through the Anxiety Toolkit. How confident do you feel about managing anxious moments?",
  "scale": 5,
  "note_enabled": true,
  "labels": ["Not confident", "Slightly", "Moderately", "Quite confident", "Very confident"]
}'::jsonb,
title = 'Mid-Journey Confidence Check',
description = 'How confident do you feel so far?',
xp_reward = 5,
estimated_minutes = 1,
variant_key = 'mood_check'
WHERE task_id = 'mood_check_mid_journey'
  AND node_type = 'mood_check';

-- --------------------------------------------------------------------------
-- Mood Check 5: End of journey (final comparison)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "prompt": "You''ve completed the Anxiety Toolkit! How anxious do you feel right now compared to when you started?",
  "scale": 5,
  "note_enabled": true,
  "labels": ["Not at all", "A little", "Moderate", "Quite a bit", "Very much"],
  "comparison_note": "We''ll show your progress compared to your baseline."
}'::jsonb,
title = 'Final Mood Check',
description = 'Let''s see how far you''ve come.',
xp_reward = 5,
estimated_minutes = 1,
variant_key = 'mood_check'
WHERE task_id = 'mood_check_final'
  AND node_type = 'mood_check';


-- **************************************************************************
-- CHEST NODES (2)
-- **************************************************************************

-- --------------------------------------------------------------------------
-- Chest 1: After completing Unit 1 (common rarity)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "reward_type": "prompt",
  "reward_key": "prompt_calm_morning",
  "reward_name": "Calm Morning Prompt",
  "reward_description": "A special guided journal prompt: ''Describe your ideal calm morning — engage all five senses.'' Use it anytime from your journal library.",
  "rarity": "common"
}'::jsonb,
title = 'Treasure Chest',
description = 'You unlocked a reward!',
xp_reward = 5,
estimated_minutes = 1,
variant_key = 'chest'
WHERE task_id = 'chest_unit1_reward'
  AND node_type = 'chest';

-- --------------------------------------------------------------------------
-- Chest 2: After completing Unit 2 (uncommon rarity)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "reward_type": "streak_freeze",
  "reward_key": "streak_freeze_1",
  "reward_name": "Streak Freeze ❄️",
  "reward_description": "You earned a Streak Freeze! It will automatically protect your streak if you miss a day. Find it in your streak settings.",
  "rarity": "uncommon"
}'::jsonb,
title = 'Treasure Chest',
description = 'You unlocked a special reward!',
xp_reward = 5,
estimated_minutes = 1,
variant_key = 'chest'
WHERE task_id = 'chest_unit2_reward'
  AND node_type = 'chest';


-- **************************************************************************
-- CHECKPOINT NODES (2)
-- **************************************************************************

-- --------------------------------------------------------------------------
-- Checkpoint 1: End of Unit 1 — "Anxiety Aware" badge
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "badge_key": "anxiety_aware",
  "badge_name": "Anxiety Aware",
  "badge_description": "You understand what anxiety is, how the cycle works, and can name the top thinking traps. That''s a huge first step.",
  "skills_recap": [
    "What anxiety really is (smoke alarm analogy)",
    "The 3-gear anxiety cycle (thoughts → feelings → behaviors)",
    "Catastrophizing, Fortune Telling, and Mind Reading distortions",
    "Breaking the cycle at any gear"
  ],
  "show_mood_comparison": true,
  "is_journey_complete": false
}'::jsonb,
title = 'Section Complete: Anxiety Aware',
description = 'You completed the Understanding Anxiety section!',
xp_reward = 25,
estimated_minutes = 2,
variant_key = 'checkpoint'
WHERE task_id = 'checkpoint_unit1'
  AND node_type = 'checkpoint';

-- --------------------------------------------------------------------------
-- Checkpoint 2: End of journey — "Anxiety Toolkit Master" badge
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "badge_key": "anxiety_toolkit_master",
  "badge_name": "Anxiety Toolkit Master",
  "badge_description": "You''ve completed the full Anxiety Toolkit — thought tools, body tools, and your personal emergency plan. You''re equipped to face anxious moments with confidence.",
  "skills_recap": [
    "Identifying all 5 major cognitive distortions",
    "Completing a full CBT Thought Record",
    "Box Breathing and 5-4-3-2-1 Grounding",
    "Progressive Muscle Relaxation",
    "Your personal 3-step Anxiety Emergency Plan",
    "Applying the full toolkit to real scenarios"
  ],
  "show_mood_comparison": true,
  "is_journey_complete": true,
  "next_journey_suggestion": {
    "slug": "mood-booster",
    "title": "Mood Booster",
    "reason": "Now that you''ve mastered anxiety tools, try the Mood Booster journey to build positive habits and resilience."
  }
}'::jsonb,
title = 'Journey Complete: Anxiety Toolkit Master',
description = 'You completed the entire Anxiety Toolkit journey!',
xp_reward = 50,
estimated_minutes = 3,
variant_key = 'checkpoint'
WHERE task_id = 'checkpoint_journey_complete'
  AND node_type = 'checkpoint';
