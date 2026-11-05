export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type ScheduleClass = {
  id: string;
  subject: string;
  day: Weekday;
  start: string;
  end: string;
  room?: string;
  kind?: "class" | "study";
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

// Temporary data source until the Express API is connected.
const SCHEDULE: ScheduleClass[] = [
  { id: "c1", subject: "Web Development", day: "Mon", start: "08:00", end: "10:00", room: "Lab 1" },
  { id: "c2", subject: "Programming", day: "Mon", start: "13:00", end: "14:30", room: "Room 108" },
  { id: "c3", subject: "Database Mgmt", day: "Tue", start: "10:00", end: "12:00", room: "Room 204" },
  { id: "c4", subject: "Human-Computer Interaction", day: "Tue", start: "15:00", end: "16:00" },
  { id: "c5", subject: "Web Development", day: "Wed", start: "08:00", end: "10:00", room: "Lab 1" },
  { id: "c6", subject: "Study: Web Dev Project", day: "Wed", start: "10:00", end: "12:00", room: "Recommended", kind: "study" },
  { id: "c7", subject: "Database Mgmt", day: "Wed", start: "13:00", end: "15:00", room: "Room 204" },
  { id: "c8", subject: "Networking", day: "Wed", start: "16:00", end: "17:00" },
  { id: "c9", subject: "Networking", day: "Thu", start: "09:00", end: "11:00", room: "Lab 2" },
  { id: "c10", subject: "Programming", day: "Thu", start: "14:00", end: "16:00", room: "Room 108" },
  { id: "c11", subject: "Database Mgmt", day: "Fri", start: "08:00", end: "10:00", room: "Room 204" },
];

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

export async function getScheduleService(): Promise<ScheduleClass[]> {
  return SCHEDULE;
}

export async function getImportPreviewService(): Promise<ImportedClass[]> {
  return IMPORT_PREVIEW;
}
