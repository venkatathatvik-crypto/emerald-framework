import { apiFetch } from "./client";
import type { PartnerLeadInput } from "./types";

/** Public partner onboarding enquiry. No account is created — the submission becomes a lead an admin reviews. */
export function submitPartnerLead(input: PartnerLeadInput): Promise<void> {
  return apiFetch<void>("/api/v1/partner/leads", {
    method: "POST",
    body: input,
  });
}
