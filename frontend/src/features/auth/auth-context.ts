import { createContext } from "react";
import type { AuthUser } from "./types";

export type AuthStatus = "loading" | "ready";

export type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
