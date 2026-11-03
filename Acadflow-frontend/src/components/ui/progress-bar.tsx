import { cn } from "@/lib/cn";

type ProgressTone = "indigo" | "emerald" | "amber" | "rose";

const TONES: Record<ProgressTone, string> = {
  indigo: "bg-indigo-600",
  emerald: "bg-emerald-600",
  amber: "bg-amber-500",
  rose: "bg-rose-600",
};

type ProgressBarProps = {
  value: number;
  tone?: ProgressTone;
  label?: string;
  showValue?: boolean;
  className?: string;
};

function ProgressBar({
  value,
  tone = "indigo",
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
          <span>{label}</span>
          {showValue && <span>{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", TONES[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export type { ProgressTone };
export default ProgressBar;