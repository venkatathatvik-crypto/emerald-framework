import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listPartners, deactivatePartner, reactivatePartner } from "@/lib/api/admin";
import type { PartnerResponse } from "@/lib/api/types";
import { EditPartnerDialog } from "@/components/admin/EditPartnerDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/spinner";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/partners/")({
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
  const queryClient = useQueryClient();
  const { ready } = useRequireRole("ROLE_ADMIN");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [deactivatingPartner, setDeactivatingPartner] = useState<PartnerResponse | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [reactivatingId, setReactivatingId] = useState<number | null>(null);
  const [editingPartner, setEditingPartner] = useState<PartnerResponse | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "partners", { search, activeFilter, page }],
    queryFn: () =>
      listPartners({
        q: search || undefined,
        active: activeFilter === "ALL" ? undefined : activeFilter === "true",
        page,
        size: PAGE_SIZE,
      }),
    enabled: ready,
  });

  if (!ready) {
    return null;
  }

  const rawPartners = data?.items ?? [];

  const partners = [...rawPartners].sort((a, b) => {
    if (!sortField) return 0;
    let valA: unknown = (a as Record<string, unknown>)[sortField];
    let valB: unknown = (b as Record<string, unknown>)[sortField];

    if (sortField === "location") {
      valA = [a.city, a.state].filter(Boolean).join(", ");
      valB = [b.city, b.state].filter(Boolean).join(", ");
    }

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === "number" && typeof valB === "number") {
      return sortDir === "asc" ? valA - valB : valB - valA;
    }

    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();

    if (strA < strB) return sortDir === "asc" ? -1 : 1;
    if (strA > strB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortField(null);
        setSortDir("asc");
      }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 ml-1.5" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0 ml-1.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0 ml-1.5" />
    );
  };

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

  async function handleReactivate(partner: PartnerResponse) {
    setReactivatingId(partner.id);
    try {
      await reactivatePartner(partner.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
    } finally {
      setReactivatingId(null);
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-64"
            />
            <Select
              value={activeFilter}
              onValueChange={(v) => {
                setActiveFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {isError && (
          <p className="text-sm text-destructive py-6">
            Failed to load partners. Please try again.
          </p>
        )}

        {!isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => toggleSort("name")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Name</span>
                    {renderSortIcon("name")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("type")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Type</span>
                    {renderSortIcon("type")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("contactEmail")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Contact</span>
                    {renderSortIcon("contactEmail")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("location")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Location</span>
                    {renderSortIcon("location")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("commissionRate")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Commission</span>
                    {renderSortIcon("commissionRate")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("active")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Status</span>
                    {renderSortIcon("active")}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    <LoadingState label="Loading partners…" />
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
                    <StatusBadge status={partner.active ? "ACTIVE" : "DEACTIVATED"} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="pill" asChild>
                      <Link
                        to="/admin/partners/$partnerId"
                        params={{ partnerId: String(partner.id) }}
                      >
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="pillOutline"
                      onClick={() => setEditingPartner(partner)}
                    >
                      Edit
                    </Button>
                    {partner.active ? (
                      <Button
                        size="sm"
                        variant="pillDestructive"
                        onClick={() => setDeactivatingPartner(partner)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="pill"
                        disabled={reactivatingId === partner.id}
                        onClick={() => handleReactivate(partner)}
                      >
                        {reactivatingId === partner.id ? "Reactivating…" : "Reactivate"}
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

      {editingPartner && (
        <EditPartnerDialog
          partner={editingPartner}
          open={!!editingPartner}
          onOpenChange={(open) => {
            if (!open) setEditingPartner(null);
          }}
          onUpdated={() => queryClient.invalidateQueries({ queryKey: ["admin", "partners"] })}
        />
      )}

      <ConfirmDialog
        open={!!deactivatingPartner}
        onOpenChange={(open) => {
          if (!open) setDeactivatingPartner(null);
        }}
        title="Deactivate Partner"
        description={`This deactivates ${deactivatingPartner?.name || "this partner"} and blocks their portal access immediately. This can be reversed later.`}
        confirmText="Deactivate Partner"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeactivating}
        onConfirm={handleDeactivate}
      />
    </DashboardShell>
  );
}
