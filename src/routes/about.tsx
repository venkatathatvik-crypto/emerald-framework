import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowUpRight, GraduationCap, HeartHandshake, TreeDeciduous, Star } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About 2+ Fortune Alliances — A strategic alliance for rural India" },
      { name: "description", content: "Founded 30 June 2022, 2 Plus Fortune Alliances Pvt Ltd is a Hyderabad-headquartered distribution house built on mutual growth and shared success." },
      { property: "og:title", content: "About 2+ Fortune Alliances" },
      { property: "og:description", content: "A strategic alliance between two fortunate enterprises — bridging brands and rural India." },
    ],
  }),
  component: About,
});

const MILESTONES = [
  { year: "FY 2022-23", event: "Company incorporated 30 June 2022. First NBFC partnership established. Revenue: ₹1.03 Cr." },
  { year: "FY 2023-24", event: "Expanded to 5 states. 8 partner MFIs onboarded. Revenue: ₹2.79 Cr. CSR: Sponsored education for 12 students." },
  { year: "FY 2024-25", event: "18 partner MFIs. Operations in 20+ states. 1,00,000+ households impacted. Turnover: ₹5.24 Cr." },
  { year: "FY 2025-26", event: "State warehouse network expansion. Digital platform launch. Target: ₹10.15 Cr." },
  { year: "FY 2026-27", event: "Multi-category expansion. Corporate B2B channel activation. Target: ₹20.66 Cr." },
  { year: "FY 2029-30", event: "Pan-India distribution footprint. Wholesale & retail franchise channels. Target: ₹100 Cr." },
];

const CSR_ITEMS = [
  { icon: <GraduationCap className="h-5 w-5 text-emerald-deep" />, title: "Education Support", desc: "Sponsored education for underprivileged students through partner NGO networks." },
  { icon: <HeartHandshake className="h-5 w-5 text-emerald-deep" />, title: "Medical Aid", desc: "Medical assistance and health camps organised in rural partner districts." },
  { icon: <TreeDeciduous className="h-5 w-5 text-emerald-deep" />, title: "Food Drives", desc: "Regular food distribution drives for vulnerable communities in operational areas." },
  { icon: <Star className="h-5 w-5 text-gold" />, title: "Partner Milestone Trips", desc: "Rewarding top-performing partners — Kashmir, Bali, South India — as recognition of shared success." },
];

