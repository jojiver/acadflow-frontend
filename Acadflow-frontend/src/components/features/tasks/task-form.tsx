import { useEffect, useState } from "react";
import type { ReactNode, SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { progressFromSteps } from "@/lib/priority";
import type {
  Difficulty,
  Importance,
  Task,
  TaskStatus,
  TaskStep,
} from "@/lib/priority";
import { getSubjectsService } from "@/services/subject-service";
import type { TaskInput } from "@/services/task-service";

const TASK_TYPES = [
  "Assignment",
  "Project",
  "Exam",
  "Quiz",
  "Presentation",
  "Research Paper",
  "Laboratory",
  "Activity",
  "Thesis/Capstone",
  "Other",
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const IMPORTANCES: Importance[] = ["Low", "Medium", "High"];
const STATUSES: TaskStatus[] = [
  "Not started",
  "In progress",
  "Almost done",
  "Completed",
];

const IMPORTANCE_TONE = {
  Low: "low",
  Medium: "medium",
  High: "high",
} as const;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toLocalValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultDeadline() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setHours(23, 59, 0, 0);
  return toLocalValue(date);
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label
        htmlFor={htmlFor}
        className="mb-1.5 text-[11px] font-bold tracking-[0.06em] text-ink-3"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

type BadgeSelectProps<T extends string> = {
  id: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  placeholder: string;
  toneFor?: (value: T) => "default" | "high" | "medium" | "low";
};

function BadgeSelect<T extends string>({
  id,
  value,
  options,
  onChange,
  placeholder,
  toneFor,
}: BadgeSelectProps<T>) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="flex h-[42px] items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[15px]">
        <Badge variant={toneFor ? toneFor(value) : "default"}>{value}</Badge>
        <span className="truncate text-ink-3">{placeholder}</span>
        <span className="ml-auto text-ink-3">▾</span>
      </div>
    </div>
  );
}

type TaskFormProps = {
  heading: string;
  description: string;
  initial?: Task;
  submitLabel: string;
  helperText: string;
  busy: boolean;
  error: string;
  onSubmit: (input: TaskInput) => void;
  onDelete?: () => void;
};

