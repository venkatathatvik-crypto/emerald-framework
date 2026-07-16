import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listMyOrders } from "@/lib/api/customer";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatInr } from "@/lib/api/augmont";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/customer/orders")({
  head: () => ({ meta: [{ title: "My Orders — 2+ Fortune Alliances" }] }),
  component: Page,
});

const PAGE_SIZE = 20;

function Page() {
  const { ready } = useRequireRole("ROLE_CUSTOMER");

  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer", "orders", { page }],
    queryFn: () => listMyOrders({ page, size: PAGE_SIZE }),
    enabled: ready,
  });

  if (!ready) {
    return null;
  }

  const orders = data?.items ?? [];

  return (
    <DashboardShell role="customer" title="My orders">
      <Panel title="Order history">
        {isError && (
          <p className="text-sm text-destructive py-6">Failed to load your orders. Please try again.</p>
        )}

        {!isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    Loading orders…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    You haven't placed any orders yet.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-medium text-ink">{order.productName}</p>
                    <p className="text-xs text-muted-foreground">{order.productWeight}g</p>
                  </TableCell>
                  <TableCell>{formatInr(order.finalOrderPrice ?? undefined)}</TableCell>
                  <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
            <span>
              Page {data.page + 1} of {data.totalPages} · {data.totalItems} total
            </span>
            <div className="flex gap-2">
              <Button
                variant="pillOutline"
                size="sm"
                disabled={data.page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="pillOutline"
                size="sm"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </DashboardShell>
  );
}
