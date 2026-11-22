import { http } from "@/lib/axios";
import type { User } from "./auth-service";

export type Preferences = {
  deadline: boolean;
  class: boolean;
  priority: boolean;
  workload: boolean;
  timing: "30m" | "1h" | "1d" | "3d";
};

export type ProfileInput = {
  name: string;
  email: string;
  program: string;
  yearLevel: string;
  academicTerm: string;
};

export type PasswordInput = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

export const DEFAULT_PREFERENCES: Preferences = {
  deadline: true,
  class: true,
  priority: true,
  workload: true,
  timing: "1h",
};

export async function getPreferencesService(): Promise<Preferences> {
  const response = await http.get("/settings/v1/preferences");
  return response.data.data.preferences as Preferences;
}

export async function updatePreferencesService(
  input: Preferences,
): Promise<Preferences> {
  const response = await http.patch("/settings/v1/preferences", input);
  return response.data.data.preferences as Preferences;
}

export async function updateProfileService(
  input: ProfileInput,
): Promise<User> {
  const response = await http.patch("/auth/v1/profile", input);
  return response.data.data.user as User;
}

export async function changePasswordService(
  input: PasswordInput,
): Promise<void> {
  await http.post("/auth/v1/change-password", input);
}
