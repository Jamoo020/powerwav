ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE INDEX IF NOT EXISTS products_image_url_idx
  ON products (image_url);
