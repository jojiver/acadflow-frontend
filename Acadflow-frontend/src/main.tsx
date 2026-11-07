import "@/styles/global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/components/context/auth-context";
import { ProtectedRoute } from "@/components/context/protected-route";
import GuestLayout from "@/pages/guest/layout";
import LandingPage from "@/pages/guest/home";
import FeaturesPage from "@/pages/guest/features";
import HowItWorksPage from "@/pages/guest/how-it-works";
import ImportPage from "@/pages/guest/import";
import TestimonialsPage from "@/pages/guest/testimonials";
import AuthLayout from "@/pages/auth/layout";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import UserLayout from "@/pages/user/layout";
import UserHomePage from "@/pages/user/home";
import SchedulePage from "@/pages/user/schedule";
import ScheduleImportPage from "@/pages/user/schedule/import";
import SubjectsPage from "@/pages/user/subjects";
import ProductivityPage from "@/pages/user/productivity";
import TasksPage from "@/pages/user/tasks";
import TaskCreatePage from "@/pages/user/tasks/create";
import TaskDetailPage from "@/pages/user/tasks/detail";
import TaskEditPage from "@/pages/user/tasks/edit";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Marketing pages */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
        </Route>

        {/* Auth pages */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route
            path="register"
            element={<Navigate to="/auth/signup" replace />}
          />
        </Route>

        {/* Student pages */}
        <Route element={<ProtectedRoute role="STUDENT" />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserHomePage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="schedule/import" element={<ScheduleImportPage />} />
            <Route
              path="schedule/review"
              element={<Navigate to="/user/schedule/import" replace />}
            />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="productivity" element={<ProductivityPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/create" element={<TaskCreatePage />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
            <Route path="tasks/:id/edit" element={<TaskEditPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);
