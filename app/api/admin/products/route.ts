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

async function validateUniqueSlug(slug: string, excludeId?: string): Promise<void> {
  const result = await pool.query(
    `SELECT id FROM products WHERE lower(slug) = lower($1) ${excludeId ? "AND id <> $2" : ""} LIMIT 1`,
    excludeId ? [slug, excludeId] : [slug],
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

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

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
     ORDER BY created_at DESC`,
  );

  return NextResponse.json({ products: result.rows }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

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

  try {
    const categoryId = requireText(data.category_id, "category_id");
    const slug = requireText(data.slug, "slug");
    const name = requireText(data.name, "name");

    await validateCategoryExists(categoryId);
    await validateUniqueSlug(slug);

    const manufacturer = optionalText(data.manufacturer);
    const model = optionalText(data.model);
    const shortDescription = optionalText(data.short_description);
    const description = optionalText(data.description);
    const imageUrl = optionalText(data.image_url) ?? null;
    const specifications = normalizeJson(data.specifications, {}, "specifications");
    const applications = normalizeJson(data.applications, [], "applications");
    const featured = Boolean(data.featured ?? false);
    const published = Boolean(data.published ?? false);
    const sku = optionalText(data.sku) ?? null;
    const price = parsePrice(data.price, "price");
    const salePrice = parsePrice(data.sale_price, "sale_price");
    const availability = optionalText(data.availability) ?? null;
    const newArrival = Boolean(data.new_arrival ?? false);

    validatePricePair(price, salePrice);

    const result = await pool.query(
      `INSERT INTO products (
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
        featured,
        published,
        sku,
        price,
        sale_price,
        availability,
        new_arrival
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
      [
        categoryId,
        slug,
        name,
        manufacturer,
        model,
        shortDescription,
        description,
        imageUrl,
        specifications,
        applications,
        featured,
        published,
        sku,
        price,
        salePrice,
        availability,
        newArrival,
      ],
    );

    return NextResponse.json({ product: result.rows[0] }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create product.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
