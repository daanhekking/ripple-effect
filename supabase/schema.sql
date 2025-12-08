-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Users Table
drop type if exists user_role cascade;
create type user_role as enum ('employee', 'manager');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  role user_role default 'employee',
  manager_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for Users
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);
  
create policy "Managers can view their team"
  on public.users for select
  using (
    auth.uid() in (
      select id from public.users where role = 'manager'
    )
    and manager_email = (select email from public.users where id = auth.uid())
  );

-- Create Questions Table
create table if not exists public.questions (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.questions enable row level security;

-- Policies for Questions
-- Allow authenticated users to view active questions
create policy "Authenticated users can view active questions"
  on public.questions for select
  to authenticated
  using (is_active = true);

-- Allow anonymous/public users to view active questions  
create policy "Anonymous users can view active questions"
  on public.questions for select
  to anon
  using (is_active = true);

-- Create Reflections Table
create table if not exists public.reflections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  answers jsonb not null, -- Stores question_id: answer pairs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reflections enable row level security;

-- Policies for Reflections
create policy "Users can insert their own reflections"
  on public.reflections for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own reflections"
  on public.reflections for select
  using (auth.uid() = user_id);

create policy "Managers can view their team's reflections"
  on public.reflections for select
  using (
    exists (
      select 1 from public.users u
      where u.id = reflections.user_id
      and u.manager_email = (select email from public.users where id = auth.uid())
    )
  );

-- USER SYNC TRIGGER
-- This function automatically creates a record in public.users when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'employee')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