export function TaskForm({
  heading,
  description,
  initial,
  submitLabel,
  helperText,
  busy,
  error,
  onSubmit,
  onDelete,
}: TaskFormProps) {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? "");

  useEffect(() => {
    let active = true;

    getSubjectsService()
      .then((list) => {
        if (active) {
          setSubjects(list.map((item) => ({ id: item.id, name: item.name })));
        }
      })
      .catch(() => {
        // The subject select stays on "General" when subjects cannot load.
      });

    return () => {
      active = false;
    };
  }, []);
  const [importance, setImportance] = useState<Importance>(
    initial?.importance ?? "Medium",
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [deadline, setDeadline] = useState(
    initial?.deadline
      ? toLocalValue(new Date(initial.deadline))
      : defaultDeadline(),
  );
  const [estimatedHours, setEstimatedHours] = useState(
    initial?.estimatedHours ?? 2.5,
  );
  const [status, setStatus] = useState<TaskStatus>(
    initial?.status ?? "Not started",
  );
  const [type, setType] = useState(initial?.type ?? "Assignment");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initial?.difficulty ?? "Medium",
  );
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [descriptionText, setDescriptionText] = useState(
    initial?.description ?? "",
  );
  const [steps, setSteps] = useState<TaskStep[]>(initial?.steps ?? []);
  const [newStep, setNewStep] = useState("");

  const stepsDone = steps.filter((step) => step.done).length;
  const stepsProgress = steps.length > 0 ? progressFromSteps(steps) : 0;

  function applySteps(next: TaskStep[]) {
    setSteps(next);
    if (next.length > 0) setProgress(progressFromSteps(next));
  }

  function addStep() {
    const label = newStep.trim();
    if (!label) return;
    applySteps([...steps, { id: crypto.randomUUID(), label, done: false }]);
    setNewStep("");
  }

  function toggleStep(stepId: string) {
    applySteps(
      steps.map((step) =>
        step.id === stepId ? { ...step, done: !step.done } : step,
      ),
    );
  }

  function removeStep(stepId: string) {
    applySteps(steps.filter((step) => step.id !== stepId));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      title: title.trim(),
      subjectId: subjectId || null,
      type,
      deadline: new Date(deadline).toISOString(),
      estimatedHours: Number(estimatedHours),
      difficulty,
      importance,
      progress: steps.length > 0 ? progressFromSteps(steps) : Number(progress),
      description: descriptionText.trim(),
      status,
      steps,
    });
  }

  return (
    <Card className="rounded-2xl p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-ink">{heading}</h2>
            <p className="mt-1.5 text-[13px] leading-[18px] text-ink-2">
              {description}
            </p>
          </header>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="SUBJECT" htmlFor="task-subject">
                <Select
                  id="task-subject"
                  className="h-[42px] rounded-lg px-3"
                  value={subjectId}
                  onChange={(event) => setSubjectId(event.target.value)}
                >
                  <option value="">General (no subject)</option>
                  {subjects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="IMPORTANCE" htmlFor="task-importance">
                <BadgeSelect
                  id="task-importance"
                  value={importance}
                  options={IMPORTANCES}
                  onChange={setImportance}
                  placeholder="Select importance"
                  toneFor={(value) => IMPORTANCE_TONE[value]}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="TASK TITLE" htmlFor="task-title">
                <Input
                  id="task-title"
                  required
                  className="h-[42px] rounded-lg px-3"
                  placeholder="Review ER diagram and normalize tables"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </Field>

              <Field label="DUE DATE" htmlFor="task-deadline">
                <Input
                  id="task-deadline"
                  type="datetime-local"
                  required
                  className="h-[42px] rounded-lg px-3"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="ESTIMATED STUDY TIME" htmlFor="task-hours">
                <div className="relative">
                  <Input
                    id="task-hours"
                    type="number"
                    min={0}
                    step={0.5}
                    required
                    className="h-[42px] rounded-lg px-3 pr-14"
                    value={estimatedHours}
                    onChange={(event) =>
                      setEstimatedHours(Number(event.target.value))
                    }
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-ink-3">
                    hours
                  </span>
                </div>
              </Field>

              <Field label="STATUS" htmlFor="task-status">
                <BadgeSelect
                  id="task-status"
                  value={status}
                  options={STATUSES}
                  onChange={setStatus}
                  placeholder="Select status"
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="TASK TYPE" htmlFor="task-type">
                <Select
                  id="task-type"
                  className="h-[42px] rounded-lg px-3"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  {TASK_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="DIFFICULTY" htmlFor="task-difficulty">
                <Select
                  id="task-difficulty"
                  className="h-[42px] rounded-lg px-3"
                  value={difficulty}
                  onChange={(event) =>
                    setDifficulty(event.target.value as Difficulty)
                  }
                >
                  {DIFFICULTIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="PROGRESS" htmlFor="task-progress">
                <div className="relative">
                  <Input
                    id="task-progress"
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    className="h-[42px] rounded-lg px-3 pr-8"
                    value={steps.length > 0 ? stepsProgress : progress}
                    disabled={steps.length > 0}
                    onChange={(event) =>
                      setProgress(Number(event.target.value))
                    }
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-ink-3">
                    %
                  </span>
                </div>
              </Field>
            </div>

            <Field label="TASK DETAILS" htmlFor="task-description">
              <Textarea
                id="task-description"
                className="min-h-[120px] rounded-lg px-3 py-3"
                placeholder="Review the latest ER diagram, normalize the tables to 3NF, and prepare a short explanation for the next class discussion."
                value={descriptionText}
                onChange={(event) => setDescriptionText(event.target.value)}
              />
            </Field>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="mb-0 text-[11px] font-bold tracking-[0.06em] text-ink-3">
                  STEPS
                </Label>
                <span className="text-xs text-ink-3">
                  {stepsDone}/{steps.length} done · {stepsProgress}%
                </span>
              </div>

              {steps.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {steps.map((step) => (
                    <li
                      key={step.id}
                      className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={step.done}
                        onChange={() => toggleStep(step.id)}
                        className="size-4 shrink-0 rounded border-line accent-brand"
                      />
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          step.done ? "text-ink-3 line-through" : "text-ink",
                        )}
                      >
                        {step.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="cursor-pointer text-xs text-ink-3 hover:text-high"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2 flex gap-2">
                <Input
                  value={newStep}
                  onChange={(event) => setNewStep(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addStep();
                    }
                  }}
                  placeholder="Add a step (e.g. Build the REST API)"
                  className="h-[42px] rounded-lg px-3"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="h-[42px] shrink-0 px-4"
                  onClick={addStep}
                >
                  Add step
                </Button>
              </div>
              {steps.length > 0 && (
                <p className="mt-1.5 text-xs text-ink-3">
                  Progress is calculated from completed steps.
                </p>
              )}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-high">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <p className="max-w-[420px] text-xs leading-[18px] text-ink-3">
              {helperText}
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="h-11 px-5"
                onClick={() => navigate("/user/tasks")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy} className="h-11 px-5">
                {busy ? "Saving…" : submitLabel}
              </Button>
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="ml-3 cursor-pointer text-sm font-semibold text-high hover:text-[#DC2626]"
                >
                  Delete task
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
