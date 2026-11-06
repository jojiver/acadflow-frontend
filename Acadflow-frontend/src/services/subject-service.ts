import { http } from "@/lib/axios";

export type SubjectPriority = "High" | "Medium" | "Low";
export type SubjectCategory = "Core" | "Elective" | "Archived";

export type Subject = {
  id: string;
  name: string;
  instructor?: string | null;
  room?: string | null;
  schedule?: string | null;
  category: SubjectCategory;
  tasks: number;
  dueNow: number;
  progress: number;
  priority: SubjectPriority;
};

export type SubjectInput = {
  name: string;
  instructor?: string;
  room?: string;
  schedule?: string;
  category: SubjectCategory;
};

export async function getSubjectsService(): Promise<Subject[]> {
  const response = await http.get("/subjects/v1/get-subjects");
  return response.data.data.subjects as Subject[];
}

export async function createSubjectService(
  input: SubjectInput,
): Promise<Subject> {
  const response = await http.post("/subjects/v1/create-subject", input);
  return response.data.data.subject as Subject;
}

export async function updateSubjectService(
  id: string,
  input: SubjectInput,
): Promise<Subject> {
  const response = await http.post(`/subjects/v1/update-subject/${id}`, input);
  return response.data.data.subject as Subject;
}

export async function deleteSubjectService(id: string): Promise<void> {
  await http.post(`/subjects/v1/delete-subject/${id}`, {});
}
