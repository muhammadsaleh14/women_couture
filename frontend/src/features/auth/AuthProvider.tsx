import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isAxiosError } from "axios";
import { api, getStoredToken, setStoredToken } from "@/lib/api";
import { AuthContext, type AuthContextValue } from "./auth-context";
import type { AuthUser } from "./types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthContextValue["status"]>(() =>
    getStoredToken() ? "loading" : "ready",
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setStatus("ready");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<AuthUser>("/api/v1/auth/me");
        if (!cancelled) {
          setUser(data);
        }
      } catch {
        if (!cancelled) {
          setStoredToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setStatus("ready");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { data } = await api.post<{
        accessToken: string;
        user: AuthUser;
      }>("/api/v1/auth/login", { username, password });
      setStoredToken(data.accessToken);
      setUser(data.user);
      return data.user;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const msg =
          (err.response?.data as { message?: string } | undefined)?.message ??
          err.message;
        throw new Error(msg || "Login failed");
      }
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () =>
      ({
        status,
        user,
        login,
        logout,
      }) satisfies AuthContextValue,
    [status, user, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
