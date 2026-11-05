export type SubjectPriority = "High" | "Medium" | "Low";
export type SubjectCategory = "Core" | "Elective" | "Archived";

export type Subject = {
  id: string;
  name: string;
  instructor: string;
  room: string;
  schedule: string;
  tasks: number;
  dueNow: number;
  progress: number;
  priority: SubjectPriority;
  category: SubjectCategory;
};

export type SubjectInput = Omit<Subject, "id">;

export type UpcomingItem = {
  id: string;
  subject: string;
  detail: string;
  date: string;
};

const SUBJECTS: Subject[] = [
  {
    id: "sub1",
    name: "Web Development",
    instructor: "Prof. Reyes",
    room: "Lab 1",
    schedule: "Mon 8–10",
    tasks: 3,
    dueNow: 2,
    progress: 75,
    priority: "High",
    category: "Core",
  },
  {
    id: "sub2",
    name: "Database Mgmt",
    instructor: "Prof. Tan",
    room: "Rm 204",
    schedule: "Tue 10–12",
    tasks: 2,
    dueNow: 1,
    progress: 60,
    priority: "Medium",
    category: "Core",
  },
  {
    id: "sub3",
    name: "Networking",
    instructor: "Prof. Cruz",
    room: "Lab 2",
    schedule: "Wed 1–3",
    tasks: 2,
    dueNow: 0,
    progress: 40,
    priority: "Medium",
    category: "Elective",
  },
  {
    id: "sub4",
    name: "Programming",
    instructor: "Prof. Lim",
    room: "Rm 108",
    schedule: "Thu 2–4",
    tasks: 3,
    dueNow: 1,
    progress: 100,
    priority: "Low",
    category: "Elective",
  },
  {
    id: "sub5",
    name: "Data Structures",
    instructor: "Prof. Gomez",
    room: "Rm 112",
    schedule: "Fri 9–11",
    tasks: 5,
    dueNow: 0,
    progress: 0,
    priority: "Low",
    category: "Archived",
  },
  {
    id: "sub6",
    name: "HCI",
    instructor: "Prof. Santos",
    room: "Lab 3",
    schedule: "Fri 1–3",
    tasks: 4,
    dueNow: 0,
    progress: 30,
    priority: "Medium",
    category: "Core",
  },
];

export const subjectUpcoming: UpcomingItem[] = [
  {
    id: "u1",
    subject: "Web Development",
    detail: "Milestone 2 due today",
    date: "Today",
  },
  {
    id: "u2",
    subject: "Database Mgmt",
    detail: "ER diagram due Oct 10",
    date: "Oct 10",
  },
  {
    id: "u3",
    subject: "Networking",
    detail: "Lab review due Oct 11",
    date: "Oct 11",
  },
  {
    id: "u4",
    subject: "Web Development",
    detail: "Wireframe due Oct 12",
    date: "Oct 12",
  },
  {
    id: "u5",
    subject: "HCI",
    detail: "Group presentation due today",
    date: "Today",
  },
];

// Temporary in-memory store until the Express API is connected.
let store: Subject[] = SUBJECTS.map((subject) => ({ ...subject }));

export async function getSubjectsService(): Promise<Subject[]> {
  return store.map((subject) => ({ ...subject }));
}

export async function createSubjectService(
  input: SubjectInput,
): Promise<Subject> {
  const subject: Subject = { id: crypto.randomUUID(), ...input };
  store = [subject, ...store];
  return { ...subject };
}

export async function updateSubjectService(
  id: string,
  input: SubjectInput,
): Promise<Subject> {
  const existing = store.find((subject) => subject.id === id);
  if (!existing) throw new Error("Subject not found.");

  const updated: Subject = { ...existing, ...input };
  store = store.map((subject) => (subject.id === id ? updated : subject));
  return { ...updated };
}

export async function deleteSubjectService(id: string): Promise<void> {
  store = store.filter((subject) => subject.id !== id);
}
