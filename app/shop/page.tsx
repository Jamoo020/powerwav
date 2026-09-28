import Link from "next/link";
import { headers } from "next/headers";

import { listCategories } from "@/lib/catalogue/categories";
import { fetchPublishedProducts, type Product } from "@/lib/catalogue/client";
import type { Category } from "@/lib/catalogue/types";

export const dynamic = "force-dynamic";

function getRequestOrigin(requestHeaders: Headers): string {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim()
    ?? (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");

  return host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function ProductImage({ product }: { product: Product }) {
  if (product.image_url) {
    return (
      <img
        src={product.image_url}
        alt={product.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-slate-950 px-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
      PowerWave AV
    </div>
  );
}

function ProductCard({ product, categoryName }: { product: Product; categoryName: string }) {
  const priceText = product.sale_price !== null && product.sale_price !== undefined
    ? `${product.sale_price.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}`
    : product.price !== null && product.price !== undefined
      ? `${product.price.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}`
      : "Enquire";

  const showSalePrice = product.sale_price !== null && product.sale_price !== undefined && product.price !== null && product.price !== undefined;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <ProductImage product={product} />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.featured ? (
              <span className="rounded-full bg-sky-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                Featured
              </span>
            ) : null}
            {product.new_arrival ? (
              <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                New
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">{categoryName}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{product.name}</h3>
          </div>

          {(product.manufacturer || product.model) ? (
            <p className="text-sm text-slate-600">
              {[product.manufacturer, product.model].filter(Boolean).join(" · ")}
            </p>
          ) : null}

          <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
            {showSalePrice ? (
              <>
                <span className="text-slate-400 line-through">
                  {product.price?.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
                </span>
                <span>{priceText}</span>
              </>
            ) : (
              <span>{priceText}</span>
            )}
          </div>

          {product.availability ? (
            <p className="text-sm text-slate-600">Availability: {product.availability}</p>
          ) : null}

          <span className="inline-flex items-center text-sm font-semibold text-sky-700">
            View product
          </span>
        </div>
      </Link>
    </article>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const query = firstParam(params.q).trim();
  const category = firstParam(params.category).trim();
  const categoryId = firstParam(params.category_id).trim();
  const featured = firstParam(params.featured) === "true" || firstParam(params.featured) === "1";
  const newArrival = firstParam(params.new_arrival) === "true" || firstParam(params.new_arrival) === "1";
  const apiBaseUrl = getRequestOrigin(await headers());

  let products: Product[] = [];
  let categories: Category[] = [];
  let loadError = false;

  try {
    [products, categories] = await Promise.all([
      fetchPublishedProducts({ q: query || undefined, category_id: categoryId || undefined, category: category || undefined, featured: featured || undefined, new_arrival: newArrival || undefined }, apiBaseUrl),
      listCategories({ publishedOnly: true }),
    ]);
  } catch {
    loadError = true;
  }

  const categoryMap = new Map(categories.map((item) => [item.id, item.name]));
  const hasActiveFilters = Boolean(query || category || categoryId || featured || newArrival);

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">PowerWave AV Shop</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Professional AV equipment for every space.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Browse our published catalogue of AV solutions, from conferencing and display systems to sound, security, and installation-ready equipment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form action="/shop" method="get" className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto_auto]">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search products, brands, or models"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

            <select
              name="category"
              defaultValue={category}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input type="checkbox" name="featured" value="true" defaultChecked={featured} className="h-4 w-4 accent-sky-600" />
              Featured
            </label>

            <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input type="checkbox" name="new_arrival" value="true" defaultChecked={newArrival} className="h-4 w-4 accent-sky-600" />
              New
            </label>

            <div className="md:col-span-4 flex items-center gap-3">
              <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
                Apply filters
              </button>
              {hasActiveFilters ? (
                <Link href="/shop" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                  Clear filters
                </Link>
              ) : null}
            </div>
          </form>
        </div>

        {loadError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            The catalogue is temporarily unavailable. Please try again shortly.
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-xl font-semibold text-slate-900">No products match your current search.</h2>
            <p className="mt-2 text-sm text-slate-600">Try a different keyword or clear the active filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryMap.get(product.category_id) ?? "AV equipment"}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}