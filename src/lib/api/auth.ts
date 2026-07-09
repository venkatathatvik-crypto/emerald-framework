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

/** Sends a 6-digit OTP to the identifier's email for the given purpose (default LOGIN). */
export function sendOtp(identifier: string, purpose: "LOGIN" | "EMAIL_VERIFY" | "PASSWORD_RESET" = "LOGIN"): Promise<void> {
  return apiFetch<void>("/api/v1/auth/otp/send", {
    method: "POST",
    body: { identifier, purpose },
  });
}

/** Verifies a LOGIN-purpose OTP and, on success, establishes the session (same cookies as password login). */
export function verifyOtpLogin(identifier: string, otp: string): Promise<BackendUser> {
  return apiFetch<BackendUser>("/api/v1/auth/otp/verify-login", {
    method: "POST",
    body: { identifier, otp },
  });
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
