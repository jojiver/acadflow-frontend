import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import type { Task } from "@/lib/priority";
import { getProductivityService, getTasksService } from "@/services/task-service";
import type { Productivity as ProductivityStats } from "@/services/task-service";

type Period = "today" | "week" | "month";

type DayActivity = {
  date: Date;
  tasks: Task[];
  hours: number;
};

const OPTIONS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const PERIOD_LABEL: Record<Period, string> = {
  today: "today",
  week: "this week",
  month: "this month",
};

const HEATMAP_WEEKS = 26;
const PALETTE = ["#F1F4F9", "#DFE5FF", "#BFC9FF", "#8C9BF5", "#4F5BD5"];
const WEEKDAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const TONES = {
  brand: "bg-brand",
  emerald: "bg-low",
  amber: "bg-med",
  rose: "bg-high",
} as const;

/** Returns the start of a local day. */
function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Returns a date shifted by a number of days. */
function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Formats a date as a local YYYY-MM-DD key. */
function toKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Converts a date key back into a local Date. */
function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Returns the Monday-first weekday index. */
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

/** Formats a date for the activity inspector. */
function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Maps a day's activity to a heatmap intensity. */
function levelFor(tasks: number, hours: number) {
  if (tasks === 0) return 0;
  if (tasks >= 3 || hours >= 6) return 4;
  if (tasks >= 2 || hours >= 3) return 3;
  if (hours >= 1.5) return 2;
  return 1;
}

