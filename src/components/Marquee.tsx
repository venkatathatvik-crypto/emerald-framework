import type { ReactNode } from "react";

export function Marquee({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max gap-16 whitespace-nowrap">
        <div className="flex items-center gap-16">{children}</div>
        <div className="flex items-center gap-16" aria-hidden>{children}</div>
      </div>
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent pointer-events-none" />
    </div>
  );
}
