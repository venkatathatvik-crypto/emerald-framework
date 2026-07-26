/**
 * responsive-modal.tsx
 *
 * A unified responsive modal wrapper:
 *   - On desktop (≥ md / 768px): renders a standard Radix <Dialog>
 *   - On mobile  (< md / 768px): renders a touch-native Vaul <Drawer> bottom sheet
 *
 * Usage:
 *   <ResponsiveModal open={open} onOpenChange={setOpen} title="My Form" description="Fill in the details.">
 *     <form>…</form>
 *   </ResponsiveModal>
 */
import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Optional extra class for the inner content wrapper */
  contentClassName?: string;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  contentClassName,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={contentClassName}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={contentClassName}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="px-4 pb-6 overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
