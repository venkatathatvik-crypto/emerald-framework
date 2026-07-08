import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Boxes } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useAuth } from "@/lib/auth-context";
import { getProductDetails, getProductPriceTier, getProductThumbnail, formatInr } from "@/lib/api/augmont";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/catalog/$productId")({
  head: () => ({ meta: [{ title: "Product details — Admin" }] }),
  component: Page,
});

function Page() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const id = Number(productId);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ROLE_ADMIN")) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["augmont", "product", id],
    queryFn: () => getProductDetails(id),
    enabled: !authLoading && user?.role === "ROLE_ADMIN" && Number.isFinite(id),
  });

  if (authLoading || !user || user.role !== "ROLE_ADMIN") {
    return null;
  }

  const tier = product ? getProductPriceTier(product) : null;
  const thumb = product ? getProductThumbnail(product) : null;
  const gallery = product?.productImages?.map((img) => img.url ?? img.URL).filter((u): u is string => !!u) ?? [];
  const displayImage = activeImage ?? thumb;

  return (
    <DashboardShell role="admin" title="Product details">
      <Link to="/admin/catalog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to catalogue
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading product…</p>}
      {isError && <p className="text-sm text-destructive py-10 text-center">Failed to load this product.</p>}

      {product && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Panel title="Images">
            <div className="aspect-square bg-stone rounded-md flex items-center justify-center overflow-hidden mb-3">
              {displayImage ? (
                <img src={displayImage} alt={product.productName} className="w-full h-full object-cover" />
              ) : (
                <Boxes className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {gallery.map((url) => (
                  <button
                    key={url}
                    onClick={() => setActiveImage(url)}
                    className={`h-16 w-16 rounded-md overflow-hidden border-2 ${displayImage === url ? "border-emerald-deep" : "border-line"}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Details">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl text-ink">{product.productName}</h2>
                <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{product.weight}g</Badge>
                {product.subCategory?.category?.metalType && (
                  <Badge variant="outline">
                    {product.subCategory.category.metalType.metalType} · {product.subCategory.category.metalType.metalFitness}
                  </Badge>
                )}
                {product.isEmiAvailable && <Badge>EMI Available</Badge>}
              </div>

              <div className="border-t border-line pt-4">
                <p className="eyebrow mb-2">Pricing</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Base price</p>
                    <p className="font-display text-xl">{formatInr(tier?.basePrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Final price</p>
                    <p className="font-display text-xl">{formatInr(tier?.finalProductPrice)}</p>
                  </div>
                </div>
              </div>

              {tier && (tier.paymentAmountPerMonthThree || tier.paymentAmountPerMonthSix || tier.paymentAmountPerMonthNine) && (
                <div className="border-t border-line pt-4">
                  <p className="eyebrow mb-2">EMI tenures</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenure</TableHead>
                        <TableHead>Initial payment</TableHead>
                        <TableHead>Per month</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tier.initialPaymentThree || tier.paymentAmountPerMonthThree ? (
                        <TableRow>
                          <TableCell>3 months</TableCell>
                          <TableCell>{formatInr(tier.initialPaymentThree)}</TableCell>
                          <TableCell>{formatInr(tier.paymentAmountPerMonthThree)}</TableCell>
                        </TableRow>
                      ) : null}
                      {tier.initialPaymentSix || tier.paymentAmountPerMonthSix ? (
                        <TableRow>
                          <TableCell>6 months</TableCell>
                          <TableCell>{formatInr(tier.initialPaymentSix)}</TableCell>
                          <TableCell>{formatInr(tier.paymentAmountPerMonthSix)}</TableCell>
                        </TableRow>
                      ) : null}
                      {tier.initialPaymentNine || tier.paymentAmountPerMonthNine ? (
                        <TableRow>
                          <TableCell>9 months</TableCell>
                          <TableCell>{formatInr(tier.initialPaymentNine)}</TableCell>
                          <TableCell>{formatInr(tier.paymentAmountPerMonthNine)}</TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>
              )}

              {product.paymentData && product.paymentData.length > 0 && (
                <div className="border-t border-line pt-4">
                  <p className="eyebrow mb-2">Payment options</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.paymentData.map((pt) => (
                      <Badge key={pt.paymentTypeId} variant="outline">{pt.paymentType}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </div>
      )}
    </DashboardShell>
  );
}
