import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Boxes, Trash2, Minus, Plus, CheckCircle2, AlertTriangle } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { placeOrder } from "@/lib/api/customer";
import { formatInr } from "@/lib/api/augmont";
import { useAugmontStates, useAugmontCities } from "@/hooks/use-location-data";
import { ApiError } from "@/lib/api/types";
import type { OrderResponse, PlaceOrderRequest } from "@/lib/api/types";
import {
  useCart,
  removeLine,
  setLineQuantity,
  clearCart,
  cartDueToday,
  cartTotalValue,
  maxQuantityFor,
  isSpot,
  type CartLine,
} from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/customer/cart")({
  head: () => ({ meta: [{ title: "Your basket — 2+ Fortune Alliances" }] }),
  component: Page,
});

const TENURE_LABEL: Record<number, string> = {
  1: "3-month EMI",
  2: "6-month EMI",
  3: "9-month EMI",
  4: "Spot",
};

const checkoutSchema = z.object({
  panCardNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN, e.g. ABCDE1234F"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  addressLine: z.string().trim().min(1, "Address is required"),
  state: z.string().trim().min(1, "Select a state"),
  city: z.string().trim().min(1, "Select a city"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});
type CheckoutValues = z.infer<typeof checkoutSchema>;

/** One line's outcome — checkout places each independently, so these differ. */
interface LineResult {
  line: CartLine;
  order?: OrderResponse;
  error?: string;
}

function Page() {
  const { ready } = useRequireRole("ROLE_CUSTOMER");
  const navigate = useNavigate();
  const cart = useCart();

  const [isPlacing, setIsPlacing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [results, setResults] = useState<LineResult[] | null>(null);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      panCardNumber: "",
      dateOfBirth: "",
      addressLine: "",
      state: "",
      city: "",
      pincode: "",
    },
  });
  const stateValue = form.watch("state");
  const { data: states } = useAugmontStates();
  const { data: cities } = useAugmontCities(stateValue);

  if (!ready) return null;

  /**
   * Each line becomes its own Augmont order, so they're placed one at a time
   * and their outcomes tracked separately. A failure partway through must not
   * discard the orders already placed — those exist at Augmont and are billed.
   * Successful lines are dropped from the basket; failed ones stay so they can
   * be retried without re-adding.
   */
  async function onCheckout(values: CheckoutValues) {
    if (cart.length === 0) return;
    setIsPlacing(true);
    setResults(null);
    setProgress({ done: 0, total: cart.length });

    const out: LineResult[] = [];
    for (const [i, line] of cart.entries()) {
      const req: PlaceOrderRequest = {
        augmontProductId: line.augmontProductId,
        productName: line.productName,
        productSku: line.productSku,
        productWeight: line.productWeight,
        paymentTypeId: line.paymentTypeId,
        quantity: line.quantity,
        finalOrderPrice: line.finalOrderPrice,
        initialPayment: line.initialPayment,
        monthlyAmount: line.monthlyAmount,
        panCardNumber: values.panCardNumber,
        dateOfBirth: values.dateOfBirth,
        deliveryAddress: values.addressLine,
        deliveryCity: values.city,
        deliveryState: values.state,
        deliveryPincode: values.pincode,
      };
      try {
        out.push({ line, order: await placeOrder(req) });
      } catch (err) {
        out.push({
          line,
          error:
            err instanceof ApiError ? err.message : "Couldn't place this item. Please try again.",
        });
      }
      setProgress({ done: i + 1, total: cart.length });
    }

    for (const r of out) {
      if (r.order) removeLine(r.line.key);
    }

    setResults(out);
    setIsPlacing(false);
    setProgress(null);
  }

  // ── Results view ─────────────────────────────────────────────────────────
  if (results) {
    const placed = results.filter((r) => r.order);
    const failed = results.filter((r) => r.error);

    return (
      <DashboardShell role="customer" title="Order summary">
        <Panel title={failed.length === 0 ? "All orders placed" : "Some orders need attention"}>
          <p className="text-sm text-muted-foreground mb-5">
            {placed.length} of {results.length} item{results.length === 1 ? "" : "s"} placed
            successfully. Each item becomes its own order.
          </p>

          <ul className="divide-y divide-line">
            {results.map((r) => (
              <li key={r.line.key} className="flex items-start gap-3 py-3">
                {r.order ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-deep shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{r.line.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {TENURE_LABEL[r.line.paymentTypeId] ?? "—"} · Qty {r.line.quantity}
                  </p>
                  {r.error && <p className="text-xs text-destructive mt-1">{r.error}</p>}
                </div>
                {r.order && (
                  <Link
                    to="/customer/orders/$orderId"
                    params={{ orderId: String(r.order.id) }}
                    className="text-xs link-underline shrink-0"
                  >
                    Order #{r.order.id}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 pt-5">
            <Button variant="pill" size="sm" onClick={() => navigate({ to: "/customer/orders" })}>
              View my orders
            </Button>
            {failed.length > 0 && (
              <Button variant="pillOutline" size="sm" onClick={() => setResults(null)}>
                Retry remaining
              </Button>
            )}
            <Button variant="pillOutline" size="sm" onClick={() => navigate({ to: "/customer/shop" })}>
              Continue shopping
            </Button>
          </div>
        </Panel>
      </DashboardShell>
    );
  }

  // ── Empty basket ─────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <DashboardShell role="customer" title="Your basket">
        <Panel title="Your basket">
          <div className="py-14 text-center">
            <Boxes className="h-9 w-9 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-5">Your basket is empty.</p>
            <Button variant="pill" size="sm" onClick={() => navigate({ to: "/customer/shop" })}>
              Browse gold
            </Button>
          </div>
        </Panel>
      </DashboardShell>
    );
  }

  const dueToday = cartDueToday(cart);
  const totalValue = cartTotalValue(cart);

  return (
    <DashboardShell role="customer" title="Your basket">
      <div className="grid lg:grid-cols-[13fr_7fr] gap-6 lg:gap-10 items-start">
        {/* Items + delivery details */}
        <div className="space-y-6">
          <Panel
            title={`Basket (${cart.length} item${cart.length === 1 ? "" : "s"})`}
            action={
              <Button variant="pillOutline" size="sm" onClick={clearCart} disabled={isPlacing}>
                Clear basket
              </Button>
            }
          >
            <ul className="divide-y divide-line">
              {cart.map((line) => {
                const cap = maxQuantityFor(line.paymentTypeId);
                return (
                  <li key={line.key} className="flex items-start gap-4 py-4">
                    <div className="h-14 w-14 rounded-md border border-line bg-stone grid place-items-center overflow-hidden shrink-0">
                      {line.thumbnail ? (
                        <img
                          src={line.thumbnail}
                          alt={line.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Boxes className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">{line.productName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {line.productWeight}g · {line.productSku}
                      </p>
                      <Badge variant="outline" className="mt-1.5 text-[11px]">
                        {TENURE_LABEL[line.paymentTypeId] ?? "—"}
                      </Badge>

                      <div className="flex items-center gap-2 mt-2.5">
                        <Button
                          variant="pillOutline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          disabled={isPlacing}
                          onClick={() => setLineQuantity(line.key, line.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-6 text-center">{line.quantity}</span>
                        <Button
                          variant="pillOutline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          disabled={isPlacing || line.quantity >= cap}
                          onClick={() => setLineQuantity(line.key, line.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {!isSpot(line.paymentTypeId) && (
                          <span className="text-[11px] text-muted-foreground ml-1">
                            EMI plans are one item per order
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-ink">
                        {formatInr(line.finalOrderPrice * line.quantity)}
                      </p>
                      {!isSpot(line.paymentTypeId) && line.monthlyAmount != null && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatInr(line.monthlyAmount)}/mo
                        </p>
                      )}
                      <Button
                        variant="pillOutline"
                        size="sm"
                        className="mt-2 h-7 text-destructive border-destructive/40"
                        disabled={isPlacing}
                        onClick={() => removeLine(line.key)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Form {...form}>
            <form id="checkout-form" onSubmit={form.handleSubmit(onCheckout)} noValidate>
              <div className="space-y-6">
                <Panel title="Identity verification">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="panCardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN number</FormLabel>
                          <FormControl>
                            <Input placeholder="ABCDE1234F" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Panel>

                <Panel title="Shipping address">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="addressLine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-[2fr_2fr_1.2fr] gap-4">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                                form.setValue("city", "");
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {states?.map((s) => (
                                  <SelectItem key={s.id} value={s.name}>
                                    {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!stateValue}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={stateValue ? "Select city" : "Select a state first"}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cities?.map((c) => (
                                  <SelectItem key={c.id} value={c.name}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Panel>
              </div>
            </form>
          </Form>
        </div>

        {/* Summary */}
        <Panel title="Order summary" className="lg:sticky lg:top-24">
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>{cart.reduce((n, l) => n + l.quantity, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total contract value</span>
              <span>{formatInr(totalValue)}</span>
            </div>
            <div className="flex items-center justify-between pt-2.5 border-t border-line">
              <span className="font-medium text-ink">Payable today</span>
              <span className="font-display text-lg">{formatInr(dueToday)}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Each item is placed as its own order with our gold partner. EMI items show only the
            down payment here; instalments follow their own schedule.
          </p>

          <Button
            type="submit"
            form="checkout-form"
            variant="default"
            className="w-full h-14 mt-5"
            disabled={isPlacing}
          >
            {isPlacing && <Spinner size={16} className="mr-2" label="" />}
            {isPlacing && progress
              ? `Placing ${progress.done + 1} of ${progress.total}…`
              : `Place ${cart.length} order${cart.length === 1 ? "" : "s"}`}
          </Button>
        </Panel>
      </div>
    </DashboardShell>
  );
}
