import { apiFetch } from "./client";
import type { BackendUser } from "./types";

export function login(identifier: string, password: string): Promise<BackendUser> {
  return apiFetch<BackendUser>("/api/v1/auth/login", {
    method: "POST",
    body: { identifier, password },
  });
}

export function me(): Promise<BackendUser> {
  return apiFetch<BackendUser>("/api/v1/auth/me");
}

export function logout(): Promise<void> {
  return apiFetch<void>("/api/v1/auth/logout", { method: "POST" });
}

/** Always resolves regardless of whether the identifier matches an account (no enumeration). */
export function forgotPassword(identifier: string): Promise<void> {
  return apiFetch<void>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: { identifier },
  });
}

/** Validates a set-password/reset-password token (from an email link) and returns the associated email. */
export function validateResetToken(token: string): Promise<{ email: string }> {
  return apiFetch<{ email: string }>("/api/v1/auth/set-password/validate", {
    query: { token },
  });
}

/** Consumes a one-time token to set a new password (used for both first-time activation and forgot-password resets). */
export function resetPassword(token: string, password: string): Promise<void> {
  return apiFetch<void>("/api/v1/auth/set-password", {
    method: "POST",
    body: { token, password },
  });
}
