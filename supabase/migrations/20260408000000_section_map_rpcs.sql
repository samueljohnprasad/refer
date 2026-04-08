-- ============================================================================
-- Journey Map Section-Scoped Lazy Loading RPCs
-- Migration: 20260408000000_section_map_rpcs.sql
--
-- Adds two new RPC functions for optimized journey map data fetching:
--   1. get_section_map(slug, unit_number) — single section with node stubs
--   2. get_node_content(node_id)          — full JSONB content on demand
--
-- Benefits:
--   - ~90% reduction in initial payload vs full journey fetch
--   - Preview mode for future sections (visible but non-interactive)
--   - Supports 24-hour client-side caching with version-based invalidation
--
-- No schema changes. No breaking changes to existing RPCs.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. get_section_map — returns one section's node stubs + user progress
--
-- Parameters:
--   p_slug        TEXT    — journey slug (e.g. 'anxiety-toolkit')
--   p_unit_number INTEGER — section number to fetch; NULL = user's current
--
-- Returns JSON with:
--   journey      — high-level journey metadata + totalSections
--   section      — section metadata + node stubs (NO content JSONB)
--     each node includes:
--       isTrophy    — true if last node in section
--       canInteract — true if section is unlocked for interaction
--   progress     — user's node progress for this section only
--   enrollment   — user's active enrollment (or null)
--   sectionList  — all sections (title, colorScheme, nodeCount) for header
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_section_map(
  p_slug        TEXT,
  p_unit_number INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_journey_id      UUID;
  v_journey_version INTEGER;
  v_journey_title   TEXT;
  v_journey_color   TEXT;
  v_total_sections  INTEGER;
  v_target_unit     INTEGER;
  v_unit_id         UUID;
  v_unit_title      TEXT;
  v_unit_desc       TEXT;
  v_unit_color      TEXT;
  v_unit_mascots    JSONB;
  v_unit_unlock     TEXT;
  v_enrollment_id   UUID;
  v_enrollment_unit INTEGER;
  v_enrollment_status TEXT;
  v_enrollment_ver  INTEGER;
  v_can_interact    BOOLEAN;
  v_max_node_index  INTEGER;
BEGIN
  -- ------------------------------------------------------------------
  -- Step 1: Look up the journey
  -- ------------------------------------------------------------------
  SELECT j.id, j.version, j.title, j.color_scheme
    INTO v_journey_id, v_journey_version, v_journey_title, v_journey_color
    FROM journey_templates j
   WHERE j.slug = p_slug
     AND j.is_active = true;

  IF v_journey_id IS NULL THEN
    RETURN NULL;  -- journey not found or inactive
  END IF;

  -- total sections
  SELECT COUNT(*)::INTEGER
    INTO v_total_sections
    FROM journey_template_units
   WHERE journey_id = v_journey_id;

  -- ------------------------------------------------------------------
  -- Step 2: Look up user enrollment (if any)
  -- ------------------------------------------------------------------
  SELECT e.id, e.current_unit_number, e.status, e.template_version
    INTO v_enrollment_id, v_enrollment_unit, v_enrollment_status, v_enrollment_ver
    FROM user_journey_enrollments e
   WHERE e.user_id = auth.uid()
     AND e.journey_id = v_journey_id
     AND e.status = 'active';

  -- ------------------------------------------------------------------
  -- Step 3: Determine which section to return
  -- ------------------------------------------------------------------
  IF p_unit_number IS NOT NULL THEN
    v_target_unit := p_unit_number;
  ELSIF v_enrollment_unit IS NOT NULL THEN
    v_target_unit := v_enrollment_unit;   -- user's current section
  ELSE
    v_target_unit := 1;                   -- first-time user → section 1
  END IF;

  -- ------------------------------------------------------------------
  -- Step 4: Load section metadata
  -- ------------------------------------------------------------------
  SELECT u.id, u.title, u.description, u.color_scheme,
         u.mascot_placements, u.unlock_rule
    INTO v_unit_id, v_unit_title, v_unit_desc, v_unit_color,
         v_unit_mascots, v_unit_unlock
    FROM journey_template_units u
   WHERE u.journey_id = v_journey_id
     AND u.unit_number = v_target_unit;

  IF v_unit_id IS NULL THEN
    RETURN NULL;  -- invalid section number
  END IF;

  -- ------------------------------------------------------------------
  -- Step 5: Compute canInteract for this section
  -- Section 1 always interactive.
  -- Other sections require previous section's trophy (last node) completed.
  -- ------------------------------------------------------------------
  IF v_target_unit = 1 THEN
    v_can_interact := true;
  ELSE
    SELECT EXISTS (
      SELECT 1
        FROM user_node_progress   np
        JOIN journey_template_nodes  prev_trophy ON np.node_id = prev_trophy.id
        JOIN journey_template_units  prev_unit   ON prev_trophy.unit_id = prev_unit.id
        JOIN user_journey_enrollments enr        ON np.enrollment_id = enr.id
       WHERE enr.user_id    = auth.uid()
         AND enr.journey_id = v_journey_id
         AND enr.status     = 'active'
         AND prev_unit.journey_id  = v_journey_id
         AND prev_unit.unit_number = v_target_unit - 1
         AND prev_trophy.node_index = (
               SELECT MAX(n2.node_index)
                 FROM journey_template_nodes n2
                WHERE n2.unit_id = prev_unit.id
             )
         AND np.status = 'completed'
    ) INTO v_can_interact;
  END IF;

  -- ------------------------------------------------------------------
  -- Step 6: Compute max node_index for isTrophy calculation
  -- ------------------------------------------------------------------
  SELECT MAX(n.node_index)
    INTO v_max_node_index
    FROM journey_template_nodes n
   WHERE n.unit_id = v_unit_id;

  -- ------------------------------------------------------------------
  -- Step 7: Build and return the JSON response
  -- ------------------------------------------------------------------
  RETURN json_build_object(
    -- journey metadata
    'journey', json_build_object(
      'id',            v_journey_id,
      'slug',          p_slug,
      'title',         v_journey_title,
      'version',       v_journey_version,
      'colorScheme',   v_journey_color,
      'totalSections', v_total_sections
    ),

    -- section metadata + node stubs
    'section', json_build_object(
      'id',               v_unit_id,
      'unitNumber',       v_target_unit,
      'title',            v_unit_title,
      'description',      v_unit_desc,
      'colorScheme',      v_unit_color,
      'mascotPlacements', v_unit_mascots,
      'unlockRule',       v_unit_unlock,
      'nodes', COALESCE((
        SELECT json_agg(
          json_build_object(
            'id',               n.id,
            'nodeIndex',        n.node_index,
            'nodeType',         n.node_type,
            'taskId',           n.task_id,
            'variantKey',       n.variant_key,
            'title',            n.title,
            'iconKey',          n.icon_key,
            'xpReward',         n.xp_reward,
            'estimatedMinutes', n.estimated_minutes,
            'rewards',          n.rewards,
            'isTrophy',         (n.node_index = v_max_node_index),
            'canInteract',      v_can_interact
          )
          ORDER BY n.node_index
        )
        FROM journey_template_nodes n
        WHERE n.unit_id = v_unit_id
      ), '[]'::json)
    ),

    -- user progress for this section's nodes only
    'progress', COALESCE((
      SELECT json_agg(
        json_build_object(
          'nodeId',       np.node_id,
          'status',       np.status,
          'progress',     np.progress,
          'rewardClaimed', np.reward_claimed,
          'completedAt',  np.completed_at
        )
      )
      FROM user_node_progress np
      JOIN journey_template_nodes n ON np.node_id = n.id
      WHERE np.enrollment_id = v_enrollment_id
        AND n.unit_id = v_unit_id
    ), '[]'::json),

    -- enrollment (null if not enrolled)
    'enrollment', CASE
      WHEN v_enrollment_id IS NOT NULL THEN
        json_build_object(
          'id',                v_enrollment_id,
          'currentUnitNumber', v_enrollment_unit,
          'status',            v_enrollment_status,
          'templateVersion',   v_enrollment_ver
        )
      ELSE NULL
    END,

    -- all sections for sticky header
    'sectionList', COALESCE((
      SELECT json_agg(
        json_build_object(
          'unitNumber', su.unit_number,
          'title',      su.title,
          'colorScheme', su.color_scheme,
          'nodeCount',  (
            SELECT COUNT(*)::INTEGER
              FROM journey_template_nodes sn
             WHERE sn.unit_id = su.id
          )
        )
        ORDER BY su.unit_number
      )
      FROM journey_template_units su
      WHERE su.journey_id = v_journey_id
    ), '[]'::json)
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. get_node_content — returns full content JSONB for a single node
--
-- Called on-demand when user taps a node to start or review it.
-- No SECURITY DEFINER needed — template nodes are publicly readable via RLS.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_node_content(p_node_id UUID)
RETURNS JSON
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'id',          n.id,
    'nodeType',    n.node_type,
    'title',       n.title,
    'description', n.description,
    'content',     n.content
  )
  FROM journey_template_nodes n
  WHERE n.id = p_node_id;
$$;

-- ============================================================================
-- Reload PostgREST schema cache so new functions are immediately callable
-- ============================================================================
NOTIFY pgrst, 'reload schema';
