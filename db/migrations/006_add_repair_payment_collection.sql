DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'repair_quotes_ticket_id_id_unique'
      AND conrelid = 'repair_quotes'::regclass
  ) THEN
    ALTER TABLE repair_quotes
      ADD CONSTRAINT repair_quotes_ticket_id_id_unique UNIQUE (ticket_id, id);
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS repair_payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  quote_id UUID NOT NULL,
  payment_requirement TEXT NOT NULL,
  required_deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_arrangement_status TEXT NOT NULL DEFAULT 'NOT_REQUESTED',
  proposed_payment_amount NUMERIC(12,2),
  proposed_payment_at TIMESTAMPTZ,
  arrangement_reviewed_by_admin_user_id UUID,
  arrangement_reviewed_at TIMESTAMPTZ,
  collection_deadline TIMESTAMPTZ,
  collection_status TEXT NOT NULL DEFAULT 'NOT_READY',
  collected_at TIMESTAMPTZ,
  collected_by_admin_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_payment_plans_ticket_quote_unique UNIQUE (ticket_id, quote_id),
  CONSTRAINT repair_payment_plans_id_ticket_unique UNIQUE (id, ticket_id),
  CONSTRAINT repair_payment_plans_quote_fkey
    FOREIGN KEY (ticket_id, quote_id)
    REFERENCES repair_quotes (ticket_id, id)
    ON DELETE RESTRICT,
  CONSTRAINT repair_payment_plans_reviewed_by_admin_fkey
    FOREIGN KEY (arrangement_reviewed_by_admin_user_id)
    REFERENCES admin_users (id)
    ON DELETE SET NULL,
  CONSTRAINT repair_payment_plans_collected_by_admin_fkey
    FOREIGN KEY (collected_by_admin_user_id)
    REFERENCES admin_users (id)
    ON DELETE SET NULL,
  CONSTRAINT repair_payment_plans_requirement_check CHECK (
    payment_requirement IN (
      'FULL_PAYMENT',
      'DEPOSIT',
      'PAYMENT_ARRANGEMENT',
      'PAY_ON_COLLECTION'
    )
  ),
  CONSTRAINT repair_payment_plans_deposit_nonnegative CHECK (required_deposit_amount >= 0),
  CONSTRAINT repair_payment_plans_deposit_mode_check CHECK (
    (payment_requirement = 'DEPOSIT' AND required_deposit_amount > 0)
    OR (payment_requirement <> 'DEPOSIT' AND required_deposit_amount = 0)
  ),
  CONSTRAINT repair_payment_plans_arrangement_status_check CHECK (
    payment_arrangement_status IN (
      'NOT_REQUESTED',
      'PENDING_ADMIN_REVIEW',
      'APPROVED',
      'REJECTED'
    )
  ),
  CONSTRAINT repair_payment_plans_proposed_amount_positive CHECK (
    proposed_payment_amount IS NULL OR proposed_payment_amount > 0
  ),
  CONSTRAINT repair_payment_plans_arrangement_state_check CHECK (
    (
      payment_arrangement_status = 'NOT_REQUESTED'
      AND proposed_payment_amount IS NULL
      AND proposed_payment_at IS NULL
      AND arrangement_reviewed_by_admin_user_id IS NULL
      AND arrangement_reviewed_at IS NULL
    )
    OR (
      payment_arrangement_status = 'PENDING_ADMIN_REVIEW'
      AND proposed_payment_amount IS NOT NULL
      AND proposed_payment_at IS NOT NULL
      AND arrangement_reviewed_by_admin_user_id IS NULL
      AND arrangement_reviewed_at IS NULL
    )
    OR (
      payment_arrangement_status IN ('APPROVED', 'REJECTED')
      AND proposed_payment_amount IS NOT NULL
      AND proposed_payment_at IS NOT NULL
      AND arrangement_reviewed_by_admin_user_id IS NOT NULL
      AND arrangement_reviewed_at IS NOT NULL
    )
  ),
  CONSTRAINT repair_payment_plans_collection_status_check CHECK (
    collection_status IN ('NOT_READY', 'READY', 'COLLECTED', 'OVERDUE')
  ),
  CONSTRAINT repair_payment_plans_collection_deadline_check CHECK (
    collection_status <> 'OVERDUE' OR collection_deadline IS NOT NULL
  ),
  CONSTRAINT repair_payment_plans_collected_state_check CHECK (
    (collection_status = 'COLLECTED' AND collected_at IS NOT NULL)
    OR (collection_status <> 'COLLECTED' AND collected_at IS NULL AND collected_by_admin_user_id IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS repair_payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  payment_plan_id UUID NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recorded_by_admin_user_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_payment_transactions_ticket_plan_fkey
    FOREIGN KEY (payment_plan_id, ticket_id)
    REFERENCES repair_payment_plans (id, ticket_id)
    ON DELETE RESTRICT,
  CONSTRAINT repair_payment_transactions_recorded_by_admin_fkey
    FOREIGN KEY (recorded_by_admin_user_id)
    REFERENCES admin_users (id)
    ON DELETE SET NULL,
  CONSTRAINT repair_payment_transactions_amount_positive CHECK (amount > 0),
  CONSTRAINT repair_payment_transactions_method_check CHECK (
    payment_method IN ('CASH', 'MPESA', 'BANK_TRANSFER', 'CARD', 'OTHER')
  ),
  CONSTRAINT repair_payment_transactions_reference_nonempty CHECK (
    reference_number IS NULL OR btrim(reference_number) <> ''
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS repair_payment_transactions_reference_unique_idx
  ON repair_payment_transactions (reference_number)
  WHERE reference_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS repair_payment_plans_ticket_arrangement_status_idx
  ON repair_payment_plans (ticket_id, payment_arrangement_status);

CREATE INDEX IF NOT EXISTS repair_payment_plans_collection_deadline_idx
  ON repair_payment_plans (collection_status, collection_deadline)
  WHERE collection_deadline IS NOT NULL;

CREATE INDEX IF NOT EXISTS repair_payment_transactions_ticket_date_idx
  ON repair_payment_transactions (ticket_id, payment_date DESC);

CREATE INDEX IF NOT EXISTS repair_payment_transactions_plan_date_idx
  ON repair_payment_transactions (payment_plan_id, payment_date DESC);

CREATE OR REPLACE FUNCTION validate_repair_payment_plan_quote()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  quote_status TEXT;
  quote_total NUMERIC(12,2);
BEGIN
  SELECT status, total
  INTO quote_status, quote_total
  FROM repair_quotes
  WHERE id = NEW.quote_id AND ticket_id = NEW.ticket_id
  FOR SHARE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment plan quote does not belong to the repair ticket';
  END IF;

  IF quote_status <> 'APPROVED' THEN
    RAISE EXCEPTION 'Payment plans require an approved repair quote';
  END IF;

  IF NEW.required_deposit_amount > quote_total THEN
    RAISE EXCEPTION 'Required deposit cannot exceed the approved quote amount';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS repair_payment_plans_validate_quote ON repair_payment_plans;
CREATE TRIGGER repair_payment_plans_validate_quote
  BEFORE INSERT OR UPDATE OF ticket_id, quote_id, payment_requirement, required_deposit_amount
  ON repair_payment_plans
  FOR EACH ROW
  EXECUTE FUNCTION validate_repair_payment_plan_quote();

CREATE OR REPLACE FUNCTION validate_repair_payment_transaction_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  quote_status TEXT;
  quote_total NUMERIC(12,2);
  already_paid NUMERIC(12,2);
BEGIN
  IF TG_OP = 'UPDATE'
    AND (NEW.ticket_id <> OLD.ticket_id OR NEW.payment_plan_id <> OLD.payment_plan_id) THEN
    RAISE EXCEPTION 'A payment cannot be moved to a different repair or payment plan';
  END IF;

  SELECT q.status, q.total
  INTO quote_status, quote_total
  FROM repair_payment_plans p
  JOIN repair_quotes q ON q.id = p.quote_id AND q.ticket_id = p.ticket_id
  WHERE p.id = NEW.payment_plan_id AND p.ticket_id = NEW.ticket_id
  FOR UPDATE OF p;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment plan does not belong to the repair ticket';
  END IF;

  IF quote_status <> 'APPROVED' THEN
    RAISE EXCEPTION 'Payments require an approved repair quote';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    SELECT COALESCE(SUM(amount), 0)
    INTO already_paid
    FROM repair_payment_transactions
    WHERE payment_plan_id = NEW.payment_plan_id AND id <> OLD.id;
  ELSE
    SELECT COALESCE(SUM(amount), 0)
    INTO already_paid
    FROM repair_payment_transactions
    WHERE payment_plan_id = NEW.payment_plan_id;
  END IF;

  IF already_paid + NEW.amount > quote_total THEN
    RAISE EXCEPTION 'Payments cannot exceed the approved quote amount';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS repair_payment_transactions_validate_amount ON repair_payment_transactions;
CREATE TRIGGER repair_payment_transactions_validate_amount
  BEFORE INSERT OR UPDATE OF ticket_id, payment_plan_id, amount
  ON repair_payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_repair_payment_transaction_amount();

DROP TRIGGER IF EXISTS repair_payment_plans_set_updated_at ON repair_payment_plans;
CREATE TRIGGER repair_payment_plans_set_updated_at
  BEFORE UPDATE ON repair_payment_plans
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE VIEW repair_payment_balances AS
WITH payments_by_plan AS (
  SELECT payment_plan_id, SUM(amount) AS amount_paid
  FROM repair_payment_transactions
  GROUP BY payment_plan_id
)
SELECT p.id AS payment_plan_id,
       p.ticket_id,
       p.quote_id,
       q.total AS approved_amount,
       p.required_deposit_amount,
       COALESCE(t.amount_paid, 0::NUMERIC(12,2)) AS amount_paid,
       q.total - COALESCE(t.amount_paid, 0::NUMERIC(12,2)) AS outstanding_balance,
       p.payment_requirement,
       p.payment_arrangement_status,
       p.collection_deadline,
       p.collection_status
FROM repair_payment_plans p
JOIN repair_quotes q ON q.id = p.quote_id AND q.ticket_id = p.ticket_id
LEFT JOIN payments_by_plan t ON t.payment_plan_id = p.id;