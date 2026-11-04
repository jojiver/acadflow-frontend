import { cn } from "@/lib/cn";

type ProgressTone = "emerald" | "amber" | "rose" | "slate";

const TONES: Record<ProgressTone, string> = {
  emerald: "bg-low",
  amber: "bg-med",
  rose: "bg-high",
  slate: "bg-brand",
};

type ProgressBarProps = {
  value: number;
  tone?: ProgressTone;
  label?: string;
  showValue?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  tone = "emerald",
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink-2">
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
        className="h-2 w-full overflow-hidden rounded-full bg-brand-tint"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            TONES[tone],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
