import { NextResponse } from "next/server";

import { pool } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const result = await pool.query(
    `SELECT
       id,
       category_id,
       slug,
       name,
       manufacturer,
       model,
       short_description,
       description,
       image_url,
       specifications,
       applications,
       sku,
       price,
       sale_price,
       availability,
       new_arrival,
       featured,
       published,
       created_at,
       updated_at
     FROM products
     WHERE slug = $1 AND published = TRUE
     LIMIT 1`,
    [slug],
  );

  const product = result.rows[0];
  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      ...product,
      price: product.price === null ? null : Number(product.price),
      sale_price: product.sale_price === null ? null : Number(product.sale_price),
    },
  }, { status: 200 });
}
