import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { BackToTop } from "./BackToTop";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SiteNav />
      <main className="flex-1 pt-16 md:pt-[4.5rem]">{children}</main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  meta,
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  meta?: ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden ${dark ? "bg-ink text-paper" : "bg-white"}`}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: dark
            ? "radial-gradient(ellipse at 30% 40%, oklch(0.55 0.08 160 / 0.15) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 70% 30%, oklch(0.86 0.07 85 / 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="container-edge pt-28 md:pt-40 pb-20 md:pb-28 relative z-10">
        <p
          className={`eyebrow mb-8 ${dark ? "text-gold" : "text-emerald-deep"}`}
          data-reveal="rise-soft"
        >
          {eyebrow}
        </p>
        <h1
          data-reveal="rise"
          className={`font-display text-[12vw] md:text-[7vw] xl:text-[6.5rem] leading-[0.93] tracking-tight max-w-[18ch] ${dark ? "text-paper" : "text-ink"}`}
        >
          {title}
        </h1>
        {lede ? (
          <p
            data-reveal="rise-soft"
            style={{ animationDelay: "200ms" }}
            className={`mt-10 max-w-2xl text-lg md:text-xl leading-relaxed ${dark ? "text-paper/70" : "text-muted-foreground"}`}
          >
            {lede}
          </p>
        ) : null}
        {meta ? <div className="mt-12">{meta}</div> : null}
      </div>

      {/* Bottom hairline */}
      <div className={`absolute bottom-0 left-0 right-0 h-px ${dark ? "bg-paper/10" : "bg-line"}`} />
    </section>
  );
}
