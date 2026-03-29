-- Create the thought_catcher_entries table
CREATE TABLE IF NOT EXISTS public.thought_catcher_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    situation TEXT NOT NULL,
    automatic_thought TEXT NOT NULL,
    intensity SMALLINT NOT NULL CHECK (intensity >= 0 AND intensity <= 100),
    is_true TEXT, -- 'YES', 'NOT SURE', 'NO'
    balanced_thought TEXT,
    status TEXT NOT NULL DEFAULT 'catcher_completed', -- 'catcher_completed', 'checker_completed'
    selected_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.thought_catcher_entries ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can insert their own thought catcher entries"
    ON public.thought_catcher_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own thought catcher entries"
    ON public.thought_catcher_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own thought catcher entries"
    ON public.thought_catcher_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thought catcher entries"
    ON public.thought_catcher_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Create a trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_thought_catcher_entries_updated_at
BEFORE UPDATE ON public.thought_catcher_entries
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Add Indexes
CREATE INDEX IF NOT EXISTS thought_catcher_entries_user_id_idx ON public.thought_catcher_entries(user_id);
CREATE INDEX IF NOT EXISTS thought_catcher_entries_status_idx ON public.thought_catcher_entries(status);
CREATE INDEX IF NOT EXISTS thought_catcher_entries_selected_date_idx ON public.thought_catcher_entries(selected_date);
