import { http } from "@/lib/axios";
import type {
  Difficulty,
  Importance,
  Priority,
  Task,
  TaskStatus,
  TaskStep,
} from "@/lib/priority";

export type TaskInput = {
  title: string;
  subjectId: string | null;
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

type ApiStep = {
  id: string;
  label: string;
  done: boolean;
};

type ApiTask = {
  id: string;
  title: string;
  subjectId: string | null;
  subjectName: string | null;
  type: string;
  description: string | null;
  deadline: string;
  estimatedHours: number;
  difficulty: Difficulty;
  importance: Importance;
  progress: number;
  status: TaskStatus;
  completedAt: string | null;
  steps: ApiStep[];
  priority: Priority;
};

/** Maps the API task shape to the frontend task model. */
function mapTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    subject: task.subjectName ?? "General",
    subjectId: task.subjectId,
    type: task.type,
    deadline: task.deadline,
    estimatedHours: task.estimatedHours,
    difficulty: task.difficulty,
    importance: task.importance,
    progress: task.progress,
    description: task.description ?? undefined,
    status: task.status,
    steps: (task.steps ?? []).map((step) => ({
      id: step.id,
      label: step.label,
      done: step.done,
    })),
    completedAt: task.completedAt ?? undefined,
    priority: task.priority,
  };
}

export type Productivity = {
  period: "today" | "week" | "month";
  completed: number;
  hours: number;
  open: number;
  rate: number;
  completedTasks: Task[];
};

/** Fetches all tasks for the current user. */
export async function getTasksService(): Promise<Task[]> {
  const response = await http.get("/tasks/v1/get-tasks");
  return (response.data.data.tasks as ApiTask[]).map(mapTask);
}

/** Fetches one task by id. */
export async function getTaskService(id: string): Promise<Task> {
  const response = await http.get(`/tasks/v1/get-task/${id}`);
  return mapTask(response.data.data.task as ApiTask);
}

/** Creates a task through the API. */
export async function createTaskService(input: TaskInput): Promise<Task> {
  const response = await http.post("/tasks/v1/create-task", input);
  return mapTask(response.data.data.task as ApiTask);
}

/** Updates a task through the API. */
export async function updateTaskService(
  id: string,
  input: TaskInput,
): Promise<Task> {
  const response = await http.post(`/tasks/v1/update-task/${id}`, input);
  return mapTask(response.data.data.task as ApiTask);
}

/** Deletes a task through the API. */
export async function deleteTaskService(id: string): Promise<void> {
  await http.post(`/tasks/v1/delete-task/${id}`, {});
}

/** Fetches productivity statistics for a period. */
export async function getProductivityService(
  period: "today" | "week" | "month",
): Promise<Productivity> {
  const response = await http.get("/tasks/v1/productivity", {
    params: { period },
  });
  const data = response.data.data;
  return {
    period: data.period,
    completed: data.completed,
    hours: data.hours,
    open: data.open,
    rate: data.rate,
    completedTasks: (data.completedTasks as ApiTask[]).map(mapTask),
  };
}
