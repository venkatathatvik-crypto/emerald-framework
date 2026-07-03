import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Package, Zap, ShieldCheck, Globe, Linkedin, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Marquee } from "@/components/Marquee";
import { Counter } from "@/components/Counter";
import { HeroBanner } from "@/components/HeroBanner";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "2+FAPL — From Everyday Essentials to Timeless Treasures" },
      {
        name: "description",
        content:
          "2 Plus Fortune Alliances Pvt Ltd: a Hyderabad-headquartered aggregator bridging premium brands and India's rural markets through trust, reach and reliability.",
      },
    ],
  }),
  component: Home,
});

// ── Data ──────────────────────────────────────────────────────────────────────

const PARTNER_BRANDS = [
  "Sugmya Finance", "Vedika Credit Capital", "HESA", "South India Finvest",
  "Navachethana MFI", "Maximal Finance", "Navodit Foundation", "Investment Trust of India",
  "Aarthsiddhi", "PJ Aruvi Finance", "Sangamam Foundation", "Utthejana",
  "Pavagada Souharda", "Suyoga Co-op", "Chhaya Foundation", "Gnanashale",
  "Anandam Finance", "Jeevan Abhivriddhi",
];

const CATEGORIES = [
  "Kitchenware", "Home Appliances", "Home Furnishing", "Household Furniture",
  "Electricals", "Electronics", "White Goods", "Water Purifiers",
  "Portable Solar", "Mobiles & Accessories", "Health & Hygiene", "FMCG / Commodities",
];

const PILLARS = [
  {
    icon: <Package className="h-6 w-6" />,
    num: "01",
    title: "11 Consumer Categories",
    body: "From kitchenware to portable solar — every SKU curated for quality, affordability and rural relevance.",
    link: "/products",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    num: "02",
    title: "Zero-Cost EMI",
    body: "No interest, no processing fee, no insurance cost. Consumer finance that genuinely serves the customer.",
    link: "/hassle-free-emi",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    num: "03",
    title: "ISI-Backed Quality",
    body: "ISI-marked products only. Penalty-backed SLAs on every delivery. Accountable at every step.",
    link: "/business-model",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    num: "04",
    title: "20+ States, 18 Partners",
    body: "A growing network of NBFC and MFI alliances spanning 20+ states and 1,00,000+ households.",
    link: "/brands",
  },
];

const LEADERSHIP = [
  {
    initials: "SP",
    color: "bg-emerald-deep",
    name: "Srikanth Pagolu",
    title: "Founder & Director",
    note: "25+ years · Banking, MFI, Distribution",
  },
  {
    initials: "SM",
    color: "bg-gold",
    name: "Sharada Manisha",
    title: "Independent Director",
    note: "MFI regulatory expertise",
  },
  {
    initials: "PA",
    color: "bg-stone-2",
    name: "Prasad Andrews",
    title: "Head of Operations",
    note: "End-to-end supply chain",
  },
];

