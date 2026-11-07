import { Card } from "@/components/ui/card";
import { CtaSection } from "@/components/features/home/cta-section";
import { MarketingHero } from "./marketing-hero";

const STATS: [string, string][] = [
  ["2 min", "to set up a semester"],
  ["6 classes", "detected from one photo"],
  ["0–100", "priority score per task"],
];

const QUOTES = [
  {
    quote:
      "I imported my whole semester in under a minute. The priority list is the first thing I open.",
    name: "Joniver S.",
    program: "BS Information Technology",
  },
  {
    quote:
      "It found a deadline I had completely forgotten about. That alone was worth it.",
    name: "Maria L.",
    program: "BS Computer Science",
  },
  {
    quote:
      "No more guessing what to do first. The score tells me, and the reasons make sense.",
    name: "Ken A.",
    program: "BS Information Systems",
  },
  {
    quote:
      "The weekly workload view saved me during finals. I could see the heavy days before they arrived.",
    name: "Angela R.",
    program: "BS Information Technology",
  },
  {
    quote:
      "My schedule used to live in a screenshot. Now it is a real calendar with my deadlines beside it.",
    name: "Paolo M.",
    program: "BS Computer Science",
  },
  {
    quote:
      "Reviewing the detected classes before saving made me trust the import. It caught a wrong room instantly.",
    name: "Bea T.",
    program: "BS Information Systems",
  },
];

export function TestimonialsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Testimonials"
        title="Built for busy students"
        description="Real semesters, actually under control. Here is what students say about planning with AcadFlow."
        secondaryLabel="Explore features"
        secondaryTo="/features"
      />

      <section className="mx-auto max-w-[1280px] px-5 pt-10 sm:px-8">
        <div className="grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-3 sm:p-8">
          {STATS.map(([value, caption]) => (
            <div key={value}>
              <p className="text-3xl font-bold text-ink">{value}</p>
              <p className="mt-1 text-[13px] text-ink-2">{caption}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((item) => (
            <Card key={item.name} className="flex flex-col p-6">
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((star) => (
                  <span key={star} className="size-1.5 rounded-full bg-med" />
                ))}
              </div>
              <p className="mt-4 text-[15px] leading-6 text-ink">
                {item.quote}
              </p>
              <div className="mt-auto pt-5">
                <hr className="mb-4 border-line" />
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <p className="mt-0.5 text-xs text-ink-3">{item.program}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
