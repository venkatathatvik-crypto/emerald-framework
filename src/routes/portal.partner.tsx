import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight, LayoutDashboard, Users, Boxes, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/portal/partner")({
  head: () => ({
    meta: [
      { title: "Partner Portal — 2+FAPL" },
      { name: "description", content: "Indent management, branch enrolment, settlement and analytics — purpose-built for MFI, NBFC and cooperative partners." },
      { property: "og:title", content: "Partner Portal — 2+FAPL" },
      { property: "og:description", content: "Where partnerships scale." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Partner Portal"
        title={<>Where partnerships <em className="text-emerald-deep">scale.</em></>}
        lede="Purpose-built for MFI, NBFC, cooperative and Sec. 8 partners — indent management, branch enrolment, member ordering and settlement, all in one operating system."
        meta={
          <div className="flex gap-3 flex-wrap">
            <Link to="/login" className="btn-primary">Partner sign-in <ArrowUpRight className="h-4 w-4" /></Link>
            <Link to="/register/partner" className="btn-ghost">Register partner</Link>
          </div>
        }
      />
      <section className="container-edge section-y border-t border-line grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
        {[
          { Icon: LayoutDashboard, t: "Partner Overview", d: "Indent pipeline, branch health, settlement status." },
          { Icon: Boxes, t: "Indent & Catalogue", d: "Raise indents against the live, priced catalogue." },
          { Icon: Users, t: "Branch & Member Mgmt", d: "Enrol branches, manage member eligibility and KYC." },
          { Icon: BarChart3, t: "Analytics", d: "Brand-wise, state-wise and category-wise mindshare." },
        ].map((f, i) => (
          <div key={f.t} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="bg-paper p-10 min-h-[16rem]">
            <f.Icon className="h-6 w-6 text-emerald-deep mb-6" />
            <h3 className="font-display text-2xl mb-2">{f.t}</h3>
            <p className="text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
