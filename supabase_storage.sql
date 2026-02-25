-- Run this snippet in your Supabase SQL Editor
-- This will create the "evidence_vault" storage bucket and set up the necessary RLS policies.

insert into storage.buckets (id, name, public)
values ('evidence_vault', 'evidence_vault', true); -- Or false if you intend to only use signed URLs

-- Set up Row Level Security (RLS) for the storage.objects table
-- Allow users to view their own files
create policy "Users can view their own files"
on storage.objects for select
using ( auth.uid() = owner and bucket_id = 'evidence_vault' );

-- Allow users to upload their own files
create policy "Users can upload their own files"
on storage.objects for insert
with check ( auth.uid() = owner and bucket_id = 'evidence_vault' );

-- Allow users to update their own files
create policy "Users can update their own files"
on storage.objects for update
using ( auth.uid() = owner and bucket_id = 'evidence_vault' );

-- Allow users to delete their own files
create policy "Users can delete their own files"
on storage.objects for delete
using ( auth.uid() = owner and bucket_id = 'evidence_vault' );
