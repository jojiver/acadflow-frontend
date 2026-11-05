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
                ? "border-brand/20 bg-brand-tint font-semibold text-brand"
                : "border-line bg-surface text-ink-2 hover:bg-brand-tint",
            )}
          >
            {filter}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                active
                  ? "bg-brand/10 text-brand"
                  : "bg-brand-tint text-ink-3",
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
