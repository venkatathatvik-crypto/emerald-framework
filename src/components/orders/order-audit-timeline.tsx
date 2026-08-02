import { Clock, ShieldCheck, FileText, Building2, CheckCircle2 } from "lucide-react";
import type { OrderResponse } from "@/lib/api/types";

interface OrderAuditTimelineProps {
  order: OrderResponse;
}

export function OrderAuditTimeline({ order }: OrderAuditTimelineProps) {
  const events = [
    {
      id: "created",
      title: "Order Placed & EMI Agreement Created",
      description: `Order #${order.id} initialized for ${order.productName} (${order.productWeight}g).`,
      timestamp: new Date(order.createdAt).toLocaleString(),
      icon: Clock,
      status: "success",
    },
  ];

  if (order.status === "CONFIRMED") {
    events.push({
      id: "confirmed",
      title: "Payment Confirmed & EMI Active",
      description: "Downpayment/initial instalment verified. Order marked active.",
      timestamp: new Date(order.createdAt).toLocaleString(),
      icon: CheckCircle2,
      status: "success",
    });
  }

  if (order.augmontOrderId) {
    events.push({
      id: "augmont_sync",
      title: "Augmont Gold Booking Synced",
      description: `Partner Order ID #${order.augmontOrderId} ${
        order.augmontStatusName ? `(${order.augmontStatusName})` : ""
      }. Gold locked in vault.`,
      timestamp: new Date(order.createdAt).toLocaleString(),
      icon: Building2,
      status: "info",
    });
  }

  if (order.status === "CANCELLED") {
    events.push({
      id: "cancelled",
      title: "Order Cancelled",
      // The customer's stated reason is passed straight to Augmont and never
      // stored our side, and there's no cancelledAt column either — so neither
      // the reason nor the real time can be shown here yet. Stamping
      // Date.now() would just be a plausible-looking lie.
      description: "Cancellation requested and verified.",
      timestamp: "—",
      icon: ShieldCheck,
      status: "destructive",
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" /> Activity Audit Timeline
      </h3>
      <div className="relative pl-6 border-l-2 border-line space-y-6">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full border bg-surface text-xs ${
                  event.status === "success"
                    ? "border-emerald text-emerald"
                    : event.status === "destructive"
                      ? "border-destructive text-destructive"
                      : "border-primary text-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-xs text-ink">{event.title}</p>
                  <span className="text-[10px] text-muted-foreground/80 font-light">
                    {event.timestamp}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
