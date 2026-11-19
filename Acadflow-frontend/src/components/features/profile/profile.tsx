import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/context/use-auth";
import { getSubjectsService } from "@/services/subject-service";
import type { Subject } from "@/services/subject-service";
import { getTasksService } from "@/services/task-service";
import type { Task } from "@/lib/priority";

export function Profile() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    let active = true;

    Promise.all([getTasksService(), getSubjectsService()])
      .then(([taskList, subjectList]) => {
        if (!active) return;
        setTasks(taskList);
        setSubjects(subjectList);
      })
      .catch(() => {
        if (active) setTasks([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const completed = (tasks ?? []).filter((task) => task.completedAt).length;
  const high = (tasks ?? []).filter((task) => task.priority.level === "High").length;

  const fields = [
    ["Program", user?.program || "Not set"],
    ["Year level", user?.yearLevel || "Not set"],
    ["Email", user?.email || "Not set"],
  ];

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-5">
          <span className="grid size-16 place-items-center rounded-2xl bg-brand-dark text-xl font-bold text-white">
            {(user?.name ?? "Student")
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-ink">
              {user?.name ?? "Student"}
            </h2>
            <p className="mt-0.5 text-sm text-ink-2">{user?.email}</p>
            <div className="mt-2">
              <Badge variant="default">Student</Badge>
            </div>
          </div>
          <Link
            to="/user/settings"
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Edit in settings →
          </Link>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-brand-tint p-4">
              <dt className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {tasks === null ? (
        <Skeleton className="h-32 rounded-2xl" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Tasks completed" value={completed} />
          <Stat label="Subjects" value={subjects.length} />
          <Stat label="High priority" value={high} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <p className="text-[11px] font-bold tracking-[0.06em] text-ink-3 uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
    </Card>
  );
}
