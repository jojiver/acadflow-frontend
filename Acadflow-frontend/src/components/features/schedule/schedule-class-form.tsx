import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/errors";
import { createScheduleService } from "@/services/schedule-service";
import type { Weekday } from "@/services/schedule-service";
import { getSubjectsService } from "@/services/subject-service";

const DAYS: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type ScheduleClassFormProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function ScheduleClassForm({
  open,
  onClose,
  onCreated,
}: ScheduleClassFormProps) {
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [day, setDay] = useState<Weekday>("Mon");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [room, setRoom] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    let active = true;

    getSubjectsService()
      .then((list) => {
        if (active) {
          setSubjects(list.map((item) => ({ id: item.id, name: item.name })));
          setSubjectId((current) => current || list[0]?.id || "");
        }
      })
      .catch(() => {
        // No subjects loaded; the form shows a hint instead.
      });

    return () => {
      active = false;
    };
  }, [open]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!subjectId) {
      setError("Create a subject first, then add its class schedule.");
      return;
    }

    if (endTime <= startTime) {
      setError("End time must be after start time.");
      return;
    }

    setBusy(true);
    try {
      await createScheduleService({
        subjectId,
        day,
        startTime,
        endTime,
        room: room.trim() || undefined,
      });
      setRoom("");
      onCreated();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add class">
      <form onSubmit={handleSubmit} className="space-y-4">
        {subjects.length === 0 && (
          <p className="rounded-lg bg-brand-tint p-3 text-sm text-ink-2">
            You have no subjects yet. Add a subject first, then create its class
            schedule.
          </p>
        )}

        <div>
          <Label htmlFor="class-subject">Subject</Label>
          <Select
            id="class-subject"
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
            disabled={subjects.length === 0}
          >
            {subjects.length === 0 && <option value="">No subjects yet</option>}
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="class-day">Day</Label>
          <Select
            id="class-day"
            value={day}
            onChange={(event) => setDay(event.target.value as Weekday)}
          >
            {DAYS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="class-start">Start time</Label>
            <Input
              id="class-start"
              type="time"
              required
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="class-end">End time</Label>
            <Input
              id="class-end"
              type="time"
              required
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="class-room">Room (optional)</Label>
          <Input
            id="class-room"
            value={room}
            onChange={(event) => setRoom(event.target.value)}
            placeholder="Lab 1"
          />
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
          <Button type="submit" disabled={busy || subjects.length === 0}>
            {busy ? "Saving…" : "Add class"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
