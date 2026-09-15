"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  Team,
  TeamsResponse,
  TeamWithMembers,
} from "@/features/teams/types/team";

export function useTeams(organizationId?: string) {
  return useQuery({
    queryKey: ["teams", organizationId],
    enabled: Boolean(organizationId),
    queryFn: async () => {
      const { data } = await apiClient.get<TeamsResponse>("/teams");
      return data;
    },
  });
}

export function useTeam(organizationId?: string, teamId?: string) {
  return useQuery({
    queryKey: ["teams", organizationId, teamId],
    enabled: Boolean(organizationId) && Boolean(teamId),
    queryFn: async () => {
      const { data } = await apiClient.get<TeamWithMembers>(`/teams/${teamId}`);
      return data;
    },
  });
}

export async function createTeam(name: string) {
  const { data } = await apiClient.post<Team>("/teams", { name });
  return data;
}

export async function updateTeam(teamId: string, name: string) {
  const { data } = await apiClient.patch<Team>(`/teams/${teamId}`, { name });
  return data;
}

export async function deleteTeam(teamId: string) {
  await apiClient.delete(`/teams/${teamId}`);
}