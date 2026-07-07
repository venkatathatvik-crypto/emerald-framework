import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  side,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  side?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-paper">
      {/* Left — brand panel */}
      <aside className="relative bg-emerald-deep text-paper p-10 lg:p-14 flex flex-col justify-between min-h-[40vh] lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
          <div className="absolute -right-20 -bottom-20 font-display text-[40rem] leading-none">+</div>
        </div>
        <Link to="/" className="relative flex items-center gap-2.5 z-10 w-fit">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-paper text-emerald-deep font-display">2</span>
          <span className="font-display text-xl"><span className="text-gold">+</span> Fortune Alliances</span>
        </Link>

        <div className="relative z-10 max-w-md">
          {side ?? (
            <>
              <p className="eyebrow text-gold mb-6">Onwards & Upwards</p>
              <p className="font-display text-3xl md:text-5xl leading-[1.05]">
                From everyday essentials to <em className="text-gold">timeless treasures.</em>
              </p>
              <p className="mt-6 text-paper/70 text-sm">
                Bridging premium brands and rural India through reach, reliability and trust.
              </p>
            </>
          )}
        </div>

        <div className="relative z-10 text-xs text-paper/60">
          © {new Date().getFullYear()} 2 Plus Fortune Alliances Pvt Ltd.
        </div>
      </aside>

      {/* Right — form */}
      <section className="p-8 sm:p-12 lg:p-20 flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="text-sm text-muted-foreground hover:text-ink">← Back to site</Link>
          <span className="text-xs text-muted-foreground">{eyebrow}</span>
        </div>
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <h1 className="font-display text-4xl md:text-5xl text-ink leading-[1.05] mb-4">{title}</h1>
          {subtitle && <p className="text-muted-foreground mb-10">{subtitle}</p>}
          {children}
        </div>
      </section>
    </div>
  );
}

export function AuthField({
  label,
  type = "text",
  name,
  required = false,
  placeholder,
}: {
  label: string;
  type?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow block mb-2 text-[0.65rem]">{label}{required && " *"}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-paper border border-line px-4 py-3 rounded-sm focus:outline-none focus:border-emerald-deep transition-colors"
      />
    </div>
  );
}
