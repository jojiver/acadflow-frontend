import { Card } from "@/components/ui/card";
import { CtaSection } from "@/components/features/home/cta-section";
import { MarketingHero } from "./marketing-hero";

const FEATURES = [
  {
    eyebrow: "01 · TIME",
    title: "Smart timetable",
    body: "Your class card becomes a clean, colour-coded week in seconds.",
    points: [
      "Rooms, instructors and breaks included",
      "Day, Week and Month views",
      "Filter by subject at any time",
    ],
  },
  {
    eyebrow: "02 · PRIORITY",
    title: "Priority engine",
    body: "Every requirement gets a 0–100 score from five weighted factors.",
    points: [
      "Deadline, workload, difficulty, importance, progress",
      "Re-scores as time passes and you make progress",
      "Overdue work jumps to the top",
    ],
  },
  {
    eyebrow: "03 · FOCUS",
    title: "What should I work on?",
    body: "One recommended task, front and centre, with the reasons why.",
    points: [
      "Highest priority shown first",
      "Reasons explained, not just a number",
      "Continue straight into the task",
    ],
  },
  {
    eyebrow: "04 · WORKLOAD",
    title: "Workload analysis",
    body: "See which day is overloaded before it actually hits.",
    points: [
      "Estimated hours per day",
      "Warnings for heavy weeks",
      "Find where your free time is hiding",
    ],
  },
  {
    eyebrow: "05 · STUDY",
    title: "Study-time planning",
    body: "Gaps between classes become suggested study sessions.",
    points: [
      "Finds open periods in your week",
      "Suggests what to work on",
      "Add sessions to your plan",
    ],
  },
  {
    eyebrow: "06 · NOTIFICATIONS",
    title: "Alerts before it is too late",
    body: "Deadline, class and workload alerts, timed the way you want.",
    points: [
      "Deadline and class reminders",
      "Choose 30 min, 1 hour, 1 day or 3 days",
      "Workload warnings when it adds up",
    ],
  },
];

const OUTCOMES = [
  {
    title: "Plan in minutes",
    body: "Import a timetable and set up your semester without retyping every class.",
  },
  {
    title: "Always know what is next",
    body: "The system ranks your work, so you spend less time deciding and more time doing.",
  },
  {
    title: "Stay ahead of deadlines",
    body: "Reminders and workload warnings give you room to finish before it is urgent.",
  },
];

export function FeaturesPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Features"
        title="Everything your week needs"
        description="Six connected tools for import, schedule, tasks, priority, workload and study time — designed to answer one question: what should I work on next?"
        secondaryLabel="See how it works"
        secondaryTo="/how-it-works"
      />

      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="flex flex-col p-6">
              <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
                {feature.eyebrow}
              </p>
              <h2 className="mt-2 text-[22px] leading-[30px] font-semibold text-ink">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-2">
                {feature.body}
              </p>
              <ul className="mt-4 space-y-2">
                {feature.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm text-ink-2"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-brand-tint py-14">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-ink">
            Built for the whole semester
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {OUTCOMES.map((item) => (
              <Card key={item.title} className="p-6">
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-2">
                  {item.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
