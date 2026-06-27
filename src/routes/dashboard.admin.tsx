import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — 2+FAPL" }] }),
  component: Page,
});

const YOY = [
  { y: "FY23", r: 0.17 }, { y: "FY24", r: 5.30 }, { y: "FY25", r: 5.31 },
  { y: "FY26", r: 5.25 }, { y: "FY27", r: 20.66 }, { y: "FY28", r: 50 },
  { y: "FY29", r: 80 }, { y: "FY30", r: 110 },
];

const BRANDS = [
  { b: "Bajaj", v: 18.4 }, { b: "Crompton", v: 14.1 }, { b: "Samsung", v: 12.8 },
  { b: "Eureka", v: 9.7 }, { b: "Havells", v: 8.2 }, { b: "Philips", v: 6.5 },
];

function Page() {
  return (
    <DashboardShell role="admin" title="Company Overview · FY 2026-27">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Revenue · YTD" value="₹14.2 Cr" sub="68% of FY27 target" />
        <StatCard label="Active partners" value="18" sub="2 in onboarding" />
        <StatCard label="Branches live" value="312" sub="Across 12 states" />
        <StatCard label="Households impacted" value="100K+" sub="Cumulative since 2022" accent />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 mb-6">
        <Panel title="Revenue trajectory · FY23 → FY30" action={<span className="text-xs text-muted-foreground">INR Cr · including GST</span>}>
          <div className="h-72 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={YOY}>
                <XAxis dataKey="y" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} width={36} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 4, fontSize: 12 }} />
                <Line type="monotone" dataKey="r" stroke="oklch(0.34 0.07 160)" strokeWidth={2.5} dot={{ fill: "oklch(0.74 0.12 80)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top brands · mindshare %">
          <div className="h-72 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BRANDS} layout="vertical">
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis dataKey="b" type="category" tickLine={false} axisLine={false} fontSize={11} width={70} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 4, fontSize: 12 }} />
                <Bar dataKey="v" fill="oklch(0.74 0.12 80)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Partner health" action={<button className="text-xs link-underline">View all</button>}>
          <ul className="space-y-3 text-sm">
            {[
              ["Sugmya Finance", "MFI", "4.21 Cr", 97],
              ["Vedika Credit Capital", "NBFC", "3.18 Cr", 94],
              ["HESA", "Aggregator", "2.78 Cr", 99],
              ["South India Finvest", "NBFC", "1.42 Cr", 91],
              ["Navachethana MFI", "MFI", "1.06 Cr", 95],
            ].map(([n, t, r, h]) => (
              <li key={n as string} className="grid grid-cols-[1.4fr_auto_auto_5rem] items-center gap-3 py-2 border-b border-line last:border-0">
                <div>
                  <p className="font-medium">{n}</p>
                  <p className="text-xs text-muted-foreground">{t}</p>
                </div>
                <span className="font-display text-emerald-deep">₹{r}</span>
                <span className="text-xs text-muted-foreground">SLA</span>
                <div className="h-1.5 bg-stone rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-deep" style={{ width: `${h}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="System feed">
          <ol className="relative pl-4 space-y-5">
            {[
              ["Now", "PJ Aruvi Finance — onboarding step 3 of 4"],
              ["09:14", "Indent IND-4218 approved · ₹5.16L · Sugmya"],
              ["08:42", "Branch onboarded · Tumkur · Vedika"],
              ["Yesterday", "Monthly partner settlement · ₹38.4L cleared"],
              ["2 days ago", "Catalogue update · 14 new SKUs (Copper)"],
            ].map(([t, d], i) => (
              <li key={i} className="relative">
                <span className="absolute -left-4 top-1.5 h-2 w-2 rounded-full bg-gold" />
                <p className="text-xs text-muted-foreground">{t}</p>
                <p className="text-sm">{d}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </DashboardShell>
  );
}
