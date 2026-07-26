import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAuditLogs } from "@/lib/api/admin";
import { exportToCsv } from "@/lib/csv-exporter";
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  User,
  Building2,
  Package,
  KeyRound,
  UserCheck,
} from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — Admin Portal" }] }),
  component: Page,
});

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category:
    | "AUTH"
    | "ORDER_MUTATION"
    | "AUGMONT_SYNC"
    | "PARTNER_ONBOARDING"
    | "BRANCH_ACTIONS"
    | "AGENT_ACTIONS"
    | "CUSTOMER_ACTIONS";
  action: string;
  actor: {
    name: string;
    email: string;
    role: "Admin" | "Partner" | "Branch Agent" | "Customer" | "System Webhook";
  };
  targetEntity: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "FAILURE";
  details: string;
}

function Page() {
  const { ready } = useRequireRole("ROLE_ADMIN");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<
    "timestamp" | "category" | "action" | "actor" | "status"
  >("timestamp");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [exportConfirmOpen, setExportConfirmOpen] = useState(false);

  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "audit-logs", search, categoryFilter, statusFilter],
    queryFn: () =>
      listAuditLogs({
        q: search || undefined,
        category: categoryFilter,
        status: statusFilter,
      }),
    enabled: ready,
  });

  if (!ready) return null;

  const logsToDisplay: AuditLogEntry[] = (apiData?.items as AuditLogEntry[]) ?? [];

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (field: typeof sortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 ml-1" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />
    );
  };

  const filteredLogs = logsToDisplay
    .filter((log) => {
      const matchesSearch =
        !search ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
        log.targetEntity.toLowerCase().includes(search.toLowerCase()) ||
        log.id.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter;
      const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let valA = "";
      let valB = "";

      if (sortField === "timestamp") {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortDir === "desc" ? timeB - timeA : timeA - timeB;
      } else if (sortField === "category") {
        valA = a.category;
        valB = b.category;
      } else if (sortField === "action") {
        valA = a.action;
        valB = b.action;
      } else if (sortField === "actor") {
        valA = a.actor.name;
        valB = b.actor.name;
      } else if (sortField === "status") {
        valA = a.status;
        valB = b.status;
      }

      const comp = valA.localeCompare(valB);
      return sortDir === "asc" ? comp : -comp;
    });

  const getCategoryBadge = (cat: AuditLogEntry["category"]) => {
    switch (cat) {
      case "AUTH":
        return (
          <Badge
            variant="outline"
            className="border-slate-500/40 text-slate-700 dark:text-slate-300"
          >
            <KeyRound className="h-3 w-3 mr-1 text-slate-500" /> AUTH
          </Badge>
        );
      case "ORDER_MUTATION":
        return (
          <Badge
            variant="outline"
            className="border-amber-600/40 text-amber-700 dark:text-amber-400"
          >
            <Package className="h-3 w-3 mr-1 text-amber-600" /> ORDER
          </Badge>
        );
      case "AUGMONT_SYNC":
        return (
          <Badge
            variant="outline"
            className="border-emerald-600/40 text-emerald-700 dark:text-emerald-400"
          >
            <ShieldAlert className="h-3 w-3 mr-1 text-emerald-600" /> AUGMONT
          </Badge>
        );
      case "PARTNER_ONBOARDING":
        return (
          <Badge
            variant="outline"
            className="border-purple-600/40 text-purple-700 dark:text-purple-400"
          >
            <UserCheck className="h-3 w-3 mr-1 text-purple-600" /> PARTNER
          </Badge>
        );
      case "BRANCH_ACTIONS":
        return (
          <Badge variant="outline" className="border-blue-600/40 text-blue-700 dark:text-blue-400">
            <Building2 className="h-3 w-3 mr-1 text-blue-600" /> BRANCH
          </Badge>
        );
      case "AGENT_ACTIONS":
        return (
          <Badge
            variant="outline"
            className="border-orange-600/40 text-orange-700 dark:text-orange-400"
          >
            <User className="h-3 w-3 mr-1 text-orange-600" /> AGENT
          </Badge>
        );
      case "CUSTOMER_ACTIONS":
        return (
          <Badge variant="outline" className="border-teal-600/40 text-teal-700 dark:text-teal-400">
            <User className="h-3 w-3 mr-1 text-teal-600" /> CUSTOMER
          </Badge>
        );
    }
  };

  return (
    <DashboardShell role="admin" title="Audit Logs & Compliance">
      <div className="space-y-6">
        <Panel
          title="Administrative System Audit Feed"
          action={
            <Button variant="pillOutline" size="sm" onClick={() => setExportConfirmOpen(true)}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export Audit Log
            </Button>
          }
        >
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search action, actor, entity, or log ID…"
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="w-40">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="AUTH">Authentication</SelectItem>
                    <SelectItem value="ORDER_MUTATION">Order Mutations</SelectItem>
                    <SelectItem value="AUGMONT_SYNC">Augmont Sync</SelectItem>
                    <SelectItem value="PARTNER_ONBOARDING">Partner Onboarding</SelectItem>
                    <SelectItem value="BRANCH_ACTIONS">Branch Actions</SelectItem>
                    <SelectItem value="AGENT_ACTIONS">Agent Actions</SelectItem>
                    <SelectItem value="CUSTOMER_ACTIONS">Customer Actions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                    <SelectItem value="FAILURE">Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                onClick={() => toggleSort("timestamp")}
              >
                Time {renderSortIcon("timestamp")}
              </Button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => toggleSort("timestamp")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Timestamp / Log ID</span>
                    {renderSortIcon("timestamp")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("category")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Category</span>
                    {renderSortIcon("category")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("action")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Action</span>
                    {renderSortIcon("action")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("actor")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none"
                  >
                    <span>Actor / Role</span>
                    {renderSortIcon("actor")}
                  </button>
                </TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => toggleSort("status")}
                    className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors cursor-pointer select-none ml-auto"
                  >
                    <span>Result</span>
                    {renderSortIcon("status")}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No audit logs matching your current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <p className="font-mono text-xs font-semibold text-ink">{log.id}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell>{getCategoryBadge(log.category)}</TableCell>
                    <TableCell>
                      <p className="font-medium text-xs text-ink">{log.action}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-xs">
                        {log.details}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-xs">{log.actor.name}</p>
                      <p className="text-[10px] text-muted-foreground">{log.actor.role}</p>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{log.targetEntity}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.status === "SUCCESS" ? (
                        <Badge variant="success" className="text-[10px]">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Success
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px]">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Warning
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Panel>
      </div>

      {/* Confirmation Dialog for Export */}
      <ConfirmDialog
        open={exportConfirmOpen}
        onOpenChange={setExportConfirmOpen}
        title="Export System Audit Logs?"
        description="Download a CSV of all currently-visible audit log rows. This action will be recorded in the security log."
        confirmText="Export CSV"
        onConfirm={() => {
          exportToCsv(
            "Audit_Logs",
            ["Log ID", "Timestamp", "Category", "Action", "Details", "Actor Name", "Actor Role", "Target Entity", "IP Address", "Status"],
            filteredLogs.map((log) => [
              log.id,
              new Date(log.timestamp).toISOString(),
              log.category,
              log.action,
              log.details,
              log.actor.name,
              log.actor.role,
              log.targetEntity,
              log.ipAddress,
              log.status,
            ]),
          );
        }}
      />
    </DashboardShell>
  );
}
