import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentSession } from "@/lib/auth";

export const PRODUCT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const PRODUCT_IMAGE_PUBLIC_DIR = "/uploads/products";
const PRODUCT_IMAGE_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "products");
const allowedMimeTypes = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "product";
}

function getResolvedUploadPath(imageUrl: string): string | null {
  if (!imageUrl || !imageUrl.startsWith(PRODUCT_IMAGE_PUBLIC_DIR)) {
    return null;
  }

  const relativePath = imageUrl.replace(/^\/+/, "");
  const fileName = path.basename(relativePath);

  if (!fileName || fileName.includes("..")) {
    return null;
  }

  const resolved = path.resolve(PRODUCT_IMAGE_UPLOAD_ROOT, fileName);
  if (!resolved.startsWith(PRODUCT_IMAGE_UPLOAD_ROOT)) {
    return null;
  }

  return resolved;
}

export async function ensureAdminCanManageProductImages(): Promise<void> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("Authentication required.");
  }
}

export async function clearStoredProductImage(imageUrl: string | null | undefined): Promise<void> {
  if (!imageUrl) {
    return;
  }

  const resolvedPath = getResolvedUploadPath(imageUrl);
  if (!resolvedPath) {
    return;
  }

  try {
    await rm(resolvedPath, { force: true });
  } catch {
    // Ignore cleanup failures so a failed image removal does not block other product operations.
  }
}

export async function saveUploadedProductImage(
  image: File | null | undefined,
  productSlug: string,
  existingImageUrl?: string | null,
): Promise<string | null> {
  if (!image || !(image instanceof File) || image.size === 0) {
    return existingImageUrl ?? null;
  }

  await ensureAdminCanManageProductImages();

  const mimeType = image.type || "";
  const extension = allowedMimeTypes.get(mimeType);
  if (!extension) {
    throw new Error("Only JPG, PNG, and WEBP image files are allowed.");
  }

  if (image.size > PRODUCT_IMAGE_MAX_BYTES) {
    throw new Error("Image file is too large. Please upload an image under 2 MB.");
  }

  const safeName = `${slugify(productSlug)}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const targetDir = PRODUCT_IMAGE_UPLOAD_ROOT;
  const targetPath = path.join(targetDir, safeName);

  await mkdir(targetDir, { recursive: true });

  const fileBuffer = Buffer.from(await image.arrayBuffer());
  if (fileBuffer.length === 0) {
    throw new Error("The uploaded image is empty.");
  }

  await writeFile(targetPath, fileBuffer);

  if (existingImageUrl && existingImageUrl !== `${PRODUCT_IMAGE_PUBLIC_DIR}/${safeName}`) {
    await clearStoredProductImage(existingImageUrl);
  }

  return `${PRODUCT_IMAGE_PUBLIC_DIR}/${safeName}`;
}
