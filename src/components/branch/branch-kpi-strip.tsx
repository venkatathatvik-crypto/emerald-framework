import { StatCard } from "@/components/ui/stat-card";
import { IndianRupee, Users, Activity } from "lucide-react";
import type { Branch } from "@/lib/api/types";

interface BranchKPIStripProps {
  branch: Branch;
  agentCount?: number;
}

export function BranchKPIStrip({ branch, agentCount = 0 }: BranchKPIStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Commission Rate"
        value={branch.commissionRate != null ? `${branch.commissionRate}%` : "—"}
        icon={IndianRupee}
        subtitle="Standard Partner Split"
      />
      <StatCard
        title="Active Agents"
        value={String(agentCount)}
        icon={Users}
        subtitle="Assigned Roster"
      />
      <StatCard
        title="Branch Status"
        value={branch.active ? "Active" : "Deactivated"}
        icon={Activity}
        change={{ value: branch.active ? "Healthy" : "Blocked", trend: branch.active ? "up" : "down" }}
        subtitle="Current Operational State"
      />
    </div>
  );
}
