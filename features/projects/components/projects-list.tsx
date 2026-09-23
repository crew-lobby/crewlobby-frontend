"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { LoadingSpinner } from "@/components/loading-spinner";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { Can, CannotMessage } from "@/features/permissions/components/can";
import { usePermissions } from "@/features/permissions/hooks/use-permissions";
import { OrganizationSwitcher } from "@/features/organization/components/organization-switcher";
import {
  createProject,
  deleteProject,
  updateProject,
  useProjects,
} from "@/features/projects/hooks/use-projects";
import {
  projectFormSchema,
  projectPriorityValues,
  projectStatusValues,
  type ProjectFormData,
} from "@/features/projects/schemas/project-schema";
import type { Project } from "@/features/projects/types/project";

const statusAccent: Record<Project["status"], string> = {
  planned: "bg-muted-foreground/50",
  active: "bg-primary",
  on_hold: "bg-amber-500",
  completed: "bg-emerald-500",
  cancelled: "bg-destructive/50",
};

export function ProjectsList() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;

  const { data: permissions } = usePermissions();
  const { data, isPending, isError } = useProjects(organizationId);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const canUpdate =
    permissions?.permissions.project?.includes("update") ?? false;

  const canDelete =
    permissions?.permissions.project?.includes("delete") ?? false;

  async function handleCreate(values: ProjectFormData) {
    setActionError(null);

    try {
      await createProject(values);

      await queryClient.invalidateQueries({
        queryKey: ["projects", organizationId],
      });

      setIsCreating(false);
    } catch {
      setActionError("We couldn't save this project. Please try again.");
    }
  }

  async function handleUpdate(id: string, values: ProjectFormData) {
    setActionError(null);

    try {
      await updateProject(id, values);

      await queryClient.invalidateQueries({
        queryKey: ["projects", organizationId],
      });

      setEditingProject(null);
    } catch {
      setActionError("We couldn't save this project. Please try again.");
    }
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Delete ${project.name}? This cannot be undone.`)) {
      return;
    }

    setActionError(null);

    try {
      await deleteProject(project.id);

      await queryClient.invalidateQueries({
        queryKey: ["projects", organizationId],
      });
    } catch {
      setActionError("We couldn't delete this project. Please try again.");
    }
  }

  if (!organizationId) {
    return (
      <p className="text-sm text-muted-foreground">
        Choose a workspace before managing projects.
      </p>
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Failed to load projects.
      </p>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <PageTitle
            title="Projects"
            description="Keep your organization's work visible and organized."
          />

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
            <OrganizationSwitcher />

            <Can
              action="create"
              resource="project"
              fallback={
                <CannotMessage action="create" resource="project" />
              }
            >
              <Button
                onClick={() => setIsCreating(true)}
                className="rounded-xl"
              >
                New project
              </Button>
            </Can>
          </div>
        </div>

        {actionError && (
          <p role="alert" className="text-sm text-destructive">
            {actionError}
          </p>
        )}

        {!canUpdate && (
          <CannotMessage action="update" resource="project" />
        )}

        {!canDelete && (
          <CannotMessage action="delete" resource="project" />
        )}

        <ul className="w-full min-w-0">
          {data?.data.map((project) => (
            <li
              key={project.id}
              className="flex min-w-0 flex-col gap-4 border-b border-border/40 py-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span
                  className={`size-2.5 shrink-0 rounded-full ${statusAccent[project.status]}`}
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="shrink-0 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {project.code}
                    </span>

                    <p className="min-w-0 break-words font-medium">
                      {project.name}
                    </p>
                  </div>

                  <p className="mt-1 break-words text-sm capitalize text-muted-foreground">
                    {project.status.replace("_", " ")} ·{" "}
                    {project.progressPercent}% complete
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                {canUpdate && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => setEditingProject(project)}
                  >
                    Edit
                  </Button>
                )}

                {canDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => handleDelete(project)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {data?.data.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No projects in this workspace yet.
          </div>
        )}

        {isCreating && (
          <ProjectDialog
            onClose={() => setIsCreating(false)}
            onSave={handleCreate}
          />
        )}

        {editingProject && (
          <ProjectDialog
            project={editingProject}
            onClose={() => setEditingProject(null)}
            onSave={(values) => handleUpdate(editingProject.id, values)}
          />
        )}
      </div>
    </div>
  );
}

type ProjectDialogProps = {
  project?: Project;
  onClose: () => void;
  onSave: (values: ProjectFormData) => Promise<void>;
};

function ProjectDialog({
  project,
  onClose,
  onSave,
}: ProjectDialogProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name ?? "",
      code: project?.code ?? "",
      description: project?.description ?? "",
      status: project?.status ?? "planned",
      priority: project?.priority ?? "medium",
      startDate: project?.startDate?.slice(0, 10) ?? "",
      dueDate: project?.dueDate?.slice(0, 10) ?? "",
      budgetAmount: project?.budgetAmount
        ? Number(project.budgetAmount)
        : undefined,
      currencyCode: project?.currencyCode ?? "USD",
      progressPercent: project?.progressPercent ?? 0,
    },
  });

  async function onSubmit(values: ProjectFormData) {
    await onSave(values);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-dialog-title"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-5 rounded-2xl border border-border/60 bg-background p-6 shadow-xl"
        >
          <div>
            <h2
              id="project-dialog-title"
              className="font-display text-lg font-semibold tracking-tight"
            >
              {project ? "Edit project" : "New project"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {project
                ? "Update the details below."
                : "Add a project to this workspace."}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>

                <FormControl>
                  <textarea
                    {...field}
                    className="min-h-20 w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>

                  <FormControl>
                    <select
                      {...field}
                      className="h-10 w-full rounded-xl border border-border/60 bg-transparent px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {projectStatusValues.map((value) => (
                        <option key={value} value={value}>
                          {value.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>

                  <FormControl>
                    <select
                      {...field}
                      className="h-10 w-full rounded-xl border border-border/60 bg-transparent px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {projectPriorityValues.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>

                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due date</FormLabel>

                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="progressPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress (%)</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      name={field.name}
                      ref={field.ref}
                      value={field.value ?? 0}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const next = event.target.valueAsNumber;

                        field.onChange(
                          Number.isNaN(next) ? 0 : next,
                        );
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      name={field.name}
                      ref={field.ref}
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        if (event.target.value === "") {
                          field.onChange(undefined);
                          return;
                        }

                        const next = event.target.valueAsNumber;

                        field.onChange(
                          Number.isNaN(next) ? undefined : next,
                        );
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>

                  <FormControl>
                    <Input maxLength={3} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-border/40 pt-5">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-xl"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Saving..."
                : "Save project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}