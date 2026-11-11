import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { getScheduleService } from "@/services/schedule-service";
import type { ScheduleClass } from "@/services/schedule-service";
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

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function Calendar() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [classes, setClasses] = useState<ScheduleClass[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    let active = true;

    Promise.all([getTasksService(), getScheduleService()])
      .then(([taskList, schedule]) => {
        if (!active) return;
        setTasks(taskList);
        setClasses(schedule);
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

  function shiftMonth(delta: number) {
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );
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
        </div>

        <div className="flex items-center gap-4 text-xs text-ink-2">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-brand" /> Classes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-high" /> Deadlines
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
                      {dayClasses.slice(0, 2).map((item) => (
                        <p
                          key={`c-${item.id}`}
                          className="truncate rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600"
                        >
                          {item.subject}
                        </p>
                      ))}
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
            <h2 className="text-sm font-bold text-ink">Upcoming deadlines</h2>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-xs text-ink-3">No upcoming deadlines.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {upcoming.map((task) => (
                  <li
                    key={task.id}
                    className="rounded-xl bg-canvas p-2.5"
                  >
                    <p className="truncate text-xs font-semibold text-ink">
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-ink-3">
                      {task.subject} ·{" "}
                      {new Date(task.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
