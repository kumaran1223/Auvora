-- Phase 9 Migration: Razorpay Subscriptions & Webhook Events

-- 1. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'business')),
  razorpay_subscription_id TEXT NOT NULL UNIQUE,
  razorpay_plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created' CHECK (
    status IN ('created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired')
  ),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  last_webhook_created_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_sub_id ON public.subscriptions(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Webhook Events Table (Idempotency)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- 3. Automatic Profile Plan Synchronization Trigger
CREATE OR REPLACE FUNCTION public.sync_profile_plan_from_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_active_plan TEXT;
BEGIN
  -- Determine the active paid subscription plan for the user:
  -- Only status = 'active' or (status = 'cancelled' with cancel_at_period_end = true AND period unexpired) grants paid entitlement.
  SELECT plan INTO v_active_plan
  FROM public.subscriptions
  WHERE user_id = NEW.user_id
    AND (
      status = 'active'
      OR (status = 'cancelled' AND cancel_at_period_end = TRUE AND (current_period_end IS NULL OR current_period_end > NOW()))
    )
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_active_plan IS NOT NULL THEN
    UPDATE public.profiles
    SET plan = v_active_plan
    WHERE id = NEW.user_id;
  ELSE
    UPDATE public.profiles
    SET plan = 'free'
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_subscription_status_change ON public.subscriptions;
CREATE TRIGGER on_subscription_status_change
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_plan_from_subscription();

-- 4. Update reserve_decision_analysis to check subscription entitlement dynamically
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
  -- 1. Determine effective user plan dynamically from active unexpired subscription
  SELECT plan INTO v_plan
  FROM public.subscriptions
  WHERE user_id = p_user_id
    AND (
      status = 'active'
      OR (status = 'cancelled' AND cancel_at_period_end = TRUE AND (current_period_end IS NULL OR current_period_end > NOW()))
    )
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_plan IS NULL THEN
    -- Fall back to profiles table (for manual overrides) or default to 'free'
    SELECT COALESCE(plan, 'free') INTO v_plan
    FROM public.profiles
    WHERE id = p_user_id;

    IF v_plan IS NULL THEN
      v_plan := 'free';
    END IF;
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
