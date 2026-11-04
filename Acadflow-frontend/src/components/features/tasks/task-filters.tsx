import { cn } from "@/lib/cn";

type PriorityFilter = "All" | "High" | "Medium" | "Low";

const FILTERS: PriorityFilter[] = ["All", "High", "Medium", "Low"];

type TaskFiltersProps = {
  value: PriorityFilter;
  counts: Record<PriorityFilter, number>;
  onChange: (value: PriorityFilter) => void;
};

export function TaskFilters({ value, counts, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((filter) => {
        const active = filter === value;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-emerald-900/20 bg-emerald-100 text-emerald-900"
                : "border-emerald-900/10 bg-[#f7f8f0] text-emerald-950/65 hover:bg-emerald-900/5",
            )}
          >
            {filter}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                active
                  ? "bg-emerald-900/10 text-emerald-900"
                  : "bg-emerald-900/5 text-emerald-950/50",
              )}
            >
              {counts[filter]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
