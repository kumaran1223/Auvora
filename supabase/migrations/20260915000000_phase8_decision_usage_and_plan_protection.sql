-- Phase 8 Migration: Decision Usage Tracking & Profile Plan Tampering Protection

-- 1. Profile Plan Tampering Protection Trigger
CREATE OR REPLACE FUNCTION public.prevent_profile_plan_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
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

-- 2. Decision Usage Table
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

-- 3. Atomic RPC Function: reserve_decision_analysis
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
  -- Determine user plan (default 'free')
  SELECT COALESCE(plan, 'free') INTO v_plan
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_plan IS NULL THEN
    v_plan := 'free';
  END IF;

  -- Determine plan limit
  IF v_plan = 'business' THEN
    v_limit := 100;
  ELSIF v_plan = 'pro' THEN
    v_limit := 30;
  ELSE
    v_limit := 3;
  END IF;

  -- Determine current UTC period start date (1st day of current UTC month)
  v_period_start := date_trunc('month', NOW() AT TIME ZONE 'UTC')::date;

  -- Ensure usage record exists for current period
  INSERT INTO public.decision_usage (user_id, period_start, analysis_count)
  VALUES (p_user_id, v_period_start, 0)
  ON CONFLICT (user_id, period_start) DO NOTHING;

  -- Lock and check usage count
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

  -- Increment count
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

-- 4. Atomic RPC Function: release_decision_analysis
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

