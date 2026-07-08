/** Envelope every gold-emi-api endpoint responds with. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}

/** Thrown by the fetch wrapper on a non-2xx or {success:false} response. */
export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Matches entities/dto/common/PagedResponse.java. */
export interface Paged<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  last: boolean;
}

/** Matches entities/dto/auth/UserResponse.java (fields this app actually consumes). */
export interface BackendUser {
  uuid: string;
  email: string | null;
  mobile: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string; // e.g. "ROLE_ADMIN"
}

export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "REJECTED";

/** Matches entities/dto/admin/LeadResponse.java. */
export interface PartnerLead {
  id: number;
  uuid: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gst: string | null;
  city: string | null;
  state: string | null;
  status: LeadStatus;
  notes: string | null;
  convertedPartnerId: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Request body for POST /api/v1/partner/leads (public, no account created). */
export interface PartnerLeadInput {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gst?: string;
  city?: string;
  state?: string;
}

/** Matches entities/enums/AllianceType.java. */
export type AllianceType = "NBFC" | "MFI" | "COOPERATIVE" | "BROKER" | "CORPORATE" | "OTHER";

/** Request body for POST /api/v1/admin/leads/{id}/convert. */
export interface ConvertLeadRequest {
  name: string;
  registrationNumber?: string;
  type: AllianceType;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  commissionRate?: number;
  contactPersonName: string;
  loginEmail: string;
  loginMobile: string;
}

/** Matches entities/dto/admin/PartnerResponse.java. */
export interface PartnerResponse {
  id: number;
  uuid: string;
  name: string;
  registrationNumber: string | null;
  type: AllianceType;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  commissionRate: number | null;
  /** JSON key is "active", not "isActive" — Jackson strips the getter's "is" prefix. */
  active: boolean;
  onboardedById: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── Augmont catalog (proxied third-party data — shapes are loosely typed and
// somewhat inconsistent between Augmont's list vs. detail endpoints; numeric
// price fields may arrive as either number or string, so read them via the
// getProductPrice()/getListItemPrice() helpers in api/augmont.ts rather than
// assuming a fixed type here). ────────────────────────────────────────────────

/** GET /api/v1/augmont/shop-categories — lightweight category list used for filtering. */
export interface AugmontShopCategory {
  id: number;
  subCategoryName: string;
  count: number;
}

export interface AugmontProductImage {
  id?: number;
  url?: string;
  URL?: string;
}

/** A single EMI/pricing tier as returned nested under a product-list item. */
export interface AugmontProductPriceTier {
  finalProductPrice?: number | string;
  initialPayment?: number | string;
  productMetalPrice?: number | string;
  basePrice?: number | string;
  paymentAmountPerMonthThree?: number | string;
  paymentAmountPerMonthSix?: number | string;
  paymentAmountPerMonthNine?: number | string;
  initialPaymentThree?: number | string;
  initialPaymentSix?: number | string;
  initialPaymentNine?: number | string;
  productImages?: AugmontProductImage[];
}

/** GET /api/v1/augmont/products?subCategoryId= — one row of the product grid. */
export interface AugmontProductListItem {
  id: number;
  subCategoryId: number;
  sku: string;
  productName: string;
  weight: number;
  productImage: string | null;
  isEmiAvailable: boolean;
  subCategory?: {
    id: number;
    subCategoryName: string;
    category?: {
      id: number;
      subCategoryName: string;
      metalType?: {
        metalType: string;
        metalFitness: number;
        productPrice?: AugmontProductPriceTier[];
      };
    };
  };
}

export interface AugmontPaymentTypeOption {
  paymentTypeId: number;
  paymentType: string;
}

/** GET /api/v1/augmont/products/{id} — full product detail. */
export interface AugmontProductDetail {
  id: number;
  subCategoryId: number;
  sku: string;
  productName: string;
  weight: number;
  productImage: string | null;
  isEmiAvailable: boolean;
  subCategory?: {
    id: number;
    subCategoryName: string;
    category?: {
      id: number;
      subCategoryName: string;
      metalType?: {
        metalType: string;
        metalFitness: number;
      };
    };
  };
  productPrice?: AugmontProductPriceTier[];
  productImages?: AugmontProductImage[];
  paymentData?: AugmontPaymentTypeOption[];
}
