import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { DashboardShell, Panel, type Role } from "@/components/DashboardShell";
import { useRequireAuth } from "@/hooks/use-require-role";
import { useAuth } from "@/lib/auth-context";
import { updateProfile, changePassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile" }] }),
  component: Page,
});

const DASHBOARD_ROLE_BY_BACKEND_ROLE: Record<string, Role> = {
  ROLE_CUSTOMER: "customer",
  ROLE_ALLIANCE: "partner",
  ROLE_BRANCH: "branch",
  ROLE_AGENT: "branch",
  ROLE_ADMIN: "admin",
};

const ROLE_LABEL: Record<string, string> = {
  ROLE_CUSTOMER: "Customer",
  ROLE_ALLIANCE: "Partner",
  ROLE_BRANCH: "Branch Manager",
  ROLE_AGENT: "Agent",
  ROLE_ADMIN: "Admin",
};

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().max(100).optional(),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number").optional().or(z.literal("")),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm your new password"),
}).refine((v) => v.newPassword === v.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type PasswordValues = z.infer<typeof passwordSchema>;

function Page() {
  const { user, ready } = useRequireAuth();
  const { setUser } = useAuth();

  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: user ? { firstName: user.firstName ?? "", lastName: user.lastName ?? "", mobile: user.mobile ?? "" } : undefined,
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  if (!ready || !user) {
    return null;
  }

  async function onSaveProfile(values: ProfileValues) {
    setProfileError(null);
    setProfileSaved(false);
    try {
      const updated = await updateProfile(values.firstName, values.lastName, values.mobile || undefined);
      setUser(updated);
      setProfileSaved(true);
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Failed to update profile. Please try again.");
    }
  }

  async function onChangePassword(values: PasswordValues) {
    setPasswordError(null);
    try {
      await changePassword(values.currentPassword, values.newPassword);
      passwordForm.reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordOpen(false);
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to change password. Please try again.");
    }
  }

  const dashboardRole = DASHBOARD_ROLE_BY_BACKEND_ROLE[user.role] ?? "customer";
  const canChangePassword = user.role !== "ROLE_CUSTOMER";

  return (
    <DashboardShell role={dashboardRole} title="Your profile">
      <div className="max-w-2xl mx-auto">
        <Panel title="Profile">
          <div className="flex items-center justify-between mb-5">
            <Badge variant="outline">{ROLE_LABEL[user.role] ?? user.role}</Badge>
            {canChangePassword && (
              <Button type="button" variant="pillOutline" size="sm" onClick={() => setPasswordOpen(true)}>
                Change password
              </Button>
            )}
          </div>

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} noValidate className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={profileForm.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={profileForm.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground mt-2">{user.email || "—"}</p>
                </div>
                <FormField control={profileForm.control} name="mobile" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl><Input inputMode="tel" maxLength={10} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <p className="text-xs text-muted-foreground">
                Email is your login and can't be changed here — contact an admin if it needs to update.
              </p>

              {profileError && (
                <p className="text-sm text-destructive" role="alert">{profileError}</p>
              )}
              {profileSaved && (
                <p className="text-sm text-emerald-deep" role="status">Profile updated.</p>
              )}

              <Button type="submit" variant="pill" disabled={profileForm.formState.isSubmitting}>
                {profileForm.formState.isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </Form>
        </Panel>
      </div>

      <Dialog open={passwordOpen} onOpenChange={(open) => { setPasswordOpen(open); if (!open) setPasswordError(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} noValidate className="space-y-4">
              <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {passwordError && (
                <p className="text-sm text-destructive" role="alert">{passwordError}</p>
              )}

              <DialogFooter>
                <Button type="submit" variant="pill" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? "Changing…" : "Change password"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
