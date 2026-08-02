import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { getBranch, listAgents, deactivateAgent, reactivateAgent } from "@/lib/api/partner";
import { CreateAgentDialog } from "@/components/partner/CreateAgentDialog";
import { CreateBranchDialog } from "@/components/partner/CreateBranchDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BranchKPIStrip } from "@/components/branch/branch-kpi-strip";
import { BranchDetailTabs } from "@/components/branch/branch-detail-tabs";
import type { Agent } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/spinner";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

export const Route = createFileRoute("/partner/branches/$branchId")({
  head: () => ({ meta: [{ title: "Branch details — Partner" }] }),
  component: Page,
});

function Page() {
  const { branchId } = Route.useParams();
  const queryClient = useQueryClient();
  const { ready } = useRequireRole("ROLE_ALLIANCE");

  const id = Number(branchId);
  const [addAgentOpen, setAddAgentOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deactivatingAgent, setDeactivatingAgent] = useState<Agent | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [reactivatingId, setReactivatingId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const enabled = ready && Number.isFinite(id);

  const {
    data: branch,
    isLoading: branchLoading,
    isError: branchError,
  } = useQuery({
    queryKey: ["partner", "branch", id],
    queryFn: () => getBranch(id),
    enabled,
  });

  const {
    data: rawAgents,
    isLoading: agentsLoading,
    isError: agentsError,
  } = useQuery({
    queryKey: ["partner", "branch", id, "agents"],
    queryFn: () => listAgents(id),
    enabled,
  });

  if (!ready) {
    return null;
  }

  const agents = [...(rawAgents ?? [])].sort((a, b) => {
    if (!sortField) return 0;
    let valA: unknown = (a as Record<string, unknown>)[sortField];
    let valB: unknown = (b as Record<string, unknown>)[sortField];

    if (sortField === "name") {
      valA = [a.firstName, a.lastName].filter(Boolean).join(" ");
      valB = [b.firstName, b.lastName].filter(Boolean).join(" ");
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

  async function handleDeactivateAgent() {
    if (!deactivatingAgent) return;
    setIsDeactivating(true);
    try {
      await deactivateAgent(id, deactivatingAgent.id);
      queryClient.invalidateQueries({ queryKey: ["partner", "branch", id, "agents"] });
      setDeactivatingAgent(null);
    } finally {
      setIsDeactivating(false);
    }
  }

  async function handleReactivateAgent(agent: Agent) {
    setReactivatingId(agent.id);
    try {
      await reactivateAgent(id, agent.id);
      queryClient.invalidateQueries({ queryKey: ["partner", "branch", id, "agents"] });
    } finally {
      setReactivatingId(null);
    }
  }

  return (
    <DashboardShell role="partner" title="Branch details">
      <Link
        to="/partner/branches"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to branches
      </Link>

      {branchLoading && (
        <LoadingState label="Loading branch…" />
      )}
      {branchError && (
        <p className="text-sm text-destructive py-10 text-center">Failed to load this branch.</p>
      )}

      {branch && (
        <div className="space-y-6">
          <Panel
            title={branch.name}
            action={
              <Button size="sm" variant="pillOutline" onClick={() => setEditOpen(true)}>
                Edit Branch
              </Button>
            }
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={branch.active ? "default" : "destructive"}>
                {branch.active ? "Active" : "Deactivated"}
              </Badge>
              {branch.code && <Badge variant="outline">{branch.code}</Badge>}
            </div>
            <BranchKPIStrip branch={branch} agentCount={rawAgents?.length ?? 0} />
          </Panel>

          <BranchDetailTabs
            branch={branch}
            agentsContent={
              <Panel
                title="Agents Roster"
                action={
                  branch.active ? (
                    <Button variant="pill" onClick={() => setAddAgentOpen(true)}>
                      Add Agent
                    </Button>
                  ) : undefined
                }
              >
                {agentsError && (
                  <p className="text-sm text-destructive py-6">
                    Failed to load agents. Please try again.
                  </p>
                )}

                {!agentsError && (
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
                            onClick={() => toggleSort("email")}
                            className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                          >
                            <span>Email</span>
                            {renderSortIcon("email")}
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            onClick={() => toggleSort("mobile")}
                            className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                          >
                            <span>Mobile</span>
                            {renderSortIcon("mobile")}
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
                      {agentsLoading && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground py-10"
                          >
                            <LoadingState label="Loading agents…" />
                          </TableCell>
                        </TableRow>
                      )}
                      {!agentsLoading && (agents?.length ?? 0) === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground py-10"
                          >
                            No agents yet.
                          </TableCell>
                        </TableRow>
                      )}
                      {agents?.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell>
                            <p className="font-medium text-ink">
                              {[agent.firstName, agent.lastName].filter(Boolean).join(" ") || "—"}
                            </p>
                          </TableCell>
                          <TableCell>{agent.email || "—"}</TableCell>
                          <TableCell>{agent.mobile || "—"}</TableCell>
                          <TableCell>
                            <StatusBadge status={agent.active ? "ACTIVE" : "DEACTIVATED"} />
                          </TableCell>
                          <TableCell className="text-right">
                            {agent.active ? (
                              <Button
                                size="sm"
                                variant="pillDestructive"
                                onClick={() => setDeactivatingAgent(agent)}
                              >
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="pill"
                                disabled={reactivatingId === agent.id}
                                onClick={() => handleReactivateAgent(agent)}
                              >
                                {reactivatingId === agent.id ? "Reactivating…" : "Reactivate"}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Panel>
            }
          />
        </div>
      )}

      <CreateAgentDialog
        branchId={id}
        open={addAgentOpen}
        onOpenChange={setAddAgentOpen}
        onCreated={() =>
          queryClient.invalidateQueries({ queryKey: ["partner", "branch", id, "agents"] })
        }
      />

      {branch && (
        <CreateBranchDialog
          branch={branch}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ["partner", "branch", id] })}
        />
      )}

      <ConfirmDialog
        open={!!deactivatingAgent}
        onOpenChange={(open) => {
          if (!open) setDeactivatingAgent(null);
        }}
        title="Deactivate Agent"
        description={`This blocks ${[deactivatingAgent?.firstName, deactivatingAgent?.lastName].filter(Boolean).join(" ") || "this agent"}'s portal access immediately. This can be reversed later.`}
        confirmText="Deactivate Agent"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeactivating}
        onConfirm={handleDeactivateAgent}
      />
    </DashboardShell>
  );
}
