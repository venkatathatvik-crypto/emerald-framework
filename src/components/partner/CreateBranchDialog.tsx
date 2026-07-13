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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createBranch, updateBranch } from "@/lib/api/partner";
import { ApiError } from "@/lib/api/types";
import type { Branch, BranchCreateRequest, BranchUpdateRequest } from "@/lib/api/types";
import { useStates, useCities } from "@/hooks/use-location-data";

/**
 * Manager-login fields are only required when creating — editing an existing
 * branch never touches its manager's login, so those fields aren't even
 * rendered in edit mode. They stay plain (non-optional) `z.string()` in both
 * branches of the ternary so FormValues has one stable shape either way.
 */
function buildSchema(isEdit: boolean) {
  return z.object({
    name: z.string().trim().min(1, "Branch name is required").max(255),
    code: z.string().trim().max(50).optional(),
    contactEmail: z.string().trim().max(255).email("Enter a valid email").optional().or(z.literal("")),
    contactPhone: z.string().trim().regex(/^[0-9+\-() ]*$/, "Digits only").max(15).optional(),
    address: z.string().trim().optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    pincode: z.string().trim().regex(/^\d*$/, "Digits only").max(10).optional(),
    commissionRate: z.string().optional(),
    managerName: isEdit ? z.string() : z.string().trim().min(1, "Manager name is required").max(255),
    managerLoginEmail: isEdit
      ? z.string()
      : z.string().trim().min(1, "Manager login email is required").email("Enter a valid email").max(255),
    managerLoginMobile: isEdit
      ? z.string()
      : z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

function blankToUndefined(v?: string) {
  const s = v?.trim();
  return s ? s : undefined;
}

const DEFAULT_VALUES: FormValues = {
  name: "",
  code: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  commissionRate: "",
  managerName: "",
  managerLoginEmail: "",
  managerLoginMobile: "",
};

export function CreateBranchDialog({
  branch, open, onOpenChange, onSaved,
}: {
  /** Present = edit an existing branch. Absent = create a new one. */
  branch?: Branch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (branch: Branch) => void;
}) {
  const isEdit = !!branch;
  const [generalError, setGeneralError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(isEdit)),
    defaultValues: DEFAULT_VALUES,
    values: branch ? {
      name: branch.name,
      code: branch.code ?? "",
      contactEmail: branch.contactEmail ?? "",
      contactPhone: branch.contactPhone ?? "",
      address: branch.address ?? "",
      city: branch.city ?? "",
      state: branch.state ?? "",
      pincode: branch.pincode ?? "",
      commissionRate: branch.commissionRate != null ? String(branch.commissionRate) : "",
      managerName: "",
      managerLoginEmail: "",
      managerLoginMobile: "",
    } : undefined,
  });

  const stateValue = form.watch("state");
  const { data: states } = useStates();
  const { data: cities } = useCities(stateValue);

  async function onSubmit(values: FormValues) {
    setGeneralError(null);

    try {
      if (isEdit && branch) {
        const req: BranchUpdateRequest = {
          name: values.name,
          code: blankToUndefined(values.code),
          contactEmail: blankToUndefined(values.contactEmail),
          contactPhone: blankToUndefined(values.contactPhone),
          address: blankToUndefined(values.address),
          city: blankToUndefined(values.city),
          state: blankToUndefined(values.state),
          pincode: blankToUndefined(values.pincode),
          commissionRate: values.commissionRate ? Number(values.commissionRate) : undefined,
        };
        const updated = await updateBranch(branch.id, req);
        onOpenChange(false);
        onSaved?.(updated);
      } else {
        const req: BranchCreateRequest = {
          name: values.name,
          code: blankToUndefined(values.code),
          contactEmail: blankToUndefined(values.contactEmail),
          contactPhone: blankToUndefined(values.contactPhone),
          address: blankToUndefined(values.address),
          city: blankToUndefined(values.city),
          state: blankToUndefined(values.state),
          pincode: blankToUndefined(values.pincode),
          commissionRate: values.commissionRate ? Number(values.commissionRate) : undefined,
          managerName: values.managerName,
          managerLoginEmail: values.managerLoginEmail,
          managerLoginMobile: values.managerLoginMobile,
        };
        const created = await createBranch(req);
        form.reset(DEFAULT_VALUES);
        onOpenChange(false);
        onSaved?.(created);
      }
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          form.setError(field as keyof FormValues, { message });
        }
      } else {
        setGeneralError(err instanceof ApiError ? err.message : "Failed to save branch. Please try again.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Branch" : "Create Branch"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            {generalError && (
              <p className="text-sm text-destructive" role="alert">{generalError}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch code</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="contactEmail" render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact email</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="contactPhone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact phone</FormLabel>
                  <FormControl><Input inputMode="tel" maxLength={15} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid sm:grid-cols-3 gap-4">
              <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => { field.onChange(v); form.setValue("city", ""); }}
                  >
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states?.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={!stateValue}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={stateValue ? "Select city" : "Select a state first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities?.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="pincode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl><Input inputMode="numeric" maxLength={10} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="commissionRate" render={({ field }) => (
              <FormItem>
                <FormLabel>Commission rate (%)</FormLabel>
                <FormControl><Input type="number" min={0} max={100} step="0.01" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {!isEdit && (
              <div className="pt-2 border-t border-line">
                <p className="text-sm font-medium text-ink mt-4 mb-1">Branch manager login</p>
                <p className="text-xs text-muted-foreground mb-4">
                  We'll email this person a link to set their password and sign in as this branch.
                </p>
                <div className="space-y-4">
                  <FormField control={form.control} name="managerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="managerLoginEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="managerLoginMobile" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login mobile</FormLabel>
                        <FormControl><Input inputMode="tel" maxLength={10} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="submit" variant="pill" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? (isEdit ? "Saving…" : "Creating…")
                  : (isEdit ? "Save changes" : "Create Branch")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
