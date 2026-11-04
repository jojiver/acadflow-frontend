import { Card } from "@/components/ui/card";

const STEPS = [
  {
    number: "01",
    title: "Import your class card",
    body: "Snap a photo or drop a PDF. We read every course, room and time.",
  },
  {
    number: "02",
    title: "We build your week",
    body: "Classes, rooms and breaks become a colour-coded timetable.",
  },
  {
    number: "03",
    title: "Work the ranked plan",
    body: "Each deadline gets a 0–100 score, so you always know what is next.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-canvas py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <header className="mx-auto flex max-w-[1160px] flex-col items-center gap-3 text-center">
          <p className="text-[11px] font-bold tracking-[0.08em] text-brand uppercase">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-ink sm:text-[40px] sm:leading-[48px]">
            From a photo to a ranked week
          </h2>
          <p className="max-w-[434px] text-[15px] leading-6 text-ink-2">
            Three steps, no manual data entry — and no spreadsheet.
          </p>
        </header>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <Card key={step.number} className="flex flex-col p-7">
              <span className="text-[44px] leading-[52px] font-bold text-[#CBD5E1]">
                {step.number}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[220px] text-sm leading-[22px] text-ink-2">
                {step.body}
              </p>
              <span className="mt-6 block h-1 w-12 rounded-full bg-brand" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
