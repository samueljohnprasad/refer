-- Onboarding Premium Conversion: Add goal tracking and analytics

-- Add onboarding goals and trial tracking to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_goals TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_mood VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_offered_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ;

-- Onboarding analytics events table
CREATE TABLE IF NOT EXISTS onboarding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  step_name VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast user-specific queries
CREATE INDEX IF NOT EXISTS idx_onboarding_events_user_id
  ON onboarding_events(user_id);

-- Index for funnel analysis queries
CREATE INDEX IF NOT EXISTS idx_onboarding_events_step_action
  ON onboarding_events(step_name, action);

-- RLS policies
ALTER TABLE onboarding_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own onboarding events"
  ON onboarding_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding events"
  ON onboarding_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);
