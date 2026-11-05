import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { getProductivity } from "@/lib/productivity";
import type { ProductivityPeriod } from "@/lib/productivity";
import type { Task } from "@/lib/priority";

const OPTIONS: { value: ProductivityPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export function ProductivityPanel({ tasks }: { tasks: Task[] }) {
  const [period, setPeriod] = useState<ProductivityPeriod>("week");
  const stats = useMemo(() => getProductivity(tasks, period), [tasks, period]);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Productivity</h2>
          <p className="mt-1 text-sm text-ink-2">
            Your completion activity for the selected period.
          </p>
        </div>
        <SegmentedControl
          ariaLabel="Productivity period"
          value={period}
          onChange={setPeriod}
          options={OPTIONS}
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Stat
          label="Tasks completed"
          value={stats.completed}
          hint={`${stats.open} still open`}
        />
        <Stat
          label="Hours completed"
          value={`${stats.hours}h`}
          hint="Estimated workload finished"
        />
        <div className="rounded-xl bg-brand-tint p-4">
          <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
            Completion rate
          </p>
          <p className="mt-1 text-2xl font-semibold text-ink">{stats.rate}%</p>
          <ProgressBar className="mt-2" value={stats.rate} tone="emerald" />
        </div>
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-brand-tint p-4">
      <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-2">{hint}</p>}
    </div>
  );
}
