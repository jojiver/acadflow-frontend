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
          <h2 className="text-lg font-semibold text-emerald-950">
            Productivity
          </h2>
          <p className="mt-1 text-sm text-emerald-950/60">
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
        <div className="rounded-xl bg-emerald-900/5 p-4">
          <p className="text-xs font-medium tracking-wide text-emerald-950/55 uppercase">
            Completion rate
          </p>
          <p className="mt-1 text-2xl font-semibold text-emerald-950">
            {stats.rate}%
          </p>
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
    <div className="rounded-xl bg-emerald-900/5 p-4">
      <p className="text-xs font-medium tracking-wide text-emerald-950/55 uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-emerald-950">{value}</p>
      {hint && <p className="mt-1 text-xs text-emerald-950/60">{hint}</p>}
    </div>
  );
}
