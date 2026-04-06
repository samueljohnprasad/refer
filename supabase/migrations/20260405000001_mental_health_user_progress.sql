-- ============================================================================
-- P1.1.2 — Mental Health Journey: User Progress Tables
-- Extends user_node_progress with response data, mood tracking, duration
-- Adds user_node_completions as an immutable completion log
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Extend user_node_progress with mental health tracking fields
-- --------------------------------------------------------------------------
ALTER TABLE user_node_progress
  ADD COLUMN IF NOT EXISTS response_data JSONB,
  ADD COLUMN IF NOT EXISTS mood_before INTEGER CHECK (mood_before IS NULL OR (mood_before >= 1 AND mood_before <= 5)),
  ADD COLUMN IF NOT EXISTS mood_after INTEGER CHECK (mood_after IS NULL OR (mood_after >= 1 AND mood_after <= 5)),
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS xp_earned INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN user_node_progress.response_data IS 'User answers, journal text, quiz results, mood rating — shape varies by node_type.';
COMMENT ON COLUMN user_node_progress.mood_before IS 'Mood rating 1-5 captured before node exercise (for journal/exercise nodes).';
COMMENT ON COLUMN user_node_progress.mood_after IS 'Mood rating 1-5 captured after node exercise.';
COMMENT ON COLUMN user_node_progress.duration_seconds IS 'Actual time the user spent on this node.';
COMMENT ON COLUMN user_node_progress.xp_earned IS 'Total Insight Points earned for this node (base + bonuses).';

-- --------------------------------------------------------------------------
-- 2. Create user_node_completions — immutable log of all completions
--    This is separate from user_node_progress because:
--    - Progress tracks current state (mutable: active → completed)
--    - Completions is an append-only audit log for analytics + AI reports
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_node_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES journey_template_nodes(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES journey_templates(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES user_journey_enrollments(id) ON DELETE SET NULL,
  node_type TEXT NOT NULL,
  response_data JSONB,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  mood_before INTEGER CHECK (mood_before IS NULL OR (mood_before >= 1 AND mood_before <= 5)),
  mood_after INTEGER CHECK (mood_after IS NULL OR (mood_after >= 1 AND mood_after <= 5)),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for the completion log
CREATE INDEX IF NOT EXISTS idx_node_completions_user
  ON user_node_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_node_completions_journey
  ON user_node_completions(user_id, journey_id);
CREATE INDEX IF NOT EXISTS idx_node_completions_date
  ON user_node_completions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_node_completions_node_type
  ON user_node_completions(node_type);

-- --------------------------------------------------------------------------
-- 3. RLS for user_node_completions
-- --------------------------------------------------------------------------
ALTER TABLE user_node_completions ENABLE ROW LEVEL SECURITY;

-- Users can read their own completions
CREATE POLICY "Users can view own completions"
  ON user_node_completions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own completions
CREATE POLICY "Users can insert own completions"
  ON user_node_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE — immutable log
COMMENT ON TABLE user_node_completions IS 'Immutable append-only log of node completions. Used for AI reports, analytics, mood tracking over time.';

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
