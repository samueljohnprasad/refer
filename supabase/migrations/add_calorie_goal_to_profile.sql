-- Add daily_calorie_goal column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS daily_calorie_goal INTEGER DEFAULT 2000 CHECK (daily_calorie_goal > 0);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.daily_calorie_goal IS 'User daily calorie maintenance goal in kcal';
