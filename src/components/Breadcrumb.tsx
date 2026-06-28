import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link to="/" className="hover:text-ink transition-colors flex items-center gap-1">
        <Home className="h-3 w-3" />
        <span>Home</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 opacity-40" />
          {crumb.to ? (
            <Link to={crumb.to} className="hover:text-ink transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-ink font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
