import { apiFetch } from "./client";
import type {
  AugmontShopCategory,
  AugmontProductListItem,
  AugmontProductDetail,
  AugmontProductPriceTier,
  AugmontProductImage,
} from "./types";

/** Augmont wraps its own list responses in {data, count?, message?} — separate from our own ApiResponse envelope. */
interface AugmontListEnvelope<T> {
  data: T[];
  count?: number;
  message?: string;
}

export async function getShopCategories(): Promise<AugmontShopCategory[]> {
  const res = await apiFetch<AugmontListEnvelope<AugmontShopCategory>>("/api/v1/augmont/shop-categories");
  return res.data ?? [];
}

export interface ListProductsParams {
  subCategoryId: number;
  search?: string;
}

export async function getProductsBySubCategory(params: ListProductsParams): Promise<AugmontProductListItem[]> {
  const res = await apiFetch<AugmontListEnvelope<AugmontProductListItem>>("/api/v1/augmont/products", {
    query: { subCategoryId: params.subCategoryId, search: params.search },
  });
  return res.data ?? [];
}

export function getProductDetails(id: number): Promise<AugmontProductDetail> {
  return apiFetch<AugmontProductDetail>(`/api/v1/augmont/products/${id}`);
}

// ── Defensive price/image helpers ───────────────────────────────────────────
// Confirmed against a live response: productPrice/productImages are flat,
// top-level arrays on BOTH the list and detail endpoints (Augmont's own
// OpenAPI spec incorrectly nests them for the list endpoint — trust this
// instead). productImage is frequently the literal string "0" (Augmont's
// "no image set" placeholder), which is truthy in JS, so it must be
// explicitly excluded rather than relying on a plain truthiness check.

function toNumber(v: number | string | undefined): number | null {
  if (v === undefined || v === null) return null;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function isRealImageUrl(v: string | null | undefined): v is string {
  return !!v && v.trim() !== "" && v.trim() !== "0";
}

/** The first (current) pricing tier for either a list item or a detail response. */
export function getProductPriceTier(product: AugmontProductListItem | AugmontProductDetail): AugmontProductPriceTier | null {
  return product.productPrice && product.productPrice.length > 0 ? product.productPrice[0] : null;
}

export function formatInr(value: number | string | undefined): string {
  const n = toNumber(value);
  if (n === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function firstRealImageUrl(images: AugmontProductImage[] | undefined): string | null {
  const img = images?.find((i) => isRealImageUrl(i.url) || isRealImageUrl(i.URL));
  if (!img) return null;
  return isRealImageUrl(img.url) ? img.url : (img.URL as string);
}

/** Resolves a real, renderable thumbnail URL for either a list item or a detail response — null if Augmont has no image on file (common; render a fallback icon). */
export function getProductThumbnail(product: AugmontProductListItem | AugmontProductDetail): string | null {
  if (isRealImageUrl(product.productImage)) return product.productImage;
  return firstRealImageUrl(product.productImages);
}
