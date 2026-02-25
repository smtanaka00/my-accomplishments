-- Create the 'goals' table
create table goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text default 'in_progress' check (status in ('in_progress', 'completed')),
  target_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table goals enable row level security;

create policy "Users can view own goals."
  on goals for select
  using ( auth.uid() = user_id );

create policy "Users can insert own goals."
  on goals for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own goals."
  on goals for update
  using ( auth.uid() = user_id );

create policy "Users can delete own goals."
  on goals for delete
  using ( auth.uid() = user_id );
