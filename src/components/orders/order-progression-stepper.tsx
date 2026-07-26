import { Check, PackageX, AlertTriangle } from "lucide-react";
import type { OrderStatus } from "@/lib/api/types";

interface OrderProgressionStepperProps {
  status: OrderStatus;
  augmontStatusName?: string | null;
  createdAt?: string;
}

export function OrderProgressionStepper({
  status,
  augmontStatusName,
  createdAt,
}: OrderProgressionStepperProps) {
  if (status === "CANCELLED") {
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

  const isConfirmed = status === "CONFIRMED";
  const isPending = status === "PENDING";

  // Stages definition
  const stages = [
    {
      id: "placed",
      label: "Order Placed",
      done: true,
      current: isPending,
      description: createdAt ? new Date(createdAt).toLocaleDateString() : "Received",
    },
    {
      id: "payment",
      label: "Payment Confirmed",
      done: isConfirmed,
      current: false,
      description: isConfirmed ? "EMI Active" : "Pending",
    },
    {
      id: "augmont",
      label: "Augmont Booked",
      done: isConfirmed && Boolean(augmontStatusName),
      current: isConfirmed && !augmontStatusName,
      description: augmontStatusName ? augmontStatusName : isConfirmed ? "Syncing…" : "Awaiting",
    },
    {
      id: "dispatched",
      label: "Dispatched",
      done: false,
      current: false,
      description: "Vault Dispatch",
    },
    {
      id: "transit",
      label: "In Transit",
      done: false,
      current: false,
      description: "Courier Partner",
    },
    {
      id: "delivered",
      label: "Delivered",
      done: false,
      current: false,
      description: "Secure Delivery",
    },
  ];

  // Calculate filled progress track percentage
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
    </div>
  );
}
