import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  ArrowLeft, RefreshCcw, FileText, Receipt, XCircle, Boxes,
  CheckCircle2, Circle, AlertTriangle, PackageX,
} from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import {
  getOrder, refreshOrderStatus, getOrderEmiSchedule, getOrderContractReceipt,
  getOrderProformaInvoiceReceipt, getOrderEmiReceipt, getOrderCancellationQuote, cancelOrder,
} from "@/lib/api/customer";
import { getProductDetails, getProductThumbnail, formatInr } from "@/lib/api/augmont";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { ApiError } from "@/lib/api/types";
import type { OrderResponse, OrderStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/customer/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order details" }] }),
  component: Page,
});

const cancelSchema = z.object({
  reason: z.string().trim().min(1, "Tell us why you're cancelling"),
  customerBankName: z.string().trim().min(1, "Bank name is required"),
  customerAccountNo: z.string().trim().min(1, "Account number is required"),
  ifscCode: z.string().trim().min(1, "IFSC code is required"),
});
type CancelValues = z.infer<typeof cancelSchema>;

const TENURE_LABEL: Record<number, string> = {
  1: "3-month EMI",
  2: "6-month EMI",
  3: "9-month EMI",
  4: "Spot (pay in full)",
};

/**
 * Ordered → Confirmed are the only stages this app can actually attest to —
 * OrderStatus never advances past CONFIRMED in our own data, and Augmont
 * gives us no shipping/delivery signal today. Shipped/Delivered are shown
 * as real future stages (so the pattern is ready once that tracking
 * exists) but are never marked complete, rather than faking progress.
 */
