-- ============================================================================
-- Completed Journey Revisit
-- Adds first-class completed-journey reads and replay writes.
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_node_replays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  enrollment_id UUID NOT NULL REFERENCES user_journey_enrollments(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES journey_template_nodes(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reward_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  source TEXT NOT NULL DEFAULT 'completed_revisit'
);

CREATE INDEX IF NOT EXISTS user_node_replays_enrollment_completed_idx
  ON user_node_replays(enrollment_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS user_node_replays_node_idx
  ON user_node_replays(node_id);

ALTER TABLE user_node_replays ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION replay_completed_journey_node(
  p_enrollment_id UUID,
  p_node_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_enrollment user_journey_enrollments%ROWTYPE;
  v_node journey_template_nodes%ROWTYPE;
  v_unit journey_template_units%ROWTYPE;
  v_section journey_template_sections%ROWTYPE;
  v_reward JSONB;
  v_xp_total INTEGER := 0;
  v_gems_total INTEGER := 0;
  v_hearts_total INTEGER := 0;
  v_replay_id UUID;
BEGIN
  v_user_id := auth.uid();

  SELECT *
    INTO v_enrollment
  FROM user_journey_enrollments
  WHERE id = p_enrollment_id
    AND user_id = v_user_id
    AND status = 'completed'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Completed enrollment not found'
    );
  END IF;

  SELECT n.*
    INTO v_node
  FROM journey_template_nodes n
  JOIN journey_template_units u ON u.id = n.unit_id
  WHERE n.id = p_node_id
    AND u.journey_id = v_enrollment.journey_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Node does not belong to this journey'
    );
  END IF;

  SELECT *
    INTO v_unit
  FROM journey_template_units
  WHERE id = v_node.unit_id;

  SELECT *
    INTO v_section
  FROM journey_template_sections
  WHERE id = v_unit.section_id;

  FOR v_reward IN SELECT * FROM jsonb_array_elements(v_node.rewards)
  LOOP
    CASE v_reward->>'type'
      WHEN 'xp' THEN
        v_xp_total := v_xp_total + (v_reward->>'amount')::INTEGER;
      WHEN 'gems' THEN
        v_gems_total := v_gems_total + (v_reward->>'amount')::INTEGER;
      WHEN 'hearts' THEN
        v_hearts_total := v_hearts_total + (v_reward->>'amount')::INTEGER;
      ELSE NULL;
    END CASE;
  END LOOP;

  INSERT INTO user_node_replays (
    user_id,
    enrollment_id,
    node_id,
    reward_payload,
    source
  )
  VALUES (
    v_user_id,
    p_enrollment_id,
    p_node_id,
    json_build_object(
      'xp', v_xp_total,
      'gems', v_gems_total,
      'hearts', v_hearts_total,
      'sectionId', v_section.id,
      'unitId', v_unit.id
    )::jsonb,
    'completed_revisit'
  )
  RETURNING id INTO v_replay_id;

  IF v_xp_total > 0 THEN
    UPDATE user_xp
    SET total_xp = total_xp + v_xp_total,
        today_xp = today_xp + v_xp_total
    WHERE user_id = v_user_id;

    INSERT INTO xp_history (user_id, action, amount, description)
    VALUES (
      v_user_id,
      'journey_node_replay',
      v_xp_total,
      'Replayed completed journey node ' || p_node_id::TEXT
    );
  END IF;

  IF v_gems_total > 0 THEN
    UPDATE user_wallet
    SET gems = gems + v_gems_total
    WHERE user_id = v_user_id;
  END IF;

  RETURN json_build_object(
    'success', true,
    'replayId', v_replay_id,
    'rewards', json_build_object(
      'xp', v_xp_total,
      'gems', v_gems_total,
      'hearts', v_hearts_total
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_section_map(
  p_slug TEXT,
  p_unit_number INTEGER DEFAULT NULL,
  p_view_mode TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_journey_id UUID;
  v_journey_version INTEGER;
  v_journey_title TEXT;
  v_journey_color TEXT;
  v_total_sections INTEGER;
  v_target_section INTEGER;
  v_section_id UUID;
  v_section_title TEXT;
  v_section_desc TEXT;
  v_section_color TEXT;
  v_section_mascots JSONB;
  v_section_unlock TEXT;
  v_enrollment_id UUID;
  v_enrollment_status TEXT;
  v_enrollment_ver INTEGER;
  v_enrollment_unit INTEGER;
  v_enrollment_section INTEGER;
  v_enrollment_section_unit INTEGER;
  v_enrollment_section_id UUID;
  v_enrollment_unit_id UUID;
  v_requested_view_mode TEXT := COALESCE(p_view_mode, 'active');
  v_resolved_view_mode TEXT := 'preview';
  v_can_interact BOOLEAN;
  v_focus_node_id UUID;
BEGIN
  SELECT j.id, j.version, j.title, j.color_scheme
    INTO v_journey_id, v_journey_version, v_journey_title, v_journey_color
  FROM journey_templates j
  WHERE j.slug = p_slug
    AND j.is_active = true;

  IF v_journey_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*)::INTEGER
    INTO v_total_sections
  FROM journey_template_sections
  WHERE journey_id = v_journey_id;

  IF v_requested_view_mode = 'completed' THEN
    SELECT
      e.id,
      e.current_unit_number,
      e.current_section_number,
      e.current_section_unit_number,
      e.current_section_id,
      e.current_unit_id,
      e.status,
      e.template_version
      INTO
        v_enrollment_id,
        v_enrollment_unit,
        v_enrollment_section,
        v_enrollment_section_unit,
        v_enrollment_section_id,
        v_enrollment_unit_id,
        v_enrollment_status,
        v_enrollment_ver
    FROM user_journey_enrollments e
    WHERE e.user_id = auth.uid()
      AND e.journey_id = v_journey_id
      AND e.status = 'completed'
    ORDER BY COALESCE(e.completed_at, e.enrolled_at) DESC
    LIMIT 1;

    IF v_enrollment_id IS NOT NULL THEN
      v_resolved_view_mode := 'completed';
    END IF;
  END IF;

  IF v_requested_view_mode = 'active' OR v_resolved_view_mode = 'preview' THEN
    IF v_requested_view_mode <> 'preview' THEN
      SELECT
        e.id,
        e.current_unit_number,
        e.current_section_number,
        e.current_section_unit_number,
        e.current_section_id,
        e.current_unit_id,
        e.status,
        e.template_version
        INTO
          v_enrollment_id,
          v_enrollment_unit,
          v_enrollment_section,
          v_enrollment_section_unit,
          v_enrollment_section_id,
          v_enrollment_unit_id,
          v_enrollment_status,
          v_enrollment_ver
      FROM user_journey_enrollments e
      WHERE e.user_id = auth.uid()
        AND e.journey_id = v_journey_id
        AND e.status = 'active'
      ORDER BY e.enrolled_at DESC
      LIMIT 1;

      IF v_enrollment_id IS NOT NULL THEN
        v_resolved_view_mode := 'active';
      ELSIF v_requested_view_mode <> 'completed' THEN
        v_resolved_view_mode := 'preview';
      END IF;
    END IF;
  END IF;

  IF p_unit_number IS NOT NULL THEN
    v_target_section := p_unit_number;
  ELSIF v_enrollment_section IS NOT NULL THEN
    v_target_section := v_enrollment_section;
  ELSIF v_enrollment_unit IS NOT NULL THEN
    SELECT s.section_number
      INTO v_target_section
    FROM journey_template_units u
    JOIN journey_template_sections s ON s.id = u.section_id
    WHERE u.journey_id = v_journey_id
      AND u.unit_number = v_enrollment_unit
    LIMIT 1;
  ELSE
    v_target_section := 1;
  END IF;

  SELECT
    s.id,
    s.title,
    s.description,
    s.color_scheme,
    s.mascot_placements,
    s.unlock_rule
    INTO
      v_section_id,
      v_section_title,
      v_section_desc,
      v_section_color,
      v_section_mascots,
      v_section_unlock
  FROM journey_template_sections s
  WHERE s.journey_id = v_journey_id
    AND s.section_number = v_target_section;

  IF v_section_id IS NULL THEN
    RETURN NULL;
  END IF;

  IF v_resolved_view_mode = 'completed' THEN
    v_can_interact := true;
  ELSIF v_target_section = 1 THEN
    v_can_interact := true;
  ELSE
    SELECT EXISTS (
      SELECT 1
      FROM user_node_progress np
      JOIN user_journey_enrollments enr ON enr.id = np.enrollment_id
      JOIN journey_template_nodes n ON n.id = np.node_id
      JOIN journey_template_units u ON u.id = n.unit_id
      JOIN journey_template_sections s ON s.id = u.section_id
      WHERE enr.user_id = auth.uid()
        AND enr.journey_id = v_journey_id
        AND enr.status = 'active'
        AND np.status = 'completed'
        AND s.section_number = v_target_section - 1
        AND u.section_unit_number = (
          SELECT MAX(u2.section_unit_number)
          FROM journey_template_units u2
          WHERE u2.section_id = s.id
        )
        AND n.node_index = (
          SELECT MAX(n2.node_index)
          FROM journey_template_nodes n2
          WHERE n2.unit_id = u.id
        )
    ) INTO v_can_interact;
  END IF;

  IF v_resolved_view_mode = 'completed' AND p_unit_number IS NULL THEN
    SELECT n.id
      INTO v_focus_node_id
    FROM journey_template_units u
    JOIN journey_template_nodes n ON n.unit_id = u.id
    WHERE u.section_id = v_section_id
    ORDER BY u.section_unit_number DESC, n.node_index DESC
    LIMIT 1;
  ELSE
    v_focus_node_id := NULL;
  END IF;

  RETURN json_build_object(
    'viewMode', v_resolved_view_mode,
    'focusNodeId', v_focus_node_id,
    'journey', json_build_object(
      'id', v_journey_id,
      'slug', p_slug,
      'title', v_journey_title,
      'version', v_journey_version,
      'colorScheme', v_journey_color,
      'totalSections', v_total_sections
    ),
    'section', json_build_object(
      'id', v_section_id,
      'unitNumber', v_target_section,
      'sectionNumber', v_target_section,
      'title', v_section_title,
      'description', v_section_desc,
      'colorScheme', v_section_color,
      'mascotPlacements', v_section_mascots,
      'unlockRule', v_section_unlock,
      'unitCount', (
        SELECT COUNT(*)::INTEGER
        FROM journey_template_units su
        WHERE su.section_id = v_section_id
      ),
      'nodes', COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', n.id,
            'unitId', u.id,
            'unitNumber', u.section_unit_number,
            'globalUnitNumber', u.unit_number,
            'nodeIndex', n.node_index,
            'nodeType', n.node_type,
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
            'canInteract', v_can_interact
          )
          ORDER BY u.section_unit_number, n.node_index
        )
        FROM journey_template_units u
        JOIN journey_template_nodes n ON n.unit_id = u.id
        WHERE u.section_id = v_section_id
      ), '[]'::json),
      'units', COALESCE((
        SELECT json_agg(unit_row ORDER BY unit_row."unitNumber")
        FROM (
          SELECT
            u.id,
            u.section_id AS "sectionId",
            v_target_section AS "sectionNumber",
            u.section_unit_number AS "unitNumber",
            u.unit_number AS "globalUnitNumber",
            u.title,
            u.description,
            u.color_scheme AS "colorScheme",
            u.mascot_placements AS "mascotPlacements",
            u.unlock_rule AS "unlockRule",
            COALESCE((
              SELECT json_agg(
                json_build_object(
                  'id', n.id,
                  'unitId', u.id,
                  'unitNumber', u.section_unit_number,
                  'globalUnitNumber', u.unit_number,
                  'nodeIndex', n.node_index,
                  'nodeType', n.node_type,
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
                  'canInteract', v_can_interact
                )
                ORDER BY n.node_index
              )
              FROM journey_template_nodes n
              WHERE n.unit_id = u.id
            ), '[]'::json) AS nodes
          FROM journey_template_units u
          WHERE u.section_id = v_section_id
        ) unit_row
      ), '[]'::json)
    ),
    'progress', COALESCE((
      SELECT json_agg(
        json_build_object(
          'nodeId', np.node_id,
          'status', np.status,
          'progress', np.progress,
          'rewardClaimed', np.reward_claimed,
          'completedAt', np.completed_at
        )
        ORDER BY u.section_unit_number, n.node_index
      )
      FROM user_node_progress np
      JOIN journey_template_nodes n ON np.node_id = n.id
      JOIN journey_template_units u ON n.unit_id = u.id
      WHERE np.enrollment_id = v_enrollment_id
        AND u.section_id = v_section_id
    ), '[]'::json),
    'enrollment', CASE
      WHEN v_enrollment_id IS NOT NULL THEN
        json_build_object(
          'id', v_enrollment_id,
          'currentUnitNumber', v_enrollment_unit,
          'currentSectionNumber', v_enrollment_section,
          'currentSectionUnitNumber', v_enrollment_section_unit,
          'currentSectionId', v_enrollment_section_id,
          'currentUnitId', v_enrollment_unit_id,
          'status', v_enrollment_status,
          'templateVersion', v_enrollment_ver
        )
      ELSE NULL
    END,
    'sectionList', COALESCE((
      SELECT json_agg(
        json_build_object(
          'unitNumber', s.section_number,
          'sectionNumber', s.section_number,
          'title', s.title,
          'colorScheme', s.color_scheme,
          'nodeCount', (
            SELECT COUNT(*)::INTEGER
            FROM journey_template_nodes sn
            JOIN journey_template_units su ON sn.unit_id = su.id
            WHERE su.section_id = s.id
          ),
          'unitCount', (
            SELECT COUNT(*)::INTEGER
            FROM journey_template_units su
            WHERE su.section_id = s.id
          )
        )
        ORDER BY s.section_number
      )
      FROM journey_template_sections s
      WHERE s.journey_id = v_journey_id
    ), '[]'::json)
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
