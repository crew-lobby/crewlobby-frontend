"use client";

import { useQuery } from "@tanstack/react-query";

import type { InvitationPreview } from "@/features/invitations/types/invitation-preview";
import { apiClient } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";

export function invitationPreviewQueryKey(invitationId: string) {
  return ["invitations", "preview", invitationId] as const;
}

export function useInvitationPreview(invitationId: string) {
  return useQuery({
    queryKey: invitationPreviewQueryKey(invitationId),
    retry: false,
    queryFn: async () => {
      const { data } = await apiClient.get<InvitationPreview>(
        `/invitations/${invitationId}/preview`,
      );

      return data;
    },
  });
}

export async function acceptInvitation(invitationId: string) {
  const { error } = await authClient.organization.acceptInvitation({
    invitationId,
  });

  if (error) {
    throw new Error(error.message ?? "We couldn't accept this invitation.");
  }
}

export async function declineInvitation(invitationId: string) {
  const { error } = await authClient.organization.rejectInvitation({
    invitationId,
  });

  if (error) {
    throw new Error(error.message ?? "We couldn't decline this invitation.");
  }
}