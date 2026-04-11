-- ============================================================================
-- Refine "Mood Reset" Journey
-- Upgrades the mood journey to a more intentional unit shape:
-- - core units: 4 nodes
-- - standard units: 3 nodes
-- - wrap-up units: 2 nodes
--
-- This migration assumes there is no live user progress yet for `mood-reset`.
-- If enrollments already exist, fail loudly instead of reshaping content under
-- active users.
-- ============================================================================

DO $$
DECLARE
  v_journey_id UUID := 'c1000000-aaaa-4000-8000-000000000001';
  v_section_1_id UUID := 'c2000000-aaaa-4000-8000-000000000001';
  v_section_2_id UUID := 'c2000000-aaaa-4000-8000-000000000002';
  v_section_3_id UUID := 'c2000000-aaaa-4000-8000-000000000003';
  v_section_4_id UUID := 'c2000000-aaaa-4000-8000-000000000004';
BEGIN
  IF EXISTS (
    SELECT 1
    FROM user_journey_enrollments e
    JOIN journey_templates jt ON jt.id = e.journey_id
    WHERE jt.slug = 'mood-reset'
  ) THEN
    RAISE EXCEPTION 'Cannot refine mood-reset after enrollments already exist. Create a versioned template or migrate user progress explicitly.';
  END IF;

  INSERT INTO journey_templates (
    id, slug, title, description, icon_url, color_scheme, sort_order, is_active, version,
    category, difficulty, estimated_days, total_nodes, color_theme_key, icon_key
  ) VALUES (
    v_journey_id,
    'mood-reset',
    'Mood Reset',
    'Understand how your mood works, what shapes it, and which CBT-informed tools can help you shift it. Build steadier days through awareness, action, and reflection.',
    NULL,
    'green',
    2,
    true,
    3,
    'mood',
    'beginner',
    14,
    36,
    'green',
    'sparkles'
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    color_scheme = EXCLUDED.color_scheme,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    version = EXCLUDED.version,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_days = EXCLUDED.estimated_days,
    total_nodes = EXCLUDED.total_nodes,
    color_theme_key = EXCLUDED.color_theme_key,
    icon_key = EXCLUDED.icon_key;

  INSERT INTO journey_template_sections (
    id, journey_id, section_number, title, description, color_scheme, mascot_placements, unlock_rule
  ) VALUES
    (
      v_section_1_id,
      v_journey_id,
      1,
      'Understand Your Mood',
      'Start with the basics. Learn what mood is, how it changes, and how it shows up in your thoughts, body, and behavior.',
      'green',
      '[{"afterNodeIndex": 1, "position": "right", "message": "The more clearly you notice it, the less mysterious it feels."}]'::jsonb,
      'sequential'
    ),
    (
      v_section_2_id,
      v_journey_id,
      2,
      'Find What Shapes It',
      'See what pulls mood down, from thoughts and avoidance to sleep, energy, and environment.',
      'purple',
      '[{"afterNodeIndex": 1, "position": "left", "message": "Mood is shaped by patterns, not just willpower."}]'::jsonb,
      'sequential'
    ),
    (
      v_section_3_id,
      v_journey_id,
      3,
      'Shift The Cycle',
      'Practice small CBT-informed actions that change energy, thinking, and connection.',
      'blue',
      '[{"afterNodeIndex": 1, "position": "right", "message": "You do not need a big breakthrough. Small shifts count."}]'::jsonb,
      'sequential'
    ),
    (
      v_section_4_id,
      v_journey_id,
      4,
      'Keep The Change Going',
      'Strengthen the habits and supports that help your mood feel steadier over time.',
      'orange',
      '[{"afterNodeIndex": 1, "position": "left", "message": "Keep the tools that truly help, and let the rest go."}]'::jsonb,
      'sequential'
    )
  ON CONFLICT (journey_id, section_number) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    color_scheme = EXCLUDED.color_scheme,
    mascot_placements = EXCLUDED.mascot_placements,
    unlock_rule = EXCLUDED.unlock_rule;

  INSERT INTO journey_template_units (
    id, journey_id, section_id, unit_number, section_unit_number,
    title, description, color_scheme, mascot_placements, unlock_rule
  ) VALUES
    ('c3000000-aaaa-4000-8000-000000000001', v_journey_id, v_section_1_id, 1, 1, 'Check In Clearly', 'Start with simple awareness. Notice mood without rushing to fix it.', 'green', '[{"afterNodeIndex": 1, "position": "right", "message": "Clear naming is a strong first step."}]'::jsonb, 'sequential'),
    ('c3000000-aaaa-4000-8000-000000000002', v_journey_id, v_section_1_id, 2, 2, 'Track The Pattern', 'Learn when mood tends to dip, lift, or stay flat across a normal day.', 'blue', '[{"afterNodeIndex": 1, "position": "left", "message": "Patterns make mood easier to work with."}]'::jsonb, 'sequential'),
    ('c3000000-aaaa-4000-8000-000000000003', v_journey_id, v_section_1_id, 3, 3, 'Understand The Mood Loop', 'See how thoughts, body sensations, and actions keep a mood going.', 'purple', '[{"afterNodeIndex": 1, "position": "right", "message": "Once you see the loop, you can start changing it."}]'::jsonb, 'sequential'),

    ('c3000000-aaaa-4000-8000-000000000004', v_journey_id, v_section_2_id, 4, 1, 'Catch Mood Thoughts', 'Notice the stories your mind tells when your mood drops.', 'purple', '[{"afterNodeIndex": 1, "position": "left", "message": "Thoughts shape mood, even when they feel automatic."}]'::jsonb, 'sequential'),
    ('c3000000-aaaa-4000-8000-000000000005', v_journey_id, v_section_2_id, 5, 2, 'See Your Mood Drains', 'Find the habits, routines, and surroundings that quietly pull your mood down.', 'blue', '[{"afterNodeIndex": 1, "position": "right", "message": "Small drains add up. Small supports do too."}]'::jsonb, 'sequential'),
    ('c3000000-aaaa-4000-8000-000000000006', v_journey_id, v_section_2_id, 6, 3, 'Step Out Of Avoidance', 'Learn why withdrawing and postponing often keep low mood in place.', 'orange', '[{"afterNodeIndex": 1, "position": "left", "message": "Approach beats avoidance when the step is small enough."}]'::jsonb, 'sequential'),

    ('c3000000-aaaa-4000-8000-000000000007', v_journey_id, v_section_3_id, 7, 1, 'Build Small Energy', 'Use tiny actions to create movement when energy is low.', 'blue', '[{"afterNodeIndex": 1, "position": "right", "message": "Mood often changes after the action, not before it."}]'::jsonb, 'sequential'),
    ('c3000000-aaaa-4000-8000-000000000008', v_journey_id, v_section_3_id, 8, 2, 'Shift Unhelpful Thoughts', 'Practice writing thoughts that are more balanced and believable.', 'green', '[{"afterNodeIndex": 1, "position": "left", "message": "Balanced is better than fake-positive."}]'::jsonb, 'sequential'),
    ('c3000000-aaaa-4000-8000-000000000009', v_journey_id, v_section_3_id, 9, 3, 'Reconnect With Life', 'Use warmth, meaning, and contact to interrupt low-mood isolation.', 'purple', '[{"afterNodeIndex": 1, "position": "right", "message": "Reconnection can begin with one small step."}]'::jsonb, 'sequential'),

    ('c3000000-aaaa-4000-8000-000000000010', v_journey_id, v_section_4_id, 10, 1, 'Protect Your Baseline', 'Strengthen the basics that make mood dips less intense and less frequent.', 'orange', '[{"afterNodeIndex": 1, "position": "left", "message": "The basics matter more than they seem."}]'::jsonb, 'sequential'),
    ('c3000000-aaaa-4000-8000-000000000011', v_journey_id, v_section_4_id, 11, 2, 'Catch The Dip Earlier', 'Notice the earliest signs that your mood is sliding so you can respond sooner.', 'blue', '[{"afterNodeIndex": 1, "position": "right", "message": "Earlier is usually easier."}]'::jsonb, 'sequential'),
    ('c3000000-aaaa-4000-8000-000000000012', v_journey_id, v_section_4_id, 12, 3, 'Keep What Helps', 'Finish by collecting the tools and supports that are genuinely useful to you.', 'purple', '[{"afterNodeIndex": 1, "position": "left", "message": "You are keeping what works, not forcing what does not."}]'::jsonb, 'sequential')
  ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    unit_number = EXCLUDED.unit_number,
    section_unit_number = EXCLUDED.section_unit_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    color_scheme = EXCLUDED.color_scheme,
    mascot_placements = EXCLUDED.mascot_placements,
    unlock_rule = EXCLUDED.unlock_rule;

  DELETE FROM journey_template_nodes
  WHERE unit_id IN (
    SELECT id
    FROM journey_template_units
    WHERE journey_id = v_journey_id
  );

  INSERT INTO journey_template_nodes (
    id, unit_id, node_index, node_type, task_id, rewards,
    title, description, content, xp_reward, estimated_minutes, icon_key, variant_key
  ) VALUES
    ('c4000000-aaaa-4000-8000-000000000001', 'c3000000-aaaa-4000-8000-000000000001', 0, 'mood_check', 'mood_s1_u1_checkin', '[{"type":"xp","amount":5,"icon":"⚡"}]'::jsonb, 'How is your mood right now?', 'Start by noticing your current emotional state.', $json${"prompt":"How would you describe your mood right now?","scale":5,"note_enabled":true,"labels":["Very low","Low","Flat","Okay","Good"]}$json$::jsonb, 5, 1, 'mirror', 'mood_check'),
    ('c4000000-aaaa-4000-8000-000000000002', 'c3000000-aaaa-4000-8000-000000000001', 1, 'learn', 'mood_s1_u1_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Mood Is A Signal', 'Learn what mood tells you about your current state.', $json${"cards":[{"text":"Mood is not a verdict on who you are. It is information about your current state, energy, and context.","visual_key":"mood_signal"},{"text":"Low mood often narrows attention. You notice what feels heavy and miss what is still workable.","visual_key":"narrow_attention"},{"text":"When you can name your mood clearly, you create a little distance between the feeling and your identity.","visual_key":"name_the_feeling"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000003', 'c3000000-aaaa-4000-8000-000000000001', 2, 'journal', 'mood_s1_u1_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Name What Is Here', 'Write down what your mood feels like without trying to solve it yet.', $json${"prompt":"What does your mood feel like right now? Name the emotion, describe the energy, and notice what feels most present.","mood_before":true,"mood_after":false,"tags":["mood","awareness","section1"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),
    ('c4000000-aaaa-4000-8000-000000000004', 'c3000000-aaaa-4000-8000-000000000001', 3, 'exercise', 'mood_s1_u1_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Might This Mood Need?', 'Connect what you are feeling to what your mind or body may need.', $json${"steps":[{"prompt":"What is this mood most asking for right now?","input_type":"text","placeholder":"Rest, reassurance, movement, comfort, space, contact..."},{"prompt":"What usually makes this mood heavier?","input_type":"text","placeholder":"Think about thoughts, habits, or situations..."},{"prompt":"What is one kind response to it?","input_type":"text","placeholder":"Keep it small and realistic..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),

    ('c4000000-aaaa-4000-8000-000000000005', 'c3000000-aaaa-4000-8000-000000000002', 0, 'learn', 'mood_s1_u2_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Mood Has Patterns', 'Learn why mood shifts across the day instead of staying the same.', $json${"cards":[{"text":"Mood is dynamic. It changes with sleep, stress, food, light, movement, people, and what is happening in your mind.","visual_key":"mood_patterns"},{"text":"When a mood feels confusing, tracking when it changes can make it more understandable.","visual_key":"track_change"},{"text":"Patterns do not mean your mood is fixed. They show you where the leverage points are.","visual_key":"leverage_points"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000006', 'c3000000-aaaa-4000-8000-000000000002', 1, 'exercise', 'mood_s1_u2_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Map A Mood Day', 'Walk through a normal day and notice where mood rises or falls.', $json${"steps":[{"prompt":"When in the day does your mood usually feel heaviest?","input_type":"text","placeholder":"Morning, mid-day, late evening, after work..."},{"prompt":"When does it usually feel lighter?","input_type":"text","placeholder":"After a walk, after talking to someone, after rest..."},{"prompt":"What tends to happen before each shift?","input_type":"text","placeholder":"Think about sleep, stress, food, people, tasks, or self-talk..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000007', 'c3000000-aaaa-4000-8000-000000000002', 2, 'journal', 'mood_s1_u2_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Tends To Shift You?', 'Reflect on the people, places, and habits that move your mood.', $json${"prompt":"What tends to lower your mood, and what tends to help it even a little? Be specific about situations, routines, or people.","mood_before":false,"mood_after":false,"tags":["mood","patterns","triggers"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('c4000000-aaaa-4000-8000-000000000008', 'c3000000-aaaa-4000-8000-000000000003', 0, 'learn', 'mood_s1_u3_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Thoughts, Body, And Action', 'See how mood is shaped by the loop between thoughts, sensations, and behavior.', $json${"cards":[{"text":"Mood is not only emotion. It also shows up in your thoughts, body, and actions.","visual_key":"mood_loop"},{"text":"A discouraging thought can change your body state. A tired body state can change what thoughts feel believable.","visual_key":"thought_body_link"},{"text":"When you withdraw, scroll, or cancel, you may get short relief but keep the same mood cycle going.","visual_key":"behavior_loop"},{"text":"Changing any one part of the loop can shift the whole experience.","visual_key":"change_any_part"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000009', 'c3000000-aaaa-4000-8000-000000000003', 1, 'exercise', 'mood_s1_u3_exercise', '[{"type":"xp","amount":20,"icon":"⚡"}]'::jsonb, 'Spot Your Mood Loop', 'Map one recent low-mood moment through thought, body, and action.', $json${"steps":[{"prompt":"Describe one recent moment when your mood dropped.","input_type":"text","placeholder":"What was happening?"},{"prompt":"What thoughts showed up?","input_type":"text","placeholder":"What was your mind saying?"},{"prompt":"What did you feel in your body?","input_type":"text","placeholder":"Heavy, restless, numb, tense, tired..."},{"prompt":"What did you do next?","input_type":"text","placeholder":"Withdrew, scrolled, slept, avoided, reached out..."},{"prompt":"What part of the loop feels easiest to change first?","input_type":"text","placeholder":"Thought, body, or action?"}]}$json$::jsonb, 20, 5, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000010', 'c3000000-aaaa-4000-8000-000000000003', 2, 'journal', 'mood_s1_u3_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Where Could You Interrupt It?', 'Reflect on the part of your loop that feels most changeable right now.', $json${"prompt":"Looking at your mood loop, where do you feel most able to interrupt it right now: thought, body, or action? Why there?","mood_before":false,"mood_after":true,"tags":["mood","loop","reflection"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),
    ('c4000000-aaaa-4000-8000-000000000011', 'c3000000-aaaa-4000-8000-000000000003', 3, 'quiz', 'mood_s1_u3_quiz', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Understand Your Mood', 'Check your understanding before moving forward.', $json${"questions":[{"text":"Mood is most useful to think of as:","options":["Your identity","A fixed trait","Information about your current state","Something random"],"correct_index":2,"explanation":"Mood gives information about your current state. It is not who you are."},{"text":"Which parts of the mood loop affect each other?","options":["Only emotions","Only thoughts and actions","Thoughts, body, and actions","None of them"],"correct_index":2,"explanation":"Mood is shaped by the interaction between thoughts, body sensations, and behavior."}]}$json$::jsonb, 15, 3, 'help-circle', 'quiz'),

    ('c4000000-aaaa-4000-8000-000000000012', 'c3000000-aaaa-4000-8000-000000000004', 0, 'learn', 'mood_s2_u1_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Thoughts Color Mood', 'Learn how automatic thoughts influence how you feel.', $json${"cards":[{"text":"When mood drops, the mind often starts telling a darker story about you, other people, or the future.","visual_key":"automatic_story"},{"text":"These thoughts can feel like facts because they arrive quickly and match the mood of the moment.","visual_key":"thoughts_feel_true"},{"text":"CBT helps by slowing those thoughts down and testing whether they are fully true, partly true, or distorted.","visual_key":"cbt_slow_down"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000013', 'c3000000-aaaa-4000-8000-000000000004', 1, 'journal', 'mood_s2_u1_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Catch The Story', 'Write down the kind of thoughts that show up when your mood gets lower.', $json${"prompt":"When your mood dips, what story does your mind usually start telling? Notice the words, assumptions, or predictions that show up.","mood_before":false,"mood_after":false,"tags":["mood","thoughts","cbt"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),
    ('c4000000-aaaa-4000-8000-000000000014', 'c3000000-aaaa-4000-8000-000000000004', 2, 'exercise', 'mood_s2_u1_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Fact Or Feeling?', 'Separate what you know from what your mood is making more believable.', $json${"steps":[{"prompt":"Write one low-mood thought.","input_type":"text","placeholder":"e.g. I always mess things up..."},{"prompt":"What facts support it?","input_type":"text","placeholder":"Only list what you know for sure..."},{"prompt":"What facts do not support it?","input_type":"text","placeholder":"What evidence points another way?"},{"prompt":"Write a more accurate version.","input_type":"text","placeholder":"Make it balanced, not fake-positive..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000015', 'c3000000-aaaa-4000-8000-000000000004', 3, 'quiz', 'mood_s2_u1_quiz', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Catch Mood Thoughts', 'Check what you understand about low-mood thinking.', $json${"questions":[{"text":"Automatic thoughts often feel true because:","options":["They are always factual","They arrive quickly and match your mood","They are positive","They come from other people"],"correct_index":1,"explanation":"They feel convincing because they are fast and emotionally matched to the moment."},{"text":"A CBT-style response to a harsh thought is to:","options":["Ignore it","Believe it fully","Test it for accuracy","Replace it with hype"],"correct_index":2,"explanation":"CBT focuses on testing whether a thought is accurate, complete, or distorted."}]}$json$::jsonb, 15, 3, 'help-circle', 'quiz'),

    ('c4000000-aaaa-4000-8000-000000000016', 'c3000000-aaaa-4000-8000-000000000005', 0, 'learn', 'mood_s2_u2_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Energy, Sleep, And Environment', 'See how basic rhythms and surroundings affect mood.', $json${"cards":[{"text":"Mood is influenced by sleep, light, food, movement, stress load, and the spaces you spend time in.","visual_key":"baseline_factors"},{"text":"When several of these are off at once, mood can dip faster and recover more slowly.","visual_key":"stacked_load"},{"text":"You do not need to optimize everything. Noticing the biggest drains is enough to start.","visual_key":"notice_biggest_drains"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000017', 'c3000000-aaaa-4000-8000-000000000005', 1, 'exercise', 'mood_s2_u2_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Audit Your Mood Drains', 'Identify the small things that repeatedly make mood harder to carry.', $json${"steps":[{"prompt":"Which daily habit drains your mood the most right now?","input_type":"text","placeholder":"Poor sleep, irregular meals, doom-scrolling, too much isolation..."},{"prompt":"Which part of your environment makes mood harder?","input_type":"text","placeholder":"Noise, clutter, darkness, constant pressure..."},{"prompt":"Which support is missing most?","input_type":"text","placeholder":"Rest, movement, sunlight, routine, contact..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000018', 'c3000000-aaaa-4000-8000-000000000005', 2, 'journal', 'mood_s2_u2_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'One Small Change', 'Choose one realistic change that could make low-mood days easier.', $json${"prompt":"If you changed just one support this week, what would help most? Keep it small and specific.","mood_before":false,"mood_after":true,"tags":["mood","environment","habits"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('c4000000-aaaa-4000-8000-000000000019', 'c3000000-aaaa-4000-8000-000000000006', 0, 'learn', 'mood_s2_u3_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Avoidance Keeps Mood Stuck', 'Learn why withdrawal can protect you briefly but deepen low mood over time.', $json${"cards":[{"text":"When mood is low, avoiding effort, contact, or uncertainty can feel relieving in the moment.","visual_key":"short_relief"},{"text":"The problem is that avoidance shrinks your life. It removes chances for energy, accomplishment, connection, and relief.","visual_key":"life_shrinks"},{"text":"A tiny approach step is often more helpful than waiting to feel ready.","visual_key":"tiny_approach"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000020', 'c3000000-aaaa-4000-8000-000000000006', 1, 'exercise', 'mood_s2_u3_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Choose One Approach Step', 'Pick one small action that moves slightly toward life instead of away from it.', $json${"steps":[{"prompt":"What have you been avoiding because your mood is low?","input_type":"text","placeholder":"A text, a walk, a task, opening an email..."},{"prompt":"What is the smallest version you could do?","input_type":"text","placeholder":"Something you could do in 2-5 minutes..."},{"prompt":"What would make it easier to start?","input_type":"text","placeholder":"Time, location, support, reminder..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000021', 'c3000000-aaaa-4000-8000-000000000006', 2, 'checkpoint', 'mood_s2_u3_checkpoint', '[{"type":"xp","amount":25,"icon":"⚡"},{"type":"gems","amount":5,"icon":"💎"}]'::jsonb, 'What Shapes Your Mood', 'Lock in what you have learned about the forces that shape mood.', $json${"checkpoint":"what_shapes_your_mood"}$json$::jsonb, 25, 2, 'target', 'checkpoint'),

    ('c4000000-aaaa-4000-8000-000000000022', 'c3000000-aaaa-4000-8000-000000000007', 0, 'learn', 'mood_s3_u1_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Small Action Changes State', 'Learn why a tiny action can change mood more reliably than waiting for motivation.', $json${"cards":[{"text":"Low mood often lowers motivation first. If you wait to feel ready, you may stay stuck.","visual_key":"motivation_wait"},{"text":"Behavioral activation works by using small action to create a shift in energy, attention, and confidence.","visual_key":"behavioral_activation"},{"text":"The action should feel doable, not impressive.","visual_key":"doable_not_impressive"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000023', 'c3000000-aaaa-4000-8000-000000000007', 1, 'exercise', 'mood_s3_u1_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Two-Minute Energy Reset', 'Create one very small action for heavy or flat days.', $json${"steps":[{"prompt":"Pick one 2-minute action that usually helps a little.","input_type":"text","placeholder":"Open the curtains, stretch, step outside, wash your face..."},{"prompt":"When is low mood most likely to show up?","input_type":"text","placeholder":"Morning, after work, late evening..."},{"prompt":"When will you try this reset?","input_type":"text","placeholder":"Name a real moment this week..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000024', 'c3000000-aaaa-4000-8000-000000000007', 2, 'journal', 'mood_s3_u1_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Helped, Even A Little?', 'Notice whether a small action changed anything at all.', $json${"prompt":"After a small action, what changed, even slightly? Notice mood, energy, focus, or willingness.","mood_before":true,"mood_after":true,"tags":["mood","activation","reflection"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('c4000000-aaaa-4000-8000-000000000025', 'c3000000-aaaa-4000-8000-000000000008', 0, 'learn', 'mood_s3_u2_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Balanced Thoughts, Not Forced Positivity', 'Learn how to write thoughts that are fairer and more usable.', $json${"cards":[{"text":"Balanced thinking is not pretending everything is fine. It is making room for a fuller truth.","visual_key":"balanced_not_positive"},{"text":"A balanced thought reduces hopelessness without denying what is hard.","visual_key":"fuller_truth"},{"text":"If a thought feels impossible to believe, it will not help. Aim for believable and steady.","visual_key":"believable_shift"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000026', 'c3000000-aaaa-4000-8000-000000000008', 1, 'exercise', 'mood_s3_u2_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Write A More Balanced Thought', 'Practice changing one harsh thought into something fairer.', $json${"steps":[{"prompt":"Write one harsh or hopeless thought.","input_type":"text","placeholder":"e.g. Nothing is going to change..."},{"prompt":"What makes it feel true right now?","input_type":"text","placeholder":"Name the context, not just the thought..."},{"prompt":"What would a fairer version sound like?","input_type":"text","placeholder":"Make it realistic and believable..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000027', 'c3000000-aaaa-4000-8000-000000000008', 2, 'journal', 'mood_s3_u2_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'How Did The New Thought Feel?', 'Notice whether a fairer thought changed your state even slightly.', $json${"prompt":"When you rewrote the thought in a more balanced way, what changed, even a little? Notice mood, energy, or tension.","mood_before":false,"mood_after":true,"tags":["mood","thoughts","reflection"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('c4000000-aaaa-4000-8000-000000000028', 'c3000000-aaaa-4000-8000-000000000009', 0, 'learn', 'mood_s3_u3_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Connection, Pleasure, And Meaning', 'Learn why mood usually improves when life includes some warmth, enjoyment, and purpose.', $json${"cards":[{"text":"Low mood often pulls you toward isolation and numbness. That makes relief harder to find.","visual_key":"isolation_numbness"},{"text":"Pleasure restores energy. Meaning restores direction. Connection restores warmth and perspective.","visual_key":"three_supports"},{"text":"You do not need a big social plan. A small step toward any one of these can help.","visual_key":"small_step_support"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000029', 'c3000000-aaaa-4000-8000-000000000009', 1, 'exercise', 'mood_s3_u3_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Choose One Reconnection Step', 'Pick one small action that adds warmth, interest, or connection back into your week.', $json${"steps":[{"prompt":"What kind of reconnection do you need most right now?","input_type":"text","placeholder":"Warmth, enjoyment, meaning, or contact..."},{"prompt":"What is one small step you could actually take?","input_type":"text","placeholder":"Text someone, revisit music, go outside, do one meaningful task..."},{"prompt":"What might get in the way?","input_type":"text","placeholder":"Low energy, fear, time, self-criticism..."},{"prompt":"How will you make the step easier?","input_type":"text","placeholder":"Lower the bar, shorten it, ask for support..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000030', 'c3000000-aaaa-4000-8000-000000000009', 2, 'chest', 'mood_s3_u3_reward', '[{"type":"xp","amount":20,"icon":"⚡"},{"type":"gems","amount":5,"icon":"💎"}]'::jsonb, 'Reconnect Reward', 'Unlock a reward for taking steps back toward life.', $json${"reward_key":"reconnect_reward"}$json$::jsonb, 20, 1, 'gift', 'chest'),

    ('c4000000-aaaa-4000-8000-000000000031', 'c3000000-aaaa-4000-8000-000000000010', 0, 'learn', 'mood_s4_u1_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Protect The Basics', 'Learn why steady habits make mood dips easier to recover from.', $json${"cards":[{"text":"Mood becomes harder to carry when sleep, food, movement, light, and rest are repeatedly off-balance.","visual_key":"basics_off_balance"},{"text":"You do not need perfect routines. You need enough stability that your system is not always running low.","visual_key":"enough_stability"},{"text":"Think baseline, not optimization.","visual_key":"baseline_not_optimization"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000032', 'c3000000-aaaa-4000-8000-000000000010', 1, 'exercise', 'mood_s4_u1_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Build One Mood Anchor', 'Choose one basic habit that helps your mood stay steadier.', $json${"steps":[{"prompt":"Which basic support matters most for your mood right now?","input_type":"text","placeholder":"Sleep, movement, meals, light, rest, rhythm..."},{"prompt":"What is the smallest version you can do consistently?","input_type":"text","placeholder":"e.g. 10-minute walk, regular breakfast, curtains open by 08:00..."},{"prompt":"What cue will remind you?","input_type":"text","placeholder":"After coffee, after brushing teeth, before lunch..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),

    ('c4000000-aaaa-4000-8000-000000000033', 'c3000000-aaaa-4000-8000-000000000011', 0, 'learn', 'mood_s4_u2_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Notice The Dip Sooner', 'Learn why early signs matter more than late-stage recovery.', $json${"cards":[{"text":"It is easier to respond to a mood dip when it first starts than when you are already deep in it.","visual_key":"early_response"},{"text":"Early signs can be subtle: withdrawing, scrolling more, losing routine, feeling flat, or becoming harsher with yourself.","visual_key":"early_signs"},{"text":"Catching the dip earlier gives you more options and requires less effort.","visual_key":"more_options"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('c4000000-aaaa-4000-8000-000000000034', 'c3000000-aaaa-4000-8000-000000000011', 1, 'journal', 'mood_s4_u2_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Your Early Signs', 'Write down the signals that tell you your mood is starting to slide.', $json${"prompt":"What are your earliest clues that your mood is dipping? List the signs you want to catch sooner next time.","mood_before":false,"mood_after":true,"tags":["mood","warning_signs","reflection"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('c4000000-aaaa-4000-8000-000000000035', 'c3000000-aaaa-4000-8000-000000000012', 0, 'exercise', 'mood_s4_u3_exercise', '[{"type":"xp","amount":20,"icon":"⚡"}]'::jsonb, 'Create A Mood Support Menu', 'Collect the few supports you want to return to when mood starts slipping.', $json${"steps":[{"prompt":"List one awareness tool that helps.","input_type":"text","placeholder":"e.g. mood check-in, naming the thought..."},{"prompt":"List one action tool that helps.","input_type":"text","placeholder":"e.g. short walk, shower, stretch..."},{"prompt":"List one connection or comfort tool that helps.","input_type":"text","placeholder":"e.g. message a friend, music, sunlight, tea..."},{"prompt":"What makes these realistic for you?","input_type":"text","placeholder":"Why are these the ones you would actually use?"}]}$json$::jsonb, 20, 5, 'dumbbell', 'exercise'),
    ('c4000000-aaaa-4000-8000-000000000036', 'c3000000-aaaa-4000-8000-000000000012', 1, 'checkpoint', 'mood_s4_u3_checkpoint', '[{"type":"xp","amount":30,"icon":"⚡"},{"type":"gems","amount":10,"icon":"💎"}]'::jsonb, 'Mood Reset Complete', 'Finish the journey with a clearer understanding of your mood and the tools that help.', $json${"checkpoint":"mood_reset_complete"}$json$::jsonb, 30, 2, 'target', 'checkpoint');
END $$;

NOTIFY pgrst, 'reload schema';
