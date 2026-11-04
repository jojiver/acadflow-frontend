import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-brand-tint", className)}
      {...props}
    />
  );
}

export function SkeletonButton({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const heights = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32",
    icon: "size-10",
  } as const;

  return <Skeleton className={cn("rounded-xl", heights[size], className)} />;
}

export default Skeleton;
