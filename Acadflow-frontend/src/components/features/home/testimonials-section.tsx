import { Card } from "@/components/ui/card";

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
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-canvas py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <header className="mx-auto flex max-w-[1160px] flex-col items-center gap-3 text-center">
          <p className="text-[11px] font-bold tracking-[0.08em] text-brand uppercase">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold text-ink sm:text-[40px] sm:leading-[48px]">
            Built for busy students
          </h2>
          <p className="max-w-[290px] text-[15px] leading-6 text-ink-2">
            Real semesters, actually under control.
          </p>
        </header>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {QUOTES.map((item) => (
            <Card key={item.name} className="flex flex-col p-7">
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((star) => (
                  <span key={star} className="size-1.5 rounded-full bg-med" />
                ))}
              </div>
              <p className="mt-5 text-[15px] leading-6 text-ink">{item.quote}</p>
              <hr className="mt-auto mb-4 border-line" />
              <p className="text-sm font-semibold text-ink">{item.name}</p>
              <p className="mt-1 text-xs text-ink-3">{item.program}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
