import { http } from "@/lib/axios";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type ScheduleClass = {
  id: string;
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
  time: string;
  room: string;
  confidence: Confidence;
  note?: string;
  conflict?: boolean;
  selected: boolean;
};

type ApiSchedule = {
  id: string;
  subjectName: string | null;
  day: Weekday;
  startTime: string;
  endTime: string;
  room: string | null;
};

export async function getScheduleService(): Promise<ScheduleClass[]> {
  const response = await http.get("/schedules/v1/get-schedules");
  return (response.data.data.schedules as ApiSchedule[]).map((item) => ({
    id: item.id,
    subject: item.subjectName ?? "Class",
    day: item.day,
    start: item.startTime,
    end: item.endTime,
    room: item.room ?? undefined,
  }));
}

// Design-only preview for the import review screen. Upload/extraction is not
// implemented yet, so this sample stays until the backend import endpoint exists.
const IMPORT_PREVIEW: ImportedClass[] = [
  { id: "i1", subject: "Web Development", day: "Mon, Wed", time: "8:00 – 10:00 AM", room: "Lab 1", confidence: "High", selected: true },
  { id: "i2", subject: "Database Mgmt", day: "Tue, Fri", time: "10:00 – 12:00 PM", room: "Room 204", confidence: "High", selected: true },
  { id: "i3", subject: "Networking", day: "Thu", time: "9:00 – 11:00 AM", room: "Lab 2", confidence: "High", selected: true },
  { id: "i4", subject: "Programming", day: "Mon", time: "1:00 – 2:30 PM", room: "Room 108", confidence: "Medium", selected: true },
  { id: "i5", subject: "Human-Computer Interaction", day: "Tue", time: "3:00 – 4:00 PM", room: "Room 305", confidence: "Medium", selected: true },
  { id: "i6", subject: "Programming", day: "Thu", time: "2:00 – 4:00 PM", room: "Room 108", confidence: "Low", note: "Matches an existing class already in your schedule", selected: false },
  { id: "i7", subject: "Web Development", day: "Wed", time: "1:00 – 3:00 PM", room: "Lab 1", confidence: "Medium", note: "Overlaps Database Mgmt · Wed 1:00 – 3:00 PM", conflict: true, selected: true },
  { id: "i8", subject: "Web Development", day: "Fri", time: "11:00 AM – 12:30 PM", room: "Lab 1", confidence: "Medium", selected: true },
  { id: "i9", subject: "Networking", day: "Tue", time: "1:00 – 2:30 PM", room: "Room 210", confidence: "Medium", selected: true },
  { id: "i10", subject: "Database Mgmt", day: "Wed", time: "4:00 – 5:30 PM", room: "Room 204", confidence: "Medium", selected: true },
];

export async function getImportPreviewService(): Promise<ImportedClass[]> {
  return IMPORT_PREVIEW;
}
