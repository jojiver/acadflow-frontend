import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./auth-state";
import type { SignupInput, User } from "@/services/auth-service";
import {
  loginService,
  logoutService,
  restoreSessionService,
  signupService,
} from "@/services/auth-service";

export function AuthProvider({ children }: { children: ReactNode }) {
  // null means there is no signed-in user in the frontend state.
  const [user, setUser] = useState<User | null>(null);
  // Wait for the initial session check before deciding which page to show.
  const [ready, setReady] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    const currentUser = await loginService(email, password);
    setUser(currentUser);
    setReady(true);
    return currentUser;
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const currentUser = await signupService(input);
    setUser(currentUser);
    setReady(true);
    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    function onExpired() {
      setUser(null);
    }

    window.addEventListener("auth:expired", onExpired);

    async function restoreSession() {
      try {
        const currentUser = await restoreSessionService();
        if (mounted) setUser(currentUser);
      } catch {
        // No backend yet (or no session): treat the visitor as signed out.
        if (mounted) setUser(null);
      } finally {
        if (mounted) setReady(true);
      }
    }

    restoreSession();

    return () => {
      mounted = false;
      window.removeEventListener("auth:expired", onExpired);
    };
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, signup, logout }),
    [user, ready, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
