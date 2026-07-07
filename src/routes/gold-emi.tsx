import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/gold-emi")({
  head: () => ({
    meta: [
      { title: "Gold EMI — Unlock liquidity. Keep ownership." },
      { name: "description", content: "2+ Fortune Alliances Gold EMI converts household gold into structured, low-cost installment power — without sale or loss of ownership." },
      { property: "og:title", content: "Gold EMI — 2+ Fortune Alliances" },
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
          <p className="eyebrow mb-8 text-gold" data-reveal="rise-soft">Gold EMI · A 2+ Fortune Alliances programme</p>
          <div className="flex items-center gap-4 mb-8" data-reveal="rise-soft">
            <span className="font-display text-xl text-ink">Powered by</span>
            <img 
              src="/images/augmont_logo.png" 
              alt="Augmont Gold For All" 
              className="h-10 object-contain bg-white rounded-lg p-1.5 border border-line" 
            />
          </div>
          <h1 data-reveal="rise" className="font-display text-[14vw] md:text-[9vw] xl:text-[8.5rem] leading-[0.9] text-ink max-w-[14ch]">
            Gold EMI: <em className="text-gold">Unlock.</em>
          </h1>
          <p data-reveal="rise-soft" style={{ animationDelay: "200ms" }} className="mt-10 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Convert household gold into structured installment power for the consumer goods you need today —
            without selling, without losing ownership, and without the predatory interest that defines the unorganised market.
          </p>
          <div className="mt-12 flex gap-3 flex-wrap" data-reveal="rise-soft" style={{ animationDelay: "320ms" }}>
            <Link to="/contact" className="btn-gold">Speak with a specialist <ArrowUpRight className="h-4 w-4" /></Link>
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

      {/* What it includes */}
      <section className="container-edge section-y">
        <p className="eyebrow mb-6" data-reveal="rise-soft">Program features</p>
        <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl max-w-3xl leading-[1.02] mb-16">
          What the Gold EMI <em className="text-emerald-deep">program includes:</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-8" data-reveal="rise">
          {[
            {
              title: "Service Support",
              desc: "We will act as the enablers and facilitators for all ongoing service support requests."
            },
            {
              title: "Professional Installation",
              desc: "Complete product installation handled directly by authorized manufacturer technicians."
            },
            {
              title: "Last Mile Delivery",
              desc: "Delivered directly via doorstep delivery or the convenient branch network of our partners."
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl border border-line bg-stone/30 flex flex-col justify-between min-h-[12rem]">
              <CheckCircle2 className="h-8 w-8 text-emerald-deep mb-4" />
              <div>
                <h3 className="font-display text-2xl text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
