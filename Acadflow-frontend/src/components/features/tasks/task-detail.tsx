import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/cn";
import { deadlineNote, progressFromSteps } from "@/lib/priority";
import type { Task, TaskStatus, TaskStep } from "@/lib/priority";
import {
  deleteTaskService,
  getTaskService,
  updateTaskService,
} from "@/services/task-service";
import type { TaskInput } from "@/services/task-service";

function toInput(task: Task): TaskInput {
  return {
    title: task.title,
    subjectId: task.subjectId ?? null,
    type: task.type,
    deadline: task.deadline,
    estimatedHours: task.estimatedHours,
    difficulty: task.difficulty,
    importance: task.importance,
    progress: task.progress,
    description: task.description ?? "",
    status: task.status ?? "In progress",
    steps: task.steps ?? [],
  };
}

const LEVEL_VARIANT = { High: "high", Medium: "medium", Low: "low" } as const;
const TONE = { High: "rose", Medium: "amber", Low: "emerald" } as const;

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null | undefined>(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savingStep, setSavingStep] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let active = true;

    getTaskService(id)
      .then((value) => {
        if (active) setTask(value);
      })
      .catch(() => {
        if (active) setTask(null);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!id) return;

    setBusy(true);
    setError("");
    try {
      await deleteTaskService(id);
      navigate("/user/tasks", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setBusy(false);
    }
  }

  async function saveSteps(nextSteps: TaskStep[]) {
    if (!id || !task) return;

    setSavingStep(true);
    setError("");
    try {
      const progress = progressFromSteps(nextSteps);
      const status: TaskStatus =
        progress >= 100
          ? "Completed"
          : progress > 0
            ? "In progress"
            : "Not started";
      const updated = await updateTaskService(id, {
        ...toInput(task),
        steps: nextSteps,
        progress,
        status,
      });
      setTask(updated);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSavingStep(false);
    }
  }

  function toggleStep(stepId: string) {
    if (!task?.steps) return;
    saveSteps(
      task.steps.map((step) =>
        step.id === stepId ? { ...step, done: !step.done } : step,
      ),
    );
  }

  function completeAllSteps() {
    if (!task?.steps) return;
    saveSteps(task.steps.map((step) => ({ ...step, done: true })));
  }

  if (!id || task === null) {
    return (
      <EmptyState
        title="Task not found"
        description="It may have been deleted."
        action={
          <Button variant="secondary" onClick={() => navigate("/user/tasks")}>
            Back to tasks
          </Button>
        }
      />
    );
  }

  if (task === undefined) {
    return <Skeleton className="h-96 rounded-2xl" />;
  }

  const priority = task.priority;
  const overdue = priority.daysRemaining < 0;
  const doneSteps = task.steps?.filter((step) => step.done).length ?? 0;
  const totalSteps = task.steps?.length ?? 0;

  const details: [string, string][] = [
    ["Deadline", deadlineNote(priority.daysRemaining)],
    ["Due date", new Date(task.deadline).toLocaleString()],
    ["Workload", `${task.estimatedHours} hours`],
    ["Difficulty", task.difficulty],
    ["Importance", task.importance],
    [
      "Status",
      task.status ?? (task.completedAt ? "Completed" : "In progress"),
    ],
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
              {task.subject} · {task.type}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {task.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant={LEVEL_VARIANT[priority.level]}>
                {priority.level} priority
              </Badge>
              <Badge variant="default">{priority.score}/100</Badge>
              {overdue && <Badge variant="high">Overdue</Badge>}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/user/tasks/${task.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              className="border-high/30 text-high hover:bg-[#FEE2E2]"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-brand-tint p-4">
              <dt className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <ProgressBar
          className="mt-6"
          value={task.progress}
          tone={TONE[priority.level]}
          label="Progress"
          showValue
        />

        {error && (
          <p role="alert" className="mt-4 text-sm text-high">
            {error}
          </p>
        )}
      </Card>

      {task.description && (
        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Task details</h2>
          <p className="mt-2 text-sm leading-6 text-ink-2">
            {task.description}
          </p>
        </Card>
      )}

      {task.steps && task.steps.length > 0 && (
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Steps</h2>
              <p className="mt-1 text-sm text-ink-2">
                {doneSteps} of {totalSteps} done ·{" "}
                {progressFromSteps(task.steps)}%
              </p>
            </div>
            {progressFromSteps(task.steps) < 100 && (
              <Button
                variant="secondary"
                disabled={savingStep}
                onClick={completeAllSteps}
              >
                Mark all done
              </Button>
            )}
          </div>

          <ul className="mt-4 space-y-2">
            {task.steps.map((step) => (
              <li key={step.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5",
                    step.done && "bg-brand-tint/60",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={step.done}
                    disabled={savingStep}
                    onChange={() => toggleStep(step.id)}
                    className="size-4 shrink-0 rounded border-line accent-brand"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      step.done ? "text-ink-3 line-through" : "text-ink",
                    )}
                  >
                    {step.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink">Priority breakdown</h2>
        <p className="mt-1 text-sm text-ink-2">
          Why this task scored {priority.score}/100.
        </p>

        <div className="mt-6 space-y-5">
          {priority.factors.map((factor) => (
            <div key={factor.label}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium text-ink">{factor.label}</span>
                <span className="text-xs text-ink-2">
                  {factor.value}/{factor.max} · {factor.note}
                </span>
              </div>
              <ProgressBar
                className="mt-2"
                value={(factor.value / factor.max) * 100}
                tone="slate"
              />
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this task?"
      >
        <p className="text-sm text-ink-2">
          This cannot be undone. The task will be removed from your list and
          priorities.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-high hover:bg-[#DC2626]"
            disabled={busy}
            onClick={handleDelete}
          >
            {busy ? "Deleting…" : "Delete task"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
