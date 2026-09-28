import "server-only";

import { pool } from "@/lib/db";
import {
  CatalogueRepositoryError,
  CatalogueValidationError,
  queryCatalogue,
  requireId,
  requireText,
  optionalText,
  validateJson,
} from "./repository";
import type {
  CreateProductInput,
  Product,
  ProductListOptions,
  UpdateProductInput,
} from "./types";

export async function listProducts(options: ProductListOptions = {}): Promise<Product[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (options.publishedOnly) {
    conditions.push("published = TRUE");
  }

  if (options.categoryId !== undefined) {
    conditions.push(`category_id = $${values.length + 1}`);
    values.push(requireId(options.categoryId, "Category id"));
  }

  if (options.featuredOnly) {
    conditions.push("featured = TRUE");
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return queryCatalogue<Product>(
    `SELECT id, category_id, slug, name, manufacturer, model, short_description,
          description, image_url, price, specifications, applications, featured, published,
            created_at, updated_at
     FROM products
     ${where}
     ORDER BY featured DESC, name ASC`,
    values,
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  return getSingleProduct("id", requireId(id, "Product id"));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getSingleProduct("slug", requireText(slug, "Product slug"));
}

async function getSingleProduct(field: "id" | "slug", value: string): Promise<Product | null> {
  const rows = await queryCatalogue<Product>(
    `SELECT id, category_id, slug, name, manufacturer, model, short_description,
          description, image_url, price, specifications, applications, featured, published,
            created_at, updated_at
     FROM products
     WHERE ${field} = $1
     LIMIT 1`,
    [value],
  );

  return rows[0] ?? null;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const categoryId = requireId(input.category_id, "Category id");
  const slug = requireText(input.slug, "Product slug");
  const name = requireText(input.name, "Product name");
  const specifications = input.specifications === undefined
    ? {}
    : validateJson(input.specifications, "Specifications");
  const applications = input.applications === undefined
    ? []
    : validateJson(input.applications, "Applications");

  const rows = await queryCatalogue<Product>(
    `INSERT INTO products (
       category_id, slug, name, manufacturer, model, short_description,
       description, image_url, price, specifications, applications, featured, published
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id, category_id, slug, name, manufacturer, model, short_description,
               description, image_url, price, specifications, applications, featured, published,
               created_at, updated_at`,
    [
      categoryId,
      slug,
      name,
      optionalText(input.manufacturer) ?? null,
      optionalText(input.model) ?? null,
      optionalText(input.short_description) ?? null,
      optionalText(input.description) ?? null,
      input.image_url ?? null,
      input.price ?? null,
      JSON.stringify(specifications),
      JSON.stringify(applications),
      input.featured ?? false,
      input.published ?? false,
    ],
  );

  return rows[0];
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product | null> {
  const productId = requireId(id, "Product id");
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.category_id !== undefined) {
    updates.push(`category_id = $${values.length + 1}`);
    values.push(requireId(input.category_id, "Category id"));
  }

  if (input.slug !== undefined) {
    updates.push(`slug = $${values.length + 1}`);
    values.push(requireText(input.slug, "Product slug"));
  }

  if (input.name !== undefined) {
    updates.push(`name = $${values.length + 1}`);
    values.push(requireText(input.name, "Product name"));
  }

  const textFields: Array<keyof Pick<
    UpdateProductInput,
    "manufacturer" | "model" | "short_description" | "description"
  >> = ["manufacturer", "model", "short_description", "description"];

  for (const field of textFields) {
    if (input[field] !== undefined) {
      updates.push(`${field} = $${values.length + 1}`);
      values.push(optionalText(input[field]) ?? null);
    }
  }

  if (input.image_url !== undefined) {
    updates.push(`image_url = $${values.length + 1}`);
    values.push(input.image_url ?? null);
  }

  if (input.price !== undefined) {
    updates.push(`price = $${values.length + 1}`);
    values.push(input.price);
  }

  if (input.specifications !== undefined) {
    updates.push(`specifications = $${values.length + 1}`);
    values.push(JSON.stringify(validateJson(input.specifications, "Specifications")));
  }

  if (input.applications !== undefined) {
    updates.push(`applications = $${values.length + 1}`);
    values.push(JSON.stringify(validateJson(input.applications, "Applications")));
  }

  if (input.featured !== undefined) {
    updates.push(`featured = $${values.length + 1}`);
    values.push(input.featured);
  }

  if (input.published !== undefined) {
    updates.push(`published = $${values.length + 1}`);
    values.push(input.published);
  }

  if (updates.length === 0) {
    throw new CatalogueValidationError("At least one product field is required for update.");
  }

  values.push(productId);
  const rows = await queryCatalogue<Product>(
    `UPDATE products
     SET ${updates.join(", ")}
     WHERE id = $${values.length}
     RETURNING id, category_id, slug, name, manufacturer, model, short_description,
               description, image_url, price, specifications, applications, featured, published,
               created_at, updated_at`,
    values,
  );

  return rows[0] ?? null;
}

export async function setProductPublished(id: string, published: boolean): Promise<Product | null> {
  return updateProduct(id, { published });
}

export async function archiveProduct(id: string): Promise<Product | null> {
  return setProductPublished(id, false);
}

export async function setProductFeatured(id: string, featured: boolean): Promise<Product | null> {
  return updateProduct(id, { featured });
}

export async function deleteProduct(id: string): Promise<boolean> {
  const productId = requireId(id, "Product id");

  try {
    const product = await getProductById(productId);
    const result = await pool.query<{ id: string }>(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [productId],
    );

    if (result.rowCount === 1 && product?.image_url) {
      const { clearStoredProductImage } = await import("@/lib/catalogue/images");
      await clearStoredProductImage(product.image_url);
    }

    return result.rowCount === 1;
  } catch {
    throw new CatalogueRepositoryError("Catalogue database operation failed.");
  }
}
