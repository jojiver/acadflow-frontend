import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { getErrorMessage } from "@/lib/errors";
import {
  confirmScheduleImportService,
  previewScheduleImportService,
} from "@/services/schedule-service";
import type {
  ImportConfirmResult,
  ImportSummary,
  ImportedClass,
} from "@/services/schedule-service";
import { ReviewCard } from "./review-card";
import { UploadCard } from "./upload-card";

type StepState = "done" | "active" | "todo";

export function ScheduleImport() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportedClass[] | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [result, setResult] = useState<ImportConfirmResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const selectedCount = rows?.filter((row) => row.selected).length ?? 0;
  const conflicts =
    rows?.filter((row) => row.conflict).length ?? summary?.conflicts ?? 0;

  async function handleFile(nextFile: File) {
    setFile(nextFile);
    setRows(null);
    setSummary(null);
    setResult(null);
    setUploadError("");
    setConfirmError("");
    setBusy(true);

    try {
      const preview = await previewScheduleImportService(nextFile);
      setRows(preview.classes);
      setSummary(preview.summary);
    } catch (requestError) {
      setUploadError(getErrorMessage(requestError));
      setRows([]);
    } finally {
      setBusy(false);
    }
  }

  function handleReject(message: string) {
    setUploadError(message);
  }

  function handleReset() {
    setFile(null);
    setRows(null);
    setSummary(null);
    setResult(null);
    setUploadError("");
    setConfirmError("");
  }

  function toggleRow(id: string) {
    setRows((current) =>
      current?.map((row) =>
        row.id === id ? { ...row, selected: !row.selected } : row,
      ) ?? current,
    );
  }

  function toggleAll(selected: boolean) {
    setRows((current) =>
      current?.map((row) => ({ ...row, selected })) ?? current,
    );
  }

  function updateSubject(id: string, subject: string) {
    setRows((current) =>
      current?.map((row) => (row.id === id ? { ...row, subject } : row)) ??
      current,
    );
  }

  async function handleConfirm() {
    if (!rows || selectedCount === 0) {
      setConfirmError("Select at least one class to import.");
      return;
    }

    setBusy(true);
    setConfirmError("");

    try {
      const confirmed = await confirmScheduleImportService(rows);
      setResult(confirmed);
    } catch (requestError) {
      setConfirmError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  const steps: {
    n: number;
    title: string;
    meta: string;
    state: StepState;
  }[] = [
    {
      n: 1,
      title: "Upload timetable",
      meta: file?.name ?? "No file yet",
      state: file ? "done" : "active",
    },
    {
      n: 2,
      title: "Review classes",
      meta: rows ? `${rows.length} classes detected` : "Waiting for a file",
      state: rows ? (result ? "done" : "active") : "todo",
    },
    {
      n: 3,
      title: "Confirm import",
      meta: result ? `${result.created} classes added` : "Nothing saved yet",
      state: result ? "done" : "todo",
    },
  ];

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-center gap-6 p-5">
        {steps.map((step, index) => (
          <div key={step.n} className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-xs font-semibold",
                  step.state === "todo"
                    ? "border border-line bg-surface text-ink-3"
                    : "bg-brand-dark text-white",
                )}
              >
                {step.state === "done" ? "OK" : step.n}
              </span>
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    step.state === "todo" ? "text-ink-3" : "text-ink",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-ink-3">{step.meta}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <span className="hidden h-px w-12 bg-line sm:block" />
            )}
          </div>
        ))}
      </Card>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <UploadCard
          file={file}
          busy={busy}
          error={uploadError}
          summary={summary}
          onFile={handleFile}
          onReject={handleReject}
          onReset={handleReset}
        />
        {rows === null && busy ? (
          <Skeleton className="h-[740px] rounded-2xl" />
        ) : (
          <ReviewCard
            rows={rows ?? []}
            fileName={file?.name}
            onToggle={toggleRow}
            onToggleAll={toggleAll}
            onSubjectChange={updateSubject}
          />
        )}
      </div>

      {result ? (
        <Card className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-semibold text-ink">
              Import complete
            </p>
            <p className="text-xs text-ink-3">
              {result.created} classes added
              {result.subjectsCreated > 0
                ? `, ${result.subjectsCreated} subjects created`
                : ""}
              {result.skipped > 0 ? `, ${result.skipped} skipped` : ""}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" className="h-11 px-5" onClick={handleReset}>
              Import another
            </Button>
            <Button
              className="h-11 bg-brand-dark px-5 hover:bg-brand"
              onClick={() => navigate("/user/schedule")}
            >
              View schedule
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "mt-1.5 size-2 shrink-0 rounded-full",
                conflicts > 0 ? "bg-high" : "bg-ink",
              )}
            />
            <div>
              <p className="text-sm font-semibold text-ink">
                {conflicts > 0
                  ? `${conflicts} conflicts need attention`
                  : "Ready to import"}
              </p>
              <p className="text-xs text-ink-3">
                {conflicts > 0
                  ? "Fix or untick the flagged classes, then confirm the import."
                  : "Review the detected classes, then confirm the import."}
              </p>
              {confirmError && (
                <p role="alert" className="mt-1 text-xs text-high">
                  {confirmError}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="h-11 px-5"
              onClick={handleReset}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              className="h-11 bg-brand-dark px-5 hover:bg-brand"
              onClick={handleConfirm}
              disabled={busy || selectedCount === 0}
            >
              {busy ? "Importing..." : `Confirm import (${selectedCount})`}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
