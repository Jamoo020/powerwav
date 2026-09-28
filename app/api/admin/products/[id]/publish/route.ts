import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  const existing = await pool.query(
    "SELECT id, published FROM products WHERE id = $1 LIMIT 1",
    [id],
  );

  if (existing.rowCount === 0) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const payload = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const published = typeof payload.published === "boolean"
    ? payload.published
    : !Boolean(existing.rows[0].published);

  const result = await pool.query(
    `UPDATE products
     SET published = $1
     WHERE id = $2
     RETURNING
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
       updated_at`,
    [published, id],
  );

  return NextResponse.json({ product: result.rows[0] }, { status: 200 });
}
