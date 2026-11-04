import { useNavigate } from "react-router";
import { ProductivityPanel } from "@/components/features/productivity/productivity-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockTasks } from "@/lib/mock-tasks";
import { calculatePriority } from "@/lib/priority";

// Owns the dashboard recommendation and summary widgets.
export function Dashboard() {
  const navigate = useNavigate();

  const next = mockTasks
    .filter((task) => !task.completedAt && task.progress < 100)
    .map((task) => ({ task, priority: calculatePriority(task) }))
    .sort((a, b) => b.priority.score - a.priority.score)[0];

  return (
    <div className="space-y-6">
      {next && (
        <Card className="p-6">
          <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
            Next recommended task
          </p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-ink">
                {next.task.title}
              </h2>
              <p className="mt-1 text-sm text-ink-2">
                {next.task.subject} · {next.task.type}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  next.priority.level === "High"
                    ? "high"
                    : next.priority.level === "Medium"
                      ? "medium"
                      : "low"
                }
              >
                {next.priority.score}/100
              </Badge>
              <Button
                variant="secondary"
                onClick={() => navigate("/user/tasks")}
              >
                View tasks
              </Button>
            </div>
          </div>
        </Card>
      )}

      <ProductivityPanel tasks={mockTasks} />
    </div>
  );
}
