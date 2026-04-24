-- RUN THIS IN SUPABASE SQL EDITOR TO FIX "RELATION DOES NOT EXIST" ERRORS

-- 1. Create Tables (If they don't exist)
create table if not exists ai_tools (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  category text,
  status text default 'new',
  url text,
  tags text[],
  tried_at timestamp with time zone
);

create table if not exists media (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  type text,
  content text,
  note text,
  linked_tools text[],
  platform text
);

create table if not exists guide_progress (
  id uuid default gen_random_uuid() primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  section text not null,
  item_id text not null,
  is_completed boolean default false,
  unique(user_id, section, item_id)
);

-- 2. Enable RLS
alter table ai_tools enable row level security;
alter table media enable row level security;
alter table guide_progress enable row level security;

-- 3. Create Policies (Public Read / Authenticated Write)

-- AI TOOLS POLICIES
create policy "Public read tools"
on ai_tools for select
using (true);

create policy "Users can insert their own tools"
on ai_tools for insert
with check (auth.uid() = user_id);

create policy "Users can update their own tools"
on ai_tools for update
using (auth.uid() = user_id);

create policy "Users can delete their own tools"
on ai_tools for delete
using (auth.uid() = user_id);

-- MEDIA POLICIES
create policy "Public read media"
on media for select
using (true);

create policy "Users can insert their own media"
on media for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own media"
on media for delete
using (auth.uid() = user_id);

-- GUIDE PROGRESS POLICIES
create policy "Users can read their own progress"
on guide_progress for select
using (auth.uid() = user_id);

create policy "Users can insert their own progress"
on guide_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update their own progress"
on guide_progress for update
using (auth.uid() = user_id);
