-- ==================================================
-- Auvora Database Schema
-- Phase 1 & 2: User Profiles & Auth Trigger
-- Phase 3: Decisions, Reports, Scenarios, Outcomes
-- ==================================================

-- --------------------------------------------------
-- 1. Profiles Table (Phase 2)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  industry TEXT,
  company_size TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan)
  VALUES (new.id, new.email, 'free');
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger to prevent client-side tampering of profiles.plan
CREATE OR REPLACE FUNCTION public.prevent_profile_plan_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- If plan column is changed by an authenticated user session, revert plan to OLD.plan
  IF NEW.plan IS DISTINCT FROM OLD.plan AND auth.uid() IS NOT NULL THEN
    NEW.plan := OLD.plan;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_profile_plan_protection ON public.profiles;
CREATE TRIGGER enforce_profile_plan_protection
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_plan_tampering();

-- --------------------------------------------------
-- Reusable Timestamp Trigger Function
-- --------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- --------------------------------------------------
-- 2. Decisions Table (Phase 3)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  budget NUMERIC,
  timeline TEXT,
  success_definition TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'analyzing', 'completed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decisions_user_id ON public.decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON public.decisions(status);

DROP TRIGGER IF EXISTS update_decisions_updated_at ON public.decisions;
CREATE TRIGGER update_decisions_updated_at
  BEFORE UPDATE ON public.decisions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own decisions" ON public.decisions;
CREATE POLICY "Users can select own decisions"
  ON public.decisions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own decisions" ON public.decisions;
CREATE POLICY "Users can insert own decisions"
  ON public.decisions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own decisions" ON public.decisions;
CREATE POLICY "Users can update own decisions"
  ON public.decisions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own decisions" ON public.decisions;
CREATE POLICY "Users can delete own decisions"
  ON public.decisions FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------------
-- 3. Decision Reports Table (Phase 3)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decision_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  risk_score NUMERIC,
  summary JSONB,
  assumptions JSONB,
  evidence_gaps JSONB,
  blind_spots JSONB,
  stakeholders JSONB,
  consequences JSONB,
  scenarios JSONB,
  alternatives JSONB,
  final_stress_test JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decision_reports_decision_id ON public.decision_reports(decision_id);
CREATE INDEX IF NOT EXISTS idx_decision_reports_user_id ON public.decision_reports(user_id);

DROP TRIGGER IF EXISTS update_decision_reports_updated_at ON public.decision_reports;
CREATE TRIGGER update_decision_reports_updated_at
  BEFORE UPDATE ON public.decision_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.decision_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own decision reports" ON public.decision_reports;
CREATE POLICY "Users can select own decision reports"
  ON public.decision_reports FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own decision reports" ON public.decision_reports;
CREATE POLICY "Users can insert own decision reports"
  ON public.decision_reports FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own decision reports" ON public.decision_reports;
CREATE POLICY "Users can update own decision reports"
  ON public.decision_reports FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own decision reports" ON public.decision_reports;
CREATE POLICY "Users can delete own decision reports"
  ON public.decision_reports FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------------
-- 4. Scenarios Table (Phase 3)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_type TEXT NOT NULL CHECK (scenario_type IN ('best', 'likely', 'worst')),
  title TEXT NOT NULL,
  description TEXT,
  probability NUMERIC,
  impact TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scenarios_decision_id ON public.scenarios(decision_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON public.scenarios(user_id);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own scenarios" ON public.scenarios;
CREATE POLICY "Users can select own scenarios"
  ON public.scenarios FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scenarios" ON public.scenarios;
CREATE POLICY "Users can insert own scenarios"
  ON public.scenarios FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own scenarios" ON public.scenarios;
CREATE POLICY "Users can update own scenarios"
  ON public.scenarios FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own scenarios" ON public.scenarios;
CREATE POLICY "Users can delete own scenarios"
  ON public.scenarios FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------------
-- 5. Decision Outcomes Table (Phase 3)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decision_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outcome_status TEXT NOT NULL DEFAULT 'pending' CHECK (outcome_status IN ('pending', 'successful', 'partially_successful', 'unsuccessful', 'cancelled')),
  actual_outcome JSONB,
  outcome_notes TEXT,
  recorded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decision_outcomes_decision_id ON public.decision_outcomes(decision_id);
CREATE INDEX IF NOT EXISTS idx_decision_outcomes_user_id ON public.decision_outcomes(user_id);

DROP TRIGGER IF EXISTS update_decision_outcomes_updated_at ON public.decision_outcomes;
CREATE TRIGGER update_decision_outcomes_updated_at
  BEFORE UPDATE ON public.decision_outcomes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.decision_outcomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own decision outcomes" ON public.decision_outcomes;
CREATE POLICY "Users can select own decision outcomes"
  ON public.decision_outcomes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own decision outcomes" ON public.decision_outcomes;
CREATE POLICY "Users can insert own decision outcomes"
  ON public.decision_outcomes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own decision outcomes" ON public.decision_outcomes;
CREATE POLICY "Users can update own decision outcomes"
  ON public.decision_outcomes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own decision outcomes" ON public.decision_outcomes;
CREATE POLICY "Users can delete own decision outcomes"
  ON public.decision_outcomes FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------------
-- 6. Decision Usage Table (Phase 8)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decision_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  analysis_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT decision_usage_user_period_key UNIQUE(user_id, period_start)
);

