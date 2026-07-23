-- Add foreign key relationship between journal_ai and journal_records

ALTER TABLE IF EXISTS public.journal_ai 
  ALTER COLUMN journal_id TYPE bigint USING journal_id::bigint;

-- Delete orphaned rows before adding constraint
DELETE FROM public.journal_ai 
WHERE NOT EXISTS (
  SELECT 1 FROM public.journal_records 
  WHERE public.journal_records.id = public.journal_ai.journal_id
);

ALTER TABLE IF EXISTS public.journal_ai
  ADD CONSTRAINT fk_journal_ai_journal_records 
  FOREIGN KEY (journal_id) REFERENCES public.journal_records (id) ON DELETE CASCADE;
