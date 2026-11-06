import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7000/api";

export const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Keep the CSRF token in memory. It proves a write request came from a client
// that fetched a token for the current cookie session.
let csrfToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

const writeMethods = ["post", "put", "patch", "delete"];
const authEndpoints = [
  "/auth/v1/login",
  "/auth/v1/signup",
  "/auth/v1/refresh-token",
  "/auth/v1/logout",
];

function isAuthEndpoint(url = "") {
  return authEndpoints.includes(url);
}

export function clearCsrfToken() {
  csrfToken = null;
}

export async function ensureCsrfToken() {
  if (csrfToken) return;

  const response = await axios.get(`${baseURL}/auth/v1/csrf-token`, {
    withCredentials: true,
  });
  csrfToken = response.data.data.csrfToken as string;
}

async function refreshSession() {
  await http.post("/auth/v1/refresh-token", {});
  await ensureCsrfToken();
}

http.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() || "get";

  if (writeMethods.includes(method)) {
    await ensureCsrfToken();
    config.headers.set("x-csrf-token", csrfToken);
  }

  return config;
});

http.interceptors.response.use(
  (response) => {
    if (isAuthEndpoint(response.config.url)) clearCsrfToken();
    return response;
  },
  async (error) => {
    const request = error.config;

    if (!request || error.response?.status !== 401) throw error;
    if (request._retry || isAuthEndpoint(request.url)) throw error;

    request._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
    } catch (refreshError) {
      clearCsrfToken();
      window.dispatchEvent(new Event("auth:expired"));
      throw refreshError;
    }

    return http(request);
  },
);
