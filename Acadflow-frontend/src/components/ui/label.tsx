import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  error?: boolean | string;
};

export function Label({ className, children, error, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-2 block text-[13px] font-semibold tracking-[0.02em] text-ink-2 uppercase",
        error && "text-high",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
