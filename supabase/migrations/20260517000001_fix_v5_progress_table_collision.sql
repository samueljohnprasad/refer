-- ============================================================================
-- Fix v5 Journey Progress Table Collision
-- Migration: 20260517000001_fix_v5_progress_table_collision.sql
--
-- The legacy mental health system already owns public.user_node_progress.
-- v5 journey map functions need a separate progress table keyed to public.nodes.
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_course_node_progress (
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id           UUID        NOT NULL REFERENCES nodes(id)      ON DELETE CASCADE,
  status            TEXT        NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started','in_progress','attempted','completed')),
  attempts          INT         NOT NULL DEFAULT 0,
  best_score        INT,
  last_score        INT,
  last_attempted_at TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  PRIMARY KEY (user_id, node_id)
);

CREATE INDEX IF NOT EXISTS idx_user_course_node_progress_user
  ON user_course_node_progress(user_id, node_id);

CREATE INDEX IF NOT EXISTS idx_user_course_node_progress_node
  ON user_course_node_progress(node_id);

ALTER TABLE user_course_node_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'user_course_node_progress'
      AND policyname = 'own_course_node_progress'
  ) THEN
    CREATE POLICY "own_course_node_progress"
      ON user_course_node_progress
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
