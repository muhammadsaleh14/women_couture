import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/modules/auth/application/AuthProvider";

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
