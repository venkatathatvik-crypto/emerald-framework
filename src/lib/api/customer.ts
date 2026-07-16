import { apiFetch } from "./client";
import type { BackendUser, CustomerRegisterStartInput, OrderResponse, Paged, PlaceOrderRequest } from "./types";

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
