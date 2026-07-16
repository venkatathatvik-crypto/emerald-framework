import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { getMyBranch, listOrders as listBranchOrders, listCustomers as listBranchCustomers } from "@/lib/api/branch";
import { ReferralCodeCard } from "@/components/ReferralCodeCard";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatInr } from "@/lib/api/augmont";

export const Route = createFileRoute("/dashboard/branch")({
  head: () => ({ meta: [{ title: "Branch Dashboard — 2+ Fortune Alliances" }] }),
  component: Page,
});

function Page() {
  const { ready } = useRequireRole(["ROLE_BRANCH", "ROLE_AGENT"]);

  const { data: branch } = useQuery({
    queryKey: ["branch", "me"],
    queryFn: getMyBranch,
    enabled: ready,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["branch", "orders", "dashboard"],
    queryFn: () => listBranchOrders({ size: 50 }),
    enabled: ready,
  });

  const { data: customers } = useQuery({
    queryKey: ["branch", "customers", "count"],
    queryFn: () => listBranchCustomers({ size: 1 }),
    enabled: ready,
  });

  if (!ready) return null;

  const allOrders = orders?.items ?? [];
  const confirmedOrders = allOrders.filter((o) => o.status === "CONFIRMED");
  const needsAttention = allOrders.filter((o) => o.status === "AUGMONT_FAILED").length;
  const recentOrders = allOrders.slice(0, 5);

  return (
    <DashboardShell role="branch" title={branch ? `${branch.name} · Overview` : "Branch overview"}>
      <div className="mb-6">
        <ReferralCodeCard code={branch?.referralCode} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total orders" value={ordersLoading ? "—" : String(orders?.totalItems ?? 0)} sub="All time" />
        <StatCard label="Confirmed" value={ordersLoading ? "—" : String(confirmedOrders.length)} sub="Confirmed with Augmont" />
        <StatCard label="Customers" value={customers ? String(customers.totalItems) : "—"} sub="Attributed to this branch" accent />
        <StatCard label="Needs attention" value={ordersLoading ? "—" : String(needsAttention)} sub="Pending resolution" />
      </div>

      <Panel
        title="Recent orders"
        action={<Link to="/branch/orders" className="text-xs link-underline">View all</Link>}
      >
        {ordersLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading orders…</p>}
        {!ordersLoading && recentOrders.length === 0 && (
          <p className="text-sm text-muted-foreground py-10 text-center">
            No orders yet — <Link to="/branch/place-order" className="link-underline">place one for a customer</Link>.
          </p>
        )}
        {!ordersLoading && recentOrders.length > 0 && (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground border-b border-line">
              <tr>
                <th className="py-2 font-normal">Customer</th>
                <th className="font-normal">Product</th>
                <th className="font-normal">Placed by</th>
                <th className="font-normal">Status</th>
                <th className="font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-line last:border-0">
                  <td className="py-3 font-medium">{order.customerName}</td>
                  <td>{order.productName}</td>
                  <td className="text-muted-foreground">{order.createdByName}</td>
                  <td><OrderStatusBadge status={order.status} /></td>
                  <td className="text-right font-display">{formatInr(order.finalOrderPrice ?? undefined)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </DashboardShell>
  );
}
