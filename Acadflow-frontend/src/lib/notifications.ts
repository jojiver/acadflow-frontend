import type { Task } from "./priority";

export type NotificationTone = "danger" | "warning" | "info";
export type NotificationKind = "deadline" | "priority" | "class" | "workload";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  tone: NotificationTone;
  kind: NotificationKind;
};

export type NotificationPreferences = {
  deadline: boolean;
  class: boolean;
  priority: boolean;
  workload: boolean;
};

export function buildNotifications(
  tasks: Task[],
  preferences?: NotificationPreferences,
): NotificationItem[] {
  const result: NotificationItem[] = [];
  const deadlineEnabled = preferences?.deadline !== false;
  const priorityEnabled = preferences?.priority !== false;

  for (const task of tasks) {
    if (task.completedAt) continue;

    const days = task.priority.daysRemaining;

    if (days < 0 && deadlineEnabled) {
      result.push({
        id: `${task.id}-overdue`,
        title: "Overdue task",
        message: `${task.title} was due ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago.`,
        tone: "danger",
        kind: "deadline",
      });
    } else if (days === 0 && deadlineEnabled) {
      result.push({
        id: `${task.id}-today`,
        title: "Due today",
        message: `${task.title} is due today.`,
        tone: "warning",
        kind: "deadline",
      });
    } else if (days === 1 && deadlineEnabled) {
      result.push({
        id: `${task.id}-tomorrow`,
        title: "Due tomorrow",
        message: `${task.title} is due tomorrow.`,
        tone: "info",
        kind: "deadline",
      });
    } else if (
      task.priority.level === "High" &&
      priorityEnabled &&
      days > 1
    ) {
      result.push({
        id: `${task.id}-high`,
        title: "High priority",
        message: `${task.title} is now a high-priority task.`,
        tone: "warning",
        kind: "priority",
      });
    }
  }

  return result;
}
