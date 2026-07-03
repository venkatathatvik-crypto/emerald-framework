import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight, Check } from "lucide-react";

export const Route = createFileRoute("/hassle-free-emi")({
  head: () => ({
    meta: [
      { title: "Hassle-Free EMI — No interest. No processing fee. No insurance." },
      { name: "description", content: "Acquire essential consumer goods through 2+FAPL's structured no-interest, no-fee installment plan — delivered via trusted financial partners." },
      { property: "og:title", content: "Hassle-Free EMI — 2+FAPL" },
      { property: "og:description", content: "Premium brands at structured prices. Zero hidden costs." },
    ],
  }),
  component: Page,
});

const PROMISES = [
  ["00%", "Interest"],
  ["₹0", "Processing fee"],
  ["₹0", "Insurance"],
  ["100%", "Brand warranty"],
];

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Hassle-Free EMI"
        title={<>The simplest <em className="text-emerald-deep">EMI</em> in rural India.</>}
        lede="Built for households that deserve premium brands without predatory financing. Structured installments routed through our trusted MFI and NBFC partner network."
      />

      {/* Big promise grid */}
      <section className="border-t border-line">
        <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line">
          {PROMISES.map((p, i) => (
            <div key={i} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="p-10 md:p-14 text-center">
              <p className="font-display text-6xl md:text-7xl text-emerald-deep mb-3">{p[0]}</p>
              <p className="eyebrow">{p[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-edge section-y">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-24">
          <div>
            <p className="eyebrow mb-6" data-reveal="rise-soft">How it works</p>
            <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl leading-[1.02] text-ink">
              Four steps from <em className="text-emerald-deep">need</em> to <em className="text-gold">doorstep.</em>
            </h2>
          </div>
          <ol className="space-y-8">
            {[
              ["Choose your product", "Browse the catalogue with your local NBFC / MFI partner branch."],
              ["Verify enrolment", "Existing partner members get pre-approved tenure based on their relationship."],
              ["Confirm structured plan", "We share an EMI schedule — no interest, no hidden charges."],
              ["Delivery & install", "Product is dispatched from the nearest state warehouse and installed at home."],
            ].map(([t, d], i) => (
              <li key={t} data-reveal="rise-soft" style={{ animationDelay: `${i * 80}ms` }} className="border-t border-line pt-6 grid grid-cols-[4rem_1fr] gap-4">
                <span className="font-display text-3xl text-gold">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl mb-1">{t}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Inclusion list */}
      <section className="bg-stone">
        <div className="container-edge section-y grid lg:grid-cols-2 gap-12">
          <div>
            <p className="eyebrow mb-6" data-reveal="rise-soft">What's included</p>
            <h2 data-reveal="rise" className="font-display text-4xl md:text-5xl leading-[1.05]">
              Everything you'd expect.<br /><em className="text-emerald-deep">Nothing you wouldn't.</em>
            </h2>
          </div>
          <ul className="space-y-4">
            {[
              "Full brand-warranty on every product",
              "Last-mile delivery + installation by branch staff",
              "Damage / defect swap at delivery",
              "Repayment via your existing MFI / NBFC schedule",
              "AMC enablement for white goods & water purifiers",
              "Doorstep service across 20+ states",
            ].map((x, i) => (
              <li key={x} data-reveal="rise-soft" style={{ animationDelay: `${i * 50}ms` }} className="flex gap-3 items-start border-b border-line pb-4">
                <Check className="h-5 w-5 text-emerald-deep shrink-0 mt-0.5" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-edge section-y">
        <h2 className="font-display text-5xl md:text-6xl max-w-3xl" data-reveal="rise">
          Looking for gold-backed financing instead? <Link to="/gold-emi" className="text-gold link-underline">See Gold EMI</Link>.
        </h2>
        <div className="mt-10 flex gap-3 flex-wrap">
          <Link to="/contact" className="btn-primary">Apply through a partner <ArrowUpRight className="h-4 w-4" /></Link>
          <Link to="/brands" className="btn-ghost">Our partner network</Link>
        </div>
      </section>
    </PageShell>
  );
}
