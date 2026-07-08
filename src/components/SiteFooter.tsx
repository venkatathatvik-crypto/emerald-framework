import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper relative overflow-hidden">
      {/* Animated gold wave transition at the top of the footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-16 pointer-events-none select-none z-10" style={{ transform: "rotate(180deg)", marginTop: "-1px" }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,87.43,26.54,154.54,44.7,226.7,59.2,321.39,56.44Z"
            fill="var(--gold-soft)"
            opacity="0.1"
            className="gold-wave-flow"
            style={{ animationDelay: '0s', animationDuration: '14s' }}
          />
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C226.7,59.2,154.54,44.7,87.43,26.54,57.05,18.3,26.9,8.75,0,0V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="var(--gold)"
            opacity="0.15"
            className="gold-wave-flow"
            style={{ animationDelay: '-4s', animationDuration: '18s' }}
          />
          <path
            d="M0,0V120H1200V0C1132.19,23.09,1055.71,15.48,985.66,-3C906.67,-23.83,823.78,17.17,743.84,34c-82.26,17.34-168.06,16.33-250.45-.39-57.84-11.73-114-31.07-172-41.86C226.7,34.44,154.54,49,87.43,67.16,57.05,75.4,26.9,84.95,0,93.7V120H1200V0Z"
            fill="var(--emerald-soft)"
            opacity="0.1"
            className="gold-wave-flow"
            style={{ animationDelay: '-8s', animationDuration: '22s' }}
          />
        </svg>
      </div>

      {/* Floating particles inside footer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-particle-fast"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Background decorative glowing circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-deep/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      
      {/* Subtle network connection grid illustration */}
      <div className="absolute right-10 bottom-24 w-96 h-60 opacity-10 pointer-events-none z-0 select-none">
        <svg viewBox="0 0 400 250" fill="none" stroke="var(--gold-soft)" strokeWidth="0.75" className="w-full h-full">
          <circle cx="100" cy="50" r="4" fill="var(--gold-soft)" opacity="0.3" />
          <circle cx="250" cy="80" r="3" fill="var(--gold-soft)" opacity="0.3" />
          <circle cx="350" cy="40" r="4" fill="var(--gold-soft)" opacity="0.3" />
          <circle cx="180" cy="180" r="5" fill="var(--gold-soft)" opacity="0.3" />
          <circle cx="300" cy="200" r="3" fill="var(--gold-soft)" opacity="0.3" />
          <circle cx="80" cy="210" r="4" fill="var(--gold-soft)" opacity="0.3" />
          <path d="M100 50 L250 80 L350 40 M250 80 L180 180 L300 200 M100 50 L180 180 L80 210 M300 200 L350 40" strokeDasharray="3 3" opacity="0.3" />
        </svg>
      </div>

      <div className="container-edge pt-28 pb-10 relative z-10">
        <div className="divider-gold mb-16" />
        
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-12">
          <div data-reveal="fade">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="2+ Fortune Alliances Logo"
              className="h-16 w-auto object-contain rounded-lg border border-paper/10 bg-paper/5 mb-6 shadow-md"
            />
            <p className="eyebrow text-gold mb-6">Onwards & Upwards</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] max-w-md">
              From everyday essentials to timeless treasures.
            </h2>
            <div className="magnetic-wrap mt-10">
              <Link to="/contact" className="inline-flex items-center gap-3 group magnetic-btn">
                <span className="grid place-items-center h-12 w-12 rounded-full border border-paper/30 group-hover:bg-gold group-hover:text-ink group-hover:border-gold group-hover:scale-110 transition-all duration-500">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <span className="text-sm tracking-wide group-hover:text-gold transition-colors duration-300">Begin a conversation</span>
              </Link>
            </div>
          </div>
          <FooterCol
            title="Company"
            links={[
              ["About", "/about"],
              ["Business Model", "/business-model"],
              ["Leadership", "/leadership"],
              ["Careers", "/careers"],
              ["Contact", "/contact"],
            ]}
          />
          <FooterCol
            title="Offerings"
            links={[
              ["Products", "/products"],
              ["Gold EMI", "/gold-emi"],
              ["Brands & Partners", "/brands"],
            ]}
          />
          <div>
            <p className="eyebrow text-gold mb-5">Gold EMI Partner</p>
            <img 
              src={`${import.meta.env.BASE_URL}images/augmont_logo.png`} 
              alt="Augmont Gold For All" 
              className="h-10 object-contain bg-white rounded-lg p-1.5 border border-paper/20 mb-4"
            />
            <p className="text-xs text-paper/60 leading-relaxed">
              Gold EMI services powered by Augmont Gold For All — India's leading digital gold platform.
            </p>
          </div>
          <FooterCol
            title="Portals"
            links={[
              ["Customer Portal", "/portal/customer"],
              ["Partner Portal", "/portal/partner"],
              ["Sign in", "/login"],
              ["Register as Customer", "/register/customer"],
              ["Register as Partner", "/register/partner"],
            ]}
          />
        </div>

        <div className="hairline bg-paper/15 mt-20" />

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-paper/60">
          <p>
            © {new Date().getFullYear()} 2 Plus Fortune Alliances Pvt. Ltd. — CIN withheld. Hyderabad, India.
          </p>
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="2+ Fortune Alliances Logo"
            className="h-8 w-auto object-contain opacity-70"
          />
        </div>

        <div className="mt-12 select-none" aria-hidden>
          <p className="font-display text-paper/[0.04] text-[18vw] leading-[0.85] tracking-tight whitespace-nowrap overflow-hidden">
            2+ Fortune Alliances
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="eyebrow text-gold mb-5">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-sm text-paper/75 hover:text-paper hover:text-gold transition-colors duration-300 inline-flex items-center gap-2 group">
              {label}
              <span className="w-0 h-0.5 bg-gold group-hover:w-4 transition-all duration-300" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
