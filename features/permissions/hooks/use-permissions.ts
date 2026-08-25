"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";

type PermissionsResponse = {
  role: string;
  permissions: Record<string, string[]>;
};

export function usePermissions() {
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId;

  return useQuery({
    queryKey: ["organizations", "me", "permissions", organizationId],
    enabled: Boolean(organizationId),
    queryFn: async () => {
      const { data } = await apiClient.get<PermissionsResponse>(
        "/organizations/members/me/permissions",
      );
      return data;
    },
  });
}