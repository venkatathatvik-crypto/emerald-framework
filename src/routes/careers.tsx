import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Build with 2+FAPL" },
      { name: "description", content: "Help us build sustainable market ecosystems for rural India. Open roles across distribution, operations, technology and finance." },
      { property: "og:title", content: "Careers — 2+FAPL" },
      { property: "og:description", content: "Onwards & upwards — together." },
    ],
  }),
  component: Page,
});

const ROLES = [
  { team: "Distribution", title: "Regional Distribution Manager", location: "Hyderabad / Bengaluru", type: "Full-time" },
  { team: "Operations", title: "State Warehouse Lead", location: "Chennai", type: "Full-time" },
  { team: "Operations", title: "Last-Mile Coordinator", location: "Jaipur", type: "Full-time" },
  { team: "Technology", title: "Product Engineer (Partner Portal)", location: "Hyderabad / Remote", type: "Full-time" },
  { team: "Technology", title: "Senior Frontend Engineer", location: "Remote — India", type: "Full-time" },
  { team: "Finance", title: "Credit Risk Analyst — Gold EMI", location: "Hyderabad", type: "Full-time" },
  { team: "Partnerships", title: "MFI / NBFC Alliance Manager", location: "Mumbai", type: "Full-time" },
  { team: "People", title: "Branch Trainer (Rural)", location: "Multi-state", type: "Contract" },
];

const VALUES = [
  ["Onwards", "We optimise for compounding, not heroics. Small wins, daily."],
  ["Upwards", "We level up — partners, customers, colleagues. Every quarter."],
  ["Together", "We do nothing alone. Mutual growth is the operating system."],
];

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Careers"
        title={<>Build the bridge. <em className="text-emerald-deep">Onwards & upwards.</em></>}
        lede="We're hiring operators, engineers, alliance managers and field leaders who want to put consumer goods within reach of the next 600 million Indians."
      />

      {/* Values */}
      <section className="container-edge border-t border-line section-y">
        <p className="eyebrow mb-6" data-reveal="rise-soft">How we work</p>
        <div className="grid lg:grid-cols-3 gap-10">
          {VALUES.map(([t, d], i) => (
            <div key={t} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="border-t border-line pt-6">
              <p className="font-display text-4xl text-emerald-deep mb-4">{t}</p>
              <p className="text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-stone">
        <div className="container-edge section-y">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl leading-[1.02]">
              Open roles
            </h2>
            <p className="text-sm text-muted-foreground" data-reveal="rise-soft">{ROLES.length} positions · India</p>
          </div>
          <ul>
            {ROLES.map((r, i) => (
              <li
                key={r.title}
                data-reveal="rise-soft"
                style={{ animationDelay: `${i * 40}ms` }}
                className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[7rem_minmax(0,1fr)_1fr_8rem_auto] items-center gap-4 py-6 border-t border-line group cursor-pointer hover:bg-paper transition-colors px-4 -mx-4 rounded-sm"
              >
                <span className="hidden md:inline eyebrow">{r.team}</span>
                <h3 className="font-display text-xl md:text-2xl text-ink group-hover:text-emerald-deep transition-colors truncate">{r.title}</h3>
                <span className="hidden md:inline text-sm text-muted-foreground">{r.location}</span>
                <span className="hidden md:inline text-xs px-3 py-1 rounded-full border border-line w-fit">{r.type}</span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-deep group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-edge section-y">
        <h2 className="font-display text-5xl md:text-7xl max-w-3xl" data-reveal="rise">
          Don't see your role? <em className="text-emerald-deep">Write to us.</em>
        </h2>
        <div className="mt-10 flex gap-3 flex-wrap">
          <Link to="/contact" className="btn-primary">Send a note <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </PageShell>
  );
}
