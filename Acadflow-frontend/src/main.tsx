import "@/styles/global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/components/context/auth-context";
import { ProtectedRoute } from "@/components/context/protected-route";
import LandingPage from "@/pages/guest/home";
import AuthLayout from "@/pages/auth/layout";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import UserLayout from "@/pages/user/layout";
import UserHomePage from "@/pages/user/home";
import TasksPage from "@/pages/user/tasks";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Auth pages */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="register" element={<Navigate to="/auth/signup" replace />} />
        </Route>

        {/* Student pages */}
        <Route element={<ProtectedRoute role="STUDENT" />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserHomePage />} />
            <Route path="tasks" element={<TasksPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);
