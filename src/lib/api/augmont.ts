import { apiFetch } from "./client";
import type {
  AugmontShopCategory,
  AugmontProductListItem,
  AugmontProductDetail,
  AugmontProductPriceTier,
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
// Augmont's numeric price fields arrive as numbers on the list endpoint but as
// strings on the detail endpoint — always coerce before formatting. Pricing
// also lives in different nesting depths on each endpoint (see types.ts).

function toNumber(v: number | string | undefined): number | null {
  if (v === undefined || v === null) return null;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

/** The first (current) pricing tier from a product-LIST item's nested location. */
export function getListItemPriceTier(item: AugmontProductListItem): AugmontProductPriceTier | null {
  const tiers = item.subCategory?.category?.metalType?.productPrice;
  return tiers && tiers.length > 0 ? tiers[0] : null;
}

/** The first (current) pricing tier from a product-DETAIL response's flat location. */
export function getDetailPriceTier(detail: AugmontProductDetail): AugmontProductPriceTier | null {
  return detail.productPrice && detail.productPrice.length > 0 ? detail.productPrice[0] : null;
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

export function getListItemThumbnail(item: AugmontProductListItem): string | null {
  if (item.productImage) return item.productImage;
  const img = getListItemPriceTier(item)?.productImages?.[0];
  return img?.url ?? img?.URL ?? null;
}

export function getDetailThumbnail(detail: AugmontProductDetail): string | null {
  if (detail.productImage) return detail.productImage;
  const img = detail.productImages?.[0] ?? getDetailPriceTier(detail)?.productImages?.[0];
  return img?.url ?? img?.URL ?? null;
}
