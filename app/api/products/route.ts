import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conditions: string[] = ["published = TRUE"];
  const values: unknown[] = [];

  const categoryId = searchParams.get("category_id") ?? searchParams.get("category");
  if (categoryId && categoryId.trim() !== "") {
    conditions.push(`category_id = $${values.length + 1}`);
    values.push(categoryId.trim());
  }

  const searchTerm = searchParams.get("q") ?? searchParams.get("search");
  if (searchTerm && searchTerm.trim() !== "") {
    const term = `%${searchTerm.trim().toLowerCase()}%`;
    conditions.push(`(
      LOWER(name) LIKE $${values.length + 1}
      OR LOWER(model) LIKE $${values.length + 2}
      OR LOWER(manufacturer) LIKE $${values.length + 3}
    )`);
    values.push(term, term, term);
  }

  if (searchParams.get("featured") === "true" || searchParams.get("featured") === "1") {
    conditions.push("featured = TRUE");
  }

  if (searchParams.get("new_arrival") === "true" || searchParams.get("new_arrival") === "1") {
    conditions.push("new_arrival = TRUE");
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

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
     ${whereClause}
     ORDER BY new_arrival DESC, featured DESC, created_at DESC`,
    values,
  );

  const products = result.rows.map((product) => ({
    ...product,
    price: product.price === null ? null : Number(product.price),
    sale_price: product.sale_price === null ? null : Number(product.sale_price),
  }));

  return NextResponse.json({ products }, { status: 200 });
}
