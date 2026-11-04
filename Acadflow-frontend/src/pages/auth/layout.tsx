import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";

// Auth pages render their own full-screen frame (brand panel + card).
export default function AuthLayout() {
  const { user, ready } = useAuth();

  if (ready && user) return <Navigate to="/user" replace />;

  return <Outlet />;
}
