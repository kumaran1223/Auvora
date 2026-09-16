-- Migration: Admin Users Foundation

CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- NO policies created for authenticated/anon users.
-- Only the service_role (Admin Client) can read/write this table.

