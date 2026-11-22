import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/use-notifications";
import { getErrorMessage } from "@/lib/errors";
import {
  DEFAULT_PREFERENCES,
  getPreferencesService,
  updatePreferencesService,
} from "@/services/settings-service";
import type { Preferences } from "@/services/settings-service";

const TOGGLES = [
  { key: "deadline", label: "Deadline reminders" },
  { key: "class", label: "Class reminders" },
  { key: "priority", label: "Priority changes" },
  { key: "workload", label: "Workload warnings" },
] as const;

export function Notifications() {
  const { items, loading } = useNotifications();
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPreferencesService()
      .then((result) => {
        if (active) setPreferences(result);
      })
      .catch(() => {
        // Keep defaults when preferences cannot be loaded.
      });

    return () => {
      active = false;
    };
  }, []);

  function savePreferences(next: Preferences) {
    const previous = preferences;
    setPreferences(next);
    setError("");

    updatePreferencesService(next)
      .then((saved) => {
        setPreferences(saved);
        window.dispatchEvent(new Event("notifications:refresh"));
      })
      .catch((requestError) => {
        setPreferences(previous);
        setError(getErrorMessage(requestError));
      });
  }

  if (loading) {
    return <Skeleton className="h-[420px] rounded-2xl" />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">Notifications</h2>
          <Badge variant="default">{items.length}</Badge>
        </div>

        {items.length === 0 ? (
          <EmptyState
            className="mt-4"
            title="You are all caught up"
            description="Deadline, priority and workload alerts will appear here."
          />
        ) : (
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-line p-3"
              >
                <span
                  className={
                    item.tone === "danger"
                      ? "mt-1.5 size-2 shrink-0 rounded-full bg-high"
                      : item.tone === "warning"
                        ? "mt-1.5 size-2 shrink-0 rounded-full bg-med"
                        : "mt-1.5 size-2 shrink-0 rounded-full bg-brand"
                  }
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs text-ink-2">{item.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-bold text-ink">Notification settings</h2>
        <p className="mt-1 text-xs text-ink-3">
          Choose what you get reminded about.
        </p>

        <ul className="mt-4 space-y-3">
          {TOGGLES.map((toggle) => (
            <li key={toggle.key}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-2">
                    <input
                      type="checkbox"
                      checked={preferences[toggle.key]}
                      onChange={(event) =>
                        savePreferences({
                          ...preferences,
                          [toggle.key]: event.target.checked,
                        })
                      }
                      className="size-4 rounded border-line accent-brand"
                    />
                {toggle.label}
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <p className="mb-1.5 text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
            Remind me
          </p>
          <Select
            value={preferences.timing}
            onChange={(event) =>
              savePreferences({
                ...preferences,
                timing: event.target.value as Preferences["timing"],
              })
            }
          >
            <option value="30m">30 minutes before</option>
            <option value="1h">1 hour before</option>
            <option value="1d">1 day before</option>
            <option value="3d">3 days before</option>
          </Select>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-xs text-high">
            {error}
          </p>
        )}

        <p className="mt-4 text-[11px] text-ink-3">
          Preferences are saved to your account.
        </p>
      </Card>
    </div>
  );
}
