import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * An {@link Input} with a reveal toggle, for forms built on react-hook-form.
 *
 * Forwards its ref and spreads every prop onto the underlying input, so it is a
 * drop-in for `<Input type="password" {...field} />` inside a FormControl.
 *
 * AuthField carries its own copy of this behaviour because those pages are
 * uncontrolled and read values through FormData; this one exists for the
 * controlled, schema-validated forms.
 */
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "type">
>(({ className, ...props }, ref) => {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type={revealed ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        // Kept out of the tab order: it sits between two fields, and stopping
        // there on the way through a form is an obstacle rather than a help.
        tabIndex={-1}
        aria-label={revealed ? "Hide password" : "Show password"}
        aria-pressed={revealed}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
