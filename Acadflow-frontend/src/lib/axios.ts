import axios from "axios";

// Vite reads VITE_ variables from the frontend .env file.
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

// Services share this client. The browser sends the API's HttpOnly cookies,
// so JavaScript never reads or stores access tokens itself.
export const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // AuthProvider listens for this event and shows the signed-out UI.
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:expired"));
    }
    throw error;
  },
);
