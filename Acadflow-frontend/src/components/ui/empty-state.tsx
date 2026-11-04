import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[20px] border border-dashed border-line bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="mb-3 text-ink-3">{icon}</div>}
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ink-2">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
