import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listLeads, deleteLead, updateLeadStatus } from "@/lib/api/admin";
import type { LeadStatus, PartnerLead } from "@/lib/api/types";
import { readSortValue } from "@/lib/sort";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
import { ConvertLeadDialog } from "@/components/admin/ConvertLeadDialog";
import { LoadingState } from "@/components/ui/spinner";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Partner Leads — Admin" }] }),
  component: Page,
});

// "Converted" is intentionally omitted — converted leads no longer appear in
// this list at all (they've graduated to the Partners page).
const STATUS_OPTIONS: { value: LeadStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_VARIANT: Record<LeadStatus, "default" | "secondary" | "outline" | "destructive"> = {
  NEW: "default",
  CONTACTED: "secondary",
  CONVERTED: "outline",
  REJECTED: "destructive",
};

const PAGE_SIZE = 20;

function Page() {
  const queryClient = useQueryClient();
  const { ready } = useRequireRole("ROLE_ADMIN");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [convertingLead, setConvertingLead] = useState<PartnerLead | null>(null);
  const [deletingLead, setDeletingLead] = useState<PartnerLead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "leads", { search, status, page }],
    queryFn: () =>
      listLeads({
        q: search || undefined,
        status: status === "ALL" ? undefined : status,
        page,
        size: PAGE_SIZE,
      }),
    enabled: ready,
  });

  if (!ready) {
    return null;
  }

  const rawLeads = data?.items ?? [];

  const leads = [...rawLeads].sort((a, b) => {
    if (!sortField) return 0;
    const valA: unknown = readSortValue(a, sortField);
    const valB: unknown = readSortValue(b, sortField);

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

  function handleConverted() {
    queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "leads", "new-count"] });
  }

  async function handleDelete() {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      await deleteLead(deletingLead.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "leads", "new-count"] });
      setDeletingLead(null);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleStatusChange(lead: PartnerLead, status: "CONTACTED" | "REJECTED") {
    setUpdatingStatusId(lead.id);
    try {
      await updateLeadStatus(lead.id, status);
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "leads", "new-count"] });
    } finally {
      setUpdatingStatusId(null);
    }
  }

  return (
    <DashboardShell role="admin" title="Partner Leads">
      <Panel
        title="Leads"
        action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search company, contact, email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-64"
            />
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as LeadStatus | "ALL");
                setPage(0);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
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
          <p className="text-sm text-destructive py-6">Failed to load leads. Please try again.</p>
        )}

        {!isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => toggleSort("companyName")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Company</span>
                    {renderSortIcon("companyName")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("contactPerson")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Contact</span>
                    {renderSortIcon("contactPerson")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("email")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Email / Phone</span>
                    {renderSortIcon("email")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("city")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Location</span>
                    {renderSortIcon("city")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("status")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Status</span>
                    {renderSortIcon("status")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("createdAt")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Applied</span>
                    {renderSortIcon("createdAt")}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    <LoadingState label="Loading leads…" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No leads found.
                  </TableCell>
                </TableRow>
              )}
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <p className="font-medium text-ink">{lead.companyName}</p>
                    {lead.gst && <p className="text-xs text-muted-foreground">{lead.gst}</p>}
                  </TableCell>
                  <TableCell>{lead.contactPerson}</TableCell>
                  <TableCell>
                    <p>{lead.email}</p>
                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  </TableCell>
                  <TableCell>{[lead.city, lead.state].filter(Boolean).join(", ") || "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {lead.status === "NEW" && (
                      <Button
                        size="sm"
                        variant="pillOutline"
                        disabled={updatingStatusId === lead.id}
                        onClick={() => handleStatusChange(lead, "CONTACTED")}
                      >
                        Mark Contacted
                      </Button>
                    )}
                    {(lead.status === "NEW" || lead.status === "CONTACTED") && (
                      <>
                        <Button size="sm" variant="pill" onClick={() => setConvertingLead(lead)}>
                          Convert
                        </Button>
                        <Button
                          size="sm"
                          variant="pillDestructive"
                          disabled={updatingStatusId === lead.id}
                          onClick={() => handleStatusChange(lead, "REJECTED")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="pillDestructive"
                      onClick={() => setDeletingLead(lead)}
                    >
                      Delete
                    </Button>
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

      {convertingLead && (
        <ConvertLeadDialog
          lead={convertingLead}
          open={!!convertingLead}
          onOpenChange={(open) => {
            if (!open) setConvertingLead(null);
          }}
          onConverted={handleConverted}
        />
      )}

      <ConfirmDialog
        open={!!deletingLead}
        onOpenChange={(open) => {
          if (!open) setDeletingLead(null);
        }}
        title="Delete Partner Lead"
        description={`This permanently deletes the lead from ${deletingLead?.companyName || "this partner lead"}. This action cannot be undone.`}
        confirmText="Delete Lead"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </DashboardShell>
  );
}
