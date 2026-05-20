-- ============================================================================
-- Remove stored not_started state from journey progress
-- Migration: 20260520000000_remove_not_started_from_journey_progress.sql
--
-- Journey progression now stores only durable facts:
-- - course rows are in_progress or completed
-- - node rows are in_progress, attempted, or completed when they exist
-- - the "current" node is derived from the first non-completed node in order
-- ============================================================================

UPDATE user_course_progress
SET
  status = 'in_progress',
  started_at = COALESCE(started_at, now())
WHERE status = 'not_started';

DELETE FROM user_course_node_progress
WHERE status = 'not_started';

ALTER TABLE user_course_progress
  ALTER COLUMN status SET DEFAULT 'in_progress';

ALTER TABLE user_course_progress
  DROP CONSTRAINT IF EXISTS user_course_progress_status_check;

ALTER TABLE user_course_progress
  ADD CONSTRAINT user_course_progress_status_check
  CHECK (status IN ('in_progress', 'completed'));

ALTER TABLE user_course_node_progress
  ALTER COLUMN status DROP DEFAULT;

ALTER TABLE user_course_node_progress
  DROP CONSTRAINT IF EXISTS user_course_node_progress_status_check;

ALTER TABLE user_course_node_progress
  ADD CONSTRAINT user_course_node_progress_status_check
  CHECK (status IN ('in_progress', 'attempted', 'completed'));

NOTIFY pgrst, 'reload schema';
