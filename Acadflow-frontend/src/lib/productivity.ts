import type { Task } from "@/lib/priority";

export type ProductivityPeriod = "today" | "week" | "month";

export type Productivity = {
  completed: number;
  hours: number;
  open: number;
  rate: number;
};

const SPAN_DAYS: Record<ProductivityPeriod, number> = {
  today: 1,
  week: 7,
  month: 30,
};

export function getProductivity(
  tasks: Task[],
  period: ProductivityPeriod,
  now = new Date(),
): Productivity {
  const span = SPAN_DAYS[period];

  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - (span - 1));
  windowStart.setHours(0, 0, 0, 0);

  const windowEnd = new Date(now);
  windowEnd.setDate(windowEnd.getDate() + span);

  const completedTasks = tasks.filter(
    (task) => task.completedAt && new Date(task.completedAt) >= windowStart,
  );

  const openTasks = tasks.filter(
    (task) =>
      !task.completedAt &&
      task.progress < 100 &&
      new Date(task.deadline) >= now &&
      new Date(task.deadline) <= windowEnd,
  );

  const hours = completedTasks.reduce(
    (sum, task) => sum + task.estimatedHours,
    0,
  );
  const total = completedTasks.length + openTasks.length;

  return {
    completed: completedTasks.length,
    hours: Math.round(hours * 10) / 10,
    open: openTasks.length,
    rate: total === 0 ? 0 : Math.round((completedTasks.length / total) * 100),
  };
}
