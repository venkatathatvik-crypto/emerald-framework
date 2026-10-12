import { apiFetch } from "./client";

/** Matches entities/dto/superadmin/AdminUserResponse.java. */
export interface AdminUser {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  mobile: string | null;
  active: boolean;
  /** False until the invite link has been used to set a password. */
  emailVerified: boolean;
  createdAt: string;
}

/** Matches entities/dto/superadmin/CreateAdminRequest.java — deliberately no password. */
export interface CreateAdminRequest {
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
}

/**
 * The superadmin endpoints use HTTP Basic rather than the session cookie: on a
 * fresh database there is no admin account to authenticate as. Credentials are
 * held in component state only and passed in on every call.
 */
function basicAuth(username: string, password: string): Record<string, string> {
  return { Authorization: `Basic ${btoa(`${username}:${password}`)}` };
}

/** Also serves as the credential check for the page's login step. */
export function listAdmins(username: string, password: string): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>("/api/v1/superadmin/admins", {
    headers: basicAuth(username, password),
  });
}

/** Creates an admin and triggers a set-password invite email. */
export function createAdmin(
  username: string,
  password: string,
  req: CreateAdminRequest,
): Promise<AdminUser> {
  return apiFetch<AdminUser>("/api/v1/superadmin/admins", {
    method: "POST",
    body: req,
    headers: basicAuth(username, password),
  });
}
