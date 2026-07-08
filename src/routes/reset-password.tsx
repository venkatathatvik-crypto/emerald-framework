import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { validateResetToken, resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

interface ResetPasswordSearch {
  token?: string;
}

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({ meta: [{ title: "Set a new password — 2+FAPL" }] }),
  component: Page,
});

type TokenStatus = "loading" | "valid" | "invalid";

interface FieldErrors {
  password?: string;
  confirm?: string;
}

function Page() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      return;
    }
    let cancelled = false;
    validateResetToken(token)
      .then((res) => { if (!cancelled) { setEmail(res.email); setTokenStatus("valid"); } })
      .catch(() => { if (!cancelled) setTokenStatus("invalid"); });
    return () => { cancelled = true; };
  }, [token]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    const errors: FieldErrors = {};
    if (password.length < 8) errors.password = "Password must be at least 8 characters";
    if (confirm !== password) errors.confirm = "Passwords do not match";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token!, password);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFieldErrors(err.fieldErrors as FieldErrors);
      } else {
        setGeneralError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (tokenStatus === "loading") {
    return (
      <AuthShell eyebrow="New password" title={<>Checking your link…</>}>
        <p className="text-muted-foreground text-sm">One moment.</p>
      </AuthShell>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <AuthShell eyebrow="New password" title={<>Link expired.</>}>
        <div className="text-center py-6">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground mb-6">
            This link is invalid or has expired. Request a new one to continue.
          </p>
          <Link to="/forgot-password" className="btn-primary">Request a new link</Link>
        </div>
      </AuthShell>
    );
  }

  if (success) {
    return (
      <AuthShell eyebrow="New password" title={<>Password updated.</>}>
        <div className="text-center py-6">
          <CheckCircle2 className="h-12 w-12 text-emerald-deep mx-auto mb-4" />
          <p className="text-muted-foreground mb-6">Your password has been changed. You can now sign in.</p>
          <button onClick={() => navigate({ to: "/login" })} className="btn-primary">Continue to sign in</button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="New password"
      title={<>Set a new <em className="text-emerald-deep">password.</em></>}
      subtitle={email ? `Setting a new password for ${email}.` : "Use at least 8 characters."}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthField label="New password" type="password" name="password" required error={fieldErrors.password} />
        <AuthField label="Confirm new password" type="password" name="confirm" required error={fieldErrors.confirm} />
        {generalError && (
          <p className="text-sm text-destructive" role="alert">{generalError}</p>
        )}
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
          {isSubmitting ? "Updating…" : <>Update password <ArrowUpRight className="h-4 w-4" /></>}
        </button>
      </form>
      <p className="mt-8 text-sm text-muted-foreground">
        <Link to="/login" className="link-underline">← Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
