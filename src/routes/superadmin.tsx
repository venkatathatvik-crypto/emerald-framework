import { createFileRoute } from "@tanstack/react-router";
import { AuthShell, AuthField } from "@/components/AuthShell";
import { listAdmins, createAdmin, type AdminUser } from "@/lib/api/superadmin";
import { ApiError } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/superadmin")({
  head: () => ({ meta: [{ title: "Superadmin — 2+FAPL" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

/**
 * Hidden page for creating admin accounts. Reachable only by direct URL — it is
 * deliberately absent from every navigation menu and from the sitemap.
 *
 * Nothing seeds an admin any more, so this is the only way to create the first
 * one. It authenticates with HTTP Basic against credentials held server-side in
 * configuration, because on a fresh database there is no admin to sign in as.
 *
 * The credentials live in component state for the lifetime of the tab and are
 * never written to localStorage or a cookie: closing the tab revokes access, and
 * nothing is left behind on a shared machine.
 */
function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const u = String(form.get("username") ?? "").trim();
    const p = String(form.get("password") ?? "");

    setBusy(true);
    try {
      // Listing doubles as the credential check — a 401 here means bad details.
      setAdmins(await listAdmins(u, p));
      setUsername(u);
      setPassword(p);
      setAuthed(true);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Invalid superadmin credentials."
          : err instanceof Error
            ? err.message
            : "Could not sign in.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setCreated(null);

    // Held in a local: React nulls out currentTarget once the handler yields,
    // so reaching for it after the await throws.
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const email = String(form.get("email") ?? "").trim();
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();

    setBusy(true);
    try {
      await createAdmin(username, password, { email, firstName, lastName });
      setCreated(email);
      formEl.reset();
      setAdmins(await listAdmins(username, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the admin.");
    } finally {
      setBusy(false);
    }
  }

  if (!authed) {
    return (
      <AuthShell eyebrow="Restricted" title="Superadmin" subtitle="Sign in to manage admin accounts.">
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <AuthField label="Username" name="username" required />
          <AuthField label="Password" name="password" type="password" required />
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full h-12" disabled={busy}>
            {busy && <Spinner size={16} className="mr-2" label="" />}
            {busy ? "Checking…" : "Continue"}
          </Button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Restricted"
      title="Admin accounts"
      subtitle="New admins receive an email invite to set their own password."
    >
      <form onSubmit={handleCreate} className="space-y-4" noValidate>
        <AuthField label="Email" name="email" type="email" required placeholder="name@example.com" />
        <div className="grid sm:grid-cols-2 gap-4">
          <AuthField label="First name" name="firstName" required />
          <AuthField label="Last name" name="lastName" required />
        </div>

        {created && (
          <div
            className="flex items-start gap-2.5 rounded-lg border border-success/30 bg-success/10 px-3 py-2.5"
            aria-live="polite"
          >
            <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
            <p className="text-xs text-ink">
              Admin created. A set-password invite has been sent to <strong>{created}</strong>. The
              account cannot sign in until that link is used.
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-12" disabled={busy}>
          {busy && <Spinner size={16} className="mr-2" label="" />}
          {busy ? "Creating…" : "Create admin & send invite"}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-line">
        <p className="eyebrow mb-3">Existing admins ({admins.length})</p>
        {admins.length === 0 ? (
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <p>
              No admin accounts exist. Nobody can sign in to the admin panel until one is created
              here.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {admins.map((a) => (
              <li key={a.id} className="flex items-center gap-2 text-xs">
                <span className="font-medium text-ink">
                  {a.firstName} {a.lastName}
                </span>
                <span className="text-muted-foreground">{a.email}</span>
                <span className="ml-auto flex items-center gap-2">
                  {!a.emailVerified && (
                    <span className="text-[10px] text-amber-700">invite pending</span>
                  )}
                  {!a.active && <span className="text-[10px] text-destructive">deactivated</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthShell>
  );
}
