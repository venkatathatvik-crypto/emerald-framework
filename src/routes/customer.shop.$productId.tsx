import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ArrowLeft, Boxes, CheckCircle2, AlertTriangle } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { useAugmontStates, useAugmontCities } from "@/hooks/use-location-data";
import {
  getProductDetails,
  getSubCategoryImage,
  getProductPriceTier,
  getProductThumbnail,
  formatInr,
} from "@/lib/api/augmont";
import { placeOrder } from "@/lib/api/customer";
import { ApiError } from "@/lib/api/types";
import type { AugmontProductPriceTier, PlaceOrderRequest, OrderResponse } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FullPageLoader } from "@/components/ui/spinner";
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

export const Route = createFileRoute("/customer/shop/$productId")({
  head: () => ({ meta: [{ title: "Product details — 2+ Fortune Alliances" }] }),
  component: Page,
});

type Tenure = "spot" | "three" | "six" | "nine";

const TENURE_LABELS: Record<Tenure, string> = {
  spot: "Pay in full",
  three: "3 months",
  six: "6 months",
  nine: "9 months",
};

function pricingFor(tier: AugmontProductPriceTier | null, tenure: Tenure) {
  if (!tier) return { dueToday: undefined, monthly: undefined, months: 0 };
  switch (tenure) {
    case "spot":
      return { dueToday: tier.finalProductPrice, monthly: undefined, months: 0 };
    case "three":
      return {
        dueToday: tier.initialPaymentThree,
        monthly: tier.paymentAmountPerMonthThree,
        months: 3,
      };
    case "six":
      return {
        dueToday: tier.initialPaymentSix,
        monthly: tier.paymentAmountPerMonthSix,
        months: 6,
      };
    case "nine":
      return {
        dueToday: tier.initialPaymentNine,
        monthly: tier.paymentAmountPerMonthNine,
        months: 9,
      };
  }
}

const TENURE_TO_PAYMENT_TYPE_ID: Record<Tenure, number> = {
  spot: 4,
  three: 1,
  six: 2,
  nine: 3,
};

