import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { getTasksService } from "@/services/task-service";
import type { Task } from "@/lib/priority";

const DAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function Workload() {
  const [tasks, setTasks] = useState<Task[] | null>(null);

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

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        date.setHours(0, 0, 0, 0);
        return date;
      }),
    [],
  );

  const byDay = useMemo(() => {
    return days.map((date) => {
      const key = toKey(date);
      const due = (tasks ?? []).filter(
        (task) => toKey(new Date(task.deadline)) === key,
      );
      const hours = due.reduce((sum, task) => sum + task.estimatedHours, 0);
      return { date, key, tasks: due, hours };
    });
  }, [days, tasks]);

  const weekTasks = byDay.flatMap((day) => day.tasks);
  const estimated = weekTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const completed = weekTasks
    .filter((task) => task.completedAt)
    .reduce((sum, task) => sum + task.estimatedHours, 0);
  const remaining = Math.max(0, estimated - completed);
  const maxHours = Math.max(1, ...byDay.map((day) => day.hours));
  const peak = byDay.reduce(
    (best, day) => (day.hours > best.hours ? day : best),
    byDay[0],
  );

  if (tasks === null) {
    return <Skeleton className="h-[520px] rounded-2xl" />;
  }

  return (
    <div className="space-y-5">
      {estimated >= 10 && (
        <Alert tone="warning" title="Heavy workload ahead">
          You have {estimated} estimated hours of academic work due in the next
          7 days. Spread it out where you can.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Tasks this week" value={weekTasks.length} hint="Due in 7 days" />
        <Stat label="Estimated" value={`${estimated}h`} hint="All due work" />
        <Stat label="Completed" value={`${completed}h`} hint="Already finished" />
        <Stat label="Remaining" value={`${remaining}h`} hint="Still to do" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-ink">Workload by day</h2>
            <span className="text-xs text-ink-3">
              Peak: {DAY_LABEL[peak.date.getDay()]} · {peak.hours}h
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {byDay.map((day) => (
              <li key={day.key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-2">
                    {DAY_LABEL[day.date.getDay()]}{" "}
                    <span className="text-ink-3">
                      {day.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                  <span className="font-semibold text-ink">
                    {day.hours}h
                    <span className="ml-1 font-normal text-ink-3">
                      ({day.tasks.length})
                    </span>
                  </span>
                </div>
                <ProgressBar
                  className="mt-1.5"
                  value={(day.hours / maxHours) * 100}
                  tone={day.hours >= 5 ? "rose" : "slate"}
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-bold text-ink">Most demanding</h2>
          {peak.tasks.length === 0 ? (
            <p className="mt-3 text-xs text-ink-3">No work scheduled.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {peak.tasks.map((task) => (
                <li key={task.id} className="rounded-xl bg-canvas p-2.5">
                  <p className="truncate text-xs font-semibold text-ink">
                    {task.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-ink-3">
                    {task.subject} · {task.estimatedHours}h ·{" "}
                    {task.priority.level}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
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
  hint: string;
}) {
  return (
    <Card className={cn("p-5")}>
      <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-ink-3">{hint}</p>
    </Card>
  );
}