function OrderProgressStepper({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2.5 text-destructive">
        <PackageX className="h-5 w-5" />
        <span className="text-sm font-medium">This order was cancelled</span>
      </div>
    );
  }
  if (status === "AUGMONT_FAILED") {
    return (
      <div className="flex items-center gap-2.5 text-gold">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">Needs attention — couldn't be confirmed with our gold partner</span>
      </div>
    );
  }

  const confirmed = status === "CONFIRMED";
  const steps = [
    { label: "Ordered", done: true, current: false },
    { label: "Confirmed", done: confirmed, current: !confirmed },
    { label: "Shipped", done: false, current: false },
    { label: "Delivered", done: false, current: false },
  ];

  return (
    <div>
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              {step.done ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-deep" />
              ) : step.current ? (
                <Circle className="h-6 w-6 text-gold fill-gold/20" />
              ) : (
                <Circle className="h-6 w-6 text-line" />
              )}
              <span className={`text-xs whitespace-nowrap ${step.done || step.current ? "text-ink font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 mb-5 ${steps[i + 1].done ? "bg-emerald-deep" : "bg-line"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">Shipping and delivery tracking isn't available yet.</p>
    </div>
  );
}

function Page() {
  const { orderId } = Route.useParams();
  const { ready } = useRequireRole("ROLE_CUSTOMER");
  const queryClient = useQueryClient();

  const id = Number(orderId);
  const enabled = ready && Number.isFinite(id);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cancelStep, setCancelStep] = useState<"closed" | "quote" | "form">("closed");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["customer", "order", id],
    queryFn: () => getOrder(id),
    enabled,
  });

  const { data: product } = useQuery({
    queryKey: ["augmont", "product", order?.augmontProductId],
    queryFn: () => getProductDetails(order!.augmontProductId),
    enabled: enabled && !!order,
    staleTime: 5 * 60 * 1000,
  });
  const thumb = product ? getProductThumbnail(product) : null;

  const canSyncAugmont = order?.augmontOrderId != null;

  const { data: schedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ["customer", "order", id, "emi-schedule"],
    queryFn: () => getOrderEmiSchedule(id),
    enabled: enabled && canSyncAugmont,
  });

  const { data: quote, isLoading: quoteLoading, isError: quoteError } = useQuery({
    queryKey: ["customer", "order", id, "cancellation-quote"],
    queryFn: () => getOrderCancellationQuote(id),
    enabled: enabled && cancelStep === "quote",
  });

  const form = useForm<CancelValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { reason: "", customerBankName: "", customerAccountNo: "", ifscCode: "" },
  });

  if (!ready) {
    return null;
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await refreshOrderStatus(id);
      await queryClient.invalidateQueries({ queryKey: ["customer", "order", id] });
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
      // best-effort — the download action itself doesn't need its own error banner
    }
  }

  async function handleCancelSubmit(values: CancelValues) {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await cancelOrder(id, values);
      setCancelStep("closed");
      await queryClient.invalidateQueries({ queryKey: ["customer", "order", id] });
    } catch (err) {
      setCancelError(err instanceof ApiError ? err.message : "Couldn't cancel this order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <DashboardShell role="customer" title="Order details">
      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link to="/customer/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
        </Link>
        {order && canSyncAugmont && (
          <Button variant="pillOutline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing…" : "Refresh status"}
          </Button>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading order…</p>}
      {isError && <p className="text-sm text-destructive py-10 text-center">Failed to load this order.</p>}

      {order && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-[13fr_7fr] gap-6 lg:gap-10 items-start">
            {/* ── Left column (~65%) ─────────────────────────────────────── */}
            <div className="space-y-6 min-w-0">
              <Panel title="Product summary">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 shrink-0 rounded-md border border-line overflow-hidden bg-stone grid place-items-center">
                    {thumb ? (
                      <img src={thumb} alt={order.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Boxes className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Order #{order.id}</p>
                    <p className="font-display text-lg text-ink truncate">{order.productName}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      SKU: {order.productSku} · {order.productWeight}g
                    </p>
                  </div>
                  <div className="ml-auto">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                <OrderProgressStepper status={order.status} />

                {order.status === "AUGMONT_FAILED" && order.failureReason && (
                  <p className="text-sm text-destructive mt-4">Augmont error: {order.failureReason}</p>
                )}
                {order.augmontStatusName && (
                  <p className="text-xs text-muted-foreground mt-4">
                    Augmont status: {order.augmontStatusName}
                    {order.augmontStatusSyncedAt && ` · synced ${new Date(order.augmontStatusSyncedAt).toLocaleString()}`}
                  </p>
                )}
              </Panel>

              {canSyncAugmont && (
                <Panel title="EMI schedule">
                  {scheduleLoading && <p className="text-sm text-muted-foreground py-8 text-center">Loading schedule…</p>}
                  {!scheduleLoading && (!schedule || schedule.orderemidetails.length === 0) && (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      {order.paymentTypeId === 4 ? "This was a spot order — no EMI schedule." : "No EMI schedule found."}
                    </p>
                  )}
                  {!scheduleLoading && schedule && schedule.orderemidetails.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="py-3">Installment</TableHead>
                          <TableHead className="py-3">Due date</TableHead>
                          <TableHead className="py-3">Amount</TableHead>
                          <TableHead className="py-3">Status</TableHead>
                          <TableHead className="py-3 text-right">Receipt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedule.orderemidetails.map((emi) => (
                          <TableRow key={emi.emiId}>
                            <TableCell className="py-4">{emi.paymentDescription}</TableCell>
                            <TableCell className="py-4">{new Date(emi.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell className="py-4">{formatInr(emi.emiAmount)}</TableCell>
                            <TableCell className="py-4 capitalize">{emi.orderemistatus?.statusName ?? "—"}</TableCell>
                            <TableCell className="py-4 text-right">
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

            {/* ── Right column (~35%) ────────────────────────────────────── */}
            <div className="space-y-6">
              <Panel title="Delivery address">
                <p className="text-sm text-ink">{order.deliveryAddress}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.deliveryCity}, {order.deliveryState} {order.deliveryPincode}
                </p>
              </Panel>

              <Panel title="Payment summary">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="text-ink">{TENURE_LABEL[order.paymentTypeId] ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Order value</span>
                    <span className="text-ink">{formatInr(order.finalOrderPrice ?? undefined)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {order.paymentTypeId === 4 ? "Paid" : "Down payment"}
                    </span>
                    <span className="text-ink">{formatInr(order.initialPayment ?? undefined)}</span>
                  </div>
                  {order.monthlyAmount != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Monthly EMI</span>
                      <span className="text-ink">{formatInr(order.monthlyAmount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-line">
                    <span className="text-muted-foreground">Placed on</span>
                    <span className="text-ink">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="text-ink text-xs">{order.merchantTransactionId}</span>
                  </div>
                  {canSyncAugmont && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Augmont order ID</span>
                        <span className="text-ink text-xs">{order.augmontOrderId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Augmont unique ID</span>
                        <span className="text-ink text-xs">{order.augmontOrderUniqueId}</span>
                      </div>
                    </>
                  )}
                </div>
              </Panel>

              {canSyncAugmont && (
                <Panel title="Documents">
                  <div className="divide-y divide-line">
                    <button
                      onClick={() => openReceipt(() => getOrderContractReceipt(id))}
                      className="w-full flex items-center gap-3 py-3 text-sm text-ink hover:text-emerald-deep transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Contract
                    </button>
                    <button
                      onClick={() => openReceipt(() => getOrderProformaInvoiceReceipt(id))}
                      className="w-full flex items-center gap-3 py-3 text-sm text-ink hover:text-emerald-deep transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Proforma invoice
                    </button>
                  </div>
                </Panel>
              )}
            </div>
          </div>

          {/* ── Cancel — deliberately de-emphasized, full width, page bottom ── */}
          {order.status === "CONFIRMED" && (
            <div className="flex items-center justify-between border-t border-line pt-4">
              <p className="text-xs text-muted-foreground">
                Cancelling stops future EMIs and refunds any eligible balance, minus applicable charges.
              </p>
              <button
                onClick={() => setCancelStep("quote")}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-4"
              >
                <XCircle className="h-3.5 w-3.5" /> Cancel order
              </button>
            </div>
          )}
        </div>
      )}

      <Dialog open={cancelStep !== "closed"} onOpenChange={(open) => { if (!open) setCancelStep("closed"); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel order</DialogTitle>
          </DialogHeader>

          {cancelStep === "quote" && (
            <div className="space-y-4">
              {quoteLoading && <p className="text-sm text-muted-foreground py-6 text-center">Checking cancellation eligibility…</p>}
              {quoteError && <p className="text-sm text-destructive py-6 text-center">Couldn't fetch cancellation details. Please try again.</p>}
              {quote && (
                <div className="bg-stone rounded-lg p-4 text-sm space-y-1.5">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total paid so far</span><span>₹{quote.totalAmountPaid}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Cancellation charges</span><span>₹{quote.totalCancelationCharges}</span></div>
                  <div className="flex justify-between font-medium"><span>Payable to you</span><span>₹{quote.payableToCustomer}</span></div>
                </div>
              )}
              <DialogFooter>
                <Button variant="pillOutline" onClick={() => setCancelStep("closed")}>Back</Button>
                <Button variant="pill" disabled={!quote} onClick={() => setCancelStep("form")}>Continue</Button>
              </DialogFooter>
            </div>
          )}

          {cancelStep === "form" && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCancelSubmit)} className="space-y-4">
                <FormField control={form.control} name="reason" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for cancelling</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="customerBankName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="customerAccountNo" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account number</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="ifscCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC code</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                {cancelError && <p className="text-sm text-destructive">{cancelError}</p>}
                <DialogFooter>
                  <Button type="button" variant="pillOutline" onClick={() => setCancelStep("quote")}>Back</Button>
                  <Button type="submit" variant="pill" disabled={isCancelling}>
                    {isCancelling ? "Cancelling…" : "Confirm cancellation"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
