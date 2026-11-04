import { http } from "@/lib/axios";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  studentId?: string;
  program?: string;
  yearLevel?: string;
};

export type SignupInput = {
  name: string;
  studentId: string;
  email: string;
  program: string;
  yearLevel: string;
  password: string;
};

// Get the signed-in student for the current cookie session.
export async function getSessionService() {
  const response = await http.get("/user");
  return response.data.data.user as User;
}

export async function loginService(email: string, password: string) {
  await http.post("/login", { email, password });
  return getSessionService();
}

export async function signupService(input: SignupInput) {
  await http.post("/register", input);
  return loginService(input.email, input.password);
}

export async function logoutService() {
  await http.post("/logout", {});
}

export async function restoreSessionService() {
  return getSessionService();
}
