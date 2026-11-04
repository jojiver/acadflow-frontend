import { EmptyState } from "@/components/ui/empty-state";
import { TaskCard } from "@/components/features/tasks/task-card";
import type { Priority, Task } from "@/lib/priority";

type TaskCollectionProps = {
  items: { task: Task; priority: Priority }[];
};

export function TaskCollection({ items }: TaskCollectionProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No tasks in this filter"
        description="Try another priority level or add a new task."
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map(({ task, priority }) => (
        <TaskCard key={task.id} task={task} priority={priority} />
      ))}
    </div>
  );
}
