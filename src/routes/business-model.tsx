import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Counter } from "@/components/Counter";

export const Route = createFileRoute("/business-model")({
  head: () => ({
    meta: [
      { title: "Business Model — 2+FAPL as a rural aggregator" },
      { name: "description", content: "Inside the 2+FAPL aggregator model: connecting OEMs with rural India via MFIs, NBFCs, cooperatives and Section 8 partners." },
      { property: "og:title", content: "The 2+FAPL aggregator model" },
      { property: "og:description", content: "How we bridge ₹1,000 Cr of urban manufacturing capacity with India's ₹2,000+ Cr rural opportunity." },
    ],
  }),
  component: Page,
});

const FLOW = [
  ["Manufacturer / OEM", "Production, packaging, brand assurance."],
  ["2+FAPL aggregator", "Indent consolidation, partner enablement, supply orchestration."],
  ["State warehousing", "Quality check, batching, regional staging."],
  ["NBFC / MFI partner branches", "Rural distribution arm, last-mile fulfilment."],
  ["End consumer", "Affordable, structured-price access to premium brands."],
];

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Business Model"
        title={<>An aggregator built for <em className="text-emerald-deep">rural India.</em></>}
        lede="A ₹2,000+ Cr rural consumer-goods opportunity, split evenly between manufacturers and aggregators. We sit in the middle — making the bridge accountable."
      />

      {/* Market split */}
      <section className="container-edge section-y border-t border-line">
        <div className="grid lg:grid-cols-2 gap-px bg-line">
          {[
            { tag: "₹1,000 Cr", title: "Manufacturers", body: "OEMs producing, branding and supplying consumer goods — typically operating B2B2C or institutional models." },
            { tag: "₹1,000 Cr", title: "Aggregators", body: "Intermediaries bridging brands and rural markets — optimising logistics, warehousing and last-mile through MFIs, NBFCs, cooperatives, Sec. 8 companies and trusts." },
          ].map((c, i) => (
            <div key={c.title} data-reveal="rise" style={{ animationDelay: `${i * 100}ms` }} className="bg-paper p-10 md:p-14 min-h-[24rem]">
              <p className="font-display text-6xl md:text-7xl text-gold mb-8">{c.tag}</p>
              <h3 className="font-display text-3xl md:text-4xl mb-4">{c.title}</h3>
              <p className="text-muted-foreground max-w-md leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our role */}
      <section className="bg-ink text-paper">
        <div className="container-edge section-y">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 mb-16">
            <p className="eyebrow text-gold" data-reveal="rise-soft">Our role</p>
            <h2 data-reveal="rise" className="font-display text-5xl md:text-7xl leading-[0.98]">
              Connecting urban OEMs with India's <em className="text-gold">underserved rural markets.</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              ["Robust distribution network", "Deep reach across rural markets."],
              ["Strategic alliances", "Sustainable partnerships built on trust."],
              ["Streamlined supply chain", "Efficient logistics, timely delivery."],
              ["Accessibility & affordability", "Quality products within reach of every household."],
            ].map(([t, d], i) => (
              <div key={t} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="border-t border-paper/15 pt-6">
                <p className="font-display text-3xl text-gold mb-4">0{i + 1}</p>
                <h4 className="font-display text-2xl mb-2 text-paper">{t}</h4>
                <p className="text-sm text-paper/70 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aggregator Network Diagram Section */}
      <section className="container-edge section-y border-t border-line">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 xl:gap-24 items-center">
          <div>
            <p className="eyebrow mb-6" data-reveal="rise-soft">Aggregator Fabric</p>
            <h2 data-reveal="rise" className="font-display text-4xl md:text-5xl text-ink leading-[1.0] mb-6">
              The central node of <em className="text-emerald-deep">rural commerce.</em>
            </h2>
            <p data-reveal="rise-soft" className="text-muted-foreground text-sm leading-relaxed mb-6">
              As a unified aggregator, 2+FAPL consolidates demand and orchestrates supply. We bridge manufacturers directly with rural customers by partnering with trusted financial institutions, managing local staging warehouses, and leveraging MFI branch footprints to handle last-mile deliveries with guaranteed SLA accountability.
            </p>
            <div className="flex flex-wrap gap-2" data-reveal="rise-soft">
              {["Manufacturers", "Aggregators", "Financial Institutions", "Partners", "Branches", "Customers"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg border border-line bg-stone text-xs font-medium text-ink">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div 
            data-reveal="rise"
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-line bg-glow-emerald aspect-[4/3] group p-4 flex items-center justify-center bg-stone"
          >
            <img 
              src="/images/journey_isometric.png" 
              alt="2+FAPL Aggregator Journey: Manufacturer to Rural Customer" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Flow */}

      <section className="container-edge section-y">
        <p className="eyebrow mb-6" data-reveal="rise-soft">End-to-end flow</p>
        <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl mb-16 max-w-4xl leading-[1.02]">
          One indent. <em className="text-emerald-deep">Five hops.</em> Zero ambiguity.
        </h2>
        <ol className="space-y-8">
          {FLOW.map(([t, d], i) => (
            <li
              key={t}
              data-reveal="rise-soft"
              style={{ animationDelay: `${i * 80}ms` }}
              className="grid lg:grid-cols-[6rem_1fr_auto] items-start gap-6 border-t border-line pt-8"
            >
              <span className="font-display text-5xl text-gold">0{i + 1}</span>
              <div>
                <h3 className="font-display text-3xl mb-2">{t}</h3>
                <p className="text-muted-foreground max-w-xl">{d}</p>
              </div>
              {i < FLOW.length - 1 && <ArrowRight className="h-5 w-5 text-line lg:rotate-0 rotate-90 mt-2" />}
            </li>
          ))}
        </ol>
      </section>

      {/* Segments */}
      <section className="bg-stone">
        <div className="container-edge section-y">
          <p className="eyebrow mb-6" data-reveal="rise-soft">Diversified segments</p>
          <h2 data-reveal="rise" className="font-display text-5xl md:text-7xl max-w-4xl leading-[0.98] mb-16">
            Expanding reach. <em className="text-emerald-deep">Enriching lives.</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-line">
            {[
              ["Financial institutions (Rural)", "Partnering with rural financial institutions to ensure trust, accessibility and financial inclusion."],
              ["Wholesale & bulk promotion", "Volume-driven channels for partners targeting institutional and trade scale."],
              ["Corporate B2B (Urban)", "Value-driven solutions for urban corporate procurement and employee programmes."],
              ["Retail franchise (Rural)", "Empowering rural entrepreneurs through a franchise model for sustainable, local growth."],
            ].map(([t, d], i) => (
              <div key={t} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="bg-paper p-10 md:p-12">
                <h3 className="font-display text-3xl mb-3">{t}</h3>
                <p className="text-muted-foreground max-w-md">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projection */}
      <section className="container-edge section-y">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-end">
          <div>
            <p className="eyebrow mb-6">By FY 2029-30</p>
            <p className="font-display text-[18vw] md:text-[10vw] xl:text-[10rem] leading-[0.9] text-ink">
              ₹<Counter to={110} /> Cr
            </p>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl">
            Projected revenue under the aggregator model — driven by network expansion, deeper partnerships
            and rising rural penetration across categories.
          </p>
        </div>
        <div className="mt-16 flex gap-3 flex-wrap">
          <Link to="/products" className="btn-primary">Explore the catalogue <ArrowUpRight className="h-4 w-4" /></Link>
          <Link to="/contact" className="btn-ghost">Discuss a partnership</Link>
        </div>
      </section>
    </PageShell>
  );
}
