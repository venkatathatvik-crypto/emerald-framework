import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { Sparkles } from "lucide-react";
import { useRequireRole } from "@/hooks/use-require-role";
import { useAuth } from "@/lib/auth-context";
import { listMyOrders } from "@/lib/api/customer";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatInr } from "@/lib/api/augmont";

export const Route = createFileRoute("/dashboard/customer")({
  head: () => ({ meta: [{ title: "Customer Dashboard — 2+ Fortune Alliances & Augmont" }] }),
  component: Page,
});

function Page() {
  const { ready } = useRequireRole("ROLE_CUSTOMER");
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["customer", "orders", "dashboard"],
    queryFn: () => listMyOrders({ size: 50 }),
    enabled: ready,
  });

  if (!ready) return null;

  const allOrders = orders?.items ?? [];
  const confirmedOrders = allOrders.filter((o) => o.status === "CONFIRMED");
  const needsAttention = allOrders.filter((o) => o.status === "AUGMONT_FAILED").length;
  const totalSpent = confirmedOrders.reduce((sum, o) => sum + (o.finalOrderPrice ?? 0), 0);
  const recentOrders = allOrders.slice(0, 5);

  return (
    <DashboardShell role="customer" title={`Welcome back, ${user?.firstName || "there"}.`}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-muted-foreground">Gold EMI powered by</span>
        <img
          src={`${import.meta.env.BASE_URL}images/augmont_logo.png`}
          alt="Augmont Gold For All"
          className="h-8 object-contain bg-white rounded-lg p-1 border border-line"
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total orders" value={isLoading ? "—" : String(orders?.totalItems ?? 0)} sub="All time" />
        <StatCard label="Confirmed" value={isLoading ? "—" : String(confirmedOrders.length)} sub="Confirmed with Augmont" />
        <StatCard label="Total spent" value={isLoading ? "—" : formatInr(totalSpent)} sub="Across confirmed orders" accent />
        <StatCard label="Needs attention" value={isLoading ? "—" : String(needsAttention)} sub="We're following up" />
      </div>

      {/* Gold Investment CTA */}
      <div className="mb-6 bg-gradient-to-r from-gold-soft/30 to-gold/10 rounded-2xl p-6 border border-gold/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={`${import.meta.env.BASE_URL}images/augmont_logo.png`}
              alt="Augmont Gold For All"
              className="h-12 object-contain bg-white rounded-lg p-2 border border-gold/20"
            />
            <div>
              <h3 className="font-display text-xl text-ink mb-1">Shop gold, on your terms</h3>
              <p className="text-sm text-muted-foreground">Browse real Augmont products and EMI pricing</p>
            </div>
          </div>
          <Link to="/customer/shop" className="btn-gold text-sm">
            Shop now <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Panel title="Recent orders" action={<Link to="/customer/orders" className="text-xs link-underline">View all</Link>}>
        {isLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading orders…</p>}
        {!isLoading && recentOrders.length === 0 && (
          <p className="text-sm text-muted-foreground py-10 text-center">
            You haven't placed any orders yet — <Link to="/customer/shop" className="link-underline">browse the shop</Link>.
          </p>
        )}
        {!isLoading && recentOrders.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-line">
                <th className="py-2 font-normal">Product</th>
                <th className="font-normal">Status</th>
                <th className="font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-line last:border-0">
                  <td className="py-4">
                    <p className="font-medium">{order.productName}</p>
                    <p className="text-xs text-muted-foreground">{order.productWeight}g</p>
                  </td>
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
