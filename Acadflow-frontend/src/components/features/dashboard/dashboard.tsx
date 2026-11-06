import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/errors";
import { deadlineNote } from "@/lib/priority";
import type { PriorityLevel, Task } from "@/lib/priority";
import {
  deleteTaskService,
  getProductivityService,
  getTasksService,
  updateTaskService,
} from "@/services/task-service";
import type { Productivity, TaskInput } from "@/services/task-service";

const LEVEL_VARIANT: Record<PriorityLevel, "high" | "medium" | "low"> = {
  High: "high",
  Medium: "medium",
  Low: "low",
};

const TONE: Record<PriorityLevel, "rose" | "amber" | "emerald"> = {
  High: "rose",
  Medium: "amber",
  Low: "emerald",
};

const XP_PER_LEVEL = 500;

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

function ProgressRing({ value }: { value: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * Math.min(100, value)) / 100;

  return (
    <div className="relative grid size-28 place-items-center">
      <svg viewBox="0 0 100 100" className="size-28 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#273444"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-bold text-ink">{Math.round(value)}%</p>
        <p className="text-[10px] tracking-wide text-ink-3 uppercase">done</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [week, setWeek] = useState<Productivity | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(function fetchWeeklyProductivity() {
    let active = true;

    getProductivityService("week")
      .then((result) => {
        if (active) setWeek(result);
      })
      .catch(() => {
        if (active) setWeek(null);
      });

    return () => {
      active = false;
    };
  }, []);

  async function refresh() {
    const result = await getTasksService();
    setTasks(result);
  }

  async function markDone(task: Task) {
    setSavingId(task.id);
    setError("");
    try {
      await updateTaskService(task.id, {
        ...toInput(task),
        progress: 100,
        status: "Completed",
        steps: (task.steps ?? []).map((step) => ({ ...step, done: true })),
      });
      await refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSavingId(null);
    }
  }

  async function removeTask(id: string) {
    setBusy(true);
    setError("");
    try {
      await deleteTaskService(id);
      setConfirmId(null);
      await refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  const ranked = useMemo(
    () =>
      (tasks ?? [])
        .map((task) => ({ task, priority: task.priority }))
        .sort((a, b) => b.priority.score - a.priority.score),
    [tasks],
  );

  const active = ranked.filter(
    (item) => !item.task.completedAt && item.task.progress < 100,
  );
  const next = active[0];

  const completed = (tasks ?? []).filter((task) => task.completedAt);
  const overall = tasks?.length
    ? Math.round(
        tasks.reduce(
          (sum, task) =>
            sum + (task.completedAt ? 100 : Math.min(100, task.progress)),
          0,
        ) / tasks.length,
      )
    : 0;

  const xp = completed.reduce(
    (sum, task) => sum + 100 + Math.round(task.estimatedHours * 10),
    0,
  );
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const intoLevel = xp % XP_PER_LEVEL;

  const dueSoon = active.filter(
    (item) =>
      item.priority.daysRemaining >= 0 && item.priority.daysRemaining <= 7,
  ).length;
  const highPriority = active.filter(
    (item) => item.priority.level === "High",
  ).length;

  if (tasks === null) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="text-sm text-high">
          {error}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6">
          <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
            Your progression
          </p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-ink">Level {level}</p>
              <p className="mt-1 text-sm text-ink-2">
                {completed.length} task{completed.length === 1 ? "" : "s"}{" "}
                completed
              </p>
            </div>
            <span className="rounded-full bg-brand-dark px-3 py-1 text-xs font-semibold text-white">
              {xp} XP
            </span>
          </div>
          <ProgressBar className="mt-4" value={(intoLevel / XP_PER_LEVEL) * 100} tone="slate" />
          <p className="mt-2 text-xs text-ink-3">
            {intoLevel} / {XP_PER_LEVEL} XP to Level {level + 1}
          </p>
        </Card>

        <Card className="flex items-center gap-5 p-6">
          <ProgressRing value={overall} />
          <div>
            <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
              Overall progress
            </p>
            <p className="mt-2 text-sm text-ink-2">
              {completed.length} of {tasks.length} tasks done
            </p>
            <p className="mt-1 text-xs text-ink-3">
              {tasks.length - completed.length} still to finish
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
            This week
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <MiniStat label="Done" value={week?.completed ?? 0} />
            <MiniStat label="Hours" value={`${week?.hours ?? 0}h`} />
            <MiniStat label="Due soon" value={dueSoon} />
          </div>
          <p className="mt-3 text-xs text-ink-3">
            {highPriority} high-priority task
            {highPriority === 1 ? "" : "s"} need attention
          </p>
        </Card>
      </div>

      {next ? (
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
                Next recommended task
              </p>
              <h2 className="mt-1.5 text-xl font-semibold text-ink">
                {next.task.title}
              </h2>
              <p className="mt-1 text-sm text-ink-2">
                {next.task.subject} ·{" "}
                {deadlineNote(next.priority.daysRemaining)}
                {next.task.steps && next.task.steps.length > 0
                  ? ` · ${next.task.steps.filter((step) => step.done).length}/${next.task.steps.length} steps`
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={LEVEL_VARIANT[next.priority.level]}>
                {next.priority.score}/100
              </Badge>
              <Button onClick={() => navigate(`/user/tasks/${next.task.id}`)}>
                Continue →
              </Button>
            </div>
          </div>

          <ProgressBar
            className="mt-4"
            value={next.task.progress}
            tone={TONE[next.priority.level]}
            label="Progress"
            showValue
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              className="h-10"
              onClick={() => navigate(`/user/tasks/${next.task.id}/edit`)}
            >
              Edit task
            </Button>
            <Button
              className="h-10 bg-low hover:bg-[#16a34a]"
              disabled={savingId === next.task.id}
              onClick={() => markDone(next.task)}
            >
              {savingId === next.task.id ? "Saving…" : "Mark as done"}
            </Button>
          </div>
        </Card>
      ) : (
        <EmptyState
          title="Everything is done"
          description="You have no active tasks. Add a new one to keep your progression going."
          action={
            <Button onClick={() => navigate("/user/tasks/create")}>
              + New task
            </Button>
          }
        />
      )}

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">Your tasks</h2>
            <p className="mt-1 text-sm text-ink-2">
              Open, edit, finish, or remove work from here.
            </p>
          </div>
          <Link
            to="/user/tasks"
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            View all and filter →
          </Link>
        </div>

        {active.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-line px-6 py-10 text-center text-sm text-ink-3">
            No active tasks right now.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {active.map(({ task, priority }) => (
              <li key={task.id} className="py-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/user/tasks/${task.id}`}
                        className="truncate font-semibold text-ink hover:text-brand"
                      >
                        {task.title}
                      </Link>
                      <Badge variant={LEVEL_VARIANT[priority.level]}>
                        {priority.level}
                      </Badge>
                      <span className="text-xs text-ink-3">
                        {task.status ?? "In progress"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-2">
                      {task.subject} · {task.type} ·{" "}
                      {deadlineNote(priority.daysRemaining)}
                      {task.steps && task.steps.length > 0
                        ? ` · ${task.steps.filter((step) => step.done).length}/${task.steps.length} steps`
                        : ""}
                    </p>
                    <ProgressBar
                      className="mt-2 max-w-md"
                      value={task.progress}
                      tone={TONE[priority.level]}
                      showValue
                    />
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      className="h-9 px-3 text-xs"
                      onClick={() => navigate(`/user/tasks/${task.id}`)}
                    >
                      Open
                    </Button>
                    <Button
                      variant="tertiary"
                      className="h-9 px-2 text-xs"
                      onClick={() => navigate(`/user/tasks/${task.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <button
                      type="button"
                      disabled={savingId === task.id}
                      onClick={() => markDone(task)}
                      className="h-9 cursor-pointer rounded-xl bg-[#DCFCE7] px-3 text-xs font-semibold text-low transition-colors hover:bg-[#bbf7d0] disabled:cursor-wait disabled:opacity-50"
                    >
                      {savingId === task.id ? "Saving…" : "Mark done"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(task.id)}
                      className="h-9 cursor-pointer rounded-xl px-2 text-xs font-semibold text-high transition-colors hover:bg-[#FEE2E2]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete this task?"
      >
        <p className="text-sm text-ink-2">
          This cannot be undone. The task will be removed from your list and
          priorities.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            className="bg-high hover:bg-[#DC2626]"
            disabled={busy}
            onClick={() => confirmId && removeTask(confirmId)}
          >
            {busy ? "Deleting…" : "Delete task"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-brand-tint p-3">
      <p className="text-lg font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-2">{label}</p>
    </div>
  );
}
