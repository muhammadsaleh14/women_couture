import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetApiV1AuthMeQueryKey,
  useGetApiV1AuthMe,
  usePostApiV1AuthLogin,
} from "@/api/generated/api";
import { getStoredToken, setStoredToken } from "@/lib/api";
import { AuthContext, type AuthContextValue } from "./auth-context";
import type { AuthUser } from "./types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const meQuery = useGetApiV1AuthMe({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  const loginMutation = usePostApiV1AuthLogin();

  useEffect(() => {
    if (!token || !meQuery.isError) return;
    startTransition(() => {
      setStoredToken(null);
      setToken(null);
      queryClient.removeQueries({ queryKey: getGetApiV1AuthMeQueryKey() });
    });
  }, [token, meQuery.isError, queryClient]);

  const user: AuthUser | null = token ? (meQuery.data ?? null) : null;

  const status: AuthContextValue["status"] =
    !!token && meQuery.isPending ? "loading" : "ready";

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const data = await loginMutation.mutateAsync({
          data: { username, password },
        });
        setStoredToken(data.accessToken);
        setToken(data.accessToken);
        queryClient.setQueryData(getGetApiV1AuthMeQueryKey(), data.user);
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
    },
    [loginMutation, queryClient],
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    queryClient.removeQueries({ queryKey: getGetApiV1AuthMeQueryKey() });
  }, [queryClient]);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
