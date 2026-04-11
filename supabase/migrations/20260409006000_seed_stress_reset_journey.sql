-- ============================================================================
-- Seed Data: "Stress Reset" Journey
-- A beginner stress journey focused on understanding overload, spotting
-- patterns early, and using evidence-based recovery tools.
-- ============================================================================

DO $$
DECLARE
  v_journey_id UUID := 'd1000000-aaaa-4000-8000-000000000001';
  v_section_1_id UUID := 'd2000000-aaaa-4000-8000-000000000001';
  v_section_2_id UUID := 'd2000000-aaaa-4000-8000-000000000002';
  v_section_3_id UUID := 'd2000000-aaaa-4000-8000-000000000003';
  v_section_4_id UUID := 'd2000000-aaaa-4000-8000-000000000004';
BEGIN
  INSERT INTO journey_templates (
    id, slug, title, description, icon_url, color_scheme, sort_order, is_active, version,
    category, difficulty, estimated_days, total_nodes, color_theme_key, icon_key
  ) VALUES (
    v_journey_id,
    'stress-reset',
    'Stress Reset',
    'Understand what overload is doing to your mind and body, spot your stress patterns earlier, and build steadier recovery tools for everyday life.',
    NULL,
    'orange',
    3,
    true,
    1,
    'stress',
    'beginner',
    14,
    36,
    'orange',
    'target'
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
      'Understand Stress',
      'Learn what stress is, how overload builds, and how it shows up in your thoughts, body, and daily behavior.',
      'orange',
      '[{"afterNodeIndex":1,"position":"right","message":"Stress makes more sense when you can see the pattern."}]'::jsonb,
      'sequential'
    ),
    (
      v_section_2_id,
      v_journey_id,
      2,
      'Find Your Stress Triggers',
      'Spot the routines, pressure points, and habits that keep your system running hot.',
      'purple',
      '[{"afterNodeIndex":1,"position":"left","message":"The goal is not to remove all stress. It is to understand your biggest drivers."}]'::jsonb,
      'sequential'
    ),
    (
      v_section_3_id,
      v_journey_id,
      3,
      'Regulate In The Moment',
      'Practice quick, realistic tools that calm the body and reduce mental overload.',
      'blue',
      '[{"afterNodeIndex":1,"position":"right","message":"Small regulation skills help more when they are easy to reach."}]'::jsonb,
      'sequential'
    ),
    (
      v_section_4_id,
      v_journey_id,
      4,
      'Recover More Consistently',
      'Protect your energy, catch stress earlier, and keep the recovery tools that actually fit your life.',
      'green',
      '[{"afterNodeIndex":1,"position":"left","message":"Recovery works best when it is repeatable, not perfect."}]'::jsonb,
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
    ('d3000000-aaaa-4000-8000-000000000001', v_journey_id, v_section_1_id, 1, 1, 'Check Your Load', 'Start by noticing how loaded your system feels right now.', 'orange', '[{"afterNodeIndex":1,"position":"right","message":"Awareness comes before adjustment."}]'::jsonb, 'sequential'),
    ('d3000000-aaaa-4000-8000-000000000002', v_journey_id, v_section_1_id, 2, 2, 'How Stress Works', 'See what stress does in the body, mind, and attention system.', 'blue', '[{"afterNodeIndex":1,"position":"left","message":"Stress is a body-and-mind response, not a personal failure."}]'::jsonb, 'sequential'),
    ('d3000000-aaaa-4000-8000-000000000003', v_journey_id, v_section_1_id, 3, 3, 'Your Stress Loop', 'Map how pressure, thoughts, body signals, and behavior reinforce each other.', 'purple', '[{"afterNodeIndex":1,"position":"right","message":"Once you see the loop, you can start interrupting it."}]'::jsonb, 'sequential'),

    ('d3000000-aaaa-4000-8000-000000000004', v_journey_id, v_section_2_id, 4, 1, 'Name Your Triggers', 'Identify the situations and demands that repeatedly overload you.', 'purple', '[{"afterNodeIndex":1,"position":"left","message":"Triggers are easier to work with once they have names."}]'::jsonb, 'sequential'),
    ('d3000000-aaaa-4000-8000-000000000005', v_journey_id, v_section_2_id, 5, 2, 'Notice Hidden Stressors', 'Look at low-grade drains like clutter, context switching, and constant urgency.', 'blue', '[{"afterNodeIndex":1,"position":"right","message":"Small stressors stack up faster than we notice."}]'::jsonb, 'sequential'),
    ('d3000000-aaaa-4000-8000-000000000006', v_journey_id, v_section_2_id, 6, 3, 'Stress And Self-Talk', 'Catch the internal pressure that makes a hard day even harder.', 'orange', '[{"afterNodeIndex":1,"position":"left","message":"Your inner voice can either compress stress or soften it."}]'::jsonb, 'sequential'),

    ('d3000000-aaaa-4000-8000-000000000007', v_journey_id, v_section_3_id, 7, 1, 'Calm The Body Fast', 'Use simple body-based tools to lower activation in the moment.', 'blue', '[{"afterNodeIndex":1,"position":"right","message":"When the body settles, the mind usually follows."}]'::jsonb, 'sequential'),
    ('d3000000-aaaa-4000-8000-000000000008', v_journey_id, v_section_3_id, 8, 2, 'Reduce Mental Noise', 'Practice clearing overload when everything feels urgent at once.', 'green', '[{"afterNodeIndex":1,"position":"left","message":"Clarity often comes from reducing noise, not pushing harder."}]'::jsonb, 'sequential'),
    ('d3000000-aaaa-4000-8000-000000000009', v_journey_id, v_section_3_id, 9, 3, 'Reset With Small Actions', 'Build tiny, repeatable responses for stressful moments.', 'purple', '[{"afterNodeIndex":1,"position":"right","message":"Short resets count. They do not need to be dramatic."}]'::jsonb, 'sequential'),

    ('d3000000-aaaa-4000-8000-000000000010', v_journey_id, v_section_4_id, 10, 1, 'Protect Your Energy', 'Strengthen the routines that make recovery easier.', 'green', '[{"afterNodeIndex":1,"position":"left","message":"Recovery is easier when your basics are less fragile."}]'::jsonb, 'sequential'),
    ('d3000000-aaaa-4000-8000-000000000011', v_journey_id, v_section_4_id, 11, 2, 'Catch Stress Earlier', 'Notice the first signs of overload before it becomes a full stress spiral.', 'blue', '[{"afterNodeIndex":1,"position":"right","message":"Earlier signals give you more options."}]'::jsonb, 'sequential'),
    ('d3000000-aaaa-4000-8000-000000000012', v_journey_id, v_section_4_id, 12, 3, 'Keep What Works', 'Finish with a practical set of stress-reset tools you can reuse.', 'purple', '[{"afterNodeIndex":1,"position":"left","message":"You are building a usable toolkit, not a perfect routine."}]'::jsonb, 'sequential')
  ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    unit_number = EXCLUDED.unit_number,
    section_unit_number = EXCLUDED.section_unit_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    color_scheme = EXCLUDED.color_scheme,
    mascot_placements = EXCLUDED.mascot_placements,
    unlock_rule = EXCLUDED.unlock_rule;

  INSERT INTO journey_template_nodes (
    id, unit_id, node_index, node_type, task_id, rewards,
    title, description, content, xp_reward, estimated_minutes, icon_key, variant_key
  ) VALUES
    ('d4000000-aaaa-4000-8000-000000000001', 'd3000000-aaaa-4000-8000-000000000001', 0, 'mood_check', 'stress_s1_u1_checkin', '[{"type":"xp","amount":5,"icon":"⚡"}]'::jsonb, 'How stressed do you feel?', 'Start by noticing your current stress load.', $json${"prompt":"How stressed does your system feel right now?","scale":5,"note_enabled":true,"labels":["Very calm","A little stressed","Noticeably stressed","High stress","Overloaded"]}$json$::jsonb, 5, 1, 'mirror', 'mood_check'),
    ('d4000000-aaaa-4000-8000-000000000002', 'd3000000-aaaa-4000-8000-000000000001', 1, 'learn', 'stress_s1_u1_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Stress Is A Load Signal', 'Learn what stress is telling you about demand and capacity.', $json${"cards":[{"text":"Stress is your system responding to load, demand, uncertainty, or pressure.","visual_key":"stress_load"},{"text":"A little stress can sharpen attention. Too much for too long starts to narrow thinking and drain energy.","visual_key":"good_too_much"},{"text":"The problem is not that stress exists. The problem is when the load stays high and recovery stays low.","visual_key":"load_vs_recovery"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000003', 'd3000000-aaaa-4000-8000-000000000001', 2, 'journal', 'stress_s1_u1_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Does Stress Feel Like For You?', 'Notice how overload shows up in your body, emotions, and attention.', $json${"prompt":"When you are stressed, how does it usually show up first? Think about body sensations, emotions, thoughts, and attention.","mood_before":true,"mood_after":false,"tags":["stress","awareness","section1"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),
    ('d4000000-aaaa-4000-8000-000000000004', 'd3000000-aaaa-4000-8000-000000000001', 3, 'exercise', 'stress_s1_u1_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Is Your System Asking For?', 'Connect your stress signal to the kind of support it may need.', $json${"steps":[{"prompt":"When stress gets high, what is your system usually missing?","input_type":"text","placeholder":"Rest, time, clarity, support, food, movement, boundaries..."},{"prompt":"What tends to make the load worse?","input_type":"text","placeholder":"Urgency, pressure, multitasking, conflict..."},{"prompt":"What is one realistic way to respond?","input_type":"text","placeholder":"Keep it small and actionable..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),

    ('d4000000-aaaa-4000-8000-000000000005', 'd3000000-aaaa-4000-8000-000000000002', 0, 'learn', 'stress_s1_u2_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'What Stress Does To The Brain And Body', 'See how stress changes focus, physiology, and decision-making.', $json${"cards":[{"text":"Stress activates the body for action: heart rate rises, muscles tense, and attention narrows toward threat or urgency.","visual_key":"stress_body"},{"text":"Under stress, the brain becomes more reactive and less flexible. Planning, memory, and patience often get weaker.","visual_key":"stress_brain"},{"text":"This is why stressed days often feel rushed, forgetful, or emotionally sharper than usual.","visual_key":"stress_consequences"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000006', 'd3000000-aaaa-4000-8000-000000000002', 1, 'exercise', 'stress_s1_u2_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Map Your Stress Signals', 'Track how stress shows up in your body, mind, and behavior.', $json${"steps":[{"prompt":"What happens in your body when stress rises?","input_type":"text","placeholder":"Tight jaw, racing mind, chest tension, shallow breath..."},{"prompt":"What happens in your thinking?","input_type":"text","placeholder":"Catastrophizing, urgency, impatience, blanking out..."},{"prompt":"What do you do when stress spikes?","input_type":"text","placeholder":"Rush, avoid, multitask, snap, shut down..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000007', 'd3000000-aaaa-4000-8000-000000000002', 2, 'journal', 'stress_s1_u2_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Which Signal Shows Up First?', 'Reflect on your earliest stress clue.', $json${"prompt":"What is usually the first sign that stress is starting to rise for you? Which signal shows up before the rest?","mood_before":false,"mood_after":true,"tags":["stress","body","reflection"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('d4000000-aaaa-4000-8000-000000000008', 'd3000000-aaaa-4000-8000-000000000003', 0, 'learn', 'stress_s1_u3_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Stress Runs In Loops', 'See how external pressure, inner pressure, and behavior keep stress going.', $json${"cards":[{"text":"Stress is often a loop: demand creates pressure, pressure changes thoughts and body state, and behavior can increase the load again.","visual_key":"stress_loop"},{"text":"For example: too much to do leads to urgency, urgency leads to rushing, rushing leads to mistakes, and mistakes create more stress.","visual_key":"stress_example"},{"text":"When you interrupt any part of the loop, the system has a chance to soften.","visual_key":"interrupt_loop"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000009', 'd3000000-aaaa-4000-8000-000000000003', 1, 'exercise', 'stress_s1_u3_exercise', '[{"type":"xp","amount":20,"icon":"⚡"}]'::jsonb, 'Map A Recent Stress Loop', 'Walk through a recent stress moment step by step.', $json${"steps":[{"prompt":"What was the stressful situation?","input_type":"text","placeholder":"Describe the moment briefly..."},{"prompt":"What thought showed up first?","input_type":"text","placeholder":"What was your mind saying?"},{"prompt":"What changed in your body?","input_type":"text","placeholder":"Tension, racing, shallow breathing..."},{"prompt":"What did you do next?","input_type":"text","placeholder":"Rushed, avoided, snapped, froze, multitasked..."},{"prompt":"What part of the loop could be interrupted next time?","input_type":"text","placeholder":"Thought, body, task, or response..."}]}$json$::jsonb, 20, 5, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000010', 'd3000000-aaaa-4000-8000-000000000003', 2, 'journal', 'stress_s1_u3_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Where Do You Usually Get Caught?', 'Reflect on the part of the loop that traps you most often.', $json${"prompt":"In a stress loop, where do you usually get stuck: the pressure, the self-talk, the body reaction, or the behavior that follows?","mood_before":false,"mood_after":true,"tags":["stress","loop","reflection"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),
    ('d4000000-aaaa-4000-8000-000000000011', 'd3000000-aaaa-4000-8000-000000000003', 3, 'quiz', 'stress_s1_u3_quiz', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Understand Stress', 'Check your understanding before moving ahead.', $json${"questions":[{"text":"Longer-term stress becomes a problem mainly when:","options":["Stress exists at all","Load stays high and recovery stays low","You ignore every feeling","You are not busy enough"],"correct_index":1,"explanation":"Stress becomes harder to carry when demand stays high and recovery is too low."},{"text":"A stress loop can be softened by:","options":["Fixing everything at once","Interrupting one part of the loop","Ignoring the body","Working faster"],"correct_index":1,"explanation":"You only need to change one part of the loop to begin shifting the system."}]}$json$::jsonb, 15, 3, 'help-circle', 'quiz'),

    ('d4000000-aaaa-4000-8000-000000000012', 'd3000000-aaaa-4000-8000-000000000004', 0, 'learn', 'stress_s2_u1_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Triggers Are Often Predictable', 'Learn why your stress triggers usually follow themes, not randomness.', $json${"cards":[{"text":"Stress triggers are often tied to a few repeated themes: uncertainty, time pressure, conflict, overload, or feeling out of control.","visual_key":"trigger_themes"},{"text":"When you identify the theme, the trigger becomes easier to prepare for.","visual_key":"name_theme"},{"text":"The goal is not to eliminate every trigger. It is to understand which ones hit you hardest and why.","visual_key":"understand_not_eliminate"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000013', 'd3000000-aaaa-4000-8000-000000000004', 1, 'exercise', 'stress_s2_u1_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Name Your Biggest Triggers', 'List the situations that most often overload your system.', $json${"steps":[{"prompt":"What situations stress you most often?","input_type":"text","placeholder":"Deadlines, uncertainty, conflict, caregiving, money..."},{"prompt":"What do they have in common?","input_type":"text","placeholder":"Urgency, people pressure, lack of clarity..."},{"prompt":"Which trigger hits hardest right now?","input_type":"text","placeholder":"Choose one to focus on..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000014', 'd3000000-aaaa-4000-8000-000000000004', 2, 'journal', 'stress_s2_u1_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Kind Of Pressure Is Hardest?', 'Reflect on the form of pressure that weighs on you most.', $json${"prompt":"Which kind of pressure affects you most right now: urgency, uncertainty, people demands, overload, or something else? Why that one?","mood_before":false,"mood_after":false,"tags":["stress","triggers","reflection"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),
    ('d4000000-aaaa-4000-8000-000000000015', 'd3000000-aaaa-4000-8000-000000000004', 3, 'quiz', 'stress_s2_u1_quiz', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Name Your Triggers', 'Check what you understand about stress triggers.', $json${"questions":[{"text":"Stress triggers are usually most useful when understood as:","options":["Personal weakness","Random events","Repeated patterns or themes","Proof you are failing"],"correct_index":2,"explanation":"Triggers often cluster around repeated themes like urgency, uncertainty, or overload."},{"text":"Why name a trigger theme?","options":["To avoid all hard things","To prepare and respond more intentionally","To prove stress is permanent","To think about it less"],"correct_index":1,"explanation":"A named trigger is easier to anticipate and respond to."}]}$json$::jsonb, 15, 3, 'help-circle', 'quiz'),

    ('d4000000-aaaa-4000-8000-000000000016', 'd3000000-aaaa-4000-8000-000000000005', 0, 'learn', 'stress_s2_u2_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Hidden Stressors Matter', 'Look at the small drains that quietly add to stress all day.', $json${"cards":[{"text":"Stress is not only caused by big events. It is also shaped by repeated small drains like noise, interruptions, clutter, and too many open loops.","visual_key":"hidden_stressors"},{"text":"These stressors can feel normal because they are frequent, but they still tax your attention and energy.","visual_key":"normalized_load"},{"text":"Reducing even one of them can create more relief than expected.","visual_key":"small_relief"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000017', 'd3000000-aaaa-4000-8000-000000000005', 1, 'exercise', 'stress_s2_u2_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Audit The Small Drains', 'Find the low-grade stressors that are costing you energy.', $json${"steps":[{"prompt":"What small thing drains you repeatedly?","input_type":"text","placeholder":"Notifications, clutter, too many tabs, noise..."},{"prompt":"When does it happen most?","input_type":"text","placeholder":"Morning, during work, evenings..."},{"prompt":"What one adjustment would reduce it?","input_type":"text","placeholder":"Mute, clear, batch, shorten, delegate..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000018', 'd3000000-aaaa-4000-8000-000000000005', 2, 'journal', 'stress_s2_u2_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Feels Constantly On?', 'Reflect on what keeps your system from fully settling.', $json${"prompt":"What in your day makes your system feel like it is always half-on or always bracing?","mood_before":false,"mood_after":true,"tags":["stress","environment","attention"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('d4000000-aaaa-4000-8000-000000000019', 'd3000000-aaaa-4000-8000-000000000006', 0, 'learn', 'stress_s2_u3_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Stress And Self-Talk', 'Learn how internal pressure can amplify external stress.', $json${"cards":[{"text":"Stress is often made worse by self-talk like I should handle this better, I cannot drop the ball, or there is no room for error.","visual_key":"internal_pressure"},{"text":"This kind of pressure keeps the nervous system activated even when the original task is manageable.","visual_key":"amplified_stress"},{"text":"A fairer inner voice lowers strain without lowering standards.","visual_key":"fairer_voice"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000020', 'd3000000-aaaa-4000-8000-000000000006', 1, 'exercise', 'stress_s2_u3_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Rewrite One Pressure Thought', 'Practice turning one harsh pressure thought into something fairer.', $json${"steps":[{"prompt":"Write one stressful self-pressure thought.","input_type":"text","placeholder":"e.g. I cannot mess this up..."},{"prompt":"What makes it feel urgent or true?","input_type":"text","placeholder":"Name the context..."},{"prompt":"Write a fairer version.","input_type":"text","placeholder":"Keep it realistic and usable..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000021', 'd3000000-aaaa-4000-8000-000000000006', 2, 'checkpoint', 'stress_s2_u3_checkpoint', '[{"type":"xp","amount":25,"icon":"⚡"},{"type":"gems","amount":5,"icon":"💎"}]'::jsonb, 'Find Your Stress Drivers', 'Lock in what you have learned about what pushes your stress higher.', $json${"checkpoint":"find_your_stress_drivers"}$json$::jsonb, 25, 2, 'target', 'checkpoint'),

    ('d4000000-aaaa-4000-8000-000000000022', 'd3000000-aaaa-4000-8000-000000000007', 0, 'learn', 'stress_s3_u1_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Regulate The Body First', 'Learn why body calming skills can reduce stress faster than thinking harder.', $json${"cards":[{"text":"When stress is high, the body is often too activated for clear thinking to work right away.","visual_key":"body_first"},{"text":"Slowing the breath, releasing tension, or changing posture can signal safety to the nervous system.","visual_key":"signal_safety"},{"text":"Body regulation is not avoidance. It is creating enough calm to respond more clearly.","visual_key":"regulation_not_avoidance"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000023', 'd3000000-aaaa-4000-8000-000000000007', 1, 'exercise', 'stress_s3_u1_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'One-Minute Body Reset', 'Practice a short body-based stress reset.', $json${"steps":[{"prompt":"Which body reset feels most doable for you?","input_type":"picker","options":["Slow exhale breathing","Drop shoulders and unclench jaw","Stand up and stretch","Step outside for one minute"]},{"prompt":"When would this help most?","input_type":"text","placeholder":"Before meetings, after conflict, during overwhelm..."},{"prompt":"What would remind you to use it?","input_type":"text","placeholder":"A cue, note, or transition moment..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000024', 'd3000000-aaaa-4000-8000-000000000007', 2, 'journal', 'stress_s3_u1_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Changed In Your Body?', 'Reflect on what shifted after a short body reset.', $json${"prompt":"After a short body reset, what changed, even slightly, in your breathing, tension, or attention?","mood_before":true,"mood_after":true,"tags":["stress","regulation","body"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('d4000000-aaaa-4000-8000-000000000025', 'd3000000-aaaa-4000-8000-000000000008', 0, 'learn', 'stress_s3_u2_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Reduce Mental Noise', 'Learn why overloaded thinking needs simplification, not more force.', $json${"cards":[{"text":"Stress makes everything feel equally urgent. That is part of why decision-making gets harder.","visual_key":"everything_urgent"},{"text":"Reducing mental noise often starts with narrowing focus to one thing, one step, or one next action.","visual_key":"narrow_focus"},{"text":"Clarity comes more easily when you stop holding the whole load in your head at once.","visual_key":"offload_clarity"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000026', 'd3000000-aaaa-4000-8000-000000000008', 1, 'exercise', 'stress_s3_u2_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Name The Next Small Step', 'Reduce overload by shrinking your focus to what comes next.', $json${"steps":[{"prompt":"What is making everything feel urgent right now?","input_type":"text","placeholder":"List the main load briefly..."},{"prompt":"What is the one thing that needs your attention first?","input_type":"text","placeholder":"Choose one..."},{"prompt":"What is the smallest next step?","input_type":"text","placeholder":"Write a step that takes 2-10 minutes..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000027', 'd3000000-aaaa-4000-8000-000000000008', 2, 'journal', 'stress_s3_u2_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'What Feels Lighter When You Shrink The Frame?', 'Reflect on the effect of focusing more narrowly.', $json${"prompt":"When you shrink the frame and focus on one next step, what feels different in your mind or body?","mood_before":false,"mood_after":true,"tags":["stress","clarity","attention"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('d4000000-aaaa-4000-8000-000000000028', 'd3000000-aaaa-4000-8000-000000000009', 0, 'learn', 'stress_s3_u3_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Small Resets Work Best When They Are Ready', 'See why prepared micro-recovery tools are easier to use under stress.', $json${"cards":[{"text":"Under stress, effort feels expensive. The best reset tools are the ones you can reach quickly.","visual_key":"ready_tools"},{"text":"A small reset might be a breath pattern, a one-minute walk, a short message, water, or clearing one task.","visual_key":"examples"},{"text":"Tiny tools used consistently beat big plans that appear too late.","visual_key":"consistent_tiny"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000029', 'd3000000-aaaa-4000-8000-000000000009', 1, 'exercise', 'stress_s3_u3_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Build A Quick Reset Menu', 'Choose the short stress resets you want available when things heat up.', $json${"steps":[{"prompt":"List one body reset you can use quickly.","input_type":"text","placeholder":"e.g. slow exhale breathing..."},{"prompt":"List one clarity reset.","input_type":"text","placeholder":"e.g. write the next step..."},{"prompt":"List one comfort or connection reset.","input_type":"text","placeholder":"e.g. step outside, text someone..."},{"prompt":"Which one will you use first most often?","input_type":"text","placeholder":"Pick your default reset..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000030', 'd3000000-aaaa-4000-8000-000000000009', 2, 'chest', 'stress_s3_u3_reward', '[{"type":"xp","amount":20,"icon":"⚡"},{"type":"gems","amount":5,"icon":"💎"}]'::jsonb, 'Reset Reward', 'Unlock a reward for building quick stress tools.', $json${"reward_key":"stress_reset_reward"}$json$::jsonb, 20, 1, 'gift', 'chest'),

    ('d4000000-aaaa-4000-8000-000000000031', 'd3000000-aaaa-4000-8000-000000000010', 0, 'learn', 'stress_s4_u1_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Protect Your Energy Baseline', 'Learn why recovery depends on steadier basics, not only crisis tools.', $json${"cards":[{"text":"Stress recovery is easier when sleep, food, movement, downtime, and boundaries are less fragile.","visual_key":"energy_baseline"},{"text":"You do not need perfect habits. You need enough support that your system is not constantly under-resourced.","visual_key":"enough_support"},{"text":"Think baseline protection, not lifestyle perfection.","visual_key":"baseline_not_perfection"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000032', 'd3000000-aaaa-4000-8000-000000000010', 1, 'exercise', 'stress_s4_u1_exercise', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Choose One Energy Protector', 'Pick one support that helps you recover more consistently.', $json${"steps":[{"prompt":"What part of your baseline feels most fragile?","input_type":"text","placeholder":"Sleep, food, movement, rest, boundaries..."},{"prompt":"What is one small support you can protect this week?","input_type":"text","placeholder":"A walk, lunch break, earlier stop time, regular snack..."},{"prompt":"What might help you keep it?","input_type":"text","placeholder":"A reminder, boundary, support person, simpler version..."}]}$json$::jsonb, 15, 4, 'dumbbell', 'exercise'),

    ('d4000000-aaaa-4000-8000-000000000033', 'd3000000-aaaa-4000-8000-000000000011', 0, 'learn', 'stress_s4_u2_learn', '[{"type":"xp","amount":10,"icon":"⚡"}]'::jsonb, 'Catch Stress Earlier', 'Learn why the earliest signs of overload matter most.', $json${"cards":[{"text":"Stress is easier to regulate earlier than later. Once overload is full, choices feel narrower.","visual_key":"early_stress"},{"text":"Early signs can be subtle: rushing, shorter patience, tension, forgetfulness, doom-scrolling, or feeling constantly behind.","visual_key":"early_signs_stress"},{"text":"The earlier you notice the signal, the smaller the reset can be.","visual_key":"smaller_reset"}]}$json$::jsonb, 10, 3, 'book-open', 'learn'),
    ('d4000000-aaaa-4000-8000-000000000034', 'd3000000-aaaa-4000-8000-000000000011', 1, 'journal', 'stress_s4_u2_journal', '[{"type":"xp","amount":15,"icon":"⚡"}]'::jsonb, 'Your Earliest Overload Clues', 'Write down the first signs that tell you stress is rising.', $json${"prompt":"What are your earliest signs of overload? What do you want to notice sooner next time?","mood_before":false,"mood_after":true,"tags":["stress","warning_signs","reflection"]}$json$::jsonb, 15, 4, 'pencil', 'journal'),

    ('d4000000-aaaa-4000-8000-000000000035', 'd3000000-aaaa-4000-8000-000000000012', 0, 'exercise', 'stress_s4_u3_exercise', '[{"type":"xp","amount":20,"icon":"⚡"}]'::jsonb, 'Create Your Stress Support Menu', 'Collect the few tools that actually help when stress rises.', $json${"steps":[{"prompt":"List one body regulation tool.","input_type":"text","placeholder":"e.g. long exhale breathing..."},{"prompt":"List one clarity tool.","input_type":"text","placeholder":"e.g. pick one next step..."},{"prompt":"List one recovery tool.","input_type":"text","placeholder":"e.g. short walk, pause, snack, boundaries..."},{"prompt":"Which tool will you use first by default?","input_type":"text","placeholder":"Pick your go-to reset..."}]}$json$::jsonb, 20, 5, 'dumbbell', 'exercise'),
    ('d4000000-aaaa-4000-8000-000000000036', 'd3000000-aaaa-4000-8000-000000000012', 1, 'checkpoint', 'stress_s4_u3_checkpoint', '[{"type":"xp","amount":30,"icon":"⚡"},{"type":"gems","amount":10,"icon":"💎"}]'::jsonb, 'Stress Reset Complete', 'Finish the journey with a clearer understanding of your stress patterns and the tools that help.', $json${"checkpoint":"stress_reset_complete"}$json$::jsonb, 30, 2, 'target', 'checkpoint')
  ON CONFLICT (id) DO UPDATE SET
    unit_id = EXCLUDED.unit_id,
    node_index = EXCLUDED.node_index,
    node_type = EXCLUDED.node_type,
    task_id = EXCLUDED.task_id,
    rewards = EXCLUDED.rewards,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    xp_reward = EXCLUDED.xp_reward,
    estimated_minutes = EXCLUDED.estimated_minutes,
    icon_key = EXCLUDED.icon_key,
    variant_key = EXCLUDED.variant_key;
END $$;

NOTIFY pgrst, 'reload schema';
