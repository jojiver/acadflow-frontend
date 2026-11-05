import { useState } from "react";
import type { SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import type {
  Subject,
  SubjectCategory,
  SubjectInput,
  SubjectPriority,
} from "@/services/subject-service";

const PRIORITIES: SubjectPriority[] = ["Low", "Medium", "High"];
const CATEGORIES: SubjectCategory[] = ["Core", "Elective", "Archived"];

type SubjectFormProps = {
  open: boolean;
  initial: Subject | null;
  busy: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (input: SubjectInput) => void;
};

export function SubjectForm({
  open,
  initial,
  busy,
  error,
  onClose,
  onSubmit,
}: SubjectFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [instructor, setInstructor] = useState(initial?.instructor ?? "");
  const [room, setRoom] = useState(initial?.room ?? "");
  const [schedule, setSchedule] = useState(initial?.schedule ?? "");
  const [tasks, setTasks] = useState(initial?.tasks ?? 0);
  const [dueNow, setDueNow] = useState(initial?.dueNow ?? 0);
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [priority, setPriority] = useState<SubjectPriority>(
    initial?.priority ?? "Medium",
  );
  const [category, setCategory] = useState<SubjectCategory>(
    initial?.category ?? "Core",
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      name: name.trim(),
      instructor: instructor.trim(),
      room: room.trim(),
      schedule: schedule.trim(),
      tasks: Number(tasks),
      dueNow: Number(dueNow),
      progress: Math.min(100, Math.max(0, Number(progress))),
      priority,
      category,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit subject" : "New subject"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="subject-name">Subject name</Label>
          <Input
            id="subject-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Web Development"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="subject-instructor">Instructor</Label>
            <Input
              id="subject-instructor"
              value={instructor}
              onChange={(event) => setInstructor(event.target.value)}
              placeholder="Prof. Reyes"
            />
          </div>
          <div>
            <Label htmlFor="subject-room">Room</Label>
            <Input
              id="subject-room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              placeholder="Lab 1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subject-schedule">Schedule</Label>
          <Input
            id="subject-schedule"
            value={schedule}
            onChange={(event) => setSchedule(event.target.value)}
            placeholder="Mon 8–10"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="subject-tasks">Tasks</Label>
            <Input
              id="subject-tasks"
              type="number"
              min={0}
              value={tasks}
              onChange={(event) => setTasks(Number(event.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="subject-due">Due now</Label>
            <Input
              id="subject-due"
              type="number"
              min={0}
              value={dueNow}
              onChange={(event) => setDueNow(Number(event.target.value))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subject-progress">Progress (%)</Label>
          <Input
            id="subject-progress"
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(event) => setProgress(Number(event.target.value))}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="subject-priority">Priority</Label>
            <Select
              id="subject-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as SubjectPriority)
              }
            >
              {PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="subject-category">Category</Label>
            <Select
              id="subject-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as SubjectCategory)
              }
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-high">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : initial ? "Save changes" : "Create subject"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
