import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { Confidence, ImportedClass } from "@/services/schedule-service";

const CONFIDENCE: Record<Confidence, string> = {
  High: "bg-[#DCFCE7] text-low",
  Medium: "bg-[#FEF3C7] text-med",
  Low: "bg-[#FEE2E2] text-high",
};

const GRID = "grid-cols-[1fr_90px_130px_90px_90px]";

export function ReviewCard({ rows }: { rows: ImportedClass[] }) {
  return (
    <Card className="min-w-0 p-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-ink">Detected classes</h2>
          <p className="mt-1 text-xs text-ink-3">
            14 classes from timetable.pdf · untick anything wrong
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="cursor-pointer rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-ink">
            Select all (14)
          </span>
          <span className="cursor-pointer rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-2">
            All subjects ▾
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[620px]">
          <div
            className={cn(
              "grid items-center gap-3 rounded-lg bg-brand-tint px-3 py-2.5 text-[10px] font-bold tracking-[0.06em] text-ink-3 uppercase",
              GRID,
            )}
          >
            <span>Class</span>
            <span>Day</span>
            <span>Time</span>
            <span>Room</span>
            <span>Confidence</span>
          </div>

          <div className="mt-1.5 space-y-1.5">
            {rows.map((row) => (
              <div
                key={row.id}
                className={cn(
                  "grid items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5",
                  GRID,
                  row.conflict && "ring-1 ring-brand-dark",
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={row.selected}
                    className="size-4 shrink-0 rounded border-line accent-brand"
                  />
                  <span className="size-2 shrink-0 rounded-sm bg-ink-2" />
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-ink">
                      {row.subject}
                    </p>
                    {row.note && (
                      <p className="truncate text-[11px] text-ink-3">
                        {row.note}
                      </p>
                    )}
                  </div>
                </div>
                <span className="truncate text-xs text-ink-2">{row.day}</span>
                <span className="truncate text-xs text-ink-2">{row.time}</span>
                <span className="truncate text-xs text-ink-2">{row.room}</span>
                <span
                  className={cn(
                    "justify-self-start rounded-full px-2.5 py-1 text-[10px] font-bold",
                    CONFIDENCE[row.confidence],
                  )}
                >
                  {row.confidence}
                </span>
              </div>
            ))}

            <button
              type="button"
              className="w-full cursor-pointer rounded-lg border border-line py-2 text-xs font-semibold text-ink-2 hover:bg-brand-tint"
            >
              + Show 4 more detected classes
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
