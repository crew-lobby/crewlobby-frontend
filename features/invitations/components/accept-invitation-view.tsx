"use client";

import { useState } from "react";
import Link from "next/link";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { InvitationDecision } from "@/features/invitations/components/invitation-decision";
import { InvitationHeading } from "@/features/invitations/components/invitation-heading";
import { useInvitationPreview } from "@/features/invitations/hooks/use-invitation";
import { buildInvitationPath } from "@/features/invitations/lib/invitation-link";
import type {
  InvitationPreview,
  InvitationPreviewStatus,
} from "@/features/invitations/types/invitation-preview";
import { authClient } from "@/lib/auth-client";
import { withRedirect } from "@/lib/safe-redirect";

const unavailableMessages: Record<
  Exclude<InvitationPreviewStatus, "pending">,
  { title: string; description: string }
> = {
  accepted: {
    title: "Invitation already accepted",
    description: "This invitation has already been used.",
  },
  rejected: {
    title: "Invitation declined",
    description: "This invitation was declined and can no longer be used.",
  },
  canceled: {
    title: "Invitation canceled",
    description: "The person who sent this invitation canceled it.",
  },
  expired: {
    title: "Invitation expired",
    description: "This invitation has expired. Ask for a new one to join.",
  },
};

export function AcceptInvitationView({
  invitationId,
}: {
  invitationId: string;
}) {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const {
    data: invitation,
    isPending: isInvitationPending,
    isError,
  } = useInvitationPreview(invitationId);

  const isSignedIn = Boolean(session);

  if (isSessionPending || isInvitationPending) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !invitation) {
    return (
      <InvitationUnavailable
        title="Invitation not found"
        description="This link is invalid or no longer exists."
        isSignedIn={isSignedIn}
      />
    );
  }

  if (invitation.status !== "pending") {
    const message = unavailableMessages[invitation.status];

    return (
      <InvitationUnavailable
        title={message.title}
        description={message.description}
        isSignedIn={isSignedIn}
      />
    );
  }

  if (!session) {
    return <SignedOutPrompt invitation={invitation} />;
  }

  if (session.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    return (
      <WrongAccountPrompt
        invitation={invitation}
        currentEmail={session.user.email}
      />
    );
  }

  return <InvitationDecision invitation={invitation} />;
}

function InvitationUnavailable({
  title,
  description,
  isSignedIn,
}: {
  title: string;
  description: string;
  isSignedIn: boolean;
}) {
  return (
    <>
      <InvitationHeading title={title} description={description} />

      <Button asChild className="w-full">
        <Link href={isSignedIn ? "/dashboard" : "/login"}>
          {isSignedIn ? "Go to dashboard" : "Sign in"}
        </Link>
      </Button>
    </>
  );
}

function SignedOutPrompt({
  invitation,
}: {
  invitation: InvitationPreview;
}) {
  const invitationPath = buildInvitationPath(invitation.id);

  return (
    <>
      <InvitationHeading
        title={`Join ${invitation.organizationName}`}
        description={`${invitation.inviterName} invited you. Sign in or create an account with ${invitation.email} to continue.`}
      />

      <div className="grid gap-3">
        <Button asChild className="w-full">
          <Link href={withRedirect("/login", invitationPath)}>
            Sign in
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full">
          <Link href={withRedirect("/sign-up", invitationPath)}>
            Create an account
          </Link>
        </Button>
      </div>
    </>
  );
}

function WrongAccountPrompt({
  invitation,
  currentEmail,
}: {
  invitation: InvitationPreview;
  currentEmail: string;
}) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    setIsSigningOut(false);
  }

  return (
    <>
      <InvitationHeading
        title="This invitation is for another account"
        description={`You are signed in as ${currentEmail}, but this invitation was sent to ${invitation.email}.`}
      />

      <Button
        className="w-full"
        disabled={isSigningOut}
        onClick={handleSignOut}
      >
        {isSigningOut ? (
          <LoadingSpinner className="size-4 text-primary-foreground" />
        ) : (
          "Sign out and switch account"
        )}
      </Button>
    </>
  );
}