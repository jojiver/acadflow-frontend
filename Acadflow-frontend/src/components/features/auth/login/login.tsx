import { Link } from "react-router";
import { AuthBrandPanel } from "../auth-brand-panel";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";

// This auth screen owns the full login frame; the page just renders it.
export function Login() {
  return (
    <div className="flex min-h-svh bg-canvas">
      <AuthBrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[580px]">
          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-dark text-sm font-bold text-white">
              A
            </span>
            <span className="text-xl font-bold text-ink">AcadFlow</span>
          </Link>

          <Card className="rounded-[20px] bg-surface p-9 shadow-[0_28px_60px_rgba(15,23,42,0.10)]">
            <div className="space-y-5">
              <header>
                <h1 className="text-[30px] leading-[38px] font-bold text-ink">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-ink-2">
                  Sign in to see your priorities.
                </p>
              </header>

              <LoginForm />

              <p className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-ink-2">
                New here?
                <Link
                  to="/auth/signup"
                  className="font-semibold text-brand hover:text-brand-dark"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
