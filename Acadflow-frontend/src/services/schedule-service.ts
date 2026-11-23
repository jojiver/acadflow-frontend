import { http } from "@/lib/axios";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export type ScheduleClass = {
  id: string;
  subjectId: string;
  subject: string;
  day: Weekday;
  start: string;
  end: string;
  room?: string;
};

export type Confidence = "High" | "Medium" | "Low";

export type ImportedClass = {
  id: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  time: string;
  room?: string | null;
  confidence: Confidence;
  note?: string | null;
  conflict?: boolean;
  selected: boolean;
};

export type ImportSummary = {
  classes: number;
  subjects: number;
  conflicts: number;
  duplicates: number;
};

export type ImportSource = {
  name: string;
  size: number;
  type: string | null;
};

export type ImportPreviewResult = {
  classes: ImportedClass[];
  summary: ImportSummary;
  source: ImportSource;
};

export type ImportConfirmResult = {
  created: number;
  skipped: number;
  subjectsCreated: number;
};

type ApiSchedule = {
  id: string;
  subjectId: string;
  subjectName: string | null;
  day: Weekday;
  startTime: string;
  endTime: string;
  room: string | null;
};

export type ScheduleInput = {
  subjectId: string;
  day: Weekday;
  startTime: string;
  endTime: string;
  room?: string;
};

/** Fetches the schedule list from the API. */
export async function getScheduleService(): Promise<ScheduleClass[]> {
  const response = await http.get("/schedules/v1/get-schedules");
  return (response.data.data.schedules as ApiSchedule[]).map((item) => ({
    id: item.id,
    subjectId: item.subjectId,
    subject: item.subjectName ?? "Class",
    day: item.day,
    start: item.startTime,
    end: item.endTime,
    room: item.room ?? undefined,
  }));
}

/** Creates a class schedule through the API. */
export async function createScheduleService(input: ScheduleInput) {
  const response = await http.post("/schedules/v1/create-schedule", input);
  return response.data.data.schedule as { id: string };
}

/** Updates a class schedule through the API. */
export async function updateScheduleService(
  id: string,
  input: ScheduleInput,
) {
  const response = await http.post(`/schedules/v1/update-schedule/${id}`, input);
  return response.data.data.schedule as { id: string };
}

/** Deletes a class schedule through the API. */
export async function deleteScheduleService(id: string): Promise<void> {
  await http.post(`/schedules/v1/delete-schedule/${id}`, {});
}

/** Uploads a timetable and returns the import preview. */
export async function previewScheduleImportService(
  file: File,
): Promise<ImportPreviewResult> {
  const form = new FormData();
  form.append("file", file);

  const response = await http.post("/schedules/v1/import", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data as ImportPreviewResult;
}

/** Saves the selected imported classes. */
export async function confirmScheduleImportService(
  classes: ImportedClass[],
): Promise<ImportConfirmResult> {
  const response = await http.post("/schedules/v1/import/confirm", {
    classes: classes.map((item) => ({
      subject: item.subject,
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room ?? null,
      selected: item.selected,
    })),
  });

  return response.data.data as ImportConfirmResult;
}
