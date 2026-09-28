"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InvitationHeading } from "@/features/invitations/components/invitation-heading";
import {
  acceptInvitation,
  declineInvitation,
  invitationPreviewQueryKey,
} from "@/features/invitations/hooks/use-invitation";
import type { InvitationPreview } from "@/features/invitations/types/invitation-preview";
import { authClient } from "@/lib/auth-client";

type PendingAction = "accept" | "decline" | null;

export function InvitationDecision({
  invitation,
}: {
  invitation: InvitationPreview;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refetch: refetchOrganizations } = authClient.useListOrganizations();

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setPendingAction("accept");
    setError(null);

    try {
      await acceptInvitation(invitation.id);
      await refetchOrganizations();
      router.replace("/dashboard");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We couldn't accept this invitation.",
      );
      setPendingAction(null);
    }
  }

  async function handleDecline() {
    setPendingAction("decline");
    setError(null);

    try {
      await declineInvitation(invitation.id);
      await queryClient.invalidateQueries({
        queryKey: invitationPreviewQueryKey(invitation.id),
      });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We couldn't decline this invitation.",
      );
      setPendingAction(null);
    }
  }

  const isBusy = pendingAction !== null;
  const roleLabel = invitation.role ?? "member";

  return (
    <>
      <InvitationHeading
        title={`Join ${invitation.organizationName}`}
        description={`${invitation.inviterName} invited you to join as ${roleLabel}.`}
      />

      <div className="grid gap-3">
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button className="w-full" disabled={isBusy} onClick={handleAccept}>
          {pendingAction === "accept" ? <LoadingSpinner className="size-4 text-primary-foreground" /> : "Accept invitation"}
        </Button>

        <Button variant="outline" className="w-full" disabled={isBusy} onClick={handleDecline}>
          {pendingAction === "decline" ? <LoadingSpinner className="size-4" /> : "Decline"}
        </Button>
      </div>
    </>
  );
}