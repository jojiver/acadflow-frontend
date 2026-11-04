import { mockTasks } from "@/lib/mock-tasks";
import type { Task } from "@/lib/priority";

// Temporary data source until the Laravel API is ready.
// Replace the body with:
//   const response = await http.get("/tasks");
//   return response.data.data.tasks as Task[];
export async function getTasksService(): Promise<Task[]> {
  return mockTasks;
}
