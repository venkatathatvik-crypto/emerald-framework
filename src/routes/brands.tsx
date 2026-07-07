import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands & Partners — 2+ Fortune Alliances" },
      { name: "description", content: "Our network of manufacturing brands and financial partners — eighteen strategic alliances across India." },
      { property: "og:title", content: "Brands & Partners — 2+ Fortune Alliances" },
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
  { eyebrow: "Home & Kitchen", title: "Partnering for quality. Delivering trust.", tags: ["Prestige", "Pigeon", "Butterfly", "Bajaj", "Crompton", "Borosil", "United"] },
  { eyebrow: "Electronics & Appliances", title: "Innovation. Trust. Excellence.", tags: ["Samsung", "Whirlpool", "Haier", "Orient", "L.G."] },
  { eyebrow: "Renewable Energy", title: "Sustainable power. Lasting utility.", tags: ["Third Wave Power (JUGNU)", "Luminous", "D.light"] },
  { eyebrow: "Lifestyle & Mobility", title: "Connecting aspirations with everyday life.", tags: ["Tharun Sha", "United Metallik", "Vivo", "Others"] },
  { eyebrow: "FMCG / Commodities", title: "Everyday essentials. Wider reach.", tags: ["Pulses & Grains", "Spices & Masalas", "Packaged Foods", "Personal Care", "Household Care"] },
];

const MAP_CITIES = [
  { name: "Punjab", top: "25%", left: "30%" },
  { name: "Chandigarh", top: "22%", left: "38%" },
  { name: "Benares", top: "45%", left: "54%" },
  { name: "Patna", top: "44%", left: "64%" },
  { name: "Ranchi", top: "52%", left: "62%" },
  { name: "Bhubaneswar", top: "59%", left: "60%" },
  { name: "Visakhapatnam", top: "68%", left: "54%" },
  { name: "Cochin", top: "86%", left: "36%" },
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

      {/* Interactive Network Map Visual Section */}
      <section className="container-edge section-y border-t border-line" id="branches">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 xl:gap-20 items-center">
          <div 
            data-reveal="rise"
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-line bg-stone aspect-[4/3] group"
          >
            <img 
              src="/images/network_map.png" 
              alt="Pan-India Distribution Network Map" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Interactive City Labels */}
            {MAP_CITIES.map((c) => (
              <div 
                key={c.name} 
                className="absolute flex items-center gap-1.5 px-2.5 py-1 bg-emerald-deep/90 text-paper text-[10px] md:text-xs font-medium rounded-full shadow-lg border border-white/20 transition-all duration-300 hover:scale-105"
                style={{ top: c.top, left: c.left, transform: "translate(-50%, -50%)" }}
              >
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
                <span>{c.name}</span>
              </div>
            ))}
            
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/20 via-transparent to-transparent pointer-events-none" />
          </div>
          <div>
            <p className="eyebrow mb-6" data-reveal="rise-soft">Branch Network</p>
            <h2 data-reveal="rise" className="font-display text-4xl md:text-5xl text-ink leading-[1.0] mb-6">
              Empowering India's growth <em className="text-emerald-deep">across 20+ states.</em>
            </h2>
            <p data-reveal="rise-soft" className="text-muted-foreground text-sm leading-relaxed mb-8">
              Robust transport with their localized network. We connect urban manufacturing centers directly to rural distribution points, enabling credit access and delivery transparency for over 1,00,000 households.
            </p>
            <div className="grid grid-cols-2 gap-6 border-t border-line pt-8" data-reveal="rise-soft">
              <div>
                <h4 className="font-display text-3xl text-gold">100K+</h4>
                <p className="text-xs text-muted-foreground">Active Households Connected</p>
              </div>
              <div>
                <h4 className="font-display text-3xl text-emerald-deep">20+</h4>
                <p className="text-xs text-muted-foreground">States Operational Footprint</p>
              </div>
            </div>
          </div>
        </div>
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
          
          <div className="grid lg:grid-cols-[1.8fr_1fr] gap-12 xl:gap-20 items-stretch mb-16">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-paper/10">
              {PARTNERS.map((p, i) => (
                <div key={p} data-reveal="rise-soft" style={{ animationDelay: `${i * 20}ms` }} className="bg-ink p-6 min-h-[9rem] flex flex-col justify-between">
                  <span className="text-gold/70 text-xs">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-display text-xl leading-tight">{p}</p>
                </div>
              ))}
            </div>
             {/* Collaborating partners image banner */}
            <div 
              data-reveal="rise" 
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 min-h-[300px] lg:min-h-auto group"
            >
              <img 
                src="/images/partners_collaborating.png" 
                alt="Strategic financial alliance professionals collaborating around reports and products" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="eyebrow text-gold mb-2 block">Collaborative Impact</span>
                <p className="font-display text-xl leading-tight">Decades of combined experience bridging gaps.</p>
              </div>
            </div>
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
