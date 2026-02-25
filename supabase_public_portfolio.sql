-- Add is_public column to achievements table for Phase 14 Public Portfolio
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Create a public read policy for public achievements
create policy "Anyone can view public achievements."
  on achievements for select
  using ( is_public = true );
