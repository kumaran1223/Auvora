-- Phase 10B Migration: Decision Replays Table and RLS Policies

CREATE TABLE IF NOT EXISTS public.decision_replays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outcome_id UUID NOT NULL REFERENCES public.decision_outcomes(id) ON DELETE CASCADE,
  outcome_recorded_at TIMESTAMPTZ NOT NULL,
  alignment_score INTEGER NOT NULL CHECK (alignment_score BETWEEN 0 AND 100),
  overall_verdict TEXT NOT NULL,
  key_takeaway TEXT NOT NULL,
  assumption_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  blind_spot_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  lessons_learned JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT decision_replays_decision_id_key UNIQUE (decision_id)
);

CREATE INDEX IF NOT EXISTS idx_decision_replays_decision_id ON public.decision_replays(decision_id);
CREATE INDEX IF NOT EXISTS idx_decision_replays_user_id ON public.decision_replays(user_id);
CREATE INDEX IF NOT EXISTS idx_decision_replays_outcome_id ON public.decision_replays(outcome_id);

DROP TRIGGER IF EXISTS update_decision_replays_updated_at ON public.decision_replays;
CREATE TRIGGER update_decision_replays_updated_at
  BEFORE UPDATE ON public.decision_replays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.decision_replays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own decision replays" ON public.decision_replays;
CREATE POLICY "Users can select own decision replays"
  ON public.decision_replays FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own decision replays" ON public.decision_replays;
CREATE POLICY "Users can insert own decision replays"
  ON public.decision_replays FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own decision replays" ON public.decision_replays;
CREATE POLICY "Users can update own decision replays"
  ON public.decision_replays FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own decision replays" ON public.decision_replays;
CREATE POLICY "Users can delete own decision replays"
  ON public.decision_replays FOR DELETE
  USING (auth.uid() = user_id);

