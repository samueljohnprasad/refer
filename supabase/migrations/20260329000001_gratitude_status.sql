-- Add status and updated_at to gratitude_entries
ALTER TABLE public.gratitude_entries 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'intro',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Create trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_gratitude_entries_updated_at') THEN
        CREATE TRIGGER set_gratitude_entries_updated_at
        BEFORE UPDATE ON public.gratitude_entries
        FOR EACH ROW
        EXECUTE FUNCTION public.set_current_timestamp_updated_at();
    END IF;
END $$;

-- Add index for status
CREATE INDEX IF NOT EXISTS gratitude_entries_status_idx ON public.gratitude_entries(status);
