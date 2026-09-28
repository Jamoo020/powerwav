export type ProductJsonValue =
  | string
  | number
  | boolean
  | null
  | ProductJsonValue[]
  | { [key: string]: ProductJsonValue };

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
  specifications: ProductJsonValue;
  applications: ProductJsonValue;
  sku: string | null;
  price: number | null;
  sale_price: number | null;
  availability: string | null;
  new_arrival: boolean;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category_id?: string;
  category?: string;
  q?: string;
  featured?: boolean;
  new_arrival?: boolean;
}

export class ProductApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductApiError";
  }
}

function buildProductsUrl(filters: ProductFilters = {}, baseUrl?: string): string {
  const params = new URLSearchParams();

  if (filters.category_id && filters.category_id.trim() !== "") {
    params.set("category_id", filters.category_id.trim());
  }

  if (filters.category && filters.category.trim() !== "") {
    params.set("category", filters.category.trim());
  }

  if (filters.q && filters.q.trim() !== "") {
    params.set("q", filters.q.trim());
  }

  if (filters.featured === true) {
    params.set("featured", "true");
  }

  if (filters.new_arrival === true) {
    params.set("new_arrival", "true");
  }

  const query = params.toString();
  const path = query ? `/api/products?${query}` : "/api/products";
  return baseUrl ? new URL(path, baseUrl).toString() : path;
}

async function parseErrorMessage(response: Response): Promise<string> {
  if (response.status === 404) {
    return "Product not found.";
  }

  if (response.status === 401 || response.status === 403) {
    return "You are not authorized to access this product.";
  }

  try {
    const payload = await response.json();
    if (payload && typeof payload.message === "string" && payload.message.trim() !== "") {
      if (payload.message.toLowerCase().includes("sql") || payload.message.toLowerCase().includes("database")) {
        return "Product data is currently unavailable.";
      }

      return payload.message;
    }
  } catch {
    // Ignore invalid JSON; fall back to generic client-safe message.
  }

  return "Product data is currently unavailable.";
}

async function readProductsResponse(response: Response): Promise<Product[]> {
  if (!response.ok) {
    throw new ProductApiError(await parseErrorMessage(response));
  }

  const payload = (await response.json()) as { products?: Product[] };

  return Array.isArray(payload.products) ? payload.products : [];
}

async function readSingleProductResponse(response: Response): Promise<Product> {
  if (!response.ok) {
    throw new ProductApiError(await parseErrorMessage(response));
  }

  const payload = (await response.json()) as { product?: Product };

  if (!payload.product) {
    throw new ProductApiError("Product not found.");
  }

  return payload.product;
}

export async function fetchPublishedProducts(filters: ProductFilters = {}, baseUrl?: string): Promise<Product[]> {
  const response = await fetch(buildProductsUrl(filters, baseUrl), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return readProductsResponse(response);
}

export async function fetchPublishedProductBySlug(slug: string, baseUrl?: string): Promise<Product> {
  const trimmedSlug = slug.trim();

  if (!trimmedSlug) {
    throw new ProductApiError("Product slug is required.");
  }

  const path = `/api/products/${encodeURIComponent(trimmedSlug)}`;
  const response = await fetch(baseUrl ? new URL(path, baseUrl).toString() : path, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return readSingleProductResponse(response);
}

export async function fetchPublishedProductsByFilters(filters: ProductFilters = {}, baseUrl?: string): Promise<Product[]> {
  return fetchPublishedProducts(filters, baseUrl);
}
