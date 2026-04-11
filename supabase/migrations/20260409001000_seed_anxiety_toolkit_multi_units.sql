-- ============================================================================
-- Anxiety Toolkit → Real Multi-Unit Sections
-- Migration: 20260409001000_seed_anxiety_toolkit_multi_units.sql
--
-- Reshapes the existing Anxiety Toolkit journey into:
--   4 sections
--   12 units (3 units per section)
--
-- Keeps the existing node IDs so user progress rows remain valid.
-- Recomputes node -> unit placement, node_index, and current enrollment position.
-- ============================================================================

DO $$
DECLARE
  v_journey_id UUID := 'b1000000-aaaa-4000-8000-000000000001';
  v_section_1_id UUID;
  v_section_2_id UUID;
  v_section_3_id UUID;
  v_section_4_id UUID;
BEGIN
  -- Only run if the anxiety journey exists.
  IF NOT EXISTS (
    SELECT 1 FROM journey_templates WHERE id = v_journey_id
  ) THEN
    RETURN;
  END IF;

  -- Resolve the canonical section ids created/backfilled by the section migration.
  SELECT id INTO v_section_1_id
  FROM journey_template_sections
  WHERE journey_id = v_journey_id AND section_number = 1;

  SELECT id INTO v_section_2_id
  FROM journey_template_sections
  WHERE journey_id = v_journey_id AND section_number = 2;

  SELECT id INTO v_section_3_id
  FROM journey_template_sections
  WHERE journey_id = v_journey_id AND section_number = 3;

  SELECT id INTO v_section_4_id
  FROM journey_template_sections
  WHERE journey_id = v_journey_id AND section_number = 4;

  -- ------------------------------------------------------------------------
  -- 1. Keep the real section records as the high-level themes
  -- ------------------------------------------------------------------------
  UPDATE journey_template_sections
  SET
    title = 'Understanding Anxiety',
    description = 'Learn what anxiety is, how it works in your brain and body, and why it feels the way it does.',
    color_scheme = 'blue',
    mascot_placements = '[{"afterNodeIndex": 1, "position": "right", "message": "You''re learning fast! 🧠"}]'::jsonb,
    unlock_rule = 'sequential'
  WHERE id = v_section_1_id;

  UPDATE journey_template_sections
  SET
    title = 'Challenging Anxious Thoughts',
    description = 'Spot the thinking traps anxiety uses and learn to challenge them with evidence.',
    color_scheme = 'purple',
    mascot_placements = '[{"afterNodeIndex": 1, "position": "left", "message": "Thought detective mode! 🔍"}]'::jsonb,
    unlock_rule = 'sequential'
  WHERE id = v_section_2_id;

  UPDATE journey_template_sections
  SET
    title = 'Calming Your Body',
    description = 'Master breathing, grounding, and relaxation techniques that calm your nervous system.',
    color_scheme = 'green',
    mascot_placements = '[{"afterNodeIndex": 1, "position": "right", "message": "Breathe... you''re doing great 🌿"}]'::jsonb,
    unlock_rule = 'sequential'
  WHERE id = v_section_3_id;

  UPDATE journey_template_sections
  SET
    title = 'Your Anxiety Action Plan',
    description = 'Build your personal coping toolkit and create an emergency action plan.',
    color_scheme = 'orange',
    mascot_placements = '[{"afterNodeIndex": 1, "position": "left", "message": "You''ve got this! 💪"}]'::jsonb,
    unlock_rule = 'sequential'
  WHERE id = v_section_4_id;

  -- ------------------------------------------------------------------------
  -- 2. Reuse the 4 original unit rows as unit 1 of each section
  -- ------------------------------------------------------------------------
  -- Park the original 4 unit rows in temporary high numbers first so we can
  -- safely reassign their final global unit_number values without tripping the
  -- existing UNIQUE (journey_id, unit_number) constraint mid-migration.
  UPDATE journey_template_units
  SET
    unit_number = CASE id
      WHEN 'b1100000-aaaa-4000-8000-000000000001' THEN 101
      WHEN 'b1100000-aaaa-4000-8000-000000000002' THEN 102
      WHEN 'b1100000-aaaa-4000-8000-000000000003' THEN 103
      WHEN 'b1100000-aaaa-4000-8000-000000000004' THEN 104
      ELSE unit_number
    END,
    section_unit_number = NULL
  WHERE id IN (
    'b1100000-aaaa-4000-8000-000000000001',
    'b1100000-aaaa-4000-8000-000000000002',
    'b1100000-aaaa-4000-8000-000000000003',
    'b1100000-aaaa-4000-8000-000000000004'
  );

  UPDATE journey_template_units
  SET
    section_id = v_section_1_id,
    unit_number = 1,
    section_unit_number = 1,
    title = 'What Anxiety Is',
    description = 'Start with the basics: what anxiety is, why it happens, and how the cycle begins.',
    color_scheme = 'blue',
    mascot_placements = '[{"afterNodeIndex": 1, "position": "right", "message": "Meet your alarm system."}]'::jsonb,
    unlock_rule = 'sequential'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000001';

  UPDATE journey_template_units
  SET
    section_id = v_section_2_id,
    unit_number = 4,
    section_unit_number = 1,
    title = 'Thinking Traps',
    description = 'Learn the most common anxious thought patterns and why they feel so convincing.',
    color_scheme = 'purple',
    mascot_placements = '[{"afterNodeIndex": 1, "position": "left", "message": "Name the trap to tame it."}]'::jsonb,
    unlock_rule = 'sequential'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000002';

  UPDATE journey_template_units
  SET
    section_id = v_section_3_id,
    unit_number = 7,
    section_unit_number = 1,
    title = 'Body-Mind Basics',
    description = 'Understand how anxiety lives in the body and why calming the body helps the mind.',
    color_scheme = 'green',
    mascot_placements = '[{"afterNodeIndex": 0, "position": "right", "message": "Your body can lead the calm."}]'::jsonb,
    unlock_rule = 'sequential'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000003';

  UPDATE journey_template_units
  SET
    section_id = v_section_4_id,
    unit_number = 10,
    section_unit_number = 1,
    title = 'Build Your Toolkit',
    description = 'Gather your best anxiety tools and turn them into a practical plan.',
    color_scheme = 'orange',
    mascot_placements = '[{"afterNodeIndex": 0, "position": "left", "message": "Let''s build your go-to plan."}]'::jsonb,
    unlock_rule = 'sequential'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000004';

  -- ------------------------------------------------------------------------
  -- 3. Create the additional units
  -- ------------------------------------------------------------------------
  INSERT INTO journey_template_units (
    id, journey_id, section_id, unit_number, section_unit_number,
    title, description, color_scheme, mascot_placements, unlock_rule
  ) VALUES
    (
      'b1100000-aaaa-4000-8000-000000000101',
      v_journey_id, v_section_1_id, 2, 2,
      'Map Your Anxiety Cycle',
      'Apply the model to your own life and spot the pattern in real situations.',
      'green',
      '[{"afterNodeIndex": 0, "position": "right", "message": "Now make it personal."}]'::jsonb,
      'sequential'
    ),
    (
      'b1100000-aaaa-4000-8000-000000000102',
      v_journey_id, v_section_1_id, 3, 3,
      'Reflect & Review',
      'Lock in what you learned and collect your first reward.',
      'purple',
      '[{"afterNodeIndex": 0, "position": "left", "message": "You''re already building momentum."}]'::jsonb,
      'sequential'
    ),
    (
      'b1100000-aaaa-4000-8000-000000000201',
      v_journey_id, v_section_2_id, 5, 2,
      'Challenge the Thought',
      'Practice spotting distortions and use evidence to weaken them.',
      'blue',
      '[{"afterNodeIndex": 0, "position": "left", "message": "Evidence beats fear."}]'::jsonb,
      'sequential'
    ),
    (
      'b1100000-aaaa-4000-8000-000000000202',
      v_journey_id, v_section_2_id, 6, 3,
      'Master the Skill',
      'Reframe worries, test your knowledge, and earn your checkpoint.',
      'orange',
      '[{"afterNodeIndex": 1, "position": "right", "message": "You can challenge the trap."}]'::jsonb,
      'sequential'
    ),
    (
      'b1100000-aaaa-4000-8000-000000000301',
      v_journey_id, v_section_3_id, 8, 2,
      'Quick Calm Tools',
      'Practice fast grounding and breathing techniques for anxious moments.',
      'blue',
      '[{"afterNodeIndex": 0, "position": "right", "message": "Come back to the present."}]'::jsonb,
      'sequential'
    ),
    (
      'b1100000-aaaa-4000-8000-000000000302',
      v_journey_id, v_section_3_id, 9, 3,
      'Deep Relaxation',
      'Release tension, reflect on what works, and unlock a calming reward.',
      'purple',
      '[{"afterNodeIndex": 1, "position": "left", "message": "Let the tension melt."}]'::jsonb,
      'sequential'
    ),
    (
      'b1100000-aaaa-4000-8000-000000000401',
      v_journey_id, v_section_4_id, 11, 2,
      'Practice Your Plan',
      'Turn your toolkit into action in a realistic anxious scenario.',
      'blue',
      '[{"afterNodeIndex": 0, "position": "left", "message": "Practice makes calm easier."}]'::jsonb,
      'sequential'
    ),
    (
      'b1100000-aaaa-4000-8000-000000000402',
      v_journey_id, v_section_4_id, 12, 3,
      'Finish Strong',
      'Compare where you are now and celebrate the full journey.',
      'purple',
      '[{"afterNodeIndex": 0, "position": "right", "message": "Finish strong."}]'::jsonb,
      'sequential'
    )
  ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    unit_number = EXCLUDED.unit_number,
    section_unit_number = EXCLUDED.section_unit_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    color_scheme = EXCLUDED.color_scheme,
    mascot_placements = EXCLUDED.mascot_placements,
    unlock_rule = EXCLUDED.unlock_rule;

  -- ------------------------------------------------------------------------
  -- 4. Reassign nodes into the new unit structure and renumber within each unit
  -- ------------------------------------------------------------------------
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000001', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000001';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000001', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000002';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000001', node_index = 2
  WHERE id = 'b1110000-aaaa-4000-8000-000000000003';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000101', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000004';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000101', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000005';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000102', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000006';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000102', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000007';

  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000002', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000008';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000002', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000009';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000002', node_index = 2
  WHERE id = 'b1110000-aaaa-4000-8000-000000000010';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000201', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000011';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000201', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000012';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000202', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000013';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000202', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000014';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000202', node_index = 2
  WHERE id = 'b1110000-aaaa-4000-8000-000000000015';

  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000003', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000016';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000003', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000017';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000301', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000018';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000301', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000019';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000302', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000020';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000302', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000021';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000302', node_index = 2
  WHERE id = 'b1110000-aaaa-4000-8000-000000000022';

  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000004', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000023';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000004', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000024';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000401', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000025';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000401', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000026';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000402', node_index = 0
  WHERE id = 'b1110000-aaaa-4000-8000-000000000027';
  UPDATE journey_template_nodes
  SET unit_id = 'b1100000-aaaa-4000-8000-000000000402', node_index = 1
  WHERE id = 'b1110000-aaaa-4000-8000-000000000028';

  -- ------------------------------------------------------------------------
  -- 5. Recompute enrollment position from the active node, if any
  -- ------------------------------------------------------------------------
  WITH active_nodes AS (
    SELECT
      e.id AS enrollment_id,
      u.id AS unit_id,
      u.unit_number,
      u.section_unit_number,
      s.id AS section_id,
      s.section_number
    FROM user_journey_enrollments e
    JOIN user_node_progress np
      ON np.enrollment_id = e.id
     AND np.status = 'active'
    JOIN journey_template_nodes n ON n.id = np.node_id
    JOIN journey_template_units u ON u.id = n.unit_id
    JOIN journey_template_sections s ON s.id = u.section_id
    WHERE e.journey_id = v_journey_id
      AND e.status = 'active'
  )
  UPDATE user_journey_enrollments e
  SET
    current_unit_id = a.unit_id,
    current_unit_number = a.unit_number,
    current_section_id = a.section_id,
    current_section_number = a.section_number,
    current_section_unit_number = a.section_unit_number
  FROM active_nodes a
  WHERE e.id = a.enrollment_id;

  -- If an active enrollment somehow has no active node row, fall back to the
  -- first unit of the stored/current section instead of leaving the new fields stale.
  UPDATE user_journey_enrollments e
  SET
    current_section_id = s.id,
    current_section_number = s.section_number,
    current_unit_id = u.id,
    current_unit_number = u.unit_number,
    current_section_unit_number = u.section_unit_number
  FROM journey_template_sections s
  JOIN journey_template_units u
    ON u.section_id = s.id
   AND u.section_unit_number = 1
  WHERE e.journey_id = v_journey_id
    AND e.status = 'active'
    AND NOT EXISTS (
      SELECT 1
      FROM user_node_progress np
      WHERE np.enrollment_id = e.id
        AND np.status = 'active'
    )
    AND s.journey_id = e.journey_id
    AND s.section_number = COALESCE(e.current_section_number, 1);
END $$;

NOTIFY pgrst, 'reload schema';
