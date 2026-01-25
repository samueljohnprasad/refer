-- Daily & Weekly Challenges System Tables
-- Run this SQL in your Supabase SQL Editor

-- User challenge progress tracking
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('daily', 'weekly')),
  progress INTEGER NOT NULL DEFAULT 0,
  target INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  period_start DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique challenge per user per period
  UNIQUE(user_id, challenge_id, period_start)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_challenge_progress_user_id 
  ON user_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_period 
  ON user_challenge_progress(period_start);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_type 
  ON user_challenge_progress(challenge_type);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_active 
  ON user_challenge_progress(user_id, challenge_type, period_start);

-- Enable Row Level Security
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own challenge progress" 
  ON user_challenge_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge progress" 
  ON user_challenge_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress" 
  ON user_challenge_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to clean up old challenge progress (optional, run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_challenges()
RETURNS void AS $$
BEGIN
  -- Delete daily challenges older than 7 days
  DELETE FROM user_challenge_progress 
  WHERE challenge_type = 'daily' 
    AND period_start < CURRENT_DATE - INTERVAL '7 days';
  
  -- Delete weekly challenges older than 4 weeks
  DELETE FROM user_challenge_progress 
  WHERE challenge_type = 'weekly' 
    AND period_start < CURRENT_DATE - INTERVAL '28 days';
END;
$$ LANGUAGE plpgsql;
