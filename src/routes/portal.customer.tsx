import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArrowUpRight, LayoutDashboard, Receipt, Truck, HeartHandshake, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/portal/customer")({
  head: () => ({
    meta: [
      { title: "Customer Portal — 2+ Fortune Alliances & Augmont Gold" },
      { name: "description", content: "Access your 2+ Fortune Alliances account, powered in tie-up with Augmont Gold For All. Check your EMI schedule, deliveries, and gold vault." },
      { property: "og:title", content: "Customer Portal — 2+ Fortune Alliances & Augmont" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      {/* Premium Emerald Green Partner Banner (No dark black) */}
      <section className="bg-emerald-deep text-paper relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-deep via-emerald-soft/40 to-gold/20 pointer-events-none" />
        <div className="container-edge pt-28 pb-24 md:py-36 relative z-10">
          <div className="max-w-4xl">
            <span className="eyebrow text-gold mb-6 block">Joint Initiative</span>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10">
              <div className="flex items-center gap-4 bg-paper/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-paper/10">
                <span className="font-display text-xl font-bold">2+ Fortune Alliances</span>
                <HeartHandshake className="h-6 w-6 text-gold animate-pulse" />
                <img 
                  src="/images/augmont_logo.png" 
                  alt="Augmont Gold For All" 
                  className="h-10 object-contain bg-white rounded-lg p-1.5" 
                />
              </div>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl leading-[1.0] mb-8">
              Customer Portal <br />
              <em className="text-gold font-serif">Augmont Gold partnership</em>
            </h1>
            
            <p className="text-lg md:text-xl text-paper/85 max-w-2xl leading-relaxed mb-12">
              A seamless, secure portal to monitor your orders, manage your EMI schedules, and view your fully secured gold vault in real-time.
            </p>
            
            <div className="flex gap-4 flex-wrap">
              <Link to="/login" className="btn-gold shadow-lg shadow-gold/25">
                Sign in to Portal <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/register/customer" className="px-6 py-3 rounded-xl border border-paper/20 hover:bg-paper/10 transition-colors text-sm font-medium">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Features Details */}
      <section className="container-edge section-y">
        <p className="eyebrow mb-6 text-emerald-deep">What it includes</p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-16 max-w-2xl">
          Calm control over your <em className="text-emerald-deep">financial goals.</em>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {[
            { Icon: LayoutDashboard, t: "Single Dashboard", d: "View all active product allocations and core summary at a glance." },
            { Icon: Receipt, t: "Installments Schedule", d: "Upcoming EMI tracks, paid invoices, and fully transparent receipts." },
            { Icon: Truck, t: "Order Logistics", d: "Real-time dispatch tracking from state warehousing nodes directly to your branch." },
            { Icon: ShieldCheck, t: "Augmont Gold Vault", d: "Fully insured custody, gold LTV values, and vault ledger status." },
          ].map((f, i) => (
            <div key={f.t} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="bg-paper p-10 min-h-[16rem] hover:shadow-xl transition-shadow duration-300">
              <f.Icon className="h-8 w-8 text-emerald-deep mb-6" />
              <h3 className="font-display text-2xl mb-2 text-ink">{f.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
