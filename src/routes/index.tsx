import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Marquee } from "@/components/Marquee";
import { Counter } from "@/components/Counter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "2+FAPL — From everyday essentials to timeless treasures" },
      {
        name: "description",
        content:
          "2 Plus Fortune Alliances Pvt Ltd: a Hyderabad-headquartered aggregator bridging premium brands and India's rural markets through trust, reach and reliability.",
      },
      { property: "og:title", content: "2+FAPL — Onwards & Upwards" },
      {
        property: "og:description",
        content: "Bridging premium brands and rural India through reach, reliability and trust.",
      },
    ],
  }),
  component: Home,
});

const BRANDS = [
  "Sugmya Finance", "Vedika Credit Capital", "HESA", "South India Finvest",
  "Navachethana MFI", "Maximal Finance", "Navodit Foundation", "Investment Trust of India",
  "Aarthsiddhi", "PJ Aruvi Finance", "Sangamam Foundation", "Utthejana",
  "Pavagada Souharda", "Suyoga Co-op", "Chhaya Foundation", "Gnanashale",
  "Anandam Finance", "Jeevan Abhivriddhi",
];

function Home() {
  return (
    <PageShell>
      {/* ───── HERO ───── */}
      <section className="relative">
        <div className="container-edge pt-16 md:pt-28 pb-20 md:pb-32">
          <div className="flex items-center gap-3 mb-10" data-reveal="rise-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <p className="eyebrow text-emerald-deep">Est. 30 June 2022 · Hyderabad</p>
          </div>

          <h1
            data-reveal="rise"
            className="font-display text-[15vw] md:text-[11vw] xl:text-[10.5rem] leading-[0.88] tracking-tight text-ink"
          >
            From everyday<br />
            essentials to<br />
            <em className="text-emerald-deep">timeless</em> treasures<span className="text-gold">.</span>
          </h1>

          <div className="mt-16 grid lg:grid-cols-[1fr_auto] gap-10 items-end">
            <p
              data-reveal="rise-soft"
              style={{ animationDelay: "200ms" }}
              className="max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              2 Plus Fortune Alliances is a distribution house built on the philosophy of mutual growth —
              bridging premium brands with India's underserved rural markets through reach, reliability and trust.
            </p>
            <div className="flex flex-wrap gap-3" data-reveal="rise-soft" style={{ animationDelay: "320ms" }}>
              <Link to="/business-model" className="btn-primary">
                Our business model <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Become a partner <ArrowDownRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Hero strip */}
        <div className="border-y border-line bg-stone">
          <div className="container-edge py-5 flex items-center gap-8 text-xs text-muted-foreground overflow-x-auto">
            <span className="eyebrow text-ink shrink-0">Trusted across</span>
            <span className="shrink-0">Telangana</span>
            <span className="shrink-0">· Andhra Pradesh</span>
            <span className="shrink-0">· Karnataka</span>
            <span className="shrink-0">· Tamil Nadu</span>
            <span className="shrink-0">· Maharashtra</span>
            <span className="shrink-0">· Madhya Pradesh</span>
            <span className="shrink-0">· Rajasthan</span>
            <span className="shrink-0">· Odisha</span>
            <span className="shrink-0">· Jharkhand</span>
            <span className="shrink-0">· Bihar</span>
            <span className="shrink-0">· Assam</span>
            <span className="shrink-0">· Haryana</span>
          </div>
        </div>
      </section>

      {/* ───── MANIFESTO ───── */}
      <section className="container-edge section-y">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-24">
          <div data-reveal="rise-soft">
            <p className="eyebrow mb-6">01 — Manifesto</p>
            <span className="gold-rule" />
          </div>
          <div>
            <p
              data-reveal="rise"
              className="font-display text-4xl md:text-6xl xl:text-7xl text-ink leading-[1.02] tracking-tight"
            >
              We don't move products.<br />
              We move <em className="text-emerald-deep">opportunity</em> — from urban
              manufacturers to the doorsteps of <span className="text-gold">600 million</span> rural Indians.
            </p>
            <div className="mt-12 grid sm:grid-cols-2 gap-10 max-w-3xl">
              <p data-reveal="rise-soft" className="text-base text-muted-foreground leading-relaxed">
                Built on the philosophy of mutual growth and shared success, our aggregator model
                fosters beneficial partnerships that drive value for every stakeholder — manufacturer,
                financier, partner, and end consumer.
              </p>
              <p data-reveal="rise-soft" style={{ animationDelay: "120ms" }} className="text-base text-muted-foreground leading-relaxed">
                We curate categories spanning kitchenware, home appliances, electronics, furniture,
                white goods, water purifiers, portable solar, mobiles, and health & hygiene —
                delivered through a single, accountable supply chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS — editorial ───── */}
      <section className="bg-ink text-paper">
        <div className="container-edge section-y">
          <div className="grid lg:grid-cols-[auto_1fr] gap-10 items-end mb-20">
            <p className="eyebrow text-gold">02 — Trajectory</p>
            <p className="lg:max-w-md text-paper/70 text-base">
              Eight years of consistent growth, projected through FY 2029-30.
              All values represent revenue including GST, INR Crores.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-px bg-paper/10">
            {[
              { label: "FY 2024-25", value: 5.31, suffix: " Cr", note: "Established foundation" },
              { label: "FY 2026-27", value: 20.66, suffix: " Cr", note: "Scaling network" },
              { label: "FY 2028-29", value: 80, suffix: " Cr", note: "Multi-state expansion" },
              { label: "FY 2029-30", value: 110, suffix: " Cr", note: "Projected revenue" },
            ].map((s, i) => (
              <div
                key={s.label}
                data-reveal="rise"
                style={{ animationDelay: `${i * 100}ms` }}
                className="bg-ink p-8 md:p-10 flex flex-col gap-5 min-h-[18rem]"
              >
                <p className="eyebrow text-gold/70">{s.label}</p>
                <p className="font-display text-6xl md:text-7xl leading-none">
                  <span className="text-paper/40">₹</span>
                  <Counter to={s.value} suffix={s.suffix} decimals={s.value < 10 ? 2 : 0} />
                </p>
                <p className="text-sm text-paper/60 mt-auto">{s.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="font-display text-3xl md:text-4xl max-w-2xl text-paper leading-tight">
              <em className="text-gold">100,000+</em> rural households impacted to date.
            </p>
            <Link to="/about" className="text-paper/80 hover:text-gold transition-colors inline-flex items-center gap-2 text-sm">
              Read the full story <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOUR PILLARS ───── */}
      <section className="container-edge section-y">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24 mb-16">
          <div>
            <p className="eyebrow mb-6" data-reveal="rise-soft">03 — What makes us unique</p>
            <h2
              data-reveal="rise"
              className="font-display text-5xl md:text-6xl xl:text-7xl leading-[0.98] text-ink"
            >
              Four pillars.<br />One promise.
            </h2>
          </div>
          <p data-reveal="rise-soft" className="text-lg text-muted-foreground max-w-xl lg:mt-12 leading-relaxed">
            A wide product range, affordability without compromise, an accountable supply chain
            and decades of industry expertise — woven into every distribution we undertake.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-line">
          {[
            { n: "01", t: "Comprehensive Product Range", d: "From kitchenware and appliances to electronics, solar and health — under one accountable network." },
            { n: "02", t: "Affordability with Quality", d: "Curated SKUs and structured pricing models that respect both partner margins and consumer wallets." },
            { n: "03", t: "Efficient Supply Chain", d: "State warehouses, branch-level last-mile and penalty-backed SLAs ensure timely, intact delivery." },
            { n: "04", t: "Expertise-Driven", d: "25+ years of consumer-finance, MFI and channel-sales know-how — translated into partner strategy." },
          ].map((p, i) => (
            <div
              key={p.n}
              data-reveal="rise"
              style={{ animationDelay: `${i * 80}ms` }}
              className="bg-paper p-10 md:p-14 group hover:bg-stone transition-colors duration-500"
            >
              <div className="flex items-baseline justify-between mb-10">
                <span className="font-display text-5xl text-emerald-deep">{p.n}</span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-deep group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500" />
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-ink mb-4 leading-tight">{p.t}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── SUPPLY FLOW — storytelling ───── */}
      <section className="bg-stone">
        <div className="container-edge section-y">
          <div className="max-w-3xl mb-20">
            <p className="eyebrow mb-6" data-reveal="rise-soft">04 — How it moves</p>
            <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl text-ink leading-[1.02]">
              Eight steps. Anywhere in India. <em className="text-emerald-deep">Always accountable.</em>
            </h2>
          </div>

          <ol className="grid lg:grid-cols-2 gap-x-16 gap-y-10">
            {[
              ["NBFC partner indent", "A verified financing partner raises a structured indent."],
              ["2+FAPL aggregation", "Indents consolidated, optimised, routed."],
              ["Manufacturer dispatch", "Direct from OEM to nearest state warehouse."],
              ["State warehousing", "Quality checked, batched, packed for last-mile."],
              ["Branch hand-off", "Delivered to NBFC partner branches — anywhere in India."],
              ["On-ground verification", "Damage / defect screening at branch."],
              ["Confirmation of delivery", "Final-mile digital sign-off."],
              ["Settlement", "RFF release. Payment closed."],
            ].map(([t, d], i) => (
              <li
                key={t}
                data-reveal="rise-soft"
                style={{ animationDelay: `${i * 70}ms` }}
                className="flex gap-6 border-t border-line pt-6"
              >
                <span className="font-display text-3xl text-gold w-10 shrink-0">0{i + 1}</span>
                <div>
                  <h4 className="font-display text-2xl text-ink mb-1">{t}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── PARTNERS MARQUEE ───── */}
      <section className="section-y">
        <div className="container-edge mb-12">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="eyebrow mb-6" data-reveal="rise-soft">05 — Trusted alliances</p>
              <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl text-ink leading-[1.02] max-w-2xl">
                Eighteen partners.<br />One distribution fabric.
              </h2>
            </div>
            <Link to="/brands" className="link-underline text-sm">See all brands & partners</Link>
          </div>
        </div>
        <Marquee>
          {BRANDS.map((b) => (
            <span key={b} className="font-display text-3xl md:text-4xl text-ink/70 hover:text-ink transition-colors">
              {b} <span className="text-gold mx-2">·</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* ───── FOUNDER ───── */}
      <section className="bg-emerald-deep text-paper">
        <div className="container-edge section-y grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24 items-end">
          <div>
            <p className="eyebrow text-gold mb-6">06 — Leadership</p>
            <div className="aspect-[3/4] w-full max-w-xs bg-paper/10 border border-paper/15 rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-display text-[14rem] leading-none text-paper/15">SP</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6">
                <p className="font-display text-2xl">Srikanth Pagolu</p>
                <p className="text-paper/70 text-xs tracking-wide uppercase">Founder & Director</p>
              </div>
            </div>
          </div>
          <div>
            <p className="font-display text-3xl md:text-5xl leading-[1.1] text-paper">
              "We're not just distributing products — we're building <em className="text-gold">sustainable
              market ecosystems</em> for rural India."
            </p>
            <div className="mt-12 grid sm:grid-cols-3 gap-6 text-sm text-paper/70">
              <div>
                <p className="font-display text-3xl text-paper">25+</p>
                <p>Years across banking, MFI, broking & distribution</p>
              </div>
              <div>
                <p className="font-display text-3xl text-paper">3</p>
                <p>Companies founded · MBA — finance & consumer products</p>
              </div>
              <div>
                <p className="font-display text-3xl text-paper">100K+</p>
                <p>Households impacted under his leadership</p>
              </div>
            </div>
            <Link to="/leadership" className="mt-12 inline-flex items-center gap-2 text-gold hover:text-paper transition-colors">
              Meet the full leadership team <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── CLOSING CTA ───── */}
      <section className="container-edge section-y">
        <div className="max-w-5xl">
          <p className="eyebrow mb-8" data-reveal="rise-soft">07 — Begin</p>
          <h2
            data-reveal="rise"
            className="font-display text-[10vw] md:text-[6.5vw] xl:text-[7rem] leading-[0.95] text-ink"
          >
            Let's build the next<br /> chapter <em className="text-emerald-deep">together.</em>
          </h2>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary">Partner with us <ArrowUpRight className="h-4 w-4" /></Link>
            <Link to="/products" className="btn-ghost">Browse the catalogue</Link>
            <Link to="/portal/customer" className="btn-gold">Customer portal <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
