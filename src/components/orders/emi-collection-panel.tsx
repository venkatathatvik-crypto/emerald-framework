import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HandCoins, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { formatInr } from "@/lib/api/augmont";
import type {
  AugmontEmiSchedule,
  EmiPayment,
  EmiQuote,
  RecordEmiPaymentRequest,
} from "@/lib/api/types";

/**
 * The three calls this panel needs, injected rather than imported, because the
 * same UI is used by branch staff and by admin against role-scoped endpoints.
 */
export interface EmiCollectionApi {
  quote: (orderId: number, body: RecordEmiPaymentRequest) => Promise<EmiQuote>;
  record: (orderId: number, body: RecordEmiPaymentRequest) => Promise<EmiPayment>;
  list: (orderId: number) => Promise<EmiPayment[]>;
}

interface EmiCollectionPanelProps {
  orderId: number;
  /** Augmont's instalment rows, as returned by the order's EMI schedule. */
  schedule?: AugmontEmiSchedule["orderemidetails"];
  api: EmiCollectionApi;
  /** Called after a successful collection so the caller can refetch the schedule. */
  onRecorded?: () => void;
}

/** True when Augmont reports money already received against the instalment. */
function isPaid(row: AugmontEmiSchedule["orderemidetails"][number]): boolean {
  return row.paymentRecievedDate != null || row.orderemistatus?.statusName === "PAID";
}

/**
 * Records cash collected against an order's EMI instalments.
 *
 * Deliberately a two-step flow: the amount shown always comes from Augmont's
 * own quote rather than a local sum, so staff confirm the exact figure Augmont
 * will settle before any money is marked as taken. Nothing here moves money —
 * it records a collection that happened at the counter.
 */
export function EmiCollectionPanel({
  orderId,
  schedule,
  api,
  onRecorded,
}: EmiCollectionPanelProps) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [reference, setReference] = React.useState("");
  const [quote, setQuote] = React.useState<EmiQuote | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const paymentsQuery = useQuery({
    queryKey: ["emi-payments", orderId],
    queryFn: () => api.list(orderId),
  });

  const unpaid = (schedule ?? []).filter((row) => !isPaid(row));

  // A quote is only valid for the instalments it was asked about; changing the
  // selection has to invalidate it or staff could confirm against a stale figure.
  function toggle(emiId: number) {
    setQuote(null);
    setError(null);
    setSelected((prev) =>
      prev.includes(emiId) ? prev.filter((id) => id !== emiId) : [...prev, emiId],
    );
  }

  const quoteMutation = useMutation({
    mutationFn: () => api.quote(orderId, { emiIds: selected }),
    onSuccess: (data) => {
      setQuote(data);
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  const recordMutation = useMutation({
    mutationFn: () =>
      api.record(orderId, {
        emiIds: selected,
        collectionReference: reference.trim() || undefined,
      }),
    onSuccess: () => {
      setSelected([]);
      setReference("");
      setQuote(null);
      setError(null);
      void queryClient.invalidateQueries({ queryKey: ["emi-payments", orderId] });
      onRecorded?.();
    },
    onError: (err: Error) => setError(err.message),
  });

  const busy = quoteMutation.isPending || recordMutation.isPending;

  return (
    <Panel title="Record EMI collection">
      <p className="text-xs text-muted-foreground mb-4">
        For cash taken at the counter. Select the instalments settled, confirm the amount
        Augmont quotes, then record it.
      </p>

      {unpaid.length === 0 ? (
        <p className="text-xs text-muted-foreground py-3 text-center">
          {schedule && schedule.length > 0
            ? "Every instalment on this order is already paid."
            : "No instalments available to collect against."}
        </p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {unpaid.map((row) => (
              <label
                key={row.emiId}
                className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 cursor-pointer hover:bg-stone/50"
              >
                <Checkbox
                  checked={selected.includes(row.emiId)}
                  onCheckedChange={() => toggle(row.emiId)}
                  disabled={busy}
                  aria-label={`Instalment ${row.emiId}`}
                />
                <span className="text-xs font-medium text-ink flex-1">
                  Instalment #{row.emiId}
                </span>
                <span className="text-xs text-muted-foreground">
                  Due {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "—"}
                </span>
                <span className="text-xs font-medium">{formatInr(row.emiAmount)}</span>
              </label>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`emi-ref-${orderId}`} className="text-xs">
              Receipt reference <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id={`emi-ref-${orderId}`}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. counter receipt no."
              maxLength={200}
              disabled={busy}
            />
          </div>

          {quote && (
            <div
              className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 space-y-1"
              aria-live="polite"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Augmont quotes</span>
                <span className="font-display text-base text-primary">
                  {formatInr(quote.amount)}
                </span>
              </div>
              {quote.outstandingBalance != null && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Outstanding on this order</span>
                  <span>{formatInr(quote.outstandingBalance)}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="pillOutline"
              size="sm"
              disabled={selected.length === 0 || busy}
              onClick={() => quoteMutation.mutate()}
            >
              {quoteMutation.isPending && <Spinner size={14} className="mr-1.5" label="" />}
              {quoteMutation.isPending ? "Checking…" : "Get quote"}
            </Button>
            <Button
              variant="pill"
              size="sm"
              disabled={!quote || busy}
              onClick={() => recordMutation.mutate()}
            >
              {recordMutation.isPending ? (
                <Spinner size={14} className="mr-1.5" label="" />
              ) : (
                <HandCoins className="h-3.5 w-3.5 mr-1.5" />
              )}
              {recordMutation.isPending ? "Recording…" : "Record payment"}
            </Button>
          </div>
        </div>
      )}

      {/* Already-recorded collections, so staff can see what's been taken before. */}
      {paymentsQuery.data && paymentsQuery.data.length > 0 && (
        <div className="mt-5 pt-4 border-t border-line space-y-2">
          <p className="text-xs font-medium text-ink">Collections recorded</p>
          {paymentsQuery.data.map((p) => (
            <div key={p.id} className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
              <span className="font-medium">{formatInr(p.amount)}</span>
              <span className="text-muted-foreground">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
              {p.augmontEmiIds && (
                <Badge variant="outline" className="text-[10px]">
                  EMI {p.augmontEmiIds}
                </Badge>
              )}
              {p.recordedByName && (
                <span className="text-muted-foreground ml-auto">by {p.recordedByName}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
