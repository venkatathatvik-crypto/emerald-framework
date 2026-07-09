import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { submitPartnerLead } from "@/lib/api/public";
import { ApiError } from "@/lib/api/types";
import { useStates, useCities } from "@/hooks/use-location-data";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/register/partner")({
  head: () => ({ meta: [{ title: "Partner Registration — 2+FAPL" }, { name: "description", content: "Apply to join the 2+FAPL partner network." }] }),
  component: Page,
});

interface PartnerLeadFormValues {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gst: string;
  city: string;
  state: string;
}

type FieldErrors = Partial<Record<keyof PartnerLeadFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

/** Mirrors PartnerLeadRequest's validation exactly — runs before the API call. */
function validate(values: PartnerLeadFormValues): FieldErrors {
  const errors: FieldErrors = {};

  const companyName = values.companyName.trim();
  if (!companyName) errors.companyName = "Company name is required";
  else if (companyName.length < 2 || companyName.length > 255) {
    errors.companyName = "Company name must be 2–255 characters";
  }

  const contactPerson = values.contactPerson.trim();
  if (!contactPerson) errors.contactPerson = "Contact person is required";
  else if (contactPerson.length > 255) errors.contactPerson = "Contact person must be at most 255 characters";

  const email = values.email.trim();
  if (!email) errors.email = "Email is required";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  else if (email.length > 255) errors.email = "Email must be at most 255 characters";

  const phone = values.phone.trim();
  if (!phone) errors.phone = "Mobile number is required";
  else if (!MOBILE_RE.test(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number";

  const gst = values.gst.trim();
  if (gst.length > 15) errors.gst = "GST must be at most 15 characters";
  else if (gst && !/^[0-9A-Za-z]*$/.test(gst)) errors.gst = "GST must be alphanumeric";

  return errors;
}

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const { data: states } = useStates();
  const { data: cities } = useCities(state);

  function handleStateChange(v: string) {
    setState(v);
    setCity("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const values: PartnerLeadFormValues = {
      companyName: String(formData.get("companyName") ?? ""),
      contactPerson: String(formData.get("contactPerson") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      gst: String(formData.get("gst") ?? ""),
      city,
      state,
    };

    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPartnerLead({
        companyName: values.companyName.trim(),
        contactPerson: values.contactPerson.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        gst: values.gst.trim() || undefined,
        city: values.city.trim() || undefined,
        state: values.state.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFieldErrors(err.fieldErrors as FieldErrors);
      } else {
        setGeneralError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Partner Registration"
      title={<>Join the <em className="text-emerald-deep">distribution fabric.</em></>}
      subtitle="Tell us about your institution. A relationship manager will be in touch within one business day."
      side={
        <>
          <p className="eyebrow text-gold mb-6">For institutions</p>
          <p className="font-display text-3xl md:text-4xl leading-[1.1]">
            MFIs, NBFCs, cooperatives, Sec. 8 companies, and trusts — <em className="text-gold">welcome.</em>
          </p>
        </>
      }
    >
      {submitted ? (
        <div className="text-center py-10">
          <CheckCircle2 className="h-12 w-12 text-emerald-deep mx-auto mb-4" />
          <h2 className="font-display text-2xl text-ink mb-2">Request received.</h2>
          <p className="text-muted-foreground">
            Thank you for your interest. Our partnerships team will review your details and reach out shortly.
          </p>
          <Link to="/" className="link-underline text-sm mt-8 inline-block">Back to home</Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <AuthField label="Institution name" name="companyName" required error={fieldErrors.companyName} />
            <AuthField label="Authorised contact name" name="contactPerson" required error={fieldErrors.contactPerson} />
            <div className="grid sm:grid-cols-2 gap-4">
              <AuthField label="Email" type="email" name="email" required error={fieldErrors.email} />
              <AuthField label="Mobile" name="phone" placeholder="10-digit mobile number" required error={fieldErrors.phone} inputMode="numeric" maxLength={10} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-2 text-[0.65rem]">State</label>
                <Select value={state} onValueChange={handleStateChange}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {states?.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {fieldErrors.state && <p className="mt-1.5 text-xs text-destructive" role="alert">{fieldErrors.state}</p>}
              </div>
              <div>
                <label className="eyebrow block mb-2 text-[0.65rem]">City</label>
                <Select value={city} onValueChange={setCity} disabled={!state}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={state ? "Select city" : "Select a state first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities?.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {fieldErrors.city && <p className="mt-1.5 text-xs text-destructive" role="alert">{fieldErrors.city}</p>}
              </div>
            </div>
            <AuthField label="GST number (optional)" name="gst" error={fieldErrors.gst} />
            {generalError && (
              <p className="text-sm text-destructive" role="alert">{generalError}</p>
            )}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
              {isSubmitting ? "Submitting…" : <>Submit application <ArrowUpRight className="h-4 w-4" /></>}
            </button>
          </form>
          <p className="mt-8 text-sm text-muted-foreground">
            Already registered? <Link to="/login" className="link-underline">Sign in</Link>.
          </p>
        </>
      )}
    </AuthShell>
  );
}
