import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { InputOTP, InputOTPGroup, InputOTPSlot, REGEXP_ONLY_DIGITS } from "@/components/ui/input-otp";
import { useAuth } from "@/lib/auth-context";
import { startCustomerRegistration, verifyCustomerRegistration } from "@/lib/api/customer";
import { ApiError } from "@/lib/api/types";
import { ArrowUpRight } from "lucide-react";
import { useState, type FormEvent } from "react";

interface RegisterCustomerSearch {
  ref?: string;
}

export const Route = createFileRoute("/register/customer")({
  validateSearch: (search: Record<string, unknown>): RegisterCustomerSearch => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  head: () => ({ meta: [{ title: "Customer Registration — 2+FAPL" }, { name: "description", content: "Create a 2+FAPL customer account." }] }),
  component: Page,
});

type FieldErrors = Partial<Record<"email" | "firstName" | "mobile", string>>;

function Page() {
  const nav = useNavigate();
  const { ref } = Route.useSearch();
  const { setUser } = useAuth();

  const [step, setStep] = useState<"start" | "verify">("start");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleStart(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const values = {
      email: String(formData.get("email") ?? "").trim(),
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      mobile: String(formData.get("mobile") ?? "").trim(),
    };

    const errors: FieldErrors = {};
    if (!values.email) errors.email = "Email is required";
    if (!values.firstName) errors.firstName = "First name is required";
    if (values.mobile && !/^[6-9]\d{9}$/.test(values.mobile)) {
      errors.mobile = "Enter a valid 10-digit Indian mobile number";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await startCustomerRegistration({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName || undefined,
        mobile: values.mobile || undefined,
        referralCode: ref,
      });
      setEmail(values.email);
      setStep("verify");
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

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);

    if (otp.length !== 6) {
      setGeneralError("Enter the 6-digit code sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await verifyCustomerRegistration(email, otp);
      setUser(user);
      nav({ to: "/dashboard/customer" });
    } catch (err) {
      setGeneralError(err instanceof ApiError ? err.message : "Invalid or expired code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Customer Registration"
      title={<>Open your account in <em className="text-emerald-deep">two minutes.</em></>}
      subtitle={step === "start" ? "Just your name and email — nothing else, until you're ready to buy." : "Enter the code we just emailed you."}
    >
      {step === "start" && (
        <form onSubmit={handleStart} noValidate className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <AuthField label="First name" name="firstName" required error={fieldErrors.firstName} />
            <AuthField label="Last name" name="lastName" />
          </div>
          <AuthField label="Email" type="email" name="email" required error={fieldErrors.email} />
          <AuthField label="Mobile (optional)" name="mobile" placeholder="10-digit mobile number" inputMode="numeric" maxLength={10} error={fieldErrors.mobile} />
          {ref && (
            <p className="text-xs text-muted-foreground">Referred by <span className="text-ink">{ref}</span></p>
          )}
          {generalError && (
            <p className="text-sm text-destructive" role="alert">{generalError}</p>
          )}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
            {isSubmitting ? "Sending code…" : <>Send verification code <ArrowUpRight className="h-4 w-4" /></>}
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify} noValidate className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to <span className="text-ink font-medium">{email}</span>.
          </p>
          <InputOTP maxLength={6} value={otp} onChange={setOtp} pattern={REGEXP_ONLY_DIGITS} containerClassName="justify-center">
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
            {isSubmitting ? "Verifying…" : <>Create account <ArrowUpRight className="h-4 w-4" /></>}
          </button>
          <button
            type="button"
            onClick={() => { setStep("start"); setOtp(""); setGeneralError(null); }}
            className="w-full text-center text-sm text-muted-foreground hover:text-ink"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="link-underline">Sign in</Link>.
      </p>
    </AuthShell>
  );
}
