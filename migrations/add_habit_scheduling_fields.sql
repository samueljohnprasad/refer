-- Add new columns to habits table for scheduling and reminders
ALTER TABLE habits 
ADD COLUMN IF NOT EXISTS time_option VARCHAR(20) DEFAULT 'anytime', -- 'anytime' or 'at_time'
ADD COLUMN IF NOT EXISTS scheduled_time TIME,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS repeat_pattern VARCHAR(20) DEFAULT 'daily', -- 'never', 'daily', 'weekly', 'monthly', 'yearly'
ADD COLUMN IF NOT EXISTS repeat_days INTEGER[], -- For weekly: [0,1,2,3,4,5,6] (0=Sunday)
ADD COLUMN IF NOT EXISTS end_repeat_option VARCHAR(20) DEFAULT 'never', -- 'never', 'on_date', 'after_count'
ADD COLUMN IF NOT EXISTS end_repeat_date DATE,
ADD COLUMN IF NOT EXISTS end_repeat_count INTEGER,
ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_time TIME,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add comments
COMMENT ON COLUMN habits.time_option IS 'Whether habit is anytime or at a specific time';
COMMENT ON COLUMN habits.scheduled_time IS 'Specific time if time_option is at_time';
COMMENT ON COLUMN habits.duration_minutes IS 'Duration in minutes if time is set';
COMMENT ON COLUMN habits.start_date IS 'Date when habit tracking starts';
COMMENT ON COLUMN habits.repeat_pattern IS 'How often the habit repeats';
COMMENT ON COLUMN habits.repeat_days IS 'Days of week for weekly pattern (0=Sunday)';
COMMENT ON COLUMN habits.end_repeat_option IS 'When to stop repeating';
COMMENT ON COLUMN habits.end_repeat_date IS 'End date if end_repeat_option is on_date';
COMMENT ON COLUMN habits.end_repeat_count IS 'Number of completions before ending';
COMMENT ON COLUMN habits.reminder_enabled IS 'Whether to send reminder notifications';
COMMENT ON COLUMN habits.reminder_time IS 'Time to send reminder';
COMMENT ON COLUMN habits.notes IS 'User notes about the habit';
