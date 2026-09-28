CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT admin_sessions_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES admin_users (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS admin_sessions_user_id_idx
  ON admin_sessions (user_id);

CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx
  ON admin_sessions (expires_at);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'admin_users_set_updated_at'
      AND tgrelid = 'admin_users'::regclass
  ) THEN
    CREATE TRIGGER admin_users_set_updated_at
      BEFORE UPDATE ON admin_users
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
