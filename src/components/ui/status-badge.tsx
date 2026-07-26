import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusCategory = "order" | "branch" | "augmont" | "lead" | "general";

export interface StatusBadgeProps extends Omit<BadgeProps, "children"> {
  status: string;
  category?: StatusCategory;
  showIcon?: boolean;
  customLabel?: string;
}

export function StatusBadge({
  status,
  category = "general",
  showIcon = true,
  customLabel,
  className,
  ...props
}: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  let variant: BadgeProps["variant"] = "secondary";
  let label = customLabel || status || "Unknown";
  let IconComponent: React.ComponentType<{ className?: string }> | null = null;

  switch (normalized) {
    case "CONFIRMED":
    case "BOOKED":
    case "PAID":
    case "DELIVERED":
    case "COMPLETED":
    case "ACTIVE":
    case "HEALTHY":
    case "SYNCED":
    case "AUGMONT_SYNCED":
    case "SUCCESS":
      variant = "success";
      label =
        customLabel ||
        (normalized === "AUGMONT_SYNCED"
          ? "Augmont Synced"
          : normalized.charAt(0) + normalized.slice(1).toLowerCase());
      IconComponent = CheckCircle2;
      break;

    case "PENDING":
    case "PROCESSING":
    case "IN_PROGRESS":
    case "DISPATCHED":
    case "IN_TRANSIT":
    case "UPCOMING":
      variant = "info";
      label =
        customLabel ||
        normalized
          .split("_")
          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
          .join(" ");
      IconComponent = Clock;
      break;

    case "CANCELLED":
    case "FAILED":
    case "AUGMONT_FAILED":
    case "SYNC_FAILED":
    case "DEACTIVATED":
    case "UNHEALTHY":
    case "EXPIRED":
    case "REJECTED":
      variant = "destructive";
      label =
        customLabel ||
        normalized
          .split("_")
          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
          .join(" ");
      IconComponent = XCircle;
      break;

    case "LOW_INVENTORY":
    case "HIGH_DEFAULT":
    case "PARTIAL":
    case "WARNING":
    case "ACTION_REQUIRED":
      variant = "warning";
      label =
        customLabel ||
        normalized
          .split("_")
          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
          .join(" ");
      IconComponent = AlertTriangle;
      break;

    case "GOLD_RESERVED":
    case "GOLD_EMERALD":
    case "VIP":
    case "PREMIUM":
      variant = "gold";
      label =
        customLabel ||
        normalized
          .split("_")
          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
          .join(" ");
      IconComponent = ShieldCheck;
      break;

    default:
      variant = "secondary";
      label = customLabel || status;
      break;
  }

  return (
    <Badge
      variant={variant}
      className={cn("gap-1.5 font-medium shadow-none", className)}
      {...props}
    >
      {showIcon && IconComponent && <IconComponent className="size-3.5 shrink-0" />}
      <span>{label}</span>
    </Badge>
  );
}
