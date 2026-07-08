import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api/types";
import { ArrowUpRight } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — 2+ Fortune Alliances" }, { name: "description", content: "Sign in to your 2+ Fortune Alliances account. Gold EMI powered by Augmont." }] }),
  component: Page,
});

type FieldErrors = Partial<Record<"identifier" | "password", string>>;

function validateLogin(identifier: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!identifier.trim()) errors.identifier = "Email or phone is required";
  if (!password) errors.password = "Password is required";
  return errors;
}

function Page() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<"customer" | "partner" | "branch" | "admin">("customer");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    if (role !== "admin") {
      nav({ to: `/dashboard/${role}` });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const identifier = String(formData.get("identifier") ?? "");
    const password = String(formData.get("password") ?? "");

    const errors = validateLogin(identifier, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(identifier, password);
      if (user.role !== "ROLE_ADMIN") {
        setGeneralError("This account does not have admin access.");
        return;
      }
      nav({ to: "/dashboard/admin" });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFieldErrors(err.fieldErrors as FieldErrors);
      } else {
        setGeneralError(err instanceof ApiError ? err.message : "Sign in failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell eyebrow="Sign in" title={<>Welcome back.</>} subtitle="Choose your portal and continue.">
      {role === "customer" && (
        <div className="flex items-center gap-3 mb-6 p-3 bg-gold-soft/20 rounded-xl border border-gold/30">
          <img 
            src={`${import.meta.env.BASE_URL}images/augmont_logo.png`} 
            alt="Augmont Gold For All" 
            className="h-10 object-contain bg-white rounded-lg p-1.5 border border-gold/20" 
          />
          <div>
            <p className="text-sm font-medium text-ink">Gold EMI Powered by</p>
            <p className="text-xs text-muted-foreground">Augmont Gold For All</p>
          </div>
        </div>
      )}
      <div className="flex gap-2 mb-8 p-1 bg-stone rounded-full w-fit">
        {(["customer", "partner", "branch", "admin"] as const).map((r) => (
          <button key={r} onClick={() => setRole(r)} className={`px-4 py-1.5 rounded-full text-xs capitalize transition-colors ${role === r ? "bg-emerald-deep text-paper" : "text-muted-foreground"}`}>
            {r}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthField label="Email or phone" name="identifier" required error={fieldErrors.identifier} />
        <AuthField label="Password" type="password" name="password" required error={fieldErrors.password} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-emerald-deep" /> Remember me
          </label>
          <Link to="/forgot-password" className="link-underline text-sm">Forgot password?</Link>
        </div>
        {generalError && (
          <p className="text-sm text-destructive" role="alert">{generalError}</p>
        )}
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
          {isSubmitting ? "Signing in…" : <>Sign in as {role} <ArrowUpRight className="h-4 w-4" /></>}
        </button>
      </form>
      <p className="mt-10 text-sm text-muted-foreground">
        New here? Register as a{" "}
        <Link to="/register/customer" className="link-underline">customer</Link> or{" "}
        <Link to="/register/partner" className="link-underline">partner</Link>.
      </p>
    </AuthShell>
  );
}
