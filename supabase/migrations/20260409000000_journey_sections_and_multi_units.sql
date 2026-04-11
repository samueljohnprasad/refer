-- ============================================================================
-- Real Journey Sections + Multi-Unit Progression
-- Migration: 20260409000000_journey_sections_and_multi_units.sql
--
-- Introduces a true hierarchy:
--   journey -> section -> unit -> node
--
-- Keeps backward compatibility by preserving:
--   - journey_template_units.unit_number as the global unit order
--   - get_section_map(p_unit_number) where p_unit_number still means
--     the section number to fetch
-- ============================================================================ 

-- ---------------------------------------------------------------------------
-- 1. Create real journey sections
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journey_template_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color_scheme TEXT NOT NULL DEFAULT 'green'
    CHECK (color_scheme IN ('green', 'blue', 'purple', 'orange')),
  mascot_placements JSONB NOT NULL DEFAULT '[]'::jsonb,
  unlock_rule TEXT NOT NULL DEFAULT 'sequential'
    CHECK (unlock_rule IN ('sequential', 'placement_test', 'immediate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(journey_id, section_number)
);

CREATE INDEX IF NOT EXISTS idx_template_sections_journey
  ON journey_template_sections(journey_id, section_number);

ALTER TABLE journey_template_sections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = current_schema()
      AND tablename = 'journey_template_sections'
      AND policyname = 'Anyone can read template sections'
  ) THEN
    CREATE POLICY "Anyone can read template sections"
      ON journey_template_sections FOR SELECT
      USING (true);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Extend units to belong to sections
-- ---------------------------------------------------------------------------
ALTER TABLE journey_template_units
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES journey_template_sections(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS section_unit_number INTEGER;

CREATE INDEX IF NOT EXISTS idx_template_units_section
  ON journey_template_units(section_id, section_unit_number);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'journey_template_units_section_id_section_unit_number_key'
  ) THEN
    ALTER TABLE journey_template_units
      ADD CONSTRAINT journey_template_units_section_id_section_unit_number_key
      UNIQUE (section_id, section_unit_number);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Extend enrollments with explicit section + unit tracking
