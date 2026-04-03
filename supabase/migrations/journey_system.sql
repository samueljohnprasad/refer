-- ============================================================================
-- Multi-Journey Challenge System
-- Migration: Creates template catalog, user enrollments, and node progress
-- Run this SQL in your Supabase SQL Editor
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. journey_templates — top-level catalog of available journeys
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journey_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_url TEXT,
  color_scheme TEXT NOT NULL DEFAULT 'green'
    CHECK (color_scheme IN ('green', 'blue', 'purple', 'orange')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 2. journey_template_units — sections within a journey
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journey_template_units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  unit_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color_scheme TEXT NOT NULL DEFAULT 'green'
    CHECK (color_scheme IN ('green', 'blue', 'purple', 'orange')),
  mascot_placements JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(journey_id, unit_number)
);

-- --------------------------------------------------------------------------
-- 3. journey_template_nodes — individual nodes within a unit
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journey_template_nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES journey_template_units(id) ON DELETE CASCADE,
  node_index INTEGER NOT NULL,
  node_type TEXT NOT NULL CHECK (node_type IN ('lesson', 'checkpoint', 'chest')),
  task_id TEXT NOT NULL DEFAULT '',
  rewards JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(unit_id, node_index)
);

-- --------------------------------------------------------------------------
-- 4. user_journey_enrollments — user ↔ journey many-to-many with state
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_journey_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  current_unit_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'abandoned')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  template_version INTEGER NOT NULL DEFAULT 1,

  -- One active enrollment per journey per user
  UNIQUE(user_id, journey_id)
);

