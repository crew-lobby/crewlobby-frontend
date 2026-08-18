import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ProjectsList } from "@/features/projects/components/projects-list";

export default function ProjectsPage() {
  return (
    <AuthGuard>
      <main className="mx-auto max-w-3xl p-8">
        <ProjectsList />
      </main>
    </AuthGuard>
  );
}