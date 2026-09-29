CREATE SEQUENCE IF NOT EXISTS repair_ticket_number_seq
  AS BIGINT
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  NO CYCLE;

CREATE TABLE IF NOT EXISTS repair_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_customers_full_name_nonempty CHECK (btrim(full_name) <> ''),
  CONSTRAINT repair_customers_phone_nonempty CHECK (btrim(phone) <> ''),
  CONSTRAINT repair_customers_email_nonempty CHECK (btrim(email) <> '')
);

CREATE TABLE IF NOT EXISTS repair_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_equipment_category_nonempty CHECK (btrim(category) <> ''),
  CONSTRAINT repair_equipment_brand_nonempty CHECK (btrim(brand) <> ''),
  CONSTRAINT repair_equipment_model_nonempty CHECK (btrim(model) <> ''),
  CONSTRAINT repair_equipment_serial_number_nonempty
    CHECK (serial_number IS NULL OR btrim(serial_number) <> '')
);

CREATE TABLE IF NOT EXISTS repair_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  tracking_token TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL,
  equipment_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUEST_RECEIVED',
  issue_description TEXT NOT NULL,
  additional_information TEXT,
  preferred_service_option TEXT,
  preferred_at TIMESTAMPTZ,
  assigned_admin_user_id UUID,
  created_by_admin_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_tickets_ticket_number_format
    CHECK (ticket_number ~ '^PW-[0-9]{4}-[0-9]{4,}$'),
  CONSTRAINT repair_tickets_tracking_token_secure_length
    CHECK (length(btrim(tracking_token)) >= 32),
  CONSTRAINT repair_tickets_status_check CHECK (status IN (
    'REQUEST_RECEIVED',
    'APPOINTMENT_SCHEDULED',
    'DEVICE_RECEIVED',
    'DIAGNOSIS_AND_QUOTE',
    'AWAITING_CUSTOMER_APPROVAL',
    'AWAITING_PARTS',
    'REPAIR_IN_PROGRESS',
    'TESTING_QC',
    'READY_FOR_COLLECTION',
    'COMPLETED',
    'CANCELLED'
  )),
  CONSTRAINT repair_tickets_issue_description_nonempty CHECK (btrim(issue_description) <> ''),
  CONSTRAINT repair_tickets_customer_fkey
    FOREIGN KEY (customer_id) REFERENCES repair_customers (id) ON DELETE RESTRICT,
  CONSTRAINT repair_tickets_equipment_fkey
    FOREIGN KEY (equipment_id) REFERENCES repair_equipment (id) ON DELETE RESTRICT,
  CONSTRAINT repair_tickets_assigned_admin_user_fkey
    FOREIGN KEY (assigned_admin_user_id) REFERENCES admin_users (id) ON DELETE SET NULL,
  CONSTRAINT repair_tickets_created_by_admin_user_fkey
    FOREIGN KEY (created_by_admin_user_id) REFERENCES admin_users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS repair_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  service_option TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  location_or_instructions TEXT,
  scheduled_by_admin_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_appointments_status_check CHECK (status IN (
    'SCHEDULED',
    'RESCHEDULED',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
  )),
  CONSTRAINT repair_appointments_service_option_nonempty CHECK (btrim(service_option) <> ''),
  CONSTRAINT repair_appointments_ticket_fkey
    FOREIGN KEY (ticket_id) REFERENCES repair_tickets (id) ON DELETE RESTRICT,
  CONSTRAINT repair_appointments_scheduled_by_admin_user_fkey
    FOREIGN KEY (scheduled_by_admin_user_id) REFERENCES admin_users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS repair_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  findings TEXT NOT NULL,
  recommended_action TEXT,
  diagnosed_by_admin_user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_diagnoses_findings_nonempty CHECK (btrim(findings) <> ''),
  CONSTRAINT repair_diagnoses_ticket_fkey
    FOREIGN KEY (ticket_id) REFERENCES repair_tickets (id) ON DELETE RESTRICT,
  CONSTRAINT repair_diagnoses_diagnosed_by_admin_user_fkey
    FOREIGN KEY (diagnosed_by_admin_user_id) REFERENCES admin_users (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS repair_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  diagnosis_id UUID NOT NULL,
  version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  currency CHAR(3) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  additional_charges NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  issued_by_admin_user_id UUID,
  issued_at TIMESTAMPTZ,
  decided_at TIMESTAMPTZ,
  decision_contact_name TEXT,
  decision_channel TEXT,
  decision_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_quotes_ticket_version_unique UNIQUE (ticket_id, version),
  CONSTRAINT repair_quotes_version_positive CHECK (version > 0),
  CONSTRAINT repair_quotes_status_check CHECK (status IN (
    'DRAFT',
    'ISSUED',
    'APPROVED',
    'REJECTED',
    'SUPERSEDED',
    'EXPIRED'
  )),
  CONSTRAINT repair_quotes_currency_format CHECK (currency ~ '^[A-Z]{3}$'),
  CONSTRAINT repair_quotes_subtotal_nonnegative CHECK (subtotal >= 0),
  CONSTRAINT repair_quotes_additional_charges_nonnegative CHECK (additional_charges >= 0),
  CONSTRAINT repair_quotes_total_nonnegative CHECK (total >= 0),
  CONSTRAINT repair_quotes_total_matches_amounts CHECK (total = subtotal + additional_charges),
  CONSTRAINT repair_quotes_decision_timestamp_required
    CHECK (status NOT IN ('APPROVED', 'REJECTED') OR decided_at IS NOT NULL),
  CONSTRAINT repair_quotes_ticket_fkey
    FOREIGN KEY (ticket_id) REFERENCES repair_tickets (id) ON DELETE RESTRICT,
  CONSTRAINT repair_quotes_diagnosis_fkey
    FOREIGN KEY (diagnosis_id) REFERENCES repair_diagnoses (id) ON DELETE RESTRICT,
  CONSTRAINT repair_quotes_issued_by_admin_user_fkey
    FOREIGN KEY (issued_by_admin_user_id) REFERENCES admin_users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS repair_quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL,
  line_number INTEGER NOT NULL,
  item_type TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_quote_items_quote_line_unique UNIQUE (quote_id, line_number),
  CONSTRAINT repair_quote_items_line_number_positive CHECK (line_number > 0),
  CONSTRAINT repair_quote_items_type_check CHECK (item_type IN ('PART', 'LABOUR', 'OTHER')),
  CONSTRAINT repair_quote_items_description_nonempty CHECK (btrim(description) <> ''),
  CONSTRAINT repair_quote_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT repair_quote_items_unit_amount_nonnegative CHECK (unit_amount >= 0),
  CONSTRAINT repair_quote_items_quote_fkey
    FOREIGN KEY (quote_id) REFERENCES repair_quotes (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS repair_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  customer_update TEXT,
  internal_note TEXT,
  actor_type TEXT NOT NULL,
  actor_admin_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT repair_timeline_events_event_type_nonempty CHECK (btrim(event_type) <> ''),
  CONSTRAINT repair_timeline_events_actor_type_check
    CHECK (actor_type IN ('ADMIN', 'CUSTOMER', 'SYSTEM')),
  CONSTRAINT repair_timeline_events_from_status_check CHECK (
    from_status IS NULL OR from_status IN (
      'REQUEST_RECEIVED',
      'APPOINTMENT_SCHEDULED',
      'DEVICE_RECEIVED',
      'DIAGNOSIS_AND_QUOTE',
      'AWAITING_CUSTOMER_APPROVAL',
      'AWAITING_PARTS',
      'REPAIR_IN_PROGRESS',
      'TESTING_QC',
      'READY_FOR_COLLECTION',
      'COMPLETED',
      'CANCELLED'
    )
  ),
  CONSTRAINT repair_timeline_events_to_status_check CHECK (
    to_status IS NULL OR to_status IN (
      'REQUEST_RECEIVED',
      'APPOINTMENT_SCHEDULED',
      'DEVICE_RECEIVED',
      'DIAGNOSIS_AND_QUOTE',
      'AWAITING_CUSTOMER_APPROVAL',
      'AWAITING_PARTS',
      'REPAIR_IN_PROGRESS',
      'TESTING_QC',
      'READY_FOR_COLLECTION',
      'COMPLETED',
      'CANCELLED'
    )
  ),
  CONSTRAINT repair_timeline_events_ticket_fkey
    FOREIGN KEY (ticket_id) REFERENCES repair_tickets (id) ON DELETE RESTRICT,
  CONSTRAINT repair_timeline_events_actor_admin_user_fkey
    FOREIGN KEY (actor_admin_user_id) REFERENCES admin_users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS repair_tickets_status_updated_at_idx
  ON repair_tickets (status, updated_at DESC);

CREATE INDEX IF NOT EXISTS repair_tickets_customer_created_at_idx
  ON repair_tickets (customer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS repair_tickets_equipment_created_at_idx
  ON repair_tickets (equipment_id, created_at DESC);

CREATE INDEX IF NOT EXISTS repair_tickets_assigned_admin_user_id_idx
  ON repair_tickets (assigned_admin_user_id);

CREATE INDEX IF NOT EXISTS repair_customers_phone_idx
  ON repair_customers (phone);

CREATE INDEX IF NOT EXISTS repair_customers_email_idx
  ON repair_customers (lower(email));

CREATE INDEX IF NOT EXISTS repair_equipment_serial_number_idx
  ON repair_equipment (serial_number)
  WHERE serial_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS repair_appointments_status_scheduled_at_idx
  ON repair_appointments (status, scheduled_at);

CREATE INDEX IF NOT EXISTS repair_appointments_ticket_scheduled_at_idx
  ON repair_appointments (ticket_id, scheduled_at DESC);

CREATE INDEX IF NOT EXISTS repair_diagnoses_ticket_created_at_idx
  ON repair_diagnoses (ticket_id, created_at DESC);

CREATE INDEX IF NOT EXISTS repair_quotes_ticket_status_idx
  ON repair_quotes (ticket_id, status);

CREATE INDEX IF NOT EXISTS repair_quotes_diagnosis_id_idx
  ON repair_quotes (diagnosis_id);

CREATE INDEX IF NOT EXISTS repair_timeline_events_ticket_created_at_idx
  ON repair_timeline_events (ticket_id, created_at DESC);

CREATE INDEX IF NOT EXISTS repair_timeline_events_actor_admin_user_id_idx
  ON repair_timeline_events (actor_admin_user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'repair_customers_set_updated_at'
      AND tgrelid = 'repair_customers'::regclass
  ) THEN
    CREATE TRIGGER repair_customers_set_updated_at
      BEFORE UPDATE ON repair_customers
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'repair_equipment_set_updated_at'
      AND tgrelid = 'repair_equipment'::regclass
  ) THEN
    CREATE TRIGGER repair_equipment_set_updated_at
      BEFORE UPDATE ON repair_equipment
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'repair_tickets_set_updated_at'
      AND tgrelid = 'repair_tickets'::regclass
  ) THEN
    CREATE TRIGGER repair_tickets_set_updated_at
      BEFORE UPDATE ON repair_tickets
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'repair_appointments_set_updated_at'
      AND tgrelid = 'repair_appointments'::regclass
  ) THEN
    CREATE TRIGGER repair_appointments_set_updated_at
      BEFORE UPDATE ON repair_appointments
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'repair_quotes_set_updated_at'
      AND tgrelid = 'repair_quotes'::regclass
  ) THEN
    CREATE TRIGGER repair_quotes_set_updated_at
      BEFORE UPDATE ON repair_quotes
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
