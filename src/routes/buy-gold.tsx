import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ArrowUpRight, ShieldCheck, TrendingUp, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/buy-gold")({
  head: () => ({
    meta: [
      { title: "Buy Digital Gold — 2+ Fortune Alliances & Augmont" },
      { name: "description", content: "Buy 24K digital gold starting from ₹1. Secure, insured, and redeemable anytime. Powered by Augmont Gold For All." },
      { property: "og:title", content: "Buy Digital Gold — 2+ Fortune Alliances & Augmont" },
      { property: "og:description", content: "Start your gold investment journey with as little as ₹1. Fully insured and secure." },
    ],
  }),
  component: Page,
});

const GOLD_PLANS = [
  { name: "Starter", min: 1, max: 5000, popular: false, bonus: "0%" },
  { name: "Regular", min: 5001, max: 25000, popular: true, bonus: "0.5%" },
  { name: "Premium", min: 25001, max: 100000, popular: false, bonus: "1%" },
  { name: "Elite", min: 100001, max: null, popular: false, bonus: "1.5%" },
];

const LIVE_RATES = [
  { metal: "Gold 24K", rate: "₹7,245/g", change: "+0.45%", trend: "up" },
  { metal: "Gold 22K", rate: "₹6,645/g", change: "+0.42%", trend: "up" },
  { metal: "Silver", rate: "₹92.50/g", change: "+0.18%", trend: "up" },
];

const FEATURES = [
  { icon: ShieldCheck, title: "100% Insured", desc: "Your gold is fully insured against theft and loss." },
  { icon: TrendingUp, title: "Live Market Rates", desc: "Real-time gold prices with transparent pricing." },
  { icon: Clock, title: "Instant Liquidity", desc: "Sell your gold instantly at current market rates." },
  { icon: CheckCircle2, title: "999.9 Purity", desc: "Only 24K pure gold with BIS hallmarked certification." },
];

