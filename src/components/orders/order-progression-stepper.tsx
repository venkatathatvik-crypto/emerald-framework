import {
  CheckCircle2,
  Circle,
  PackageX,
  AlertTriangle,
  Clock,
  Truck,
  PackageCheck,
  Building2,
} from "lucide-react";
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
      icon: Clock,
      done: true,
      current: isPending,
      description: createdAt ? new Date(createdAt).toLocaleDateString() : "Received",
    },
    {
      id: "payment",
      label: "Payment Confirmed",
      icon: CheckCircle2,
      done: isConfirmed,
      current: false,
      description: isConfirmed ? "EMI Active" : "Pending",
    },
    {
      id: "augmont",
      label: "Augmont Booked",
      icon: Building2,
      done: isConfirmed && Boolean(augmontStatusName),
      current: isConfirmed && !augmontStatusName,
      description: augmontStatusName ? augmontStatusName : isConfirmed ? "Syncing…" : "Awaiting",
    },
    {
      id: "dispatched",
      label: "Dispatched",
      icon: Truck,
      done: false,
      current: false,
      description: "Vault Dispatch",
    },
    {
      id: "transit",
      label: "In Transit",
      icon: Truck,
      done: false,
      current: false,
      description: "Courier Partner",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: PackageCheck,
      done: false,
      current: false,
      description: "Secure Delivery",
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="relative flex items-center justify-between">
        {/* Connection line behind step icons */}
        <div
          className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-line"
          aria-hidden="true"
        />

        {stages.map((stage, idx) => {
          const IconComponent = stage.icon;
          return (
            <div
              key={stage.id}
              className="relative flex flex-col items-center group z-10 bg-surface px-1"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  stage.done
                    ? "border-emerald bg-emerald text-white"
                    : stage.current
                      ? "border-primary bg-primary/10 text-primary ring-4 ring-primary/20"
                      : "border-line bg-paper text-muted-foreground"
                }`}
              >
                {stage.done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : stage.current ? (
                  <IconComponent className="h-4 w-4 animate-pulse" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40" />
                )}
              </div>

              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-semibold ${
                    stage.done || stage.current ? "text-ink" : "text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-[10px] text-muted-foreground/80 font-light hidden sm:block">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
