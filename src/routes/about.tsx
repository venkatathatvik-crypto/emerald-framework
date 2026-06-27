import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About 2+FAPL — A strategic alliance for rural India" },
      { name: "description", content: "Founded 30 June 2022, 2 Plus Fortune Alliances Pvt Ltd is a Hyderabad-headquartered distribution house built on mutual growth and shared success." },
      { property: "og:title", content: "About 2+FAPL" },
      { property: "og:description", content: "A strategic alliance between two fortunate enterprises — bridging brands and rural India." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About — 2+FAPL"
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
            Distribution across <em className="text-emerald-deep">eleven</em> consumer categories.
          </h2>
          <div className="mt-16 flex flex-wrap gap-3 max-w-5xl">
            {["Kitchenware","Home Appliances","Home Furnishing","Household Furniture","Electricals","Electronics","White Goods","Water Purifiers","Portable Solar","Mobiles & Accessories","Health & Hygiene"].map((c, i) => (
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
            <p className="eyebrow mb-6">Why 2+FAPL</p>
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
