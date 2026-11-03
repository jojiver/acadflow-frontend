import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900",
        "placeholder:text-slate-400",
        "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
        invalid && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
        className,
      )}
      {...props}
    />
  ),
);

