-- Phase 10A Migration: Unique Constraint on Decision Outcomes

-- Ensure one decision outcome record per decision
ALTER TABLE public.decision_outcomes
  DROP CONSTRAINT IF EXISTS decision_outcomes_decision_id_key;

ALTER TABLE public.decision_outcomes
  ADD CONSTRAINT decision_outcomes_decision_id_key UNIQUE (decision_id);

