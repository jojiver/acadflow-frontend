import { NavLink, useNavigate } from "react-router";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/context/use-auth";

const LINKS = [
  { to: "/user", label: "Dashboard", end: true },
  { to: "/user/tasks", label: "Tasks & Priorities", end: false },
];

const SOON = ["Schedule", "Calendar", "Workload"];

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Ignore network errors on sign out and still return to login.
    }
    navigate("/auth/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-[#f7f8f0]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <NavLink to="/user" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-emerald-900 text-sm font-bold text-amber-50">
            AF
          </span>
          <span className="text-lg font-semibold text-emerald-950">
            AcadFlow
          </span>
        </NavLink>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-emerald-900/10 text-emerald-950"
                    : "text-emerald-950/60 hover:bg-emerald-900/5 hover:text-emerald-950",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          {SOON.map((label) => (
            <span
              key={label}
              title="Coming soon"
              className="hidden cursor-not-allowed rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap text-emerald-950/30 sm:inline"
            >
              {label}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-emerald-950/70 sm:inline">
            {user?.name}
          </span>
          <Button variant="secondary" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
