import { useContext } from "react";
import { AuthContext } from "./auth-state";

// Pages call useAuth() to read the user or run login, signup, and logout.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
