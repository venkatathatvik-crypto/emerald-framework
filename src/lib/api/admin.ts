import { apiFetch } from "./client";
import type { ConvertLeadRequest, LeadStatus, Paged, PartnerLead, PartnerResponse } from "./types";

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

/** Soft-deletes a partner: deactivates the company and its linked login (reversible). */
export function deactivatePartner(id: number): Promise<void> {
  return apiFetch<void>(`/api/v1/admin/partners/${id}`, { method: "DELETE" });
}
