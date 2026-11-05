import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductivity, getProductivityWindow } from "@/lib/productivity";
import type { ProductivityPeriod } from "@/lib/productivity";
import type { Task } from "@/lib/priority";
import { getTasksService } from "@/services/task-service";

const OPTIONS: { value: ProductivityPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const PERIOD_LABEL: Record<ProductivityPeriod, string> = {
  today: "today",
  week: "this week",
  month: "this month",
};

// Productivity tracker: how much was finished today, this week, this month.
export function Productivity() {
  const [period, setPeriod] = useState<ProductivityPeriod>("week");
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(function fetchTasks() {
    let active = true;

    getTasksService()
      .then((result) => {
        if (active) setTasks(result);
      })
      .catch(() => {
        if (active) setTasks([]);
      });

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, []);

  const stats = useMemo(
    () => (tasks ? getProductivity(tasks, period) : null),
    [tasks, period],
  );

  const completed = useMemo(() => {
    if (!tasks) return [];

    const { start, end } = getProductivityWindow(period);

    return tasks
      .filter((task) => {
        if (!task.completedAt) return false;
        const at = new Date(task.completedAt);
        return at >= start && at <= end;
      })
      .sort(
        (a, b) =>
          new Date(b.completedAt ?? 0).getTime() -
          new Date(a.completedAt ?? 0).getTime(),
      );
  }, [tasks, period]);

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Productivity tracker
            </h2>
            <p className="mt-1 text-sm text-ink-2">
              See how productive you are today, this week, and this month.
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
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Stat
              label="Tasks completed"
              value={stats.completed}
              hint={`${stats.open} still open`}
            />
            <Stat
              label="Hours completed"
              value={`${stats.hours}h`}
              hint="Estimated workload finished"
            />
            <div className="rounded-xl bg-brand-tint p-4">
              <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
                Completion rate
              </p>
              <p className="mt-1 text-2xl font-semibold text-ink">
                {stats.rate}%
              </p>
              <ProgressBar className="mt-2" value={stats.rate} tone="emerald" />
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-ink">
          Completed {PERIOD_LABEL[period]}
        </h2>
        <p className="mt-1 text-sm text-ink-2">
          {completed.length} task{completed.length === 1 ? "" : "s"} finished.
        </p>

        {completed.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-line px-6 py-10 text-center text-sm text-ink-3">
            Nothing completed yet — finish a task to see it here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {completed.map((task) => (
              <li
                key={task.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {task.title}
                  </p>
                  <p className="text-xs text-ink-3">
                    {task.subject} · {task.type}
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

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-brand-tint p-4">
      <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-2">{hint}</p>}
    </div>
  );
}
