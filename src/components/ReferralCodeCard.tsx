import { useState } from "react";
import { Copy, Check } from "lucide-react";

import { Panel } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";

/**
 * Shows a partner's or branch's own referral code and signup link, with a
 * one-click copy — the thing that was generated on creation but never
 * actually surfaced anywhere for a partner/branch to see or share.
 */
export function ReferralCodeCard({ code }: { code: string | null | undefined }) {
  const [copied, setCopied] = useState(false);

  if (!code) {
    return null;
  }

  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/register/customer?ref=${code}`;

  async function handleCopy() {
    try {
      // navigator.clipboard requires a secure context (HTTPS or localhost) —
      // the production site is served over plain HTTP, where it's undefined.
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = link;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied — nothing more we can do here
    }
  }

  return (
    <Panel title="Your referral code">
      <p className="text-sm text-muted-foreground mb-4">
        Share this code or link with walk-in customers so signups get attributed to you automatically.
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-display text-2xl tracking-wide bg-stone px-4 py-2 rounded-md">{code}</span>
        <Button type="button" variant="pillOutline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy signup link"}
        </Button>
      </div>
    </Panel>
  );
}
