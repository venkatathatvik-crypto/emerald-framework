import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/register/partner")({
  head: () => ({ meta: [{ title: "Partner Registration — 2+FAPL" }, { name: "description", content: "Apply to join the 2+FAPL partner network." }] }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  return (
    <AuthShell
      eyebrow="Partner Registration"
      title={<>Join the <em className="text-emerald-deep">distribution fabric.</em></>}
      subtitle="Tell us about your institution. A relationship manager will be in touch within one business day."
      side={
        <>
          <p className="eyebrow text-gold mb-6">For institutions</p>
          <p className="font-display text-3xl md:text-4xl leading-[1.1]">
            MFIs, NBFCs, cooperatives, Sec. 8 companies, and trusts — <em className="text-gold">welcome.</em>
          </p>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard/partner" }); }} className="space-y-5">
        <AuthField label="Institution name" name="org" required />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="eyebrow block mb-2 text-[0.65rem]">Type *</label>
            <select required className="w-full bg-paper border border-line px-4 py-3 rounded-sm focus:outline-none focus:border-emerald-deep">
              <option>MFI</option><option>NBFC</option><option>Cooperative Society</option><option>Sec. 8 Company</option><option>Foundation / Trust</option>
            </select>
          </div>
          <AuthField label="Branches" name="branches" placeholder="e.g., 42" required />
        </div>
        <AuthField label="Authorised contact name" name="contact" required />
        <AuthField label="Email" type="email" name="email" required />
        <AuthField label="Mobile" name="mobile" required />
        <AuthField label="Headquarters city" name="city" required />
        <AuthField label="Create password" type="password" name="password" required />
        <button type="submit" className="btn-primary w-full justify-center">
          Submit application <ArrowUpRight className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-8 text-sm text-muted-foreground">
        Already registered? <Link to="/login" className="link-underline">Sign in</Link>.
      </p>
    </AuthShell>
  );
}
