-- Create table to store weekly AI summaries
CREATE TABLE IF NOT EXISTS ai_weekly_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  year integer NOT NULL,
  week_number integer NOT NULL,
  week_start date NOT NULL,
  week_end date NOT NULL,
  
  -- AI generated insights
  recommendations jsonb,
  weekly_summary jsonb,
  growth_insights jsonb,
  
  -- Metadata
  generated_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Unique constraint on user + year + week
  UNIQUE(user_id, year, week_number)
);

-- Create indexes for fast queries
CREATE INDEX idx_ai_weekly_summaries_user_year_week 
  ON ai_weekly_summaries(user_id, year DESC, week_number DESC);

CREATE INDEX idx_ai_weekly_summaries_user_generated 
  ON ai_weekly_summaries(user_id, generated_at DESC);

-- Enable RLS
ALTER TABLE ai_weekly_summaries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own AI summaries"
  ON ai_weekly_summaries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI summaries"
  ON ai_weekly_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI summaries"
  ON ai_weekly_summaries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_summaries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_ai_summaries_updated_at
  BEFORE UPDATE ON ai_weekly_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_summaries_updated_at();

-- Add comment
COMMENT ON TABLE ai_weekly_summaries IS 'Stores cached AI-generated insights for weekly journals';
