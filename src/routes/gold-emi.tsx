import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/gold-emi")({
  head: () => ({
    meta: [
      { title: "Gold EMI — Unlock liquidity. Keep ownership." },
      { name: "description", content: "2+FAPL Gold EMI converts household gold into structured, low-cost installment power — without sale or loss of ownership." },
      { property: "og:title", content: "Gold EMI — 2+FAPL" },
      { property: "og:description", content: "Premium consumer goods, financed against your gold. Transparent. Insured. Reclaimable." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      {/* Distinctive gold-toned hero */}
      <section className="bg-gradient-to-b from-paper via-paper to-gold-soft/30">
        <div className="container-edge pt-24 md:pt-36 pb-20 md:pb-32">
          <p className="eyebrow mb-8 text-gold" data-reveal="rise-soft">Gold EMI · A 2+FAPL programme</p>
          <h1 data-reveal="rise" className="font-display text-[14vw] md:text-[9vw] xl:text-[8.5rem] leading-[0.9] text-ink max-w-[14ch]">
            Unlock <em className="text-gold">liquidity.</em><br />
            Keep ownership.
          </h1>
          <p data-reveal="rise-soft" style={{ animationDelay: "200ms" }} className="mt-10 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Convert household gold into structured installment power for the consumer goods you need today —
            without selling, without losing ownership, and without the predatory interest that defines the unorganised market.
          </p>
          <div className="mt-12 flex gap-3 flex-wrap" data-reveal="rise-soft" style={{ animationDelay: "320ms" }}>
            <Link to="/contact" className="btn-gold">Speak with a Gold EMI specialist <ArrowUpRight className="h-4 w-4" /></Link>
            <Link to="/hassle-free-emi" className="btn-ghost">Compare with Hassle-Free EMI</Link>
          </div>
        </div>
      </section>

      {/* Headline numbers */}
      <section className="border-y border-line bg-ink text-paper">
        <div className="container-edge py-16 md:py-24 grid md:grid-cols-3 gap-12">
          {[
            ["Up to 75%", "Loan-to-value on certified gold"],
            ["0% Processing", "On all eligible consumer-goods baskets"],
            ["Reclaim anytime", "On full pre-payment of the basket value"],
          ].map(([a, b], i) => (
            <div key={i} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }}>
              <p className="font-display text-5xl md:text-6xl text-gold mb-3">{a}</p>
              <p className="text-paper/70 text-sm">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container-edge section-y">
        <p className="eyebrow mb-6" data-reveal="rise-soft">How Gold EMI works</p>
        <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl max-w-3xl leading-[1.02] mb-16">
          Five touchpoints. <em className="text-emerald-deep">One promise.</em>
        </h2>
        <ol className="space-y-0">
          {[
            ["Branch valuation", "Bring your gold to any partner branch. Certified BIS valuation in under 20 minutes."],
            ["Eligibility & basket", "We confirm LTV and walk you through the eligible consumer-goods basket."],
            ["Insured storage", "Your gold moves to a fully insured vault with audited custody trail."],
            ["Delivery", "Products dispatched from the nearest state warehouse — installed at home."],
            ["Reclaim", "Repay through structured EMIs. Reclaim your gold the day the basket is closed."],
          ].map(([t, d], i) => (
            <li key={t} data-reveal="rise-soft" style={{ animationDelay: `${i * 80}ms` }} className="grid lg:grid-cols-[6rem_1fr_1.5fr] gap-6 py-10 border-t border-line">
              <span className="font-display text-5xl text-gold">0{i + 1}</span>
              <h3 className="font-display text-3xl text-ink">{t}</h3>
              <p className="text-muted-foreground leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Trust statement */}
      <section className="bg-stone">
        <div className="container-edge section-y">
          <p className="eyebrow mb-6" data-reveal="rise-soft">Why it's different</p>
          <p data-reveal="rise" className="font-display text-3xl md:text-5xl leading-[1.1] max-w-5xl">
            Conventional pawn shops sell you debt. <em className="text-emerald-deep">We finance a goal</em> —
            your refrigerator, your child's smartphone, your family's water purifier — and hand back
            your gold the day the basket is closed.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-10 max-w-5xl">
            {[
              ["BIS-certified valuation", "Transparent, recorded, dispute-resolved at branch."],
              ["Insured vault custody", "Full-value insurance, audited monthly."],
              ["Digital ledger", "Every transaction visible on the customer portal."],
            ].map(([t, d], i) => (
              <div key={t} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="border-t border-line pt-6">
                <h4 className="font-display text-2xl mb-2">{t}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edge section-y">
        <h2 className="font-display text-5xl md:text-7xl max-w-4xl" data-reveal="rise">
          Ready to put gold to work? <em className="text-gold">Quietly.</em>
        </h2>
        <div className="mt-10 flex gap-3 flex-wrap">
          <Link to="/contact" className="btn-gold">Book a valuation <ArrowUpRight className="h-4 w-4" /></Link>
          <Link to="/portal/customer" className="btn-ghost">Open customer portal</Link>
        </div>
      </section>
    </PageShell>
  );
}
