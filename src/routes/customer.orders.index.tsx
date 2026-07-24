import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Boxes, ChevronRight, FileText, Receipt } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listMyOrders, getOrderContractReceipt, getOrderProformaInvoiceReceipt } from "@/lib/api/customer";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatInr } from "@/lib/api/augmont";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

async function openReceipt(fetcher: () => Promise<{ url: string }>) {
  try {
    const receipt = await fetcher();
    window.open(receipt.url, "_blank", "noopener,noreferrer");
  } catch {
    // best-effort — the download icon itself doesn't need its own error banner
  }
}

export const Route = createFileRoute("/customer/orders/")({
  head: () => ({ meta: [{ title: "My Orders — 2+ Fortune Alliances" }] }),
  component: Page,
});

const PAGE_SIZE = 20;

function Page() {
  const { ready } = useRequireRole("ROLE_CUSTOMER");
  const navigate = useNavigate();

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
                <TableHead className="w-16"></TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Loading orders…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    You haven't placed any orders yet.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => {
                const hasAugmontOrder = order.augmontOrderId != null;
                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-stone/60"
                    onClick={() => navigate({ to: "/customer/orders/$orderId", params: { orderId: String(order.id) } })}
                  >
                    <TableCell className="py-5">
                      {/* Order history doesn't carry a per-order image (only the shop/detail
                          views fetch Augmont product data) — a generic icon here avoids an
                          extra product lookup per row. */}
                      <div className="h-11 w-11 rounded-md border border-line bg-stone grid place-items-center">
                        <Boxes className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-sm text-muted-foreground">#{order.id}</TableCell>
                    <TableCell className="py-5">
                      <p className="font-semibold text-ink">{order.productName}</p>
                      <p className="text-xs text-muted-foreground/80 font-light mt-0.5">{order.productWeight}g</p>
                    </TableCell>
                    <TableCell className="py-5">{formatInr(order.finalOrderPrice ?? undefined)}</TableCell>
                    <TableCell className="py-5">
                      <OrderStatusBadge status={order.status} className="rounded-full text-[11px] px-2 py-0" />
                    </TableCell>
                    <TableCell className="py-5 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-5">
                      {hasAugmontOrder ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            title="Download contract"
                            onClick={() => openReceipt(() => getOrderContractReceipt(order.id))}
                            className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-emerald-deep hover:bg-stone transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            title="Download proforma invoice"
                            onClick={() => openReceipt(() => getOrderProformaInvoiceReceipt(order.id))}
                            className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-emerald-deep hover:bg-stone transition-colors"
                          >
                            <Receipt className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="py-5 text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
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
