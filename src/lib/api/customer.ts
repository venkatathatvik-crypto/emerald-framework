import { apiFetch } from "./client";
import type {
  AugmontCancellationQuote, AugmontEmiSchedule, AugmontReceipt, BackendUser, CancelOrderRequest,
  CustomerRegisterStartInput, OrderResponse, Paged, PlaceOrderRequest,
} from "./types";

/** Step 1 — creates (or resumes) a pending account and emails an OTP. */
export function startCustomerRegistration(req: CustomerRegisterStartInput): Promise<void> {
  return apiFetch<void>("/api/v1/customer/register/start", {
    method: "POST",
    body: req,
  });
}

/** Step 2 — verifies the OTP, activates the account, and logs the customer in. */
export function verifyCustomerRegistration(email: string, otp: string): Promise<BackendUser> {
  return apiFetch<BackendUser>("/api/v1/customer/register/verify", {
    method: "POST",
    body: { email, otp },
  });
}

/** Places an order for the authenticated customer themselves. */
export function placeOrder(req: PlaceOrderRequest): Promise<OrderResponse> {
  return apiFetch<OrderResponse>("/api/v1/customer/orders", {
    method: "POST",
    body: req,
  });
}

export interface ListMyOrdersParams {
  page?: number;
  size?: number;
}

/** The authenticated customer's own order history. */
export function listMyOrders(params: ListMyOrdersParams = {}): Promise<Paged<OrderResponse>> {
  return apiFetch<Paged<OrderResponse>>("/api/v1/customer/orders", {
    query: {
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

/** One of the customer's own orders, by id. */
export function getOrder(orderId: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/api/v1/customer/orders/${orderId}`);
}

/** Pulls Augmont's own live status for one of the customer's own orders. */
export function refreshOrderStatus(orderId: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/api/v1/customer/orders/${orderId}/refresh-status`, { method: "POST" });
}

/** EMI schedule for one of the customer's own orders. */
export function getOrderEmiSchedule(orderId: number): Promise<AugmontEmiSchedule> {
  return apiFetch<AugmontEmiSchedule>(`/api/v1/customer/orders/${orderId}/emi-schedule`);
}

/** Contract document link for one of the customer's own orders. */
export function getOrderContractReceipt(orderId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/customer/orders/${orderId}/receipts/contract`);
}

/** Proforma invoice link for one of the customer's own orders. */
export function getOrderProformaInvoiceReceipt(orderId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/customer/orders/${orderId}/receipts/proforma-invoice`);
}

/** EMI receipt link for one installment of one of the customer's own orders. */
export function getOrderEmiReceipt(orderId: number, emiId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/customer/orders/${orderId}/receipts/emi/${emiId}`);
}

/** Cancellation price/eligibility quote — step 1, shown before the customer confirms. */
export function getOrderCancellationQuote(orderId: number): Promise<AugmontCancellationQuote> {
  return apiFetch<AugmontCancellationQuote>(`/api/v1/customer/orders/${orderId}/cancellation-quote`);
}

/** Confirms cancellation — step 2. Only the customer who placed the order may cancel it. */
export function cancelOrder(orderId: number, req: CancelOrderRequest): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/api/v1/customer/orders/${orderId}/cancel`, {
    method: "POST",
    body: req,
  });
}
