import { useNavigate } from "react-router";
import { Tasks } from "@/components/features/tasks/tasks";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">Tasks &amp; Priorities</h2>
        <Button onClick={() => navigate("/user/tasks/create")}>
          + New task
        </Button>
      </div>
      <Tasks />
    </div>
  );
}
