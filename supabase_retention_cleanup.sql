-- Retention Cleanup — Achievements & Goals (5-year rolling window)
-- Run this monthly via Supabase pg_cron or manually in the SQL Editor.
-- NOTE: Files in evidence_vault storage are NEVER deleted by this script.
--       Users retain all uploaded files permanently unless they delete them manually.

-- Delete achievements older than 5 years
DELETE FROM achievements
WHERE date < NOW() - INTERVAL '5 years';

-- Delete goals older than 5 years
DELETE FROM goals
WHERE created_at < NOW() - INTERVAL '5 years';
