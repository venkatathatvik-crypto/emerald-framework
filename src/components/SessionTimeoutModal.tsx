import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, ShieldAlert, LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { refreshAuthToken } from "@/lib/api/auth";
import { toast } from "sonner";

// 14 minutes warning (840 seconds), 60 seconds countdown = 15 minutes total JWT expiry
const INACTIVITY_WARNING_MS = 14 * 60 * 1000;
const COUNTDOWN_SECONDS = 60;

export function SessionTimeoutModal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // ignore — the session is going away regardless
    } finally {
      toast.info("Session expired due to inactivity. Please log in again.");
      // Router navigation, not window.location: the app is served under a base
      // path (/gold-emi-app), and a raw location assignment drops it and lands
      // on nginx's 404 instead of the login page.
      navigate({ to: "/login" });
    }
  }, [logout, navigate]);

  const resetActivityTimer = useCallback(() => {
    if (showWarning) return; // Don't reset if modal is already open

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(COUNTDOWN_SECONDS);
    }, INACTIVITY_WARNING_MS);
  }, [showWarning]);

  // Activity listeners
  useEffect(() => {
    if (!user) return;

    const activityEvents = ["mousemove", "keydown", "click", "touchstart", "scroll"];

    const handleUserActivity = () => {
      resetActivityTimer();
    };

    activityEvents.forEach((evt) => window.addEventListener(evt, handleUserActivity));
    resetActivityTimer();

    return () => {
      activityEvents.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [user, resetActivityTimer]);

  // Countdown timer when warning modal is active
  useEffect(() => {
    if (!showWarning) return;

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showWarning, handleLogout]);

  const handleStayLoggedIn = async () => {
    setIsRefreshing(true);
    try {
      await refreshAuthToken();
      toast.success("Session renewed successfully.");
      setShowWarning(false);
      resetActivityTimer();
    } catch (err) {
      toast.error("Failed to renew session. Logging out...");
      handleLogout();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = (countdown % 60).toString().padStart(2, "0");

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-amber-500/30 bg-background text-foreground shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold tracking-tight">
            Inactivity Session Warning
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm leading-relaxed">
            You have been inactive for 14 minutes. For security reasons, your session will automatically expire in:
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex items-center justify-center gap-2 rounded-lg bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300 font-mono text-2xl font-bold border border-amber-500/20">
          <Clock className="h-6 w-6 animate-pulse text-amber-600" />
          <span>{minutes}:{seconds}</span>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="w-full sm:w-auto text-xs"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Out Now
          </Button>

          <Button
            type="button"
            variant="default"
            disabled={isRefreshing}
            onClick={handleStayLoggedIn}
            className="w-full sm:w-auto text-xs bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Renewing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Stay Logged In
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