function toNumber(v: number | string | undefined): number {
  if (v === undefined) return 0;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

/** Splits a tax-inclusive total into subtotal + GST, using the product's own gst% field. */
function taxBreakdown(
  total: number | string | undefined,
  gstPercent: number | string | undefined,
) {
  const totalNum = toNumber(total);
  const gst = toNumber(gstPercent);
  if (!totalNum || !gst) return { subtotal: totalNum, tax: 0, total: totalNum };
  const subtotal = totalNum / (1 + gst / 100);
  return { subtotal, tax: totalNum - subtotal, total: totalNum };
}

const buySchema = z.object({
  panCardNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN, e.g. ABCDE1234F"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  addressLine: z.string().trim().min(1, "Address is required"),
  state: z.string().trim().min(1, "Select a state"),
  city: z.string().trim().min(1, "Select a city"),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

type BuyFormValues = z.infer<typeof buySchema>;

function Page() {
  const { productId } = Route.useParams();
  const { ready } = useRequireRole("ROLE_CUSTOMER");

  const id = Number(productId);
  const [tenure, setTenure] = useState<Tenure>("spot");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["augmont", "product", id],
    queryFn: () => getProductDetails(id),
    enabled: ready && Number.isFinite(id),
  });

  // Same cache key/shape as the shop grid's lookup — free if the customer
  // arrived via that product's own category, otherwise one extra request.
  const { data: categoryImage } = useQuery({
    queryKey: ["augmont", "sub-category-image", product?.subCategoryId],
    queryFn: () => getSubCategoryImage(product!.subCategoryId),
    enabled: ready && !!product,
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<BuyFormValues>({
    resolver: zodResolver(buySchema),
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

  if (!ready) {
    return null;
  }

  async function onSubmit(values: BuyFormValues) {
    if (!product) return;
    setSubmitError(null);

    const tier = getProductPriceTier(product);
    const price = pricingFor(tier, tenure);
    const req: PlaceOrderRequest = {
      augmontProductId: product.id,
      productName: product.productName,
      productSku: product.sku,
      productWeight: product.weight,
      paymentTypeId: TENURE_TO_PAYMENT_TYPE_ID[tenure],
      quantity: 1,
      finalOrderPrice: toNumber(tier?.finalProductPrice),
      initialPayment: toNumber(price.dueToday),
      monthlyAmount: price.monthly != null ? toNumber(price.monthly) : undefined,
      panCardNumber: values.panCardNumber,
      dateOfBirth: values.dateOfBirth,
      deliveryAddress: values.addressLine,
      deliveryCity: values.city,
      deliveryState: values.state,
      deliveryPincode: values.pincode,
    };

    try {
      const order = await placeOrder(req);
      setPlacedOrder(order);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          form.setError(field as keyof BuyFormValues, { message });
        }
      } else {
        setSubmitError(
          err instanceof ApiError ? err.message : "Failed to place this order. Please try again.",
        );
      }
    }
  }

  const tier = product ? getProductPriceTier(product) : null;
  const thumb = product ? getProductThumbnail(product, categoryImage) : null;
  const availableTenures = (product?.paymentData ?? []).map((pt) => pt.paymentType);
  const price = pricingFor(tier, tenure);
  const breakdown = taxBreakdown(tier?.finalProductPrice, tier?.gst);

  if (placedOrder) {
    const confirmed = placedOrder.status === "CONFIRMED";
    return (
      <DashboardShell role="customer" title="Order placed">
        <Panel title={confirmed ? "Order confirmed" : "Order recorded"}>
          <div className="flex items-start gap-3 mb-4">
            {confirmed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-deep shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-gold shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium text-ink">
                {confirmed
                  ? `Your order for ${placedOrder.productName} is confirmed.`
                  : `Your order for ${placedOrder.productName} was recorded, but we couldn't confirm it with our gold partner right now.`}
              </p>
              {!confirmed && (
                <p className="text-sm text-muted-foreground mt-1">
                  This isn't lost — it's saved to your account. Our team has been notified and will
                  follow up once it's resolved.
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="pill" asChild>
              <Link to="/customer/orders">View my orders</Link>
            </Button>
            <Button variant="pillOutline" asChild>
              <Link to="/customer/shop">Continue shopping</Link>
            </Button>
          </div>
        </Panel>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="customer" title="Product details">
      <Link
        to="/customer/shop"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to shop
      </Link>

      {isLoading && (
        <FullPageLoader />
      )}
      {isError && (
        <p className="text-sm text-destructive py-10 text-center">Failed to load this product.</p>
      )}

      {product && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="grid lg:grid-cols-[13fr_7fr] gap-6 lg:gap-10 items-start">
              {/* ── Left column (~65%): action area ───────────────────────── */}
              <div className="space-y-6 min-w-0">
                <Panel title="Identity verification">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="panCardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN number</FormLabel>
                          <FormControl>
                            <Input
                              className="h-11"
                              placeholder="ABCDE1234F"
                              maxLength={10}
                              {...field}
                            />
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
                            <Input className="h-11" type="date" {...field} />
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
                            <Input className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-[2fr_2fr_1.2fr] gap-4">
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
                                <SelectTrigger className="h-11">
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
                                <SelectTrigger className="h-11">
                                  <SelectValue
                                    placeholder={
                                      stateValue ? "Select city" : "Select a state first"
                                    }
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
                              <Input
                                className="h-11"
                                inputMode="numeric"
                                maxLength={6}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Panel>
              </div>

              {/* ── Right column (~35%): sticky order summary ─────────────── */}
              <div className="lg:sticky lg:top-24 space-y-6">
                <Panel title="Order summary">
                  <div className="flex items-center gap-3 pb-5 mb-5 border-b border-line">
                    <div className="h-16 w-16 shrink-0 rounded-md border border-line overflow-hidden bg-stone grid place-items-center">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Boxes className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-base text-ink truncate">
                        {product.productName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {product.weight}g
                        </Badge>
                        {product.isEmiAvailable && (
                          <Badge className="text-[10px] px-1.5 py-0">EMI</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-ink mb-3">Choose how to pay</p>
                  {availableTenures.length > 0 ? (
                    <div className="flex gap-2 flex-wrap mb-5">
                      {(["spot", "three", "six", "nine"] as Tenure[])
                        .filter(
                          (t) =>
                            t === "spot" ||
                            availableTenures.includes(
                              t === "three" ? "3" : t === "six" ? "6" : "9",
                            ),
                        )
                        .map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTenure(t)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              tenure === t
                                ? "bg-emerald-deep text-paper border-emerald-deep"
                                : "border-line text-ink hover:border-emerald-deep"
                            }`}
                          >
                            {TENURE_LABELS[t]}
                          </button>
                        ))}
                    </div>
                  ) : null}

                  <div className="space-y-2 text-sm border-t border-line pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-ink">{formatInr(breakdown.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Taxes (GST{tier?.gst != null ? ` ${tier.gst}%` : ""})
                      </span>
                      <span className="text-ink">{formatInr(breakdown.tax)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-line">
                      <span className="font-medium text-ink">Total amount</span>
                      <span className="font-display text-xl text-ink">
                        {formatInr(breakdown.total)}
                      </span>
                    </div>
                  </div>

                  {tenure !== "spot" && (
                    <div className="rounded-md bg-stone p-3.5 mt-4 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due today (down payment)</span>
                        <span className="font-medium text-ink">{formatInr(price.dueToday)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Then, per month × {price.months}
                        </span>
                        <span className="font-medium text-ink">{formatInr(price.monthly)}</span>
                      </div>
                      {tier?.productInitialPaymentPer != null && (
                        <p className="text-xs text-muted-foreground pt-1">
                          Down payment is {tier.productInitialPaymentPer}% of the EMI plan value.
                        </p>
                      )}
                    </div>
                  )}

                  {submitError && (
                    <p className="text-sm text-destructive text-center mt-4" role="alert">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full justify-center h-14 text-base font-medium mt-5"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Placing order…" : "Place order"}
                  </Button>
                </Panel>
              </div>
            </div>
          </form>
        </Form>
      )}
    </DashboardShell>
  );
}
