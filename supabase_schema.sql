-- Supabase SQL Schema setup for Career Hub
-- Run this in your Supabase project's SQL Editor to set up the database tables.

-- 1. DAILY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.daily_tasks (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    dsa BOOLEAN DEFAULT FALSE,
    apps BOOLEAN DEFAULT FALSE,
    learn BOOLEAN DEFAULT FALSE,
    review BOOLEAN DEFAULT FALSE,
    project BOOLEAN DEFAULT FALSE,
    recap BOOLEAN DEFAULT FALSE,
    apps_count INTEGER DEFAULT 0,
    notes JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (user_id, date)
);

-- Enable RLS for Daily Tasks
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own daily tasks" 
    ON public.daily_tasks 
    FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);


-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL,
    level INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 3),
    PRIMARY KEY (user_id, skill_id)
);

-- Enable RLS for Skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own skills" 
    ON public.skills 
    FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);


-- 3. DAILY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.daily_logs (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    entry TEXT DEFAULT ''::text,
    PRIMARY KEY (user_id, date)
);

-- Enable RLS for Daily Logs
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own daily logs" 
    ON public.daily_logs 
    FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);


-- 4. INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    stage TEXT NOT NULL CHECK (stage IN ('Applied', 'Interview scheduled', 'Interviewed', 'Offer', 'Rejected')),
    notes TEXT DEFAULT ''::text,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Interviews
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own interviews" 
    ON public.interviews 
    FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
