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
import { getProductDetails, getSubCategoryImage, getProductPriceTier, getProductThumbnail, formatInr } from "@/lib/api/augmont";
import { placeOrder } from "@/lib/api/branch";
import { ApiError } from "@/lib/api/types";
import type { AugmontProductPriceTier, AgentPlaceOrderRequest, OrderResponse } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/branch/place-order/$productId")({
  head: () => ({ meta: [{ title: "Place order — Branch" }] }),
  component: Page,
});

type Tenure = "spot" | "three" | "six" | "nine";

const TENURE_LABELS: Record<Tenure, string> = {
  spot: "Pay in full",
  three: "3 months",
  six: "6 months",
  nine: "9 months",
};

const TENURE_TO_PAYMENT_TYPE_ID: Record<Tenure, number> = {
  spot: 4,
  three: 1,
  six: 2,
  nine: 3,
};

function pricingFor(tier: AugmontProductPriceTier | null, tenure: Tenure) {
  if (!tier) return { dueToday: undefined, monthly: undefined, months: 0 };
  switch (tenure) {
    case "spot": return { dueToday: tier.finalProductPrice, monthly: undefined, months: 0 };
    case "three": return { dueToday: tier.initialPaymentThree, monthly: tier.paymentAmountPerMonthThree, months: 3 };
    case "six": return { dueToday: tier.initialPaymentSix, monthly: tier.paymentAmountPerMonthSix, months: 6 };
    case "nine": return { dueToday: tier.initialPaymentNine, monthly: tier.paymentAmountPerMonthNine, months: 9 };
  }
}

