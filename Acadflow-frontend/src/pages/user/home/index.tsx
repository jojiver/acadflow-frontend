import { PageHeader } from "@/components/common/page-header";
import { Dashboard } from "@/components/features/dashboard/dashboard";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/components/context/use-auth";

export default function UserHomePage() {
  const { user } = useAuth();

  return (
    <Section>
      <PageHeader
        eyebrow="Dashboard"
        title={`Good day, ${user?.name ?? "student"}`}
        description="Here is what needs your attention today."
      />
      <Dashboard />
    </Section>
  );
}
