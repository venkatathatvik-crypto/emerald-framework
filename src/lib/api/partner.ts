import { apiFetch } from "./client";
import type { Agent, AgentCreateRequest, Branch, BranchCreateRequest, Paged } from "./types";

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

/** Soft-deactivates a branch. Its agents keep their own status (no cascade). */
export function deactivateBranch(branchId: number): Promise<void> {
  return apiFetch<void>(`/api/v1/partner/branches/${branchId}`, { method: "DELETE" });
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
