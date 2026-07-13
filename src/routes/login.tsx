import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { InputOTP, InputOTPGroup, InputOTPSlot, REGEXP_ONLY_DIGITS } from "@/components/ui/input-otp";
import { useAuth } from "@/lib/auth-context";
import { sendOtp, verifyOtpLogin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import type { BackendUser } from "@/lib/api/types";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — 2+ Fortune Alliances" }, { name: "description", content: "Sign in to your 2+ Fortune Alliances account. Gold EMI powered by Augmont." }] }),
  component: Page,
});

type Role = "customer" | "partner" | "branch" | "admin";
type FieldErrors = Partial<Record<"identifier" | "password", string>>;

// The "branch" tab covers both the branch manager (ROLE_BRANCH) and agents
// created under that branch (ROLE_AGENT) — agents share the branch dashboard
// rather than getting a separate portal.
const ROLE_BY_TAB: Record<Role, string[]> = {
  customer: ["ROLE_CUSTOMER"],
  partner: ["ROLE_ALLIANCE"],
  branch: ["ROLE_BRANCH", "ROLE_AGENT"],
  admin: ["ROLE_ADMIN"],
};

const DASHBOARD_BY_ROLE: Record<string, string> = {
  ROLE_CUSTOMER: "/dashboard/customer",
  ROLE_ALLIANCE: "/dashboard/partner",
  ROLE_BRANCH: "/dashboard/branch",
  ROLE_AGENT: "/dashboard/branch",
  ROLE_ADMIN: "/dashboard/admin",
};

function validateLogin(identifier: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!identifier.trim()) errors.identifier = "Email or phone is required";
  if (!password) errors.password = "Password is required";
  return errors;
}

