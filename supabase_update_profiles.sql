-- Run this snippet in your Supabase SQL Editor
-- This updates the existing profiles table with columns for onboarding

alter table public.profiles 
add column if not exists full_name text,
add column if not exists target_role text,
add column if not exists target_goal text;

-- Add policies so users can also insert/update these fields on their own row
-- (Note: 'insert' isn't needed here if the auth trigger handled the initial row creation)
