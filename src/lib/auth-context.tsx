import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import * as authApi from "./api/auth";
import type { BackendUser } from "./api/types";

interface AuthContextValue {
  user: BackendUser | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<BackendUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate session from the HttpOnly cookie on first load — there is no
  // client-readable token to inspect, so we ask the server who we are.
  useEffect(() => {
    let cancelled = false;
    authApi
      .me()
      .then((u) => { if (!cancelled) setUser(u); })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function login(identifier: string, password: string) {
    const u = await authApi.login(identifier, password);
    setUser(u);
    return u;
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
