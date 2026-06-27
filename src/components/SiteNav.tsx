import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV = [
  { to: "/about", label: "About" },
  { to: "/business-model", label: "Business Model" },
  { to: "/products", label: "Products" },
  { to: "/hassle-free-emi", label: "Hassle-Free EMI" },
  { to: "/gold-emi", label: "Gold EMI" },
  { to: "/brands", label: "Brands" },
  { to: "/leadership", label: "Leadership" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-md bg-paper/80 border-b border-line"
            : "bg-transparent"
        }`}
      >
        <div className="container-edge flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="2+FAPL home">
            <span className="grid place-items-center h-8 w-8 rounded-full bg-emerald-deep text-paper font-display text-base">
              2
            </span>
            <span className="font-display text-lg leading-none">
              <span className="text-emerald-deep">+</span>FAPL
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-7 text-sm">
            {NAV.slice(0, 7).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground hover:text-ink transition-colors duration-300 relative"
                activeProps={{ className: "text-ink" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden md:inline-flex btn-ghost">
              Sign in
            </Link>
            <Link to="/contact" className="hidden md:inline-flex btn-primary">
              Partner with us
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="xl:hidden grid place-items-center h-10 w-10 rounded-full border border-line"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay menu */}
      <div
        className={`fixed inset-0 z-[60] bg-paper transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-edge flex items-center justify-between h-16 md:h-20">
          <span className="font-display text-lg">
            <span className="text-emerald-deep">+</span>FAPL
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid place-items-center h-10 w-10 rounded-full border border-line"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="container-edge pt-10 pb-16 grid lg:grid-cols-[1.2fr_1fr] gap-12">
          <nav className="flex flex-col">
            {NAV.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                className="py-3 border-b border-line font-display text-3xl md:text-5xl text-ink hover:text-emerald-deep transition-colors duration-300 flex items-center justify-between"
                style={{
                  animation: open ? `rise-soft 0.7s ${i * 50}ms cubic-bezier(0.22,1,0.36,1) both` : undefined,
                }}
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-5 w-5 opacity-40" />
              </Link>
            ))}
          </nav>
          <aside className="lg:border-l lg:border-line lg:pl-12 flex flex-col gap-8">
            <div>
              <p className="eyebrow mb-3">Portals</p>
              <div className="flex flex-col gap-2">
                <Link to="/portal/customer" className="link-underline text-lg">Customer Portal</Link>
                <Link to="/portal/partner" className="link-underline text-lg">Partner Portal</Link>
                <Link to="/login" className="link-underline text-lg">Sign in</Link>
                <Link to="/register/customer" className="link-underline text-lg">Customer Registration</Link>
                <Link to="/register/partner" className="link-underline text-lg">Partner Registration</Link>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Headquarters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                504, 5th Floor, Nami Shree Infratech,<br />
                T19 Towers, MG Road, Rani Ganj,<br />
                Hyderabad — 500003
              </p>
            </div>
            <div>
              <p className="eyebrow mb-3">Direct</p>
              <p className="text-sm">+91 9966 16 1616</p>
              <p className="text-sm">+91 7306 96 9696</p>
              <p className="text-sm mt-2">srikanth.pagolu@2plusfortunealliances.com</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
