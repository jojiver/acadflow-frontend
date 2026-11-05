import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { getScheduleService } from "@/services/schedule-service";
import type { ScheduleClass, Weekday } from "@/services/schedule-service";
import { ScheduleMonth } from "./schedule-month";
import { ScheduleWeekGrid } from "./schedule-week-grid";

const VIEWS = ["Day", "Week", "Month"] as const;
type View = (typeof VIEWS)[number];

const WEEK: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// This feature owns the schedule request, view mode, and toolbar actions.
export function Schedule() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("Week");
  const [classes, setClasses] = useState<ScheduleClass[] | null>(null);

  useEffect(function fetchSchedule() {
    let active = true;

    getScheduleService()
      .then((result) => {
        if (active) setClasses(result);
      })
      .catch(() => {
        if (active) setClasses([]);
      });

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-brand-tint p-1">
          {VIEWS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={cn(
                "cursor-pointer rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                view === item
                  ? "bg-brand-dark text-white shadow-sm"
                  : "text-ink-2 hover:text-ink",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            className="h-10 rounded-xl px-4 text-[13px]"
          >
            All subjects ▾
          </Button>
          <Button
            variant="secondary"
            className="h-10 rounded-xl px-4 text-[13px]"
          >
            ＋ Add class
          </Button>
          <Button
            className="h-10 rounded-xl bg-brand-dark px-4 text-[13px] hover:bg-brand"
            onClick={() => navigate("/user/schedule/import")}
          >
            ⇪ Import schedule
          </Button>
        </div>
      </div>

      {classes === null ? (
        <Skeleton className="h-[824px] rounded-2xl" />
      ) : view === "Month" ? (
        <ScheduleMonth classes={classes} />
      ) : (
        <ScheduleWeekGrid
          classes={classes}
          days={view === "Day" ? ["Mon"] : WEEK}
          highlight="Wed"
        />
      )}
    </div>
  );
}
