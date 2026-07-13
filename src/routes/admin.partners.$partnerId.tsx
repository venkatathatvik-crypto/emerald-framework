import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { getPartner, getPartnerBranches } from "@/lib/api/admin";
import { EditPartnerDialog } from "@/components/admin/EditPartnerDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/partners/$partnerId")({
  head: () => ({ meta: [{ title: "Partner details — Admin" }] }),
  component: Page,
});

function Page() {
  const { partnerId } = Route.useParams();
  const { ready } = useRequireRole("ROLE_ADMIN");

  const id = Number(partnerId);
  const [editOpen, setEditOpen] = useState(false);

  const enabled = ready && Number.isFinite(id);

  const { data: partner, isLoading: partnerLoading, isError: partnerError, refetch } = useQuery({
    queryKey: ["admin", "partner", id],
    queryFn: () => getPartner(id),
    enabled,
  });

  const { data: branches, isLoading: branchesLoading, isError: branchesError } = useQuery({
    queryKey: ["admin", "partner", id, "branches"],
    queryFn: () => getPartnerBranches(id, { size: 50 }),
    enabled,
  });

  if (!ready) {
    return null;
  }

  const branchItems = branches?.items ?? [];
  const totalAgents = branchItems.reduce((sum, b) => sum + (b.agentCount ?? 0), 0);

  return (
    <DashboardShell role="admin" title="Partner details">
      <Link to="/admin/partners" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to partners
      </Link>

      {partnerLoading && <p className="text-sm text-muted-foreground py-10 text-center">Loading partner…</p>}
      {partnerError && <p className="text-sm text-destructive py-10 text-center">Failed to load this partner.</p>}

      {partner && (
        <div className="space-y-6">
          <Panel
            title={partner.name}
            action={<Button size="sm" variant="pillOutline" onClick={() => setEditOpen(true)}>Edit</Button>}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={partner.active ? "default" : "destructive"}>
                {partner.active ? "Active" : "Deactivated"}
              </Badge>
              <Badge variant="outline">{partner.type}</Badge>
              {partner.registrationNumber && <Badge variant="outline">{partner.registrationNumber}</Badge>}
            </div>
            <div className="grid sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p>{partner.contactEmail || "—"}</p>
                <p>{partner.contactPhone || ""}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p>{[partner.city, partner.state].filter(Boolean).join(", ") || "—"}</p>
                <p>{partner.pincode || ""}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Commission rate</p>
                <p>{partner.commissionRate != null ? `${partner.commissionRate}%` : "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Network</p>
                <p>{branchItems.length} branch{branchItems.length === 1 ? "" : "es"} · {totalAgents} agent{totalAgents === 1 ? "" : "s"}</p>
              </div>
            </div>
          </Panel>

          <Panel title="Branches">
            {branchesError && (
              <p className="text-sm text-destructive py-6">Failed to load branches. Please try again.</p>
            )}

            {!branchesError && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Agents</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branchesLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                        Loading branches…
                      </TableCell>
                    </TableRow>
                  )}
                  {!branchesLoading && branchItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                        This partner hasn't created any branches yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {branchItems.map((branch) => (
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
                      <TableCell>{branch.agentCount ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={branch.isActive ? "default" : "destructive"}>
                          {branch.isActive ? "Active" : "Deactivated"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        </div>
      )}

      {partner && (
        <EditPartnerDialog
          partner={partner}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdated={() => refetch()}
        />
      )}
    </DashboardShell>
  );
}
