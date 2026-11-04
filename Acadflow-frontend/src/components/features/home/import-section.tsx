const BULLETS = [
  "Reads PDF, JPG and PNG",
  "Detects rooms, instructors and breaks",
  "Nothing to type in by hand",
];

export function ImportSection() {
  return (
    <section id="import" className="bg-brand-tint py-20">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[560px_1fr]">
        <div>
          <p className="text-[11px] font-bold tracking-[0.08em] text-brand uppercase">
            Smart import 2.0
          </p>
          <h2 className="mt-4 text-3xl font-bold text-ink sm:text-[40px] sm:leading-[48px]">
            A photo in.
            <br />
            A semester out.
          </h2>
          <p className="mt-6 max-w-[400px] text-[15px] leading-[25px] text-ink-2">
            Snap your class card or drop a PDF. AcadFlow reads every course,
            room, instructor and time — then builds the week. Fix anything in
            one tap.
          </p>

          <ul className="mt-8 space-y-3">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3">
                <span className="size-1.5 shrink-0 rounded-full bg-low" />
                <span className="text-sm font-medium text-ink-2">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex h-[336px] flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#CBD5E1] bg-surface px-6 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-brand-tint text-[26px] leading-[30px] font-bold text-brand">
            ↑
          </span>
          <h3 className="mt-6 text-lg font-semibold text-ink">
            Drop your class card here
          </h3>
          <p className="mt-2 text-[13px] text-ink-3">
            or browse files · PDF, JPG, PNG
          </p>
          <span className="mt-6 rounded-full bg-[#DCFCE7] px-3.5 py-1.5 text-xs font-bold text-low">
            6 classes detected
          </span>
        </div>
      </div>
    </section>
  );
}
