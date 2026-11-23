import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { Confidence, ImportedClass } from "@/services/schedule-service";

const CONFIDENCE: Record<Confidence, string> = {
  High: "bg-[#DCFCE7] text-low",
  Medium: "bg-[#FEF3C7] text-med",
  Low: "bg-[#FEE2E2] text-high",
};

const GRID = "grid-cols-[1fr_90px_130px_90px_90px]";

type ReviewCardProps = {
  rows: ImportedClass[];
  fileName?: string;
  onToggle: (id: string) => void;
  onToggleAll: (selected: boolean) => void;
  onSubjectChange: (id: string, subject: string) => void;
};

/** Renders the ReviewCard component. */
export function ReviewCard({
  rows,
  fileName,
  onToggle,
  onToggleAll,
  onSubjectChange,
}: ReviewCardProps) {
  const selectedCount = rows.filter((row) => row.selected).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;

  return (
    <Card className="min-w-0 p-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-ink">Detected classes</h2>
          <p className="mt-1 text-xs text-ink-3">
            {rows.length} classes
            {fileName ? ` from ${fileName}` : ""} - untick anything wrong
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleAll(!allSelected)}
            disabled={rows.length === 0}
            className="cursor-pointer rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {allSelected ? "Untick all" : `Select all (${rows.length})`}
          </button>
          <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-2">
            {selectedCount} selected
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line bg-[#F8FAFC] px-4 py-10 text-center">
          <p className="text-sm font-semibold text-ink">
            No classes detected yet
          </p>
          <p className="mt-1 text-xs text-ink-3">
            Upload a clearer PDF or photo, or add classes manually.
          </p>
        </div>
      ) : (
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
                      checked={row.selected}
                      onChange={() => onToggle(row.id)}
                      className="size-4 shrink-0 rounded border-line accent-brand"
                    />
                    <span className="size-2 shrink-0 rounded-sm bg-ink-2" />
                    <div className="min-w-0 flex-1">
                      <input
                        value={row.subject}
                        onChange={(event) =>
                          onSubjectChange(row.id, event.target.value)
                        }
                        aria-label="Subject"
                        className="w-full min-w-0 rounded border border-transparent bg-transparent px-0.5 py-0 text-[12.5px] font-medium text-ink outline-none focus:border-brand focus:bg-white"
                      />
                      {row.note && (
                        <p className="truncate text-[11px] text-ink-3">
                          {row.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="truncate text-xs text-ink-2">
                    {row.day}
                  </span>
                  <span className="truncate text-xs text-ink-2">
                    {row.time}
                  </span>
                  <span className="truncate text-xs text-ink-2">
                    {row.room ?? "-"}
                  </span>
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
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
