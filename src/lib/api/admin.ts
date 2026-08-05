import { apiFetch } from "./client";
import type {
  AugmontBrokerDashboard,
  AugmontEmiSchedule,
  AugmontReceipt,
  AugmontReport,
  Branch,
  ConvertLeadRequest,
  CustomerResponse,
  EmiPayment,
  EmiQuote,
  LeadStatus,
  OrderRefund,
  OrderResponse,
  Paged,
  RecordEmiPaymentRequest,
  PartnerLead,
  PartnerResponse,
  PartnerUpdateRequest,
} from "./types";

export interface ListLeadsParams {
  q?: string;
  status?: LeadStatus;
  page?: number;
  size?: number;
}

export function listLeads(params: ListLeadsParams = {}): Promise<Paged<PartnerLead>> {
  return apiFetch<Paged<PartnerLead>>("/api/v1/admin/leads", {
    query: {
      q: params.q,
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

export async function getNewLeadCount(): Promise<number> {
  const data = await apiFetch<{ count: number }>("/api/v1/admin/leads/new-count");
  return data.count;
}

export function convertLead(leadId: number, req: ConvertLeadRequest): Promise<PartnerResponse> {
  return apiFetch<PartnerResponse>(`/api/v1/admin/leads/${leadId}/convert`, {
    method: "POST",
    body: req,
  });
}

/** Permanently deletes a lead. */
export function deleteLead(id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/admin/leads/${id}`, { method: "DELETE" });
}

/** Moves a lead to a new status (e.g. mark as Contacted or Rejected after follow-up). */
export function updateLeadStatus(
  id: number,
  status: LeadStatus,
  notes?: string,
): Promise<PartnerLead> {
  return apiFetch<PartnerLead>(`/api/v1/admin/leads/${id}/status`, {
    method: "PATCH",
    body: { status, notes },
  });
}

export interface ListPartnersParams {
  q?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

export function listPartners(params: ListPartnersParams = {}): Promise<Paged<PartnerResponse>> {
  return apiFetch<Paged<PartnerResponse>>("/api/v1/admin/partners", {
    query: {
      q: params.q,
      active: params.active,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

export function getPartner(id: number): Promise<PartnerResponse> {
  return apiFetch<PartnerResponse>(`/api/v1/admin/partners/${id}`);
}

export interface ListPartnerBranchesParams {
  q?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

/** Branches belonging to a given partner — the admin-side view into someone else's branches. */
export function getPartnerBranches(
  id: number,
  params: ListPartnerBranchesParams = {},
): Promise<Paged<Branch>> {
  return apiFetch<Paged<Branch>>(`/api/v1/admin/partners/${id}/branches`, {
    query: {
      q: params.q,
      active: params.active,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

export function updatePartner(id: number, req: PartnerUpdateRequest): Promise<PartnerResponse> {
  return apiFetch<PartnerResponse>(`/api/v1/admin/partners/${id}`, {
    method: "PATCH",
    body: req,
  });
}

/** Soft-deletes a partner: deactivates the company and its linked login (reversible). */
export function deactivatePartner(id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/admin/partners/${id}`, { method: "DELETE" });
}

/** Reverses deactivatePartner. */
export function reactivatePartner(id: number): Promise<PartnerResponse> {
  return apiFetch<PartnerResponse>(`/api/v1/admin/partners/${id}/reactivate`, { method: "PATCH" });
}

export interface ListAdminCustomersParams {
  allianceCompanyId?: number;
  branchId?: number;
  q?: string;
  page?: number;
  size?: number;
}

/** All customers, optionally filtered to one partner and/or one branch. */
export function listCustomers(
  params: ListAdminCustomersParams = {},
): Promise<Paged<CustomerResponse>> {
  return apiFetch<Paged<CustomerResponse>>("/api/v1/admin/customers", {
    query: {
      allianceCompanyId: params.allianceCompanyId,
      branchId: params.branchId,
      q: params.q,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

export interface ListAdminOrdersParams {
  allianceCompanyId?: number;
  branchId?: number;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

/** Every order system-wide, optionally filtered to one partner and/or one branch. Also surfaces unattributed (direct-signup) orders. */
export function listOrders(params: ListAdminOrdersParams = {}): Promise<Paged<OrderResponse>> {
  return apiFetch<Paged<OrderResponse>>("/api/v1/admin/orders", {
    query: {
      allianceCompanyId: params.allianceCompanyId,
      branchId: params.branchId,
      from: params.from,
      to: params.to,
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
}

/** Any order system-wide, by id. */
export function getOrder(orderId: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/api/v1/admin/orders/${orderId}`);
}

/** Pulls Augmont's own live status for any order system-wide. */
export function refreshOrderStatus(orderId: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/api/v1/admin/orders/${orderId}/refresh-status`, {
    method: "POST",
  });
}

/** EMI schedule for any order system-wide. */
export function getOrderEmiSchedule(orderId: number): Promise<AugmontEmiSchedule> {
  return apiFetch<AugmontEmiSchedule>(`/api/v1/admin/orders/${orderId}/emi-schedule`);
}

/** Contract document link for any order system-wide. */
export function getOrderContractReceipt(orderId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/admin/orders/${orderId}/receipts/contract`);
}

/** Proforma invoice link for any order system-wide. */
export function getOrderProformaInvoiceReceipt(orderId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/admin/orders/${orderId}/receipts/proforma-invoice`);
}

/** EMI receipt link for one installment of any order system-wide. */
export function getOrderEmiReceipt(orderId: number, emiId: number): Promise<AugmontReceipt> {
  return apiFetch<AugmontReceipt>(`/api/v1/admin/orders/${orderId}/receipts/emi/${emiId}`);
}

// ── Augmont broker-wide data (admin only) ───────────────────────────────────
// These cover the whole broker account across every partner and branch, which
// is why they exist on the admin API only and have no partner/branch variant.

/**
 * Booked-order totals aggregated by Augmont itself. Counts every order booked
 * under our broker account — not the same set as our own orders table, since
 * orders placed outside this app still count here.
 */
export function getAugmontDashboard(): Promise<AugmontBrokerDashboard> {
  return apiFetch<AugmontBrokerDashboard>("/api/v1/admin/dashboard/augmont");
}


// ── EMI instalment collection ──────────────────────────────────────────────

/** What Augmont says the selected instalments cost. Charges nothing. */
export function quoteEmiPayment(orderId: number, body: RecordEmiPaymentRequest): Promise<EmiQuote> {
  return apiFetch<EmiQuote>(`/api/v1/admin/orders/${orderId}/emi-payments/quote`, {
    method: "POST",
    body,
  });
}

/** Records a cash collection against the order and marks it paid at Augmont. */
export function recordEmiPayment(orderId: number, body: RecordEmiPaymentRequest): Promise<EmiPayment> {
  return apiFetch<EmiPayment>(`/api/v1/admin/orders/${orderId}/emi-payments`, {
    method: "POST",
    body,
  });
}

/** Collections already recorded against the order. */
export function listEmiPayments(orderId: number): Promise<EmiPayment[]> {
  return apiFetch<EmiPayment[]>(`/api/v1/admin/orders/${orderId}/emi-payments`);
}


/** Refund standing on a cancelled order. Admin-only. */
export function getOrderRefund(orderId: number): Promise<OrderRefund> {
  return apiFetch<OrderRefund>(`/api/v1/admin/orders/${orderId}/refund`);
}

export interface AugmontReportParams {
  startDate?: string; // yyyy-MM-dd
  endDate?: string;
  statusId?: number; // orders only
}

/** Order export — returns a URL to a file Augmont generates, not the rows. */
export function getOrderReport(params: AugmontReportParams = {}): Promise<AugmontReport> {
  return apiFetch<AugmontReport>("/api/v1/admin/reports/orders", { query: { ...params } });
}

/** Customer export — returns a URL to a file Augmont generates, not the rows. */
export function getCustomerReport(params: AugmontReportParams = {}): Promise<AugmontReport> {
  return apiFetch<AugmontReport>("/api/v1/admin/reports/customers", {
    query: { startDate: params.startDate, endDate: params.endDate },
  });
}

/** Instalment export — returns a URL to a file Augmont generates, not the rows. */
export function getEmiReport(params: AugmontReportParams = {}): Promise<AugmontReport> {
  return apiFetch<AugmontReport>("/api/v1/admin/reports/emi", {
    query: { startDate: params.startDate, endDate: params.endDate },
  });
}

export interface ListAuditLogsParams {
  q?: string;
  category?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface ApiAuditLogEntry {
  id: string;
  timestamp: string;
  category:
    | "AUTH"
    | "ORDER_MUTATION"
    | "AUGMONT_SYNC"
    | "PARTNER_ONBOARDING"
    | "BRANCH_ACTIONS"
    | "AGENT_ACTIONS"
    | "CUSTOMER_ACTIONS";
  action: string;
  actor: {
    name: string;
    email: string;
    role: string;
  };
  targetEntity: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "FAILURE";
  details: string;
}

/** Paged administrative system audit logs. */
export function listAuditLogs(params: ListAuditLogsParams = {}): Promise<Paged<ApiAuditLogEntry>> {
  return apiFetch<Paged<ApiAuditLogEntry>>("/api/v1/admin/audit-logs", {
    query: {
      q: params.q,
      category: params.category === "ALL" ? undefined : params.category,
      status: params.status === "ALL" ? undefined : params.status,
      page: params.page ?? 0,
      size: params.size ?? 50,
    },
  });
}
