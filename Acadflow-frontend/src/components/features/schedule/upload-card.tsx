import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ImportSummary } from "@/services/schedule-service";

type UploadCardProps = {
  file: File | null;
  busy: boolean;
  error: string;
  summary: ImportSummary | null;
  onFile: (file: File) => void;
  onReject: (message: string) => void;
  onReset: () => void;
};

const MAX_SIZE = 10 * 1024 * 1024;

/** Formats a byte count for display. */
function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Renders the UploadCard component. */
export function UploadCard({
  file,
  busy,
  error,
  summary,
  onFile,
  onReject,
  onReset,
}: UploadCardProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (files[0]) onFile(files[0]);
    },
    onDropRejected: (rejections) => {
      const code = rejections[0]?.errors[0]?.code;
      onReject(
        code === "file-too-large"
          ? "That file is larger than 10 MB."
          : "Upload a PDF, JPG, or PNG timetable.",
      );
    },
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: MAX_SIZE,
    multiple: false,
    disabled: busy,
  });

  return (
    <Card className="flex flex-col gap-3.5 p-[18px]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-ink">Source file</h2>
        <button
          type="button"
          className="cursor-pointer text-[10px] font-semibold text-brand"
        >
          Can&apos;t read your file?
        </button>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "flex h-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed px-4 text-center transition-colors",
          isDragActive
            ? "border-brand-dark bg-brand-tint"
            : "border-[#CBD5E1] bg-[#F8FAFC]",
          busy && "cursor-wait opacity-70",
        )}
      >
        <input {...getInputProps()} />
        <span className="grid size-10 place-items-center rounded-full bg-brand-tint text-[17px] font-bold text-ink">
          +
        </span>
        <p className="text-[13px] font-semibold text-ink">
          {isDragActive ? "Drop it here" : "Drop timetable image or PDF"}
        </p>
        <p className="text-[11px] text-ink-3">PNG, JPG, PDF - up to 10 MB</p>
        <span className="rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-ink">
          Browse files
        </span>
      </div>

      {error && (
        <p role="alert" className="text-[12px] text-high">
          {error}
        </p>
      )}

      {file && (
        <div className="flex items-center gap-2.5 rounded-lg bg-[#F8FAFC] p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-tint text-[10px] font-bold text-ink">
            {file.name.split(".").pop()?.toUpperCase() ?? "FILE"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold text-ink">
              {file.name}
            </p>
            <p className="text-[11px] text-ink-3">
              {formatBytes(file.size)} -{" "}
              {busy ? "extracting classes" : summary ? "parsed" : "ready"}
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            disabled={busy}
            aria-label="Remove file"
            className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-full bg-brand-tint text-xs text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            x
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        <p className="text-[10px] font-bold tracking-[0.08em] text-ink-3 uppercase">
          Parsing summary
        </p>
        {[
          ["Classes detected", summary?.classes],
          ["Subjects matched", summary?.subjects],
          ["Conflicts found", summary?.conflicts],
          ["Duplicates merged", summary?.duplicates],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between text-[12.5px]"
          >
            <span className="text-ink-2">{label}</span>
            <span className="font-bold text-ink">{value ?? "-"}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-brand-tint p-3">
        <p className="text-[12.5px] font-bold text-ink">Nothing is saved yet</p>
        <p className="mt-0.5 text-[11.5px] leading-[17px] text-ink-2">
          We show every detected class for review. Import only happens after
          you confirm.
        </p>
      </div>

      <div className="rounded-lg bg-[#F8FAFC] p-3.5">
        <p className="text-[10px] font-bold tracking-[0.08em] text-ink-3 uppercase">
          What happens next
        </p>
        <ul className="mt-2 space-y-2 text-[11.5px] leading-[17px] text-ink-2">
          <li>1 - Selected classes are added to Schedule</li>
          <li>2 - Missing subjects are created with colors</li>
          <li>3 - Everything stays editable after import</li>
        </ul>
      </div>
    </Card>
  );
}
