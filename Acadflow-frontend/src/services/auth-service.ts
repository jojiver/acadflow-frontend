import { clearCsrfToken, ensureCsrfToken, http } from "@/lib/axios";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  studentId?: string | null;
  program?: string | null;
  yearLevel?: string | null;
  academicTerm?: string | null;
};

export type SignupInput = {
  name: string;
  email: string;
  program: string;
  yearLevel: string;
  password: string;
};

/** Fetches the current session user from the API. */
async function getSessionService() {
  const response = await http.get("/auth/v1/session");
  const data = response.data.data;
  return (data.user ?? data) as User;
}

/** Logs in and returns the authenticated user. */
export async function loginService(email: string, password: string) {
  await ensureCsrfToken();
  await http.post("/auth/v1/login", { email, password });
  await ensureCsrfToken();
  return getSessionService();
}

/** Creates an account and returns the authenticated user. */
export async function signupService(input: SignupInput) {
  await ensureCsrfToken();
  await http.post("/auth/v1/signup", input);
  return loginService(input.email, input.password);
}

/** Logs out and clears the client CSRF token. */
export async function logoutService() {
  await http.post("/auth/v1/logout", {});
  clearCsrfToken();
}

/** Restores the current user from the session cookie. */
export async function restoreSessionService() {
  return getSessionService();
}
