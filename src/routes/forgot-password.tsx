import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset your password — 2+FAPL" }] }),
  component: Page,
});

function Page() {
  const [sent, setSent] = useState(false);
  return (
    <AuthShell
      eyebrow="Password reset"
      title={sent ? <>Check your inbox.</> : <>Forgot your password?</>}
      subtitle={sent ? "We've sent a reset link if an account exists for that address." : "Enter the email on your account and we'll send a reset link."}
    >
      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
          <AuthField label="Email" type="email" name="email" required />
          <button type="submit" className="btn-primary w-full justify-center">Send reset link <ArrowUpRight className="h-4 w-4" /></button>
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
