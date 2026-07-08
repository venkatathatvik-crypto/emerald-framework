import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard, Receipt, Truck, BadgePercent, Users, Boxes, BarChart3, Building2,
  Settings, Bell, Search, ChevronRight, LogOut, Sparkles,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { getNewLeadCount } from "@/lib/api/admin";

export type Role = "customer" | "partner" | "branch" | "admin";

const NAV: Record<Role, { to: string; label: string; Icon: typeof LayoutDashboard }[]> = {
  customer: [
    { to: "/dashboard/customer", label: "Overview", Icon: LayoutDashboard },
    { to: "/dashboard/customer", label: "Orders", Icon: Truck },
    { to: "/dashboard/customer", label: "EMI Schedule", Icon: Receipt },
    { to: "/dashboard/customer", label: "Gold EMI", Icon: BadgePercent },
  ],
  partner: [
    { to: "/dashboard/partner", label: "Overview", Icon: LayoutDashboard },
    { to: "/dashboard/partner", label: "Indents", Icon: Boxes },
    { to: "/dashboard/partner", label: "Members", Icon: Users },
    { to: "/dashboard/partner", label: "Analytics", Icon: BarChart3 },
  ],
  branch: [
    { to: "/dashboard/branch", label: "Overview", Icon: LayoutDashboard },
    { to: "/dashboard/branch", label: "Deliveries", Icon: Truck },
    { to: "/dashboard/branch", label: "Members", Icon: Users },
    { to: "/dashboard/branch", label: "Settlements", Icon: Receipt },
  ],
  admin: [
    { to: "/dashboard/admin", label: "Overview", Icon: LayoutDashboard },
    { to: "/admin/leads", label: "Leads", Icon: Users },
    { to: "/admin/partners", label: "Partners", Icon: Building2 },
    { to: "/admin/catalog", label: "Catalogue", Icon: Boxes },
    { to: "/dashboard/admin", label: "Analytics", Icon: BarChart3 },
  ],
};

export function DashboardShell({ role, title, children }: { role: Role; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ")
    || user?.email
    || user?.mobile
    || "—";
  const initials = user?.firstName
    ? (user.firstName[0] + (user.lastName?.[0] ?? "")).toUpperCase()
    : (displayName[0] ?? "?").toUpperCase();

  useEffect(() => setOpen(false), [path]);

  const { data: newLeadCount } = useQuery({
    queryKey: ["admin", "leads", "new-count"],
    queryFn: getNewLeadCount,
    enabled: role === "admin",
    refetchInterval: 60_000,
  });

  async function handleSignOut() {
    await logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen bg-stone flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-ink text-paper flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Link to="/" className="flex items-center gap-2.5 px-6 h-16 border-b border-paper/10">
          <span className="grid place-items-center h-8 w-8 rounded-full bg-paper text-emerald-deep font-display">2</span>
          <span className="font-display text-lg"><span className="text-gold">+</span>FAPL</span>
          <span className="ml-auto text-[10px] uppercase tracking-widest text-paper/40">{role}</span>
        </Link>
        <nav className="flex-1 p-4 space-y-1">
          {NAV[role].map((n, i) => (
            <Link
              key={i}
              to={n.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-paper/70 hover:bg-paper/5 hover:text-paper transition-colors"
              activeProps={{ className: "bg-paper/5 text-paper" }}
              activeOptions={{ exact: i === 0 }}
            >
              <n.Icon className="h-4 w-4" />
              {n.label}
              {i === 0 && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold">Live</span>}
              {n.label === "Leads" && !!newLeadCount && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold">{newLeadCount}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-paper/10 p-4">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-paper/70 hover:bg-paper/5 hover:text-paper">
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-paper/70 hover:bg-paper/5 hover:text-paper"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-ink/40 lg:hidden" />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-paper/85 backdrop-blur border-b border-line h-16 flex items-center gap-4 px-4 md:px-8">
          <button onClick={() => setOpen(!open)} className="lg:hidden text-sm">☰</button>
          <nav className="hidden md:flex items-center text-xs text-muted-foreground gap-2">
            <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">{title}</span>
          </nav>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-paper w-72">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search orders, members, brands… (⌘K)" className="bg-transparent text-sm w-full focus:outline-none" />
          </div>
          <button className="relative grid place-items-center h-9 w-9 rounded-full border border-line bg-paper" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-line">
            <div className="h-9 w-9 rounded-full bg-emerald-deep text-paper grid place-items-center text-sm font-display">{initials}</div>
            <div className="hidden md:block">
              <p className="text-xs">{displayName}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
            </div>
          </div>
        </header>

        {/* Page header */}
        <div className="px-4 md:px-8 pt-10 pb-6 bg-paper border-b border-line">
          <p className="eyebrow mb-2">{role} dashboard</p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1 className="font-display text-4xl md:text-5xl text-ink leading-[1.05]">{title}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-stone px-3 py-1.5 rounded-full">
              <Sparkles className="h-3 w-3 text-gold" />
              All systems normal
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: string; accent?: boolean }) {
  return (
    <div className={`p-6 rounded-md border ${accent ? "bg-ink text-paper border-ink" : "bg-paper border-line"}`}>
      <p className={`eyebrow ${accent ? "!text-gold" : ""}`}>{label}</p>
      <p className="font-display text-4xl mt-3 leading-none">{value}</p>
      {sub && <p className={`text-xs mt-2 ${accent ? "text-paper/60" : "text-muted-foreground"}`}>{sub}</p>}
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`bg-paper border border-line rounded-md p-6 ${className}`}>
      <header className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}
