import { mockTasks } from "@/lib/mock-tasks";
import { progressFromSteps } from "@/lib/priority";
import type {
  Difficulty,
  Importance,
  Task,
  TaskStatus,
  TaskStep,
} from "@/lib/priority";

export type TaskInput = {
  title: string;
  subject: string;
  type: string;
  deadline: string;
  estimatedHours: number;
  difficulty: Difficulty;
  importance: Importance;
  progress: number;
  description: string;
  status: TaskStatus;
  steps: TaskStep[];
};

// Temporary in-memory store until the Express API is connected.
// Swap each body for the matching http call (GET/POST/PUT/DELETE /tasks).
let store: Task[] = mockTasks.map((task) => ({ ...task }));

function effectiveProgress(input: TaskInput): number {
  return input.steps.length > 0
    ? progressFromSteps(input.steps)
    : input.progress;
}

function completion(
  progress: number,
  status: TaskStatus,
): Pick<Task, "completedAt"> {
  const done = status === "Completed" || progress >= 100;
  return done
    ? { completedAt: new Date().toISOString() }
    : { completedAt: undefined };
}

export async function getTasksService(): Promise<Task[]> {
  return store.map((task) => ({ ...task }));
}

export async function getTaskService(id: string): Promise<Task> {
  const task = store.find((item) => item.id === id);
  if (!task) throw new Error("Task not found.");
  return { ...task };
}

export async function createTaskService(input: TaskInput): Promise<Task> {
  const progress = effectiveProgress(input);
  const task: Task = {
    id: crypto.randomUUID(),
    ...input,
    progress,
    ...completion(progress, input.status),
  };
  store = [task, ...store];
  return { ...task };
}

export async function updateTaskService(
  id: string,
  input: TaskInput,
): Promise<Task> {
  const existing = store.find((item) => item.id === id);
  if (!existing) throw new Error("Task not found.");

  const progress = effectiveProgress(input);
  const updated: Task = {
    ...existing,
    ...input,
    progress,
    ...completion(progress, input.status),
  };
  store = store.map((item) => (item.id === id ? updated : item));
  return { ...updated };
}

export async function deleteTaskService(id: string): Promise<void> {
  store = store.filter((item) => item.id !== id);
}
