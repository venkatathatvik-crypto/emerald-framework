import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { listBranches, deactivateBranch, reactivateBranch } from "@/lib/api/partner";
import { CreateBranchDialog } from "@/components/partner/CreateBranchDialog";
import type { Branch } from "@/lib/api/types";
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

export const Route = createFileRoute("/partner/branches/")({
  head: () => ({ meta: [{ title: "Branches — Partner" }] }),
  component: Page,
});

const ACTIVE_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All branches" },
  { value: "true", label: "Active" },
  { value: "false", label: "Deactivated" },
];

const PAGE_SIZE = 20;

function Page() {
  const queryClient = useQueryClient();
  const { ready } = useRequireRole("ROLE_ALLIANCE");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [deactivatingBranch, setDeactivatingBranch] = useState<Branch | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [reactivatingId, setReactivatingId] = useState<number | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partner", "branches", { search, activeFilter, page }],
    queryFn: () =>
      listBranches({
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

  const branches = data?.items ?? [];

  async function handleDeactivate() {
    if (!deactivatingBranch) return;
    setIsDeactivating(true);
    try {
      await deactivateBranch(deactivatingBranch.id);
      queryClient.invalidateQueries({ queryKey: ["partner", "branches"] });
      setDeactivatingBranch(null);
    } finally {
      setIsDeactivating(false);
    }
  }

  async function handleReactivate(branch: Branch) {
    setReactivatingId(branch.id);
    try {
      await reactivateBranch(branch.id);
      queryClient.invalidateQueries({ queryKey: ["partner", "branches"] });
    } finally {
      setReactivatingId(null);
    }
  }

  return (
    <DashboardShell role="partner" title="Branches">
      <Panel
        title="Branches"
        action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search name, code…"
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
            <Button variant="pill" onClick={() => setCreateOpen(true)}>Create Branch</Button>
          </div>
        }
      >
        {isError && (
          <p className="text-sm text-destructive py-6">Failed to load branches. Please try again.</p>
        )}

        {!isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
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
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    Loading branches…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && branches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No branches found.
                  </TableCell>
                </TableRow>
              )}
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <p className="font-medium text-ink">{branch.name}</p>
                    {branch.code && <p className="text-xs text-muted-foreground">{branch.code}</p>}
                  </TableCell>
                  <TableCell>
                    <p>{branch.contactEmail || "—"}</p>
                    <p className="text-xs text-muted-foreground">{branch.contactPhone || ""}</p>
                  </TableCell>
                  <TableCell>
                    {[branch.city, branch.state].filter(Boolean).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    {branch.commissionRate != null ? `${branch.commissionRate}%` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={branch.active ? "default" : "destructive"}>
                      {branch.active ? "Active" : "Deactivated"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="pill" asChild>
                      <Link to="/partner/branches/$branchId" params={{ branchId: String(branch.id) }}>
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="pillOutline" onClick={() => setEditingBranch(branch)}>
                      Edit
                    </Button>
                    {branch.active ? (
                      <Button
                        size="sm"
                        variant="pillDestructive"
                        onClick={() => setDeactivatingBranch(branch)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="pill"
                        disabled={reactivatingId === branch.id}
                        onClick={() => handleReactivate(branch)}
                      >
                        {reactivatingId === branch.id ? "Reactivating…" : "Reactivate"}
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

      <CreateBranchDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["partner", "branches"] })}
      />

      {editingBranch && (
        <CreateBranchDialog
          branch={editingBranch}
          open={!!editingBranch}
          onOpenChange={(open) => { if (!open) setEditingBranch(null); }}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ["partner", "branches"] })}
        />
      )}

      <AlertDialog open={!!deactivatingBranch} onOpenChange={(open) => { if (!open) setDeactivatingBranch(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this branch?</AlertDialogTitle>
            <AlertDialogDescription>
              {deactivatingBranch && (
                <>
                  This deactivates <strong>{deactivatingBranch.name}</strong>. Its agents keep their
                  own status and are not affected. Nothing is deleted — this can be reversed later.
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
