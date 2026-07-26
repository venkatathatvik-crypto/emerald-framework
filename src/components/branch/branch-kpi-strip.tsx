import { StatCard } from "@/components/ui/stat-card";
import { IndianRupee, ShoppingBag, Scale, Users, Activity } from "lucide-react";
import type { Branch } from "@/lib/api/types";

interface BranchKPIStripProps {
  branch: Branch;
  agentCount?: number;
}

export function BranchKPIStrip({ branch, agentCount = 0 }: BranchKPIStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Commission Rate"
        value={branch.commissionRate != null ? `${branch.commissionRate}%` : "—"}
        icon={<IndianRupee className="h-4 w-4" />}
        description="Standard Partner Split"
      />
      <StatCard
        title="Active Agents"
        value={String(agentCount)}
        icon={<Users className="h-4 w-4" />}
        description="Assigned Roster"
      />
      <StatCard
        title="Allocated Metal"
        value="500g"
        icon={<Scale className="h-4 w-4" />}
        description="Vault Security Limit"
      />
      <StatCard
        title="Branch Status"
        value={branch.active ? "Active" : "Deactivated"}
        icon={<Activity className="h-4 w-4" />}
        trend={{ value: branch.active ? "Healthy" : "Blocked", isPositive: branch.active }}
        description="Current Operational State"
      />
    </div>
  );
}
