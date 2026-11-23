import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { getScheduleService } from "@/services/schedule-service";
import type { ScheduleClass } from "@/services/schedule-service";
import { getSubjectsService } from "@/services/subject-service";
import type { Subject } from "@/services/subject-service";
import { getTasksService } from "@/services/task-service";
import type { Task } from "@/lib/priority";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_KEY: Record<number, string> = {
  1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 0: "Sun",
};

const PALETTE = [
  "#6266F0",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

const PREFS_KEY = "acadflow.calendar.preferences";

type CalendarPrefs = {
  colorCode: boolean;
  colors: Record<string, string>;
};

/** Loads calendar preferences from local storage. */
function loadPrefs(): CalendarPrefs {
  if (typeof window === "undefined") {
    return { colorCode: true, colors: {} };
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(PREFS_KEY) ?? "{}",
    ) as Partial<CalendarPrefs>;

    const colors: Record<string, string> = {};

    if (parsed.colors && typeof parsed.colors === "object") {
      for (const [key, value] of Object.entries(parsed.colors)) {
        if (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)) {
          colors[key] = value;
        }
      }
    }

    return {
      colorCode: parsed.colorCode !== false,
      colors,
    };
  } catch {
    return { colorCode: true, colors: {} };
  }
}

/** Produces a stable fallback color for a subject. */
function colorFromName(name: string) {
  let hash = 0;
  for (const character of name) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/** Returns a light tint of a hex color. */
function tint(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color) ? `${color}14` : "#6266F014";
}

