import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight, LayoutDashboard, Receipt, Truck, BadgePercent } from "lucide-react";

export const Route = createFileRoute("/portal/customer")({
  head: () => ({
    meta: [
      { title: "Customer Portal — 2+FAPL" },
      { name: "description", content: "Manage your orders, EMI schedule, deliveries and Gold EMI vault — all in one place." },
      { property: "og:title", content: "Customer Portal — 2+FAPL" },
      { property: "og:description", content: "Your orders, your EMIs, your vault — at a glance." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Customer Portal"
        title={<>Your orders. Your EMI. <em className="text-emerald-deep">Your vault.</em></>}
        lede="A single, calm interface to view every order, EMI schedule, delivery and Gold EMI valuation — wherever you are."
        meta={
          <div className="flex gap-3 flex-wrap">
            <Link to="/login" className="btn-primary">Sign in <ArrowUpRight className="h-4 w-4" /></Link>
            <Link to="/register/customer" className="btn-ghost">Create an account</Link>
          </div>
        }
      />
      <section className="container-edge section-y border-t border-line grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
        {[
          { Icon: LayoutDashboard, t: "Overview", d: "All your accounts and balances at a glance." },
          { Icon: Receipt, t: "EMI Schedule", d: "Upcoming installments, paid history, downloadable receipts." },
          { Icon: Truck, t: "Orders & Delivery", d: "Live order status across state warehouses and branches." },
          { Icon: BadgePercent, t: "Gold EMI Vault", d: "Valuation, custody, and basket reclaim ledger." },
        ].map((f, i) => (
          <div key={f.t} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="bg-paper p-10 min-h-[16rem]">
            <f.Icon className="h-6 w-6 text-emerald-deep mb-6" />
            <h3 className="font-display text-2xl mb-2">{f.t}</h3>
            <p className="text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
