import { Card } from "@/components/ui/card";
import { CtaSection } from "@/components/features/home/cta-section";
import { MarketingHero } from "./marketing-hero";

const STEPS = [
  {
    number: "01",
    title: "Import your class card",
    body: "Snap a photo or drop a PDF. AcadFlow reads every course, room, instructor and time.",
    points: ["PDF, JPG and PNG", "Reads the whole week", "Nothing typed by hand"],
  },
  {
    number: "02",
    title: "We build your week",
    body: "Classes, rooms and breaks become a colour-coded timetable you can edit in one tap.",
    points: ["Day, Week and Month views", "Colour-coded subjects", "Edit or delete any class"],
  },
  {
    number: "03",
    title: "Work the ranked plan",
    body: "Add requirements and AcadFlow scores each one 0–100, then recommends what to do next.",
    points: ["Five weighted factors", "Explained priority", "Progress updates the score"],
  },
];

const RESULTS = [
  "A timetable that matches your real classes",
  "One ranked list instead of scattered notes",
  "A recommended next task every time you open the app",
  "Deadline and workload alerts before the rush",
  "Free periods turned into study suggestions",
  "Progress tracking you can actually see",
];

export function HowItWorksPage() {
  return (
    <>
      <MarketingHero
        eyebrow="How it works"
        title="From a photo to a ranked week"
        description="Three steps, no manual data entry, and no spreadsheet. AcadFlow turns your class card into a plan you can follow."
        secondaryLabel="See the features"
        secondaryTo="/features"
      />

      <section className="mx-auto max-w-[1280px] space-y-5 px-5 py-14 sm:px-8">
        {STEPS.map((step) => (
          <Card key={step.number} className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <span className="text-5xl leading-none font-bold text-[#CBD5E1]">
                {step.number}
              </span>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-ink">{step.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-2">
                  {step.body}
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                  {step.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 rounded-lg bg-brand-tint px-3 py-2 text-xs font-medium text-ink-2"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="border-t border-line bg-brand-tint py-14">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-ink">
            What you get
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESULTS.map((result) => (
              <div
                key={result}
                className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#DCFCE7] text-[10px] font-bold text-low">
                  ✓
                </span>
                <p className="text-sm text-ink-2">{result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
