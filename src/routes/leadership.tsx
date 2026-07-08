import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — 2+ Fortune Alliances" },
      { name: "description", content: "Meet the leadership of 2 Plus Fortune Alliances — driving rural distribution at the intersection of finance, technology and trust." },
      { property: "og:title", content: "Leadership — 2+ Fortune Alliances" },
      { property: "og:description", content: "Founder & Director Srikanth Pagolu and the senior management team." },
    ],
  }),
  component: Page,
});

const TEAM = [
  {
    initials: "SP",
    name: "Srikanth Pagolu",
    role: "Founder & Director",
    bio: "MBA with 25+ years across banking, insurance, broking, product distribution and MFI operations. Skilled in direct sales, corporate sales, channel sales, key account management and strategic alliances.",
    featured: true,
  },
  {
    initials: "SM",
    name: "Sharada Manisha",
    role: "Independent Director",
    bio: "Independent director bringing governance perspective and ecosystem oversight to the board.",
    photo: "/images/shradha_manisha.jpg",
  },
  {
    initials: "PA",
    name: "Prasad Andrews",
    role: "Distribution and fulfillment operations",
    bio: "Heads day-to-day distribution and fulfillment operations across state warehouses, branch coordination and supply-chain SLAs.",
    photo: "/images/prasad_andrews.png",
  },
];

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Leadership"
        title={<>The people behind <em className="text-emerald-deep">the bridge.</em></>}
        lede="2+ Fortune Alliances is led by operators who've spent decades inside banking, MFI, consumer-product distribution and channel sales — translating that experience into a partnership model built for rural India."
      />

      {/* Featured founder */}
      <section className="bg-emerald-deep text-paper overflow-hidden">
        <div className="container-edge section-y grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-24 items-center">
          <div 
            className="aspect-[3/4] w-full bg-paper/5 border border-paper/10 relative overflow-hidden rounded-3xl shadow-2xl founder-glide-in"
          >
            <img 
              src={`${import.meta.env.BASE_URL}images/srikanth_pagolu.png`} 
              alt="Srikanth Pagolu — Founder & Director" 
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 p-8 z-10">
              <p className="eyebrow text-gold">Founder & Director</p>
              <p className="font-display text-4xl mt-2">Srikanth Pagolu</p>
            </div>
          </div>
          <div>
            <p className="eyebrow text-gold mb-6" data-reveal="rise-soft">In his words</p>
            <p data-reveal="rise" className="font-display text-3xl md:text-5xl leading-[1.1]">
              "We're not just distributing products — <em className="text-gold">we're building sustainable
              market ecosystems</em> for rural India."
            </p>
            <p data-reveal="rise-soft" className="mt-8 text-paper/75 max-w-xl leading-relaxed">
              MBA with 25+ years of experience across banking, insurance, broking, product distribution and
              MFI operations. Specialises in direct, corporate and channel sales, key-account management
              and strategic alliances.
            </p>
          </div>
        </div>
      </section>

      {/* Other leaders */}
      <section className="container-edge section-y">
        <p className="eyebrow mb-6" data-reveal="rise-soft">Senior management</p>
        <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl mb-16 max-w-3xl leading-[1.02]">
          Built around <em className="text-emerald-deep">trust</em> and operational discipline.
        </h2>
        <div className="grid md:grid-cols-2 gap-px bg-line">
          {TEAM.filter((t) => !t.featured).map((m, i) => (
            <article key={m.name} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="bg-paper p-10 md:p-12 min-h-[28rem] flex flex-col justify-between">
              {/* Portrait */}
              <div className="aspect-[3/4] w-full max-w-[220px] mb-8 rounded-2xl overflow-hidden shadow-lg founder-glide-in relative">
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={`${m.name} — ${m.role}`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-deep grid place-items-center">
                    <span className="font-display text-5xl text-paper">{m.initials}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-2xl" />
              </div>
              <div>
                <p className="eyebrow mb-2">{m.role}</p>
                <h3 className="font-display text-3xl mb-3">{m.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-edge section-y border-t border-line">
        <h2 className="font-display text-5xl md:text-7xl max-w-4xl" data-reveal="rise">
          Join the team. <em className="text-emerald-deep">Build with us.</em>
        </h2>
        <div className="mt-10 flex gap-3 flex-wrap">
          <Link to="/careers" className="btn-primary">View open roles <ArrowUpRight className="h-4 w-4" /></Link>
          <Link to="/contact" className="btn-ghost">Speak with leadership</Link>
        </div>
      </section>
    </PageShell>
  );
}
