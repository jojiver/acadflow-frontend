import { useEffect, useMemo, useState } from "react";
import { buildNotifications } from "@/lib/notifications";
import type { Task } from "@/lib/priority";
import { getPreferencesService } from "@/services/settings-service";
import type { Preferences } from "@/services/settings-service";
import { getTasksService } from "@/services/task-service";

export function useNotifications() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    function handleRefresh() {
      setReload((value) => value + 1);
    }

    window.addEventListener("notifications:refresh", handleRefresh);

    return () => {
      window.removeEventListener("notifications:refresh", handleRefresh);
    };
  }, []);

  useEffect(() => {
    let active = true;

    Promise.all([
      getTasksService(),
      getPreferencesService().catch(() => null),
    ])
      .then(([taskList, preferenceList]) => {
        if (!active) return;
        setTasks(taskList);
        setPreferences(preferenceList);
      })
      .catch(() => {
        if (active) setTasks([]);
      });

    return () => {
      active = false;
    };
  }, [reload]);

  const items = useMemo(
    () => (tasks === null ? [] : buildNotifications(tasks, preferences ?? undefined)),
    [preferences, tasks],
  );

  return {
    items,
    count: items.length,
    loading: tasks === null,
  };
}
