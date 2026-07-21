import { apiFetch } from "./client";
import type {
  Agent, AgentCreateRequest, AugmontEmiSchedule, AugmontReceipt, Branch, BranchCreateRequest, BranchUpdateRequest,
  CustomerResponse, OrderResponse, Paged, PartnerResponse,
} from "./types";

/** The caller's own company — including its referral code, for sharing with prospective customers. */
export function getMyCompany(): Promise<PartnerResponse> {
  return apiFetch<PartnerResponse>("/api/v1/partner/me");
}

export interface ListBranchesParams {
  q?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

export function listBranches(params: ListBranchesParams = {}): Promise<Paged<Branch>> {
  return apiFetch<Paged<Branch>>("/api/v1/partner/branches", {
    query: {
      q: params.q,
      active: params.active,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

export function getBranch(branchId: number): Promise<Branch> {
  return apiFetch<Branch>(`/api/v1/partner/branches/${branchId}`);
}

export function createBranch(req: BranchCreateRequest): Promise<Branch> {
  return apiFetch<Branch>("/api/v1/partner/branches", {
    method: "POST",
    body: req,
  });
}

/** Updates a branch's details — its manager login is not editable here. */
export function updateBranch(branchId: number, req: BranchUpdateRequest): Promise<Branch> {
  return apiFetch<Branch>(`/api/v1/partner/branches/${branchId}`, {
    method: "PATCH",
    body: req,
  });
}

/** Soft-deactivates a branch. Its agents keep their own status (no cascade). */
export function deactivateBranch(branchId: number): Promise<void> {
  return apiFetch<void>(`/api/v1/partner/branches/${branchId}`, { method: "DELETE" });
}

/** Reverses deactivateBranch. */
export function reactivateBranch(branchId: number): Promise<Branch> {
  return apiFetch<Branch>(`/api/v1/partner/branches/${branchId}/reactivate`, { method: "PATCH" });
}

export function listAgents(branchId: number): Promise<Agent[]> {
  return apiFetch<Agent[]>(`/api/v1/partner/branches/${branchId}/agents`);
}

export function createAgent(branchId: number, req: AgentCreateRequest): Promise<Agent> {
  return apiFetch<Agent>(`/api/v1/partner/branches/${branchId}/agents`, {
    method: "POST",
    body: req,
  });
}

/** Soft-deactivates an agent's login. */
export function deactivateAgent(branchId: number, agentId: number): Promise<void> {
  return apiFetch<void>(`/api/v1/partner/branches/${branchId}/agents/${agentId}`, {
    method: "DELETE",
  });
}

/** Reverses deactivateAgent. */
export function reactivateAgent(branchId: number, agentId: number): Promise<Agent> {
  return apiFetch<Agent>(`/api/v1/partner/branches/${branchId}/agents/${agentId}/reactivate`, {
    method: "PATCH",
  });
}

export interface ListPartnerOrdersParams {
  branchId?: number;
  from?: string; // yyyy-MM-dd
  to?: string;
  page?: number;
  size?: number;
}

/** Orders across every branch of the caller's company, optionally narrowed to one branch. */
export function listOrders(params: ListPartnerOrdersParams = {}): Promise<Paged<OrderResponse>> {
  return apiFetch<Paged<OrderResponse>>("/api/v1/partner/orders", {
    query: {
      branchId: params.branchId,
      from: params.from,
      to: params.to,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

/** An order placed anywhere in the caller's company, by id. */
export function getOrder(orderId: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/api/v1/partner/orders/${orderId}`);
}

/** Pulls Augmont's own live status for an order placed anywhere in the caller's company. */
export function refreshOrderStatus(orderId: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/api/v1/partner/orders/${orderId}/refresh-status`, { method: "POST" });
}

/** EMI schedule for an order placed anywhere in the caller's company. */
export function getOrderEmiSchedule(orderId: number): Promise<AugmontEmiSchedule> {
  return apiFetch<AugmontEmiSchedule>(`/api/v1/partner/orders/${orderId}/emi-schedule`);
}

/** Contract document link for an order placed anywhere in the caller's company. */
export function getOrderContractReceipt(orderId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/partner/orders/${orderId}/receipts/contract`);
}

/** Proforma invoice link for an order placed anywhere in the caller's company. */
export function getOrderProformaInvoiceReceipt(orderId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/partner/orders/${orderId}/receipts/proforma-invoice`);
}

/** EMI receipt link for one installment of an order placed anywhere in the caller's company. */
export function getOrderEmiReceipt(orderId: number, emiId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/partner/orders/${orderId}/receipts/emi/${emiId}`);
}

export interface ListPartnerCustomersParams {
  branchId?: number;
  q?: string;
  page?: number;
  size?: number;
}

/** Customers attributed to the caller's company, across all its branches. */
export function listCustomers(params: ListPartnerCustomersParams = {}): Promise<Paged<CustomerResponse>> {
  return apiFetch<Paged<CustomerResponse>>("/api/v1/partner/customers", {
    query: {
      branchId: params.branchId,
      q: params.q,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}
