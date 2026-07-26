import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  Building2,
  UserCheck,
  FileText,
  Clock,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

import { DashboardShell, Panel } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Activity & Notifications — Emerald Portal" }] }),
  component: Page,
});

interface ActivityItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: "order" | "document" | "branch" | "partner" | "lead";
  link?: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "notif-1",
    title: "Order Placed",
    message: "Your 24K Gold Bar order #1024 has been successfully placed.",
    timestamp: "10 mins ago",
    read: false,
    category: "order",
    link: "/customer/orders",
  },
  {
    id: "notif-2",
    title: "Augmont Booking Success",
    message: "Your gold booking #AUG-9921 is confirmed with our vault partner.",
    timestamp: "45 mins ago",
    read: false,
    category: "order",
    link: "/customer/orders",
  },
  {
    id: "notif-3",
    title: "Walk-in Order Created",
    message: "Agent Ramesh placed Order #1025 for customer Priya Sharma.",
    timestamp: "2 hours ago",
    read: false,
    category: "order",
    link: "/branch/orders",
  },
  {
    id: "notif-4",
    title: "Contract Agreement Ready",
    message: "Your digital Gold EMI Purchase Contract is ready to view.",
    timestamp: "3 hours ago",
    read: true,
    category: "document",
    link: "/customer/orders",
  },
  {
    id: "notif-5",
    title: "Proforma Invoice Issued",
    message: "Proforma invoice generated for Order #1024.",
    timestamp: "4 hours ago",
    read: true,
    category: "document",
    link: "/customer/orders",
  },
  {
    id: "notif-6",
    title: "New Branch Added",
    message: "Branch 'Koramangala Hub' added under referral code AUG-PART-12.",
    timestamp: "1 day ago",
    read: true,
    category: "branch",
    link: "/partner/branches",
  },
  {
    id: "notif-7",
    title: "New Lead Submission",
    message: "New partner lead received from 'Muthoot Microfinance (NBFC)'.",
    timestamp: "1 day ago",
    read: true,
    category: "lead",
    link: "/admin/leads",
  },
  {
    id: "notif-8",
    title: "Lead Conversion",
    message: "Lead 'Chola Gold' converted into an active Alliance Partner.",
    timestamp: "2 days ago",
    read: true,
    category: "partner",
    link: "/admin/partners",
  },
  {
    id: "notif-9",
    title: "Order Cancelled",
    message: "Cancellation processed for Order #1024. Refund will arrive in 3-5 days.",
    timestamp: "3 days ago",
    read: true,
    category: "order",
    link: "/customer/orders",
  },
];

function Page() {
  const [items, setItems] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [filter, setFilter] = useState<string>("ALL");

  const unreadCount = items.filter((i) => !i.read).length;

  const filteredItems = items.filter((item) => {
    if (filter === "UNREAD") return !item.read;
    if (filter === "ORDER") return item.category === "order";
    if (filter === "DOCUMENT") return item.category === "document";
    if (filter === "BRANCH") return item.category === "branch";
    if (filter === "PARTNER") return item.category === "partner" || item.category === "lead";
    return true;
  });

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  };

  const clearAll = () => {
    setItems([]);
  };

  const getCategoryIcon = (category: ActivityItem["category"]) => {
    switch (category) {
      case "order":
        return <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "document":
        return <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "branch":
        return <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "partner":
      case "lead":
        return <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <DashboardShell role="customer" title="Activity & Notifications">
      <Link
        to="/dashboard/customer"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
      </Link>

      <div className="space-y-6">
        <Panel
          title="Notification Center"
          action={
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="pillOutline" size="sm" onClick={markAllRead}>
                  <CheckCheck className="h-3.5 w-3.5 mr-1.5" /> Mark all read
                </Button>
              )}
              {items.length > 0 && (
                <Button variant="pillDestructive" size="sm" onClick={clearAll}>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear all
                </Button>
              )}
            </div>
          }
        >
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-line overflow-x-auto">
            {["ALL", "UNREAD", "ORDER", "DOCUMENT", "BRANCH", "PARTNER"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors select-none ${
                  filter === f
                    ? "bg-ink text-paper dark:bg-paper dark:text-ink font-semibold"
                    : "bg-stone text-muted-foreground hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Activity List */}
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No activity items found</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !item.read
                      ? "border-emerald/40 bg-emerald/5"
                      : "border-line bg-card hover:bg-stone/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-paper border border-line shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-ink">{item.title}</h4>
                          {!item.read && (
                            <Badge variant="default" className="text-[10px] bg-emerald text-white">
                              New
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground/80 flex items-center shrink-0">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.message}
                      </p>

                      {item.link && (
                        <Link
                          to={item.link}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline mt-3"
                        >
                          View related entity <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
