import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import {
  fetchPublishedProductBySlug,
  ProductApiError,
  type Product,
} from "@/lib/catalogue/client";

export const dynamic = "force-dynamic";

function getRequestOrigin(requestHeaders: Headers): string {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim()
    ?? (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");

  return host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const apiBaseUrl = getRequestOrigin(await headers());

  try {
    const product = await fetchPublishedProductBySlug(slug, apiBaseUrl);
    const description = product.short_description ?? product.description ?? "PowerWave AV product.";

    return {
      title: `${product.name} | PowerWave AV`,
      description,
      alternates: {
        canonical: `/shop/${product.slug}`,
      },
    };
  } catch {
    return {
      title: "Product | PowerWave AV",
      description: "PowerWave AV product catalogue.",
    };
  }
}

function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function ProductFacts({ product }: { product: Product }) {
  const items: Array<{ label: string; value: string }> = [];

  if (product.manufacturer) {
    items.push({ label: "Manufacturer", value: product.manufacturer });
  }

  if (product.model) {
    items.push({ label: "Model", value: product.model });
  }

  if (product.sku) {
    items.push({ label: "SKU", value: product.sku });
  }

  if (product.availability) {
    items.push({ label: "Availability", value: product.availability });
  }

  if (product.featured) {
    items.push({ label: "Status", value: "Featured" });
  }

  if (product.new_arrival) {
    items.push({ label: "Status", value: "New arrival" });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <dl className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</dt>
          <dd className="mt-2 text-base font-medium text-slate-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProductInfoBlock({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: string }>;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-base text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const apiBaseUrl = getRequestOrigin(await headers());

  let product: Product | null = null;
  let loadError = "";

  try {
    product = await fetchPublishedProductBySlug(slug, apiBaseUrl);
  } catch (error) {
    if (error instanceof ProductApiError && /not found/i.test(error.message)) {
      notFound();
    }

    loadError = error instanceof Error ? error.message : "Product information could not be loaded.";
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16 text-slate-900 lg:px-8">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-sm text-amber-800">
          {loadError || "This product could not be loaded."}
        </div>
        <div className="mt-6">
          <Link href="/shop" className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const priceText = formatMoney(product.price);
  const salePriceText = formatMoney(product.sale_price);

  const specificationEntries: Array<{ label: string; value: string }> = [];
  if (product.specifications && typeof product.specifications === "object" && !Array.isArray(product.specifications)) {
    Object.entries(product.specifications as Record<string, unknown>).forEach(([label, value]) => {
      const str = stringifyValue(value).trim();
      if (str) {
        specificationEntries.push({ label, value: str });
      }
    });
  }

  const applicationEntries: Array<{ label: string; value: string }> = [];
  if (Array.isArray(product.applications)) {
    product.applications.forEach((value, index) => {
      const str = stringifyValue(value).trim();
      if (str) {
        applicationEntries.push({ label: `Application ${index + 1}`, value: str });
      }
    });
  }

  const enquiryText = encodeURIComponent(
    `Hi PowerWave AV, I’m interested in the ${product.name}${product.model ? ` (${product.model})` : ""}. Please send more information.`,
  );

  return (
    <main className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-16">
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
            ← Back to Shop
          </Link>
        </div>

        <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[420px] bg-slate-100">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-950 px-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  PowerWave AV
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap gap-2">
                {product.featured ? (
                  <span className="rounded-full bg-sky-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    Featured
                  </span>
                ) : null}
                {product.new_arrival ? (
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    New arrival
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">AV equipment</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>

              {(product.manufacturer || product.model) ? (
                <p className="mt-4 text-lg text-slate-600">
                  {[product.manufacturer, product.model].filter(Boolean).join(" · ")}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {salePriceText ? (
                  <>
                    <span className="text-2xl font-semibold text-slate-900">{salePriceText}</span>
                    {priceText ? (
                      <span className="text-lg text-slate-400 line-through">{priceText}</span>
                    ) : null}
                  </>
                ) : priceText ? (
                  <span className="text-2xl font-semibold text-slate-900">{priceText}</span>
                ) : (
                  <span className="text-2xl font-semibold text-slate-900">Enquire</span>
                )}
              </div>

              {product.availability ? (
                <p className="mt-4 text-sm text-slate-600">Availability: {product.availability}</p>
              ) : null}

              <div className="mt-8 space-y-3">
                <a
                  href={`https://wa.me/254715825819?text=${enquiryText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  Enquire about this product
                </a>
                <a
                  href="mailto:info@powerwaveav.com?subject=Product%20Enquiry%20-%20PowerWave%20AV"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Email sales team
                </a>
              </div>

              <ProductFacts product={product} />
            </div>
          </div>

          <div className="space-y-8 border-t border-slate-200 bg-slate-50 p-6 sm:p-8 lg:p-10">
            {(product.short_description || product.description) ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
                <div className="mt-5 space-y-4 text-base leading-7 text-slate-700">
                  {product.short_description ? <p>{product.short_description}</p> : null}
                  {product.description ? <p>{product.description}</p> : null}
                </div>
              </div>
            ) : null}

            <ProductInfoBlock title="Specifications" items={specificationEntries} />
            <ProductInfoBlock title="Applications" items={applicationEntries} />
          </div>
        </article>
      </div>
    </main>
  );
}