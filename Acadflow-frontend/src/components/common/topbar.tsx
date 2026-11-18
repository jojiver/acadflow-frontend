import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { cn } from "@/lib/cn";
import type { Task } from "@/lib/priority";
import { getSubjectsService } from "@/services/subject-service";
import type { Subject } from "@/services/subject-service";
import { getTasksService } from "@/services/task-service";

type PageMeta = { title: string; subtitle: string };

type SearchResult = {
  id: string;
  label: string;
  meta: string;
  kind: "task" | "subject";
  path: string;
};

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
      subtitle: "Your week at a glance",
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
  if (pathname === "/user/calendar") {
    return {
      title: "Calendar",
      subtitle: "Classes, deadlines and study sessions in one view.",
    };
  }
  if (pathname === "/user/workload") {
    return {
      title: "Workload",
      subtitle: "See where your academic work is concentrated.",
    };
  }
  if (pathname === "/user/notifications") {
    return {
      title: "Notifications",
      subtitle: "Deadline, class, priority and workload alerts.",
    };
  }
  if (pathname === "/user/settings") {
    return {
      title: "Settings",
      subtitle: "Account, academic, notification and schedule preferences.",
    };
  }
  if (pathname === "/user/profile") {
    return {
      title: "Profile",
      subtitle: "Your student details and academic summary.",
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
        "Add a task - AcadFlow ranks it automatically from your deadline, workload and progress.",
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

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { title, subtitle } = getPageMeta(pathname);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<{
    tasks: Task[];
    subjects: Subject[];
  } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function loadSearchData() {
    if (loading || data) return;

    setLoading(true);
    setError("");

    try {
      const [tasks, subjects] = await Promise.all([
        getTasksService(),
        getSubjectsService(),
      ]);
      setData({ tasks, subjects });
    } catch {
      setError("Could not load search results.");
    } finally {
      setLoading(false);
    }
  }

  const results = useMemo<SearchResult[]>(() => {
    const term = query.trim().toLowerCase();

    if (term.length < 2 || !data) return [];

    const taskResults = data.tasks
      .filter((task) =>
        [task.title, task.subject, task.type, task.description].some((value) =>
          value?.toLowerCase().includes(term),
        ),
      )
      .slice(0, 5)
      .map((task) => ({
        id: `task-${task.id}`,
        label: task.title,
        meta: `Task - ${task.subject}`,
        kind: "task" as const,
        path: `/user/tasks/${task.id}`,
      }));

    const subjectResults = data.subjects
      .filter((subject) =>
        [subject.name, subject.instructor, subject.room, subject.schedule].some(
          (value) => value?.toLowerCase().includes(term),
        ),
      )
      .slice(0, 5)
      .map((subject) => ({
        id: `subject-${subject.id}`,
        label: subject.name,
        meta: `Subject${subject.instructor ? ` - ${subject.instructor}` : ""}`,
        kind: "subject" as const,
        path: `/user/subjects?q=${encodeURIComponent(subject.name)}`,
      }));

    return [...taskResults, ...subjectResults];
  }, [query, data]);

  function goToResult(result: SearchResult) {
    navigate(result.path);
    setQuery("");
    setOpen(false);
  }

  const showResults = open && query.trim().length >= 2;

  return (
    <header className="relative z-30 flex h-[72px] shrink-0 items-center justify-between gap-6 border-b border-line bg-canvas px-6">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold text-ink">{title}</h1>
        <p className="truncate text-[13px] text-ink-2">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div ref={searchRef} className="relative hidden md:block">
          <div
            className={cn(
              "flex h-10 w-[320px] items-center gap-2 rounded-xl bg-brand-tint px-3.5 text-ink-3 transition-shadow",
              open && "ring-2 ring-brand/20",
            )}
          >
            <SearchIcon />
            <input
              value={query}
              onChange={(event) => {
                const value = event.target.value;
                setQuery(value);
                setOpen(true);
                setError("");

                if (value.trim().length >= 2) {
                  void loadSearchData();
                }
              }}
              onFocus={() => {
                setOpen(true);

                if (query.trim().length >= 2) {
                  void loadSearchData();
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false);
                if (event.key === "Enter" && results[0]) {
                  goToResult(results[0]);
                }
              }}
              placeholder="Search subjects or tasks"
              aria-label="Search subjects or tasks"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
                aria-label="Clear search"
                className="cursor-pointer text-sm text-ink-3 hover:text-ink"
              >
                x
              </button>
            )}
          </div>

          {showResults && (
            <div className="absolute top-full right-0 z-50 mt-2 w-[360px] overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
              {loading ? (
                <p className="p-4 text-sm text-ink-3">Searching...</p>
              ) : error ? (
                <p className="p-4 text-sm text-high">{error}</p>
              ) : results.length === 0 ? (
                <p className="p-4 text-sm text-ink-3">
                  No subjects or tasks match "{query.trim()}".
                </p>
              ) : (
                <ul className="max-h-[360px] overflow-y-auto py-1">
                  {results.map((result) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        onClick={() => goToResult(result)}
                        className="flex w-full cursor-pointer items-start gap-3 px-3.5 py-2.5 text-left hover:bg-brand-tint"
                      >
                        <span className="mt-0.5 rounded bg-brand-tint px-1.5 py-0.5 text-[10px] font-bold text-ink-2 uppercase">
                          {result.kind}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-ink">
                            {result.label}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-ink-3">
                            {result.meta}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/user/notifications")}
          aria-label="Open notifications"
          title="Notifications"
          className="relative grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-brand hover:text-brand"
        >
          <BellIcon />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-high" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/user/profile")}
          aria-label="Open profile"
          className="grid size-10 place-items-center rounded-full bg-brand-dark text-xs font-semibold text-white"
        >
          {getInitials(user?.name)}
        </button>
      </div>
    </header>
  );
}
