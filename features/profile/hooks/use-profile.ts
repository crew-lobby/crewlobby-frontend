"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ProfileView } from "@/features/profile/types/profile";
import type { UpdateProfileFormData } from "@/features/profile/schemas/profile-schema";

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

export async function updateProfile(
  userId: string,
  values: Partial<UpdateProfileFormData>,
) {
  const payload = Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "" && value !== undefined),
  );

  const { data } = await apiClient.patch<ProfileView>(`/profile/${userId}`, payload);
  return data;
}