import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  RefreshCcw,
  FileText,
  Receipt,
  XCircle,
  Boxes,
  Building2,
  User,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell, Panel } from "@/components/DashboardShell";
import { OrderProgressionStepper } from "./order-progression-stepper";
import { OrderAuditTimeline } from "./order-audit-timeline";
import { formatInr, getProductThumbnail } from "@/lib/api/augmont";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import type { OrderResponse } from "@/lib/api/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TENURE_LABEL: Record<number, string> = {
  1: "3-month EMI",
  2: "6-month EMI",
  3: "9-month EMI",
  4: "Spot (pay in full)",
};

interface OrderDetailLayoutProps {
  order: OrderResponse;
  role: "customer" | "branch" | "partner" | "admin";
  isRefreshing: boolean;
  onRefreshStatus: () => void;
  product?: Record<string, unknown>;
  emiSchedule?: Record<string, unknown>[];
  emiLoading?: boolean;
  onOpenContract: () => void;
  onOpenProforma: () => void;
  onOpenEmiReceipt?: (instalmentNo: number) => void;
  onCancelClick?: () => void;
  cancelDialog?: React.ReactNode;
  backUrl?: string;
}

export function OrderDetailLayout({
  order,
  role,
  isRefreshing,
  onRefreshStatus,
  product,
  emiSchedule,
  emiLoading,
  onOpenContract,
  onOpenProforma,
  onOpenEmiReceipt,
  onCancelClick,
  cancelDialog,
  backUrl,
}: OrderDetailLayoutProps) {
  const thumb = product ? getProductThumbnail(product) : null;
  const isConfirmed = order.status === "CONFIRMED";
  const canCancel = (isConfirmed || order.status === "PENDING") && role === "customer";

  const defaultBackUrl =
    role === "customer"
      ? "/customer/orders"
      : role === "branch"
        ? "/branch/orders"
        : role === "partner"
          ? "/partner/orders"
          : "/admin/orders";

  return (
    <DashboardShell role={role} title={`Order #${order.id}`}>
      <Link
        to={backUrl || defaultBackUrl}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      <div className="space-y-6">
        {/* Header Action Bar Panel */}
        <Panel
          title={`Order #${order.id}`}
          action={
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="pillOutline"
                size="sm"
                disabled={isRefreshing}
                onClick={onRefreshStatus}
              >
                <RefreshCcw
                  className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Checking…" : "Refresh status"}
              </Button>
              <Button variant="pillOutline" size="sm" onClick={onOpenContract}>
                <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" /> Contract
              </Button>
              <Button variant="pillOutline" size="sm" onClick={onOpenProforma}>
                <Receipt className="h-3.5 w-3.5 mr-1.5 text-primary" /> Proforma Invoice
              </Button>
              {canCancel && onCancelClick && (
                <Button variant="pillDestructive" size="sm" onClick={onCancelClick}>
                  <XCircle className="h-3.5 w-3.5 mr-1.5" /> Cancel order
                </Button>
              )}
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <OrderStatusBadge status={order.status} />
            </div>
            {order.augmontStatusName && (
              <Badge variant="outline" className="capitalize text-xs">
                Augmont: {order.augmontStatusName}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Stepper */}
          <OrderProgressionStepper
            status={order.status}
            augmontStatusName={order.augmontStatusName}
            createdAt={order.createdAt}
          />
        </Panel>

        {/* 2-Column Responsive Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column (Main Details & Schedule - 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Item & Gold Breakdown Panel */}
            <Panel title="Product & Metal Details">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-lg border border-line bg-stone flex items-center justify-center overflow-hidden shrink-0">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={order.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Boxes className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-ink text-base">{order.productName}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span>
                      Weight: <strong className="text-ink">{order.productWeight}g</strong>
                    </span>
                    <span>
                      Purity: <strong className="text-ink">24K (999 Purity)</strong>
                    </span>
                    <span>
                      Tenure:{" "}
                      <strong className="text-ink">
                        {TENURE_LABEL[order.tenureMonths] || `${order.tenureMonths} Months`}
                      </strong>
                    </span>
                  </div>
                  <p className="font-display text-lg text-primary pt-1">
                    {formatInr(order.finalOrderPrice)}
                  </p>
                </div>
              </div>
            </Panel>

            {/* EMI Repayment Schedule */}
            <Panel title="EMI Repayment Schedule">
              {emiLoading ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  Loading EMI schedule…
                </p>
              ) : emiSchedule && emiSchedule.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instalment</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      {onOpenEmiReceipt && <TableHead className="text-right">Receipt</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emiSchedule.map((row: Record<string, unknown>, idx: number) => {
                      const instalmentNo =
                        (row.instalmentNo as number) ?? (row.emiId as number) ?? idx + 1;
                      const dueDate = row.dueDate as string;
                      const amount = (row.amount as number) ?? (row.emiAmount as number);
                      const statusName =
                        ((row.orderemistatus as Record<string, unknown>)?.statusName as string) ??
                        (row.status as string) ??
                        "DUE";
                      const isPaid = row.paymentRecievedDate != null || statusName === "PAID";

                      return (
                        <TableRow key={String(instalmentNo)}>
                          <TableCell className="font-medium text-xs text-ink">
                            Instalment #{instalmentNo}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {dueDate ? new Date(dueDate).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell className="font-medium text-xs">{formatInr(amount)}</TableCell>
                          <TableCell>
                            <Badge variant={isPaid ? "success" : "outline"} className="text-[10px]">
                              {statusName}
                            </Badge>
                          </TableCell>
                          {onOpenEmiReceipt && (
                            <TableCell className="text-right">
                              {isPaid ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-primary"
                                  onClick={() => onOpenEmiReceipt(instalmentNo)}
                                >
                                  Download
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No EMI schedule records found.
                </p>
              )}
            </Panel>

            {/* Audit History Timeline */}
            <Panel>
              <OrderAuditTimeline order={order} />
            </Panel>
          </div>

          {/* Right Column (Financial & Context Sidebar - 1 col) */}
          <div className="space-y-6">
            {/* Financial Summary Card */}
            <Panel title="Payment Summary">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Product Price</span>
                  <span className="font-medium">{formatInr(order.finalOrderPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tenure</span>
                  <span>{TENURE_LABEL[order.tenureMonths] || `${order.tenureMonths} Months`}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Augmont Order Ref</span>
                  <span className="font-mono text-xs">{order.augmontOrderId || "—"}</span>
                </div>
                <div className="pt-3 border-t border-line flex items-center justify-between font-semibold">
                  <span>Total Amount</span>
                  <span className="text-primary font-display text-lg">
                    {formatInr(order.finalOrderPrice)}
                  </span>
                </div>
              </div>
            </Panel>

            {/* Customer / Branch Attribution Context */}
            <Panel title="Attribution Context">
              <div className="space-y-3 text-xs">
                {order.customerName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p className="font-medium text-ink">{order.customerName}</p>
                    </div>
                  </div>
                )}
                {order.branchName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Branch</p>
                      <p className="font-medium text-ink">{order.branchName}</p>
                    </div>
                  </div>
                )}
                {order.partnerName && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Partner Alliance</p>
                      <p className="font-medium text-ink">{order.partnerName}</p>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {cancelDialog}
    </DashboardShell>
  );
}
