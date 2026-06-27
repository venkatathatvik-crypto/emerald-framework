import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/register/customer")({
  head: () => ({ meta: [{ title: "Customer Registration — 2+FAPL" }, { name: "description", content: "Create a 2+FAPL customer account." }] }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  return (
    <AuthShell
      eyebrow="Customer Registration"
      title={<>Open your account in <em className="text-emerald-deep">two minutes.</em></>}
      subtitle="We need a few details to verify your identity and link you to your branch."
    >
      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard/customer" }); }} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <AuthField label="First name" name="first" required />
          <AuthField label="Last name" name="last" required />
        </div>
        <AuthField label="Mobile (10-digit)" name="mobile" required />
        <AuthField label="Email" type="email" name="email" />
        <AuthField label="Branch / NBFC partner" name="branch" placeholder="e.g., Sugmya Finance" required />
        <AuthField label="Create password" type="password" name="password" required />
        <label className="flex items-start gap-3 text-xs text-muted-foreground">
          <input type="checkbox" required className="mt-1 accent-emerald-deep" />
          <span>I agree to the Terms of Service and Privacy Policy of 2 Plus Fortune Alliances Pvt Ltd.</span>
        </label>
        <button type="submit" className="btn-primary w-full justify-center">
          Create account <ArrowUpRight className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="link-underline">Sign in</Link>.
      </p>
    </AuthShell>
  );
}
