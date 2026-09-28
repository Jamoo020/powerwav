import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth";
import { pool } from "@/lib/db";

function requireText(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function optionalText(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Text fields must be strings or null.");
  }

  return value.trim();
}

function normalizeJson(value: unknown, fallback: unknown, field: string): unknown {
  if (value === undefined) {
    return fallback;
  }

  if (value === null) {
    return fallback;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`${field} must be valid JSON.`);
    }
  }

  if (typeof value === "object" || Array.isArray(value)) {
    return value;
  }

  throw new Error(`${field} must be an object or array.`);
}

function parsePrice(value: unknown, fieldName: string): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numeric = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;

  if (!Number.isFinite(numeric) || numeric < 0) {
    throw new Error(`${fieldName} must be a non-negative number.`);
  }

  return numeric;
}

async function validateCategoryExists(categoryId: string): Promise<void> {
  const result = await pool.query(
    "SELECT id FROM categories WHERE id = $1 LIMIT 1",
    [categoryId],
  );

  if (result.rowCount !== 1) {
    throw new Error("category_id does not reference a valid category.");
  }
}

async function validateUniqueSlug(slug: string, excludeId: string): Promise<void> {
  const result = await pool.query(
    "SELECT id FROM products WHERE lower(slug) = lower($1) AND id <> $2 LIMIT 1",
    [slug, excludeId],
  );

  if (result.rowCount && result.rowCount > 0) {
    throw new Error("A product with this slug already exists.");
  }
}

function validatePricePair(price: number | null, salePrice: number | null): void {
  if (salePrice !== null && price !== null && salePrice > price) {
    throw new Error("sale_price must be less than or equal to price.");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Request body must be an object." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  const existing = await pool.query(
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
       published
     FROM products
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  if (existing.rowCount === 0) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  try {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.category_id !== undefined) {
      const categoryId = requireText(data.category_id, "category_id");
      await validateCategoryExists(categoryId);
      updates.push(`category_id = $${values.length + 1}`);
      values.push(categoryId);
    }

    if (data.slug !== undefined) {
      const slug = requireText(data.slug, "slug");
      await validateUniqueSlug(slug, id);
      updates.push(`slug = $${values.length + 1}`);
      values.push(slug);
    }

    if (data.name !== undefined) {
      const name = requireText(data.name, "name");
      updates.push(`name = $${values.length + 1}`);
      values.push(name);
    }

    if (data.manufacturer !== undefined) {
      updates.push(`manufacturer = $${values.length + 1}`);
      values.push(optionalText(data.manufacturer) ?? null);
    }

    if (data.model !== undefined) {
      updates.push(`model = $${values.length + 1}`);
      values.push(optionalText(data.model) ?? null);
    }

    if (data.short_description !== undefined) {
      updates.push(`short_description = $${values.length + 1}`);
      values.push(optionalText(data.short_description) ?? null);
    }

    if (data.description !== undefined) {
      updates.push(`description = $${values.length + 1}`);
      values.push(optionalText(data.description) ?? null);
    }

    if (data.image_url !== undefined) {
      updates.push(`image_url = $${values.length + 1}`);
      values.push(optionalText(data.image_url) ?? null);
    }

    if (data.specifications !== undefined) {
      updates.push(`specifications = $${values.length + 1}`);
      values.push(normalizeJson(data.specifications, {}, "specifications"));
    }

    if (data.applications !== undefined) {
      updates.push(`applications = $${values.length + 1}`);
      values.push(normalizeJson(data.applications, [], "applications"));
    }

    if (data.featured !== undefined) {
      updates.push(`featured = $${values.length + 1}`);
      values.push(Boolean(data.featured));
    }

    if (data.published !== undefined) {
      updates.push(`published = $${values.length + 1}`);
      values.push(Boolean(data.published));
    }

    if (data.sku !== undefined) {
      updates.push(`sku = $${values.length + 1}`);
      values.push(optionalText(data.sku) ?? null);
    }

    if (data.price !== undefined) {
      const price = parsePrice(data.price, "price");
      updates.push(`price = $${values.length + 1}`);
      values.push(price);
    }

    if (data.sale_price !== undefined) {
      const salePrice = parsePrice(data.sale_price, "sale_price");
      updates.push(`sale_price = $${values.length + 1}`);
      values.push(salePrice);
    }

    if (data.availability !== undefined) {
      updates.push(`availability = $${values.length + 1}`);
      values.push(optionalText(data.availability) ?? null);
    }

    if (data.new_arrival !== undefined) {
      updates.push(`new_arrival = $${values.length + 1}`);
      values.push(Boolean(data.new_arrival));
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: "No product fields were supplied for update." }, { status: 400 });
    }

    const currentPrice = data.price !== undefined ? parsePrice(data.price, "price") : existing.rows[0].price;
    const currentSalePrice = data.sale_price !== undefined ? parsePrice(data.sale_price, "sale_price") : existing.rows[0].sale_price;
    validatePricePair(
      currentPrice === null || currentPrice === undefined ? null : Number(currentPrice),
      currentSalePrice === null || currentSalePrice === undefined ? null : Number(currentSalePrice),
    );

    values.push(id);
    const result = await pool.query(
      `UPDATE products
       SET ${updates.join(", ")}
       WHERE id = $${values.length}
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
      values,
    );

    return NextResponse.json({ product: result.rows[0] }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update product.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING id",
    [id],
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deleted: true }, { status: 200 });
}
