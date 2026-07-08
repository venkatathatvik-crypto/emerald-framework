import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useAuth } from "@/lib/auth-context";
import { listLeads, deleteLead } from "@/lib/api/admin";
import type { LeadStatus, PartnerLead } from "@/lib/api/types";
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
import { ConvertLeadDialog } from "@/components/admin/ConvertLeadDialog";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [convertingLead, setConvertingLead] = useState<PartnerLead | null>(null);
  const [deletingLead, setDeletingLead] = useState<PartnerLead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ROLE_ADMIN")) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "leads", { search, status, page }],
    queryFn: () =>
      listLeads({
        q: search || undefined,
        status: status === "ALL" ? undefined : status,
        page,
        size: PAGE_SIZE,
      }),
    enabled: !authLoading && user?.role === "ROLE_ADMIN",
  });

  if (authLoading || !user || user.role !== "ROLE_ADMIN") {
    return null;
  }

  const leads = data?.items ?? [];

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

  return (
    <DashboardShell role="admin" title="Partner Leads">
      <Panel
        title="Leads"
        action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search company, contact, email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-64"
            />
            <Select
              value={status}
              onValueChange={(v) => { setStatus(v as LeadStatus | "ALL"); setPage(0); }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
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
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email / Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    Loading leads…
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
                  <TableCell>
                    {[lead.city, lead.state].filter(Boolean).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[lead.status]}>{lead.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {(lead.status === "NEW" || lead.status === "CONTACTED") && (
                      <Button size="sm" variant="outline" onClick={() => setConvertingLead(lead)}>
                        Convert
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => setDeletingLead(lead)}>
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

      {convertingLead && (
        <ConvertLeadDialog
          lead={convertingLead}
          open={!!convertingLead}
          onOpenChange={(open) => { if (!open) setConvertingLead(null); }}
          onConverted={handleConverted}
        />
      )}

      <AlertDialog open={!!deletingLead} onOpenChange={(open) => { if (!open) setDeletingLead(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingLead && (
                <>This permanently deletes the lead from <strong>{deletingLead.companyName}</strong>. This cannot be undone.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
