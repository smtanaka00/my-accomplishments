-- Run this migration in Supabase SQL Editor to add the streak tracking column.
-- The column stores the date the user last logged an achievement.

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_logged_date DATE;
