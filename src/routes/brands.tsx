import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands & Partners — 2+FAPL" },
      { name: "description", content: "Our network of manufacturing brands and financial partners — eighteen strategic alliances across India." },
      { property: "og:title", content: "Brands & Partners — 2+FAPL" },
      { property: "og:description", content: "Eighteen strategic alliances. One distribution fabric." },
    ],
  }),
  component: Page,
});

const PARTNERS = [
  "Sugmya Finance MFI", "Vedika Credit Capital", "HESA Consumer Products",
  "South India Finvest", "Navachethana MFI", "Maximal Finance & Investments",
  "Navodit Foundation", "Investment Trust of India", "Aarthsiddhi Services",
  "PJ Aruvi Finance", "Sangamam Foundation", "Utthejana Trading & Services",
  "Pavagada Souharda Co-op", "Suyoga Co-op Society", "Chhaya Foundation",
  "Gnanashale Co-op Society", "Anandam Finance", "Jeevan Abhivriddhi Benefit Nidhi",
];

const BRAND_CATEGORIES = [
  { eyebrow: "Home & Kitchen", title: "Partnering for quality. Delivering trust.", tags: ["Trusted Partners", "Quality Assured", "Stronger Together"] },
  { eyebrow: "Electronics & Appliances", title: "Innovation. Trust. Excellence.", tags: ["Innovative Solutions", "Reliable Performance", "Brands You Can Trust"] },
  { eyebrow: "Lifestyle, Mobility & Other", title: "One network. Many possibilities.", tags: ["Wide Range", "Endless Possibilities", "Sustainable Future"] },
];

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Brands & Partners"
        title={<>Eighteen alliances. <em className="text-emerald-deep">One fabric.</em></>}
        lede="Manufacturers, MFIs, NBFCs, cooperatives and foundations — woven into a single distribution network that reaches further, faster, and more accountably than any single channel could alone."
      />

      {/* Brand categories */}
      <section className="container-edge border-t border-line">
        {BRAND_CATEGORIES.map((c, i) => (
          <article key={c.eyebrow} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="grid lg:grid-cols-[1fr_2fr] gap-10 py-16 border-b border-line">
            <div>
              <p className="eyebrow mb-4">{c.eyebrow}</p>
              <h3 className="font-display text-3xl md:text-4xl leading-[1.05]">{c.title}</h3>
            </div>
            <div className="flex flex-wrap gap-3 self-end">
              {c.tags.map((t) => (
                <span key={t} className="px-5 py-2.5 rounded-full border border-line bg-stone text-sm">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Financial partners grid */}
      <section className="bg-ink text-paper">
        <div className="container-edge section-y">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 mb-16">
            <p className="eyebrow text-gold" data-reveal="rise-soft">Financial partners</p>
            <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl leading-[1.02]">
              The institutions that <em className="text-gold">deliver the last mile.</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-paper/10">
            {PARTNERS.map((p, i) => (
              <div key={p} data-reveal="rise-soft" style={{ animationDelay: `${i * 30}ms` }} className="bg-ink p-8 min-h-[10rem] flex flex-col justify-between">
                <span className="text-gold/70 text-xs">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-display text-2xl leading-tight">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edge section-y">
        <h2 className="font-display text-5xl md:text-7xl max-w-4xl" data-reveal="rise">
          Want to join the fabric? <em className="text-emerald-deep">Let's talk.</em>
        </h2>
        <div className="mt-10 flex gap-3 flex-wrap">
          <Link to="/contact" className="btn-primary">Become a partner <ArrowUpRight className="h-4 w-4" /></Link>
          <Link to="/register/partner" className="btn-ghost">Register partner</Link>
        </div>
      </section>
    </PageShell>
  );
}
