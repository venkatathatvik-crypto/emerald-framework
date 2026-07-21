import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, RefreshCcw, FileText, Receipt } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import {
  getOrder, refreshOrderStatus, getOrderEmiSchedule, getOrderContractReceipt,
  getOrderProformaInvoiceReceipt, getOrderEmiReceipt,
} from "@/lib/api/branch";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatInr } from "@/lib/api/augmont";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/branch/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order details — Branch" }] }),
  component: Page,
});

function Page() {
  const { orderId } = Route.useParams();
  const { ready } = useRequireRole(["ROLE_BRANCH", "ROLE_AGENT"]);
  const queryClient = useQueryClient();

  const id = Number(orderId);
  const enabled = ready && Number.isFinite(id);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["branch", "order", id],
    queryFn: () => getOrder(id),
    enabled,
  });

  const canSyncAugmont = order?.augmontOrderId != null;

  const { data: schedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ["branch", "order", id, "emi-schedule"],
    queryFn: () => getOrderEmiSchedule(id),
    enabled: enabled && canSyncAugmont,
  });

  if (!ready) {
    return null;
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await refreshOrderStatus(id);
      await queryClient.invalidateQueries({ queryKey: ["branch", "order", id] });
    } catch {
      // status refresh failing isn't fatal — the page just keeps the last-known value
    } finally {
      setIsRefreshing(false);
    }
  }

  async function openReceipt(fetcher: () => Promise<{ url: string }>) {
    try {
      const receipt = await fetcher();
      window.open(receipt.url, "_blank", "noopener,noreferrer");
    } catch {
      // best-effort — the download button itself doesn't need its own error banner
    }
  }

  return (
    <DashboardShell role="branch" title="Order details">
      <Link to="/branch/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading order…</p>}
      {isError && <p className="text-sm text-destructive py-10 text-center">Failed to load this order.</p>}

      {order && (
        <div className="space-y-6">
          <Panel
            title={order.productName}
            action={
              canSyncAugmont && (
                <Button variant="pillOutline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing…" : "Refresh status"}
                </Button>
              )
            }
          >
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <OrderStatusBadge status={order.status} />
              {order.augmontStatusName && (
                <span className="text-xs text-muted-foreground">
                  Augmont: {order.augmontStatusName}
                  {order.augmontStatusSyncedAt && ` · synced ${new Date(order.augmontStatusSyncedAt).toLocaleString()}`}
                </span>
              )}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p>{order.customerName}</p>
                <p className="text-xs text-muted-foreground">{order.customerMobile}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p>{formatInr(order.finalOrderPrice ?? undefined)}</p>
                <p className="text-xs text-muted-foreground">
                  {order.monthlyAmount ? `${formatInr(order.monthlyAmount)}/mo` : "Spot"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Placed</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">{order.merchantTransactionId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Product</p>
                <p>{order.productName}</p>
                <p className="text-xs text-muted-foreground">{order.productWeight}g</p>
              </div>
              <div>
                <p className="text-muted-foreground">Delivery address</p>
                <p>{order.deliveryAddress}</p>
                <p className="text-xs text-muted-foreground">
                  {order.deliveryCity}, {order.deliveryState} {order.deliveryPincode}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Placed by</p>
                <p>{order.createdByName}</p>
              </div>
            </div>
            {order.status === "AUGMONT_FAILED" && order.failureReason && (
              <p className="text-sm text-destructive mt-4">Augmont error: {order.failureReason}</p>
            )}
          </Panel>

          {canSyncAugmont && (
            <Panel title="Documents">
              <div className="flex flex-wrap gap-3">
                <Button variant="pillOutline" size="sm" onClick={() => openReceipt(() => getOrderContractReceipt(id))}>
                  <FileText className="h-3.5 w-3.5" /> Contract
                </Button>
                <Button variant="pillOutline" size="sm" onClick={() => openReceipt(() => getOrderProformaInvoiceReceipt(id))}>
                  <FileText className="h-3.5 w-3.5" /> Proforma invoice
                </Button>
              </div>
            </Panel>
          )}

          {canSyncAugmont && (
            <Panel title="EMI schedule">
              {scheduleLoading && <p className="text-sm text-muted-foreground py-6 text-center">Loading schedule…</p>}
              {!scheduleLoading && (!schedule || schedule.orderemidetails.length === 0) && (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  {order.paymentTypeId === 4 ? "This was a spot order — no EMI schedule." : "No EMI schedule found."}
                </p>
              )}
              {!scheduleLoading && schedule && schedule.orderemidetails.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Installment</TableHead>
                      <TableHead>Due date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.orderemidetails.map((emi) => (
                      <TableRow key={emi.emiId}>
                        <TableCell>{emi.paymentDescription}</TableCell>
                        <TableCell>{new Date(emi.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{formatInr(emi.emiAmount)}</TableCell>
                        <TableCell className="capitalize">{emi.orderemistatus?.statusName ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          {emi.paymentRecievedDate ? (
                            <Button
                              variant="pillOutline"
                              size="sm"
                              onClick={() => openReceipt(() => getOrderEmiReceipt(id, emi.emiId))}
                            >
                              <Receipt className="h-3.5 w-3.5" /> Receipt
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Panel>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
