import { useLocation } from "react-router";
import { useAuth } from "@/components/context/use-auth";

type PageMeta = { title: string; subtitle: string };

function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/user") {
    return {
      title: "Dashboard",
      subtitle: "Here is what needs your attention today.",
    };
  }
  if (pathname === "/user/schedule") {
    return {
      title: "Class Schedule",
      subtitle: "Your week at a glance · Oct 6 – 10, 2026",
    };
  }
  if (pathname === "/user/schedule/import") {
    return {
      title: "Import Schedule",
      subtitle: "Upload your timetable, review what we detected, then confirm.",
    };
  }
  if (pathname === "/user/subjects") {
    return {
      title: "Subjects",
      subtitle:
        "Track progress, materials, and upcoming work across each subject.",
    };
  }
  if (pathname === "/user/productivity") {
    return {
      title: "Productivity",
      subtitle: "How productive you are today, this week, and this month.",
    };
  }
  if (pathname === "/user/tasks") {
    return {
      title: "Tasks",
      subtitle: "Everything you need to do, ranked automatically.",
    };
  }
  if (pathname === "/user/tasks/create") {
    return {
      title: "New task",
      subtitle:
        "Add a task · AcadFlow ranks it automatically from your deadline, workload and progress.",
    };
  }
  if (/^\/user\/tasks\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: "Edit task",
      subtitle: "Update the task and AcadFlow will re-score its priority.",
    };
  }
  if (/^\/user\/tasks\/[^/]+$/.test(pathname)) {
    return {
      title: "Task details",
      subtitle: "Review the requirement and its priority.",
    };
  }
  return {
    title: "AcadFlow",
    subtitle: "Your Schedule. Your Deadlines. Your Priority.",
  };
}

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

export function Topbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { title, subtitle } = getPageMeta(pathname);

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-6 border-b border-line bg-canvas px-6">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold text-ink">{title}</h1>
        <p className="truncate text-[13px] text-ink-2">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-[300px] items-center gap-2 rounded-xl bg-brand-tint px-3.5 text-[13px] text-ink-3 md:flex">
          <span className="text-sm">⌕</span>
          <span>Search subjects, tasks…</span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-surface text-[15px] text-ink-2"
        >
          ◉
          <span className="absolute top-2 right-2 size-2 rounded-full bg-high" />
        </button>

        <span className="grid size-10 place-items-center rounded-full bg-brand-dark text-xs font-semibold text-white">
          {getInitials(user?.name)}
        </span>
      </div>
    </header>
  );
}
