import { cn } from "@/lib/cn";
import type { ScheduleClass, Weekday } from "@/services/schedule-service";

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const START_HOUR = 7;
const HOUR_HEIGHT = 64;

const DAY_META: Record<Weekday, { label: string; date: string }> = {
  Mon: { label: "MON", date: "Oct 6" },
  Tue: { label: "TUE", date: "Oct 7" },
  Wed: { label: "WED", date: "Oct 8" },
  Thu: { label: "THU", date: "Oct 9" },
  Fri: { label: "FRI", date: "Oct 10" },
};

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:00 ${suffix}`;
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${pad(minutes)} ${suffix}`;
}

type ScheduleWeekGridProps = {
  classes: ScheduleClass[];
  days: Weekday[];
  highlight?: Weekday;
};

export function ScheduleWeekGrid({
  classes,
  days,
  highlight,
}: ScheduleWeekGridProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex border-b border-line">
        <div className="w-[84px] shrink-0" />
        {days.map((day) => (
          <div
            key={day}
            className="flex-1 border-l border-line py-2.5 text-center"
          >
            <p className="text-[11px] font-semibold tracking-[0.04em] text-ink-3">
              {DAY_META[day].label}
            </p>
            <p className="mt-0.5 text-[13px] font-semibold text-ink">
              {DAY_META[day].date}
            </p>
          </div>
        ))}
      </div>

      <div className="flex">
        <div className="w-[84px] shrink-0">
          {HOURS.map((hour, index) => (
            <div key={hour} className="relative h-16">
              {index > 0 && (
                <span className="absolute -top-2 right-3 text-[11px] text-ink-3">
                  {formatHour(hour)}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-0">
            {HOURS.map((hour) => (
              <div key={hour} className="h-16 border-t border-line" />
            ))}
          </div>

          <div
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {days.map((day) => (
              <div
                key={day}
                className={cn(
                  "relative h-[768px] border-l border-line",
                  highlight === day && "bg-brand-tint/50",
                )}
              >
                {classes
                  .filter((item) => item.day === day)
                  .map((item) => {
                    const start = toMinutes(item.start);
                    const end = toMinutes(item.end);
                    const top = ((start - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                    const height = ((end - start) / 60) * HOUR_HEIGHT;

                    return (
                      <div
                        key={item.id}
                        className="absolute inset-x-1.5 overflow-hidden rounded-xl border border-line bg-brand-tint px-2.5 py-2"
                        style={{ top, height: height - 2 }}
                      >
                        <p className="truncate text-[13px] font-semibold text-ink">
                          {item.subject}
                        </p>
                        <p className="mt-0.5 text-[11px] text-ink-2">
                          {formatTime(item.start)} – {formatTime(item.end)}
                        </p>
                        {item.room && (
                          <p className="mt-0.5 truncate text-[11px] text-ink-3">
                            {item.room}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
