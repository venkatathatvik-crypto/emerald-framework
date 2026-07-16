import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/api/types";

const LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  AUGMONT_FAILED: "Needs attention",
  CANCELLED: "Cancelled",
};

const VARIANT: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  AUGMONT_FAILED: "destructive",
  CANCELLED: "outline",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANT[status]}>{LABEL[status]}</Badge>;
}
