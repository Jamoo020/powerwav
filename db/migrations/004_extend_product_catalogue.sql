ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku TEXT;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS price NUMERIC(12,2);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sale_price NUMERIC(12,2);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS availability TEXT;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS new_arrival BOOLEAN NOT NULL DEFAULT FALSE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_price_nonnegative'
      AND conrelid = 'products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_price_nonnegative
      CHECK (price IS NULL OR price >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_sale_price_nonnegative'
      AND conrelid = 'products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_sale_price_nonnegative
      CHECK (sale_price IS NULL OR sale_price >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_sale_price_lte_price'
      AND conrelid = 'products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_sale_price_lte_price
      CHECK (sale_price IS NULL OR price IS NULL OR sale_price <= price);
  END IF;
END
$$;

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id UUID;

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'categories_parent_id_fkey'
      AND conrelid = 'categories'::regclass
  ) THEN
    ALTER TABLE categories
      ADD CONSTRAINT categories_parent_id_fkey
      FOREIGN KEY (parent_id)
      REFERENCES categories (id)
      ON DELETE SET NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS products_sku_idx
  ON products (sku);

CREATE INDEX IF NOT EXISTS products_availability_idx
  ON products (availability);

CREATE INDEX IF NOT EXISTS products_new_arrival_idx
  ON products (new_arrival);

CREATE INDEX IF NOT EXISTS categories_parent_id_idx
  ON categories (parent_id);

CREATE INDEX IF NOT EXISTS categories_sort_order_idx
  ON categories (sort_order);
