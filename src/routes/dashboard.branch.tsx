import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard/branch")({
  head: () => ({ meta: [{ title: "Branch Dashboard — 2+ Fortune Alliances" }] }),
  component: Page,
});

const FLOW = [
  { d: "Mon", v: 28 }, { d: "Tue", v: 32 }, { d: "Wed", v: 41 },
  { d: "Thu", v: 38 }, { d: "Fri", v: 47 }, { d: "Sat", v: 52 }, { d: "Sun", v: 19 },
];

function Page() {
  return (
    <DashboardShell role="branch" title="Mysuru Branch · Daily Ops">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's deliveries" value="47" sub="38 on-time · 9 pending" />
        <StatCard label="Pending pickups" value="12" sub="From state warehouse" />
        <StatCard label="Active members" value="842" sub="↑ 24 this week" />
        <StatCard label="Settlement due" value="₹2.14L" sub="Friday 5pm" accent />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 mb-6">
        <Panel title="Delivery throughput · 7 days">
          <div className="h-64 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FLOW}>
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.74 0.12 80)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.74 0.12 80)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 4, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.74 0.12 80)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Today's schedule">
          <ul className="space-y-3 text-sm">
            {[
              ["09:00", "Inbound · State warehouse truck"],
              ["11:30", "Customer pickup · 6 orders"],
              ["14:00", "Doorstep delivery batch (12)"],
              ["16:30", "Member enrolment session"],
            ].map(([t, d], i) => (
              <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-3 py-2 border-b border-line last:border-0">
                <span className="font-display text-emerald-deep">{t}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Open deliveries">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-line">
            <tr><th className="py-2 font-normal">Order</th><th className="font-normal">Customer</th><th className="font-normal">Item</th><th className="font-normal">Window</th><th className="font-normal text-right">Status</th></tr>
          </thead>
          <tbody>
            {[
              ["FA-23187", "Lakshmi Devi", "Mixer Grinder", "10:00–13:00", "Out for delivery"],
              ["FA-23142", "Ravi Kumar", "RO Purifier + install", "14:00–17:00", "Scheduled"],
              ["FA-23098", "Sneha P.", "Ceiling Fan x 2", "10:00–13:00", "Scheduled"],
              ["FA-23055", "Mohan R.", "Smart TV 32\"", "Tomorrow AM", "Awaiting stock"],
            ].map(([id, c, p, w, s]) => (
              <tr key={id} className="border-b border-line last:border-0">
                <td className="py-3 text-muted-foreground">{id}</td>
                <td className="font-medium">{c}</td>
                <td>{p}</td>
                <td className="text-muted-foreground">{w}</td>
                <td className="text-right"><span className="text-xs px-2 py-1 rounded-full bg-stone">{s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </DashboardShell>
  );
}
