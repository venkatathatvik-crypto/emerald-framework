import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import { ArrowUpRight } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset your password — 2+FAPL" }] }),
  component: Page,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Page() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setFieldError(undefined);

    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!email) {
      setFieldError("Email is required");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setFieldError("Enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setGeneralError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Password reset"
      title={sent ? <>Check your inbox.</> : <>Forgot your password?</>}
      subtitle={sent ? "We've sent a reset link if an account exists for that address." : "Enter the email on your account and we'll send a reset link."}
    >
      {!sent ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <AuthField label="Email" type="email" name="email" required error={fieldError} />
          {generalError && (
            <p className="text-sm text-destructive" role="alert">{generalError}</p>
          )}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
            {isSubmitting ? "Sending…" : <>Send reset link <ArrowUpRight className="h-4 w-4" /></>}
          </button>
        </form>
      ) : (
        <Link to="/login" className="btn-ghost">← Back to sign in</Link>
      )}
      <p className="mt-8 text-sm text-muted-foreground">
        Remembered it? <Link to="/login" className="link-underline">Sign in</Link>.
      </p>
    </AuthShell>
  );
}
