import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TagProps = { children: ReactNode; className?: string };

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "rounded-full bg-brand-tint px-2.5 py-1 text-xs font-medium text-brand",
        className,
      )}
    >
      {children}
    </span>
  );
}