-- --------------------------------------------------------------------------
-- 5. user_node_progress — sparse per-node status for each enrollment
--    Only non-locked nodes are stored (locked = no row)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_node_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES user_journey_enrollments(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES journey_template_nodes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('completed', 'active')),
  progress REAL NOT NULL DEFAULT 0.0
    CHECK (progress >= 0.0 AND progress <= 1.0),
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One progress row per node per enrollment
  UNIQUE(enrollment_id, node_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Enrollment lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_user
  ON user_journey_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_active
  ON user_journey_enrollments(user_id, status)
  WHERE status = 'active';

-- Progress fetches (the hot path)
CREATE INDEX IF NOT EXISTS idx_node_progress_enrollment
  ON user_node_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_node_progress_user_node
  ON user_node_progress(user_id, node_id);

-- Template browsing
CREATE INDEX IF NOT EXISTS idx_templates_active
  ON journey_templates(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_template_units_journey
  ON journey_template_units(journey_id, unit_number);
CREATE INDEX IF NOT EXISTS idx_template_nodes_unit
  ON journey_template_nodes(unit_id, node_index);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE journey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_template_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_template_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_node_progress ENABLE ROW LEVEL SECURITY;

-- Templates: public catalog (read-only for authenticated users)
CREATE POLICY "Anyone can read active templates"
  ON journey_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can read template units"
  ON journey_template_units FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read template nodes"
  ON journey_template_nodes FOR SELECT
  USING (true);

-- Enrollments: users own their data
CREATE POLICY "Users can view own enrollments"
  ON user_journey_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments"
  ON user_journey_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
  ON user_journey_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- Progress: users own their data
CREATE POLICY "Users can view own progress"
  ON user_node_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_node_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_node_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at on journey_templates
CREATE OR REPLACE FUNCTION update_journey_template_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_journey_template_updated_at
  BEFORE UPDATE ON journey_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_journey_template_timestamp();

-- Auto-update updated_at on user_node_progress
CREATE OR REPLACE FUNCTION update_node_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_node_progress_updated_at
  BEFORE UPDATE ON user_node_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_node_progress_timestamp();

-- ============================================================================
-- RPC FUNCTIONS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- get_journey_template: returns full template tree for a given slug
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
    'units', COALESCE((
      SELECT json_agg(unit_row ORDER BY unit_row."unitNumber")
      FROM (
        SELECT
          u.id,
          u.unit_number AS "unitNumber",
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
        WHERE u.journey_id = j.id
      ) unit_row
    ), '[]'::json)
  )
  FROM journey_templates j
  WHERE j.slug = p_slug AND j.is_active = true;
$$ LANGUAGE sql STABLE;

-- ---------------------------------------------------------------------------
-- get_user_journey_progress: returns enrollment + node progress for a journey
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_journey_progress(p_journey_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'enrollment', json_build_object(
      'id', e.id,
      'journeyId', e.journey_id,
      'currentUnitNumber', e.current_unit_number,
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
-- get_journey_catalog: all active journeys with user enrollment summary
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_journey_catalog()
RETURNS JSON AS $$
  SELECT COALESCE(json_agg(
    json_build_object(
      'id', j.id,
      'slug', j.slug,
      'title', j.title,
      'description', j.description,
      'iconUrl', j.icon_url,
      'colorScheme', j.color_scheme,
      'totalNodes', (
        SELECT COUNT(*)
        FROM journey_template_nodes n
        JOIN journey_template_units u ON n.unit_id = u.id
        WHERE u.journey_id = j.id
      ),
      'isEnrolled', EXISTS(
        SELECT 1 FROM user_journey_enrollments e
        WHERE e.journey_id = j.id
          AND e.user_id = auth.uid()
          AND e.status = 'active'
      ),
      'enrollmentStatus', (
        SELECT e.status FROM user_journey_enrollments e
        WHERE e.journey_id = j.id AND e.user_id = auth.uid()
        ORDER BY e.enrolled_at DESC LIMIT 1
      ),
      'completedNodes', COALESCE((
        SELECT COUNT(*)
        FROM user_node_progress np
        JOIN user_journey_enrollments e ON np.enrollment_id = e.id
        WHERE e.journey_id = j.id
          AND e.user_id = auth.uid()
          AND np.status = 'completed'
      ), 0)
    )
    ORDER BY j.sort_order
  ), '[]'::json)
  FROM journey_templates j
  WHERE j.is_active = true;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- complete_journey_node: atomic node completion + reward granting
-- Validates node is active, marks completed, unlocks next, grants rewards
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
  v_next_node journey_template_nodes%ROWTYPE;
  v_reward JSONB;
  v_xp_total INTEGER := 0;
  v_gems_total INTEGER := 0;
  v_hearts_total INTEGER := 0;
BEGIN
  v_user_id := auth.uid();

  -- 1. Validate the node progress row exists and is active
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

  -- 2. Get the template node for rewards
  SELECT * INTO v_node
  FROM journey_template_nodes
  WHERE id = p_node_id;

  -- 3. Get the unit for ordering
  SELECT * INTO v_unit
  FROM journey_template_units
  WHERE id = v_node.unit_id;

  -- 4. Mark current node as completed
  UPDATE user_node_progress
  SET status = 'completed',
      progress = 1.0,
      completed_at = NOW()
  WHERE id = v_node_progress.id;

  -- 5. Find and unlock the next node in sequence
  SELECT * INTO v_next_node
  FROM journey_template_nodes
  WHERE unit_id = v_node.unit_id
    AND node_index = v_node.node_index + 1;

  IF FOUND THEN
    -- Next node exists in same unit — create active progress row
    INSERT INTO user_node_progress (user_id, enrollment_id, node_id, status, progress)
    VALUES (v_user_id, p_enrollment_id, v_next_node.id, 'active', 0.0)
    ON CONFLICT (enrollment_id, node_id) DO UPDATE SET status = 'active', progress = 0.0;
  ELSE
    -- No more nodes in this unit — check for next unit
    DECLARE
      v_next_unit journey_template_units%ROWTYPE;
      v_first_node_of_next_unit journey_template_nodes%ROWTYPE;
    BEGIN
      SELECT * INTO v_next_unit
      FROM journey_template_units
      WHERE journey_id = v_unit.journey_id
        AND unit_number = v_unit.unit_number + 1;

      IF FOUND THEN
        -- Advance enrollment to next unit
        UPDATE user_journey_enrollments
        SET current_unit_number = v_next_unit.unit_number
        WHERE id = p_enrollment_id;

        -- Unlock first node of next unit
        SELECT * INTO v_first_node_of_next_unit
        FROM journey_template_nodes
        WHERE unit_id = v_next_unit.id
          AND node_index = 0;

        IF FOUND THEN
          INSERT INTO user_node_progress (user_id, enrollment_id, node_id, status, progress)
          VALUES (v_user_id, p_enrollment_id, v_first_node_of_next_unit.id, 'active', 0.0)
          ON CONFLICT (enrollment_id, node_id) DO UPDATE SET status = 'active', progress = 0.0;
        END IF;
      ELSE
        -- No more units — journey is completed
        UPDATE user_journey_enrollments
        SET status = 'completed', completed_at = NOW()
        WHERE id = p_enrollment_id;
      END IF;
    END;
  END IF;

  -- 6. Parse rewards and grant them
  FOR v_reward IN SELECT * FROM jsonb_array_elements(v_node.rewards)
  LOOP
    CASE v_reward->>'type'
      WHEN 'xp' THEN
        v_xp_total := v_xp_total + (v_reward->>'amount')::INTEGER;
      WHEN 'gems' THEN
        v_gems_total := v_gems_total + (v_reward->>'amount')::INTEGER;
      WHEN 'hearts' THEN
        v_hearts_total := v_hearts_total + (v_reward->>'amount')::INTEGER;
      ELSE NULL; -- achievements handled separately
    END CASE;
  END LOOP;

  -- Grant XP
  IF v_xp_total > 0 THEN
    UPDATE user_xp SET total_xp = total_xp + v_xp_total, today_xp = today_xp + v_xp_total
    WHERE user_id = v_user_id;

    INSERT INTO xp_history (user_id, action, amount, description)
    VALUES (v_user_id, 'journey_node_complete', v_xp_total, 'Completed journey node ' || p_node_id::TEXT);
  END IF;

  -- Grant gems
  IF v_gems_total > 0 THEN
    UPDATE user_wallet SET gems = gems + v_gems_total WHERE user_id = v_user_id;
  END IF;

  -- 7. Return success with granted rewards
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

-- ============================================================================
-- Reload PostgREST schema cache so new RPC functions are visible immediately
-- ============================================================================
NOTIFY pgrst, 'reload schema';
