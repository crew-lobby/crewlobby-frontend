"use client";

import { useProjects } from "@/features/projects/hooks/use-projects";
import { usePermissions } from "@/features/permissions/hooks/use-permissions";
import { Can, CannotMessage } from "@/features/permissions/components/can";
import { Button } from "@/components/ui/button";

export function ProjectsList() {
  const { data: permissions } = usePermissions();
  const { data, isPending, isError } = useProjects();

  const canUpdate = permissions?.permissions.project?.includes("update") ?? false;
  const canDelete = permissions?.permissions.project?.includes("delete") ?? false;

  if (isPending) return <p>Loading projects...</p>;
  if (isError) return <p>Failed to load projects.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Projects</h1>
        <Can
          action="create"
          resource="project"
          fallback={<CannotMessage action="create" resource="project" />}
        >
          <Button>New project</Button>
        </Can>
      </div>

      {!canUpdate && !canDelete && (
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to update or delete projects.
        </p>
      )}

      <ul className="space-y-2">
        {data?.data.map((project) => (
          <li
            key={project.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <p className="font-medium">{project.name}</p>
              <p className="text-sm text-muted-foreground">
                {project.code} — {project.status}
              </p>
            </div>
            <div className="flex gap-2">
              {canUpdate && (
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              )}
              { canDelete && (
                <Button variant="primary" size="sm">
                  Delete
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}