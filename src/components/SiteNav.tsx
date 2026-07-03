import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";

// ─── Navigation Structure ───────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "Company",
    items: [
      { label: "About Us", to: "/about", desc: "Our story, philosophy & values" },
      { label: "Leadership", to: "/leadership", desc: "The team behind 2+FAPL" },
      { label: "CSR & Impact", to: "/about#csr", desc: "Community empowerment initiatives" },
      { label: "Careers", to: "/careers", desc: "Grow with us" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Business Model", to: "/business-model", desc: "How our distribution network works" },
      { label: "Products", to: "/products", desc: "11 consumer categories, 24+ brands" },
      { label: "Hassle-Free EMI", to: "/hassle-free-emi", desc: "Zero interest, zero processing fee" },
      { label: "Gold EMI", to: "/gold-emi", desc: "Premium gold financing solutions" },
    ],
  },
  {
    label: "Network",
    items: [
      { label: "Brands & Partners", to: "/brands", desc: "18 MFI partners, 24+ premium brands" },
      { label: "Branch Network", to: "/brands#branches", desc: "20+ states, growing footprint" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Contact", to: "/contact", desc: "Get in touch with our team" },
      { label: "Careers", to: "/careers", desc: "Open positions across India" },
    ],
  },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileGroup(null);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleGroupEnter = (label: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActiveGroup(label);
  };

  const handleGroupLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setActiveGroup(null);
    }, 280); // 280ms forgiving delay
  };

  const isGroupActive = (group: typeof NAV_GROUPS[number]) =>
    group.items.some((item) => pathname.startsWith(item.to.split("#")[0]));

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <ScrollProgress />

      {/* ── Header ── */}
      <header
        className={`nav-header ${scrolled ? "nav-header--scrolled" : "nav-header--top"}`}
        onMouseLeave={handleGroupLeave}
      >
        <div className="container-edge flex items-center justify-between h-14 md:h-[4.2rem]">

          {/* Logo - Increased size by 20-25% */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="2+FAPL home">
            <img
              src="/images/logo.png"
              alt="2+ Fortune Alliances"
              className="h-11 md:h-[3.35rem] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden xl:flex items-center gap-0.5 text-sm" role="navigation">

            {/* Home link */}
            <div 
              className="nav-item-container"
              onMouseEnter={() => handleGroupLeave()}
            >
              <Link
                to="/"
                className={`nav-link ${pathname === "/" ? "nav-link--active" : ""}`}
                activeOptions={{ exact: true }}
              >
                Home
              </Link>
            </div>

            {/* Dropdown groups */}
            {NAV_GROUPS.map((group) => (
              <div
                key={group.label}
                className="nav-item-container"
                onMouseEnter={() => handleGroupEnter(group.label)}
                onMouseLeave={handleGroupLeave}
              >
                <button
                  className={`nav-link flex items-center gap-1 ${isGroupActive(group) ? "nav-link--active" : ""}`}
                  aria-expanded={activeGroup === group.label}
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${activeGroup === group.label ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                <div 
                  className={`nav-dropdown ${activeGroup === group.label ? "nav-dropdown--open" : ""}`}
                  onMouseEnter={() => handleGroupEnter(group.label)}
                  onMouseLeave={handleGroupLeave}
                >
                  <div className="nav-dropdown-inner">
                    {group.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`nav-dropdown-item ${pathname.startsWith(item.to.split("#")[0]) ? "nav-dropdown-item--active" : ""}`}
                        onClick={() => setActiveGroup(null)}
                      >
                        <span className="nav-dropdown-item-accent" />
                        <div>
                          <p className="nav-dropdown-item-label">{item.label}</p>
                          <p className="nav-dropdown-item-desc">{item.desc}</p>
                        </div>
                        <ArrowUpRight className="nav-dropdown-item-arrow h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/portal/partner"
              className="hidden lg:inline-flex nav-link text-sm"
            >
              Partner Console
            </Link>
            <Link to="/login" className="hidden md:inline-flex btn-ghost btn-premium-lift text-sm py-2 px-4">
              Sign In
            </Link>
            <div className="magnetic-wrap hidden md:inline-flex">
              <Link to="/contact" className="btn-primary btn-premium-lift magnetic-btn text-sm py-2 px-4 shadow-sm shadow-emerald-deep/20">
                Partner With Us
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="xl:hidden grid place-items-center h-9 w-9 rounded-full border border-line hover:border-emerald-deep hover:bg-stone transition-all duration-300"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Backdrop for dropdown */}
        {activeGroup && (
          <div
            className="nav-backdrop"
            onMouseEnter={handleGroupLeave}
            onClick={() => setActiveGroup(null)}
          />
        )}
      </header>

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu ${mobileOpen ? "mobile-menu--open" : ""}`} aria-hidden={!mobileOpen}>
        {/* Mobile header */}
        <div className="container-edge flex items-center justify-between h-16">
          <img src="/images/logo.png" alt="2+ Fortune Alliances" className="h-9 w-auto object-contain" />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="grid place-items-center h-9 w-9 rounded-full border border-line"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile nav items */}
        <div className="container-edge py-6 overflow-y-auto flex-1">
          <Link
            to="/"
            className="mobile-nav-item font-display text-2xl text-ink border-b border-line"
          >
            Home
          </Link>

          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="border-b border-line">
              <button
                className="mobile-nav-item w-full flex items-center justify-between font-display text-2xl text-ink"
                onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}
                aria-expanded={mobileGroup === group.label}
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${mobileGroup === group.label ? "rotate-180" : ""}`}
                />
              </button>

              {/* Accordion children */}
              <div className={`mobile-accordion ${mobileGroup === group.label ? "mobile-accordion--open" : ""}`}>
                <div className="pb-4 pl-4 flex flex-col gap-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="py-2.5 px-3 rounded-xl text-base text-muted-foreground hover:text-ink hover:bg-stone transition-all duration-200 flex items-center justify-between group"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Mobile CTA section */}
          <div className="pt-8 flex flex-col gap-3">
            <Link to="/portal/partner" className="btn-ghost text-center py-3">
              Partner Console
            </Link>
            <Link to="/login" className="btn-ghost text-center py-3">
              Sign In
            </Link>
            <Link to="/contact" className="btn-primary text-center py-3 flex items-center justify-center gap-2">
              Partner With Us <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Contact strip */}
          <div className="mt-10 pt-6 border-t border-line">
            <p className="eyebrow mb-3">Direct</p>
            <p className="text-sm text-muted-foreground">+91 9966 16 1616</p>
            <p className="text-sm text-muted-foreground">Hyderabad, Telangana</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(Math.min(100, pct));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-progress-bar" aria-hidden="true">
      <div className="scroll-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}
