-- Add avatar_url to profiles table
alter table public.profiles 
add column if not exists avatar_url text;

-- Ensure RLS allows users to update their own avatar_url (already covered by existing update policy)
-- But we need to make sure the bucket is created if we were running this in a real environment.
-- Since I can't run SQL directly on their Supabase dashboard, I provide the snippet.
