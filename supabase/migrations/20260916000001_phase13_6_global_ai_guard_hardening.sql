-- Harden global AI guard RPC
REVOKE EXECUTE ON FUNCTION public.reserve_ai_provider_request(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_ai_provider_request(text, integer) TO service_role;
