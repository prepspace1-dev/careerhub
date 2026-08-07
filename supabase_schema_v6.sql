-- CAREERHUB V2 — Production PostgreSQL Schema for Supabase
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard -> project -> SQL Editor)

-- Drop existing restricted RLS policies if present
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own daily progress" ON public.daily_progress;
DROP POLICY IF EXISTS "Users can manage own dsa submissions" ON public.dsa_submissions;
DROP POLICY IF EXISTS "Users can manage own daily notes" ON public.daily_notes;
DROP POLICY IF EXISTS "Users can manage own project milestones" ON public.project_milestones;

-- 1. User Profiles Table (Directly Linked to Auth Users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT DEFAULT 'Engineer',
  current_day INT DEFAULT 1,
  theme_preference TEXT DEFAULT 'dark',
  streak_count INT DEFAULT 0,
  total_study_minutes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Tasks & Checklists Progress
CREATE TABLE IF NOT EXISTS public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  theory_completed BOOLEAN DEFAULT FALSE,
  tasks_completed JSONB DEFAULT '{}'::jsonb,
  reflection JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- 3. DSA Problem Submissions & Solver
CREATE TABLE IF NOT EXISTS public.dsa_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id INT NOT NULL,
  leetcode_id INT NOT NULL,
  status TEXT DEFAULT 'Unsolved',
  time_spent_minutes INT DEFAULT 0,
  personal_notes TEXT DEFAULT '',
  bookmarked BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- 4. Daily Notes
CREATE TABLE IF NOT EXISTS public.daily_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  content TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- 5. Project Sprint Milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id INT NOT NULL,
  day_number INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id, day_number)
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- Create Open RLS Policies for Authenticated Users (ALLOWS INSERT, UPDATE, SELECT)
CREATE POLICY "Users can manage own profile" ON public.user_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily progress" ON public.daily_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own dsa submissions" ON public.dsa_submissions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily notes" ON public.daily_notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own project milestones" ON public.project_milestones FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
