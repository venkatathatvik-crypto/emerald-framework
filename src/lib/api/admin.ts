import { apiFetch } from "./client";
import type {
  Branch, ConvertLeadRequest, CustomerResponse, LeadStatus, Paged, PartnerLead,
  PartnerResponse, PartnerUpdateRequest,
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
export function updateLeadStatus(id: number, status: LeadStatus, notes?: string): Promise<PartnerLead> {
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
export function getPartnerBranches(id: number, params: ListPartnerBranchesParams = {}): Promise<Paged<Branch>> {
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
export function listCustomers(params: ListAdminCustomersParams = {}): Promise<Paged<CustomerResponse>> {
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
