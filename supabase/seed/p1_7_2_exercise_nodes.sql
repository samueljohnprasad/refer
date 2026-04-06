-- ============================================================================
-- P1.7.2 — Exercise Node Content Authoring
-- "Anxiety Toolkit" journey — all Exercise nodes with step content JSONB
--
-- Each exercise uses ExerciseContent { steps, exercise_type?, breathing_config?, body_scan_config? }
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. "Map Your Personal Anxiety Cycle" — 4 steps (text inputs)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "steps": [
    {
      "prompt": "Think of a recent moment when you felt anxious. What triggered it? Describe the situation briefly.",
      "input_type": "text",
      "placeholder": "e.g. I had to speak up in a team meeting…"
    },
    {
      "prompt": "What thought popped into your head? Write the exact words your brain said.",
      "input_type": "text",
      "placeholder": "e.g. Everyone will think I''m stupid…"
    },
    {
      "prompt": "What did you feel in your body? Choose or describe the physical sensations.",
      "input_type": "text",
      "placeholder": "e.g. Racing heart, sweaty palms, tight chest…"
    },
    {
      "prompt": "What did you do (or avoid doing) because of that feeling?",
      "input_type": "text",
      "placeholder": "e.g. I stayed quiet and didn''t share my idea…"
    }
  ],
  "exercise_type": "standard"
}'::jsonb,
title = 'Map Your Personal Anxiety Cycle',
description = 'Trace your own trigger → thought → feeling → behavior cycle.',
xp_reward = 15,
estimated_minutes = 5,
variant_key = 'exercise'
WHERE task_id = 'exercise_map_cycle'
  AND node_type = 'exercise';

-- --------------------------------------------------------------------------
-- 2. "Spot the Distortion" — 5 scenario screens (multi_choice)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "steps": [
    {
      "prompt": "Your friend cancels dinner plans. You think: ''They must be avoiding me because I''m boring.'' Which thinking trap is this?",
      "input_type": "multi_choice",
      "options": ["Catastrophizing", "Mind Reading", "Overgeneralizing", "Labeling"],
      "correct_index": 1,
      "explanation": "This is Mind Reading — assuming you know what someone else is thinking without evidence. They could be tired, busy, or sick!"
    },
    {
      "prompt": "You make one mistake in a presentation. You think: ''That was a complete disaster.'' Which distortion?",
      "input_type": "multi_choice",
      "options": ["All-or-Nothing Thinking", "Fortune Telling", "Should Statements", "Emotional Reasoning"],
      "correct_index": 0,
      "explanation": "All-or-Nothing Thinking sees things in black and white. One mistake doesn''t make the whole thing a disaster."
    },
    {
      "prompt": "Before a job interview, you think: ''I just know I''m going to bomb this.'' Which trap?",
      "input_type": "multi_choice",
      "options": ["Labeling", "Catastrophizing", "Fortune Telling", "Overgeneralizing"],
      "correct_index": 2,
      "explanation": "Fortune Telling is predicting the future with certainty. You''re not a psychic — you''re anxious. The interview hasn''t happened yet!"
    },
    {
      "prompt": "You feel nervous at a party. You think: ''I feel awkward, so everyone must see how awkward I am.'' Which distortion?",
      "input_type": "multi_choice",
      "options": ["Mind Reading", "Emotional Reasoning", "Should Statements", "Catastrophizing"],
      "correct_index": 1,
      "explanation": "Emotional Reasoning: ''I feel it, therefore it''s true.'' Feeling awkward doesn''t mean you look awkward. Feelings are data, not facts."
    },
    {
      "prompt": "You forgot to reply to an email. You think: ''I''m so irresponsible. I always mess things up.'' Which traps? (There are two!)",
      "input_type": "multi_choice",
      "options": ["Labeling + Overgeneralizing", "Fortune Telling + Mind Reading", "Catastrophizing + Should Statements", "Emotional Reasoning + Labeling"],
      "correct_index": 0,
      "explanation": "Labeling (''I''m irresponsible'') puts a permanent identity on a single event, and Overgeneralizing (''I always'') turns one instance into a pattern."
    }
  ],
  "exercise_type": "standard"
}'::jsonb,
title = 'Spot the Distortion',
description = 'Can you name the thinking trap in each scenario?',
xp_reward = 15,
estimated_minutes = 5,
variant_key = 'exercise'
WHERE task_id = 'exercise_spot_distortion'
  AND node_type = 'exercise';

