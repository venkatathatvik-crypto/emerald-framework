import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products & Services — 2+FAPL Catalogue" },
      { name: "description", content: "Eleven consumer categories — from kitchenware and home appliances to electronics, solar, water purifiers and health & hygiene." },
      { property: "og:title", content: "Products & Services — 2+FAPL" },
      { property: "og:description", content: "A curated catalogue spanning everyday essentials to timeless treasures." },
    ],
  }),
  component: Page,
});

const CATEGORIES = [
  { n: "01", t: "Kitchenware", d: "Pressure cookers, cookware sets, tiffin systems, vacuum flasks and modern storage — engineered for everyday use." },
  { n: "02", t: "Home Appliances", d: "Mixer-grinders, induction cooktops, electric kettles, irons, sandwich makers — premium brands at structured prices." },
  { n: "03", t: "Home Furnishing", d: "Bedding, mattresses, curtains and decor essentials chosen for value and durability." },
  { n: "04", t: "Household Furniture", d: "Beds, sofas, dining sets and storage units — flat-pack and assembled options for rural delivery." },
  { n: "05", t: "Electricals", d: "Fans, lighting, switchgear and small electricals from trusted Indian and global manufacturers." },
  { n: "06", t: "Electronics", d: "Televisions, sound systems and consumer electronics curated for rural and semi-urban demand." },
  { n: "07", t: "White Goods", d: "Refrigerators, washing machines, air coolers — full-warranty, last-mile installed." },
  { n: "08", t: "Water Purifiers", d: "RO + UV + UF systems matched to local water profiles, with AMC enablement." },
  { n: "09", t: "Portable Solar", d: "Solar lanterns, home-lighting kits and portable power — built for last-mile rural India." },
  { n: "10", t: "Mobiles & Accessories", d: "Feature phones, smartphones, chargers and accessories — bundled with rural-friendly EMI." },
  { n: "11", t: "Health & Hygiene", d: "Sanitary pads, personal hygiene and wellness essentials — dignity at affordable price points." },
];

const UPCOMING = [
  ["01", "Copper Utensils", "Health & wellness range — bottles, cookware, serveware."],
  ["02", "Stainless Steel Kitchenware", "Premium SS cookware and storage."],
  ["03", "E-bikes & E-loaders", "Rural mobility and last-mile EV solutions."],
  ["04", "Solar Solutions (Expanded)", "Rooftop, agri-pumps, micro-grids."],
  ["05", "FMCG", "Pulses, grains, spices and masalas."],
  ["06", "Education Tools", "Classes 6–12 (CBSE / ICSE / State Board) + engineering learning kits."],
];

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Products & Services"
        title={<>Eleven categories. One <em className="text-emerald-deep">accountable</em> catalogue.</>}
        lede="From everyday essentials to timeless treasures — every SKU is curated with rural relevance, brand assurance and structured affordability in mind."
      />

      {/* Editorial category list */}
      <section className="container-edge border-t border-line">
        {CATEGORIES.map((c, i) => (
          <article
            key={c.n}
            data-reveal="rise-soft"
            style={{ animationDelay: `${(i % 4) * 60}ms` }}
            className="grid lg:grid-cols-[6rem_1fr_2fr_auto] items-baseline gap-6 py-10 border-b border-line group"
          >
            <span className="font-display text-4xl text-gold">{c.n}</span>
            <h3 className="font-display text-3xl md:text-4xl text-ink group-hover:text-emerald-deep transition-colors">{c.t}</h3>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">{c.d}</p>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-deep group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
          </article>
        ))}
      </section>

      {/* Upcoming */}
      <section className="bg-emerald-deep text-paper">
        <div className="container-edge section-y">
          <p className="eyebrow text-gold mb-6" data-reveal="rise-soft">Upcoming additions</p>
          <h2 data-reveal="rise" className="font-display text-5xl md:text-7xl leading-[0.98] max-w-4xl mb-20">
            Expanding portfolio. <em className="text-gold">Enriching lives.</em>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-paper/10">
            {UPCOMING.map(([n, t, d]) => (
              <div key={n} data-reveal="rise" className="bg-emerald-deep p-8 md:p-10 min-h-[16rem]">
                <p className="font-display text-3xl text-gold mb-6">{n}</p>
                <h3 className="font-display text-2xl mb-3">{t}</h3>
                <p className="text-sm text-paper/75 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-edge section-y">
        <h2 className="font-display text-5xl md:text-7xl max-w-4xl leading-[1.02]" data-reveal="rise">
          Need the full SKU list? <em className="text-emerald-deep">Ask us.</em>
        </h2>
        <div className="mt-10 flex gap-3 flex-wrap">
          <Link to="/contact" className="btn-primary">Request catalogue <ArrowUpRight className="h-4 w-4" /></Link>
          <Link to="/gold-emi" className="btn-ghost">See gold financing</Link>
        </div>
      </section>
    </PageShell>
  );
}