function About() {
  return (
    <PageShell>
      <div className="container-edge pt-8">
        <Breadcrumb crumbs={[{ label: "Company", to: "/about" }, { label: "About Us" }]} />
      </div>
      <PageHero
        eyebrow="About — 2+ Fortune Alliances"
        title={<>A strategic alliance between <em className="text-emerald-deep">two fortunate</em> enterprises.</>}
        lede="Founded on 30 June 2022 and headquartered in Hyderabad, 2 Plus Fortune Alliances Pvt Ltd is built on the philosophy of mutual growth and shared success — fostering partnerships that drive value for every stakeholder."
      />

      {/* Vision / Mission / Objective — editorial triptych */}
      <section className="container-edge section-y border-t border-line">
        <div className="grid lg:grid-cols-3 gap-px bg-line">
          {[
            { eyebrow: "Vision", body: "To become India's most admired distribution house — empowering partners with knowledge, guiding them with expertise, and offering products that put control back in their hands." },
            { eyebrow: "Mission", body: "To empower rural, semi-urban and urban clients to enhance their lifestyles through latest products at affordable, structured prices — overcoming the gaps in traditional supply." },
            { eyebrow: "Objective", body: "To bridge premium brands and rural consumers through a seamless distribution ecosystem — built on strategic partnerships, financial inclusion and last-mile connectivity." },
          ].map((x, i) => (
            <article
              key={x.eyebrow}
              data-reveal="rise"
              style={{ animationDelay: `${i * 100}ms` }}
              className="bg-paper p-10 md:p-12 min-h-[24rem] flex flex-col"
            >
              <p className="eyebrow mb-10">{x.eyebrow}</p>
              <p className="font-display text-3xl md:text-4xl text-ink leading-[1.1] mt-auto">{x.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Industry breadth */}
      <section className="bg-stone">
        <div className="container-edge section-y">
          <p className="eyebrow mb-6" data-reveal="rise-soft">Industry</p>
          <h2 data-reveal="rise" className="font-display text-5xl md:text-7xl text-ink max-w-4xl leading-[1.02]">
            Distribution across <em className="text-emerald-deep">twelve</em> consumer categories.
          </h2>
          <div className="mt-16 flex flex-wrap gap-3 max-w-5xl">
            {["Kitchenware","Home Appliances","Home Furnishing","Household Furniture","Electricals","Electronics","White Goods","Water Purifiers","Portable Solar","Mobiles & Accessories","Health & Hygiene","FMCG / Commodities"].map((c, i) => (
              <span
                key={c}
                data-reveal="rise-soft"
                style={{ animationDelay: `${i * 40}ms` }}
                className="px-5 py-2.5 rounded-full border border-line bg-paper text-sm hover:border-emerald-deep hover:text-emerald-deep transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-12 max-w-2xl text-muted-foreground" data-reveal="rise-soft">
            Distributed across rural, retail, corporate and B2B channels — built around a single
            promise of reach, reliability and trust.
          </p>
        </div>
      </section>

      {/* Why us */}
      <section className="container-edge section-y">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-24">
          <div>
            <p className="eyebrow mb-6">Why 2+ Fortune Alliances</p>
            <Link to="/business-model" className="link-underline text-sm">
              Read the business model <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-10">
            {[
              ["Industry expertise", "Deep understanding of rural markets, operations, and customer needs — backed by 25+ years of leadership."],
              ["Tailored offerings", "Curated products designed to meet market and consumer demand, not catalogue convenience."],
              ["Value-driven solutions", "Focused on partner business growth, not just commercial gains."],
              ["Service commitment", "Rapid complaint resolution and hassle-free replacements — backed by penalty-bound SLAs."],
            ].map(([t, d], i) => (
              <div key={t} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="border-t border-line pt-6">
                <h3 className="font-display text-2xl mb-3">{t}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones timeline */}
      <section className="container-edge section-y border-t border-line" id="milestones">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-28">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-6" data-reveal="rise-soft">Growth Milestones</p>
            <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl text-ink leading-[0.97]">
              Four years.<br /><em className="text-emerald-deep">A decade</em><br />of ambition.
            </h2>
          </div>
          <ol className="space-y-0">
            {MILESTONES.map((m, i) => (
              <li
                key={m.year}
                data-reveal="rise-soft"
                style={{ animationDelay: `${i * 80}ms` }}
                className="flex gap-6 border-l-2 border-line pl-8 pb-10 relative hover:border-l-emerald-deep transition-colors duration-500 group"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-line bg-paper group-hover:border-gold group-hover:bg-gold transition-all duration-500" />
                <div>
                  <p className="eyebrow text-gold mb-2">{m.year}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.event}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CSR */}
      <section className="bg-stone border-t border-line" id="csr">
        <div className="container-edge section-y">
          <div className="mb-14">
            <p className="eyebrow mb-5" data-reveal="rise-soft">CSR & Community Impact</p>
            <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl text-ink leading-[0.97] max-w-2xl">
              Building communities,<br />not just <em className="text-emerald-deep">distribution routes.</em>
            </h2>
          </div>
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
            <div className="grid sm:grid-cols-2 gap-4">
              {CSR_ITEMS.map((c, i) => (
                <div
                  key={c.title}
                  data-reveal="rise"
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="card-premium p-8 group"
                >
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-stone rounded-xl border border-line group-hover:border-gold-soft transition-colors shrink-0">{c.icon}</div>
                    <div>
                      <h3 className="font-display text-2xl text-ink mb-2">{c.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div 
              data-reveal="rise" 
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-line aspect-[4/3] group bg-stone"
            >
              <img 
                src="/images/csr_impact.png" 
                alt="Community impact, children and solar-powered schools" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA />
    </PageShell>
  );
}

function ClosingCTA() {
  return (
    <section className="container-edge section-y border-t border-line">
      <h2 className="font-display text-5xl md:text-7xl text-ink max-w-4xl leading-[1.02]" data-reveal="rise">
        Bridge brands. <em className="text-emerald-deep">Build trust.</em>
      </h2>
      <div className="mt-10 flex gap-3 flex-wrap">
        <Link to="/contact" className="btn-primary">Start the conversation <ArrowUpRight className="h-4 w-4" /></Link>
        <Link to="/leadership" className="btn-ghost">Meet leadership</Link>
      </div>
    </section>
  );
}
