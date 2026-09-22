"use client";

import Link from "next/link";

import { PageTitle } from "@/components/page-title";
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
    <main className="flex min-h-full w-full flex-1 flex-col gap-10 px-5 py-8 md:px-8 lg:px-10">
      <PageTitle
        title="Overview"
        description="A quick view of your workspace."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <section
            key={stat.label}
            className="rounded-xl border border-border/50 bg-card p-6"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>

            <p className="mt-3 font-display text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
          </section>
        ))}
      </div>

      <section className="w-full">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Recent projects
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The latest projects in your workspace.
            </p>
          </div>

          <Link
            href="/dashboard/projects"
            className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-border/60 px-6 py-10 text-center">
            <div>
              <p className="font-medium">Your workspace is ready.</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a project to start collaborating with your crew.
              </p>
            </div>
          </div>
        ) : (
          <ul className="w-full">
            {projects.slice(0, 5).map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-4 border-b border-border/40 py-4 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {project.code}
                  </span>

                  <span className="truncate font-medium">{project.name}</span>
                </div>

                <span className="shrink-0 text-sm capitalize text-muted-foreground">
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