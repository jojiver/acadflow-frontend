import { useState } from "react";
import { useNavigate } from "react-router";
import { getErrorMessage } from "@/lib/errors";
import { createTaskService } from "@/services/task-service";
import type { TaskInput } from "@/services/task-service";
import { TaskForm } from "./task-form";

export function TaskCreate() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(input: TaskInput) {
    setBusy(true);
    setError("");

    try {
      const task = await createTaskService(input);
      navigate(`/user/tasks/${task.id}`, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <TaskForm
      heading="Add new task"
      description="Create a task for a specific subject. AcadFlow scores its priority automatically from deadline, workload, difficulty, importance and progress."
      submitLabel="Add task"
      helperText="This task will be added to your schedule and reflected in your weekly workload."
      busy={busy}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
