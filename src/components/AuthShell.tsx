import { Link } from "@tanstack/react-router";
import type { HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen lg:h-screen lg:overflow-hidden grid lg:grid-cols-[1.05fr_1fr] bg-paper">
      {/* Left — brand panel */}
      <aside className="relative bg-emerald-deep text-paper p-10 lg:p-14 flex flex-col justify-between min-h-[40vh] lg:h-screen overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
          <div className="absolute -right-20 -bottom-20 font-display text-[40rem] leading-none">
            +
          </div>
        </div>
        <Link to="/" className="relative flex items-center gap-2.5 z-10 w-fit">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-paper text-emerald-deep font-display">
            2
          </span>
          <span className="font-display text-xl">
            <span className="text-gold">+</span> Fortune Alliances
          </span>
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

      {/* Right — form. On desktop this pane owns its own scroll (lg:h-screen +
          lg:overflow-y-auto) inside the capped, non-scrolling outer frame, so the brand
          panel never moves; `my-auto` centers the form block vertically when it fits, and
          degrades gracefully (top-anchored, scrollable) instead of clipping when it's
          taller than the viewport. On mobile the panels just stack and the page scrolls
          normally. */}
      <section className="lg:h-screen lg:overflow-y-auto p-6 sm:p-10 lg:p-14 flex flex-col">
        <div className="flex justify-between items-center shrink-0">
          <Link to="/" className="text-sm text-muted-foreground hover:text-ink">
            ← Back to site
          </Link>
          <span className="text-xs text-muted-foreground">{eyebrow}</span>
        </div>
        <div className="max-w-md w-full mx-auto my-auto">
          <h1 className="font-display text-3xl md:text-4xl text-ink leading-[1.05] mb-3">
            {title}
          </h1>
          {subtitle && <p className="text-muted-foreground mb-6 text-sm">{subtitle}</p>}
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
  error,
  inputMode,
  maxLength,
}: {
  label: string;
  type?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  // Password fields get a reveal toggle. The field stays uncontrolled — every
  // page here reads its values through FormData — so this swaps the input's
  // type and never touches its value.
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <label htmlFor={name} className="eyebrow block mb-2 text-[0.65rem]">
        {label}
        {required && " *"}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && revealed ? "text" : type}
          required={required}
          placeholder={placeholder}
          aria-invalid={!!error}
          inputMode={inputMode}
          maxLength={maxLength}
          className={`w-full bg-paper border px-4 py-3 rounded-sm focus:outline-none transition-colors ${
            isPassword ? "pr-12" : ""
          } ${
            error
              ? "border-destructive focus:border-destructive"
              : "border-line focus:border-emerald-deep"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            // Outside the tab order on purpose: keyboard users move label →
            // field → next field, and a toggle in between is an obstacle. It
            // stays reachable by pointer and is announced to screen readers.
            tabIndex={-1}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground hover:text-ink transition-colors"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
