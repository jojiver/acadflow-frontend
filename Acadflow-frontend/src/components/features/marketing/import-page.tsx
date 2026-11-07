import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { CtaSection } from "@/components/features/home/cta-section";
import { MarketingHero } from "./marketing-hero";

const STEPS = [
  {
    title: "Upload",
    body: "Drop a PDF or a photo of your class card. Files are only used to read the schedule.",
  },
  {
    title: "Extract",
    body: "AcadFlow detects the subject, day, time and room for every class it can read.",
  },
  {
    title: "Review",
    body: "Every detected class is shown first. Fix, remove or add anything that looks wrong.",
  },
  {
    title: "Confirm",
    body: "Nothing is saved until you confirm. Approved classes become your live timetable.",
  },
];

const CONTROLS = [
  {
    title: "Editable before saving",
    body: "Correct a subject, room or time directly in the review list before it reaches your schedule.",
  },
  {
    title: "Conflicts are flagged",
    body: "Overlapping or duplicate classes are highlighted so you can decide which to keep.",
  },
  {
    title: "Confidence per class",
    body: "Each detected class shows how confident the extraction is, so you know what to double-check.",
  },
  {
    title: "Manual fallback",
    body: "If a file cannot be read, you can still add classes by hand at any time.",
  },
];

export function ImportPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Smart import"
        title="A photo in. A semester out."
        description="Upload your class card once. AcadFlow reads every course, room, instructor and time, then builds the week for you — with a review step before anything is saved."
        secondaryLabel="See how it works"
        secondaryTo="/how-it-works"
      />

      <section className="mx-auto max-w-[1280px] px-5 pt-10 sm:px-8">
        <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-2">
          <Tag>PDF</Tag>
          <Tag>JPG</Tag>
          <Tag>PNG</Tag>
          <Tag>up to 10 MB</Tag>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Card key={step.title} className="p-6">
              <span className="grid size-9 place-items-center rounded-xl bg-brand-dark text-sm font-bold text-white">
                {index + 1}
              </span>
              <h2 className="mt-4 text-lg font-semibold text-ink">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-2">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-brand-tint py-14">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-ink">
            You stay in control
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-ink-2">
            Extraction is helpful, not automatic. Every class passes through a
            review screen before it is added.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {CONTROLS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line bg-surface p-5"
              >
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink-2">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Privacy</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-2">
            Your uploaded file is used only to extract your class schedule. The
            detected classes are shown to you for review, and nothing is saved
            to your account until you confirm the import.
          </p>
        </Card>
      </section>

      <CtaSection />
    </>
  );
}
