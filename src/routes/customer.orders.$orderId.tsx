import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";

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
import { ApiError } from "@/lib/api/types";
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

function Page() {
  const { orderId } = Route.useParams();
  const { ready } = useRequireRole("ROLE_CUSTOMER");
  const queryClient = useQueryClient();

  const id = Number(orderId);
  const enabled = ready && Number.isFinite(id);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
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
    setRefreshError(null);
    try {
      await refreshOrderStatus(id);
      await queryClient.invalidateQueries({ queryKey: ["customer", "order", id] });
    } catch {
      // Not fatal — the last-known status stays on screen — but say so rather
      // than leaving the button looking like it silently did nothing.
      setRefreshError("Couldn’t reach our gold partner. Showing the last known status.");
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
      refreshError={refreshError}
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
