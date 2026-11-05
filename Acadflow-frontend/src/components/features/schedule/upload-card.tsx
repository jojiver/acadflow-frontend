import { Card } from "@/components/ui/card";

export function UploadCard() {
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

      <div className="flex h-[150px] flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 text-center">
        <span className="grid size-10 place-items-center rounded-full bg-brand-tint text-[17px] font-bold text-ink">
          ⬆
        </span>
        <p className="text-[13px] font-semibold text-ink">
          Drop timetable image or PDF
        </p>
        <p className="text-[11px] text-ink-3">PNG, JPG, PDF · up to 10 MB</p>
        <span className="rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-ink">
          Browse files
        </span>
      </div>

      <div className="flex items-center gap-2.5 rounded-lg bg-[#F8FAFC] p-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-tint text-sm text-ink">
          ▤
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-ink">
            BSIT-2A_Timetable.pdf
          </p>
          <p className="text-[11px] text-ink-3">
            1.2 MB · 2 pages · parsed
          </p>
        </div>
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-xs text-ink">
          ✓
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-bold tracking-[0.08em] text-ink-3 uppercase">
          Parsing summary
        </p>
        {[
          ["Classes detected", "14"],
          ["Subjects matched", "6"],
          ["Conflicts found", "2"],
          ["Duplicates merged", "1"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between text-[12.5px]"
          >
            <span className="text-ink-2">{label}</span>
            <span className="font-bold text-ink">{value}</span>
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
          <li>1 · The 12 selected classes are added to Schedule</li>
          <li>2 · Missing subjects are created with colors</li>
          <li>3 · Everything stays editable after import</li>
        </ul>
      </div>
    </Card>
  );
}
