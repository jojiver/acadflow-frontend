import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "info" | "high" | "medium" | "low" | "outline";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  info: "bg-indigo-50 text-indigo-700",
  high: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-inset ring amber-200",
  low: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  outline: "border border-slate-300 text-slate-600",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
