import { apiFetch } from "./client";
import type {
  AugmontShopCategory,
  AugmontSubCategoryFull,
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
  const res = await apiFetch<AugmontListEnvelope<AugmontShopCategory>>(
    "/api/v1/augmont/shop-categories",
  );
  return res.data ?? [];
}

export interface AugmontState {
  id: number;
  name: string;
}

export interface AugmontCity {
  id: number;
  name: string;
  stateId: number;
}

/** Augmont's /states wraps its array in {"message": [...]} — not {"data": [...]} like its other endpoints. */
interface AugmontMessageEnvelope<T> {
  message: T[];
}

/**
 * Augmont's own state/city list — required for order creation, which
 * validates cityName/stateName against Augmont's own master data and
 * rejects anything else (confirmed live: our own mas_states/mas_cities
 * values like "Bengaluru" 422'd with "incorrect city name"; Augmont's own
 * list for Karnataka only has "Bengaluru Urban"/"Bengaluru Rural" etc — no
 * plain "Bengaluru"). Use these two, not useStates()/useCities(), for any
 * form whose values get submitted to /api/v1/augmont/orders.
 */
export async function getAugmontStates(): Promise<AugmontState[]> {
  const res = await apiFetch<AugmontMessageEnvelope<AugmontState>>("/api/v1/augmont/states");
  return res.message ?? [];
}

/**
 * Unlike /states, /cities/{id} returns a bare array directly (confirmed
 * live) — not wrapped in {"message": [...]}. Cities silently never rendered
 * before this fix because the code read res.message off an array, which is
 * always undefined.
 */
export async function getAugmontCities(stateId: number): Promise<AugmontCity[]> {
  return apiFetch<AugmontCity[]>(`/api/v1/augmont/cities/${stateId}`);
}

/**
 * Augmont paginates with `from`/`to`, and it is **1-indexed**: `from=0` makes
 * every paginated endpoint return `{"message":"something went wrong"}` (their
 * generic 500), while `from=1` works. Nothing in their docs says so — it was
 * found by probing live. Omitting the pair entirely is not a way out either:
 * Augmont then silently serves only the first 10 rows, which is why the shop
 * showed 10 of 46 pendants.
 *
 * Every list call below therefore sends an explicit 1-based window, and reads
 * the real total from the response's own `count`.
 */
const PAGE_START = 1;
/** Augmont caps nothing server-side; this is just a sane ceiling per request. */
const PAGE_MAX = 200;

/**
 * Looks up one category by id on the separate, richer sub-categories
 * endpoint — confirmed live that `?id=` reliably returns an exact match.
 * The only thing this is for is `subCategoryImg`, a real image URL some
 * categories have that products themselves never do — never use this as a
 * substitute for getProductsBySubCategory (its nested `products` omit
 * pricing entirely).
 */
export async function getSubCategoryImage(subCategoryId: number): Promise<string | undefined> {
  const res = await apiFetch<AugmontListEnvelope<AugmontSubCategoryFull>>(
    "/api/v1/augmont/sub-categories",
    {
      query: { id: subCategoryId },
    },
  );
  return res.data?.[0]?.subCategoryImg;
}

export interface ListProductsParams {
  subCategoryId: number;
  search?: string;
  /** 1-based. Defaults to the whole first page — see PAGE_START above. */
  from?: number;
  to?: number;
}

export interface ProductsPage {
  items: AugmontProductListItem[];
  /** Augmont's own total for the category, independent of the window asked for. */
  total: number;
}

/**
 * A page of products, plus the category's true total so callers can tell
 * whether more exist. Prefer this over the flat helper when showing a count.
 */
export async function getProductsPage(params: ListProductsParams): Promise<ProductsPage> {
  const res = await apiFetch<AugmontListEnvelope<AugmontProductListItem>>(
    "/api/v1/augmont/products",
    {
      query: {
        subCategoryId: params.subCategoryId,
        search: params.search,
        from: params.from ?? PAGE_START,
        to: params.to ?? PAGE_MAX,
      },
    },
  );
  const items = res.data ?? [];
  return { items, total: res.count ?? items.length };
}

export async function getProductsBySubCategory(
  params: ListProductsParams,
): Promise<AugmontProductListItem[]> {
  return (await getProductsPage(params)).items;
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

function toNumber(v: number | string | null | undefined): number | null {
  if (v === undefined || v === null) return null;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function isRealImageUrl(v: string | null | undefined): v is string {
  return !!v && v.trim() !== "" && v.trim() !== "0";
}

/** The first (current) pricing tier for either a list item or a detail response. */
export function getProductPriceTier(
  product: AugmontProductListItem | AugmontProductDetail,
): AugmontProductPriceTier | null {
  return product.productPrice && product.productPrice.length > 0 ? product.productPrice[0] : null;
}

export function formatInr(value: number | string | null | undefined): string {
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

/**
 * Resolves a real, renderable thumbnail URL for either a list item or a
 * detail response. Falls back to the product's category image
 * (`AugmontSubCategoryFull.subCategoryImg`, when the caller has one handy)
 * before giving up — null means render a fallback icon instead.
 */
export function getProductThumbnail(
  product: AugmontProductListItem | AugmontProductDetail,
  categoryFallback?: string | null,
): string | null {
  if (isRealImageUrl(product.productImage)) return product.productImage;
  const fromGallery = firstRealImageUrl(product.productImages);
  if (fromGallery) return fromGallery;
  return isRealImageUrl(categoryFallback) ? categoryFallback : null;
}
