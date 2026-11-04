import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";
import { deadlineNote } from "@/lib/priority";
import type { Priority, Task } from "@/lib/priority";

const LEVEL_VARIANT = { High: "high", Medium: "medium", Low: "low" } as const;
const TONE = { High: "rose", Medium: "amber", Low: "emerald" } as const;

export function TaskCard({
  task,
  priority,
}: {
  task: Task;
  priority: Priority;
}) {
  const overdue = priority.daysRemaining < 0;

  return (
    <article className="rounded-2xl border border-emerald-900/10 bg-[#f7f8f0] p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex w-16 shrink-0 flex-col items-center rounded-xl px-2 py-2",
            overdue ? "bg-rose-100" : "bg-emerald-900/5",
          )}
        >
          <span
            className={cn(
              "text-xl font-bold",
              overdue ? "text-rose-700" : "text-emerald-950",
            )}
          >
            {priority.score}
          </span>
          <span className="text-[10px] font-medium tracking-wide text-emerald-950/45 uppercase">
            / 100
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-emerald-950">
              {task.title}
            </h3>
            <Badge variant={LEVEL_VARIANT[priority.level]}>
              {priority.level} priority
            </Badge>
            {overdue && <Badge variant="high">Overdue</Badge>}
          </div>

          <p className="mt-0.5 text-sm text-emerald-950/60">
            {task.subject} · {task.type}
          </p>

          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-emerald-950/60">
            <div>
              <dd className={overdue ? "font-medium text-rose-600" : ""}>
                {deadlineNote(priority.daysRemaining)}
              </dd>
            </div>
            <div>
              <dt className="inline">Workload </dt>
              <dd className="inline font-medium text-emerald-950">
                {task.estimatedHours}h
              </dd>
            </div>
            <div>
              <dt className="inline">Difficulty </dt>
              <dd className="inline font-medium text-emerald-950">
                {task.difficulty}
              </dd>
            </div>
            <div>
              <dt className="inline">Importance </dt>
              <dd className="inline font-medium text-emerald-950">
                {task.importance}
              </dd>
            </div>
          </dl>

          <ProgressBar
            className="mt-3"
            value={task.progress}
            tone={TONE[priority.level]}
            label="Progress"
            showValue
          />
        </div>
      </div>
    </article>
  );
}
