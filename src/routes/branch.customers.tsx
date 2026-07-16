import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listCustomers } from "@/lib/api/branch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/branch/customers")({
  head: () => ({ meta: [{ title: "Customers — Branch" }] }),
  component: Page,
});

const PAGE_SIZE = 20;

function Page() {
  const { ready } = useRequireRole(["ROLE_BRANCH", "ROLE_AGENT"]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["branch", "customers", { search, page }],
    queryFn: () => listCustomers({ q: search || undefined, page, size: PAGE_SIZE }),
    enabled: ready,
  });

  if (!ready) {
    return null;
  }

  const customers = data?.items ?? [];

  return (
    <DashboardShell role="branch" title="Customers">
      <Panel
        title="Customers attributed to your branch"
        action={
          <Input
            placeholder="Search name, email, mobile…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-64"
          />
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
