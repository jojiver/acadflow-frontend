import { Link } from "react-router";

const FEATURES = [
  "Import your timetable from a PDF or photo",
  "Every task ranked by a 0–100 priority score",
  "See why a task is high priority — explained",
  "Smart study slots found in your free time",
];

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[linear-gradient(114deg,#0E273D_0%,#273444_100%)] px-16 py-16 lg:flex lg:w-[620px] lg:shrink-0 lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -left-[140px] bottom-[150px] size-[420px] rounded-full bg-white/[0.08]" />
      <div className="pointer-events-none absolute -top-[120px] -right-[60px] size-[340px] rounded-full bg-white/[0.07]" />

      <Link
        to="/"
        aria-label="Go to AcadFlow home"
        className="relative flex items-center gap-3 transition-opacity hover:opacity-90"
      >
        <span className="grid size-11 place-items-center rounded-xl border border-white/[0.35] bg-white/[0.15] text-lg font-bold text-white">
          A
        </span>
        <span className="text-2xl font-bold text-white">AcadFlow</span>
      </Link>

      <div className="relative max-w-[470px]">
        <h1 className="text-[44px] leading-[54px] font-bold text-white">
          Your Schedule.
          <br />
          Your Deadlines.
          <br />
          Your Priority.
        </h1>
        <p className="mt-6 text-[17px] leading-[27px] text-[#E2E8F0]">
          AcadFlow analyzes urgency, workload, difficulty and progress — then
          tells you exactly what to work on next.
        </p>

        <ul className="mt-10 space-y-[18px]">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-white/[0.20] text-[11px] font-bold text-white">
                ✓
              </span>
              <span className="text-[15px] font-medium text-[#F1F5F9]">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-[13px] text-[#CBD5E1]">
        MyStudyLife helps students organize. AcadFlow decides what comes first.
      </p>
    </aside>
  );
}
