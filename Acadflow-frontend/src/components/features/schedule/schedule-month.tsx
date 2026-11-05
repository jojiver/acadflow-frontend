import { cn } from "@/lib/cn";
import type { ScheduleClass } from "@/services/schedule-service";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// October 2026 starts on a Wednesday (Monday-first grid offset 2).
const OFFSET = 2;
const DAYS_IN_MONTH = 31;

export function ScheduleMonth({ classes }: { classes: ScheduleClass[] }) {
  const counts = new Map<string, number>();
  for (const item of classes) {
    counts.set(item.day, (counts.get(item.day) ?? 0) + 1);
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: OFFSET }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-base font-semibold text-ink">October 2026</h2>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[11px] font-semibold tracking-[0.04em] text-ink-3 uppercase"
          >
            {day}
          </div>
        ))}

        {cells.map((date, index) => {
          const isCurrentWeek = date !== null && date >= 5 && date <= 11;
          const dots =
            date !== null && date >= 6 && date <= 10
              ? counts.get(
                  (["Mon", "Tue", "Wed", "Thu", "Fri"] as const)[date - 6],
                ) ?? 0
              : 0;

          return (
            <div
              key={index}
              className={cn(
                "min-h-[84px] rounded-lg border border-line p-2",
                date === null && "border-transparent",
                isCurrentWeek && date !== null && "bg-brand-tint/50",
              )}
            >
              {date !== null && (
                <>
                  <span className="text-xs font-medium text-ink-2">
                    {date}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Array.from({ length: Math.min(dots, 4) }).map((_, dot) => (
                      <span
                        key={dot}
                        className="size-1.5 rounded-full bg-brand"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
