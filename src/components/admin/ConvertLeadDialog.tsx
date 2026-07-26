import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertLead } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/types";
import type { AllianceType, ConvertLeadRequest, PartnerLead } from "@/lib/api/types";
import { useStates, useCities } from "@/hooks/use-location-data";

const ALLIANCE_TYPES: AllianceType[] = [
  "NBFC",
  "MFI",
  "COOPERATIVE",
  "BROKER",
  "CORPORATE",
  "OTHER",
];

const schema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(255),
  registrationNumber: z.string().trim().max(100).optional(),
  type: z.enum(["NBFC", "MFI", "COOPERATIVE", "BROKER", "CORPORATE", "OTHER"], {
    required_error: "Select a partner type",
  }),
  contactEmail: z
    .string()
    .trim()
    .max(255)
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  contactPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-() ]*$/, "Digits only")
    .max(15)
    .optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  pincode: z.string().trim().regex(/^\d*$/, "Digits only").max(10).optional(),
  commissionRate: z.string().optional(),
  contactPersonName: z.string().trim().min(1, "Contact person is required").max(255),
  loginEmail: z
    .string()
    .trim()
    .min(1, "Login email is required")
    .email("Enter a valid email")
    .max(255),
  loginMobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

type FormValues = z.infer<typeof schema>;

function blankToUndefined(v?: string) {
  const s = v?.trim();
  return s ? s : undefined;
}

export function ConvertLeadDialog({
  lead,
  open,
  onOpenChange,
  onConverted,
}: {
  lead: PartnerLead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConverted?: () => void;
}) {
  const [generalError, setGeneralError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: lead.companyName,
      registrationNumber: lead.gst ?? "",
      type: "NBFC",
      contactEmail: lead.email,
      contactPhone: lead.phone,
      address: "",
      city: lead.city ?? "",
      state: lead.state ?? "",
      pincode: "",
      commissionRate: "",
      contactPersonName: lead.contactPerson,
      loginEmail: lead.email,
      loginMobile: lead.phone,
    },
  });

  const stateValue = form.watch("state");
  const { data: states } = useStates();
  const { data: cities } = useCities(stateValue);

  async function onSubmit(values: FormValues) {
    setGeneralError(null);
    const req: ConvertLeadRequest = {
      name: values.name,
      registrationNumber: blankToUndefined(values.registrationNumber),
      type: values.type,
      contactEmail: blankToUndefined(values.contactEmail),
      contactPhone: blankToUndefined(values.contactPhone),
      address: blankToUndefined(values.address),
      city: blankToUndefined(values.city),
      state: blankToUndefined(values.state),
      pincode: blankToUndefined(values.pincode),
      commissionRate: values.commissionRate ? Number(values.commissionRate) : undefined,
      contactPersonName: values.contactPersonName,
      loginEmail: values.loginEmail,
      loginMobile: values.loginMobile,
    };

    try {
      await convertLead(lead.id, req);
      onOpenChange(false);
      onConverted?.();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          form.setError(field as keyof FormValues, { message });
        }
      } else {
        setGeneralError(
          err instanceof ApiError ? err.message : "Failed to convert lead. Please try again.",
        );
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert to Partner</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            {generalError && (
              <p className="text-sm text-destructive" role="alert">
                {generalError}
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration / GST no.</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALLIANCE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact phone</FormLabel>
                    <FormControl>
                      <Input inputMode="tel" maxLength={15} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("city", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states?.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!stateValue}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={stateValue ? "Select city" : "Select a state first"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities?.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" maxLength={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={100} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-2">
              <p className="text-sm font-medium text-ink mb-3">Login credentials</p>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="contactPersonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact person name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="loginEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loginMobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login mobile</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" maxLength={10} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Converting…" : "Convert to Partner"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
