import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
};

export function Slider({
  value,
  onValueChange,
  label,
  showValue = true,
  min = 0,
  max = 100,
  step = 5,
  className,
  ...props
}: SliderProps) {
  const minNum = Number(min);
  const maxNum = Number(max);
  const clamped = Math.min(maxNum, Math.max(minNum, value));
  const percent = ((clamped - minNum) / (maxNum - minNum || 1)) * 100;

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink-2">
          <span>{label}</span>
          {showValue && (
            <span className="font-medium text-ink">{clamped}%</span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(event) => onValueChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(to right, #273444 ${percent}%, #e5e7eb ${percent}%)`,
        }}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full",
          "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand",
          "[&::-webkit-slider-thumb]:shadow",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand",
        )}
        {...props}
      />
    </div>
  );
}
