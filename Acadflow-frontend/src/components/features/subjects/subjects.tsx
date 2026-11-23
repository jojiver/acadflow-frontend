import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { getErrorMessage } from "@/lib/errors";
import {
  createSubjectService,
  deleteSubjectService,
  getSubjectsService,
  updateSubjectService,
} from "@/services/subject-service";
import type {
  Subject,
  SubjectCategory,
  SubjectInput,
} from "@/services/subject-service";
import { SubjectForm } from "./subject-form";

const TABS = ["All", "Core", "Electives", "Archived"] as const;
type Tab = (typeof TABS)[number];

const GROUPS: { category: SubjectCategory; label: string }[] = [
  { category: "Core", label: "Core subjects" },
  { category: "Elective", label: "Electives" },
  { category: "Archived", label: "Archived" },
];

const LEVEL_VARIANT = {
  High: "high",
  Medium: "medium",
  Low: "low",
} as const;

const PRIORITY_RANK = {
  High: 3,
  Medium: 2,
  Low: 1,
} as const;

const SORTS = [
  { value: "progress", label: "Sort: Progress (high to low)" },
  { value: "priority", label: "Sort: Priority (high to low)" },
  { value: "due", label: "Sort: Due soon" },
  { value: "tasks", label: "Sort: Most tasks" },
  { value: "name", label: "Sort: Name (A-Z)" },
] as const;

type SortKey = (typeof SORTS)[number]["value"];

