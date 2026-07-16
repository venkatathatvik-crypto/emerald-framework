import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listCustomers, listBranches } from "@/lib/api/partner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/partner/customers")({
  head: () => ({ meta: [{ title: "Customers — Partner" }] }),
  component: Page,
});

const PAGE_SIZE = 20;

function Page() {
  const { ready } = useRequireRole("ROLE_ALLIANCE");

  const [branchId, setBranchId] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data: branches } = useQuery({
    queryKey: ["partner", "branches", "all-for-filter"],
    queryFn: () => listBranches({ size: 200 }),
    enabled: ready,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partner", "customers", { branchId, search, page }],
    queryFn: () => listCustomers({
      branchId: branchId === "ALL" ? undefined : Number(branchId),
      q: search || undefined,
      page,
      size: PAGE_SIZE,
    }),
    enabled: ready,
  });

  if (!ready) {
    return null;
  }

  const customers = data?.items ?? [];

  return (
    <DashboardShell role="partner" title="Customers">
      <Panel
        title="Customers across your branches"
        action={
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search name, email, mobile…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-56"
            />
            <Select value={branchId} onValueChange={(v) => { setBranchId(v); setPage(0); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All branches</SelectItem>
                {branches?.items.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {isError && (
          <p className="text-sm text-destructive py-6">Failed to load customers. Please try again.</p>
        )}

        {!isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Loading customers…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium text-ink">
                    {[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "—"}
                  </TableCell>
                  <TableCell>{customer.email || "—"}</TableCell>
                  <TableCell>{customer.mobile || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={customer.active ? "default" : "destructive"}>
                      {customer.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
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
