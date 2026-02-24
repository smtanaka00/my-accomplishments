-- Run this snippet in your Supabase SQL Editor

-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create achievements table
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  date date not null,
  display_date text not null,
  category text not null,
  tag text not null,
  impact text not null,
  evidence_type text not null,
  file_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.achievements enable row level security;

-- Create policies so users can only access their own data
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can view own achievements"
  on achievements for select
  using ( auth.uid() = user_id );

create policy "Users can insert own achievements"
  on achievements for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own achievements"
  on achievements for update
  using ( auth.uid() = user_id );

create policy "Users can delete own achievements"
  on achievements for delete
  using ( auth.uid() = user_id );

-- Automatically create profile on signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
