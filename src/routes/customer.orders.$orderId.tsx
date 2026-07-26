import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  RefreshCcw,
  FileText,
  Receipt,
  XCircle,
  Boxes,
  CheckCircle2,
  Circle,
  AlertTriangle,
  PackageX,
} from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { OrderDetailLayout } from "@/components/orders/order-detail-layout";
import {
  getOrder,
  refreshOrderStatus,
  getOrderEmiSchedule,
  getOrderContractReceipt,
  getOrderProformaInvoiceReceipt,
  getOrderEmiReceipt,
  getOrderCancellationQuote,
  cancelOrder,
} from "@/lib/api/customer";
import { getProductDetails, getProductThumbnail, formatInr } from "@/lib/api/augmont";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Badge } from "@/components/ui/badge";
import { ApiError } from "@/lib/api/types";
import type { OrderResponse, OrderStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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

/**
 * CANCELLED/AUGMONT_FAILED/PENDING are our own authoritative local facts —
 * shown as-is. Only CONFIRMED is replaced with Augmont's own live status
 * text (auto-refreshed once on page load) — no fallback to "Confirmed"
 * once Augmont's own wording is what's supposed to be shown instead.
 */
function StatusDisplay({ order, isRefreshing }: { order: OrderResponse; isRefreshing: boolean }) {
  if (order.status !== "CONFIRMED") {
    return <OrderStatusBadge status={order.status} />;
  }
  if (isRefreshing && !order.augmontStatusName) {
    return <span className="text-sm text-muted-foreground">Checking with Augmont…</span>;
  }
  if (order.augmontStatusName) {
    return (
      <Badge variant="outline" className="capitalize">
        {order.augmontStatusName}
      </Badge>
    );
  }
  return <span className="text-sm text-muted-foreground">Not synced yet</span>;
}

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
        <span className="text-sm font-medium">
          Needs attention — couldn't be confirmed with our gold partner
        </span>
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
              <span
                className={`text-xs whitespace-nowrap ${step.done || step.current ? "text-ink font-medium" : "text-muted-foreground"}`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 mb-5 ${steps[i + 1].done ? "bg-emerald-deep" : "bg-line"}`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Shipping and delivery tracking isn't available yet.
      </p>
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

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
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

  // Augmont's own status replaces our "Confirmed" label wherever it's shown
  // (see StatusDisplay below) — auto-refresh once on load so it isn't blank
  // the first time this page is opened, rather than requiring a manual click.
  const autoRefreshed = useRef(false);
  useEffect(() => {
    if (order && canSyncAugmont && !order.augmontStatusName && !autoRefreshed.current) {
      autoRefreshed.current = true;
      handleRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id, canSyncAugmont]);

  const { data: schedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ["customer", "order", id, "emi-schedule"],
    queryFn: () => getOrderEmiSchedule(id),
    enabled: enabled && canSyncAugmont,
  });

  const {
    data: quote,
    isLoading: quoteLoading,
    isError: quoteError,
  } = useQuery({
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
      setCancelError(
        err instanceof ApiError ? err.message : "Couldn't cancel this order. Please try again.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardShell role="customer" title="Order details">
        <p className="text-sm text-muted-foreground py-10 text-center">Loading order details…</p>
      </DashboardShell>
    );
  }

  if (isError || !order) {
    return (
      <DashboardShell role="customer" title="Order details">
        <p className="text-sm text-destructive py-10 text-center">Failed to load this order.</p>
      </DashboardShell>
    );
  }

  const cancelDialogNode = (
    <Dialog
      open={cancelStep !== "closed"}
      onOpenChange={(open) => {
        if (!open) setCancelStep("closed");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel order</DialogTitle>
        </DialogHeader>

        {cancelStep === "quote" && (
          <div className="space-y-4">
            {quoteLoading && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Checking cancellation eligibility…
              </p>
            )}
            {quoteError && (
              <p className="text-sm text-destructive py-6 text-center">
                Couldn't fetch cancellation details. Please try again.
              </p>
            )}
            {quote && (
              <div className="bg-stone rounded-lg p-4 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total paid so far</span>
                  <span>₹{quote.totalAmountPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cancellation charges</span>
                  <span>₹{quote.totalCancelationCharges}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Payable to you</span>
                  <span>₹{quote.payableToCustomer}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="pillOutline" onClick={() => setCancelStep("closed")}>
                Back
              </Button>
              <Button variant="pill" disabled={!quote} onClick={() => setCancelStep("form")}>
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {cancelStep === "form" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCancelSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for cancelling</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerBankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerAccountNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {cancelError && <p className="text-sm text-destructive">{cancelError}</p>}
              <DialogFooter>
                <Button type="button" variant="pillOutline" onClick={() => setCancelStep("quote")}>
                  Back
                </Button>
                <Button type="submit" variant="pill" disabled={isCancelling}>
                  {isCancelling ? "Cancelling…" : "Confirm cancellation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <OrderDetailLayout
      order={order}
      role="customer"
      isRefreshing={isRefreshing}
      onRefreshStatus={handleRefresh}
      product={product}
      emiSchedule={schedule?.orderemidetails}
      emiLoading={scheduleLoading}
      onOpenContract={() => openReceipt(() => getOrderContractReceipt(id))}
      onOpenProforma={() => openReceipt(() => getOrderProformaInvoiceReceipt(id))}
      onOpenEmiReceipt={(instalmentNo) => openReceipt(() => getOrderEmiReceipt(id, instalmentNo))}
      onCancelClick={() => setCancelStep("quote")}
      cancelDialog={cancelDialogNode}
    />
  );
}
