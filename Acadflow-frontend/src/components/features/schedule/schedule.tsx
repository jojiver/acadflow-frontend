import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { getErrorMessage } from "@/lib/errors";
import { getScheduleService } from "@/services/schedule-service";
import type { ScheduleClass, Weekday } from "@/services/schedule-service";
import { ScheduleClassForm } from "./schedule-class-form";
import { ScheduleMonth } from "./schedule-month";
import { ScheduleWeekGrid } from "./schedule-week-grid";

const VIEWS = ["Day", "Week", "Month"] as const;
type View = (typeof VIEWS)[number];

const WEEK: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function Schedule() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("Week");
  const [classes, setClasses] = useState<ScheduleClass[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    getScheduleService()
      .then((result) => {
        if (active) {
          setClasses(result);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setClasses([]);
          setError(getErrorMessage(requestError));
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const isEmpty = classes !== null && classes.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-brand-tint p-1">
          {VIEWS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              disabled={isEmpty}
              className={cn(
                "cursor-pointer rounded-lg px-5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
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
            disabled={isEmpty}
          >
            All subjects ▾
          </Button>
          <Button
            variant="secondary"
            className="h-10 rounded-xl px-4 text-[13px]"
            onClick={() => setFormOpen(true)}
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

      {error && classes !== null && (
        <p role="alert" className="text-sm text-high">
          {error}
        </p>
      )}

      {classes === null ? (
        <Skeleton className="h-[824px] rounded-2xl" />
      ) : isEmpty ? (
        <EmptyState
          title="No classes yet"
          description="Add your first class or import your timetable to build your week."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => setFormOpen(true)}>＋ Add class</Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/user/schedule/import")}
              >
                Import schedule
              </Button>
            </div>
          }
        />
      ) : view === "Month" ? (
        <ScheduleMonth classes={classes} />
      ) : (
        <ScheduleWeekGrid
          classes={classes}
          days={view === "Day" ? ["Mon"] : WEEK}
        />
      )}

      <ScheduleClassForm
        key={formOpen ? "open" : "closed"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={() => {
          setFormOpen(false);
          setReloadKey((key) => key + 1);
        }}
      />
    </div>
  );
}
