import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
  };
  icon?: LucideIcon;
  variant?: "default" | "emerald" | "gold";
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  variant = "default",
  className,
  ...props
}: StatCardProps) {
  const isUp = change?.trend === "up";
  const isDown = change?.trend === "down";

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md border-border",
        variant === "emerald" && "border-primary/20 bg-primary/5",
        variant === "gold" && "border-gold/30 bg-gold/5",
        className,
      )}
      {...props}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          {Icon && (
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground",
                variant === "emerald" && "bg-primary/10 text-primary",
                variant === "gold" && "bg-gold/20 text-gold-soft dark:text-gold",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {change && (
            <Badge
              variant={isUp ? "success" : isDown ? "destructive" : "secondary"}
              className="px-1.5 py-0.5 text-xs font-semibold"
            >
              {isUp && <ArrowUpRight className="mr-0.5 h-3 w-3 inline" />}
              {isDown && <ArrowDownRight className="mr-0.5 h-3 w-3 inline" />}
              {change.value}
            </Badge>
          )}
        </div>

        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
