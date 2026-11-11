import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getTasksService } from "@/services/task-service";
import type { Task } from "@/lib/priority";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  tone: "danger" | "warning" | "info";
};

const TOGGLES = [
  { key: "deadline", label: "Deadline reminders" },
  { key: "class", label: "Class reminders" },
  { key: "priority", label: "Priority changes" },
  { key: "workload", label: "Workload warnings" },
] as const;

export function Notifications() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [settings, setSettings] = useState<Record<string, boolean>>({
    deadline: true,
    class: true,
    priority: true,
    workload: true,
  });
  const [timing, setTiming] = useState("1h");

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

  const items = useMemo<NotificationItem[]>(() => {
    const result: NotificationItem[] = [];

    for (const task of tasks ?? []) {
      if (task.completedAt) continue;
      const days = task.priority.daysRemaining;

      if (days < 0) {
        result.push({
          id: `${task.id}-overdue`,
          title: "Overdue task",
          message: `${task.title} was due ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago.`,
          tone: "danger",
        });
      } else if (days === 0) {
        result.push({
          id: `${task.id}-today`,
          title: "Due today",
          message: `${task.title} is due today.`,
          tone: "warning",
        });
      } else if (days === 1) {
        result.push({
          id: `${task.id}-tomorrow`,
          title: "Due tomorrow",
          message: `${task.title} is due tomorrow.`,
          tone: "info",
        });
      } else if (task.priority.level === "High") {
        result.push({
          id: `${task.id}-high`,
          title: "High priority",
          message: `${task.title} is now a high-priority task.`,
          tone: "warning",
        });
      }
    }

    return result;
  }, [tasks]);

  if (tasks === null) {
    return <Skeleton className="h-[420px] rounded-2xl" />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">Notifications</h2>
          <Badge variant="default">{items.length}</Badge>
        </div>

        {items.length === 0 ? (
          <EmptyState
            className="mt-4"
            title="You are all caught up"
            description="Deadline, priority and workload alerts will appear here."
          />
        ) : (
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-line p-3"
              >
                <span
                  className={
                    item.tone === "danger"
                      ? "mt-1.5 size-2 shrink-0 rounded-full bg-high"
                      : item.tone === "warning"
                        ? "mt-1.5 size-2 shrink-0 rounded-full bg-med"
                        : "mt-1.5 size-2 shrink-0 rounded-full bg-brand"
                  }
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs text-ink-2">{item.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-bold text-ink">Notification settings</h2>
        <p className="mt-1 text-xs text-ink-3">
          Choose what you get reminded about.
        </p>

        <ul className="mt-4 space-y-3">
          {TOGGLES.map((toggle) => (
            <li key={toggle.key}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-2">
                <input
                  type="checkbox"
                  checked={settings[toggle.key]}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      [toggle.key]: event.target.checked,
                    }))
                  }
                  className="size-4 rounded border-line accent-brand"
                />
                {toggle.label}
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <p className="mb-1.5 text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
            Remind me
          </p>
          <Select
            value={timing}
            onChange={(event) => setTiming(event.target.value)}
          >
            <option value="30m">30 minutes before</option>
            <option value="1h">1 hour before</option>
            <option value="1d">1 day before</option>
            <option value="3d">3 days before</option>
          </Select>
        </div>

        <p className="mt-4 text-[11px] text-ink-3">
          Preferences are saved for this session.
        </p>
      </Card>
    </div>
  );
}
