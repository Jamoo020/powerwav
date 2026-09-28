import "server-only";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  manufacturer: string | null;
  model: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  price: string | null;
  specifications: JsonValue;
  applications: JsonValue;
  featured: boolean;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  published?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
  published?: boolean;
}

export interface CategoryListOptions {
  publishedOnly?: boolean;
}

export interface CreateProductInput {
  category_id: string;
  slug: string;
  name: string;
  manufacturer?: string | null;
  model?: string | null;
  short_description?: string | null;
  description?: string | null;
  image_url?: string | null;
  price?: number | null;
  specifications?: JsonValue;
  applications?: JsonValue;
  featured?: boolean;
  published?: boolean;
}

export interface UpdateProductInput {
  category_id?: string;
  slug?: string;
  name?: string;
  manufacturer?: string | null;
  model?: string | null;
  short_description?: string | null;
  description?: string | null;
  image_url?: string | null;
  price?: number | null;
  specifications?: JsonValue;
  applications?: JsonValue;
  featured?: boolean;
  published?: boolean;
}

export interface ProductListOptions {
  publishedOnly?: boolean;
  categoryId?: string;
  featuredOnly?: boolean;
}
