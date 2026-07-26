import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listPartners, listCustomers, listLeads, getNewLeadCount } from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { exportToCsv } from "@/lib/csv-exporter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — 2+ Fortune Alliances" }] }),
  component: Page,
});

const LEAD_STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  NEW: "default",
  CONTACTED: "secondary",
  CONVERTED: "outline",
  REJECTED: "destructive",
};

/** Gold EMI sales growth — synthetic monthly trend data (replace with live API when available) */
const EMI_GROWTH_DATA = [
  { month: "Feb", revenue: 148000, orders: 12 },
  { month: "Mar", revenue: 192000, orders: 16 },
  { month: "Apr", revenue: 175000, orders: 14 },
  { month: "May", revenue: 234000, orders: 20 },
  { month: "Jun", revenue: 268000, orders: 23 },
  { month: "Jul", revenue: 310000, orders: 27 },
];

/** Branch commission payout data — replace with live partner/commission API */
const BRANCH_COMMISSION_DATA = [
  { branch: "Hyd-01", commission: 18400, orders: 14 },
  { branch: "Pune-02", commission: 12800, orders: 10 },
  { branch: "Mum-03", commission: 21600, orders: 18 },
  { branch: "Del-04", commission: 9200, orders: 7 },
  { branch: "Blr-05", commission: 15600, orders: 13 },
];

const formatRupee = (v: number) =>
  v >= 100000
    ? `₹${(v / 100000).toFixed(1)}L`
    : v >= 1000
      ? `₹${(v / 1000).toFixed(0)}K`
      : `₹${v}`;

function Page() {
  const { ready } = useRequireRole("ROLE_ADMIN");

  const { data: activePartners, isLoading: partnersLoading } = useQuery({
    queryKey: ["admin", "partners", "count", "active"],
    queryFn: () => listPartners({ active: true, size: 1 }),
    enabled: ready,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["admin", "customers", "count"],
    queryFn: () => listCustomers({ size: 1 }),
    enabled: ready,
  });

  const { data: newLeadCount } = useQuery({
    queryKey: ["admin", "leads", "new-count"],
    queryFn: getNewLeadCount,
    enabled: ready,
  });

  const { data: recentLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["admin", "leads", "recent"],
    queryFn: () => listLeads({ size: 5 }),
    enabled: ready,
  });

  const { data: recentPartners, isLoading: recentPartnersLoading } = useQuery({
    queryKey: ["admin", "partners", "recent"],
    queryFn: () => listPartners({ size: 5 }),
    enabled: ready,
  });

  if (!ready) return null;

  return (
    <DashboardShell role="admin" title="Company Overview">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active partners"
          value={partnersLoading ? "—" : String(activePartners?.totalItems ?? 0)}
          sub="Live partner accounts"
        />
        <StatCard
          label="Total customers"
          value={customersLoading ? "—" : String(customers?.totalItems ?? 0)}
          sub="Across all channels"
        />
        <StatCard
          label="Total leads"
          value={leadsLoading ? "—" : String(recentLeads?.totalItems ?? 0)}
          sub="All-time submissions"
        />
        <StatCard
          label="New leads"
          value={String(newLeadCount ?? 0)}
          sub="Awaiting review"
          accent
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Panel
          title="Gold EMI Revenue Trend"
          action={
            <Button
              variant="pillOutline"
              size="sm"
              onClick={() =>
                exportToCsv(
                  "Gold_EMI_Revenue_Trend",
                  ["Month", "Revenue (₹)", "Orders"],
                  EMI_GROWTH_DATA.map((d) => [d.month, d.revenue, d.orders]),
                )
              }
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
          }
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EMI_GROWTH_DATA} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5973A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C5973A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-line" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatRupee} tick={{ fontSize: 11 }} width={52} />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C5973A"
                  strokeWidth={2}
                  fill="url(#goldGrad)"
                  dot={{ r: 3, fill: "#C5973A" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Branch Commission Payouts"
          action={
            <Button
              variant="pillOutline"
              size="sm"
              onClick={() =>
                exportToCsv(
                  "Branch_Commission_Report",
                  ["Branch", "Commission (₹)", "Orders"],
                  BRANCH_COMMISSION_DATA.map((d) => [d.branch, d.commission, d.orders]),
                )
              }
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
          }
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={BRANCH_COMMISSION_DATA}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-line" />
                <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatRupee} tick={{ fontSize: 11 }} width={52} />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Commission"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="commission" fill="#1A3C34" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel
          title="Recent leads"
          action={
            <Link to="/admin/leads" className="text-xs link-underline">
              View all
            </Link>
          }
        >
          {leadsLoading && (
            <p className="text-sm text-muted-foreground py-10 text-center">Loading leads…</p>
          )}
          {!leadsLoading && !recentLeads?.items.length && (
            <p className="text-sm text-muted-foreground py-10 text-center">No leads yet.</p>
          )}
          {!!recentLeads?.items.length && (
            <ul className="space-y-3 text-sm">
              {recentLeads.items.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0"
                >
                  <div>
                    <p className="font-medium">{lead.companyName}</p>
                    <p className="text-xs text-muted-foreground">{lead.contactPerson}</p>
                  </div>
                  <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>{lead.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent partners"
          action={
            <Link to="/admin/partners" className="text-xs link-underline">
              View all
            </Link>
          }
        >
          {recentPartnersLoading && (
            <p className="text-sm text-muted-foreground py-10 text-center">Loading partners…</p>
          )}
          {!recentPartnersLoading && !recentPartners?.items.length && (
            <p className="text-sm text-muted-foreground py-10 text-center">
              No partners onboarded yet.
            </p>
          )}
          {!!recentPartners?.items.length && (
            <ul className="space-y-3 text-sm">
              {recentPartners.items.map((partner) => (
                <li
                  key={partner.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0"
                >
                  <div>
                    <p className="font-medium">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">{partner.type}</p>
                  </div>
                  <Badge variant={partner.active ? "default" : "destructive"}>
                    {partner.active ? "Active" : "Inactive"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
