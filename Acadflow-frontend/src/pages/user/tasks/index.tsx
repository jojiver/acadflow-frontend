import { PageHeader } from "@/components/common/page-header";
import { Tasks } from "@/components/features/tasks/tasks";
import { Section } from "@/components/ui/section";

export default function TasksPage() {
  return (
    <Section>
      <PageHeader
        eyebrow="Tasks"
        title="Tasks & Priorities"
        description="One list, ranked automatically. Filter by priority level."
      />
      <Tasks />
    </Section>
  );
}
