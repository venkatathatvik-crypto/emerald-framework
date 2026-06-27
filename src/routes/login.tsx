import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — 2+FAPL" }, { name: "description", content: "Sign in to your 2+FAPL account." }] }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [role, setRole] = useState<"customer" | "partner" | "branch" | "admin">("customer");
  return (
    <AuthShell eyebrow="Sign in" title={<>Welcome back.</>} subtitle="Choose your portal and continue.">
      <div className="flex gap-2 mb-8 p-1 bg-stone rounded-full w-fit">
        {(["customer", "partner", "branch", "admin"] as const).map((r) => (
          <button key={r} onClick={() => setRole(r)} className={`px-4 py-1.5 rounded-full text-xs capitalize transition-colors ${role === r ? "bg-emerald-deep text-paper" : "text-muted-foreground"}`}>
            {r}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); nav({ to: `/dashboard/${role}` }); }} className="space-y-5">
        <AuthField label="Email or phone" name="id" required />
        <AuthField label="Password" type="password" name="password" required />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-emerald-deep" /> Remember me
          </label>
          <Link to="/forgot-password" className="link-underline text-sm">Forgot password?</Link>
        </div>
        <button type="submit" className="btn-primary w-full justify-center">
          Sign in as {role} <ArrowUpRight className="h-4 w-4" />
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
