import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Package,
  Building2,
  UserCheck,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: "order" | "document" | "branch" | "partner" | "lead";
  link?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
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

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "order" | "document">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "order") return n.category === "order";
    if (filter === "document") return n.category === "document";
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markSingleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const getCategoryIcon = (category: AppNotification["category"]) => {
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b border-line bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base font-semibold">Notifications</SheetTitle>
              {unreadCount > 0 && (
                <Badge variant="default" className="text-xs bg-emerald text-white">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  className="h-8 text-xs text-muted-foreground hover:text-ink"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-8 text-xs text-muted-foreground hover:text-destructive"
                  title="Clear all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
          <SheetDescription className="sr-only">
            View real-time operational notifications and updates
          </SheetDescription>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 overflow-x-auto">
            {(["all", "unread", "order", "document"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-colors select-none ${
                  filter === f
                    ? "bg-ink text-paper dark:bg-paper dark:text-ink font-semibold"
                    : "bg-stone text-muted-foreground hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Notifications Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs text-muted-foreground/80 mt-1">You&apos;re all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markSingleRead(n.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer relative group ${
                  !n.read
                    ? "border-emerald/40 bg-emerald/5 hover:bg-emerald/10"
                    : "border-line bg-card hover:bg-stone/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-paper border border-line shrink-0 mt-0.5">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold ${
                          !n.read ? "text-ink" : "text-foreground"
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground/80 flex items-center shrink-0">
                        <Clock className="h-3 w-3 mr-0.5" />
                        {n.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => onOpenChange(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald hover:underline mt-2"
                      >
                        View details <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  {!n.read && (
                    <span
                      className="h-2 w-2 rounded-full bg-emerald shrink-0 mt-1"
                      title="Unread"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-line bg-card text-center">
          <Link
            to="/notifications"
            onClick={() => onOpenChange(false)}
            className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            View all activity <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
