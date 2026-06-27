import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Check, Clock, Truck } from "lucide-react";

export const Route = createFileRoute("/dashboard/customer")({
  head: () => ({ meta: [{ title: "Customer Dashboard — 2+FAPL" }] }),
  component: Page,
});

const SPEND = [
  { m: "Apr", v: 4200 }, { m: "May", v: 3800 }, { m: "Jun", v: 5100 },
  { m: "Jul", v: 4900 }, { m: "Aug", v: 6300 }, { m: "Sep", v: 5800 },
  { m: "Oct", v: 7200 },
];

const ORDERS = [
  ["#FA-23187", "Bajaj Mixer Grinder", "Delivered", "₹3,499"],
  ["#FA-23142", "Eureka Forbes RO+UV", "In transit", "₹11,200"],
  ["#FA-23098", "Crompton Ceiling Fan", "Delivered", "₹2,150"],
  ["#FA-23055", "Samsung Smart TV 32\"", "EMI ongoing", "₹18,990"],
];

function Page() {
  return (
    <DashboardShell role="customer" title="Welcome back, Srikanth.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active EMIs" value="3" sub="₹4,250 next due Nov 5" />
        <StatCard label="Total spent · YTD" value="₹37.4K" sub="↑ 18% vs FY24" />
        <StatCard label="Gold EMI vault" value="₹1.2L" sub="Reclaimable Jan 2027" accent />
        <StatCard label="Reward points" value="2,840" sub="Redeem from Dec 1" />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 mb-6">
        <Panel title="Spend over time" action={<span className="text-xs text-muted-foreground">Last 7 months</span>}>
          <div className="h-64 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPEND}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.34 0.07 160)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.34 0.07 160)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 4, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.34 0.07 160)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Upcoming EMI">
          <div className="space-y-4">
            {[
              ["Nov 5", "Samsung TV 32\"", "₹1,580"],
              ["Nov 12", "Eureka Forbes RO", "₹1,200"],
              ["Dec 5", "Samsung TV 32\"", "₹1,580"],
            ].map(([d, p, a]) => (
              <div key={d + p} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                <div>
                  <p className="text-sm font-medium">{p}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
                <span className="font-display text-lg">{a}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Recent orders" action={<button className="text-xs link-underline">View all</button>}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-line">
              <th className="py-2 font-normal">Order</th>
              <th className="font-normal">Product</th>
              <th className="font-normal">Status</th>
              <th className="font-normal text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(([id, p, s, a]) => (
              <tr key={id} className="border-b border-line last:border-0">
                <td className="py-4 text-muted-foreground">{id}</td>
                <td className="font-medium">{p}</td>
                <td>
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    {s === "Delivered" && <Check className="h-3 w-3 text-emerald-deep" />}
                    {s === "In transit" && <Truck className="h-3 w-3 text-gold" />}
                    {s === "EMI ongoing" && <Clock className="h-3 w-3 text-muted-foreground" />}
                    {s}
                  </span>
                </td>
                <td className="text-right font-display">{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </DashboardShell>
  );
}
