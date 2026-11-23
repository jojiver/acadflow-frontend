import type { ComponentType } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { cn } from "@/lib/cn";
import { useAuth } from "@/components/context/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import {
  BellIcon,
  CalendarIcon,
  DashboardIcon,
  LogOutIcon,
  ProductivityIcon,
  ProfileIcon,
  ScheduleIcon,
  SettingsIcon,
  SubjectsIcon,
  TasksIcon,
  WorkloadIcon,
} from "./nav-icons";

type NavItem = {
  to: string | null;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  end?: boolean;
  badge?: string;
};

const PRIMARY: NavItem[] = [
  { to: "/user", label: "Dashboard", Icon: DashboardIcon, end: true },
  { to: "/user/schedule", label: "Schedule", Icon: ScheduleIcon },
  { to: "/user/subjects", label: "Subjects", Icon: SubjectsIcon },
  { to: "/user/tasks", label: "Tasks & Priorities", Icon: TasksIcon },
  { to: "/user/productivity", label: "Productivity", Icon: ProductivityIcon },
  { to: "/user/calendar", label: "Calendar", Icon: CalendarIcon },
  { to: "/user/workload", label: "Workload", Icon: WorkloadIcon },
];

const GENERAL: NavItem[] = [
  {
    to: "/user/notifications",
    label: "Notifications",
    Icon: BellIcon,
  },
  { to: "/user/settings", label: "Settings", Icon: SettingsIcon },
  { to: "/user/profile", label: "Profile", Icon: ProfileIcon },
];

/** Builds avatar initials from a name. */
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

/** Renders the SidebarItem component. */
function SidebarItem({ to, label, Icon, end, badge }: NavItem) {
  const content = (
    <>
      <span className="grid size-[26px] shrink-0 place-items-center rounded-lg bg-brand-tint text-brand">
        <Icon className="size-[15px]" />
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

/** Renders the Sidebar component. */
export function Sidebar() {
  const { user, logout } = useAuth();
  const { count: notificationCount } = useNotifications();
  const navigate = useNavigate();
  const notificationBadge =
    notificationCount > 0
      ? notificationCount > 9
        ? "9+"
        : String(notificationCount)
      : undefined;

  /** Logs out and returns to the login page. */
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
          <SidebarItem
            key={item.label}
            {...item}
            badge={
              item.to === "/user/notifications"
                ? notificationBadge
                : undefined
            }
          />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex h-[42px] cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-brand-tint"
      >
        <span className="grid size-[26px] place-items-center">
          <LogOutIcon className="size-[17px]" />
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
            {[user?.program, user?.yearLevel].filter(Boolean).join(" - ") ||
              "BSIT - 4th Year"}
          </p>
        </div>
      </div>
    </aside>
  );
}
