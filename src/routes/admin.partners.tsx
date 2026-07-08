import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useAuth } from "@/lib/auth-context";
import { listPartners, deactivatePartner } from "@/lib/api/admin";
import type { PartnerResponse } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/partners")({
  head: () => ({ meta: [{ title: "Partners — Admin" }] }),
  component: Page,
});

const ACTIVE_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All partners" },
  { value: "true", label: "Active" },
  { value: "false", label: "Deactivated" },
];

const PAGE_SIZE = 20;

function Page() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [deactivatingPartner, setDeactivatingPartner] = useState<PartnerResponse | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ROLE_ADMIN")) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "partners", { search, activeFilter, page }],
    queryFn: () =>
      listPartners({
        q: search || undefined,
        active: activeFilter === "ALL" ? undefined : activeFilter === "true",
        page,
        size: PAGE_SIZE,
      }),
    enabled: !authLoading && user?.role === "ROLE_ADMIN",
  });

  if (authLoading || !user || user.role !== "ROLE_ADMIN") {
    return null;
  }

  const partners = data?.items ?? [];

  async function handleDeactivate() {
    if (!deactivatingPartner) return;
    setIsDeactivating(true);
    try {
      await deactivatePartner(deactivatingPartner.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
      setDeactivatingPartner(null);
    } finally {
      setIsDeactivating(false);
    }
  }

  return (
    <DashboardShell role="admin" title="Partners">
      <Panel
        title="Partners"
        action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search name, contact email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-64"
            />
            <Select
              value={activeFilter}
              onValueChange={(v) => { setActiveFilter(v); setPage(0); }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {isError && (
          <p className="text-sm text-destructive py-6">Failed to load partners. Please try again.</p>
        )}

        {!isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    Loading partners…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && partners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No partners found.
                  </TableCell>
                </TableRow>
              )}
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <p className="font-medium text-ink">{partner.name}</p>
                    {partner.registrationNumber && (
                      <p className="text-xs text-muted-foreground">{partner.registrationNumber}</p>
                    )}
                  </TableCell>
                  <TableCell>{partner.type}</TableCell>
                  <TableCell>
                    <p>{partner.contactEmail || "—"}</p>
                    <p className="text-xs text-muted-foreground">{partner.contactPhone || ""}</p>
                  </TableCell>
                  <TableCell>
                    {[partner.city, partner.state].filter(Boolean).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    {partner.commissionRate != null ? `${partner.commissionRate}%` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={partner.active ? "default" : "destructive"}>
                      {partner.active ? "Active" : "Deactivated"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {partner.active && (
                      <Button size="sm" variant="destructive" onClick={() => setDeactivatingPartner(partner)}>
                        Deactivate
                      </Button>
                    )}
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
                variant="outline"
                size="sm"
                disabled={data.page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
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

      <AlertDialog open={!!deactivatingPartner} onOpenChange={(open) => { if (!open) setDeactivatingPartner(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this partner?</AlertDialogTitle>
            <AlertDialogDescription>
              {deactivatingPartner && (
                <>
                  This deactivates <strong>{deactivatingPartner.name}</strong> and blocks their login immediately.
                  Nothing is deleted — you can see deactivated partners via the status filter, and this can be
                  reversed later.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivating}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeactivating} onClick={handleDeactivate}>
              {isDeactivating ? "Deactivating…" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