const SOCIAL_LINKS = [
  { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com/company/2fapl", label: "LinkedIn" },
  { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com/2fapl", label: "Twitter" },
  { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com/2fapl", label: "Facebook" },
  { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com/2fapl", label: "Instagram" },
];

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Business Model", href: "/business-model" },
  { label: "Our Brands", href: "/brands" },
  { label: "Leadership", href: "/leadership" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
];

const COMPANY_INFO = {
  name: "2 Plus Fortune Alliances Pvt Ltd",
  address: "504, 5th Floor, Nami Shree Infratech, T19 Towers, MG Road, Hyderabad — 500003",
  phone: "+91 9966 16 1616",
  email: "partnerships@2fapl.com",
  cin: "U74900TG2022PTC123456",
};

// ── Page ──────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <PageShell>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 01 · HERO                                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-white overflow-hidden flex flex-col">

        {/* Background depth */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, oklch(0.86 0.07 85 / 0.12) 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, oklch(0.55 0.08 160 / 0.07) 0%, transparent 70%)" }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroGridBg" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="oklch(0.34 0.07 160)" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroGridBg)"/>
          </svg>
        </div>

        {/* Floating gold particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[
            { l:"8%",t:"20%",d:"0s",dur:"7s" },
            { l:"15%",t:"70%",d:"1.2s",dur:"9s" },
            { l:"72%",t:"12%",d:"2.1s",dur:"6s" },
            { l:"85%",t:"55%",d:"0.6s",dur:"8s" },
            { l:"50%",t:"80%",d:"3s",dur:"10s" },
            { l:"32%",t:"40%",d:"1.8s",dur:"7s" },
            { l:"91%",t:"30%",d:"0.3s",dur:"9s" },
          ].map((p, i) => (
            <div key={i} className="hero-particle" style={{ left: p.l, top: p.t, animationDelay: p.d, animationDuration: p.dur }} />
          ))}
        </div>

        {/* Two-column layout */}
        <div className="container-edge flex-1 flex items-center">
          <div className="w-full grid lg:grid-cols-[1fr_1fr] gap-12 xl:gap-20 items-center pt-28 pb-16 md:pt-32 md:pb-20">

            {/* Left: Content */}
            <div className="flex flex-col order-2 lg:order-1">

              {/* Tagline pill */}
              <div className="hero-enter" style={{ animationDelay: "100ms" }}>
                <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-line bg-stone/60 backdrop-blur-sm mb-8 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold hero-dot-pulse shrink-0" />
                  <span className="text-xs font-medium tracking-[0.18em] uppercase text-gold">
                    From Everyday Essentials to Timeless Treasures
                  </span>
                </span>
              </div>

              {/* Word-by-word headline */}
              <h1 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.0] tracking-tight text-ink mb-7">
                {["Bridging", "Premium", "Brands", "with", "Rural", "India."].map((word, i) => (
                  <span key={word} className="hero-word-wrap">
                    <span className="hero-word" style={{ animationDelay: `${200 + i * 80}ms` }}>
                      {word === "India." ? (
                        <>{word.slice(0, -1)}<em className="text-emerald-deep not-italic">.</em></>
                      ) : i === 1 || i === 2 ? (
                        <em className="text-emerald-deep not-italic">{word}</em>
                      ) : word}{" "}
                    </span>
                  </span>
                ))}
              </h1>

              {/* Paragraph */}
              <p className="hero-enter text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mb-10"
                style={{ animationDelay: "700ms" }}>
                2+FAPL connects 18 NBFC & MFI partners, 30+ premium brands, and 1,00,000+ households across 20+ Indian states — on structured EMI with zero interest, zero processing fee, and zero insurance cost.
              </p>

              {/* CTAs */}
              <div className="hero-enter flex flex-wrap gap-3 mb-12" style={{ animationDelay: "900ms" }}>
                <div className="magnetic-wrap">
                  <Link to="/business-model" className="btn-primary btn-premium-lift magnetic-btn shadow-sm shadow-emerald-deep/20" aria-label="Learn how our business model works">
                    How It Works <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="magnetic-wrap">
                  <Link to="/contact" className="btn-ghost btn-premium-lift magnetic-btn" aria-label="Become a 2+FAPL partner">
                    Become a Partner <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Animated stats */}
              <div className="hero-enter grid grid-cols-2 sm:grid-cols-4 gap-5 border-t border-line pt-8"
                style={{ animationDelay: "1100ms" }}>
                {[
                  { value: 4,   suffix: "",   label: "Years" },
                  { value: 30,  suffix: "+",  label: "Brands" },
                  { value: 18,  suffix: "",   label: "Partners" },
                  { value: 100, suffix: "K+", label: "Households" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="font-display text-3xl md:text-4xl text-ink leading-none">
                      <Counter to={s.value} duration={2000} />{s.suffix}
                    </span>
                    <span className="eyebrow text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative order-1 lg:order-2 flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 50%, oklch(0.74 0.12 80 / 0.12) 0%, oklch(0.55 0.08 160 / 0.08) 40%, transparent 70%)", filter: "blur(32px)", transform: "scale(1.15)" }} />

              <div className="hero-image-wrap relative w-full max-w-xl aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-ink/10 border border-white/80 mouse-parallax" data-parallax-factor="0.015">
                <img
                  src="/images/hero_bridge.png"
                  alt="2+FAPL distribution network bridging premium brands to rural India"
                  className="hero-ken-burns w-full h-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                
                {/* Floating stat card */}
                <div className="absolute bottom-6 left-6 right-6 hero-float-card" style={{ animationDelay: "1.5s" }}>
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/60 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-deep flex items-center justify-center shrink-0">
                      <TrendingUp className="h-5 w-5 text-paper" />
                    </div>
                    <div>
                      <p className="font-display text-xl text-ink leading-none mb-0.5">₹110 Cr</p>
                      <p className="text-xs text-muted-foreground">FY 2029-30 Revenue Target</p>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-0.5">
                      <span className="text-xs font-semibold text-emerald-deep">↑ 65% CAGR</span>
                      <span className="text-[10px] text-muted-foreground">8-year trajectory</span>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute top-5 right-5 hero-float-badge" style={{ animationDelay: "0.8s" }}>
                  <div className="bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 shadow border border-white/60 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-xs font-medium text-ink">20+ States</span>
                  </div>
                </div>
              </div>

              {/* Decorative rings */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border border-gold/20 hero-spin-slow pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full border border-emerald-soft/10 hero-spin-slow pointer-events-none" style={{ animationDirection: "reverse" }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 pb-8 flex flex-col items-center gap-2" aria-hidden="true">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground opacity-60">Scroll</span>
          <div className="hero-scroll-indicator"><div className="hero-scroll-dot" /></div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-line bg-stone/40 backdrop-blur-sm relative z-10">
          <div className="container-edge py-4 flex items-center gap-6 text-xs text-muted-foreground overflow-x-auto">
            <span className="eyebrow text-ink shrink-0">Trusted across</span>
            {["Telangana","Andhra Pradesh","Karnataka","Tamil Nadu","Maharashtra","Rajasthan","Odisha","Jharkhand","Bihar","Assam"].map(s => (
              <span key={s} className="shrink-0 whitespace-nowrap">· {s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 02 · THE STORY — Company Introduction                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="section-y bg-glow-gold border-t border-line">
        <div className="container-edge">
          <div className="grid lg:grid-cols-[1.1fr_1.5fr] gap-16 lg:gap-24 items-center">

            {/* Left */}
            <div>
              <p className="eyebrow mb-6" data-reveal="rise-soft">02 — Our Story</p>
              <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl xl:text-7xl text-ink leading-[0.95] mb-8">
                Built on the belief that every family deserves better.
              </h2>
              <div
                data-reveal="rise"
                className="relative rounded-2xl overflow-hidden shadow-xl border border-line aspect-[4/3] group bg-stone mb-10"
              >
                <img
                  src="/images/financial_inclusion.png"
                  alt="Rural women entrepreneur accessing digital financial services"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/20 via-transparent to-transparent pointer-events-none" />
              </div>
              <div data-reveal="rise-soft">
                <div className="magnetic-wrap">
                  <Link to="/about" className="btn-ghost btn-premium-lift magnetic-btn inline-flex">
                    Our Full Story <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: content */}
            <div className="space-y-12">
              <div data-reveal="rise-soft">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Founded 30 June 2022 in Hyderabad, 2 Plus Fortune Alliances Pvt Ltd was created with a single conviction — that rural and semi-urban Indian families should have access to premium consumer goods at fair, structured prices.
                </p>
              </div>
              <div data-reveal="rise-soft" style={{ animationDelay: "100ms" }}>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Our aggregator model bridges the gap between manufacturers and the last mile — enabling NBFC and MFI partners to offer aspirational products on structured, zero-cost EMI directly to households that traditional retail never reached.
                </p>
              </div>


              {/* Categories */}
              <div data-reveal="rise-soft" style={{ animationDelay: "200ms" }}>
                <p className="eyebrow mb-5">11 Consumer Categories</p>
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORIES.map((c) => (
                    <span key={c} className="px-4 py-2 rounded-full border border-line bg-paper text-sm hover:border-emerald-deep hover:text-emerald-deep transition-all duration-300 cursor-default">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key figures */}
              <div data-reveal="rise" style={{ animationDelay: "300ms" }} className="grid grid-cols-3 gap-6 border-t border-line pt-10">
                {[
                  { v: "₹5.31 Cr", l: "FY 2024-25 Turnover" },
                  { v: "20+", l: "States" },
                  { v: "100K+", l: "Households impacted" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-display text-3xl md:text-4xl text-emerald-deep leading-none mb-1">{s.v}</p>
                    <p className="text-xs text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 03 · THE SOLUTION — Business Model                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="bg-ink text-paper relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-deep/15 via-transparent to-gold/5 pointer-events-none" />

        <div className="container-edge section-y relative z-10">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-28 mb-20">
            <div>
              <p className="eyebrow text-gold mb-6" data-reveal="rise-soft">03 — Our Solution</p>
              <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl text-paper leading-[0.97]">
                A ₹2,000 Cr<br /><em className="text-gold">opportunity.</em><br />One network.
              </h2>
            </div>
            <div className="lg:pt-10">
              <p data-reveal="rise-soft" className="text-base text-paper/70 leading-relaxed max-w-xl mb-8">
                India's rural distribution market is fragmented, underserved, and massive. 2+FAPL solves this by aggregating premium brands and routing them through a verified NBFC partner network — making structured finance available at the last mile.
              </p>
              <div data-reveal="rise-soft" style={{ animationDelay: "100ms" }}>
                <Link to="/business-model" className="link-underline text-paper/80 hover:text-paper text-sm">
                  Explore our business model <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 3 channel cards */}
          <div className="grid md:grid-cols-3 gap-5 stagger-children" data-reveal="rise">
            {[
              {
                label: "Retail — NBFC / MFI",
                market: "₹1,200+ Cr",
                desc: "The core channel. Partner branches reach rural households through trusted, on-ground relationships and structured EMI products.",
                accent: "border-t-gold",
              },
              {
                label: "Institutional — B2B / Government",
                market: "₹400+ Cr",
                desc: "Bulk procurement for government schemes, corporate gifting, and institutional supply at volume pricing.",
                accent: "border-t-emerald-soft",
              },
              {
                label: "Digital — E-Commerce",
                market: "₹400+ Cr",
                desc: "Aggregator-to-consumer platform enabled by digital payment rails, WhatsApp Commerce, and mobile-first ordering.",
                accent: "border-t-paper/30",
              },
            ].map((ch) => (
              <div key={ch.label} className={`bg-paper/5 border border-paper/10 rounded-2xl p-8 hover:bg-paper/10 hover:border-gold/30 transition-all duration-500 border-t-2 ${ch.accent}`}>
                <p className="font-display text-3xl text-gold mb-2">{ch.market}</p>
                <h3 className="font-sans text-sm font-semibold text-paper mb-4 uppercase tracking-wider">{ch.label}</h3>
                <p className="text-sm text-paper/60 leading-relaxed">{ch.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 04 · WHY US — Four Pillars                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="section-y border-t border-line bg-gradient-subtle">
        <div className="container-edge">
          <div className="grid lg:grid-cols-[1fr_2.2fr] gap-16 lg:gap-28 mb-20">
            <div>
              <p className="eyebrow mb-6" data-reveal="rise-soft">04 — Why 2+FAPL</p>
              <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl text-ink leading-[0.97]">
                Four pillars.<br /><em className="text-emerald-deep">One promise.</em>
              </h2>
            </div>
            <p data-reveal="rise-soft" className="text-lg text-muted-foreground leading-relaxed lg:mt-14 max-w-xl">
              A wide product range, affordability without compromise, an accountable supply chain, and decades of industry expertise — woven into every distribution we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {PILLARS.map((p, i) => (
              <Link
                key={p.num}
                to={p.link}
                data-reveal="rise"
                style={{ animationDelay: `${i * 80}ms` }}
                className="card-premium p-10 md:p-14 group block"
                aria-label={`Learn more about ${p.title}`}
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl border border-line text-emerald-deep group-hover:bg-emerald-deep group-hover:text-paper group-hover:border-emerald-deep transition-all duration-500" aria-hidden="true">
                      {p.icon}
                    </div>
                    <span className="font-display text-4xl text-emerald-deep/20 group-hover:text-emerald-deep/40 transition-colors duration-500" aria-hidden="true">{p.num}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-deep group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500" aria-hidden="true" />
                </div>
                <h3 className="font-display text-3xl md:text-4xl text-ink mb-4 leading-tight group-hover:text-emerald-deep transition-colors duration-500">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm max-w-sm">{p.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 05 · TRUST — Brands + Partners marquee                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="bg-stone section-y-sm border-t border-line overflow-hidden">
        <div className="container-edge mb-12">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="eyebrow mb-5" data-reveal="rise-soft">05 — Trusted Network</p>
              <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl text-ink leading-[1.0] max-w-2xl">
                18 NBFC & MFI partners.<br /><em className="text-emerald-deep">One unified network.</em>
              </h2>
            </div>
            <Link to="/brands" className="link-underline text-sm shrink-0" data-reveal="fade">
              View all brands & partners <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Partner marquee */}
        <div className="overflow-hidden" data-reveal="fade">
          <Marquee>
            {PARTNER_BRANDS.map((b) => (
              <span key={b} className="mx-4 px-6 py-3 bg-paper rounded-xl border border-line select-none font-sans text-sm font-medium text-muted-foreground hover:text-ink hover:border-emerald-deep transition-all duration-300 shrink-0 whitespace-nowrap">
                {b}
              </span>
            ))}
          </Marquee>
        </div>

        {/* Manufacturing brand row */}
        <div className="container-edge mt-10">
          <p className="eyebrow mb-5" data-reveal="rise-soft">Associated Brands</p>
          <div data-reveal="rise-soft" className="flex flex-wrap gap-2.5">
            {["Third Wave Power (JUGNU)","Orient","Whirlpool","Haier","Crompton","Tharun Sha","United Metallik","Prestige","Pigeon","Bajaj","Luminous","Samsung","D.light","Vivo"].map((b) => (
              <span key={b} className="px-4 py-2 rounded-xl bg-paper border border-line text-sm text-ink hover:border-gold hover:text-gold-soft transition-all duration-300">
                {b}
              </span>
            ))}
            <Link to="/brands" className="px-4 py-2 rounded-xl bg-emerald-deep text-paper text-sm font-medium hover:bg-ink transition-colors duration-300 flex items-center gap-1.5">
              + Others <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 06 · LEADERSHIP + FINAL CTA                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="section-y border-t border-line bg-glow-emerald">
        <div className="container-edge">

          {/* Leadership */}
          <div className="mb-24">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-28 mb-14">
              <div>
                <p className="eyebrow mb-5" data-reveal="rise-soft">06 — Leadership</p>
                <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl text-ink leading-[0.97]">
                  Led by experience.
                </h2>
              </div>
              <p data-reveal="rise-soft" className="text-base text-muted-foreground leading-relaxed lg:mt-12 max-w-lg">
                Our team brings 25+ years of banking, MFI, and consumer-finance expertise — translating deep market knowledge into a partner-first distribution strategy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 stagger-children" data-reveal="rise">
              {LEADERSHIP.map((l) => (
                <div key={l.name} className="card-premium p-8 group">
                  <div className={`w-14 h-14 rounded-2xl ${l.color} flex items-center justify-center mb-6`}>
                    <span className="font-display text-lg text-paper">{l.initials}</span>
                  </div>
                  <h3 className="font-display text-2xl text-ink mb-1 group-hover:text-emerald-deep transition-colors duration-300">{l.name}</h3>
                  <p className="eyebrow text-emerald-deep mb-3">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center" data-reveal="fade">
              <Link to="/leadership" className="link-underline text-sm">Full leadership profiles <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-ink rounded-3xl p-12 md:p-20 relative overflow-hidden" data-reveal="rise">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-deep/20 via-transparent to-gold/10 pointer-events-none rounded-3xl" />
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />

            <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
              <div>
                <p className="eyebrow text-gold mb-6">Let's build together</p>
                <h2 className="font-display text-4xl md:text-6xl text-paper leading-[0.97] mb-6">
                  Ready to become<br />a <em className="text-gold">2+FAPL partner?</em>
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 text-sm text-paper/60">
                  <div>
                    <p className="text-paper/40 eyebrow mb-2">Headquarters</p>
                    <p>504, 5th Floor, Nami Shree Infratech,<br />T19 Towers, MG Road, Hyderabad — 500003</p>
                  </div>
                  <div>
                    <p className="text-paper/40 eyebrow mb-2">Direct</p>
                    <p>+91 9966 16 1616</p>
                    <p>+91 7306 96 9696</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <div className="magnetic-wrap">
                  <Link to="/contact" className="btn-gold btn-premium-lift magnetic-btn shadow-lg shadow-gold/20 whitespace-nowrap" aria-label="Partner with 2+FAPL">
                    Partner With Us <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="magnetic-wrap">
                  <Link to="/business-model" className="btn-ghost btn-premium-lift magnetic-btn border-paper/20 text-paper hover:bg-paper/10 whitespace-nowrap" aria-label="Learn how 2+FAPL works">
                    Learn How It Works
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 07 · FOOTER — Social, Links, Company Info                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-line bg-stone/50" role="contentinfo">
        <div className="container-edge py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="font-display text-xl text-ink mb-4">{COMPANY_INFO.name}</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-emerald-deep" />
                  <span>{COMPANY_INFO.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-emerald-deep" />
                  <a href={`tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`} className="hover:text-emerald-deep transition-colors">
                    {COMPANY_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-deep" />
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-emerald-deep transition-colors">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-4">CIN: {COMPANY_INFO.cin}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-lg text-ink mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-emerald-deep transition-colors inline-flex items-center gap-2 group">
                      {link.label}
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Categories */}
            <div>
              <h3 className="font-display text-lg text-ink mb-4">Categories</h3>
              <ul className="space-y-2">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <li key={cat}>
                    <span className="text-sm text-muted-foreground">{cat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-display text-lg text-ink mb-4">Connect With Us</h3>
              <div className="flex gap-3 mb-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-line bg-paper flex items-center justify-center text-muted-foreground hover:bg-emerald-deep hover:text-paper hover:border-emerald-deep transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:ring-offset-2"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Follow us for updates on partnerships, new brands, and rural distribution insights.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-emerald-deep transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-deep transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </PageShell>
  );
}
