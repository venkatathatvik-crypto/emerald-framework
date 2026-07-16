import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listOrders, listBranches } from "@/lib/api/partner";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatInr } from "@/lib/api/augmont";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/partner/orders")({
  head: () => ({ meta: [{ title: "Orders — Partner" }] }),
  component: Page,
});

const PAGE_SIZE = 20;

function Page() {
  const { ready } = useRequireRole("ROLE_ALLIANCE");

  const [branchId, setBranchId] = useState<string>("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);

  const { data: branches } = useQuery({
    queryKey: ["partner", "branches", "all-for-filter"],
    queryFn: () => listBranches({ size: 200 }),
    enabled: ready,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partner", "orders", { branchId, from, to, page }],
    queryFn: () => listOrders({
      branchId: branchId === "ALL" ? undefined : Number(branchId),
      from: from || undefined,
      to: to || undefined,
      page,
      size: PAGE_SIZE,
    }),
    enabled: ready,
  });

  if (!ready) {
    return null;
  }

  const orders = data?.items ?? [];

  return (
    <DashboardShell role="partner" title="Orders">
      <Panel
        title="Orders across your branches"
        action={
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={branchId} onValueChange={(v) => { setBranchId(v); setPage(0); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All branches</SelectItem>
                {branches?.items.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} className="w-40" />
            <span className="text-sm text-muted-foreground">to</span>
            <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} className="w-40" />
          </div>
        }
      >
        {isError && (
          <p className="text-sm text-destructive py-6">Failed to load orders. Please try again.</p>
        )}

        {!isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Placed by</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    Loading orders…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-medium text-ink">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerMobile}</p>
                  </TableCell>
                  <TableCell>{order.branchName || "—"}</TableCell>
                  <TableCell>
                    <p>{order.productName}</p>
                    <p className="text-xs text-muted-foreground">{order.productWeight}g</p>
                  </TableCell>
                  <TableCell>{order.createdByName}</TableCell>
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
