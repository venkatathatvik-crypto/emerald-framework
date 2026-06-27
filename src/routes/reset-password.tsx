import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set a new password — 2+FAPL" }] }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  return (
    <AuthShell eyebrow="New password" title={<>Set a new <em className="text-emerald-deep">password.</em></>} subtitle="Use at least 8 characters, one uppercase letter and one number.">
      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/login" }); }} className="space-y-5">
        <AuthField label="New password" type="password" name="password" required />
        <AuthField label="Confirm new password" type="password" name="confirm" required />
        <button type="submit" className="btn-primary w-full justify-center">Update password <ArrowUpRight className="h-4 w-4" /></button>
      </form>
      <p className="mt-8 text-sm text-muted-foreground">
        <Link to="/login" className="link-underline">← Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
