-- Phase 10C.2 Migration: Decision Pattern Reports Table and RLS Policies

CREATE TABLE IF NOT EXISTS public.decision_pattern_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision_count INTEGER NOT NULL,
  overall_summary TEXT NOT NULL,
  strongest_pattern TEXT NULL,
  recommended_change TEXT NULL,
  patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT decision_pattern_reports_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_decision_pattern_reports_user_id ON public.decision_pattern_reports(user_id);

DROP TRIGGER IF EXISTS update_decision_pattern_reports_updated_at ON public.decision_pattern_reports;
CREATE TRIGGER update_decision_pattern_reports_updated_at
  BEFORE UPDATE ON public.decision_pattern_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.decision_pattern_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own decision pattern reports" ON public.decision_pattern_reports;
CREATE POLICY "Users can select own decision pattern reports"
  ON public.decision_pattern_reports FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own decision pattern reports" ON public.decision_pattern_reports;
CREATE POLICY "Users can insert own decision pattern reports"
  ON public.decision_pattern_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own decision pattern reports" ON public.decision_pattern_reports;
CREATE POLICY "Users can update own decision pattern reports"
  ON public.decision_pattern_reports FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own decision pattern reports" ON public.decision_pattern_reports;
CREATE POLICY "Users can delete own decision pattern reports"
  ON public.decision_pattern_reports FOR DELETE
  USING (auth.uid() = user_id);
