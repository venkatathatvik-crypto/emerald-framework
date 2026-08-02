import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Panel } from "@/components/DashboardShell";
import { MapPin, Clock, Mail, Phone, Building } from "lucide-react";
import type { Branch } from "@/lib/api/types";

interface BranchDetailTabsProps {
  branch: Branch;
  agentsContent: React.ReactNode;
}

export function BranchDetailTabs({ branch, agentsContent }: BranchDetailTabsProps) {
  return (
    <Tabs defaultValue="agents" className="w-full space-y-4">
      <TabsList className="bg-stone p-1 border border-line rounded-lg">
        <TabsTrigger value="agents" className="text-xs font-semibold">
          Agents Roster
        </TabsTrigger>
        <TabsTrigger value="overview" className="text-xs font-semibold">
          Overview & Performance
        </TabsTrigger>
        <TabsTrigger value="location" className="text-xs font-semibold">
          Location & Schedule
        </TabsTrigger>
      </TabsList>

      <TabsContent value="agents" className="space-y-4">
        {agentsContent}
      </TabsContent>

      <TabsContent value="overview" className="space-y-4">
        <Panel title="Branch Performance Overview">
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-ink text-xs uppercase tracking-wider text-muted-foreground">
                Branch Metadata
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-line pb-1.5 text-xs">
                  <span className="text-muted-foreground">Branch Code</span>
                  <span className="font-mono text-ink font-medium">{branch.code || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-line pb-1.5 text-xs">
                  <span className="text-muted-foreground">Commission Rate</span>
                  <span className="font-medium text-primary">
                    {branch.commissionRate != null ? `${branch.commissionRate}%` : "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-line pb-1.5 text-xs">
                  <span className="text-muted-foreground">Operational Status</span>
                  <span className="font-medium">{branch.active ? "Active" : "Deactivated"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-ink text-xs uppercase tracking-wider text-muted-foreground">
                Contact & Communication
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{branch.contactEmail || "No email on record"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{branch.contactPhone || "No phone number on record"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {[branch.city, branch.state, branch.pincode].filter(Boolean).join(", ") || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </TabsContent>

      <TabsContent value="location" className="space-y-4">
        <Panel title="Branch Address & Operating Schedule">
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-ink font-semibold">
                <Building className="h-4 w-4 text-primary" /> Branch Location
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {[branch.address, branch.city, branch.state, branch.pincode]
                  .filter(Boolean)
                  .join(", ") || "Address details not updated."}
              </p>
              <div className="h-32 w-full rounded-lg border border-line bg-stone flex items-center justify-center text-xs text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1 text-primary" /> Interactive GIS Preview Box
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-ink font-semibold">
                <Clock className="h-4 w-4 text-primary" /> Operating Schedule
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between border-b border-line pb-1">
                  <span>Monday – Friday</span>
                  <span className="text-ink font-medium">09:30 AM – 06:30 PM</span>
                </div>
                <div className="flex justify-between border-b border-line pb-1">
                  <span>Saturday</span>
                  <span className="text-ink font-medium">10:00 AM – 04:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-line pb-1">
                  <span>Sunday</span>
                  <span className="text-destructive font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </TabsContent>
    </Tabs>
  );
}
