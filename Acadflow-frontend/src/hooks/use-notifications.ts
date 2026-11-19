import { useEffect, useMemo, useState } from "react";
import { buildNotifications } from "@/lib/notifications";
import type { Task } from "@/lib/priority";
import { getTasksService } from "@/services/task-service";

export function useNotifications() {
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    let active = true;

    getTasksService()
      .then((result) => {
        if (active) setTasks(result);
      })
      .catch(() => {
        if (active) setTasks([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const items = useMemo(
    () => (tasks === null ? [] : buildNotifications(tasks)),
    [tasks],
  );

  return {
    items,
    count: items.length,
    loading: tasks === null,
  };
}
