-- Add bookmark column and bookmarked_at timestamp to journal_records table
ALTER TABLE journal_records 
ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS bookmarked_at TIMESTAMPTZ;

-- Create index for faster bookmark queries
CREATE INDEX IF NOT EXISTS idx_journal_records_bookmarked 
ON journal_records(user_id, is_bookmarked, bookmarked_at DESC) 
WHERE is_bookmarked = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN journal_records.is_bookmarked IS 'Indicates if the journal entry is bookmarked by the user';
COMMENT ON COLUMN journal_records.bookmarked_at IS 'Timestamp when the journal entry was bookmarked';
