import { ProjectsList } from "@/features/projects/components/projects-list";

export default function ProjectsPage() {
  return (
    <main className="flex min-h-full w-full min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-10">
      <ProjectsList />
    </main>
  );
}