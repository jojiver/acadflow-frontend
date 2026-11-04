import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "high" | "medium" | "low";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-brand-tint text-brand",
  high: "bg-[#FEE2E2] text-high",
  medium: "bg-[#FEF3C7] text-med",
  low: "bg-[#DCFCE7] text-low",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
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
