-- Bulletproof implementation of complete_journey_node to prevent silent failures

CREATE OR REPLACE FUNCTION complete_journey_node(
  p_enrollment_id UUID,
  p_node_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_node_progress user_node_progress%ROWTYPE;
  v_node journey_template_nodes%ROWTYPE;
  v_unit journey_template_units%ROWTYPE;
  v_section journey_template_sections%ROWTYPE;
  v_next_node journey_template_nodes%ROWTYPE;
  v_next_unit journey_template_units%ROWTYPE;
  v_next_section journey_template_sections%ROWTYPE;
  v_first_node_of_next_unit journey_template_nodes%ROWTYPE;
  v_reward JSONB;
  v_xp_total INTEGER := 0;
  v_gems_total INTEGER := 0;
  v_hearts_total INTEGER := 0;
BEGIN
  v_user_id := auth.uid();

  SELECT * INTO v_node_progress
  FROM user_node_progress
  WHERE enrollment_id = p_enrollment_id
    AND node_id = p_node_id
    AND user_id = v_user_id
    AND status = 'active'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Node is not active or not found');
  END IF;

  SELECT * INTO v_node
  FROM journey_template_nodes
  WHERE id = p_node_id;

  SELECT * INTO v_unit
  FROM journey_template_units
  WHERE id = v_node.unit_id;

  SELECT * INTO v_section
  FROM journey_template_sections
  WHERE id = v_unit.section_id;

  UPDATE user_node_progress
  SET status = 'completed',
      progress = 1.0,
      completed_at = NOW()
  WHERE id = v_node_progress.id;

  -- Use strictly > to safely find the next node regardless of index gaps
  SELECT * INTO v_next_node
  FROM journey_template_nodes
  WHERE unit_id = v_node.unit_id
    AND node_index > v_node.node_index
  ORDER BY node_index ASC
  LIMIT 1;

  IF FOUND THEN
    INSERT INTO user_node_progress (user_id, enrollment_id, node_id, status, progress)
    VALUES (v_user_id, p_enrollment_id, v_next_node.id, 'active', 0.0)
    ON CONFLICT (enrollment_id, node_id)
    DO UPDATE SET
      status = 'active',
      progress = 0.0,
      completed_at = NULL;
  ELSE
    -- Reached the end of the unit. Find the next unit safely.
    SELECT * INTO v_next_unit
    FROM journey_template_units
    WHERE section_id = v_unit.section_id
      AND section_unit_number > v_unit.section_unit_number
    ORDER BY section_unit_number ASC
    LIMIT 1;

    IF FOUND THEN
      UPDATE user_journey_enrollments
      SET current_section_id = v_section.id,
          current_unit_id = v_next_unit.id,
          current_section_number = v_section.section_number,
          current_section_unit_number = v_next_unit.section_unit_number,
          current_unit_number = v_next_unit.unit_number
      WHERE id = p_enrollment_id;

      SELECT * INTO v_first_node_of_next_unit
      FROM journey_template_nodes
      WHERE unit_id = v_next_unit.id
      ORDER BY node_index ASC
      LIMIT 1;

      IF FOUND THEN
        INSERT INTO user_node_progress (user_id, enrollment_id, node_id, status, progress)
        VALUES (v_user_id, p_enrollment_id, v_first_node_of_next_unit.id, 'active', 0.0)
        ON CONFLICT (enrollment_id, node_id)
        DO UPDATE SET
          status = 'active',
          progress = 0.0,
          completed_at = NULL;
      END IF;
    ELSE
      -- Reached the end of the section. Find the next section safely.
      SELECT * INTO v_next_section
      FROM journey_template_sections
      WHERE journey_id = v_section.journey_id
        AND section_number > v_section.section_number
      ORDER BY section_number ASC
      LIMIT 1;

      IF FOUND THEN
        SELECT * INTO v_next_unit
        FROM journey_template_units
        WHERE section_id = v_next_section.id
        ORDER BY section_unit_number ASC
        LIMIT 1;

        UPDATE user_journey_enrollments
        SET current_section_id = v_next_section.id,
            current_unit_id = v_next_unit.id,
            current_section_number = v_next_section.section_number,
            current_section_unit_number = v_next_unit.section_unit_number,
            current_unit_number = v_next_unit.unit_number
        WHERE id = p_enrollment_id;

        SELECT * INTO v_first_node_of_next_unit
        FROM journey_template_nodes
        WHERE unit_id = v_next_unit.id
        ORDER BY node_index ASC
        LIMIT 1;

        IF FOUND THEN
          INSERT INTO user_node_progress (user_id, enrollment_id, node_id, status, progress)
          VALUES (v_user_id, p_enrollment_id, v_first_node_of_next_unit.id, 'active', 0.0)
          ON CONFLICT (enrollment_id, node_id)
          DO UPDATE SET
            status = 'active',
            progress = 0.0,
            completed_at = NULL;
        END IF;
      ELSE
        UPDATE user_journey_enrollments
        SET status = 'completed',
            completed_at = NOW()
        WHERE id = p_enrollment_id;
      END IF;
    END IF;
  END IF;

  -- Gracefully handle NULL or non-array rewards
  IF v_node.rewards IS NOT NULL AND jsonb_typeof(v_node.rewards) = 'array' THEN
    FOR v_reward IN SELECT * FROM jsonb_array_elements(v_node.rewards)
    LOOP
      CASE v_reward->>'type'
        WHEN 'xp' THEN
          v_xp_total := v_xp_total + COALESCE((v_reward->>'amount')::INTEGER, 0);
        WHEN 'gems' THEN
          v_gems_total := v_gems_total + COALESCE((v_reward->>'amount')::INTEGER, 0);
        WHEN 'hearts' THEN
          v_hearts_total := v_hearts_total + COALESCE((v_reward->>'amount')::INTEGER, 0);
        ELSE NULL;
      END CASE;
    END LOOP;
  END IF;

  IF v_xp_total > 0 THEN
    UPDATE user_xp
    SET total_xp = total_xp + v_xp_total,
        today_xp = today_xp + v_xp_total
    WHERE user_id = v_user_id;

    INSERT INTO xp_history (user_id, action, amount, description)
    VALUES (
      v_user_id,
      'journey_node_complete',
      v_xp_total,
      'Completed journey node ' || p_node_id::TEXT
    );
  END IF;

  IF v_gems_total > 0 THEN
    UPDATE user_wallet
    SET gems = gems + v_gems_total
    WHERE user_id = v_user_id;
  END IF;

  RETURN json_build_object(
    'success', true,
    'rewards', json_build_object(
      'xp', v_xp_total,
      'gems', v_gems_total,
      'hearts', v_hearts_total
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
