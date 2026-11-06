import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";

// Wrap routes with this component to limit which users can see their pages.
// The API also checks permissions; frontend checks alone cannot secure data.
export function ProtectedRoute({ role }: { role: "STUDENT" | "ADMIN" }) {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}

// Visiting the app root while signed in goes straight to the dashboard.
export function HomeRedirect() {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (!user) return <Navigate to="/auth/login" replace />;

  return <Navigate to="/user" replace />;
}