/** Renders the Subjects component. */
export function Subjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [tab, setTab] = useState<Tab>("All");
  const [sort, setSort] = useState<SortKey>("progress");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  /** Handles load in subjects.tsx. */
  async function load() {
    const result = await getSubjectsService();
    setSubjects(result);
  }

  useEffect(function fetchSubjects() {
    let active = true;

    getSubjectsService()
      .then((result) => {
        if (active) setSubjects(result);
      })
      .catch(() => {
        if (active) setSubjects([]);
      });

    /** Marks an async effect as inactive on unmount. */
    function cleanup() {
      active = false;
    }

    return cleanup;
  }, []);

  const counts = useMemo(() => {
    const list = subjects ?? [];
    return {
      All: list.length,
      Core: list.filter((item) => item.category === "Core").length,
      Electives: list.filter((item) => item.category === "Elective").length,
      Archived: list.filter((item) => item.category === "Archived").length,
    };
  }, [subjects]);

  const filtered = useMemo(() => {
    let list = subjects ?? [];

    if (tab === "Core") {
      list = list.filter((item) => item.category === "Core");
    } else if (tab === "Electives") {
      list = list.filter((item) => item.category === "Elective");
    } else if (tab === "Archived") {
      list = list.filter((item) => item.category === "Archived");
    }

    if (searchQuery) {
      list = list.filter((item) =>
        [item.name, item.instructor, item.room, item.schedule].some((value) =>
          value?.toLowerCase().includes(searchQuery),
        ),
      );
    }

    return list;
  }, [subjects, tab, searchQuery]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const byName = (a: Subject, b: Subject) => a.name.localeCompare(b.name);

    switch (sort) {
      case "priority":
        list.sort(
          (a, b) =>
            PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] ||
            b.dueNow - a.dueNow ||
            byName(a, b),
        );
        break;
      case "due":
        list.sort(
          (a, b) =>
            b.dueNow - a.dueNow ||
            PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] ||
            byName(a, b),
        );
        break;
      case "tasks":
        list.sort(
          (a, b) =>
            b.tasks - a.tasks ||
            b.progress - a.progress ||
            byName(a, b),
        );
        break;
      case "name":
        list.sort(byName);
        break;
      default:
        list.sort(
          (a, b) =>
            b.progress - a.progress ||
            PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] ||
            byName(a, b),
        );
    }

    return list;
  }, [filtered, sort]);

  const active = (subjects ?? []).filter(
    (item) => item.category !== "Archived",
  );
  const needsAttention = active.filter((item) => item.dueNow > 0).length;
  const onTrack = active.filter((item) => item.progress >= 60).length;
  const needsReview = active.filter(
    (item) => item.dueNow > 0 && item.progress < 100,
  ).length;
  const noUpcoming = active.filter((item) => item.dueNow === 0).length;

  /** Opens the subject form in create mode. */
  function openCreate() {
    setEditing(null);
    setFormError("");
    setFormOpen(true);
  }

  /** Opens the subject form in edit mode. */
  function openEdit(subject: Subject) {
    setEditing(subject);
    setFormError("");
    setFormOpen(true);
  }

  /** Handles handle save in subjects.tsx. */
  async function handleSave(input: SubjectInput) {
    setBusy(true);
    setFormError("");
    try {
      if (editing) {
        await updateSubjectService(editing.id, input);
      } else {
        await createSubjectService(input);
      }
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  /** Handles handle delete in subjects.tsx. */
  async function handleDelete(id: string) {
    setBusy(true);
    setError("");
    try {
      await deleteSubjectService(id);
      setConfirmId(null);
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  if (subjects === null) {
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <Skeleton className="h-[720px] rounded-2xl" />
        <div className="space-y-5">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="text-sm text-high">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                tab === item
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-surface text-ink-2 hover:bg-brand-tint",
              )}
            >
              {item}
              {item !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">
                  {counts[item]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Select
            aria-label="Sort subjects"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="h-10 w-[200px] rounded-xl text-[13px]"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button className="h-10 rounded-xl px-4 text-[13px]" onClick={openCreate}>
            + New subject
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <Card className="p-[18px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-ink">My subjects</h2>
            <div className="flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="cursor-pointer rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-2 hover:bg-brand-tint"
                >
                  Clear search
                </button>
              )}
              <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-ink-2">
                {filtered.length} of {subjects.length} shown
              </span>
            </div>
          </div>

          {GROUPS.map((group) => {
            const rows = sorted.filter(
              (item) => item.category === group.category,
            );
            if (rows.length === 0) return null;

            return (
              <div key={group.category} className="mt-5">
                <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
                  {group.label}
                </p>
                <ul className="mt-2 space-y-2">
                  {rows.map((subject) => (
                    <li key={subject.id}>
                      <div className="group flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 transition-colors hover:border-brand/30 hover:bg-brand-tint/60">
                        <span className="size-4 shrink-0 rounded border border-line" />
                        <span className="size-2 shrink-0 rounded-sm bg-brand" />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink group-hover:text-brand-dark">
                            {subject.name}
                          </p>
                          <p className="truncate text-[11px] text-ink-3">
                            {subject.tasks} tasks · {subject.instructor} ·{" "}
                            {subject.room} · {subject.schedule}
                            {subject.dueNow > 0
                              ? ` · ${subject.dueNow} due`
                              : subject.progress >= 100
                                ? " · done"
                                : ""}
                          </p>
                        </div>

                        <div className="flex w-[120px] shrink-0 items-center gap-2">
                          <ProgressBar
                            className="flex-1"
                            value={subject.progress}
                            tone="slate"
                          />
                          <span className="w-9 text-right text-[11px] font-semibold text-ink-2">
                            {subject.progress}%
                          </span>
                        </div>

                        <Badge variant={LEVEL_VARIANT[subject.priority]}>
                          {subject.priority}
                        </Badge>

                        <div className="flex w-[72px] shrink-0 justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                          <button
                            type="button"
                            onClick={() => openEdit(subject)}
                            aria-label={`Edit ${subject.name}`}
                            title="Edit subject"
                            className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-2 transition-colors hover:bg-white hover:text-brand-dark"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(subject.id)}
                            aria-label={`Delete ${subject.name}`}
                            title="Delete subject"
                            className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-2 transition-colors hover:bg-[#FEE2E2] hover:text-high"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="mt-6 rounded-xl border border-dashed border-line px-6 py-10 text-center text-sm text-ink-3">
              No subjects in this filter.
            </p>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-[18px]">
            <h2 className="text-sm font-bold text-ink">Today at a glance</h2>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[34px] leading-none font-bold text-brand">
                {needsAttention}
              </span>
              <span className="pb-1 text-xs text-ink-2">
                of {active.length} subjects need attention today
              </span>
            </div>
            <ProgressBar
              className="mt-3"
              value={
                active.length === 0 ? 0 : (needsAttention / active.length) * 100
              }
              tone="slate"
            />
            <ul className="mt-3 space-y-2 text-xs">
              <LegendRow
                dot="bg-brand"
                label="On track"
                value={onTrack}
              />
              <LegendRow
                dot="bg-med"
                label="Needs review"
                value={needsReview}
              />
              <LegendRow
                dot="bg-ink-3"
                label="No upcoming work"
                value={noUpcoming}
              />
            </ul>
          </Card>

          <Card className="p-[18px]">
            <h2 className="text-sm font-bold text-ink">
              Open subjects by module
            </h2>
            <ul className="mt-3 space-y-3">
              {active.map((subject) => (
                <li key={subject.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex min-w-0 items-center gap-2 text-ink">
                      <span className="size-2 shrink-0 rounded-sm bg-brand" />
                      <span className="truncate">{subject.name}</span>
                    </span>
                    <span className="shrink-0 font-bold text-ink-2">
                      {subject.tasks}
                    </span>
                  </div>
                  <ProgressBar
                    className="mt-1.5"
                    value={Math.min(100, (subject.tasks / 5) * 100)}
                    tone="slate"
                  />
                </li>
              ))}
            </ul>
          </Card>

        </div>
      </div>

      <SubjectForm
        key={`${editing?.id ?? "new"}-${formOpen ? "open" : "closed"}`}
        open={formOpen}
        initial={editing}
        busy={busy}
        error={formError}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
      />

      <Modal
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete this subject?"
      >
        <p className="text-sm text-ink-2">
          This subject no longer appears in your subjects, schedule, tasks, or
          calendar.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            className="bg-high hover:bg-[#DC2626]"
            disabled={busy}
            onClick={() => confirmId && handleDelete(confirmId)}
          >
            {busy ? "Deleting…" : "Delete subject"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/** Renders the Pencil icon. */
function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

/** Renders the Trash icon. */
function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

/** Renders the LegendRow component. */
function LegendRow({
  dot,
  label,
  value,
}: {
  dot: string;
  label: string;
  value: number;
}) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-2">
        <span className={cn("size-2 rounded-full", dot)} />
        {label}
      </span>
      <span className="font-bold text-ink">{value}</span>
    </li>
  );
}
