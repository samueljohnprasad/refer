-- Add unique constraint for upsert
ALTER TABLE monthly_ai ADD CONSTRAINT monthly_ai_user_id_year_month_key UNIQUE(user_id, year, month);
