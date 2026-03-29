-- 1. Ensure thought_reframing_entries table exists
CREATE TABLE IF NOT EXISTS public.thought_reframing_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    situation TEXT NOT NULL,
    automatic_thought TEXT NOT NULL,
    emotions JSONB DEFAULT '[]',
    cognitive_distortions JSONB DEFAULT '[]',
    evidence_for JSONB DEFAULT '[]',
    evidence_against JSONB DEFAULT '[]',
    balanced_thought TEXT,
    completed BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'intro',
    selected_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Ensure gratitude_entries has 'status' and 'updated_at' columns
ALTER TABLE public.gratitude_entries 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'intro',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 3. Enable RLS
ALTER TABLE public.thought_reframing_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;

-- 4. Create/Update Policies for thought_reframing_entries
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can manage their own thought reframing entries') THEN
        CREATE POLICY "Users can manage their own thought reframing entries"
            ON public.thought_reframing_entries
            FOR ALL
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Create/Update Policies for gratitude_entries
-- Note: We use DROP and CREATE to ensure the policies are correct for 'FOR ALL'
-- if the project used only 'FOR INSERT' before.
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage their own gratitude entries" ON public.gratitude_entries;
    CREATE POLICY "Users can manage their own gratitude entries"
        ON public.gratitude_entries
        FOR ALL
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
END $$;

-- 6. Triggers for updated_at
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_thought_reframing_entries_updated_at') THEN
        CREATE TRIGGER set_thought_reframing_entries_updated_at
        BEFORE UPDATE ON public.thought_reframing_entries
        FOR EACH ROW
        EXECUTE FUNCTION public.set_current_timestamp_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_gratitude_entries_updated_at') THEN
        CREATE TRIGGER set_gratitude_entries_updated_at
        BEFORE UPDATE ON public.gratitude_entries
        FOR EACH ROW
        EXECUTE FUNCTION public.set_current_timestamp_updated_at();
    END IF;
END $$;

-- 7. Add performance indexes
CREATE INDEX IF NOT EXISTS thought_reframing_entries_user_id_idx ON public.thought_reframing_entries(user_id);
CREATE INDEX IF NOT EXISTS thought_reframing_entries_status_idx ON public.thought_reframing_entries(status);
CREATE INDEX IF NOT EXISTS gratitude_entries_status_idx ON public.gratitude_entries(status);
