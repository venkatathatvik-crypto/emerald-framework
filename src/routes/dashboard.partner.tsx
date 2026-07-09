import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { useRequireRole } from "@/hooks/use-require-role";

export const Route = createFileRoute("/dashboard/partner")({
  head: () => ({ meta: [{ title: "Partner Dashboard — 2+ Fortune Alliances" }] }),
  component: Page,
});

const STATES = [
  { s: "Karnataka", v: 4.16 }, { s: "Tamil Nadu", v: 2.06 }, { s: "Rajasthan", v: 1.43 },
  { s: "Telangana", v: 1.07 }, { s: "Odisha", v: 0.53 }, { s: "MH", v: 0.36 }, { s: "MP", v: 0.25 },
];

const CATS = [
  { name: "Home Appliances", value: 38, fill: "oklch(0.34 0.07 160)" },
  { name: "Electronics", value: 24, fill: "oklch(0.55 0.08 160)" },
  { name: "Kitchenware", value: 16, fill: "oklch(0.74 0.12 80)" },
  { name: "White Goods", value: 12, fill: "oklch(0.86 0.07 85)" },
  { name: "Others", value: 10, fill: "oklch(0.78 0.01 160)" },
];

function Page() {
  const { ready } = useRequireRole("ROLE_ALLIANCE");
  if (!ready) return null;

  return (
    <DashboardShell role="partner" title="Sugmya Finance · Partner Overview">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active members" value="12,480" sub="↑ 8.4% MoM" />
        <StatCard label="Open indents" value="142" sub="₹1.84 Cr pipeline" />
        <StatCard label="Settled · this FY" value="₹4.21 Cr" sub="Across 42 branches" accent />
        <StatCard label="On-time delivery" value="97.3%" sub="SLA target: 95%" />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 mb-6">
        <Panel title="State-wise mindshare (FY26)" action={<span className="text-xs text-muted-foreground">INR Cr</span>}>
          <div className="h-72 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATES}>
                <XAxis dataKey="s" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 4, fontSize: 12 }} />
                <Bar dataKey="v" fill="oklch(0.34 0.07 160)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Category mix">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATS} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {CATS.map((c, i) => <Cell key={i} fill={c.fill} />)}
                </Pie>
                <Legend iconType="circle" iconSize={6} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Recent indents" action={<button className="text-xs link-underline">New indent</button>}>
          <ul className="space-y-3 text-sm">
            {[
              ["IND-4218", "Crompton Fan x 240", "₹5.16L", "Approved"],
              ["IND-4217", "Bajaj Mixer x 180", "₹6.29L", "Dispatched"],
              ["IND-4216", "Samsung TV 32\" x 60", "₹11.39L", "In review"],
              ["IND-4215", "Eureka RO x 90", "₹10.08L", "Delivered"],
            ].map(([id, p, a, s]) => (
              <li key={id} className="grid grid-cols-[6rem_1fr_auto_auto] gap-3 items-center py-2 border-b border-line last:border-0">
                <span className="text-xs text-muted-foreground">{id}</span>
                <span>{p}</span>
                <span className="font-display">{a}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-stone">{s}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Activity timeline">
          <ol className="relative pl-4 space-y-5">
            {[
              ["09:14", "Indent IND-4218 approved by Operations"],
              ["08:42", "12 deliveries marked complete in Mysuru branch"],
              ["Yesterday", "Monthly settlement of ₹38.4L processed"],
              ["2 days ago", "New branch onboarded · Tumkur"],
            ].map(([t, d], i) => (
              <li key={i} className="relative">
                <span className="absolute -left-4 top-1.5 h-2 w-2 rounded-full bg-emerald-deep" />
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