function Page() {
  const [amount, setAmount] = useState(10000);
  const [selectedPlan, setSelectedPlan] = useState("Regular");
  const [step, setStep] = useState(1);

  const grams = (amount / 7245).toFixed(4);
  const plan = GOLD_PLANS.find(p => p.name === selectedPlan);

  return (
    <PageShell>
      {/* Hero with Augmont branding */}
      <section className="bg-gradient-to-b from-gold-soft/30 via-paper to-paper">
        <div className="container-edge pt-24 md:pt-36 pb-16 md:pb-24">
          <div className="flex items-center gap-4 mb-8" data-reveal="rise-soft">
            <img 
              src={`${import.meta.env.BASE_URL}images/augmont_logo.png`} 
              alt="Augmont Gold For All" 
              className="h-12 object-contain bg-white rounded-lg p-2 border border-gold/30 shadow-lg" 
            />
            <div>
              <p className="text-sm font-medium text-gold">Powered by</p>
              <p className="font-display text-xl text-ink">Augmont Gold For All</p>
            </div>
          </div>
          
          <h1 data-reveal="rise" className="font-display text-5xl md:text-7xl leading-[0.95] mb-6">
            Buy Digital Gold. <br />
            <em className="text-gold">Start with ₹1.</em>
          </h1>
          
          <p data-reveal="rise-soft" className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
            Invest in 24K pure digital gold with complete security and transparency. 
            Your gold is stored in secure vaults and is 100% insured.
          </p>

          {/* Live rates ticker */}
          <div className="flex flex-wrap gap-4 mb-8" data-reveal="rise-soft">
            {LIVE_RATES.map((rate) => (
              <div key={rate.metal} className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gold/20 shadow-sm">
                <span className="text-sm font-medium text-ink">{rate.metal}</span>
                <span className="font-display text-lg text-gold">{rate.rate}</span>
                <span className="text-xs text-emerald-deep font-medium">{rate.change}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap" data-reveal="rise-soft">
            <Link to="#calculator" className="btn-gold shadow-lg shadow-gold/25">
              Start Investing <Sparkles className="h-4 w-4" />
            </Link>
            <Link to="/gold-emi" className="btn-ghost">
              Learn about Gold EMI
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-edge section-y border-t border-line">
        <p className="eyebrow mb-6 text-gold" data-reveal="rise-soft">Why Digital Gold?</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={feature.title} data-reveal="rise" style={{ animationDelay: `${i * 80}ms` }} className="p-6 rounded-2xl border border-line bg-stone/30 hover:border-gold/50 transition-colors">
              <feature.icon className="h-8 w-8 text-gold mb-4" />
              <h3 className="font-display text-xl mb-2 text-ink">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Calculator */}
      <section id="calculator" className="bg-ink text-paper">
        <div className="container-edge section-y">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow text-gold mb-6" data-reveal="rise-soft">Gold Calculator</p>
              <h2 data-reveal="rise" className="font-display text-4xl md:text-5xl leading-[1.0] mb-8">
                Calculate your <em className="text-gold">gold investment.</em>
              </h2>
              
              <div className="space-y-6" data-reveal="rise-soft">
                <div>
                  <label className="text-sm text-paper/70 mb-3 block">Investment Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-paper/10 border border-paper/20 text-paper text-lg font-display focus:outline-none focus:border-gold transition-colors"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="text-sm text-paper/70 mb-3 block">Select Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    {GOLD_PLANS.map((plan) => (
                      <button
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan.name)}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedPlan === plan.name
                            ? "bg-gold text-ink border-gold"
                            : "bg-paper/5 border-paper/20 text-paper/70 hover:border-paper/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-display text-lg">{plan.name}</span>
                          {plan.popular && <span className="text-xs px-2 py-0.5 bg-ink text-gold rounded-full">Popular</span>}
                        </div>
                        <p className="text-xs opacity-80">
                          {plan.min === 1 ? "₹1+" : `₹${plan.min.toLocaleString()}+`}
                          {plan.max && ` - ₹${plan.max.toLocaleString()}`}
                        </p>
                        {plan.bonus !== "0%" && (
                          <p className="text-xs mt-1 font-medium">+{plan.bonus} bonus</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gold/20 to-gold/5 rounded-3xl p-8 border border-gold/30" data-reveal="rise">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={`${import.meta.env.BASE_URL}images/augmont_logo.png`} 
                  alt="Augmont Gold For All" 
                  className="h-10 object-contain bg-white rounded-lg p-1.5 border border-gold/20" 
                />
                <span className="text-sm text-paper/70">Augmont Secure Vault</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-paper/10">
                  <span className="text-paper/70">Investment Amount</span>
                  <span className="font-display text-2xl">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-paper/10">
                  <span className="text-paper/70">Gold Rate (24K)</span>
                  <span className="font-display text-xl">₹7,245/g</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-paper/10">
                  <span className="text-paper/70">Gold You'll Get</span>
                  <span className="font-display text-3xl text-gold">{grams}g</span>
                </div>
                {plan && plan.bonus !== "0%" && (
                  <div className="flex justify-between items-center py-3 border-b border-paper/10">
                    <span className="text-paper/70">Bonus Gold</span>
                    <span className="font-display text-xl text-emerald-400">+{plan.bonus}</span>
                  </div>
                )}
              </div>

              <button className="btn-gold w-full justify-center text-lg shadow-lg shadow-gold/25">
                Buy Now <ArrowUpRight className="h-5 w-5" />
              </button>

              <p className="text-center text-xs text-paper/50 mt-4">
                By proceeding, you agree to Augmont's terms and conditions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-edge section-y">
        <p className="eyebrow mb-6" data-reveal="rise-soft">How it works</p>
        <h2 data-reveal="rise" className="font-display text-5xl md:text-6xl max-w-3xl leading-[1.02] mb-16">
          Simple steps to <em className="text-emerald-deep">own gold.</em>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Sign Up", desc: "Create your account in 2 minutes with KYC verification." },
            { step: "02", title: "Add Funds", desc: "Transfer funds via UPI, bank transfer, or cards." },
            { step: "03", title: "Buy Gold", desc: "Purchase gold at live rates starting from just ₹1." },
          ].map((item, i) => (
            <div key={item.step} data-reveal="rise" style={{ animationDelay: `${i * 100}ms` }} className="relative">
              <span className="font-display text-6xl text-gold/20 absolute -top-4 -left-2">{item.step}</span>
              <div className="relative z-10 pt-8">
                <h3 className="font-display text-2xl mb-3 text-ink">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold-soft/30 border-t border-line">
        <div className="container-edge section-y text-center">
          <div className="flex justify-center mb-8">
            <img 
              src={`${import.meta.env.BASE_URL}images/augmont_logo.png`} 
              alt="Augmont Gold For All" 
              className="h-16 object-contain bg-white rounded-xl p-3 border border-gold/30 shadow-lg" 
            />
          </div>
          <h2 data-reveal="rise" className="font-display text-4xl md:text-5xl mb-6">
            Start your gold journey <em className="text-gold">today.</em>
          </h2>
          <p data-reveal="rise-soft" className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Join thousands of Indians who trust Augmont for their digital gold investments. 
            Secure, transparent, and accessible.
          </p>
          <div className="flex gap-4 justify-center flex-wrap" data-reveal="rise-soft">
            <Link to="/register/customer" className="btn-gold shadow-lg shadow-gold/25">
              Create Free Account <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-ghost">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
