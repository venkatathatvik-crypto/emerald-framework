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

/** Request body for PATCH /api/v1/admin/partners/{id}. */
export interface PartnerUpdateRequest {
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
  referralCode: string | null;
  /** JSON key is "active", not "isActive" — Jackson strips the getter's "is" prefix. */
  active: boolean;
  onboardedById: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Matches entities/dto/common/MasStateResponse.java. */
export interface MasState {
  id: number;
  name: string;
}

/** Matches entities/dto/common/MasCityResponse.java. */
export interface MasCity {
  id: number;
  stateId: number;
  name: string;
}

/** Matches entities/dto/partner/BranchResponse.java. */
export interface Branch {
  id: number;
  uuid: string;
  allianceCompanyId: number;
  name: string;
  code: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  managerId: number | null;
  commissionRate: number | null;
  referralCode: string | null;
  /** JSON key is "active", not "isActive" — Jackson strips the getter's "is" prefix. */
  active: boolean;
  augmontStoreId: number | null;
  augmontStoreUniqueId: string | null;
  syncedToAugmont: boolean;
  createdAt: string;
  updatedAt: string;
  /** Only populated by getPartnerBranches (admin partner-detail view) — undefined everywhere else. */
  agentCount?: number;
}

/** Request body for POST /api/v1/partner/branches. */
export interface BranchCreateRequest {
  name: string;
  code?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  commissionRate?: number;
  managerName: string;
  managerLoginEmail: string;
  managerLoginMobile: string;
}

/** Request body for PATCH /api/v1/partner/branches/{branchId} — manager login is not editable here. */
export interface BranchUpdateRequest {
  name: string;
  code?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  commissionRate?: number;
}

/** Matches entities/dto/partner/AgentResponse.java. */
export interface Agent {
  id: number;
  uuid: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobile: string | null;
  branchId: number;
  /** JSON key is "active", not "isActive" — Jackson strips the getter's "is" prefix. */
  active: boolean;
  createdAt: string;
}

/** Request body for POST /api/v1/partner/branches/{branchId}/agents. */
export interface AgentCreateRequest {
  name: string;
  loginEmail: string;
  loginMobile: string;
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

/**
 * GET /api/v1/augmont/sub-categories?id= — a richer, separate endpoint from
 * shop-categories, looked up one category at a time via getSubCategoryImage
 * (the bulk/no-params call is paginated with an unreliable scheme — only
 * ~10 of 47 categories ever came back, no working page/size param found;
 * `?id=` is a reliable direct filter instead). Its nested `products` are a
 * lightweight summary (no `productPrice`, so not a substitute for
 * GET /products?subCategoryId=) — this endpoint's only real value here is
 * `subCategoryImg`, a real S3 URL some categories have (confirmed live)
 * that products themselves never do.
 */
export interface AugmontSubCategoryFull {
  id: number;
  subCategoryName: string;
  categoryId: number;
  isActive: boolean;
  subCategoryImage: string | null;
  /** Real, renderable S3 URL — present only on some categories. */
  subCategoryImg?: string;
  products: AugmontProductListItem[];
}

export interface AugmontProductImage {
  id?: number;
  url?: string;
  URL?: string;
}

/**
 * A single pricing tier — a flat, top-level `productPrice[0]` on both the
 * list and detail endpoints (confirmed against a live response; Augmont's
 * own OpenAPI spec incorrectly describes this as nested under
 * subCategory.category.metalType on the list endpoint — it is not).
 */
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
  /** Percentage down payment required, e.g. 20 (confirmed against a live response). */
  productInitialPaymentPer?: number | string;
  /** GST percentage applied on top, e.g. 3 (confirmed against a live response). */
  gst?: number | string;
}

interface AugmontSubCategoryRef {
  id: number;
  subCategoryName: string;
  category?: {
    id: number;
    categoryName: string;
    metalType?: {
      metalType: string;
      metalFitness: number;
    };
  };
}

/**
 * Shared fields between the list and detail endpoints. `productImage` is
 * often the literal string "0" (Augmont's placeholder for "no image set")
 * rather than a real URL or being absent — always read images via
 * getListItemThumbnail()/getDetailThumbnail() in api/augmont.ts, which guard
 * against this, rather than checking `item.productImage` truthiness directly.
 */
interface AugmontProductBase {
  id: number;
  subCategoryId: number;
  sku: string;
  productName: string;
  weight: number;
  productImage: string | null;
  isEmiAvailable: boolean;
  productPrice?: AugmontProductPriceTier[];
  productImages?: AugmontProductImage[];
  subCategory?: AugmontSubCategoryRef;
}

/** GET /api/v1/augmont/products?subCategoryId= — one row of the product grid. */
export type AugmontProductListItem = AugmontProductBase;

export interface AugmontPaymentTypeOption {
  paymentTypeId: number;
  paymentType: string;
}

/** GET /api/v1/augmont/products/{id} — full product detail. */
export interface AugmontProductDetail extends AugmontProductBase {
  paymentData?: AugmontPaymentTypeOption[];
}

// ── Customer registration (public, two-step: email -> OTP) ─────────────────

/** Request body for POST /api/v1/customer/register/start. */
export interface CustomerRegisterStartInput {
  email: string;
  firstName: string;
  lastName?: string;
  mobile?: string;
  referralCode?: string;
}

// ── Orders ───────────────────────────────────────────────────────────────

/** Matches entities/enums/OrderStatus.java. */
export type OrderStatus = "PENDING" | "CONFIRMED" | "AUGMONT_FAILED" | "CANCELLED";

/**
 * Shared order fields for both self-service and agent-assisted placement.
 * Price/product snapshot fields are trusted from the client — see
 * PlaceOrderRequest.java's own doc comment for why that's an acceptable
 * tradeoff right now (no payment gateway wired through us yet).
 */
interface OrderFields {
  augmontProductId: number;
  productName: string;
  productSku?: string;
  productWeight?: number;
  paymentTypeId: number;
  quantity: number;
  finalOrderPrice: number;
  initialPayment: number;
  monthlyAmount?: number;
  panCardNumber: string;
  dateOfBirth: string; // yyyy-MM-dd
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
}

/** Request body for POST /api/v1/customer/orders — customer places an order for themselves. */
export type PlaceOrderRequest = OrderFields;

/** Request body for POST /api/v1/branch/orders — agent places an order on a walk-in customer's behalf. */
export interface AgentPlaceOrderRequest extends OrderFields {
  customerFirstName: string;
  customerLastName?: string;
  customerEmail: string;
  customerMobile: string;
}

/** Matches entities/dto/order/OrderResponse.java. Display-name fields are only populated by list/detail endpoints. */
export interface OrderResponse {
  id: number;
  uuid: string;
  customerId: number;
  customerName: string | null;
  customerEmail: string | null;
  customerMobile: string | null;
  createdByUserId: number;
  createdByName: string | null;
  branchId: number | null;
  branchName: string | null;
  allianceCompanyId: number | null;
  allianceCompanyName: string | null;
  augmontProductId: number;
  productName: string;
  productSku: string | null;
  productWeight: number | null;
  paymentTypeId: number;
  quantity: number;
  finalOrderPrice: number | null;
  initialPayment: number | null;
  monthlyAmount: number | null;
  customerPan: string;
  customerDob: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  merchantTransactionId: string;
  augmontOrderId: number | null;
  augmontOrderUniqueId: number | null;
  status: OrderStatus;
  failureReason: string | null;
  /** Augmont's own live status label — only populated after an explicit status refresh, not kept in sync automatically. */
  augmontStatusName: string | null;
  augmontStatusSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Order detail: status refresh, EMI schedule, receipts, cancellation ─────

/** Matches entities/dto/augmont/AugmontEmiScheduleResponse.java — GET .../orders/{id}/emi-schedule. */
export interface AugmontEmiSchedule {
  orderUniqueId: number | null;
  numberOfPendingEmi: number | null;
  orderdetails: { finalOrderPrice: number; initialPayment: number; emiAmount: number }[];
  orderemidetails: {
    emiId: number;
    emiAmount: number;
    emiBalancePayment: number;
    dueDate: string;
    paymentRecievedDate: string | null;
    emiPaidAmount: number;
    paymentDescription: string;
    orderemistatus: { statusName: string } | null;
  }[];
  product: { productName: string; sku: string } | null;
}

/** Matches entities/dto/augmont/AugmontReceiptResponse.java — GET .../orders/{id}/receipts/*. */
export interface AugmontReceipt {
  message: string;
  url: string;
}

/** Matches entities/dto/augmont/AugmontCancellationQuoteResponse.java — GET .../orders/{id}/cancellation-quote. */
export interface AugmontCancellationQuote {
  cancellationCharges: string | null;
  totalCancelationCharges: string | null;
  payableToCustomer: string | null;
  totalAmountPaid: string | null;
  cancelationPriceOfOrder: number | null;
  diffrenceAmount: string | null;
  cancelationFees: number | null;
  emiPaid: string | null;
  totalPrice: number | null;
  emiAmount: number | null;
  tenure: string | null;
  currentStatus: string | null;
  nextStatus: { statusId: number; statusName: string } | null;
}

/** Request body for POST /api/v1/customer/orders/{id}/cancel. */
export interface CancelOrderRequest {
  reason: string;
  customerBankName: string;
  customerAccountNo: string;
  ifscCode: string;
}

// ── Customers ────────────────────────────────────────────────────────────

/** Matches entities/dto/customer/CustomerResponse.java. */
export interface CustomerResponse {
  id: number;
  uuid: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobile: string | null;
  allianceCompanyId: number | null;
  branchId: number | null;
  active: boolean;
  createdAt: string;
}