/** Pads a number with a leading zero. */
function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** Formats a date as a local YYYY-MM-DD key. */
function toKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Renders the Calendar component. */
export function Calendar() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [classes, setClasses] = useState<ScheduleClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [prefs, setPrefs] = useState<CalendarPrefs>(loadPrefs);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // Keep the preferences in memory when storage is unavailable.
    }
  }, [prefs]);

  useEffect(() => {
    let active = true;

    Promise.all([
      getTasksService(),
      getScheduleService(),
      getSubjectsService().catch(() => []),
    ])
      .then(([taskList, schedule, subjectList]) => {
        if (!active) return;
        setTasks(taskList);
        setClasses(schedule);
        setSubjects(subjectList);
      })
      .catch(() => {
        if (active) setTasks([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks ?? []) {
      const key = toKey(new Date(task.deadline));
      const list = map.get(key) ?? [];
      list.push(task);
      map.set(key, list);
    }
    return map;
  }, [tasks]);

  const classesByDay = useMemo(() => {
    const map = new Map<string, ScheduleClass[]>();
    for (const item of classes) {
      const list = map.get(item.day) ?? [];
      list.push(item);
      map.set(item.day, list);
    }
    return map;
  }, [classes]);

  const subjectColors = useMemo(() => {
    const byId = new Map<string, string>();
    const byName = new Map<string, string>();

    for (const subject of subjects) {
      const base =
        subject.color && /^#[0-9a-f]{6}$/i.test(subject.color)
          ? subject.color
          : colorFromName(subject.name);
      const color = prefs.colors[subject.id] ?? base;

      byId.set(subject.id, color);
      byName.set(subject.name.toLowerCase(), color);
    }

    return { byId, byName };
  }, [prefs.colors, subjects]);

  /** Resolves the effective color for a subject. */
  function resolveColor(name?: string | null, id?: string | null) {
    return (
      (id ? subjectColors.byId.get(id) : undefined) ??
      (name ? subjectColors.byName.get(name.toLowerCase()) : undefined) ??
      colorFromName(name || "General")
    );
  }

  const cells = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const first = new Date(year, monthIndex, 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const result: (Date | null)[] = [];

    for (let i = 0; i < offset; i++) result.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      result.push(new Date(year, monthIndex, day));
    }
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, [month]);

  const todayKey = toKey(new Date());

  const upcoming = useMemo(
    () =>
      (tasks ?? [])
        .filter((task) => !task.completedAt)
        .sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
        )
        .slice(0, 5),
    [tasks],
  );

  /** Moves the calendar to another month. */
  function shiftMonth(delta: number) {
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );
  }

  /** Saves a custom color for one subject. */
  function setSubjectColor(id: string, color: string) {
    setPrefs((current) => ({
      ...current,
      colors: { ...current.colors, [id]: color },
    }));
  }

  /** Removes a custom color for one subject. */
  function clearSubjectColor(id: string) {
    setPrefs((current) => {
      const colors = { ...current.colors };
      delete colors[id];

      return { ...current, colors };
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="h-9 px-3"
            onClick={() => shiftMonth(-1)}
          >
            ←
          </Button>
          <h2 className="text-lg font-semibold text-ink">
            {MONTHS[month.getMonth()]} {month.getFullYear()}
          </h2>
          <Button
            variant="secondary"
            className="h-9 px-3"
            onClick={() => shiftMonth(1)}
          >
            →
          </Button>
          <Button
            variant="secondary"
            className="h-9 px-3 text-xs"
            onClick={() => setCustomizeOpen(true)}
          >
            Customize
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-2">
          {prefs.colorCode ? (
            <span className="flex items-center gap-1.5">
              <span className="flex -space-x-0.5">
                {PALETTE.slice(0, 4).map((color) => (
                  <span
                    key={color}
                    className="size-2 rounded-full ring-1 ring-surface"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              Classes color-coded by subject
            </span>
          ) : (
            <span className="rounded-full bg-canvas px-2.5 py-1 text-ink-3">
              Subject colors off
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-high" /> Deadlines by
            priority
          </span>
        </div>
      </div>

      {tasks === null ? (
        <Skeleton className="h-[560px] rounded-2xl" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-7 border-b border-line bg-brand-tint/60">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="px-2 py-2 text-center text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map((date, index) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[96px] border-r border-b border-line bg-canvas/40"
                    />
                  );
                }

                const key = toKey(date);
                const dayTasks = tasksByDay.get(key) ?? [];
                const dayClasses =
                  classesByDay.get(DAY_KEY[date.getDay()] ?? "") ?? [];
                const isToday = key === todayKey;

                return (
                  <div
                    key={key}
                    className={cn(
                      "min-h-[96px] border-r border-b border-line p-2",
                      isToday && "bg-brand-tint/60",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-6 place-items-center rounded-full text-xs font-semibold",
                        isToday ? "bg-brand text-white" : "text-ink-2",
                      )}
                    >
                      {date.getDate()}
                    </span>

                    <div className="mt-1 space-y-1">
                      {dayClasses.slice(0, 2).map((item) => {
                        const color = prefs.colorCode
                          ? resolveColor(item.subject)
                          : "#94A3B8";

                        return (
                          <p
                            key={`c-${item.id}`}
                            title={`${item.subject} - ${item.start}-${item.end}${item.room ? ` - ${item.room}` : ""}`}
                            style={{
                              backgroundColor: tint(color),
                              borderLeftColor: color,
                            }}
                            className="truncate rounded border-l-[3px] px-1.5 py-0.5 text-[10px] font-medium text-ink"
                          >
                            {item.subject}
                          </p>
                        );
                      })}
                      {dayTasks.slice(0, 3).map((task) => (
                        <p
                          key={`t-${task.id}`}
                          className={cn(
                            "truncate rounded px-1.5 py-0.5 text-[10px] font-medium",
                            task.completedAt
                              ? "bg-slate-100 text-ink-3 line-through"
                              : task.priority.level === "High"
                                ? "bg-rose-50 text-rose-600"
                                : task.priority.level === "Medium"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-emerald-50 text-emerald-600",
                          )}
                        >
                          {task.title}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-ink">Subject colors</h2>
                <button
                  type="button"
                  onClick={() => setCustomizeOpen(true)}
                  className="cursor-pointer text-[11px] font-semibold text-brand hover:text-brand-dark"
                >
                  Edit
                </button>
              </div>

              {prefs.colorCode ? (
                <ul className="mt-3 space-y-1.5">
                  {subjects.slice(0, 8).map((subject) => (
                    <li
                      key={subject.id}
                      className="flex items-center gap-2 text-xs text-ink-2"
                    >
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: resolveColor(
                            subject.name,
                            subject.id,
                          ),
                        }}
                      />
                      <span className="truncate">{subject.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-ink-3">
                  Color coding is off. Turn it back on in Customize.
                </p>
              )}
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <h2 className="text-sm font-bold text-ink">
                Upcoming deadlines
              </h2>
              {upcoming.length === 0 ? (
                <p className="mt-3 text-xs text-ink-3">
                  No upcoming deadlines.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {upcoming.map((task) => (
                    <li key={task.id} className="rounded-xl bg-canvas p-2.5">
                      <p className="truncate text-xs font-semibold text-ink">
                        {task.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-ink-3">
                        <span
                          className="size-1.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: prefs.colorCode
                              ? resolveColor(task.subject, task.subjectId)
                              : "#94A3B8",
                          }}
                        />
                        {task.subject} -{" "}
                        {new Date(task.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      )}

      <Modal
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        title="Customize calendar"
      >
        <div className="space-y-5">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line p-3">
            <span>
              <span className="block text-sm font-semibold text-ink">
                Color-code classes
              </span>
              <span className="mt-0.5 block text-xs text-ink-3">
                Use subject colors in the month grid.
              </span>
            </span>
            <input
              type="checkbox"
              checked={prefs.colorCode}
              onChange={(event) =>
                setPrefs((current) => ({
                  ...current,
                  colorCode: event.target.checked,
                }))
              }
              className="size-5 accent-brand"
            />
          </label>

          {prefs.colorCode && (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
                  Subject colors
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setPrefs((current) => ({ ...current, colors: {} }))
                  }
                  className="cursor-pointer text-[11px] font-semibold text-ink-3 hover:text-ink"
                >
                  Reset all
                </button>
              </div>

              {subjects.length === 0 ? (
                <p className="text-xs text-ink-3">
                  No subjects yet. Add or import subjects first.
                </p>
              ) : (
                <ul className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                  {subjects.map((subject) => {
                    const base =
                      subject.color &&
                      /^#[0-9a-f]{6}$/i.test(subject.color)
                        ? subject.color
                        : colorFromName(subject.name);
                    const value = prefs.colors[subject.id] ?? base;

                    return (
                      <li
                        key={subject.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: value }}
                          />
                          <span className="truncate text-sm text-ink">
                            {subject.name}
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <input
                            type="color"
                            value={value}
                            onChange={(event) =>
                              setSubjectColor(subject.id, event.target.value)
                            }
                            aria-label={`Color for ${subject.name}`}
                            className="size-8 cursor-pointer rounded border border-line bg-transparent p-0.5"
                          />
                          {prefs.colors[subject.id] && (
                            <button
                              type="button"
                              onClick={() => clearSubjectColor(subject.id)}
                              className="cursor-pointer text-[10px] font-medium text-ink-3 hover:text-ink"
                            >
                              Reset
                            </button>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          <p className="text-[11px] text-ink-3">
            Saved on this device. Deadlines stay color-coded by priority.
          </p>
        </div>
      </Modal>
    </div>
  );
}
