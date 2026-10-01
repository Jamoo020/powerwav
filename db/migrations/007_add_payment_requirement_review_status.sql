ALTER TABLE repair_payment_plans
  ADD COLUMN IF NOT EXISTS payment_requirement_status TEXT NOT NULL DEFAULT 'ACCEPTED';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'repair_payment_plans_requirement_status_check'
      AND conrelid = 'repair_payment_plans'::regclass
  ) THEN
    ALTER TABLE repair_payment_plans
      ADD CONSTRAINT repair_payment_plans_requirement_status_check CHECK (
        payment_requirement_status IN ('ACCEPTED', 'PENDING_ADMIN_REVIEW', 'REJECTED')
        AND (
          payment_requirement_status <> 'PENDING_ADMIN_REVIEW'
          OR payment_requirement IN ('PAYMENT_ARRANGEMENT', 'PAY_ON_COLLECTION')
        )
      );
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS repair_payment_plans_requirement_review_status_idx
  ON repair_payment_plans (payment_requirement_status, ticket_id);