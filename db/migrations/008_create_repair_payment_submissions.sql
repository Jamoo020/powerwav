CREATE TABLE IF NOT EXISTS repair_payment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  payment_plan_id UUID NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  customer_message TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_ADMIN_CONFIRMATION',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by_admin_user_id UUID,
  reviewed_at TIMESTAMPTZ,
  payment_transaction_id UUID UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_payment_submissions_plan_ticket_fkey
    FOREIGN KEY (payment_plan_id, ticket_id)
    REFERENCES repair_payment_plans (id, ticket_id)
    ON DELETE RESTRICT,
  CONSTRAINT repair_payment_submissions_reviewed_by_admin_fkey
    FOREIGN KEY (reviewed_by_admin_user_id)
    REFERENCES admin_users (id)
    ON DELETE SET NULL,
  CONSTRAINT repair_payment_submissions_transaction_fkey
    FOREIGN KEY (payment_transaction_id)
    REFERENCES repair_payment_transactions (id)
    ON DELETE RESTRICT,
  CONSTRAINT repair_payment_submissions_amount_positive CHECK (amount > 0),
  CONSTRAINT repair_payment_submissions_method_check CHECK (
    payment_method IN ('CASH', 'MPESA', 'BANK_TRANSFER', 'CARD', 'OTHER')
  ),
  CONSTRAINT repair_payment_submissions_reference_nonempty CHECK (
    reference_number IS NULL OR btrim(reference_number) <> ''
  ),
  CONSTRAINT repair_payment_submissions_message_length_check CHECK (
    customer_message IS NULL OR length(customer_message) <= 2000
  ),
  CONSTRAINT repair_payment_submissions_status_check CHECK (
    status IN ('PENDING_ADMIN_CONFIRMATION', 'CONFIRMED', 'REJECTED')
  ),
  CONSTRAINT repair_payment_submissions_review_state_check CHECK (
    (status = 'PENDING_ADMIN_CONFIRMATION'
      AND reviewed_by_admin_user_id IS NULL
      AND reviewed_at IS NULL
      AND payment_transaction_id IS NULL)
    OR (status = 'CONFIRMED'
      AND reviewed_by_admin_user_id IS NOT NULL
      AND reviewed_at IS NOT NULL
      AND payment_transaction_id IS NOT NULL)
    OR (status = 'REJECTED'
      AND reviewed_by_admin_user_id IS NOT NULL
      AND reviewed_at IS NOT NULL
      AND payment_transaction_id IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS repair_payment_submissions_reference_unique_idx
  ON repair_payment_submissions (reference_number)
  WHERE reference_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS repair_payment_submissions_ticket_status_date_idx
  ON repair_payment_submissions (ticket_id, status, submitted_at DESC);

CREATE INDEX IF NOT EXISTS repair_payment_submissions_plan_status_date_idx
  ON repair_payment_submissions (payment_plan_id, status, submitted_at DESC);