CREATE INDEX IF NOT EXISTS idx_decision_usage_user_id ON public.decision_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_decision_usage_period ON public.decision_usage(user_id, period_start);

DROP TRIGGER IF EXISTS update_decision_usage_updated_at ON public.decision_usage;
CREATE TRIGGER update_decision_usage_updated_at
  BEFORE UPDATE ON public.decision_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.decision_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own usage" ON public.decision_usage;
CREATE POLICY "Users can view own usage"
  ON public.decision_usage FOR SELECT
  USING (auth.uid() = user_id);

-- RPC Function: reserve_decision_analysis
CREATE OR REPLACE FUNCTION public.reserve_decision_analysis(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_plan TEXT;
  v_limit INT;
  v_period_start DATE;
  v_usage RECORD;
BEGIN
  -- 1. Determine user plan (default 'free')
  SELECT COALESCE(plan, 'free') INTO v_plan
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_plan IS NULL THEN
    v_plan := 'free';
  END IF;

  -- 2. Determine plan limit
  IF v_plan = 'business' THEN
    v_limit := 100;
  ELSIF v_plan = 'pro' THEN
    v_limit := 30;
  ELSE
    v_limit := 3;
  END IF;

  -- 3. Determine current UTC period start date (1st day of current UTC month)
  v_period_start := date_trunc('month', NOW() AT TIME ZONE 'UTC')::date;

  -- 4. Ensure usage record exists for current period
  INSERT INTO public.decision_usage (user_id, period_start, analysis_count)
  VALUES (p_user_id, v_period_start, 0)
  ON CONFLICT (user_id, period_start) DO NOTHING;

  -- 5. Lock and check usage count
  SELECT * INTO v_usage
  FROM public.decision_usage
  WHERE user_id = p_user_id AND period_start = v_period_start
  FOR UPDATE;

  IF v_usage.analysis_count >= v_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'current_count', v_usage.analysis_count,
      'limit', v_limit,
      'plan', v_plan,
      'error', 'Monthly analysis limit reached. Please upgrade your plan.'
    );
  END IF;

  -- 6. Increment count
  UPDATE public.decision_usage
  SET analysis_count = analysis_count + 1,
      updated_at = NOW()
  WHERE id = v_usage.id;

  RETURN jsonb_build_object(
    'allowed', true,
    'current_count', v_usage.analysis_count + 1,
    'limit', v_limit,
    'plan', v_plan
  );
END;
$$;

-- RPC Function: release_decision_analysis
CREATE OR REPLACE FUNCTION public.release_decision_analysis(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_period_start DATE;
  v_current_count INT;
BEGIN
  v_period_start := date_trunc('month', NOW() AT TIME ZONE 'UTC')::date;

  UPDATE public.decision_usage
  SET analysis_count = GREATEST(0, analysis_count - 1),
      updated_at = NOW()
  WHERE user_id = p_user_id AND period_start = v_period_start
  RETURNING analysis_count INTO v_current_count;

  RETURN jsonb_build_object(
    'released', true,
    'current_count', COALESCE(v_current_count, 0)
  );
END;
$$;

