import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact 2+FAPL" },
      { name: "description", content: "Reach 2 Plus Fortune Alliances Pvt Ltd — Hyderabad headquarters, partnership and customer enquiries." },
      { property: "og:title", content: "Contact 2+FAPL" },
      { property: "og:description", content: "We look forward to working with you." },
    ],
  }),
  component: Page,
});

function Page() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title={<>We look forward to <em className="text-emerald-deep">working with you.</em></>}
        lede="Whether you're a brand looking for rural reach, a financial institution looking for product depth, or a customer with a question — we'd love to hear from you."
      />

      <section className="container-edge section-y border-t border-line grid lg:grid-cols-[1fr_1.5fr] gap-16">
        {/* Direct */}
        <div className="space-y-10">
          <div data-reveal="rise-soft">
            <p className="eyebrow mb-4">Headquarters</p>
            <div className="flex gap-3 items-start text-base">
              <MapPin className="h-5 w-5 text-emerald-deep shrink-0 mt-1" />
              <p>504, 5th Floor, Nami Shree Infratech,<br />T19 Towers, MG Road, Rani Ganj,<br />Hyderabad — 500003</p>
            </div>
          </div>
          <div data-reveal="rise-soft" style={{ animationDelay: "80ms" }}>
            <p className="eyebrow mb-4">Direct</p>
            <div className="space-y-2">
              <a href="tel:+919966161616" className="flex gap-3 items-center hover:text-emerald-deep transition-colors">
                <Phone className="h-4 w-4" /> +91 9966 16 1616
              </a>
              <a href="tel:+917306969696" className="flex gap-3 items-center hover:text-emerald-deep transition-colors">
                <Phone className="h-4 w-4" /> +91 7306 96 9696
              </a>
              <a href="mailto:srikanth.pagolu@2plusfortunealliances.com" className="flex gap-3 items-center hover:text-emerald-deep transition-colors text-sm">
                <Mail className="h-4 w-4" /> srikanth.pagolu@2plusfortunealliances.com
              </a>
            </div>
          </div>
          <div data-reveal="rise-soft" style={{ animationDelay: "160ms" }}>
            <p className="eyebrow mb-4">On the web</p>
            <a href="https://www.2plusfortunealliances.com" className="link-underline text-sm">
              www.2plusfortunealliances.com <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {/* Support Team Portrait Card */}
          <div 
            data-reveal="rise" 
            style={{ animationDelay: "240ms" }}
            className="relative rounded-2xl overflow-hidden shadow-xl border border-line aspect-[4/3] group bg-stone mt-8"
          >
            <img 
              src="/images/support_team.png" 
              alt="2+FAPL Premium Customer Support Team collaborating" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="bg-stone p-8 md:p-12"
          data-reveal="rise"
        >
          {submitted ? (
            <div className="text-center py-16">
              <p className="eyebrow mb-6 text-emerald-deep">Message received</p>
              <h3 className="font-display text-4xl mb-4">Thank you.</h3>
              <p className="text-muted-foreground">We'll be in touch within one business day.</p>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-6">Write to us</p>
              <h3 className="font-display text-3xl mb-8">Tell us a little about you.</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Full name" name="name" required />
                <Field label="Organisation" name="org" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Email" type="email" name="email" required />
                <Field label="Phone" name="phone" />
              </div>
              <div className="mb-4">
                <label className="eyebrow block mb-2 text-xs">Interest</label>
                <select className="w-full bg-paper border border-line px-4 py-3 rounded-sm focus:outline-none focus:border-emerald-deep transition-colors">
                  <option>Partnership (Brand / OEM)</option>
                  <option>Partnership (MFI / NBFC / Co-op)</option>
                  <option>Customer enquiry</option>
                  <option>Careers</option>
                  <option>Media / Press</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="eyebrow block mb-2 text-xs">Message</label>
                <textarea rows={5} required className="w-full bg-paper border border-line px-4 py-3 rounded-sm focus:outline-none focus:border-emerald-deep transition-colors" />
              </div>
              <button type="submit" className="btn-primary">
                Send message <ArrowUpRight className="h-4 w-4" />
              </button>
            </>
          )}
        </form>
      </section>
    </PageShell>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow block mb-2 text-xs" htmlFor={name}>{label}{required && " *"}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full bg-paper border border-line px-4 py-3 rounded-sm focus:outline-none focus:border-emerald-deep transition-colors"
      />
    </div>
  );
}
