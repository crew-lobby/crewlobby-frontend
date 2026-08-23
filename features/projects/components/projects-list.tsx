"use client";

import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { usePermissions } from "@/features/permissions/hooks/use-permissions";
import { Can, CannotMessage } from "@/features/permissions/components/can";
import { createProject, deleteProject, updateProject, useProjects } from "@/features/projects/hooks/use-projects";
import type { Project, ProjectInput, ProjectPriority, ProjectStatus } from "@/features/projects/types/project";

const statuses: ProjectStatus[] = ["planned", "active", "on_hold", "completed", "cancelled"];
const priorities: ProjectPriority[] = ["low", "medium", "high", "critical"];

export function ProjectsList() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId;
  const { data: permissions } = usePermissions();
  const { data, isPending, isError } = useProjects(organizationId ?? undefined);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const canUpdate = permissions?.permissions.project?.includes("update") ?? false;
  const canDelete = permissions?.permissions.project?.includes("delete") ?? false;

  async function saveProject(values: ProjectInput, id?: string) {
    setActionError(null);
    try {
      if (id) await updateProject(id, values);
      else await createProject(values);
      await queryClient.invalidateQueries({ queryKey: ["projects", organizationId] });
      setEditingProject(null); setIsCreating(false);
    } catch { setActionError("We couldn't save this project. Please try again."); }
  }

  async function removeProject(project: Project) {
    if (!window.confirm(`Delete ${project.name}? This cannot be undone.`)) return;
    setActionError(null);
    try {
      await deleteProject(project.id);
      await queryClient.invalidateQueries({ queryKey: ["projects", organizationId] });
    } catch { setActionError("We couldn't delete this project. Please try again."); }
  }

  if (!organizationId) return <p className="text-sm text-muted-foreground">Choose a workspace before managing projects.</p>;
  if (isPending) return <p>Loading projects...</p>;
  if (isError) return <p>Failed to load projects.</p>;

  return <div className="space-y-5">
    <div className="flex items-center justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight">Projects</h1><p className="mt-1 text-sm text-muted-foreground">Keep your organization&apos;s work visible and organized.</p></div><Can action="create" resource="project" fallback={<CannotMessage action="create" resource="project" />}><Button onClick={() => setIsCreating(true)}>New project</Button></Can></div>
    {actionError ? <p role="alert" className="text-sm text-destructive">{actionError}</p> : null}
    {!canUpdate ? <CannotMessage action="update" resource="project" /> : null}
    {!canDelete ? <CannotMessage action="delete" resource="project" /> : null}
    <ul className="space-y-3">{data?.data.map((project) => <li key={project.id} className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm"><div className="min-w-0"><p className="font-medium">{project.name}</p><p className="mt-1 text-sm text-muted-foreground">{project.code} · {project.status.replace("_", " ")} · {project.progressPercent}% complete</p></div><div className="flex shrink-0 gap-2">{canUpdate ? <Button variant="outline" size="sm" onClick={() => setEditingProject(project)}>Edit</Button> : null}{canDelete ? <Button variant="destructive" size="sm" onClick={() => removeProject(project)}>Delete</Button> : null}</div></li>)}</ul>
    {data?.data.length === 0 ? <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">No projects in this workspace yet.</div> : null}
    {isCreating ? <ProjectDialog onClose={() => setIsCreating(false)} onSave={saveProject} /> : null}
    {editingProject ? <ProjectDialog project={editingProject} onClose={() => setEditingProject(null)} onSave={(values) => saveProject(values, editingProject.id)} /> : null}
  </div>;
}

function ProjectDialog({ project, onClose, onSave }: { project?: Project; onClose: () => void; onSave: (values: ProjectInput) => Promise<void> }) {
  const [isSaving, setIsSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); setIsSaving(true); await onSave({ name: String(form.get("name")), code: String(form.get("code")), description: String(form.get("description")) || undefined, status: String(form.get("status")) as ProjectStatus, priority: String(form.get("priority")) as ProjectPriority, startDate: String(form.get("startDate")) || undefined, dueDate: String(form.get("dueDate")) || undefined, budgetAmount: form.get("budgetAmount") ? Number(form.get("budgetAmount")) : undefined, currencyCode: String(form.get("currencyCode")) || undefined, progressPercent: Number(form.get("progressPercent") || 0) }); setIsSaving(false); }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title"><form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-xl border bg-background p-6 shadow-xl"><div><h2 id="project-dialog-title" className="text-lg font-semibold">{project ? "Edit project" : "New project"}</h2><p className="mt-1 text-sm text-muted-foreground">{project ? "Update the details below." : "Add a project to this workspace."}</p></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Project name"><Input name="name" defaultValue={project?.name} required /></Field><Field label="Code"><Input name="code" defaultValue={project?.code} required /></Field></div><Field label="Description"><textarea name="description" defaultValue={project?.description ?? ""} className="min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50" /></Field><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Status" name="status" values={statuses} defaultValue={project?.status ?? "planned"} /><SelectField label="Priority" name="priority" values={priorities} defaultValue={project?.priority ?? "medium"} /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Start date"><Input name="startDate" type="date" defaultValue={project?.startDate?.slice(0, 10)} /></Field><Field label="Due date"><Input name="dueDate" type="date" defaultValue={project?.dueDate?.slice(0, 10)} /></Field></div><div className="grid gap-4 sm:grid-cols-3"><Field label="Progress (%)"><Input name="progressPercent" type="number" min="0" max="100" defaultValue={project?.progressPercent ?? 0} /></Field><Field label="Budget"><Input name="budgetAmount" type="number" min="0" step="0.01" defaultValue={project?.budgetAmount ?? ""} /></Field><Field label="Currency"><Input name="currencyCode" maxLength={3} defaultValue={project?.currencyCode ?? "USD"} /></Field></div><div className="flex justify-end gap-3 pt-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save project"}</Button></div></form></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium">{label}{children}</label>; }
function SelectField({ label, name, values, defaultValue }: { label: string; name: string; values: readonly string[]; defaultValue: string }) { return <label className="grid gap-1.5 text-sm font-medium">{label}<select name={name} defaultValue={defaultValue} className="h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">{values.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}</select></label>; }
