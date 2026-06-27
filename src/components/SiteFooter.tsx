import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-edge pt-24 pb-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
          <div>
            <p className="eyebrow text-gold mb-6">Onwards & Upwards</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] max-w-md">
              From everyday essentials to timeless treasures.
            </h2>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-3 group">
              <span className="grid place-items-center h-12 w-12 rounded-full border border-paper/30 group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all duration-500">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <span className="text-sm tracking-wide">Begin a conversation</span>
            </Link>
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
              ["Hassle-Free EMI", "/hassle-free-emi"],
              ["Gold EMI", "/gold-emi"],
              ["Brands & Partners", "/brands"],
            ]}
          />
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
          <p className="font-display text-paper/80 text-base">
            <span className="text-gold">+</span>FAPL
          </p>
        </div>

        <div className="mt-12 select-none" aria-hidden>
          <p className="font-display text-paper/[0.06] text-[18vw] leading-[0.85] tracking-tight whitespace-nowrap overflow-hidden">
            2+FAPL
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
            <Link to={to} className="text-sm text-paper/75 hover:text-paper transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