/** Renders the Productivity component. */
export function Productivity() {
  const [period, setPeriod] = useState<Period>("week");
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [stats, setStats] = useState<ProductivityStats | null>(null);
  const [selectedKey, setSelectedKey] = useState(() => toKey(new Date()));
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getTasksService()
      .then((result) => {
        if (active) setTasks(result);
      })
      .catch(() => {
        if (active) setTasks([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    getProductivityService(period)
      .then((result) => {
        if (active) setStats(result);
      })
      .catch(() => {
        if (active) setStats(null);
      });

    return () => {
      active = false;
    };
  }, [period]);

  const today = useMemo(() => startOfDay(new Date()), []);

  const activity = useMemo(() => {
    const map = new Map<string, DayActivity>();

    for (const task of tasks ?? []) {
      if (!task.completedAt) continue;

      const completed = new Date(task.completedAt);

      if (Number.isNaN(completed.getTime())) continue;

      const date = startOfDay(completed);
      const key = toKey(date);
      const day = map.get(key) ?? { date, tasks: [], hours: 0 };

      day.tasks.push(task);
      day.hours += task.estimatedHours;
      map.set(key, day);
    }

    return map;
  }, [tasks]);

  const heatmap = useMemo(() => {
    const totalDays = HEATMAP_WEEKS * 7;
    const start = addDays(today, -(totalDays - 1));
    const alignedStart = addDays(start, -mondayIndex(start));
    const weeks: { date: Date; key: string; future: boolean }[][] = [];
    let cursor = alignedStart;

    while (cursor <= today) {
      weeks.push(
        Array.from({ length: 7 }, (_, index) => {
          const date = addDays(cursor, index);
          return {
            date,
            key: toKey(date),
            future: date.getTime() > today.getTime(),
          };
        }),
      );
      cursor = addDays(cursor, 7);
    }

    return weeks;
  }, [today]);

  const monthLabels = useMemo(
    () =>
      heatmap.map((week, index) => {
        const first = week[0].date;
        const previous = index > 0 ? heatmap[index - 1][0].date : null;

        return !previous || first.getMonth() !== previous.getMonth()
          ? first.toLocaleDateString("en-US", { month: "short" })
          : "";
      }),
    [heatmap],
  );

  const completedDays = useMemo(() => new Set(activity.keys()), [activity]);
  const todayKey = toKey(today);

  const streak = useMemo(() => {
    let count = 0;
    let cursor = completedDays.has(todayKey) ? today : addDays(today, -1);

    while (completedDays.has(toKey(cursor))) {
      count++;
      cursor = addDays(cursor, -1);
    }

    return count;
  }, [completedDays, today, todayKey]);

  const activeDays = activity.size;
  const totalCompleted =
    tasks?.filter((task) => Boolean(task.completedAt)).length ?? 0;

  const bestDay = useMemo(() => {
    let best: DayActivity | null = null;

    for (const day of activity.values()) {
      if (
        !best ||
        day.tasks.length > best.tasks.length ||
        (day.tasks.length === best.tasks.length && day.hours > best.hours)
      ) {
        best = day;
      }
    }

    return best;
  }, [activity]);

  const inspectorKey = hoveredKey ?? selectedKey;
  const inspector = activity.get(inspectorKey);
  const inspectorDate = inspector?.date ?? dateFromKey(inspectorKey);
  const selected = activity.get(selectedKey);
  const selectedDate = selected?.date ?? dateFromKey(selectedKey);
  const completed = stats?.completedTasks ?? [];

  if (tasks === null) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Productivity tracker
            </h2>
            <p className="mt-1 text-sm text-ink-2">
              Your completion activity, streaks and workload at a glance.
            </p>
          </div>
          <SegmentedControl
            ariaLabel="Productivity period"
            value={period}
            onChange={setPeriod}
            options={OPTIONS}
          />
        </div>

        {stats === null ? (
          <Skeleton className="mt-5 h-32 rounded-xl" />
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Completed"
              value={stats.completed}
              hint={`${stats.open} still open`}
              tone="brand"
            />
            <Metric
              label="Hours"
              value={`${stats.hours}h`}
              hint="Estimated workload finished"
              tone="amber"
            />
            <Metric
              label="Completion rate"
              value={`${stats.rate}%`}
              hint="Completed vs. all work"
              tone="emerald"
              progress={stats.rate}
            />
            <Metric
              label="Current streak"
              value={`${streak}d`}
              hint={
                streak === 0
                  ? "Complete a task to start a streak"
                  : "Consecutive active days"
              }
              tone="rose"
            />
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Activity</h2>
            <p className="mt-1 text-sm text-ink-2">
              Every completed task over the last 6 months.
            </p>
          </div>

          <div className="rounded-xl bg-canvas px-4 py-2.5 text-right">
            <p className="text-sm font-semibold text-ink">
              {formatDay(inspectorDate)}
            </p>
            <p className="mt-0.5 text-xs text-ink-3">
              {inspector?.tasks.length ?? 0} task
              {(inspector?.tasks.length ?? 0) === 1 ? "" : "s"} -{" "}
              {inspector?.hours ?? 0}h completed
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto pb-1">
          <div className="inline-flex gap-2">
            <div className="flex flex-col gap-[3px] pt-[19px] text-[10px] text-ink-3">
              {WEEKDAY_LABELS.map((label, index) => (
                <span key={index} className="flex h-[13px] items-center">
                  {label}
                </span>
              ))}
            </div>

            <div>
              <div className="flex gap-[3px]">
                {monthLabels.map((label, index) => (
                  <span
                    key={index}
                    className="w-[13px] overflow-visible text-[10px] whitespace-nowrap text-ink-3"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-1 flex gap-[3px]">
                {heatmap.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.map((day) => {
                      if (day.future) {
                        return (
                          <span
                            key={day.key}
                            className="size-[13px] rounded-[3px]"
                          />
                        );
                      }

                      const dayActivity = activity.get(day.key);
                      const count = dayActivity?.tasks.length ?? 0;
                      const hours = dayActivity?.hours ?? 0;
                      const isSelected = day.key === selectedKey;

                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setSelectedKey(day.key)}
                          onMouseEnter={() => setHoveredKey(day.key)}
                          onMouseLeave={() => setHoveredKey(null)}
                          title={`${formatDay(day.date)}: ${count} tasks, ${hours}h`}
                          aria-label={`${formatDay(day.date)}: ${count} tasks, ${hours} hours`}
                          className={cn(
                            "size-[13px] cursor-pointer rounded-[3px] border border-black/5 transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                            isSelected &&
                              "ring-2 ring-brand-dark ring-offset-1",
                          )}
                          style={{
                            backgroundColor: PALETTE[levelFor(count, hours)],
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-3">
            <span>
              <strong className="text-ink">{activeDays}</strong> active days
            </span>
            <span>
              <strong className="text-ink">{totalCompleted}</strong> completed
              all time
            </span>
            {bestDay && (
              <span>
                Best: <strong className="text-ink">{bestDay.tasks.length}</strong>{" "}
                on {formatDay(bestDay.date)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-ink-3">
            <span>Less</span>
            {PALETTE.map((color) => (
              <span
                key={color}
                className="size-[11px] rounded-[2px] border border-black/5"
                style={{ backgroundColor: color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-line bg-canvas p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink">
              Completed on {formatDay(selectedDate)}
            </p>
            <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-medium text-ink-2">
              {selected?.tasks.length ?? 0} tasks - {selected?.hours ?? 0}h
            </span>
          </div>

          {!selected || selected.tasks.length === 0 ? (
            <p className="mt-3 text-xs text-ink-3">
              No completed tasks on this day. Pick another square in the
              heatmap.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {selected.tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                >
                  <Link
                    to={`/user/tasks/${task.id}`}
                    className="min-w-0 truncate text-sm font-medium text-ink hover:text-brand"
                  >
                    {task.title}
                  </Link>
                  <span className="text-xs text-ink-3">
                    {task.subject} - {task.estimatedHours}h
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Completed {PERIOD_LABEL[period]}
            </h2>
            <p className="mt-1 text-sm text-ink-2">
              {completed.length} task{completed.length === 1 ? "" : "s"}{" "}
              finished.
            </p>
          </div>
          <span className="text-xs text-ink-3">
            {stats?.hours ?? 0}h completed
          </span>
        </div>

        {completed.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-line px-6 py-10 text-center text-sm text-ink-3">
            Nothing completed yet - finish a task to see it here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {completed.map((task) => (
              <li
                key={task.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <Link
                    to={`/user/tasks/${task.id}`}
                    className="truncate text-sm font-medium text-ink hover:text-brand"
                  >
                    {task.title}
                  </Link>
                  <p className="text-xs text-ink-3">
                    {task.subject} - {task.type}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-ink-2">
                  <span>{task.estimatedHours}h</span>
                  <span>
                    {task.completedAt
                      ? new Date(task.completedAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/** Renders the Metric component. */
function Metric({
  label,
  value,
  hint,
  tone,
  progress,
}: {
  label: string;
  value: string | number;
  hint: string;
  tone: keyof typeof TONES;
  progress?: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface p-4">
      <span className={cn("absolute inset-x-0 top-0 h-1", TONES[tone])} />
      <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-2">{hint}</p>
      {progress !== undefined && (
        <ProgressBar
          className="mt-2"
          value={progress}
          tone="emerald"
        />
      )}
    </div>
  );
}
