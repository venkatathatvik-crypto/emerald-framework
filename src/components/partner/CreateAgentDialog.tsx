import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createAgent } from "@/lib/api/partner";
import { ApiError } from "@/lib/api/types";
import type { Agent, AgentCreateRequest } from "@/lib/api/types";

const schema = z.object({
  name: z.string().trim().min(1, "Agent name is required").max(255),
  loginEmail: z.string().trim().min(1, "Login email is required").email("Enter a valid email").max(255),
  loginMobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT_VALUES: FormValues = { name: "", loginEmail: "", loginMobile: "" };

export function CreateAgentDialog({
  branchId, open, onOpenChange, onCreated,
}: {
  branchId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (agent: Agent) => void;
}) {
  const [generalError, setGeneralError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  async function onSubmit(values: FormValues) {
    setGeneralError(null);
    const req: AgentCreateRequest = {
      name: values.name,
      loginEmail: values.loginEmail,
      loginMobile: values.loginMobile,
    };

    try {
      const agent = await createAgent(branchId, req);
      form.reset(DEFAULT_VALUES);
      onOpenChange(false);
      onCreated?.(agent);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          form.setError(field as keyof FormValues, { message });
        }
      } else {
        setGeneralError(err instanceof ApiError ? err.message : "Failed to create agent. Please try again.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Agent</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            {generalError && (
              <p className="text-sm text-destructive" role="alert">{generalError}</p>
            )}

            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Agent name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="loginEmail" render={({ field }) => (
              <FormItem>
                <FormLabel>Login email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="loginMobile" render={({ field }) => (
              <FormItem>
                <FormLabel>Login mobile</FormLabel>
                <FormControl><Input inputMode="numeric" maxLength={10} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="submit" variant="pill" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding…" : "Add Agent"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
