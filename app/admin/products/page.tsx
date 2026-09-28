import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { listCategories } from "@/lib/catalogue/categories";
import {
  archiveProduct,
  deleteProduct,
  listProducts,
  setProductFeatured,
  setProductPublished,
} from "@/lib/catalogue/products";
import type { Category, Product } from "@/lib/catalogue/types";

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

async function toggleProductPublished(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const published = String(formData.get("published") ?? "false") === "true";

  try {
    await setProductPublished(id, published);
    redirect(
      "/admin/products?success=" +
        encodeURIComponent(published ? "Product published." : "Product unpublished."),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update product publication status.";
    redirect("/admin/products?error=" + encodeURIComponent(message));
  }
}

async function toggleProductFeatured(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const featured = String(formData.get("featured") ?? "false") === "true";

  try {
    await setProductFeatured(id, featured);
    redirect(
      "/admin/products?success=" +
        encodeURIComponent(featured ? "Product marked as featured." : "Product removed from featured listing."),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update featured status.";
    redirect("/admin/products?error=" + encodeURIComponent(message));
  }
}

async function archiveProductAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();

  try {
    await archiveProduct(id);
    redirect("/admin/products?success=" + encodeURIComponent("Product archived."));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to archive product.";
    redirect("/admin/products?error=" + encodeURIComponent(message));
  }
}

async function deleteProductAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();

  try {
    const deleted = await deleteProduct(id);
    if (!deleted) {
      redirect("/admin/products?error=" + encodeURIComponent("Product could not be deleted."));
    }

    redirect("/admin/products?success=" + encodeURIComponent("Product deleted successfully."));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete product.";
    redirect("/admin/products?error=" + encodeURIComponent(message));
  }
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminContext();
  const params = (await searchParams) ?? {};
  const query = normalizeParam(params.q).trim();
  const successMessage = normalizeParam(params.success);
  const errorMessage = normalizeParam(params.error);

  let products: Product[] = [];
  let categories: Category[] = [];
  let loadError = "";

  try {
    [products, categories] = await Promise.all([listProducts(), listCategories()]);
  } catch {
    loadError = "Product data is currently unavailable. Please check the database connection and try again.";
  }

  const filteredProducts = query
    ? products.filter((product) => {
        const haystack = [
          product.name,
          product.manufacturer ?? "",
          product.model ?? "",
          product.slug,
          categories.find((category) => category.id === product.category_id)?.name ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query.toLowerCase());
      })
    : products;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  PowerWave AV
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Product management</h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  + Add product
                </Link>
                <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
                  Signed in as <span className="font-medium text-white">{session.user.email}</span>
                </div>
              </div>
            </div>
          </header>

          <section className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
            {(successMessage || errorMessage || loadError) && (
              <div className="space-y-3">
                {successMessage ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {successMessage}
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </div>
                ) : null}

                {loadError ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {loadError}
                  </div>
                ) : null}
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <form method="GET" action="/admin/products" className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search products by name, brand, model, slug..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">Products</h2>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                  {filteredProducts.length} total
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  No products match the current search.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 bg-white text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Name</th>
                          <th className="px-4 py-3 font-semibold">Brand</th>
                          <th className="px-4 py-3 font-semibold">Model</th>
                          <th className="px-4 py-3 font-semibold">Category</th>
                          <th className="px-4 py-3 font-semibold">Published</th>
                          <th className="px-4 py-3 font-semibold">Featured</th>
                          <th className="px-4 py-3 font-semibold">Updated</th>
                          <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredProducts.map((product) => {
                          const categoryName =
                            categories.find((category) => category.id === product.category_id)?.name ?? "Unassigned";

                          return (
                            <tr key={product.id} className="align-top">
                              <td className="px-4 py-4 font-medium text-slate-900">{product.name}</td>
                              <td className="px-4 py-4 text-slate-600">{product.manufacturer ?? "—"}</td>
                              <td className="px-4 py-4 text-slate-600">{product.model ?? "—"}</td>
                              <td className="px-4 py-4 text-slate-600">{categoryName}</td>
                              <td className="px-4 py-4">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                    product.published
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {product.published ? "Published" : "Draft"}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                    product.featured
                                      ? "bg-sky-100 text-sky-700"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {product.featured ? "Featured" : "Standard"}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-slate-600">
                                {new Date(product.updated_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-wrap gap-2">
                                  {product.image_url ? (
                                    <img
                                      src={product.image_url}
                                      alt={product.name}
                                      className="mb-3 h-16 w-16 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-200 text-xs font-medium text-slate-600">
                                      No image
                                    </div>
                                  )}

                                  <Link
                                    href={`/admin/products/${product.id}/edit`}
                                    className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
                                  >
                                    Edit
                                  </Link>

                                  <form action={toggleProductPublished}>
                                    <input type="hidden" name="id" value={product.id} />
                                    <input type="hidden" name="published" value={String(!product.published)} />
                                    <button
                                      type="submit"
                                      className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
                                    >
                                      {product.published ? "Unpublish" : "Publish"}
                                    </button>
                                  </form>

                                  <form action={toggleProductFeatured}>
                                    <input type="hidden" name="id" value={product.id} />
                                    <input type="hidden" name="featured" value={String(!product.featured)} />
                                    <button
                                      type="submit"
                                      className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                    >
                                      {product.featured ? "Unfeature" : "Feature"}
                                    </button>
                                  </form>

                                  <form action={archiveProductAction}>
                                    <input type="hidden" name="id" value={product.id} />
                                    <button
                                      type="submit"
                                      className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                                    >
                                      Archive
                                    </button>
                                  </form>

                                  <form action={deleteProductAction}>
                                    <input type="hidden" name="id" value={product.id} />
                                    <button
                                      type="submit"
                                      className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                    >
                                      Delete
                                    </button>
                                  </form>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
