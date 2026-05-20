-- ============================================================================
-- Create a new v5 journey course with:
-- - 6 sections
-- - 8 units in each section
-- - 10 lesson nodes in each unit
--
-- Run this directly in the Supabase SQL Editor after the v5 journey schema
-- migrations have been applied.
--
-- Optional:
-- - set `enroll_user_id` to an auth.users.id to enroll a specific user
-- - update the course title/description/color before running
-- ============================================================================

DROP TABLE IF EXISTS pg_temp.seed_course_result;

CREATE TEMP TABLE seed_course_result (
  course_id UUID NOT NULL,
  title TEXT NOT NULL,
  section_count INT NOT NULL,
  unit_count INT NOT NULL,
  node_count INT NOT NULL,
  is_enrolled BOOLEAN NOT NULL
) ON COMMIT DROP;

DO $$
DECLARE
  course_title TEXT := 'Anxiety Reset';
  course_description TEXT := 'A large sample journey course with six sections, forty-eight units, and four hundred eighty lesson nodes.';
  course_icon_url TEXT := NULL;
  course_color_hex TEXT := 'FF9600';
  course_order_index INT := NULL;
  is_published BOOLEAN := TRUE;
  enroll_user_id UUID := NULL;

  section_total INT := 6;
  units_per_section INT := 8;
  nodes_per_unit INT := 10;

  section_titles TEXT[] := ARRAY[
    'Foundations',
    'Thought Patterns',
    'Body Regulation',
    'Behavior Change',
    'Daily Practice',
    'Long-Term Resilience'
  ];

  icon_keys TEXT[] := ARRAY[
    'brain',
    'shield',
    'heart',
    'target',
    'spark',
    'journal',
    'star',
    'toolbox'
  ];

  created_course_id UUID;
  created_section_id UUID;
  created_unit_id UUID;
  created_node_id UUID;
  created_content_id UUID;

  section_number INT;
  unit_number INT;
  node_number INT;

  created_unit_count INT := 0;
  created_node_count INT := 0;
BEGIN
  INSERT INTO courses (
    title,
    description,
    icon_url,
    color_hex,
    order_index,
    is_published
  )
  VALUES (
    course_title,
    course_description,
    course_icon_url,
    course_color_hex,
    COALESCE(
      course_order_index,
      (SELECT COALESCE(MAX(order_index), 0) + 1 FROM courses)
    ),
    is_published
  )
  RETURNING id INTO created_course_id;

  FOR section_number IN 1..section_total LOOP
    INSERT INTO sections (
      course_id,
      title,
      order_index
    )
    VALUES (
      created_course_id,
      format('Section %s · %s', section_number, section_titles[section_number]),
      section_number
    )
    RETURNING id INTO created_section_id;

    FOR unit_number IN 1..units_per_section LOOP
      INSERT INTO units (
        section_id,
        title,
        icon_key,
        order_index
      )
      VALUES (
        created_section_id,
        format('Unit %s', unit_number),
        icon_keys[unit_number],
        unit_number
      )
      RETURNING id INTO created_unit_id;

      created_unit_count := created_unit_count + 1;

      FOR node_number IN 1..nodes_per_unit LOOP
        INSERT INTO nodes (
          unit_id,
          title,
          type,
          content_type,
          pass_threshold,
          order_index,
          estimated_mins
        )
        VALUES (
          created_unit_id,
          format('Lesson %s', node_number),
          'lesson',
          'lesson',
          NULL,
          node_number,
          4
        )
        RETURNING id INTO created_node_id;

        INSERT INTO lesson_contents (
          node_id,
          screens
        )
        VALUES (
          created_node_id,
          jsonb_build_array(
            jsonb_build_object(
              'order', 1,
              'type', 'text',
              'body', format(
                'Welcome to Section %s, Unit %s, Lesson %s.',
                section_number,
                unit_number,
                node_number
              )
            ),
            jsonb_build_object(
              'order', 2,
              'type', 'text',
              'body', format(
                'This placeholder lesson belongs to %s and is ready for real content.',
                course_title
              )
            ),
            jsonb_build_object(
              'order', 3,
              'type', 'text',
              'body', 'Replace these sample screens with your production lesson copy, media, or exercises.'
            )
          )
        )
        RETURNING id INTO created_content_id;

        UPDATE nodes
        SET content_id = created_content_id
        WHERE id = created_node_id;

        created_node_count := created_node_count + 1;
      END LOOP;
    END LOOP;
  END LOOP;

  IF enroll_user_id IS NOT NULL THEN
    INSERT INTO user_course_progress (
      user_id,
      course_id,
      status,
      started_at
    )
    VALUES (
      enroll_user_id,
      created_course_id,
      'in_progress',
      NOW()
    )
    ON CONFLICT (user_id, course_id) DO UPDATE
    SET
      status = EXCLUDED.status,
      started_at = COALESCE(user_course_progress.started_at, EXCLUDED.started_at),
      completed_at = NULL;
  END IF;

  INSERT INTO pg_temp.seed_course_result (
    course_id,
    title,
    section_count,
    unit_count,
    node_count,
    is_enrolled
  )
  VALUES (
    created_course_id,
    course_title,
    section_total,
    created_unit_count,
    created_node_count,
    enroll_user_id IS NOT NULL
  );
END
$$;

SELECT
  course_id,
  title,
  section_count,
  unit_count,
  node_count,
  is_enrolled
FROM seed_course_result;
