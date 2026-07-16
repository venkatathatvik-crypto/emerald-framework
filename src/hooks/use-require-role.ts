import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

/**
 * Guards a page to one or more required backend roles (e.g. "ROLE_ADMIN", or
 * ["ROLE_BRANCH", "ROLE_AGENT"] for a dashboard shared across roles).
 * Redirects to /login if there's no session or the role doesn't match.
 *
 * `ready` is true only once it's safe to render protected content or enable
 * queries — every guarded page must `if (!ready) return null;` before
 * rendering anything, otherwise the page flashes real content (or fires
 * authenticated requests) for a logged-out visitor during the brief window
 * before the redirect effect runs.
 */
export function useRequireRole(role: string | string[]) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const allowed = Array.isArray(role) ? role : [role];
  const ready = !isLoading && !!user && allowed.includes(user.role);

  useEffect(() => {
    if (!isLoading && !ready) {
      navigate({ to: "/login" });
    }
  }, [isLoading, ready, navigate]);

  return { user, isLoading, ready };
}

/** Guards a page to any authenticated user, regardless of role — e.g. a shared /profile page. */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const ready = !isLoading && !!user;

  useEffect(() => {
    if (!isLoading && !ready) {
      navigate({ to: "/login" });
    }
  }, [isLoading, ready, navigate]);

  return { user, isLoading, ready };
}
