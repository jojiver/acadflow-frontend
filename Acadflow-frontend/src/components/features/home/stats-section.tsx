const STATS: [string, string][] = [
  ["6 classes", "detected from one photo"],
  ["0–100", "priority score per task"],
  ["5 factors", "deadline, workload, difficulty, importance"],
  ["2 formats", "PDF and image import"],
];

export function StatsSection() {
  return (
    <section className="bg-canvas pb-6">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-6 rounded-[20px] border border-line bg-surface px-6 py-6 shadow-[0_10px_26px_rgba(15,23,42,0.06)] md:grid-cols-4 md:gap-0 md:divide-x md:divide-line md:py-8">
          {STATS.map(([value, caption]) => (
            <div key={value} className="md:px-10">
              <p className="text-2xl font-bold text-ink md:text-[30px]">
                {value}
              </p>
              <p className="mt-1 text-[13px] text-ink-2">{caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
