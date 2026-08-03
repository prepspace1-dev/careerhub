-- ============================================================
-- Career Hub v2 Schema Additions
-- Run this in your Supabase project SQL Editor AFTER the original schema
-- Go to: https://supabase.com/dashboard → your project → SQL Editor
-- ============================================================

-- ──────────────────────────────────────────────
-- 5. PROBLEMS VAULT TABLE
-- Stores every coding problem the user has logged
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.problems (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  url             TEXT DEFAULT '',
  platform        TEXT DEFAULT 'LeetCode',
  topic           TEXT NOT NULL,
  difficulty      TEXT NOT NULL DEFAULT 'Medium'
                    CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  patterns        TEXT[] DEFAULT '{}',
  company_tags    TEXT[] DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'solved'
                    CHECK (status IN ('solving', 'solved')),
  solve_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  solve_time_mins INTEGER DEFAULT 0,
  hints_used      BOOLEAN DEFAULT false,
  editorial_used  BOOLEAN DEFAULT false,
  confidence      INTEGER DEFAULT 3 CHECK (confidence BETWEEN 1 AND 5),
  notes           TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own problems"
  ON public.problems FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS problems_user_id_idx  ON public.problems(user_id);
CREATE INDEX IF NOT EXISTS problems_topic_idx    ON public.problems(user_id, topic);
CREATE INDEX IF NOT EXISTS problems_date_idx     ON public.problems(user_id, solve_date DESC);


-- ──────────────────────────────────────────────
-- 6. ROADMAP ITEMS TABLE
-- Tracks which roadmap checklist items the user has completed
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roadmap_items (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id TEXT NOT NULL,
  item_id    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'not_started'
               CHECK (status IN ('not_started', 'learning', 'mastered')),
  notes      TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (user_id, roadmap_id, item_id)
);

ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own roadmap items"
  ON public.roadmap_items FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ──────────────────────────────────────────────
-- 7. REVISION QUEUE TABLE
-- SM-2 spaced repetition scheduling for problems
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.revision_queue (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id       UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE + 1,
  ease_factor      FLOAT DEFAULT 2.5,
  interval_days    INTEGER DEFAULT 1,
  repetitions      INTEGER DEFAULT 0,
  UNIQUE (user_id, problem_id)
);

ALTER TABLE public.revision_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own revision queue"
  ON public.revision_queue FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS revision_queue_review_idx
  ON public.revision_queue(user_id, next_review_date);


-- ──────────────────────────────────────────────
-- 8. XP EVENTS TABLE
-- Log of all XP-earning actions for gamification
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.xp_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  xp         INTEGER NOT NULL,
  metadata   JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own xp events"
  ON public.xp_events FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS xp_events_user_idx ON public.xp_events(user_id);
CREATE INDEX IF NOT EXISTS xp_events_date_idx ON public.xp_events(user_id, created_at DESC);


-- ──────────────────────────────────────────────
-- Verification: run these to confirm tables exist
-- ──────────────────────────────────────────────
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('problems','roadmap_items','revision_queue','xp_events');
