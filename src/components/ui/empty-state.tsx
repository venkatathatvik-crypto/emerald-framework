import * as React from "react";
import { FolderOpen, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-8 text-center animate-in fade-in-50",
        className,
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-3 shadow-inner">
        <Icon className="h-6 w-6 shrink-0" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
