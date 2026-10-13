import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Truck,
  BadgePercent,
  Users,
  Boxes,
  Building2,
  Settings,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  Sparkles,
  PlusCircle,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { getNewLeadCount } from "@/lib/api/admin";
import { useCartCount, setCartScope } from "@/lib/cart";
import { NotificationDrawer } from "@/components/notifications/notification-drawer";
import { CommandPalette } from "@/components/command-palette";
import { SessionTimeoutModal } from "@/components/SessionTimeoutModal";

export type Role = "customer" | "partner" | "branch" | "admin";

/** Remembers the collapsed sidebar per browser. */
const SIDEBAR_KEY = "goldemi.sidebar.collapsed";

const NAV: Record<Role, { to: string; label: string; Icon: typeof LayoutDashboard }[]> = {
  customer: [
    { to: "/dashboard/customer", label: "Overview", Icon: LayoutDashboard },
    { to: "/customer/shop", label: "Shop", Icon: BadgePercent },
    { to: "/customer/cart", label: "Basket", Icon: ShoppingBag },
    { to: "/customer/orders", label: "My Orders", Icon: Truck },
  ],
  partner: [
    { to: "/dashboard/partner", label: "Overview", Icon: LayoutDashboard },
    { to: "/partner/branches", label: "Branches", Icon: Building2 },
    { to: "/partner/orders", label: "Orders", Icon: Truck },
    { to: "/partner/customers", label: "Customers", Icon: Users },
  ],
  branch: [
    { to: "/dashboard/branch", label: "Overview", Icon: LayoutDashboard },
    { to: "/branch/place-order", label: "Place order", Icon: PlusCircle },
    { to: "/branch/orders", label: "Orders", Icon: Truck },
    { to: "/branch/customers", label: "Customers", Icon: Users },
  ],
  admin: [
    { to: "/dashboard/admin", label: "Overview", Icon: LayoutDashboard },
    { to: "/admin/orders", label: "Orders", Icon: Truck },
    { to: "/admin/leads", label: "Leads", Icon: Users },
    { to: "/admin/partners", label: "Partners", Icon: Building2 },
    { to: "/admin/customers", label: "Customers", Icon: Users },
    { to: "/admin/catalog", label: "Catalogue", Icon: Boxes },
    { to: "/admin/audit-logs", label: "Audit Logs", Icon: ShieldAlert },
  ],
};

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: Role;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Read after mount, never during render: this is server-rendered, and reading
  // localStorage while rendering would make the server and client markup differ.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      // private mode or blocked storage — stay expanded
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        // not fatal; the choice just will not survive a reload
      }
      return next;
    });
  }
  const [notifOpen, setNotifOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => setOpen(false), [path]);

  // Global ⌘K / Ctrl+K keyboard shortcut trigger for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    user?.mobile ||
    "—";
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

  // Scope the basket to the signed-in customer, so a shared browser can't carry
  // one person's basket into the next session.
  const cartCount = useCartCount();
  useEffect(() => {
    setCartScope(user?.uuid);
  }, [user?.uuid]);

  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    // Guarded: on a slow connection the request can take seconds, and without
    // this the button stays live and fires logout again on every click.
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
    } finally {
      // logout() clears the local user even if the request failed, so leaving
      // is always the right outcome.
      navigate({ to: "/login" });
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-stone flex">
      {/* Sidebar — a flex child of a viewport-height, non-scrolling outer frame on desktop
          (lg:static lg:h-full), so it's simply always exactly one viewport tall; no sticky
          trickery needed since main content scrolls in its own pane below, not the page.
          Overlay/fixed on mobile as before. */}
      {/* Collapsed state applies from lg up; below that the sidebar is an overlay
          that is either open or off-screen, where a narrow rail makes no sense. */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-ink text-paper flex flex-col transition-all duration-300 lg:translate-x-0 lg:static lg:h-full ${
          collapsed ? "lg:w-20" : "lg:w-72"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <TooltipProvider delayDuration={0}>
          <Link
            to="/"
            className={`flex items-center gap-2.5 h-16 border-b border-paper/10 shrink-0 ${
              collapsed ? "px-6 lg:px-0 lg:justify-center" : "px-6"
            }`}
          >
            <span className="grid place-items-center h-8 w-8 rounded-full bg-paper text-emerald-deep font-display shrink-0">
              2
            </span>
            <span className={`font-display text-lg ${collapsed ? "lg:hidden" : ""}`}>
              <span className="text-gold">+</span>FAPL
            </span>
            <span
              className={`ml-auto text-[10px] uppercase tracking-widest text-paper/40 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              {role}
            </span>
          </Link>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
            {NAV[role].map((n, i) => {
              const badge =
                i === 0
                  ? "Live"
                  : n.label === "Leads" && newLeadCount
                    ? String(newLeadCount)
                    : n.label === "Basket" && cartCount > 0
                      ? String(cartCount)
                      : null;

              const link = (
                <Link
                  to={n.to}
                  className={`flex items-center gap-3 py-2.5 rounded-md text-sm text-paper/70 hover:bg-paper/5 hover:text-paper transition-colors ${
                    collapsed ? "px-3 lg:px-0 lg:justify-center" : "px-3"
                  }`}
                  activeProps={{ className: "bg-paper/5 text-paper" }}
                  activeOptions={{ exact: i === 0 }}
                >
                  <n.Icon className="h-4 w-4 shrink-0" />
                  <span className={collapsed ? "lg:hidden" : ""}>{n.label}</span>
                  {badge && (
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold ${
                        collapsed ? "lg:hidden" : ""
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );

              // Collapsed, the icon is all there is — the tooltip is what names it.
              return collapsed ? (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">
                    {n.label}
                    {badge ? ` · ${badge}` : ""}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={i}>{link}</div>
              );
            })}
          </nav>

          <div className="border-t border-paper/10 p-4 shrink-0">
            {(() => {
              const profile = (
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 py-2.5 rounded-md text-sm text-paper/70 hover:bg-paper/5 hover:text-paper ${
                    collapsed ? "px-3 lg:px-0 lg:justify-center" : "px-3"
                  }`}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span className={collapsed ? "lg:hidden" : ""}>Profile</span>
                </Link>
              );
              return collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>{profile}</TooltipTrigger>
                  <TooltipContent side="right">Profile</TooltipContent>
                </Tooltip>
              ) : (
                profile
              );
            })()}

            {(() => {
              const signOut = (
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className={`w-full flex items-center gap-3 py-2.5 rounded-md text-sm text-paper/70 hover:bg-paper/5 hover:text-paper disabled:opacity-60 disabled:cursor-not-allowed ${
                    collapsed ? "px-3 lg:px-0 lg:justify-center" : "px-3"
                  }`}
                >
                  {signingOut ? (
                    <Spinner size={16} label="" />
                  ) : (
                    <LogOut className="h-4 w-4 shrink-0" />
                  )}
                  <span className={collapsed ? "lg:hidden" : ""}>
                    {signingOut ? "Signing out…" : "Sign out"}
                  </span>
                </button>
              );
              return collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>{signOut}</TooltipTrigger>
                  <TooltipContent side="right">
                    {signingOut ? "Signing out…" : "Sign out"}
                  </TooltipContent>
                </Tooltip>
              ) : (
                signOut
              );
            })()}
          </div>
        </TooltipProvider>
      </aside>

      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-ink/40 lg:hidden" />
      )}

      {/* Main — its own independent scroll container, so tall page content never affects
          the sidebar or grows the outer (non-scrolling) page frame. */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-paper/85 backdrop-blur border-b border-line h-16 flex items-center gap-4 px-4 md:px-8">
          <button onClick={() => setOpen(!open)} className="lg:hidden text-sm">
            ☰
          </button>
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className="hidden lg:grid place-items-center h-8 w-8 rounded-md text-muted-foreground hover:bg-stone hover:text-ink transition-colors"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
          <nav className="hidden md:flex items-center text-xs text-muted-foreground gap-2">
            <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">{title}</span>
          </nav>
          <div className="flex-1" />
          <button
            onClick={() => setCmdOpen(true)}
            className="hidden md:flex items-center justify-between gap-2 px-3 py-1.5 rounded-full border border-line bg-paper w-72 text-left cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground/80">Search orders, branches…</span>
            </div>
            <kbd className="font-mono text-[10px] text-muted-foreground bg-stone px-1.5 py-0.5 rounded border border-line">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => setNotifOpen(true)}
            className="relative grid place-items-center h-9 w-9 rounded-full border border-line bg-paper hover:bg-stone/80 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-ink" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald animate-pulse" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-line">
            <div className="h-9 w-9 rounded-full bg-emerald-deep text-paper grid place-items-center text-sm font-display">
              {initials}
            </div>
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

        <SessionTimeoutModal />
      </div>

      <NotificationDrawer open={notifOpen} onOpenChange={setNotifOpen} />
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} role={role} />
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-md border ${accent ? "bg-ink text-paper border-ink" : "bg-paper border-line"}`}
    >
      <p className={`eyebrow ${accent ? "!text-gold" : ""}`}>{label}</p>
      <p className="font-display text-4xl mt-3 leading-none">{value}</p>
      {sub && (
        <p className={`text-xs mt-2 ${accent ? "text-paper/60" : "text-muted-foreground"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
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
