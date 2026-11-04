import { createContext } from "react";
import type { SignupInput, User } from "@/services/auth-service";

// The values and functions any component can read through useAuth().
export type AuthContextValue = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (input: SignupInput) => Promise<User>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
