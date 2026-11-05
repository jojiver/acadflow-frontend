import { Link, NavLink, useNavigate } from "react-router";
import { cn } from "@/lib/cn";
import { useAuth } from "@/components/context/use-auth";

type NavItem = {
  to: string | null;
  label: string;
  icon: string;
  end?: boolean;
  badge?: string;
};

const PRIMARY: NavItem[] = [
  { to: "/user", label: "Dashboard", icon: "▦", end: true },
  { to: "/user/schedule", label: "Schedule", icon: "☰" },
  { to: "/user/subjects", label: "Subjects", icon: "◫" },
  { to: "/user/tasks", label: "Tasks & Priorities", icon: "✓" },
  { to: "/user/productivity", label: "Productivity", icon: "◔" },
  { to: null, label: "Calendar", icon: "▤" },
  { to: null, label: "Workload", icon: "◧" },
];

const GENERAL: NavItem[] = [
  { to: null, label: "Notifications", icon: "◉", badge: "3" },
  { to: null, label: "Settings", icon: "⚙" },
  { to: null, label: "Profile", icon: "◍" },
];

function getInitials(name?: string) {
  if (!name) return "JS";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SidebarItem({ to, label, icon, end, badge }: NavItem) {
  const content = (
    <>
      <span className="grid size-[26px] shrink-0 place-items-center rounded-lg bg-brand-tint text-[13px] text-brand">
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="grid size-5 place-items-center rounded-full bg-brand-dark text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </>
  );

  if (!to) {
    return (
      <span
        title="Coming soon"
        className="flex h-[42px] cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-3"
      >
        {content}
      </span>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex h-[42px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
          isActive
            ? "bg-brand-tint font-semibold text-ink"
            : "text-ink-2 hover:bg-brand-tint",
        )
      }
    >
      {content}
    </NavLink>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Ignore network errors and still return to login.
    }
    navigate("/auth/login", { replace: true });
  }

  return (
    <aside className="sticky top-0 hidden h-svh w-[250px] shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
      <Link to="/user" className="flex items-center gap-2.5 px-2">
        <span className="grid size-9 place-items-center rounded-xl bg-brand-dark text-sm font-bold text-white">
          A
        </span>
        <span className="text-lg font-semibold text-ink">AcadFlow</span>
      </Link>

      <nav className="mt-8 space-y-1">
        {PRIMARY.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>

      <p className="mt-7 mb-2 px-3 text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
        General
      </p>
      <nav className="space-y-1">
        {GENERAL.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex h-[42px] cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-brand-tint"
      >
        <span className="grid size-[26px] place-items-center text-[14px]">
          ↩
        </span>
        Log out
      </button>

      <div className="mt-auto flex items-center gap-3 rounded-xl bg-brand-tint p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-dark text-xs font-semibold text-white">
          {getInitials(user?.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {user?.name ?? "Student"}
          </p>
          <p className="truncate text-xs text-ink-2">
            {[user?.program, user?.yearLevel].filter(Boolean).join(" · ") ||
              "BS IT · 2nd Year"}
          </p>
        </div>
      </div>
    </aside>
  );
}
