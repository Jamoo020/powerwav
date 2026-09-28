import "server-only";

import type { QueryResultRow } from "pg";
import { pool } from "@/lib/db";
import type { JsonValue } from "./types";

export class CatalogueValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogueValidationError";
  }
}

export class CatalogueRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogueRepositoryError";
  }
}

export function requireText(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new CatalogueValidationError(`${field} is required.`);
  }

  return value.trim();
}

export function optionalText(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new CatalogueValidationError("Text fields must be strings or null.");
  }

  return value.trim();
}

export function validateJson(value: unknown, field: string): JsonValue {
  if (value === undefined) {
    throw new CatalogueValidationError(`${field} must contain valid JSON.`);
  }

  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      throw new Error("Value is not serializable.");
    }

    return JSON.parse(serialized) as JsonValue;
  } catch {
    throw new CatalogueValidationError(`${field} must contain valid JSON.`);
  }
}

export function requireId(value: unknown, field: string): string {
  return requireText(value, field);
}

export async function queryCatalogue<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<T[]> {
  try {
    const result = await pool.query<T>(text, values);
    return result.rows;
  } catch {
    throw new CatalogueRepositoryError("Catalogue database operation failed.");
  }
}

export function isForeignKeyViolation(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "23503",
  );
}
