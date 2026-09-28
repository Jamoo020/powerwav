import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import {
  archiveCategory,
  createCategory,
  deleteCategory,
  listCategories,
  setCategoryPublished,
  updateCategory,
} from "@/lib/catalogue/categories";
import { CatalogueRepositoryError, CatalogueValidationError } from "@/lib/catalogue/repository";
import type { Category } from "@/lib/catalogue/types";

export const dynamic = "force-dynamic";

function getFriendlyCategoryError(error: unknown): string {
  if (error instanceof CatalogueRepositoryError) {
    return error.message;
  }

  if (error instanceof CatalogueValidationError) {
    return error.message;
  }

  return "This category action could not be completed right now.";
}

async function getAdminContext() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

async function createCategoryAction(formData: FormData) {
  "use server";

  try {
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const publishedValue = formData.get("published");
    const published = publishedValue === "on" || publishedValue === "true";

    await createCategory({
      name,
      slug,
      description: description || null,
      published,
    });
  } catch (error) {
    redirect(
      "/admin/categories?error=" +
        encodeURIComponent(getFriendlyCategoryError(error) || "Unable to create category."),
    );
  }

  redirect("/admin/categories?success=" + encodeURIComponent("Category created successfully."));
}

async function updateCategoryAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();

  try {
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    await updateCategory(id, {
      name,
      slug,
      description: description || null,
    });

    redirect("/admin/categories?success=" + encodeURIComponent("Category updated successfully."));
  } catch (error) {
    redirect(
      "/admin/categories?error=" +
        encodeURIComponent(getFriendlyCategoryError(error) || "Unable to update category."),
    );
  }
}

async function toggleCategoryPublishedAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  const published = String(formData.get("published") ?? "false") === "true";

  try {
    await setCategoryPublished(id, published);
    redirect(
      "/admin/categories?success=" +
        encodeURIComponent(published ? "Category published." : "Category unpublished."),
    );
  } catch (error) {
    redirect(
      "/admin/categories?error=" +
        encodeURIComponent(getFriendlyCategoryError(error) || "Unable to update publication status."),
    );
  }
}

async function archiveCategoryAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();

  try {
    await archiveCategory(id);
    redirect("/admin/categories?success=" + encodeURIComponent("Category archived."));
  } catch (error) {
    redirect(
      "/admin/categories?error=" +
        encodeURIComponent(getFriendlyCategoryError(error) || "Unable to archive category."),
    );
  }
}

async function deleteCategoryAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();

  try {
    const deleted = await deleteCategory(id);
    if (!deleted) {
      redirect("/admin/categories?error=" + encodeURIComponent("Category could not be deleted."));
    }

    redirect("/admin/categories?success=" + encodeURIComponent("Category deleted successfully."));
  } catch (error) {
    const friendly = getFriendlyCategoryError(error);
    const message =
      friendly === "Category cannot be deleted while products reference it."
        ? "This category is currently in use by products and cannot be deleted. Unpublish it or reassign the products first."
        : friendly || "Unable to delete category.";

    redirect("/admin/categories?error=" + encodeURIComponent(message));
  }
}

function normalizeValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminContext();

  let categories: Category[] = [];
  let loadError = "";

  try {
    categories = await listCategories();
  } catch {
    loadError = "Category data is currently unavailable. Please check the database connection and try again.";
  }

  const resolvedParams = (await searchParams) ?? {};
  const successMessage = normalizeValue(resolvedParams.success);
  const errorMessage = normalizeValue(resolvedParams.error);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  PowerWave AV
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin Categories</h1>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
                Signed in as <span className="font-medium text-white">{session.user.email}</span>
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
              <h2 className="text-xl font-semibold text-slate-900">Create category</h2>
              <form action={createCategoryAction} className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="Lighting package"
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                    Slug
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="lighting-package"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="Optional description for this category."
                  />
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <input id="published" name="published" type="checkbox" defaultChecked className="h-4 w-4 accent-sky-600" />
                  <label htmlFor="published" className="text-sm font-medium text-slate-700">
                    Published
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    Add category
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">Existing categories</h2>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                  {categories.length} total
                </span>
              </div>

              {categories.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  No categories have been created yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                category.published
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {category.published ? "Published" : "Draft"}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-slate-500">/{category.slug}</p>
                          {category.description ? (
                            <p className="mt-3 text-sm text-slate-600">{category.description}</p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <form action={toggleCategoryPublishedAction}>
                            <input type="hidden" name="id" value={category.id} />
                            <input type="hidden" name="published" value={String(!category.published)} />
                            <button
                              type="submit"
                              className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                            >
                              {category.published ? "Unpublish" : "Publish"}
                            </button>
                          </form>

                          <form action={archiveCategoryAction}>
                            <input type="hidden" name="id" value={category.id} />
                            <button
                              type="submit"
                              className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                            >
                              Archive
                            </button>
                          </form>

                          <form action={deleteCategoryAction}>
                            <input type="hidden" name="id" value={category.id} />
                            <button
                              type="submit"
                              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>

                      <form action={updateCategoryAction} className="mt-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                        <input type="hidden" name="id" value={category.id} />

                        <div className="space-y-2">
                          <label htmlFor={`category-name-${category.id}`} className="block text-sm font-medium text-slate-700">
                            Name
                          </label>
                          <input
                            id={`category-name-${category.id}`}
                            name="name"
                            type="text"
                            required
                            defaultValue={category.name}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor={`category-slug-${category.id}`} className="block text-sm font-medium text-slate-700">
                            Slug
                          </label>
                          <input
                            id={`category-slug-${category.id}`}
                            name="slug"
                            type="text"
                            required
                            defaultValue={category.slug}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label htmlFor={`category-description-${category.id}`} className="block text-sm font-medium text-slate-700">
                            Description
                          </label>
                          <textarea
                            id={`category-description-${category.id}`}
                            name="description"
                            rows={3}
                            defaultValue={category.description ?? ""}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            Save changes
                          </button>
                        </div>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
