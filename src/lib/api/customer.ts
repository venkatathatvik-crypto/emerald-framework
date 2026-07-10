import { apiFetch } from "./client";
import type { BackendUser, CustomerRegisterStartInput } from "./types";

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
