-- Migration: AI Reflection Tables

-- 1. journal_ai
CREATE TABLE journal_ai (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_id uuid NOT NULL, -- references journals(id)
  user_id uuid NOT NULL,
  summary text NOT NULL,
  confidence numeric,
  structured_memory jsonb,
  prompt_version text,
  created_at timestamptz DEFAULT now(),
  input_tokens integer,
  output_tokens integer,
  total_tokens integer
);
CREATE INDEX idx_journal_ai_journal_id ON journal_ai(journal_id);
CREATE INDEX idx_journal_ai_user_id ON journal_ai(user_id);

-- 2. daily_ai
CREATE TABLE daily_ai (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  reflection_date date NOT NULL,
  summary text NOT NULL,
  personalized_reflection jsonb,
  structured_memory jsonb,
  confidence numeric,
  created_at timestamptz DEFAULT now(),
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  UNIQUE(user_id, reflection_date)
);

-- 3. weekly_ai
CREATE TABLE weekly_ai (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  year integer NOT NULL,
  week_number integer NOT NULL,
  summary text NOT NULL,
  personalized_reflection jsonb,
  structured_memory jsonb,
  confidence numeric,
  created_at timestamptz DEFAULT now(),
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  UNIQUE(user_id, year, week_number)
);

-- 4. monthly_ai
CREATE TABLE monthly_ai (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  year integer NOT NULL,
  month integer NOT NULL,
  summary text NOT NULL,
  personalized_reflection jsonb,
  structured_memory jsonb,
  confidence numeric,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  created_at timestamptz DEFAULT now()
);

-- 5. user_personalization
CREATE TABLE user_personalization (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  focus_areas jsonb,
  life_context jsonb,
  important_values jsonb,
  preferences jsonb,
  updated_at timestamptz DEFAULT now()
);
