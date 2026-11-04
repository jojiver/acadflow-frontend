import type { TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-line bg-surface">
      <table
        className={cn(
          "w-full text-left text-sm [&_tbody_tr]:border-t [&_tbody_tr]:border-line [&_td]:px-5 [&_td]:py-4 [&_th]:px-5 [&_th]:py-4 [&_th]:font-semibold [&_thead]:bg-brand-tint",
          className,
        )}
        {...props}
      />
    </div>
  );
}
