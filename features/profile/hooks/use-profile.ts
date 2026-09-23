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

function nullableValue(value: string) {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

function parseSkills(value: string) {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function parseOtherLinks(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("|");

      if (separatorIndex === -1) {
        return null;
      }

      const label = line.slice(0, separatorIndex).trim();
      const url = line.slice(separatorIndex + 1).trim();

      if (!label || !url) {
        return null;
      }

      return {
        label,
        url,
      };
    })
    .filter((link): link is { label: string; url: string } => link !== null);
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

    if (key === "skills" && typeof value === "string") {
      payload.skills = parseSkills(value);
      continue;
    }

    if (key === "otherLinks" && typeof value === "string") {
      payload.otherLinks = parseOtherLinks(value);
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