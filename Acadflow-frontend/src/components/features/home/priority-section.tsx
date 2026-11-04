import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const FACTORS = [
  { label: "Deadline urgency", value: 30 },
  { label: "Workload", value: 25 },
  { label: "Difficulty", value: 20 },
  { label: "Importance", value: 15 },
  { label: "Progress", value: 10 },
];

const REASONS = [
  "Deadline is closest — 3 days left",
  "Counts for 30% of your final grade",
  "Workload is heaviest this week",
];

export function PrioritySection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-brand-dark py-20">
      <div className="pointer-events-none absolute -top-[160px] -right-[160px] size-[520px] rounded-full bg-brand-glow" />

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_580px]">
        <div>
          <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
            Priority engine
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-[40px] sm:leading-[48px]">
            Not all deadlines
            <br />
            are equal.
          </h2>
          <p className="mt-6 max-w-[427px] text-[15px] leading-[26px] text-[#CBD5E1]">
            Every requirement is scored 0–100 across five weighted factors. The
            highest score becomes your next task — with the reasons shown, so
            you can see why.
          </p>

          <div className="mt-10 space-y-7">
            {FACTORS.map((factor) => (
              <div key={factor.label} className="flex items-center gap-6">
                <span className="w-[170px] shrink-0 text-sm font-medium text-[#E2E8F0]">
                  {factor.label}
                </span>
                <div className="h-1.5 flex-1 rounded-full bg-[#1E3A54]">
                  <div
                    className="h-full rounded-full bg-[#E2E8F0]"
                    style={{ width: `${factor.value}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs font-semibold text-ink-3">
                  {factor.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-surface p-8 shadow-[0_28px_60px_rgba(15,23,42,0.30)]">
          <div className="flex items-start justify-between">
            <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
              Next up
            </p>
            <span className="grid size-16 place-items-center rounded-2xl bg-[#FEE2E2] text-[26px] font-bold text-high">
              92
            </span>
          </div>

          <h3 className="mt-4 text-2xl leading-8 font-semibold text-ink">
            Web Development
            <br />
            Final Project
          </h3>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#FEE2E2] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.05em] text-high">
              DUE IN 3 DAYS
            </span>
            <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.05em] text-med">
              IMPORTANT
            </span>
            <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.05em] text-low">
              60% DONE
            </span>
          </div>

          <hr className="my-5 border-line" />

          <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
            Why this first
          </p>
          <ul className="mt-4 space-y-3">
            {REASONS.map((reason) => (
              <li key={reason} className="flex items-center gap-3">
                <span className="size-1.5 shrink-0 rounded-full bg-high" />
                <span className="text-[13px] text-ink-2">{reason}</span>
              </li>
            ))}
          </ul>

          <Button
            className="mt-6 h-12 rounded-xl px-5 text-sm"
            onClick={() => navigate("/auth/signup")}
          >
            Start this task →
          </Button>
          <p className="mt-4 text-xs text-ink-3">
            Takes ~2h 30m · 4 of 10 steps done
          </p>
        </div>
      </div>
    </section>
  );
}
