import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

type MarketingHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
};

export function MarketingHero({
  eyebrow,
  title,
  description,
  primaryLabel = "Create your account",
  primaryTo = "/auth/signup",
  secondaryLabel = "Sign in",
  secondaryTo = "/auth/login",
}: MarketingHeroProps) {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-10 sm:px-8 sm:pt-14">
      <Link
        to="/"
        className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
      >
        ← Back to home
      </Link>

      <div className="mx-auto mt-8 max-w-3xl text-center">
        <p className="text-[11px] font-bold tracking-[0.08em] text-brand uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-2 sm:text-base">
          {description}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            className="h-11 rounded-xl px-5"
            onClick={() => navigate(primaryTo)}
          >
            {primaryLabel}
          </Button>
          <Button
            variant="secondary"
            className="h-11 rounded-xl px-5"
            onClick={() => navigate(secondaryTo)}
          >
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
