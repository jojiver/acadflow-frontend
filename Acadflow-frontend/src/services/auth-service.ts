import { clearCsrfToken, ensureCsrfToken, http } from "@/lib/axios";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  studentId?: string | null;
  program?: string | null;
  yearLevel?: string | null;
};

export type SignupInput = {
  name: string;
  studentId: string;
  email: string;
  program: string;
  yearLevel: string;
  password: string;
};

async function getSessionService() {
  const response = await http.get("/auth/v1/session");
  return response.data.data.user as User;
}

export async function loginService(email: string, password: string) {
  await ensureCsrfToken();
  await http.post("/auth/v1/login", { email, password });
  await ensureCsrfToken();
  return getSessionService();
}

export async function signupService(input: SignupInput) {
  await ensureCsrfToken();
  await http.post("/auth/v1/signup", input);
  return loginService(input.email, input.password);
}

export async function logoutService() {
  await http.post("/auth/v1/logout", {});
  clearCsrfToken();
}

export async function restoreSessionService() {
  return getSessionService();
}
