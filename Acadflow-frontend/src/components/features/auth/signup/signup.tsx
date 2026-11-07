import { useEffect } from "react";
import { Link } from "react-router";
import { AuthBrandPanel } from "../auth-brand-panel";
import { Card } from "@/components/ui/card";
import { SignupForm } from "./signup-form";

// This auth screen owns the full register frame; the page just renders it.
export function Signup() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-svh bg-canvas">
      <AuthBrandPanel />

      <div className="flex flex-1 items-start justify-center px-4 py-8 sm:px-6 sm:py-12 lg:pt-[84px]">
        <div className="w-full max-w-[580px]">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink"
          >
            <span aria-hidden="true">←</span> Back
          </Link>

          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-dark text-sm font-bold text-white">
              A
            </span>
            <span className="text-xl font-bold text-ink">AcadFlow</span>
          </Link>

          <Card className="rounded-[20px] bg-surface p-6 shadow-[0_28px_60px_rgba(15,23,42,0.10)] sm:p-9">
            <div className="space-y-5">
              <header>
                <h1 className="text-2xl leading-tight font-bold text-ink sm:text-[30px] sm:leading-[38px]">
                  Create your account
                </h1>
                <p className="mt-2 text-sm text-ink-2">
                  Set up your student profile — it shapes your schedule and
                  priorities.
                </p>
              </header>

              <SignupForm />

              <p className="text-center text-xs text-ink-3">
                By creating an account you agree to the AcadFlow{" "}
                <Link to="#" className="underline underline-offset-2">
                  Terms
                </Link>{" "}
                &amp;{" "}
                <Link to="#" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>

              <p className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-ink-2">
                Already have an account?
                <Link
                  to="/auth/login"
                  className="font-semibold text-brand hover:text-brand-dark"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
