import { useQuery } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";
import { Panel } from "@/components/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/spinner";
import { formatInr } from "@/lib/api/augmont";
import { getOrderRefund } from "@/lib/api/admin";

interface OrderRefundPanelProps {
  orderId: number;
}

/**
 * Where the refund on a cancelled order stands. Admin-only — it's a
 * reconciliation view, not something a branch or the customer acts on.
 *
 * Augmont raises the refund record some time after the cancellation, so an
 * empty result is an expected state rather than an error and is shown as such.
 */
export function OrderRefundPanel({ orderId }: OrderRefundPanelProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order-refund", orderId],
    queryFn: () => getOrderRefund(orderId),
    // Two Augmont round-trips per call (search, then fetch by id), so this
    // stays put unless the page is genuinely revisited.
    staleTime: 60_000,
  });

  return (
    <Panel title="Refund">
      {isLoading ? (
        <LoadingState label="Checking refund status…" />
      ) : error ? (
        <p role="alert" className="text-xs text-destructive">
          {(error as Error).message}
        </p>
      ) : !data?.found ? (
        <p className="text-xs text-muted-foreground py-2">
          Augmont has not raised a refund for this order yet. This is normal shortly after
          a cancellation — check again later.
        </p>
      ) : (
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Undo2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Status</span>
            <Badge
              variant={data.refundStatus?.toLowerCase() === "completed" ? "success" : "warning"}
              className="capitalize ml-auto text-[10px]"
            >
              {data.refundStatus ?? "unknown"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount paid</span>
            <span>{formatInr(data.totalAmountPaid)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cancellation charges</span>
            <span>{formatInr(data.cancellationCharges)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-line font-semibold">
            <span>Payable to customer</span>
            <span className="text-primary font-display text-base">
              {formatInr(data.payableToCustomer)}
            </span>
          </div>

          {data.transactionId && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">Payout reference</span>
              <span className="font-mono break-all">{data.transactionId}</span>
            </div>
          )}
          {data.cancelDate && (
            <p className="text-[11px] text-muted-foreground pt-1 border-t border-line">
              Cancelled on {new Date(data.cancelDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}
