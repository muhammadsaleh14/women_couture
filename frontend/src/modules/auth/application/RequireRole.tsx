import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/core/routes";
import type { UserRole } from "../domain/types";
import { useAuth } from "./use-auth";

type Props = {
  role: UserRole;
  children: ReactNode;
};

export function RequireRole({ role, children }: Props) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 text-sm text-stone-600">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (user.role !== role) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <>{children}</>;
}
