import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ArrowLeft, Boxes, Lock } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { useStates, useCities } from "@/hooks/use-location-data";
import { getProductDetails, getSubCategoryImage, getProductPriceTier, getProductThumbnail, formatInr } from "@/lib/api/augmont";
import type { AugmontProductPriceTier } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
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
    case "spot": return { dueToday: tier.finalProductPrice, monthly: undefined, months: 0 };
    case "three": return { dueToday: tier.initialPaymentThree, monthly: tier.paymentAmountPerMonthThree, months: 3 };
    case "six": return { dueToday: tier.initialPaymentSix, monthly: tier.paymentAmountPerMonthSix, months: 6 };
    case "nine": return { dueToday: tier.initialPaymentNine, monthly: tier.paymentAmountPerMonthNine, months: 9 };
  }
}

const buySchema = z.object({
  panCardNumber: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN, e.g. ABCDE1234F"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  addressLine: z.string().trim().min(1, "Address is required"),
  state: z.string().trim().min(1, "Select a state"),
  city: z.string().trim().min(1, "Select a city"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

type BuyFormValues = z.infer<typeof buySchema>;

function Page() {
  const { productId } = Route.useParams();
  const { ready } = useRequireRole("ROLE_CUSTOMER");

  const id = Number(productId);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [tenure, setTenure] = useState<Tenure>("spot");

  const { data: product, isLoading, isError } = useQuery({
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
    defaultValues: { panCardNumber: "", dateOfBirth: "", addressLine: "", state: "", city: "", pincode: "" },
  });
  const stateValue = form.watch("state");
  const { data: states } = useStates();
  const { data: cities } = useCities(stateValue);

  if (!ready) {
    return null;
  }

  const tier = product ? getProductPriceTier(product) : null;
  const thumb = product ? getProductThumbnail(product, categoryImage) : null;
  const gallery = product?.productImages?.map((img) => img.url ?? img.URL).filter((u): u is string => !!u) ?? [];
  const displayImage = activeImage ?? thumb;
  const availableTenures = (product?.paymentData ?? []).map((pt) => pt.paymentType);
  const price = pricingFor(tier, tenure);

  return (
    <DashboardShell role="customer" title="Product details">
      <Link to="/customer/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to shop
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading product…</p>}
      {isError && <p className="text-sm text-destructive py-10 text-center">Failed to load this product.</p>}

      {product && (
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
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

            <Panel title="Delivery &amp; identity details" className="lg:col-span-2">
              <Form {...form}>
                <form className="space-y-4">
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

                  <Button type="button" variant="pill" className="w-full justify-center" disabled title="Checkout opens once payment collection is ready">
                    <Lock className="h-4 w-4" /> Place order — coming soon
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We're finishing secure payment collection. Your details above aren't submitted anywhere yet.
                  </p>
                </form>
              </Form>
            </Panel>
        </div>
      )}
    </DashboardShell>
  );
}
