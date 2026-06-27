import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — 2+FAPL" },
      { name: "description", content: "Meet the leadership of 2 Plus Fortune Alliances Pvt Ltd — driving rural distribution at the intersection of finance, technology and trust." },
      { property: "og:title", content: "Leadership — 2+FAPL" },
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
  },
  {
    initials: "PA",
    name: "Prasad Andrews",
    role: "Operations Head",
    bio: "Heads day-to-day distribution operations across state warehouses, branch coordination and supply-chain SLAs.",
  },
];

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Leadership"
        title={<>The people behind <em className="text-emerald-deep">the bridge.</em></>}
        lede="2+FAPL is led by operators who've spent decades inside banking, MFI, consumer-product distribution and channel sales — translating that experience into a partnership model built for rural India."
      />

      {/* Featured founder */}
      <section className="bg-emerald-deep text-paper">
        <div className="container-edge section-y grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-24 items-end">
          <div data-reveal="rise" className="aspect-[3/4] w-full bg-paper/10 border border-paper/15 relative overflow-hidden">
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-[18rem] leading-none text-paper/15">SP</span>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6">
              <p className="eyebrow text-gold">Founder & Director</p>
              <p className="font-display text-3xl mt-2">Srikanth Pagolu</p>
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
            <article key={m.name} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="bg-paper p-10 md:p-12 min-h-[24rem] flex flex-col justify-between">
              <div className="aspect-square w-24 rounded-full bg-stone grid place-items-center">
                <span className="font-display text-3xl text-emerald-deep">{m.initials}</span>
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