const orderSchema = z.object({
  customerFirstName: z.string().trim().min(1, "Customer's first name is required").max(100),
  customerLastName: z.string().trim().max(100).optional(),
  customerEmail: z.string().trim().min(1, "Customer's email is required").email("Enter a valid email"),
  customerMobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  panCardNumber: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN, e.g. ABCDE1234F"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  addressLine: z.string().trim().min(1, "Address is required"),
  state: z.string().trim().min(1, "Select a state"),
  city: z.string().trim().min(1, "Select a city"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

function toNumber(v: number | string | undefined): number {
  if (v === undefined) return 0;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function Page() {
  const { productId } = Route.useParams();
  const { ready } = useRequireRole(["ROLE_BRANCH", "ROLE_AGENT"]);

  const id = Number(productId);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [tenure, setTenure] = useState<Tenure>("spot");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["augmont", "product", id],
    queryFn: () => getProductDetails(id),
    enabled: ready && Number.isFinite(id),
  });

  const { data: categoryImage } = useQuery({
    queryKey: ["augmont", "sub-category-image", product?.subCategoryId],
    queryFn: () => getSubCategoryImage(product!.subCategoryId),
    enabled: ready && !!product,
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerFirstName: "", customerLastName: "", customerEmail: "", customerMobile: "",
      panCardNumber: "", dateOfBirth: "", addressLine: "", state: "", city: "", pincode: "",
    },
  });
  const stateValue = form.watch("state");
  const { data: states } = useAugmontStates();
  const { data: cities } = useAugmontCities(stateValue);

  if (!ready) {
    return null;
  }

  const tier = product ? getProductPriceTier(product) : null;
  const thumb = product ? getProductThumbnail(product, categoryImage) : null;
  const gallery = product?.productImages?.map((img) => img.url ?? img.URL).filter((u): u is string => !!u) ?? [];
  const displayImage = activeImage ?? thumb;
  const availableTenures = (product?.paymentData ?? []).map((pt) => pt.paymentType);
  const price = pricingFor(tier, tenure);

  async function onSubmit(values: OrderFormValues) {
    if (!product) return;
    setSubmitError(null);

    const req: AgentPlaceOrderRequest = {
      customerFirstName: values.customerFirstName,
      customerLastName: values.customerLastName || undefined,
      customerEmail: values.customerEmail,
      customerMobile: values.customerMobile,
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
          form.setError(field as keyof OrderFormValues, { message });
        }
      } else {
        setSubmitError(err instanceof ApiError ? err.message : "Failed to record this order. Please try again.");
      }
    }
  }

  if (placedOrder) {
    const confirmed = placedOrder.status === "CONFIRMED";
    return (
      <DashboardShell role="branch" title="Order recorded">
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
                  ? `Order for ${placedOrder.productName} confirmed with Augmont.`
                  : `Order for ${placedOrder.productName} was recorded, but couldn't be confirmed with our gold partner right now.`}
              </p>
              {!confirmed && (
                <p className="text-sm text-muted-foreground mt-1">
                  This isn't lost — it's saved and attributed to your branch. Our team has been notified and will follow up once it's resolved.
                  {placedOrder.failureReason && ` (${placedOrder.failureReason})`}
                </p>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm bg-stone rounded-md p-4">
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p>{placedOrder.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Reference</p>
              <p className="font-mono text-xs">{placedOrder.merchantTransactionId}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="pill" asChild>
              <Link to="/branch/place-order">Place another order</Link>
            </Button>
            <Button variant="pillOutline" asChild>
              <Link to="/branch/orders">View branch orders</Link>
            </Button>
          </div>
        </Panel>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="branch" title="Place order">
      <Link to="/branch/place-order" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to products
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading product…</p>}
      {isError && <p className="text-sm text-destructive py-10 text-center">Failed to load this product.</p>}

      {product && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid lg:grid-cols-2 gap-6 items-stretch">
            <Panel title="Product" className="flex flex-col">
              <div className="h-56 bg-stone rounded-md flex items-center justify-center overflow-hidden mb-4">
                {displayImage ? (
                  <img src={displayImage} alt={product.productName} className="w-full h-full object-cover" />
                ) : (
                  <Boxes className="h-14 w-14 text-muted-foreground" />
                )}
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {gallery.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setActiveImage(url)}
                      className={`h-14 w-14 rounded-md overflow-hidden border-2 ${displayImage === url ? "border-emerald-deep" : "border-line"}`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div>
                <h2 className="font-display text-2xl text-ink">{product.productName}</h2>
                <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <Badge variant="secondary">{product.weight}g</Badge>
                {product.subCategory?.category?.metalType && (
                  <Badge variant="outline">
                    {product.subCategory.category.metalType.metalType} · {product.subCategory.category.metalType.metalFitness}
                  </Badge>
                )}
                {product.isEmiAvailable && <Badge>EMI Available</Badge>}
              </div>
            </Panel>

            <Panel title="Choose how to pay">
              {availableTenures.length > 0 ? (
                <div className="flex gap-2 flex-wrap mb-5">
                  {(["spot", "three", "six", "nine"] as Tenure[])
                    .filter((t) => t === "spot" || availableTenures.includes(t === "three" ? "3" : t === "six" ? "6" : "9"))
                    .map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenure(t)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          tenure === t ? "bg-emerald-deep text-paper border-emerald-deep" : "border-line text-ink hover:border-emerald-deep"
                        }`}
                      >
                        {TENURE_LABELS[t]}
                      </button>
                    ))}
                </div>
              ) : null}

              <div className="rounded-md bg-stone p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{tenure === "spot" ? "Pay today" : "Down payment today"}</p>
                  <p className="font-display text-2xl mt-1">{formatInr(price.dueToday)}</p>
                </div>
                {price.months > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Then, per month for {price.months} months</p>
                    <p className="font-display text-2xl mt-1">{formatInr(price.monthly)}</p>
                  </div>
                )}
              </div>
              {tier?.productInitialPaymentPer != null && tenure !== "spot" && (
                <p className="text-xs text-muted-foreground mt-2">
                  Down payment is {tier.productInitialPaymentPer}% of the EMI plan value.{tier.gst != null ? ` Includes ${tier.gst}% GST.` : ""}
                </p>
              )}
            </Panel>

            <Panel title="Customer details" className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="customerFirstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="customerLastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="customerEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="customerMobile" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl><Input inputMode="tel" maxLength={10} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                If this customer already has an account (matched by email or mobile), the order is linked to it —
                otherwise a new account is created and attributed to this branch automatically.
              </p>
            </Panel>

            <Panel title="Delivery &amp; identity details" className="lg:col-span-2">
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="panCardNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN number</FormLabel>
                      <FormControl><Input placeholder="ABCDE1234F" maxLength={10} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="addressLine" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => { field.onChange(v); form.setValue("city", ""); }}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states?.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={!stateValue}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={stateValue ? "Select city" : "Select a state first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities?.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl><Input inputMode="numeric" maxLength={6} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {submitError && (
                  <p className="text-sm text-destructive" role="alert">{submitError}</p>
                )}

                <Button type="submit" variant="pill" className="w-full justify-center" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Placing order…" : "Place order"}
                </Button>
              </div>
            </Panel>
          </form>
        </Form>
      )}
    </DashboardShell>
  );
}
