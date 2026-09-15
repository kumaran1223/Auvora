-- Create global AI provider usage table
CREATE TABLE IF NOT EXISTS public.ai_provider_usage (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    usage_date date NOT NULL,
    provider text NOT NULL,
    request_count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(usage_date, provider)
);

-- Enable RLS but deny all direct access by authenticated/anon users
ALTER TABLE public.ai_provider_usage ENABLE ROW LEVEL SECURITY;

-- Create RPC for atomic reservation
CREATE OR REPLACE FUNCTION public.reserve_ai_provider_request(
    p_provider text,
    p_daily_limit integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS \$\$
DECLARE
    v_current_date date;
    v_usage_record public.ai_provider_usage%ROWTYPE;
BEGIN
    v_current_date := (now() AT TIME ZONE 'UTC')::date;

    INSERT INTO public.ai_provider_usage (usage_date, provider, request_count)
    VALUES (v_current_date, p_provider, 0)
    ON CONFLICT (usage_date, provider) DO NOTHING;

    SELECT * INTO v_usage_record
    FROM public.ai_provider_usage
    WHERE usage_date = v_current_date AND provider = p_provider
    FOR UPDATE;

    IF v_usage_record.request_count >= p_daily_limit THEN
        RETURN false;
    END IF;

    UPDATE public.ai_provider_usage
    SET 
        request_count = request_count + 1,
        updated_at = now()
    WHERE usage_date = v_current_date AND provider = p_provider;

    RETURN true;
END;
\$\$;
