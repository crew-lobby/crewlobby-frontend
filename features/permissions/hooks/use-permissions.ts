"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

type PermissionsResponse = {
  role: string;
  permissions: Record<string, string[]>;
};

export function usePermissions() {
  return useQuery({
    queryKey: ["organizations", "me", "permissions"],
    queryFn: async () => {
      const { data } = await apiClient.get<PermissionsResponse>(
        "/organizations/members/me/permissions",
      );
      return data;
    },
  });
}