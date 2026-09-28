import "server-only";

import { pool } from "@/lib/db";
import {
  CatalogueRepositoryError,
  CatalogueValidationError,
  isForeignKeyViolation,
  optionalText,
  queryCatalogue,
  requireId,
  requireText,
} from "./repository";
import type {
  Category,
  CategoryListOptions,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./types";

export async function listCategories(options: CategoryListOptions = {}): Promise<Category[]> {
  const where = options.publishedOnly ? "WHERE published = TRUE" : "";
  return queryCatalogue<Category>(
    `SELECT id, name, slug, description, published, created_at, updated_at
     FROM categories
     ${where}
     ORDER BY name ASC`,
  );
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return getSingleCategory("id", requireId(id, "Category id"));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return getSingleCategory("slug", requireText(slug, "Category slug"));
}

async function getSingleCategory(field: "id" | "slug", value: string): Promise<Category | null> {
  const rows = await queryCatalogue<Category>(
    `SELECT id, name, slug, description, published, created_at, updated_at
     FROM categories
     WHERE ${field} = $1
     LIMIT 1`,
    [value],
  );

  return rows[0] ?? null;
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const name = requireText(input.name, "Category name");
  const slug = requireText(input.slug, "Category slug");
  const description = optionalText(input.description);
  const published = input.published ?? true;

  const rows = await queryCatalogue<Category>(
    `INSERT INTO categories (name, slug, description, published)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, slug, description, published, created_at, updated_at`,
    [name, slug, description ?? null, published],
  );

  return rows[0];
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category | null> {
  const categoryId = requireId(id, "Category id");
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.name !== undefined) {
    updates.push(`name = $${values.length + 1}`);
    values.push(requireText(input.name, "Category name"));
  }

  if (input.slug !== undefined) {
    updates.push(`slug = $${values.length + 1}`);
    values.push(requireText(input.slug, "Category slug"));
  }

  if (input.description !== undefined) {
    updates.push(`description = $${values.length + 1}`);
    values.push(optionalText(input.description) ?? null);
  }

  if (input.published !== undefined) {
    updates.push(`published = $${values.length + 1}`);
    values.push(input.published);
  }

  if (updates.length === 0) {
    throw new CatalogueValidationError("At least one category field is required for update.");
  }

  values.push(categoryId);
  const rows = await queryCatalogue<Category>(
    `UPDATE categories
     SET ${updates.join(", ")}
     WHERE id = $${values.length}
     RETURNING id, name, slug, description, published, created_at, updated_at`,
    values,
  );

  return rows[0] ?? null;
}

export async function setCategoryPublished(id: string, published: boolean): Promise<Category | null> {
  return updateCategory(id, { published });
}

export async function archiveCategory(id: string): Promise<Category | null> {
  return setCategoryPublished(id, false);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categoryId = requireId(id, "Category id");

  try {
    const result = await pool.query<{ id: string }>(
      "DELETE FROM categories WHERE id = $1 RETURNING id",
      [categoryId],
    );
    return result.rowCount === 1;
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new CatalogueRepositoryError("Category cannot be deleted while products reference it.");
    }

    throw new CatalogueRepositoryError("Catalogue database operation failed.");
  }
}
