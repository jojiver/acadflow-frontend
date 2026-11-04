import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = { children: ReactNode; className?: string };

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-line bg-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}
