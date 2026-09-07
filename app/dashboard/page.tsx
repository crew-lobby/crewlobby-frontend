"use client";

import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useMembers } from "@/features/organization/hooks/use-members";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;

  const { data: projectsData } = useProjects(organizationId);
  const { data: membersData } = useMembers(organizationId);

  const projects = projectsData?.data ?? [];
  const activeCount = projects.filter((p) => p.status === "active").length;
  const completedCount = projects.filter(
    (p) => p.status === "completed",
  ).length;

  const stats = [
    { label: "Active projects", value: activeCount },
    { label: "Completed", value: completedCount },
    { label: "Team members", value: membersData?.total ?? "—" },
  ];

  return (
    <main className="flex min-h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick view of your workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <section
            key={stat.label}
            className="rounded-md border-l-2 border-brass bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-3 font-mono text-3xl">{stat.value}</p>
          </section>
        ))}
      </div>

      <section className="flex-1 rounded-md border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Recent projects
          </h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-signal hover:underline"
          >
            View all
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-1 p-6 text-center">
            <p className="font-medium">Your workspace is ready.</p>
            <p className="text-sm text-muted-foreground">
              Create a project to start collaborating with your crew.
            </p>
          </div>
        ) : (
          <ul>
            {projects.slice(0, 5).map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-4 border-b p-4 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="rounded-sm bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    {project.code}
                  </span>
                  <span className="truncate font-medium">{project.name}</span>
                </div>
                <span className="shrink-0 text-sm text-muted-foreground capitalize">
                  {project.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}