-- --------------------------------------------------------------------------
-- 3. "Thought Record — A Real Worry" — 7 steps (CBT guide §4.1 exact flow)
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "steps": [
    {
      "prompt": "Describe the situation that triggered your worry. Where were you? What happened?",
      "input_type": "text",
      "placeholder": "e.g. I was lying in bed at night thinking about tomorrow…"
    },
    {
      "prompt": "What was the automatic thought? Write the exact sentence your brain produced.",
      "input_type": "text",
      "placeholder": "e.g. I''m going to embarrass myself at the meeting…"
    },
    {
      "prompt": "How strongly do you believe this thought right now? (0 = not at all, 100 = completely)",
      "input_type": "slider",
      "min": 0,
      "max": 100,
      "step": 5,
      "label_min": "Not at all",
      "label_max": "Completely"
    },
    {
      "prompt": "What emotions did this thought create? Rate the intensity. (0 = none, 100 = overwhelming)",
      "input_type": "slider",
      "min": 0,
      "max": 100,
      "step": 5,
      "label_min": "None",
      "label_max": "Overwhelming"
    },
    {
      "prompt": "What evidence supports this thought? Be honest — only facts, not feelings.",
      "input_type": "text",
      "placeholder": "e.g. I did stumble over my words last time…"
    },
    {
      "prompt": "What evidence goes against this thought? Think of times things went fine, or facts that contradict the worry.",
      "input_type": "text",
      "placeholder": "e.g. My manager said my last presentation was good…"
    },
    {
      "prompt": "Now rewrite the thought in a more balanced way. What would you say to a friend who had this worry?",
      "input_type": "text",
      "placeholder": "e.g. I might be a bit nervous, but I usually do fine once I start…"
    }
  ],
  "exercise_type": "standard"
}'::jsonb,
title = 'Thought Record — A Real Worry',
description = 'Walk through a full CBT thought record with one of your real worries.',
xp_reward = 20,
estimated_minutes = 8,
variant_key = 'exercise'
WHERE task_id = 'exercise_thought_record'
  AND node_type = 'exercise';

-- --------------------------------------------------------------------------
-- 4. "5-4-3-2-1 Grounding" — 5 steps with haptic config
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "steps": [
    {
      "prompt": "Look around and name 5 things you can SEE right now. Say them out loud or type them.",
      "input_type": "text",
      "placeholder": "e.g. lamp, window, my hands, a book, the ceiling…",
      "haptic": "light"
    },
    {
      "prompt": "Name 4 things you can TOUCH. Reach out and feel each one.",
      "input_type": "text",
      "placeholder": "e.g. smooth phone screen, soft blanket, cool desk…",
      "haptic": "light"
    },
    {
      "prompt": "Name 3 things you can HEAR right now. Close your eyes for a moment and listen.",
      "input_type": "text",
      "placeholder": "e.g. fan humming, birds outside, my breathing…",
      "haptic": "medium"
    },
    {
      "prompt": "Name 2 things you can SMELL. Take a deep sniff.",
      "input_type": "text",
      "placeholder": "e.g. coffee, fresh air…",
      "haptic": "medium"
    },
    {
      "prompt": "Name 1 thing you can TASTE right now.",
      "input_type": "text",
      "placeholder": "e.g. toothpaste, tea, nothing specific…",
      "haptic": "heavy"
    }
  ],
  "exercise_type": "grounding"
}'::jsonb,
title = '5-4-3-2-1 Grounding',
description = 'Use your five senses to anchor yourself in the present moment.',
xp_reward = 15,
estimated_minutes = 4,
variant_key = 'exercise'
WHERE task_id = 'exercise_54321_grounding'
  AND node_type = 'exercise';

-- --------------------------------------------------------------------------
-- 5. "Box Breathing 4-4-4-4" — breathing animation config
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "steps": [],
  "exercise_type": "breathing",
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
title = 'Box Breathing 4-4-4-4',
description = 'Four rounds of box breathing to calm your nervous system.',
xp_reward = 15,
estimated_minutes = 4,
variant_key = 'exercise'
WHERE task_id = 'exercise_box_breathing'
  AND node_type = 'exercise';

-- --------------------------------------------------------------------------
-- 6. "Progressive Muscle Relaxation" — 10 body areas
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "steps": [],
  "exercise_type": "body_scan",
  "body_scan_config": {
    "areas": [
      { "name": "Hands", "tense_seconds": 5, "release_seconds": 10, "instruction": "Make tight fists. Squeeze hard for 5 seconds, then release and feel the warmth." },
      { "name": "Forearms", "tense_seconds": 5, "release_seconds": 10, "instruction": "Bend your wrists back, tensing your forearms. Hold, then let go completely." },
      { "name": "Upper Arms", "tense_seconds": 5, "release_seconds": 10, "instruction": "Flex your biceps like a bodybuilder. Hold the tension, then relax." },
      { "name": "Shoulders", "tense_seconds": 5, "release_seconds": 10, "instruction": "Shrug your shoulders up to your ears. Hold, then drop them down." },
      { "name": "Neck", "tense_seconds": 5, "release_seconds": 10, "instruction": "Gently press your head back against an imaginary wall. Hold, then release." },
      { "name": "Face", "tense_seconds": 5, "release_seconds": 10, "instruction": "Scrunch your entire face — eyes, nose, mouth. Hold, then relax and let your jaw drop." },
      { "name": "Chest", "tense_seconds": 5, "release_seconds": 10, "instruction": "Take a deep breath and hold it, tensing your chest. Then exhale slowly." },
      { "name": "Stomach", "tense_seconds": 5, "release_seconds": 10, "instruction": "Tighten your stomach muscles like bracing for impact. Hold, then release." },
      { "name": "Legs", "tense_seconds": 5, "release_seconds": 10, "instruction": "Press your thighs together and tense your legs. Hold, then let them go heavy." },
      { "name": "Feet", "tense_seconds": 5, "release_seconds": 10, "instruction": "Curl your toes tightly. Hold the tension, then spread them wide and relax." }
    ]
  }
}'::jsonb,
title = 'Progressive Muscle Relaxation',
description = 'Tense and release 10 muscle groups to melt away physical tension.',
xp_reward = 20,
estimated_minutes = 10,
variant_key = 'exercise'
WHERE task_id = 'exercise_pmr'
  AND node_type = 'exercise';

