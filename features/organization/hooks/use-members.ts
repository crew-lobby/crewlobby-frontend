"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import type {
  Invitation,
  InvitationRecord,
  MemberRole,
  MembersResponse,
} from "@/features/organization/types/member";

export function useMembers(organizationId?: string) {
  return useQuery({
    queryKey: ["organizations", "members", organizationId],
    enabled: Boolean(organizationId),
    queryFn: async () => {
      const { data } = await apiClient.get<MembersResponse>(
        "/organizations/members",
      );
      return data;
    },
  });
}

export function useInvitations(organizationId?: string) {
  return useQuery({
    queryKey: ["organizations", "invitations", organizationId],
    enabled: Boolean(organizationId),
    queryFn: async (): Promise<Invitation[]> => {
      const { data } = await apiClient.get<InvitationRecord[]>(
        "/organizations/invitations",
      );
      return data.map((invitation) => ({
        ...invitation,
        isExpired: new Date(invitation.expiresAt).getTime() < Date.now(),
      }));
    },
  });
}

export async function updateMemberRole(memberId: string, role: MemberRole) {
  const { data } = await apiClient.patch("/organizations/members/role", {
    memberId,
    role,
  });
  return data;
}

export async function removeMember(memberIdOrEmail: string) {
  await apiClient.delete(
    `/organizations/members/${encodeURIComponent(memberIdOrEmail)}`,
  );
}

type InviteMemberParams = Parameters<typeof authClient.organization.inviteMember>[0];

export async function inviteMember(email: string, role: MemberRole) {
  const { error } = await authClient.organization.inviteMember({
    email,
    role: role as InviteMemberParams["role"],
  });

  if (error) {
    throw new Error(error.message ?? "We couldn't send this invitation.");
  }
}

export async function cancelInvitation(invitationId: string) {
  const { error } = await authClient.organization.cancelInvitation({
    invitationId,
  });

  if (error) {
    throw new Error(error.message ?? "We couldn't cancel this invitation.");
  }
}