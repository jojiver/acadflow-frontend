export type Difficulty = "Easy" | "Medium" | "Hard";
export type Importance = "Low" | "Medium" | "High";
export type PriorityLevel = "High" | "Medium" | "Low";
export type TaskStatus =
  | "Not started"
  | "In progress"
  | "Almost done"
  | "Completed";

export type TaskStep = {
  id: string;
  label: string;
  done: boolean;
};

export type PriorityFactor = {
  label: string;
  value: number;
  max: number;
  note: string;
};

export type Priority = {
  score: number;
  level: PriorityLevel;
  daysRemaining: number;
  factors: PriorityFactor[];
};

export type Task = {
  id: string;
  title: string;
  subject: string;
  subjectId?: string | null;
  type: string;
  deadline: string;
  estimatedHours: number;
  difficulty: Difficulty;
  importance: Importance;
  progress: number;
  description?: string;
  status?: TaskStatus;
  steps?: TaskStep[];
  completedAt?: string;
  priority: Priority;
};

export function deadlineNote(daysRemaining: number): string {
  if (daysRemaining < 0) return `${Math.abs(daysRemaining)}d overdue`;
  if (daysRemaining === 0) return "Due today";
  if (daysRemaining === 1) return "Due tomorrow";
  return `Due in ${daysRemaining}d`;
}

// UI preview only; the backend recomputes progress when the task is saved.
export function progressFromSteps(steps: TaskStep[]): number {
  if (steps.length === 0) return 0;
  const done = steps.filter((step) => step.done).length;
  return Math.round((done / steps.length) * 100);
}
