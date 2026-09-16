-- Migration: Add goal-oriented onboarding to profiles
-- Date: 2026-09-16

-- Add the new columns safely
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_data JSONB,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- Update existing users to treat onboarding as completed
-- We mark any existing user as completed to not force them into onboarding unexpectedly.
-- A user is considered an "existing" user if they were created before this migration runs,
-- or explicitly if they have company_name, industry, company_size.
-- Since this is applied once, updating all current profiles to true is the safest way to ensure
-- no existing production user is disrupted.
UPDATE public.profiles
SET onboarding_completed = true
WHERE onboarding_completed = false;

