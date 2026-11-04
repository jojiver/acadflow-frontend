import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export function Select({ className, error, children, ...props }: SelectProps) {
  return (
    <div>
      <select
        className={cn(
          "h-12 w-full rounded-[10px] border bg-surface px-4 text-[15px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15",
          error ? "border-high" : "border-line",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-high">{error}</p>}
    </div>
  );
}
