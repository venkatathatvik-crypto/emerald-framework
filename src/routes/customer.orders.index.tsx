import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Boxes,
  ChevronRight,
  FileText,
  Receipt,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import {
  listMyOrders,
  getOrderContractReceipt,
  getOrderProformaInvoiceReceipt,
} from "@/lib/api/customer";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatInr } from "@/lib/api/augmont";
import type { OrderResponse, OrderStatus } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/customer/orders/")({
  head: () => ({ meta: [{ title: "My Orders — 2+ Fortune Alliances" }] }),
  component: Page,
});

const PAGE_SIZE = 20;

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "AUGMONT_FAILED", label: "Needs attention" },
  { value: "CANCELLED", label: "Cancelled" },
];

async function openReceipt(fetcher: () => Promise<{ url: string }>) {
  try {
    const receipt = await fetcher();
    window.open(receipt.url, "_blank", "noopener,noreferrer");
  } catch {
    // best-effort — the download icon itself doesn't need its own error banner
  }
}

/**
 * CANCELLED/AUGMONT_FAILED/PENDING are our own authoritative local facts —
 * shown as-is. Only CONFIRMED is replaced with Augmont's own live status
 * text (populated whenever the order-detail page has been visited at least
 * once, since that's where refresh happens) — no fallback to "Confirmed"
 * once Augmont's own wording is what we're supposed to show instead.
 */
function StatusCell({ order }: { order: OrderResponse }) {
  if (order.status !== "CONFIRMED") {
    return (
      <OrderStatusBadge status={order.status} className="rounded-full text-[11px] px-2 py-0" />
    );
  }
  if (order.augmontStatusName) {
    return (
      <Badge variant="outline" className="rounded-full text-[11px] px-2 py-0 capitalize">
        {order.augmontStatusName}
      </Badge>
    );
  }
  return <span className="text-xs text-muted-foreground">Not synced yet</span>;
}

function Page() {
  const { ready } = useRequireRole("ROLE_CUSTOMER");
  const navigate = useNavigate();

  const [status, setStatus] = useState<string>("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer", "orders", { status, from, to, page }],
    queryFn: () =>
      listMyOrders({
        status: status === "ALL" ? undefined : (status as OrderStatus),
        from: from || undefined,
        to: to || undefined,
        page,
        size: PAGE_SIZE,
      }),
    enabled: ready,
  });

  if (!ready) {
    return null;
  }

  const rawOrders = data?.items ?? [];

  const orders = [...rawOrders].sort((a, b) => {
    if (!sortField) return 0;
    const valA: unknown = (a as Record<string, unknown>)[sortField];
    const valB: unknown = (b as Record<string, unknown>)[sortField];

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === "number" && typeof valB === "number") {
      return sortDir === "asc" ? valA - valB : valB - valA;
    }

    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();

    if (strA < strB) return sortDir === "asc" ? -1 : 1;
    if (strA > strB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortField(null);
        setSortDir("asc");
      }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 ml-1.5" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0 ml-1.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0 ml-1.5" />
    );
  };

  return (
    <DashboardShell role="customer" title="My orders">
      <Panel
        title="Order history"
        action={
          <div className="flex items-center gap-3 flex-wrap">
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(0);
              }}
              className="w-40"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(0);
              }}
              className="w-40"
            />
          </div>
        }
      >
        {isError && (
          <p className="text-sm text-destructive py-6">
            Failed to load your orders. Please try again.
          </p>
        )}

        {!isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("id")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Order ID</span>
                    {renderSortIcon("id")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("productName")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Product</span>
                    {renderSortIcon("productName")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("finalOrderPrice")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Amount</span>
                    {renderSortIcon("finalOrderPrice")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("status")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Status</span>
                    {renderSortIcon("status")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("createdAt")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Date</span>
                    {renderSortIcon("createdAt")}
                  </button>
                </TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Loading orders…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    {status === "ALL" && !from && !to
                      ? "You haven't placed any orders yet."
                      : "No orders match these filters."}
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => {
                const hasAugmontOrder = order.augmontOrderId != null;
                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-stone/60"
                    onClick={() =>
                      navigate({
                        to: "/customer/orders/$orderId",
                        params: { orderId: String(order.id) },
                      })
                    }
                  >
                    <TableCell className="py-5">
                      {/* Order history doesn't carry a per-order image (only the shop/detail
                          views fetch Augmont product data) — a generic icon here avoids an
                          extra product lookup per row. */}
                      <div className="h-11 w-11 rounded-md border border-line bg-stone grid place-items-center">
                        <Boxes className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-sm text-muted-foreground">
                      #{order.id}
                    </TableCell>
                    <TableCell className="py-5">
                      <p className="font-semibold text-ink">{order.productName}</p>
                      <p className="text-xs text-muted-foreground/80 font-light mt-0.5">
                        {order.productWeight}g
                      </p>
                    </TableCell>
                    <TableCell className="py-5">
                      {formatInr(order.finalOrderPrice ?? undefined)}
                    </TableCell>
                    <TableCell className="py-5">
                      <StatusCell order={order} />
                    </TableCell>
                    <TableCell className="py-5 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-5">
                      {hasAugmontOrder ? (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            title="Download contract"
                            onClick={() => openReceipt(() => getOrderContractReceipt(order.id))}
                            className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-emerald-deep hover:bg-stone transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            title="Download proforma invoice"
                            onClick={() =>
                              openReceipt(() => getOrderProformaInvoiceReceipt(order.id))
                            }
                            className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-emerald-deep hover:bg-stone transition-colors"
                          >
                            <Receipt className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="py-5 text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
            <span>
              Page {data.page + 1} of {data.totalPages} · {data.totalItems} total
            </span>
            <div className="flex gap-2">
              <Button
                variant="pillOutline"
                size="sm"
                disabled={data.page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="pillOutline"
                size="sm"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </DashboardShell>
  );
}
