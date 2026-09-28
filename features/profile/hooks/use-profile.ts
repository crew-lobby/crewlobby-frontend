"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { ProfileView } from "@/features/profile/types/profile";
import type { UpdateProfileFormData } from "@/features/profile/schemas/profile-schema";

export const NO_SELECTION_VALUE = "none";

export function useProfile(organizationId?: string, userId?: string) {
  return useQuery({
    queryKey: ["profile", organizationId, userId],
    enabled: Boolean(organizationId) && Boolean(userId),
    queryFn: async () => {
      const { data } = await apiClient.get<ProfileView>(`/profile/${userId}`);

      return data;
    },
  });
}

function nullableValue(value: string) {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

export async function updateProfile(
  userId: string,
  values: Partial<UpdateProfileFormData>,
) {
  const payload: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      continue;
    }

    if (key === "teamId" || key === "managerId") {
      payload[key] =
        value === "" || value === NO_SELECTION_VALUE ? null : value;
      continue;
    }

    if (typeof value === "string") {
      payload[key] = nullableValue(value);
      continue;
    }

    payload[key] = value;
  }

  const { data } = await apiClient.patch<ProfileView>(
    `/profile/${userId}`,
    payload,
  );

  return data;
}