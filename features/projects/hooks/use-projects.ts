"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ProjectInput, ProjectsResponse } from "@/features/projects/types/project";

export function useProjects(organizationId?: string) {
  return useQuery({
    queryKey: ["projects", organizationId],
    enabled: Boolean(organizationId),
    queryFn: async () => {
      const { data } = await apiClient.get<ProjectsResponse>("/projects");
      return data;
    },
  });
}

export async function createProject(input: ProjectInput) {
  const { data } = await apiClient.post("/projects", input);
  return data;
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const { data } = await apiClient.patch(`/projects/${id}`, input);
  return data;
}

export async function deleteProject(id: string) {
  await apiClient.delete(`/projects/${id}`);
}
