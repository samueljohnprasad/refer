ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS reward_content jsonb;

ALTER TABLE public.units
  ADD COLUMN IF NOT EXISTS reward_content jsonb;

ALTER TABLE public.nodes
  ADD COLUMN IF NOT EXISTS reward_content jsonb;

ALTER TABLE public.user_course_progress
  ADD COLUMN IF NOT EXISTS finale_seen_at timestamptz;

ALTER TABLE public.courses
  ADD CONSTRAINT courses_reward_content_object
  CHECK (reward_content IS NULL OR jsonb_typeof(reward_content) = 'object');

ALTER TABLE public.units
  ADD CONSTRAINT units_reward_content_object
  CHECK (reward_content IS NULL OR jsonb_typeof(reward_content) = 'object');

ALTER TABLE public.nodes
  ADD CONSTRAINT nodes_reward_content_object
  CHECK (reward_content IS NULL OR jsonb_typeof(reward_content) = 'object');

COMMENT ON COLUMN public.courses.reward_content IS
  'Authored course finale copy and actions served with the course tree.';
COMMENT ON COLUMN public.units.reward_content IS
  'Authored unit completion capability and action copy.';
COMMENT ON COLUMN public.nodes.reward_content IS
  'Authored lesson takeaway or deterministic reward-node content.';
COMMENT ON COLUMN public.user_course_progress.finale_seen_at IS
  'Set after the learner dismisses the one-time course finale.';
