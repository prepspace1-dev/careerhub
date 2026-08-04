-- ============================================================
-- Career Hub v4 Schema Additions — Profiles & Trash Bin OS
-- Run this in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → your project → SQL Editor
-- ============================================================

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT DEFAULT '',
  target_role   TEXT DEFAULT 'SDE Candidate',
  github        TEXT DEFAULT '',
  linkedin      TEXT DEFAULT '',
  leetcode      TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  updated_at    TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
  ON public.user_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Trash Bin / Soft Delete Table
CREATE TABLE IF NOT EXISTS public.trash_bin (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type   TEXT NOT NULL,
  title       TEXT NOT NULL,
  data        JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trash_bin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own trash bin"
  ON public.trash_bin FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS trash_bin_user_id_idx ON public.trash_bin(user_id);
