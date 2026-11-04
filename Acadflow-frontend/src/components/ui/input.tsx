import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div>
      <input
        className={cn(
          "h-12 w-full rounded-[10px] border bg-surface px-4 text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-brand focus:ring-2 focus:ring-brand/15",
          error ? "border-high" : "border-line",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-high">{error}</p>}
    </div>
  );
}
