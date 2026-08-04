-- ============================================================
-- Career Hub v5 Schema Additions — Projects (Portfolio Studio) Table
-- Run this in your Supabase SQL Editor:
-- Go to: https://supabase.com/dashboard → select your project → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title              TEXT NOT NULL,
  tagline            TEXT DEFAULT '',
  phase              TEXT DEFAULT 'Idea',
  category           TEXT DEFAULT '',
  tech_stack         TEXT DEFAULT '',
  github_url         TEXT DEFAULT '',
  demo_url           TEXT DEFAULT '',
  architecture_notes TEXT DEFAULT '',
  star_pitch         TEXT DEFAULT '',
  created_at         TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
  ON public.projects FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
