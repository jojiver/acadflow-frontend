import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";

// DEV PREVIEW ONLY: lets you open /user/* without the Express API running so
// the designs can be reviewed. Remove this before the real defense/login flow.
const DEV_PREVIEW = import.meta.env.DEV;

// Wrap routes with this component to limit which users can see their pages.
// The API also checks permissions; frontend checks alone cannot secure data.
export function ProtectedRoute({ role }: { role: "STUDENT" | "ADMIN" }) {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (DEV_PREVIEW && !user) return <Outlet />;
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
