import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import {
  getMyCompany,
  listBranches,
  listOrders as listPartnerOrders,
  listCustomers as listPartnerCustomers,
} from "@/lib/api/partner";
import { ReferralCodeCard } from "@/components/ReferralCodeCard";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Badge } from "@/components/ui/badge";
import { formatInr } from "@/lib/api/augmont";
import { exportToCsv } from "@/lib/csv-exporter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/spinner";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/dashboard/partner")({
  head: () => ({ meta: [{ title: "Partner Dashboard — 2+ Fortune Alliances" }] }),
  component: Page,
});

/** Augmont vault booking status donut chart colors */
const VAULT_COLORS: Record<string, string> = {
  CONFIRMED: "#1A3C34",
  PENDING: "#C5973A",
  AUGMONT_FAILED: "#DC2626",
  CANCELLED: "#6B7280",
};

function Page() {
  const { ready } = useRequireRole("ROLE_ALLIANCE");

  const { data: company } = useQuery({
    queryKey: ["partner", "me"],
    queryFn: getMyCompany,
    enabled: ready,
  });

  const { data: branches } = useQuery({
    queryKey: ["partner", "branches", "dashboard"],
    queryFn: () => listBranches({ size: 5 }),
    enabled: ready,
  });

  const { data: customers } = useQuery({
    queryKey: ["partner", "customers", "count"],
    queryFn: () => listPartnerCustomers({ size: 1 }),
    enabled: ready,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["partner", "orders", "dashboard"],
    queryFn: () => listPartnerOrders({ size: 50 }),
    enabled: ready,
  });

  if (!ready) return null;

  const allOrders = orders?.items ?? [];
  const confirmedOrders = allOrders.filter((o) => o.status === "CONFIRMED");
  const needsAttention = allOrders.filter((o) => o.status === "AUGMONT_FAILED").length;
  const recentOrders = allOrders.slice(0, 5);

  // Build vault status breakdown for donut chart
  const statusCounts = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});
  const vaultPieData = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <DashboardShell
      role="partner"
      title={company ? `${company.name} · Partner Overview` : "Partner Overview"}
    >
      <div className="mb-6">
        <ReferralCodeCard code={company?.referralCode} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Branches"
          value={branches ? String(branches.totalItems) : "—"}
          sub="Across your network"
        />
        <StatCard
          label="Customers"
          value={customers ? String(customers.totalItems) : "—"}
          sub="Attributed to your branches"
        />
        <StatCard
          label="Orders"
          value={ordersLoading ? "—" : String(orders?.totalItems ?? 0)}
          sub="All time"
          accent
        />
        <StatCard
          label="Needs attention"
          value={ordersLoading ? "—" : String(needsAttention)}
          sub="Pending resolution"
        />
      </div>

      {/* Vault Booking Success Chart */}
      {!ordersLoading && vaultPieData.length > 0 && (
        <div className="mb-6">
          <Panel
            title="Augmont Vault Booking Status"
            action={
              <Button
                variant="pillOutline"
                size="sm"
                onClick={() =>
                  exportToCsv(
                    "Vault_Booking_Status",
                    ["Status", "Count"],
                    vaultPieData.map((d) => [d.name, d.value]),
                  )
                }
              >
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export
              </Button>
            }
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-52 w-full sm:w-64 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vaultPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {vaultPieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={VAULT_COLORS[entry.name] ?? "#94A3B8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex-1 space-y-2 text-sm w-full">
                {vaultPieData.map((entry) => (
                  <li key={entry.name} className="flex items-center justify-between border-b border-line pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: VAULT_COLORS[entry.name] ?? "#94A3B8" }}
                      />
                      <span className="font-medium">{entry.name.replace("_", " ")}</span>
                    </div>
                    <span className="tabular-nums font-mono">{entry.value}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between pt-1 font-semibold text-ink">
                  <span>Total Bookings</span>
                  <span className="tabular-nums font-mono">{allOrders.length}</span>
                </li>
              </ul>
            </div>
          </Panel>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel
          title="Recent orders"
          action={
            <Link to="/partner/orders" className="text-xs link-underline">
              View all
            </Link>
          }
        >
          {ordersLoading && (
            <LoadingState label="Loading orders…" />
          )}
          {!ordersLoading && recentOrders.length === 0 && (
            <p className="text-sm text-muted-foreground py-10 text-center">No orders yet.</p>
          )}
          {!ordersLoading && recentOrders.length > 0 && (
            <ul className="space-y-3 text-sm">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0"
                >
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.productName} · {order.branchName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display">
                      {formatInr(order.finalOrderPrice ?? undefined)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Branches"
          action={
            <Link to="/partner/branches" className="text-xs link-underline">
              View all
            </Link>
          }
        >
          {!branches?.items.length && (
            <p className="text-sm text-muted-foreground py-10 text-center">
              No branches yet —{" "}
              <Link to="/partner/branches" className="link-underline">
                create one
              </Link>
              .
            </p>
          )}
          {!!branches?.items.length && (
            <ul className="space-y-3 text-sm">
              {branches.items.map((branch) => (
                <li
                  key={branch.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0"
                >
                  <div>
                    <p className="font-medium">{branch.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[branch.city, branch.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <Badge variant={branch.active ? "default" : "destructive"}>
                    {branch.active ? "Active" : "Inactive"}
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
