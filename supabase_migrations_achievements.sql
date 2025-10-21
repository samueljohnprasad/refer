-- Migration: Add achievements/badges system
-- Run this in your Supabase SQL Editor

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'streak', 'entries', 'consistency', 'special'
  requirement_type VARCHAR(50) NOT NULL, -- 'streak_days', 'total_entries', 'consecutive_weeks', etc.
  requirement_value INTEGER NOT NULL,
  badge_color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements junction table
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0, -- Current progress towards achievement
  is_claimed BOOLEAN DEFAULT FALSE, -- Whether user has seen/claimed the achievement
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value, badge_color) VALUES
-- Streak achievements
('First Step', 'Complete your first journal entry', '🌱', 'streak', 'streak_days', 1, '#10B981'),
('Getting Started', 'Maintain a 3-day streak', '🔥', 'streak', 'streak_days', 3, '#F59E0B'),
('Week Warrior', 'Maintain a 7-day streak', '⚡', 'streak', 'streak_days', 7, '#3B82F6'),
('Two Week Champion', 'Maintain a 14-day streak', '💪', 'streak', 'streak_days', 14, '#8B5CF6'),
('Monthly Master', 'Maintain a 30-day streak', '🌟', 'streak', 'streak_days', 30, '#EC4899'),
('45 Day Hero', 'Maintain a 45-day streak', '🚀', 'streak', 'streak_days', 45, '#F97316'),
('60 Day Legend', 'Maintain a 60-day streak', '👑', 'streak', 'streak_days', 60, '#EAB308'),
('Quarter Year', 'Maintain a 90-day streak', '💎', 'streak', 'streak_days', 90, '#06B6D4'),
('Century Club', 'Maintain a 100-day streak', '🏆', 'streak', 'streak_days', 100, '#DC2626'),
('Half Year Hero', 'Maintain a 180-day streak', '🎖️', 'streak', 'streak_days', 180, '#7C3AED'),
('Year Long Legend', 'Maintain a 365-day streak', '🎊', 'streak', 'streak_days', 365, '#D97706'),

-- Entry count achievements
('Prolific Writer', 'Write 10 journal entries', '✍️', 'entries', 'total_entries', 10, '#10B981'),
('Dedicated Diarist', 'Write 50 journal entries', '📝', 'entries', 'total_entries', 50, '#3B82F6'),
('Journal Master', 'Write 100 journal entries', '📚', 'entries', 'total_entries', 100, '#8B5CF6'),
('Reflection Expert', 'Write 250 journal entries', '🎯', 'entries', 'total_entries', 250, '#EC4899'),
('Wisdom Keeper', 'Write 500 journal entries', '🧠', 'entries', 'total_entries', 500, '#F59E0B'),

-- Consistency achievements
('Early Bird', 'Journal before 9 AM, 7 times', '🌅', 'consistency', 'morning_entries', 7, '#F59E0B'),
('Night Owl', 'Journal after 9 PM, 7 times', '🌙', 'consistency', 'evening_entries', 7, '#6366F1'),
('Weekend Warrior', 'Journal on 10 weekends', '🎮', 'consistency', 'weekend_entries', 10, '#EC4899'),

-- Special achievements
('Comeback Kid', 'Rebuild a streak after breaking one', '🔄', 'special', 'streak_recovery', 1, '#10B981'),
('Frozen in Time', 'Use a streak freeze', '❄️', 'special', 'used_freeze', 1, '#06B6D4'),
('Milestone Hunter', 'Unlock 5 achievements', '🎯', 'special', 'achievements_unlocked', 5, '#8B5CF6'),
('Achievement Master', 'Unlock 10 achievements', '🏅', 'special', 'achievements_unlocked', 10, '#DC2626')
ON CONFLICT (name) DO NOTHING;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS TABLE(newly_unlocked_achievement_id INTEGER) AS $$
DECLARE
  v_current_streak INTEGER;
  v_total_entries INTEGER;
  v_achievement RECORD;
BEGIN
  -- Get user stats
  SELECT current_streak INTO v_current_streak
  FROM profiles WHERE id = p_user_id;
  
  SELECT COUNT(*) INTO v_total_entries
  FROM journal_entries WHERE user_id = p_user_id;

  -- Check streak achievements
  FOR v_achievement IN 
    SELECT id, requirement_value 
    FROM achievements 
    WHERE category = 'streak' AND requirement_type = 'streak_days'
  LOOP
    IF v_current_streak >= v_achievement.requirement_value THEN
      INSERT INTO user_achievements (user_id, achievement_id, progress, is_claimed)
      VALUES (p_user_id, v_achievement.id, v_current_streak, FALSE)
      ON CONFLICT (user_id, achievement_id) DO UPDATE
      SET progress = v_current_streak
      RETURNING achievement_id INTO newly_unlocked_achievement_id;
      
      IF FOUND THEN
        RETURN NEXT;
      END IF;
    END IF;
  END LOOP;

  -- Check entry count achievements
  FOR v_achievement IN 
    SELECT id, requirement_value 
    FROM achievements 
    WHERE category = 'entries' AND requirement_type = 'total_entries'
  LOOP
    IF v_total_entries >= v_achievement.requirement_value THEN
      INSERT INTO user_achievements (user_id, achievement_id, progress, is_claimed)
      VALUES (p_user_id, v_achievement.id, v_total_entries, FALSE)
      ON CONFLICT (user_id, achievement_id) DO UPDATE
      SET progress = v_total_entries
      RETURNING achievement_id INTO newly_unlocked_achievement_id;
      
      IF FOUND THEN
        RETURN NEXT;
      END IF;
    END IF;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE achievements IS 'Available achievements/badges in the system';
COMMENT ON TABLE user_achievements IS 'Tracks which achievements users have unlocked';
COMMENT ON FUNCTION check_and_award_achievements IS 'Checks user progress and awards applicable achievements';
