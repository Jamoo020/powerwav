CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  short_description TEXT,
  description TEXT,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  applications JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT products_category_id_fkey
    FOREIGN KEY (category_id)
    REFERENCES categories (id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS products_category_id_idx
  ON products (category_id);

CREATE INDEX IF NOT EXISTS products_published_idx
  ON products (published);

CREATE INDEX IF NOT EXISTS products_featured_idx
  ON products (featured);

CREATE INDEX IF NOT EXISTS categories_published_idx
  ON categories (published);

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
    WHERE tgname = 'categories_set_updated_at'
      AND tgrelid = 'categories'::regclass
  ) THEN
    CREATE TRIGGER categories_set_updated_at
      BEFORE UPDATE ON categories
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'products_set_updated_at'
      AND tgrelid = 'products'::regclass
  ) THEN
    CREATE TRIGGER products_set_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
