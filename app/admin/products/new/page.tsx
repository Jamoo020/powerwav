import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { listCategories } from "@/lib/catalogue/categories";
import { createProduct } from "@/lib/catalogue/products";
import { saveUploadedProductImage } from "@/lib/catalogue/images";
import type { Category, JsonValue } from "@/lib/catalogue/types";

export const dynamic = "force-dynamic";

function normalizeParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

async function getAdminContext() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

async function createProductAction(formData: FormData) {
  "use server";

  try {
    const categoryId = String(formData.get("category_id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const manufacturer = String(formData.get("manufacturer") ?? "").trim();
    const model = String(formData.get("model") ?? "").trim();
    const priceText = String(formData.get("price") ?? "").trim();
    const shortDescription = String(formData.get("short_description") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const image = formData.get("image");
    const featured = String(formData.get("featured") ?? "false") === "on";
    const published = String(formData.get("published") ?? "false") === "on";
    const specificationsText = String(formData.get("specifications") ?? "").trim();
    const applicationsText = String(formData.get("applications") ?? "").trim();
    const price = priceText === "" ? null : Number(priceText);

    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      throw new Error("Price must be a non-negative number.");
    }

    if (!categoryId || !name || !slug) {
      throw new Error("Category, name, and slug are required.");
    }

    let specifications: JsonValue = {};
    if (specificationsText) {
      const parsed = JSON.parse(specificationsText) as JsonValue;
      if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
        throw new Error("Specifications must be a JSON object.");
      }
      specifications = parsed;
    }

    let applications: JsonValue = [];
    if (applicationsText) {
      const parsed = JSON.parse(applicationsText) as JsonValue;
      if (!Array.isArray(parsed)) {
        throw new Error("Applications must be a JSON array.");
      }
      applications = parsed;
    }

    const imageUrl = await saveUploadedProductImage(
      image instanceof File ? image : null,
      slug,
      null,
    );

    await createProduct({
      category_id: categoryId,
      slug,
      name,
      manufacturer: manufacturer || null,
      model: model || null,
      short_description: shortDescription || null,
      description: description || null,
      image_url: imageUrl,
      price,
      specifications,
      applications,
      featured,
      published,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create product.";
    redirect("/admin/products/new?error=" + encodeURIComponent(message));
  }

  redirect("/admin/products?success=" + encodeURIComponent("Product created successfully."));
}

export default async function NewProductPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await getAdminContext();
  const params = (await searchParams) ?? {};
  const errorMessage = normalizeParam(params.error);

  let categories: Category[] = [];
  try {
    categories = await listCategories();
  } catch {
    // The page will show a user-friendly fallback message below.
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  PowerWave AV
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Add product</h1>
              </div>

              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Back to products
              </Link>
            </div>
          </header>

          <section className="px-5 py-6 sm:px-8 sm:py-8">
            {errorMessage ? (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            {categories.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                No categories are currently available. Create a category before adding a product.
              </div>
            ) : null}

            <form action={createProductAction} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="category_id" className="block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Product name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="PowerWave 4K HDMI Matrix"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                    Slug
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="powerwave-4k-hdmi-matrix"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="manufacturer" className="block text-sm font-medium text-slate-700">
                    Manufacturer / brand
                  </label>
                  <input
                    id="manufacturer"
                    name="manufacturer"
                    type="text"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="PowerWave AV"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="model" className="block text-sm font-medium text-slate-700">
                    Model
                  </label>
                  <input
                    id="model"
                    name="model"
                    type="text"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="PW-4K-48"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                    Price (GBP)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="Leave blank to show Enquire"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="image" className="block text-sm font-medium text-slate-700">
                    Product image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  <p className="text-xs text-slate-500">JPG, PNG, or WEBP up to 2 MB.</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="short_description" className="block text-sm font-medium text-slate-700">
                    Short description
                  </label>
                  <textarea
                    id="short_description"
                    name="short_description"
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="A concise summary for product listings."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="Provide the longer product explanation."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="specifications" className="block text-sm font-medium text-slate-700">
                    Specifications (JSON object)
                  </label>
                  <textarea
                    id="specifications"
                    name="specifications"
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder='{"inputs": 4, "resolution": "4K UHD"}'
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="applications" className="block text-sm font-medium text-slate-700">
                    Applications (JSON array)
                  </label>
                  <textarea
                    id="applications"
                    name="applications"
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder='["Conference rooms", "Training spaces", "Boardrooms"]'
                  />
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <input id="featured" name="featured" type="checkbox" className="h-4 w-4 accent-sky-600" />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                    Featured product
                  </label>
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <input id="published" name="published" type="checkbox" defaultChecked className="h-4 w-4 accent-sky-600" />
                  <label htmlFor="published" className="text-sm font-medium text-slate-700">
                    Published
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  Save product
                </button>

                <Link
                  href="/admin/products"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
