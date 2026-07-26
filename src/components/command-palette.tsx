import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  LayoutDashboard,
  Package,
  Building2,
  Users,
  UserPlus,
  ShieldAlert,
  ShoppingBag,
  Bell,
  Sun,
  Moon,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Actions" | "Portal Quick Search";
  icon: React.ElementType;
  action: () => void;
  roles?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: string;
}

export function CommandPalette({ open, onOpenChange, role = "customer" }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-dash",
      title: "Dashboard",
      subtitle: "Overview metrics & analytics",
      category: "Navigation",
      icon: LayoutDashboard,
      action: () => {
        const dest =
          role === "customer"
            ? "/dashboard/customer"
            : role === "branch"
              ? "/dashboard/branch"
              : role === "partner"
                ? "/dashboard/partner"
                : "/dashboard/admin";
        navigate({ to: dest });
      },
    },
    {
      id: "nav-orders",
      title: "Order Management",
      subtitle: "View order history & EMI status",
      category: "Navigation",
      icon: Package,
      action: () => {
        const dest =
          role === "customer"
            ? "/customer/orders"
            : role === "branch"
              ? "/branch/orders"
              : role === "partner"
                ? "/partner/orders"
                : "/admin/orders";
        navigate({ to: dest });
      },
    },
    {
      id: "nav-shop",
      title: "Gold Catalog",
      subtitle: "Browse 24K gold coins & bars",
      category: "Navigation",
      icon: ShoppingBag,
      action: () => navigate({ to: "/customer/shop" }),
    },
    {
      id: "nav-branches",
      title: "Branch Network",
      subtitle: "Partner branches & store IDs",
      category: "Navigation",
      icon: Building2,
      action: () => navigate({ to: "/partner/branches" }),
    },
    {
      id: "nav-leads",
      title: "Partner Leads",
      subtitle: "Review partner acquisition applications",
      category: "Navigation",
      icon: UserPlus,
      action: () => navigate({ to: "/admin/leads" }),
    },
    {
      id: "nav-audit",
      title: "Audit Logs & Security",
      subtitle: "View administrative system activity logs",
      category: "Navigation",
      icon: ShieldAlert,
      action: () => navigate({ to: "/admin/audit-logs" }),
    },
    {
      id: "nav-customers",
      title: "Customer Directory",
      subtitle: "View customer profiles & orders",
      category: "Navigation",
      icon: Users,
      action: () => navigate({ to: "/admin/customers" }),
    },
    {
      id: "nav-notifs",
      title: "Notification Center",
      subtitle: "View operational system notifications",
      category: "Navigation",
      icon: Bell,
      action: () => navigate({ to: "/notifications" }),
    },

    // Actions
    {
      id: "act-place-order",
      title: "Place New Gold Order",
      subtitle: "Self-service gold purchase",
      category: "Actions",
      icon: Package,
      action: () => navigate({ to: "/customer/shop" }),
    },
    {
      id: "act-refresh",
      title: "Refresh Augmont Status",
      subtitle: "Sync live status with Augmont API",
      category: "Actions",
      icon: RefreshCcw,
      action: () => {
        window.location.reload();
      },
    },

    // Entity Quick Search Examples
    {
      id: "entity-order-1024",
      title: "Order #1024 — 24K Gold Coin (10g)",
      subtitle: "Customer: Priya Sharma • Status: Confirmed",
      category: "Portal Quick Search",
      icon: Package,
      action: () => navigate({ to: "/customer/orders" }),
    },
    {
      id: "entity-branch-hsr",
      title: "Branch: HSR Layout Store #12",
      subtitle: "Code: AUG-BR-12 • Active Agents: 4",
      category: "Portal Quick Search",
      icon: Building2,
      action: () => navigate({ to: "/partner/branches" }),
    },
    {
      id: "entity-lead-muthoot",
      title: "Lead: Muthoot Microfinance (NBFC)",
      subtitle: "Submitted: 1 day ago • Status: New",
      category: "Portal Quick Search",
      icon: UserPlus,
      action: () => navigate({ to: "/admin/leads" }),
    },
  ];

  // Filter items by search query
  const filtered = items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item: CommandItem) => {
    onOpenChange(false);
    item.action();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden shadow-2xl border border-line">
        <DialogTitle className="sr-only">Command Palette Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search routes, orders, branches, and quick actions across Emerald Portal
        </DialogDescription>

        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-line bg-card">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground mr-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search orders, branches, leads… (press Esc to exit)"
            className="h-12 border-0 shadow-none focus-visible:ring-0 text-sm bg-transparent px-0 placeholder:text-muted-foreground/60"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-line bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching commands or entities found for &quot;{query}&quot;
            </div>
          ) : (
            <div>
              {Array.from(new Set(filtered.map((i) => i.category))).map((cat) => (
                <div key={cat} className="mb-3">
                  <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {cat}
                  </p>
                  <div className="space-y-0.5">
                    {filtered
                      .filter((i) => i.category === cat)
                      .map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-stone/80 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-md bg-paper border border-line shrink-0 group-hover:border-primary/40 transition-colors">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-ink group-hover:text-primary transition-colors truncate">
                                  {item.title}
                                </p>
                                {item.subtitle && (
                                  <p className="text-[11px] text-muted-foreground/80 truncate">
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-stone/50 border-t border-line text-[11px] text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-paper border border-line px-1 rounded text-[10px]">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-paper border border-line px-1 rounded text-[10px]">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>
          <span>Emerald Portal &bull; ⌘K shortcut</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
