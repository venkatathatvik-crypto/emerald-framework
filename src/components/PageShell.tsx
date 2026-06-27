import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SiteNav />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  meta,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <section className="container-edge pt-24 md:pt-36 pb-20 md:pb-28">
      <p className="eyebrow mb-8" data-reveal="rise-soft">{eyebrow}</p>
      <h1
        data-reveal="rise"
        className="font-display text-[14vw] md:text-[8vw] xl:text-[7rem] leading-[0.92] tracking-tight text-ink max-w-[16ch]"
      >
        {title}
      </h1>
      {lede ? (
        <p
          data-reveal="rise-soft"
          style={{ animationDelay: "200ms" }}
          className="mt-10 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          {lede}
        </p>
      ) : null}
      {meta ? <div className="mt-12">{meta}</div> : null}
    </section>
  );
}