-- ---------------------------------------------------------------------------
ALTER TABLE user_journey_enrollments
  ADD COLUMN IF NOT EXISTS current_section_id UUID REFERENCES journey_template_sections(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS current_unit_id UUID REFERENCES journey_template_units(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS current_section_number INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_section_unit_number INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_enrollments_current_section
  ON user_journey_enrollments(user_id, current_section_number)
  WHERE status = 'active';

-- ---------------------------------------------------------------------------
-- 4. Backfill sections from existing "unit == section" data
-- ---------------------------------------------------------------------------
INSERT INTO journey_template_sections (
  journey_id,
  section_number,
  title,
  description,
  color_scheme,
  mascot_placements,
  unlock_rule
)
SELECT
  u.journey_id,
  u.unit_number,
  u.title,
  u.description,
  u.color_scheme,
  u.mascot_placements,
  u.unlock_rule
FROM journey_template_units u
ON CONFLICT (journey_id, section_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  color_scheme = EXCLUDED.color_scheme,
  mascot_placements = EXCLUDED.mascot_placements,
  unlock_rule = EXCLUDED.unlock_rule;

UPDATE journey_template_units u
SET
  section_id = s.id,
  section_unit_number = COALESCE(u.section_unit_number, 1)
FROM journey_template_sections s
WHERE s.journey_id = u.journey_id
  AND s.section_number = u.unit_number
  AND (u.section_id IS NULL OR u.section_unit_number IS NULL);

UPDATE user_journey_enrollments e
SET
  current_section_id = s.id,
  current_unit_id = u.id,
  current_section_number = COALESCE(e.current_section_number, s.section_number),
  current_section_unit_number = COALESCE(
    e.current_section_unit_number,
    u.section_unit_number,
    1
  )
FROM journey_template_units u
JOIN journey_template_sections s ON s.id = u.section_id
WHERE e.journey_id = u.journey_id
  AND e.current_unit_number = u.unit_number
  AND (
    e.current_section_id IS NULL OR
    e.current_unit_id IS NULL OR
    e.current_section_number IS NULL OR
    e.current_section_unit_number IS NULL
  );

-- ---------------------------------------------------------------------------
-- 5. Rebuild RPCs on top of real sections
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- get_journey_template: still returns flat units for compatibility,
-- and now also includes sections with nested units.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_journey_template(p_slug TEXT)
RETURNS JSON AS $$
  SELECT json_build_object(
    'id', j.id,
    'slug', j.slug,
    'title', j.title,
    'description', j.description,
    'version', j.version,
    'colorScheme', j.color_scheme,
    'category', j.category,
    'difficulty', j.difficulty,
    'estimatedDays', j.estimated_days,
    'totalNodes', j.total_nodes,
    'colorThemeKey', j.color_theme_key,
    'iconKey', j.icon_key,
    'sections', COALESCE((
      SELECT json_agg(section_row ORDER BY section_row."sectionNumber")
      FROM (
        SELECT
          s.id,
          s.section_number AS "sectionNumber",
          s.title,
          s.description,
          s.color_scheme AS "colorScheme",
          s.mascot_placements AS "mascotPlacements",
          s.unlock_rule AS "unlockRule",
          COALESCE((
            SELECT json_agg(unit_row ORDER BY unit_row."unitNumber")
            FROM (
              SELECT
                u.id,
                u.section_unit_number AS "unitNumber",
                u.unit_number AS "globalUnitNumber",
                u.title,
                u.description,
                u.color_scheme AS "colorScheme",
                u.mascot_placements AS "mascotPlacements",
                u.unlock_rule AS "unlockRule",
                COALESCE((
                  SELECT json_agg(node_row ORDER BY node_row."nodeIndex")
                  FROM (
                    SELECT
                      n.id,
                      n.node_index AS "nodeIndex",
                      n.node_type AS "nodeType",
                      n.task_id AS "taskId",
                      n.rewards,
                      n.metadata,
                      n.title,
                      n.description,
                      n.content,
                      n.xp_reward AS "xpReward",
                      n.estimated_minutes AS "estimatedMinutes",
                      n.icon_key AS "iconKey",
                      n.variant_key AS "variantKey"
                    FROM journey_template_nodes n
                    WHERE n.unit_id = u.id
                  ) node_row
                ), '[]'::json) AS nodes
              FROM journey_template_units u
              WHERE u.section_id = s.id
            ) unit_row
          ), '[]'::json) AS units
        FROM journey_template_sections s
        WHERE s.journey_id = j.id
      ) section_row
    ), '[]'::json),
    'units', COALESCE((
      SELECT json_agg(unit_row ORDER BY unit_row."unitNumber")
      FROM (
        SELECT
          u.id,
          u.unit_number AS "unitNumber",
          u.section_id AS "sectionId",
          s.section_number AS "sectionNumber",
          u.section_unit_number AS "sectionUnitNumber",
          u.title,
          u.description,
          u.color_scheme AS "colorScheme",
          u.mascot_placements AS "mascotPlacements",
          COALESCE((
            SELECT json_agg(node_row ORDER BY node_row."nodeIndex")
            FROM (
              SELECT
                n.id,
                n.node_index AS "nodeIndex",
                n.node_type AS "nodeType",
                n.task_id AS "taskId",
                n.rewards,
                n.metadata
              FROM journey_template_nodes n
              WHERE n.unit_id = u.id
            ) node_row
          ), '[]'::json) AS nodes
        FROM journey_template_units u
        JOIN journey_template_sections s ON s.id = u.section_id
        WHERE u.journey_id = j.id
      ) unit_row
    ), '[]'::json)
  )
  FROM journey_templates j
  WHERE j.slug = p_slug AND j.is_active = true;
$$ LANGUAGE sql STABLE;

-- ---------------------------------------------------------------------------
-- get_user_journey_progress: add explicit section/unit position fields
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_journey_progress(p_journey_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'enrollment', json_build_object(
      'id', e.id,
      'journeyId', e.journey_id,
      'currentUnitNumber', e.current_unit_number,
      'currentSectionNumber', e.current_section_number,
      'currentSectionUnitNumber', e.current_section_unit_number,
      'status', e.status,
      'enrolledAt', e.enrolled_at,
      'templateVersion', e.template_version
    ),
    'nodeProgress', COALESCE((
      SELECT json_agg(
        json_build_object(
          'nodeId', np.node_id,
          'status', np.status,
          'progress', np.progress,
          'rewardClaimed', np.reward_claimed,
          'completedAt', np.completed_at
        )
      )
      FROM user_node_progress np
      WHERE np.enrollment_id = e.id
    ), '[]'::json)
  )
  FROM user_journey_enrollments e
  WHERE e.user_id = auth.uid()
    AND e.journey_id = p_journey_id
    AND e.status = 'active';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- complete_journey_node: node -> next unit in section -> next section
-- ---------------------------------------------------------------------------
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

  SELECT * INTO v_next_node
  FROM journey_template_nodes
  WHERE unit_id = v_node.unit_id
    AND node_index = v_node.node_index + 1;

  IF FOUND THEN
    INSERT INTO user_node_progress (user_id, enrollment_id, node_id, status, progress)
    VALUES (v_user_id, p_enrollment_id, v_next_node.id, 'active', 0.0)
    ON CONFLICT (enrollment_id, node_id)
    DO UPDATE SET
      status = 'active',
      progress = 0.0,
      completed_at = NULL;
  ELSE
    SELECT * INTO v_next_unit
    FROM journey_template_units
    WHERE section_id = v_unit.section_id
      AND section_unit_number = v_unit.section_unit_number + 1;

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
        AND node_index = 0;

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
      SELECT * INTO v_next_section
      FROM journey_template_sections
      WHERE journey_id = v_section.journey_id
        AND section_number = v_section.section_number + 1;

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
          AND node_index = 0;

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

-- ---------------------------------------------------------------------------
-- get_section_map: now returns one real section with nested units
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_section_map(
  p_slug TEXT,
  p_unit_number INTEGER DEFAULT NULL
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
  v_can_interact BOOLEAN;
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
    AND e.status = 'active';

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

  IF v_target_section = 1 THEN
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

  RETURN json_build_object(
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

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
