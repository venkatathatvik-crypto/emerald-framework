import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Boxes } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { getShopCategories, getSubCategoryImage, getProductsBySubCategory, getProductPriceTier, getProductThumbnail, formatInr } from "@/lib/api/augmont";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/branch/place-order/")({
  head: () => ({ meta: [{ title: "Place order — Branch" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const { ready } = useRequireRole(["ROLE_BRANCH", "ROLE_AGENT"]);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["augmont", "shop-categories"],
    queryFn: getShopCategories,
    enabled: ready,
  });

  useEffect(() => {
    if (categoryId === null && categories && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const { data: products, isLoading: productsLoading, isError } = useQuery({
    queryKey: ["augmont", "products", categoryId],
    queryFn: () => getProductsBySubCategory({ subCategoryId: categoryId! }),
    enabled: categoryId !== null,
  });

  const { data: categoryImage } = useQuery({
    queryKey: ["augmont", "sub-category-image", categoryId],
    queryFn: () => getSubCategoryImage(categoryId!),
    enabled: categoryId !== null,
    staleTime: 5 * 60 * 1000,
  });

  if (!ready) {
    return null;
  }

  const filtered = (products ?? []).filter((p) =>
    !search || p.productName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardShell role="branch" title="Place an order for a customer">
      <Panel
        title="Products"
        action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Select
              value={categoryId != null ? String(categoryId) : ""}
              onValueChange={(v) => setCategoryId(Number(v))}
              disabled={categoriesLoading || !categories?.length}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.subCategoryName} ({c.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {isError && (
          <p className="text-sm text-destructive py-6">Failed to load products. Please try again.</p>
        )}

        {!isError && (productsLoading || categoriesLoading) && (
          <p className="text-sm text-muted-foreground py-10 text-center">Loading products…</p>
        )}

        {!isError && !productsLoading && !categoriesLoading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-10 text-center">No products found.</p>
        )}

        {!isError && !productsLoading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const tier = getProductPriceTier(product);
              const thumb = getProductThumbnail(product, categoryImage);
              return (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                  onClick={() => navigate({ to: "/branch/place-order/$productId", params: { productId: String(product.id) } })}
                >
                  <div className="aspect-square bg-stone flex items-center justify-center overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt={product.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Boxes className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <CardContent className="p-4 space-y-1.5">
                    <p className="font-medium text-ink text-sm line-clamp-2">{product.productName}</p>
                    <p className="text-xs text-muted-foreground">{product.weight}g</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-display text-lg">{formatInr(tier?.finalProductPrice)}</span>
                      {product.isEmiAvailable && (
                        <Badge variant="secondary" className="text-[10px]">EMI</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Panel>
    </DashboardShell>
  );
}
