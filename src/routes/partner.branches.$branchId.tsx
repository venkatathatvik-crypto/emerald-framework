import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { getBranch, listAgents, deactivateAgent } from "@/lib/api/partner";
import { CreateAgentDialog } from "@/components/partner/CreateAgentDialog";
import type { Agent } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
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
  const [deactivatingAgent, setDeactivatingAgent] = useState<Agent | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const enabled = ready && Number.isFinite(id);

  const { data: branch, isLoading: branchLoading, isError: branchError } = useQuery({
    queryKey: ["partner", "branch", id],
    queryFn: () => getBranch(id),
    enabled,
  });

  const { data: agents, isLoading: agentsLoading, isError: agentsError } = useQuery({
    queryKey: ["partner", "branch", id, "agents"],
    queryFn: () => listAgents(id),
    enabled,
  });

  if (!ready) {
    return null;
  }

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

  return (
    <DashboardShell role="partner" title="Branch details">
      <Link to="/partner/branches" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to branches
      </Link>

      {branchLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading branch…</p>}
      {branchError && <p className="text-sm text-destructive py-10 text-center">Failed to load this branch.</p>}

      {branch && (
        <div className="space-y-6">
          <Panel title={branch.name}>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={branch.active ? "default" : "destructive"}>
                {branch.active ? "Active" : "Deactivated"}
              </Badge>
              {branch.code && <Badge variant="outline">{branch.code}</Badge>}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p>{branch.contactEmail || "—"}</p>
                <p>{branch.contactPhone || ""}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p>{[branch.city, branch.state].filter(Boolean).join(", ") || "—"}</p>
                <p>{branch.pincode || ""}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Commission rate</p>
                <p>{branch.commissionRate != null ? `${branch.commissionRate}%` : "—"}</p>
              </div>
            </div>
          </Panel>

          <Panel
            title="Agents"
            action={
              branch.active
                ? <Button variant="pill" onClick={() => setAddAgentOpen(true)}>Add Agent</Button>
                : undefined
            }
          >
            {agentsError && (
              <p className="text-sm text-destructive py-6">Failed to load agents. Please try again.</p>
            )}

            {!agentsError && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentsLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                        Loading agents…
                      </TableCell>
                    </TableRow>
                  )}
                  {!agentsLoading && (agents?.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
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
                        <Badge variant={agent.active ? "default" : "destructive"}>
                          {agent.active ? "Active" : "Deactivated"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {agent.active && (
                          <Button
                            size="sm"
                            variant="pillDestructive"
                            onClick={() => setDeactivatingAgent(agent)}
                          >
                            Deactivate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        </div>
      )}

      <CreateAgentDialog
        branchId={id}
        open={addAgentOpen}
        onOpenChange={setAddAgentOpen}
        onCreated={() => queryClient.invalidateQueries({ queryKey: ["partner", "branch", id, "agents"] })}
      />

      <AlertDialog open={!!deactivatingAgent} onOpenChange={(open) => { if (!open) setDeactivatingAgent(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this agent?</AlertDialogTitle>
            <AlertDialogDescription>
              {deactivatingAgent && (
                <>
                  This blocks{" "}
                  <strong>{[deactivatingAgent.firstName, deactivatingAgent.lastName].filter(Boolean).join(" ")}</strong>
                  {"'"}s login immediately. Nothing is deleted — this can be reversed later.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivating}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeactivating} onClick={handleDeactivateAgent}>
              {isDeactivating ? "Deactivating…" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
