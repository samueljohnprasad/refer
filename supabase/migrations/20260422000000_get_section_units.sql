/**
 * Lightweight RPC: returns only units + nodes (with server-resolved status)
 * for a given journey slug and section number.
 *
 * Enrolled courses API provides everything else (journey meta, section list,
 * enrollment info). This RPC is the only per-section fetch needed.
 */

CREATE OR REPLACE FUNCTION get_section_units(
  p_slug TEXT,
  p_section_number INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_journey_id UUID;
  v_section_id UUID;
  v_enrollment_id UUID;
BEGIN
  -- Resolve journey
  SELECT j.id INTO v_journey_id
  FROM journey_templates j
  WHERE j.slug = p_slug AND j.is_active = true;

  IF v_journey_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Resolve section
  SELECT s.id INTO v_section_id
  FROM journey_template_sections s
  WHERE s.journey_id = v_journey_id
    AND s.section_number = p_section_number;

  IF v_section_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Resolve active enrollment (for status LEFT JOIN)
  SELECT e.id INTO v_enrollment_id
  FROM user_journey_enrollments e
  WHERE e.user_id = auth.uid()
    AND e.journey_id = v_journey_id
    AND e.status = 'active'
  ORDER BY e.enrolled_at DESC
  LIMIT 1;

  -- Return units with nodes (status resolved via LEFT JOIN)
  RETURN COALESCE((
    SELECT json_agg(unit_row ORDER BY unit_row."unitNumber")
    FROM (
      SELECT
        u.id,
        u.section_id       AS "sectionId",
        p_section_number    AS "sectionNumber",
        u.section_unit_number AS "unitNumber",
        u.unit_number       AS "globalUnitNumber",
        u.title,
        u.description,
        u.color_scheme      AS "colorScheme",
        u.mascot_placements AS "mascotPlacements",
        COALESCE((
          SELECT json_agg(
            json_build_object(
              'id', n.id,
              'unitId', u.id,
              'unitNumber', u.section_unit_number,
              'globalUnitNumber', u.unit_number,
              'index', n.node_index,
              'taskType', n.node_type,
              'type', CASE n.node_type
                WHEN 'checkpoint' THEN 'checkpoint'
                WHEN 'chest' THEN 'chest'
                ELSE 'lesson'
              END,
              'taskId', n.task_id,
              'variantKey', n.variant_key,
              'title', n.title,
              'iconKey', n.icon_key,
              'xpReward', n.xp_reward,
              'estimatedMinutes', n.estimated_minutes,
              'rewards', n.rewards,
              'isTrophy',
                (
                  u.section_unit_number = (
                    SELECT MAX(u2.section_unit_number)
                    FROM journey_template_units u2
                    WHERE u2.section_id = v_section_id
                  )
                  AND n.node_index = (
                    SELECT MAX(n2.node_index)
                    FROM journey_template_nodes n2
                    WHERE n2.unit_id = u.id
                  )
                ),
              'status', CASE
                WHEN np.status IS NOT NULL THEN np.status
                ELSE 'locked'
              END,
              'progress', COALESCE(np.progress, 0)
            )
            ORDER BY n.node_index
          )
          FROM journey_template_nodes n
          LEFT JOIN user_node_progress np
            ON np.node_id = n.id
            AND np.enrollment_id = v_enrollment_id
          WHERE n.unit_id = u.id
        ), '[]'::json) AS nodes
      FROM journey_template_units u
      WHERE u.section_id = v_section_id
    ) unit_row
  ), '[]'::json);
END;
$$;

NOTIFY pgrst, 'reload schema';
