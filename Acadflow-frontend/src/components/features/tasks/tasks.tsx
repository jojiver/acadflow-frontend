import { useEffect, useMemo, useState } from "react";
import { ProductivityPanel } from "@/components/features/productivity/productivity-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { calculatePriority } from "@/lib/priority";
import type { Task } from "@/lib/priority";
import { getTasksService } from "@/services/task-service";
import { TaskCollection } from "./task-collection";
import { TaskFilters } from "./task-filters";

type PriorityFilter = "All" | "High" | "Medium" | "Low";

// This feature owns the task request, priority filtering, and page state.
export function Tasks() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [filter, setFilter] = useState<PriorityFilter>("All");

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

  const ranked = useMemo(
    () =>
      (tasks ?? []).map((task) => ({
        task,
        priority: calculatePriority(task),
      })),
    [tasks],
  );

  const counts = useMemo(() => {
    const result: Record<PriorityFilter, number> = {
      All: ranked.length,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    for (const item of ranked) {
      result[item.priority.level] += 1;
    }

    return result;
  }, [ranked]);

  const visible = useMemo(
    () =>
      ranked
        .filter((item) => !item.task.completedAt && item.task.progress < 100)
        .filter((item) => filter === "All" || item.priority.level === filter)
        .sort((a, b) => b.priority.score - a.priority.score),
    [ranked, filter],
  );

  if (tasks === null) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-36 rounded-[20px]" />
        <Skeleton className="h-24 rounded-[20px]" />
        <Skeleton className="h-24 rounded-[20px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductivityPanel tasks={tasks} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TaskFilters value={filter} counts={counts} onChange={setFilter} />
        <p className="text-xs text-ink-2">Sorted by priority: highest first</p>
      </div>

      <TaskCollection items={visible} />
    </div>
  );
}
