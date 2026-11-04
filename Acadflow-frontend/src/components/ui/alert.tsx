import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "success" | "warning" | "danger";

const TONES: Record<AlertTone, string> = {
  info: "border-line bg-brand-tint text-brand",
  success: "border-low/20 bg-[#DCFCE7] text-brand-dark",
  warning: "border-med/30 bg-[#FEF3C7] text-[#92400E]",
  danger: "border-high/30 bg-[#FEE2E2] text-[#991B1B]",
};

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function Alert({
  tone = "info",
  title,
  icon,
  action,
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border p-3.5 text-sm",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && (
          <div className={cn("opacity-90", title && "mt-0.5")}>{children}</div>
        )}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
