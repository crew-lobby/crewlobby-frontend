"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ProjectFormData } from "@/features/projects/schemas/project-schema";
import type { ProjectsResponse } from "@/features/projects/types/project";

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

export async function createProject(values: ProjectFormData) {
  const { data } = await apiClient.post("/projects", values);
  return data;
}

export async function updateProject(id: string, values: Partial<ProjectFormData>) {
  const { data } = await apiClient.patch(`/projects/${id}`, values);
  return data;
}

export async function deleteProject(id: string) {
  await apiClient.delete(`/projects/${id}`);
}