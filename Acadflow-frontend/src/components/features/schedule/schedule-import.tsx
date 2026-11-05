import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { getImportPreviewService } from "@/services/schedule-service";
import type { ImportedClass } from "@/services/schedule-service";
import { ReviewCard } from "./review-card";
import { UploadCard } from "./upload-card";

const STEPS = [
  { n: 1, title: "Upload timetable", meta: "timetable.pdf", state: "done" },
  { n: 2, title: "Review classes", meta: "14 classes detected", state: "active" },
  { n: 3, title: "Confirm import", meta: "nothing saved yet", state: "todo" },
] as const;

export function ScheduleImport() {
  const [rows, setRows] = useState<ImportedClass[] | null>(null);

  useEffect(function fetchPreview() {
    let active = true;

    getImportPreviewService()
      .then((result) => {
        if (active) setRows(result);
      })
      .catch(() => {
        if (active) setRows([]);
      });

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, []);

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-center gap-6 p-5">
        {STEPS.map((step, index) => (
          <div key={step.n} className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-xs font-semibold",
                  step.state === "todo"
                    ? "border border-line bg-surface text-ink-3"
                    : "bg-brand-dark text-white",
                )}
              >
                {step.state === "done" ? "✓" : step.n}
              </span>
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    step.state === "todo" ? "text-ink-3" : "text-ink",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-ink-3">{step.meta}</p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <span className="hidden h-px w-12 bg-line sm:block" />
            )}
          </div>
        ))}
      </Card>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <UploadCard />
        {rows === null ? (
          <Skeleton className="h-[740px] rounded-2xl" />
        ) : (
          <ReviewCard rows={rows} />
        )}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ink" />
          <div>
            <p className="text-sm font-semibold text-ink">
              2 conflicts need attention
            </p>
            <p className="text-xs text-ink-3">
              Fix or untick the flagged classes, then confirm the import.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="h-11 px-5">
            Cancel
          </Button>
          <Button className="h-11 bg-brand-dark px-5 hover:bg-brand">
            Confirm import · 12 classes
          </Button>
        </div>
      </Card>
    </div>
  );
}