function Page() {
  const nav = useNavigate();
  const { login, setUser, user, isLoading: authLoading } = useAuth();
  const [role, setRole] = useState<Role>("customer");
  // Default role is customer, which is OTP-only — mode must start in sync with that.
  const [mode, setMode] = useState<"password" | "otp">("otp");
  const [otpStep, setOtpStep] = useState<"send" | "verify">("send");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Already signed in (e.g. navigated back to /login manually) — bounce
  // straight to the dashboard instead of showing the login form again.
  useEffect(() => {
    if (!authLoading && user) {
      nav({ to: DASHBOARD_BY_ROLE[user.role] ?? "/" });
    }
  }, [authLoading, user, nav]);

  function selectRole(r: Role) {
    setRole(r);
    // Customers are OTP-only — no password option exists for this role.
    if (r === "customer") {
      setMode("otp");
      setOtpStep("send");
      setOtpCode("");
    }
    setGeneralError(null);
    setFieldErrors({});
  }

  function selectMode(m: "password" | "otp") {
    setMode(m);
    setOtpStep("send");
    setOtpCode("");
    setGeneralError(null);
    setFieldErrors({});
  }

  /**
   * Shared by both password and OTP flows once the backend confirms who the
   * user is. The password flow already synced AuthContext via `login()`;
   * the OTP flow calls the API directly, so `setUser` here is what actually
   * establishes the client-side session for it — without it, every guarded
   * page's `useRequireRole` would see no user and bounce straight back to
   * /login right after a successful OTP verification.
   */
  function completeLogin(loggedInUser: BackendUser) {
    if (!ROLE_BY_TAB[role].includes(loggedInUser.role)) {
      setGeneralError(`This account does not have ${role} access.`);
      return;
    }
    setUser(loggedInUser);
    nav({ to: DASHBOARD_BY_ROLE[loggedInUser.role] });
  }

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

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
      completeLogin(user);
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

  async function handleSendOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const identifier = String(formData.get("identifier") ?? "");
    if (!identifier.trim()) {
      setFieldErrors({ identifier: "Email or phone is required" });
      return;
    }

    setIsSendingOtp(true);
    try {
      await sendOtp(identifier, "LOGIN");
      setOtpIdentifier(identifier);
      setOtpStep("verify");
    } catch (err) {
      setGeneralError(err instanceof ApiError ? err.message : "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);

    if (otpCode.length !== 6) {
      setGeneralError("Enter the 6-digit code sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await verifyOtpLogin(otpIdentifier, otpCode);
      completeLogin(user);
    } catch (err) {
      setGeneralError(err instanceof ApiError ? err.message : "Invalid or expired code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Avoid flashing the login form for an already-authenticated visitor while
  // the redirect effect above resolves.
  if (authLoading || user) {
    return null;
  }

  return (
    <AuthShell eyebrow="Sign in" title={<>Welcome back.</>} subtitle="Choose your portal and continue.">
      {role === "customer" && (
        <div className="flex items-center gap-3 mb-4 p-2.5 bg-gold-soft/20 rounded-xl border border-gold/30">
          <img
            src={`${import.meta.env.BASE_URL}images/augmont_logo.png`}
            alt="Augmont Gold For All"
            className="h-8 object-contain bg-white rounded-lg p-1.5 border border-gold/20"
          />
          <div>
            <p className="text-sm font-medium text-ink">Gold EMI Powered by</p>
            <p className="text-xs text-muted-foreground">Augmont Gold For All</p>
          </div>
        </div>
      )}
      <div className="flex gap-1 mb-4 p-1 bg-stone rounded-full w-fit">
        {(["customer", "partner", "branch", "admin"] as const).map((r) => (
          <button
            key={r}
            onClick={() => selectRole(r)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              role === r ? "bg-emerald-deep text-paper shadow-sm" : "text-muted-foreground hover:text-ink"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {role !== "customer" && (
        <div className="flex items-center gap-6 mb-5 border-b border-line">
          {(["password", "otp"] as const).map((m) => (
            <button
              key={m}
              onClick={() => selectMode(m)}
              className={`pb-2.5 -mb-px text-xs font-medium uppercase tracking-wide border-b-2 transition-colors ${
                mode === m ? "border-emerald-deep text-ink" : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {m === "password" ? "Password" : "One-time code"}
            </button>
          ))}
        </div>
      )}

      {role !== "customer" && mode === "password" && (
        <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4">
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
      )}

      {mode === "otp" && otpStep === "send" && (
        <form onSubmit={handleSendOtp} noValidate className="space-y-5">
          <AuthField label="Email or phone" name="identifier" required error={fieldErrors.identifier} />
          {generalError && (
            <p className="text-sm text-destructive" role="alert">{generalError}</p>
          )}
          <button type="submit" disabled={isSendingOtp} className="btn-primary w-full justify-center disabled:opacity-60">
            {isSendingOtp ? "Sending code…" : <>Send OTP <ArrowUpRight className="h-4 w-4" /></>}
          </button>
        </form>
      )}

      {mode === "otp" && otpStep === "verify" && (
        <form onSubmit={handleVerifyOtp} noValidate className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to <span className="text-ink font-medium">{otpIdentifier}</span>.
          </p>
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            pattern={REGEXP_ONLY_DIGITS}
            containerClassName="justify-center"
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-12 w-11 rounded-lg border border-line first:rounded-lg last:rounded-lg text-lg font-medium bg-paper"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {generalError && (
            <p className="text-sm text-destructive text-center" role="alert">{generalError}</p>
          )}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
            {isSubmitting ? "Verifying…" : <>Verify & sign in <ArrowUpRight className="h-4 w-4" /></>}
          </button>
          <button
            type="button"
            onClick={() => setOtpStep("send")}
            className="w-full text-center text-sm text-muted-foreground hover:text-ink"
          >
            Use a different email or phone
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        New here? Register as a{" "}
        <Link to="/register/customer" className="link-underline">customer</Link> or{" "}
        <Link to="/register/partner" className="link-underline">partner</Link>.
      </p>
    </AuthShell>
  );
}
