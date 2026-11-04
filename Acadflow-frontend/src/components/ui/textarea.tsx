import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea
        className={cn(
          "w-full rounded-[10px] border bg-surface px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-brand focus:ring-2 focus:ring-brand/15",
          error ? "border-high" : "border-line",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-high">{error}</p>}
    </div>
  );
}
