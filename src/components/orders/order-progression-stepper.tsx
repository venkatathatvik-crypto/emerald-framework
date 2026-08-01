import { Check, PackageX, AlertTriangle, Undo2 } from "lucide-react";
import type { OrderStatus } from "@/lib/api/types";

interface OrderProgressionStepperProps {
  status: OrderStatus;
  augmontStatusName?: string | null;
  createdAt?: string;
}

/**
 * How far along its own lifecycle each Augmont status sits — drives how much of
 * the stepper is filled in. Names are Augmont's own, confirmed live against
 * GET /order/all-order-status; they arrive lowercase in `augmontStatusName`.
 *
 * "returned to origin" ranks alongside dispatch because the parcel genuinely did
 * ship — it just came back, which the banner below explains rather than the
 * stepper silently swallowing it. The statuses that aren't a forward step at all
 * (cancelled, defaulter, portfolio at risk) are deliberately absent here.
 */
const STAGE_RANK: Record<string, number> = {
  booked: 1,
  // Repayment trouble on an order that is definitely booked — it just hasn't
  // been paid off. Ranking these at "booked" keeps the stepper honest (payment
  // stays incomplete) instead of dropping them to "not booked yet".
  defaulter: 1,
  "portfolio at risk": 1,
  "payment received": 2,
  active: 2,
  processing: 3,
  "dispatched to client": 4,
  "re-dispatched": 4,
  "returned to origin": 4,
  "delivered to client": 5,
};

/**
 * Augmont states that need calling out in their own right — a stepper alone
 * would either hide them or imply the order is progressing normally.
 */
const EXCEPTIONS: Record<string, { title: string; body: string }> = {
  "returned to origin": {
    title: "Returned to sender",
    body: "The parcel was dispatched but came back undelivered. Our team will arrange a re-dispatch.",
  },
  defaulter: {
    title: "EMI payment overdue",
    body: "One or more instalments are past their due date. Please clear the outstanding amount to keep this order active.",
  },
  "portfolio at risk": {
    title: "Flagged as at-risk",
    body: "Our gold partner has flagged this order for repayment risk. Please get in touch with support.",
  },
};

export function OrderProgressionStepper({
  status,
  augmontStatusName,
  createdAt,
}: OrderProgressionStepperProps) {
  const augmontStatus = augmontStatusName?.trim().toLowerCase() ?? null;

  // Cancellation is authoritative from either side — ours (already reconciled)
  // or Augmont's (cancelled there, not yet synced back to us).
  if (status === "CANCELLED" || augmontStatus === "order cancelled") {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive flex items-start gap-3">
        <PackageX className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">Order Cancelled</h4>
          <p className="text-xs text-destructive/80 mt-0.5">
            This order was cancelled. If eligible, your refund will be processed to your bank
            account within 3–5 business days.
          </p>
        </div>
      </div>
    );
  }

  if (status === "AUGMONT_FAILED") {
    return (
      <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-warning flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">Needs Attention with Gold Partner</h4>
          <p className="text-xs text-warning/90 mt-0.5">
            Order placed locally, but booking with our gold partner (Augmont) requires manual sync
            or confirmation. Click &quot;Refresh status&quot; to retry.
          </p>
        </div>
      </div>
    );
  }

  // Rank 0 = placed with us but nothing back from Augmont yet (either still
  // PENDING, or CONFIRMED but the status has never been refreshed).
  const rank = augmontStatus ? (STAGE_RANK[augmontStatus] ?? 0) : 0;
  const exception = augmontStatus ? EXCEPTIONS[augmontStatus] : undefined;

  const stages = [
    {
      id: "placed",
      label: "Order Placed",
      rank: 0,
      description: createdAt ? new Date(createdAt).toLocaleDateString() : "Received",
    },
    {
      id: "booked",
      label: "Booked",
      rank: 1,
      description: rank >= 1 ? "With Augmont" : "Awaiting sync",
    },
    {
      id: "payment",
      label: "Payment",
      rank: 2,
      description: rank >= 2 ? "Received" : "Pending",
    },
    { id: "processing", label: "Processing", rank: 3, description: "Being prepared" },
    {
      id: "dispatched",
      label: "Dispatched",
      rank: 4,
      description: augmontStatus === "re-dispatched" ? "Re-dispatched" : "On its way",
    },
    { id: "delivered", label: "Delivered", rank: 5, description: "Secure delivery" },
  ].map((stage) => ({
    ...stage,
    done: rank >= stage.rank,
    // The step immediately after wherever Augmont says we are.
    current: rank === stage.rank - 1,
  }));

  const completedCount = stages.filter((s) => s.done).length;
  const progressPercent = Math.max(
    0,
    Math.min(100, ((completedCount - 1) / (stages.length - 1)) * 100),
  );

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute top-2.5 left-6 right-6 h-1 bg-slate-200 dark:bg-slate-700 rounded-full -z-0" />

        {/* Active progress fill line */}
        <div
          className="absolute top-2.5 left-6 h-1 bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500 -z-0"
          style={{
            width: `calc(${progressPercent}% * (100% - 48px) / 100)`,
          }}
        />

        {stages.map((stage) => (
          <div key={stage.id} className="relative flex flex-col items-center group z-10">
            {/* Timeline Dot Node (No white gaps, solid colored nodes) */}
            <div className="h-6 w-6 flex items-center justify-center">
              {stage.done ? (
                <div className="h-5 w-5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              ) : stage.current ? (
                <div className="h-5 w-5 rounded-full bg-primary ring-4 ring-primary/20 flex items-center justify-center animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              ) : (
                <div className="h-3.5 w-3.5 rounded-full bg-slate-300 dark:bg-slate-600 border border-slate-400 dark:border-slate-500" />
              )}
            </div>

            {/* Stage Label Below Dot */}
            <div className="mt-2 text-center">
              <p
                className={`text-xs ${
                  stage.done || stage.current
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted-foreground/75"
                }`}
              >
                {stage.label}
              </p>
              <p className="text-[11px] text-muted-foreground/80 font-normal mt-0.5 hidden sm:block">
                {stage.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {exception && (
        <div className="mt-5 rounded-lg border border-warning/40 bg-warning/10 p-3 text-warning flex items-start gap-2.5">
          {augmontStatus === "returned to origin" ? (
            <Undo2 className="h-4 w-4 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-semibold text-xs">{exception.title}</h4>
            <p className="text-[11px] text-warning/90 mt-0.5">{exception.body}</p>
          </div>
        </div>
      )}

      {!augmontStatus && (
        <p className="text-xs text-muted-foreground mt-3">
          Live tracking appears once the status has been synced with our gold partner.
        </p>
      )}
    </div>
  );
}
