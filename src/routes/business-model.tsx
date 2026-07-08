import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/business-model")({
  head: () => ({
    meta: [
      { title: "Business Model — 2+ Fortune Alliances as a rural aggregator" },
      { name: "description", content: "Inside our aggregator model: connecting OEMs with rural India via MFIs, NBFCs, cooperatives and Section 8 partners." },
      { property: "og:title", content: "The 2+ Fortune Alliances aggregator model" },
      { property: "og:description", content: "Connecting urban manufacturing capacity with India's rural opportunity." },
    ],
  }),
  component: Page,
});

const FLOW = [
  ["Manufacturer / OEM", "Production, packaging, brand assurance."],
  ["2+ Fortune Alliances aggregator", "Indent consolidation, partner enablement, supply orchestration."],
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
        lede="To penetrate into the rural population for their upliftment & enable seamless access to any product which is aspirational."
      />

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
              As a unified aggregator, 2+ Fortune Alliances consolidates demand and orchestrates supply. We bridge manufacturers directly with rural customers by partnering with trusted financial institutions, managing local staging warehouses, and leveraging partner branch footprints to handle last-mile deliveries with guaranteed SLA accountability.
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
              src={`${import.meta.env.BASE_URL}images/journey_isometric.png`} 
              alt="Aggregator Journey: Manufacturer to Rural Customer" 
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
              ["Digital Marketing", "Leveraging digital channels, social commerce, and modern marketing strategies to penetrate rural populations for their upliftment."],
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

      <section className="container-edge section-y border-t border-line">
        <div className="mt-8 flex gap-3 flex-wrap">
          <Link to="/products" className="btn-primary">Explore the catalogue <ArrowUpRight className="h-4 w-4" /></Link>
          <Link to="/contact" className="btn-ghost">Discuss a partnership</Link>
        </div>
      </section>
    </PageShell>
  );
}
