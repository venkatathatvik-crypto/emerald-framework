import { apiFetch } from "./client";
import type {
  AgentPlaceOrderRequest, Branch, CustomerResponse, OrderResponse, Paged,
} from "./types";

/** The caller's own branch — including its referral code, for sharing with walk-in customers. */
export function getMyBranch(): Promise<Branch> {
  return apiFetch<Branch>("/api/v1/branch/me");
}

/** Places an order on a walk-in customer's behalf — finds or creates the customer, attributes to this branch. */
export function placeOrder(req: AgentPlaceOrderRequest): Promise<OrderResponse> {
  return apiFetch<OrderResponse>("/api/v1/branch/orders", {
    method: "POST",
    body: req,
  });
}

export interface ListBranchOrdersParams {
  from?: string; // yyyy-MM-dd
  to?: string;
  page?: number;
  size?: number;
}

/** Orders placed at the caller's own branch. */
export function listOrders(params: ListBranchOrdersParams = {}): Promise<Paged<OrderResponse>> {
  return apiFetch<Paged<OrderResponse>>("/api/v1/branch/orders", {
    query: {
      from: params.from,
      to: params.to,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

export interface ListBranchCustomersParams {
  q?: string;
  page?: number;
  size?: number;
}

/** Customers attributed to the caller's own branch. */
export function listCustomers(params: ListBranchCustomersParams = {}): Promise<Paged<CustomerResponse>> {
  return apiFetch<Paged<CustomerResponse>>("/api/v1/branch/customers", {
    query: {
      q: params.q,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}
