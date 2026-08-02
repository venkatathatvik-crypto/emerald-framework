import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell, StatCard, Panel } from "@/components/DashboardShell";
import { useRequireRole } from "@/hooks/use-require-role";
import {
  listPartners,
  listCustomers,
  listLeads,
  getNewLeadCount,
  getAugmontDashboard,
} from "@/lib/api/admin";
import { formatInr } from "@/lib/api/augmont";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/spinner";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — 2+ Fortune Alliances" }] }),
  component: Page,
});

const LEAD_STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  NEW: "default",
  CONTACTED: "secondary",
  CONVERTED: "outline",
  REJECTED: "destructive",
};

function Page() {
  const { ready } = useRequireRole("ROLE_ADMIN");

  const { data: activePartners, isLoading: partnersLoading } = useQuery({
    queryKey: ["admin", "partners", "count", "active"],
    queryFn: () => listPartners({ active: true, size: 1 }),
    enabled: ready,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["admin", "customers", "count"],
    queryFn: () => listCustomers({ size: 1 }),
    enabled: ready,
  });

  const { data: newLeadCount } = useQuery({
    queryKey: ["admin", "leads", "new-count"],
    queryFn: getNewLeadCount,
    enabled: ready,
  });

  const { data: recentLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["admin", "leads", "recent"],
    queryFn: () => listLeads({ size: 5 }),
    enabled: ready,
  });

  const { data: recentPartners, isLoading: recentPartnersLoading } = useQuery({
    queryKey: ["admin", "partners", "recent"],
    queryFn: () => listPartners({ size: 5 }),
    enabled: ready,
  });

  // Augmont's own booked-order aggregation. Treated as best-effort: a failure
  // here shouldn't blank out the rest of the dashboard, so the cards fall back
  // to an em-dash rather than the page erroring.
  const {
    data: augmont,
    isLoading: augmontLoading,
    isError: augmontError,
  } = useQuery({
    queryKey: ["admin", "dashboard", "augmont"],
    queryFn: getAugmontDashboard,
    enabled: ready,
    retry: 1,
  });

  if (!ready) return null;

  const augmontUnavailable = augmontError || (!augmontLoading && !augmont);
  /** "—" while loading or if Augmont is unreachable, so we never imply a real zero. */
  const augmontValue = (value: string | number | null | undefined) =>
    augmontLoading || augmontUnavailable || value == null ? "—" : String(value);
  const augmontMoney = (value: number | null | undefined) =>
    augmontLoading || augmontUnavailable || value == null ? "—" : formatInr(value);

  return (
    <DashboardShell role="admin" title="Company Overview">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active partners"
          value={partnersLoading ? "—" : String(activePartners?.totalItems ?? 0)}
          sub="Live partner accounts"
        />
        <StatCard
          label="Total customers"
          value={customersLoading ? "—" : String(customers?.totalItems ?? 0)}
          sub="Across all channels"
        />
        <StatCard
          label="Total leads"
          value={leadsLoading ? "—" : String(recentLeads?.totalItems ?? 0)}
          sub="All-time submissions"
        />
        <StatCard
          label="New leads"
          value={String(newLeadCount ?? 0)}
          sub="Awaiting review"
          accent
        />

        {/* Booked-order figures straight from Augmont's own aggregation — these
            span the whole broker account, so they can include orders not placed
            through this app. */}
        <StatCard
          label="Orders today"
          value={augmontValue(augmont?.todaysBooked?.numberOfTodaysbookedOrder)}
          sub={
            augmontUnavailable
              ? "Augmont unavailable"
              : `${augmontMoney(augmont?.todaysBooked?.totalAmountOftodaysOrder)} booked`
          }
        />
        <StatCard
          label="Orders this month"
          value={augmontValue(augmont?.lastMonthsBooked?.numberOflastMonthBookedOrder)}
          sub={
            augmontUnavailable
              ? "Augmont unavailable"
              : `${augmontMoney(augmont?.lastMonthsBooked?.totalAmountOflastMonthOrder)} booked`
          }
        />
        <StatCard
          label="Gold booked"
          value={
            augmont?.tilldatebooked?.totalWeightOfTillDateOrder && !augmontUnavailable
              ? `${augmont.tilldatebooked.totalWeightOfTillDateOrder} g`
              : "—"
          }
          sub="All-time, via Augmont"
        />
        <StatCard
          label="Booked value"
          value={augmontMoney(augmont?.tilldatebooked?.totalAmountOfTillDateOrder)}
          sub={`All-time · ${augmontValue(augmont?.tilldatebooked?.numberOftillDateBookedOrder)} orders`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel
          title="Recent leads"
          action={
            <Link to="/admin/leads" className="text-xs link-underline">
              View all
            </Link>
          }
        >
          {leadsLoading && (
            <LoadingState label="Loading leads…" />
          )}
          {!leadsLoading && !recentLeads?.items.length && (
            <p className="text-sm text-muted-foreground py-10 text-center">No leads yet.</p>
          )}
          {!!recentLeads?.items.length && (
            <ul className="space-y-3 text-sm">
              {recentLeads.items.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0"
                >
                  <div>
                    <p className="font-medium">{lead.companyName}</p>
                    <p className="text-xs text-muted-foreground">{lead.contactPerson}</p>
                  </div>
                  <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>{lead.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent partners"
          action={
            <Link to="/admin/partners" className="text-xs link-underline">
              View all
            </Link>
          }
        >
          {recentPartnersLoading && (
            <LoadingState label="Loading partners…" />
          )}
          {!recentPartnersLoading && !recentPartners?.items.length && (
            <p className="text-sm text-muted-foreground py-10 text-center">
              No partners onboarded yet.
            </p>
          )}
          {!!recentPartners?.items.length && (
            <ul className="space-y-3 text-sm">
              {recentPartners.items.map((partner) => (
                <li
                  key={partner.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0"
                >
                  <div>
                    <p className="font-medium">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">{partner.type}</p>
                  </div>
                  <Badge variant={partner.active ? "default" : "destructive"}>
                    {partner.active ? "Active" : "Inactive"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