-- --------------------------------------------------------------------------
-- 7. "Build Your Anxiety Emergency Plan" — picker step
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "steps": [
    {
      "prompt": "When anxiety spikes, having a plan removes the need to think. Pick your top 3 go-to techniques from what you''ve learned.",
      "input_type": "picker",
      "options": [
        "Box Breathing",
        "5-4-3-2-1 Grounding",
        "Progressive Muscle Relaxation",
        "Thought Record",
        "Spot the Distortion",
        "Talk to a friend",
        "Go for a walk",
        "Journal about it",
        "Listen to calming music"
      ],
      "min_selections": 3,
      "allow_multiple": true
    },
    {
      "prompt": "Step 1 — what do you do FIRST when you notice anxiety rising? (The fastest calming tool)",
      "input_type": "text",
      "placeholder": "e.g. 3 rounds of box breathing to slow down…"
    },
    {
      "prompt": "Step 2 — once you''re a bit calmer, what do you do next? (The thinking tool)",
      "input_type": "text",
      "placeholder": "e.g. Ask myself: what distortion am I caught in?…"
    },
    {
      "prompt": "Step 3 — what''s your action step? (What behavior replaces avoidance?)",
      "input_type": "text",
      "placeholder": "e.g. Do the thing I''m avoiding for just 2 minutes…"
    }
  ],
  "exercise_type": "standard"
}'::jsonb,
title = 'Build Your Anxiety Emergency Plan',
description = 'Create your personal 3-step plan for when anxiety spikes.',
xp_reward = 20,
estimated_minutes = 5,
variant_key = 'exercise'
WHERE task_id = 'exercise_emergency_plan'
  AND node_type = 'exercise';

-- --------------------------------------------------------------------------
-- 8. "Apply Toolkit to Scenario" — scenario + multi-step application
-- --------------------------------------------------------------------------
UPDATE journey_template_nodes
SET content = '{
  "steps": [
    {
      "prompt": "Read this scenario:\n\nYou have a big presentation at work tomorrow. As you''re preparing, your mind starts racing: ''What if I freeze up? What if my slides have errors? Everyone will think I''m incompetent.''\n\nYour heart is pounding, palms are sweaty, and you''re seriously considering calling in sick.",
      "input_type": "text",
      "placeholder": "Take a moment to read, then describe what you notice…"
    },
    {
      "prompt": "STEP 1 — BODY: Which body calming technique would you use right now?",
      "input_type": "multi_choice",
      "options": ["Box Breathing", "5-4-3-2-1 Grounding", "Progressive Muscle Relaxation", "Deep belly breathing"],
      "correct_index": 0,
      "explanation": "Any of these would work! Box Breathing is a great first choice because it''s fast (under 2 minutes) and you can do it anywhere."
    },
    {
      "prompt": "STEP 2 — THOUGHTS: Identify the distortions in ''What if I freeze up? Everyone will think I''m incompetent.''",
      "input_type": "multi_choice",
      "options": ["Fortune Telling + Mind Reading", "Labeling + Overgeneralizing", "Catastrophizing + Should Statements", "Emotional Reasoning + All-or-Nothing"],
      "correct_index": 0,
      "explanation": "Fortune Telling (predicting you''ll freeze) and Mind Reading (assuming everyone will judge you). Two traps, one sentence!"
    },
    {
      "prompt": "STEP 3 — REFRAME: Rewrite the anxious thought in a more balanced way.",
      "input_type": "text",
      "placeholder": "e.g. I''ve prepared well. I might be nervous, but I usually find my flow once I start…"
    },
    {
      "prompt": "STEP 4 — ACTION: Instead of calling in sick, what''s one small action you could take tonight to feel more prepared?",
      "input_type": "text",
      "placeholder": "e.g. Do one practice run-through of my key slides…"
    }
  ],
  "exercise_type": "standard"
}'::jsonb,
title = 'Apply Toolkit to Scenario',
description = 'Use all your tools on a realistic anxiety scenario.',
xp_reward = 20,
estimated_minutes = 7,
variant_key = 'exercise'
WHERE task_id = 'exercise_apply_toolkit'
  AND node_type = 'exercise';
