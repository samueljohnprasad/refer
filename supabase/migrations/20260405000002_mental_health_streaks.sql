-- ============================================================================
-- P1.1.3 — Mental Health Journey: Streak & Insight Points (XP) Tables
-- Creates user_streaks table and extends the existing XP system
-- with an Insight Points ledger for journey-specific tracking
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. user_streaks — daily streak tracking
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  streak_freezes_available INTEGER NOT NULL DEFAULT 0
    CHECK (streak_freezes_available >= 0 AND streak_freezes_available <= 5),
  rest_days_used_this_week INTEGER NOT NULL DEFAULT 0
    CHECK (rest_days_used_this_week >= 0 AND rest_days_used_this_week <= 1),
  week_start_date DATE NOT NULL DEFAULT (date_trunc('week', CURRENT_DATE)::date),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE user_streaks IS 'Tracks consecutive daily activity streaks. One row per user.';
COMMENT ON COLUMN user_streaks.current_streak IS 'Number of consecutive days with ≥1 node completion.';
COMMENT ON COLUMN user_streaks.longest_streak IS 'All-time longest streak for this user.';
COMMENT ON COLUMN user_streaks.streak_freezes_available IS 'Streak freezes the user currently holds (max 5). Earned at milestones or purchased with IP.';
COMMENT ON COLUMN user_streaks.rest_days_used_this_week IS 'Planned rest days used this week (max 1). Resets on week_start_date change.';

-- --------------------------------------------------------------------------
-- 2. insight_points_ledger — granular IP tracking for journeys
--    Supplements existing xp_history with journey-specific sources
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS insight_points_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL
    CHECK (source IN (
      'node_completion',
      'streak_bonus',
      'perfect_day',
      'daily_challenge',
      'chest_reward',
      'milestone_reward',
      'quiz_perfect_bonus',
      'early_bird_bonus',
      'night_owl_bonus'
    )),
  source_id UUID,          -- FK to the node/challenge that generated this
  journey_id UUID REFERENCES journey_templates(id) ON DELETE SET NULL,
  metadata JSONB,           -- extra context (e.g., streak day count, quiz score)
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_ledger_user
  ON insight_points_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_ip_ledger_user_date
  ON insight_points_ledger(user_id, earned_at);
CREATE INDEX IF NOT EXISTS idx_ip_ledger_source
  ON insight_points_ledger(user_id, source);
CREATE INDEX IF NOT EXISTS idx_ip_ledger_journey
  ON insight_points_ledger(user_id, journey_id);

COMMENT ON TABLE insight_points_ledger IS 'Append-only ledger of Insight Points earned. Source of truth for total IP calculation.';

-- --------------------------------------------------------------------------
-- 3. View: user_ip_totals — aggregated IP for quick reads
-- --------------------------------------------------------------------------
CREATE OR REPLACE VIEW user_ip_totals AS
SELECT
  user_id,
  COALESCE(SUM(amount), 0)::INTEGER AS total_ip,
  COALESCE(SUM(amount) FILTER (WHERE earned_at::date = CURRENT_DATE), 0)::INTEGER AS today_ip,
  COALESCE(SUM(amount) FILTER (WHERE earned_at >= date_trunc('week', CURRENT_DATE)), 0)::INTEGER AS week_ip
FROM insight_points_ledger
GROUP BY user_id;

COMMENT ON VIEW user_ip_totals IS 'Aggregated Insight Points per user — total, today, this week.';

-- --------------------------------------------------------------------------
-- 4. RLS Policies
-- --------------------------------------------------------------------------

-- user_streaks
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- insight_points_ledger
ALTER TABLE insight_points_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own IP ledger"
  ON insight_points_ledger FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own IP entries"
  ON insight_points_ledger FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE — immutable ledger

-- --------------------------------------------------------------------------
-- 5. Trigger: auto-update updated_at on user_streaks
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_user_streaks_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  -- Reset rest_days_used_this_week if we've entered a new week
  IF NEW.week_start_date <> OLD.week_start_date THEN
    NEW.rest_days_used_this_week = 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_streaks_updated_at
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streaks_timestamp();

-- --------------------------------------------------------------------------
-- 6. RPC: update_streak — atomic streak calculation on node completion
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_streak user_streaks%ROWTYPE;
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - 1;
  v_milestone INTEGER := 0;
  v_streak_changed BOOLEAN := false;
BEGIN
  v_user_id := auth.uid();

  -- Upsert: create streak row if not exists
  INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
  VALUES (v_user_id, 0, 0, v_today)
  ON CONFLICT (user_id) DO NOTHING;

  -- Lock the row for update
  SELECT * INTO v_streak
  FROM user_streaks
  WHERE user_id = v_user_id
  FOR UPDATE;

  -- Already active today — no change needed
  IF v_streak.last_activity_date = v_today THEN
    RETURN json_build_object(
      'currentStreak', v_streak.current_streak,
      'longestStreak', v_streak.longest_streak,
      'streakChanged', false,
      'milestone', 0
    );
  END IF;

  -- Active yesterday — increment streak
  IF v_streak.last_activity_date = v_yesterday THEN
    UPDATE user_streaks SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_activity_date = v_today,
      week_start_date = date_trunc('week', v_today)::date
    WHERE user_id = v_user_id
    RETURNING * INTO v_streak;
    v_streak_changed := true;

  -- Missed yesterday but have a freeze
  ELSIF v_streak.last_activity_date < v_yesterday AND v_streak.streak_freezes_available > 0 THEN
    UPDATE user_streaks SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_activity_date = v_today,
      streak_freezes_available = streak_freezes_available - 1,
      week_start_date = date_trunc('week', v_today)::date
    WHERE user_id = v_user_id
    RETURNING * INTO v_streak;
    v_streak_changed := true;

  -- Missed yesterday, no freeze — reset
  ELSE
    UPDATE user_streaks SET
      current_streak = 1,
      last_activity_date = v_today,
      week_start_date = date_trunc('week', v_today)::date
    WHERE user_id = v_user_id
    RETURNING * INTO v_streak;
    v_streak_changed := true;
  END IF;

  -- Check for milestones: 3, 7, 14, 30, 60, 100, 365
  IF v_streak.current_streak IN (3, 7, 14, 30, 60, 100, 365) THEN
    v_milestone := v_streak.current_streak;

    -- Award streak freeze at 7-day milestone
    IF v_milestone = 7 THEN
      UPDATE user_streaks SET streak_freezes_available = LEAST(streak_freezes_available + 1, 5)
      WHERE user_id = v_user_id;
    END IF;
  END IF;

  RETURN json_build_object(
    'currentStreak', v_streak.current_streak,
    'longestStreak', v_streak.longest_streak,
    'streakChanged', v_streak_changed,
    'milestone', v_milestone,
    'freezesAvailable', v_streak.streak_freezes_available
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
