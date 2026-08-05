import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, RefreshCcw, FileText, Receipt } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { OrderDetailLayout } from "@/components/orders/order-detail-layout";
import { EmiCollectionPanel } from "@/components/orders/emi-collection-panel";
import { OrderRefundPanel } from "@/components/orders/order-refund-panel";
import {
  getOrder,
  refreshOrderStatus,
  getOrderEmiSchedule,
  getOrderContractReceipt,
  getOrderProformaInvoiceReceipt,
  getOrderEmiReceipt,
  quoteEmiPayment,
  recordEmiPayment,
  listEmiPayments,
} from "@/lib/api/admin";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatInr } from "@/lib/api/augmont";
import { Button } from "@/components/ui/button";
import { FullPageLoader } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Augmont paymentTypeId 4 — a spot order has no instalments to collect against. */
const SPOT_PAYMENT_TYPE_ID = 4;

/**
 * Collection is only offered on a live EMI order: a cancelled one is finished,
 * and PENDING/AUGMONT_FAILED never reached Augmont so have no instalment ids.
 */
function canCollectEmiOn(order: { paymentTypeId: number; status: string }): boolean {
  return order.status === "CONFIRMED" && order.paymentTypeId !== SPOT_PAYMENT_TYPE_ID;
}

export const Route = createFileRoute("/admin/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order details — Admin" }] }),
  component: Page,
});

function Page() {
  const { orderId } = Route.useParams();
  const { ready } = useRequireRole("ROLE_ADMIN");
  const queryClient = useQueryClient();

  const id = Number(orderId);
  const enabled = ready && Number.isFinite(id);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => getOrder(id),
    enabled,
  });

  const canSyncAugmont = order?.augmontOrderId != null;

  const { data: schedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ["admin", "order", id, "emi-schedule"],
    queryFn: () => getOrderEmiSchedule(id),
    enabled: enabled && canSyncAugmont,
  });

  if (!ready) {
    return null;
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    setRefreshError(null);
    try {
      await refreshOrderStatus(id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "order", id] });
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
      // best-effort — the download button itself doesn't need its own error banner
    }
  }

  if (isLoading) {
    return (
      <DashboardShell role="admin" title="Order details">
        <FullPageLoader />
      </DashboardShell>
    );
  }

  if (isError || !order) {
    return (
      <DashboardShell role="admin" title="Order details">
        <p className="text-sm text-destructive py-10 text-center">Failed to load this order.</p>
      </DashboardShell>
    );
  }

  const canCollectEmi = canCollectEmiOn(order);

  return (
    <OrderDetailLayout
      order={order}
      role="admin"
      isRefreshing={isRefreshing}
      onRefreshStatus={handleRefresh}
      refreshError={refreshError}
      emiSchedule={schedule?.orderemidetails}
      emiLoading={scheduleLoading}
      onOpenContract={() => openReceipt(() => getOrderContractReceipt(id))}
      onOpenProforma={() => openReceipt(() => getOrderProformaInvoiceReceipt(id))}
      onOpenEmiReceipt={(instalmentNo) => openReceipt(() => getOrderEmiReceipt(id, instalmentNo))}
      emiCollection={
        canCollectEmi ? (
          <EmiCollectionPanel
            orderId={id}
            schedule={schedule?.orderemidetails}
            api={{ quote: quoteEmiPayment, record: recordEmiPayment, list: listEmiPayments }}
            onRecorded={() =>
              queryClient.invalidateQueries({ queryKey: ["admin", "order", id, "emi-schedule"] })
            }
          />
        ) : undefined
      }
      refundPanel={order.status === "CANCELLED" ? <OrderRefundPanel orderId={id} /> : undefined}
    />
  );
}
