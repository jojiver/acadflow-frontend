import { useNavigate } from "react-router";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const WEEK = [
  ["#BFD7F5", "#C9E8D5", "#F7CDD5", "#F8E5A8", "#D9CFF5"],
  ["#C9E8D5", "#F7CDD5", "#F8E5A8", "#D9CFF5", "#BFD7F5"],
  ["#F7CDD5", "#F8E5A8", "#D9CFF5", "#BFD7F5", "#C9E8D5"],
];

type FeatureCardProps = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  className?: string;
  children?: ReactNode;
};

function FeatureCard({
  eyebrow,
  title,
  body,
  cta,
  onClick,
  className,
  children,
}: FeatureCardProps) {
  return (
    <Card className={cn("flex flex-col p-7", className)}>
      <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-[22px] leading-[30px] font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-2 max-w-[260px] text-sm leading-[22px] text-ink-2">
        {body}
      </p>
      {children}
      <button
        type="button"
        onClick={onClick}
        className="mt-auto cursor-pointer pt-6 text-left text-[13px] font-semibold text-brand hover:text-brand-dark"
      >
        {cta}
      </button>
    </Card>
  );
}

export function FeaturesSection() {
  const navigate = useNavigate();

  return (
    <section id="features" className="bg-canvas py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <header className="mx-auto flex max-w-[1160px] flex-col items-center gap-3 text-center">
          <p className="text-[11px] font-bold tracking-[0.08em] text-brand uppercase">
            Features
          </p>
          <h2 className="text-3xl font-bold text-ink sm:text-[40px] sm:leading-[48px]">
            Everything your week needs
          </h2>
          <p className="max-w-[594px] text-[15px] leading-6 text-ink-2">
            Six connected tools — import, schedule, tasks, priority, workload
            and study time.
          </p>
        </header>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <Card className="flex flex-col gap-6 p-7 lg:col-span-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[291px]">
              <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
                01 · TIME
              </p>
              <h3 className="mt-2 text-[22px] leading-[30px] font-semibold text-ink">
                Smart timetable
              </h3>
              <p className="mt-2 text-sm leading-[22px] text-ink-2">
                Your class card becomes a colour-coded week in seconds — rooms,
                instructors and breaks included.
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth/signup")}
                className="mt-6 cursor-pointer text-[13px] font-semibold text-brand hover:text-brand-dark"
              >
                Open schedule →
              </button>
            </div>

            <div className="w-full max-w-[336px] rounded-[14px] bg-brand-tint p-3">
              <div className="flex h-[220px] items-stretch justify-between gap-2">
                {WEEK[0].map((_, column) => (
                  <div
                    key={column}
                    className="flex flex-1 flex-col gap-2"
                  >
                    <div
                      className="h-9 rounded-md"
                      style={{ background: WEEK[0][column] }}
                    />
                    <div
                      className="h-[58px] rounded-md"
                      style={{ background: WEEK[1][column] }}
                    />
                    <div
                      className="h-11 rounded-md"
                      style={{ background: WEEK[2][column] }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="flex flex-col p-7">
            <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
              02 · PRIORITY
            </p>
            <h3 className="mt-2 text-[22px] leading-[30px] font-semibold text-ink">
              Priority engine
            </h3>
            <p className="mt-2 text-sm leading-[22px] text-ink-2">
              Every task is scored 0–100 from deadline, workload, difficulty,
              importance and progress.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#FEE2E2] px-3 py-1.5 text-[10px] font-bold tracking-[0.05em] text-high">
                92 HIGH
              </span>
              <span className="rounded-full bg-[#FEF3C7] px-3 py-1.5 text-[10px] font-bold tracking-[0.05em] text-med">
                64 MED
              </span>
              <span className="rounded-full bg-[#DCFCE7] px-3 py-1.5 text-[10px] font-bold tracking-[0.05em] text-low">
                31 LOW
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/auth/signup")}
              className="mt-auto cursor-pointer pt-6 text-left text-[13px] font-semibold text-brand hover:text-brand-dark"
            >
              See priorities →
            </button>
          </Card>

          <FeatureCard
            eyebrow="03 · FOCUS"
            title="What should I work on?"
            body="One recommended task, front and centre, with the reasons why it comes first."
            cta="Open dashboard →"
            onClick={() => navigate("/auth/signup")}
          />
          <FeatureCard
            eyebrow="04 · WORKLOAD"
            title="Workload analysis"
            body="See which day is overloaded before it hits — and where your free hours are hiding."
            cta="View workload →"
            onClick={() => navigate("/auth/signup")}
          />
          <FeatureCard
            eyebrow="05 · STUDY"
            title="Study-time planning"
            body="We find the gaps between classes and suggest when to work on what."
            cta="Open calendar →"
            onClick={() => navigate("/auth/signup")}
          />

          <Card className="flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center lg:col-span-3">
            <div className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-brand-tint">
              <span className="size-2 rounded-full bg-med" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
                06 · NOTIFICATIONS
              </p>
              <h3 className="mt-1 text-lg font-semibold text-ink">
                Alerts that arrive before it is too late
              </h3>
              <p className="mt-1 text-[13px] text-ink-2">
                Deadline, class and workload alerts, timed the way you want them.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/auth/signup")}
              className="cursor-pointer text-[13px] font-semibold text-brand hover:text-brand-dark sm:ml-auto"
            >
              View notifications →
            </button>
          </Card>
        </div>
      </div>
    </section>
  );
}
