import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/errors";
import type { Task } from "@/lib/priority";
import {
  deleteTaskService,
  getTaskService,
  updateTaskService,
} from "@/services/task-service";
import type { TaskInput } from "@/services/task-service";
import { TaskForm } from "./task-form";

export function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  async function handleSubmit(input: TaskInput) {
    if (!id) return;

    setBusy(true);
    setError("");
    try {
      await updateTaskService(id, input);
      navigate(`/user/tasks/${id}`, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

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
    return <Skeleton className="h-[660px] rounded-2xl" />;
  }

  return (
    <>
      <TaskForm
        heading="Edit task"
        description="Update the task details; priority is re-scored automatically."
        initial={task}
        submitLabel="Save changes"
        helperText="Changes are reflected in your schedule and weekly workload."
        busy={busy}
        error={error}
        onSubmit={handleSubmit}
        onDelete={() => setConfirmOpen(true)}
      />

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
    </>
  );
}
