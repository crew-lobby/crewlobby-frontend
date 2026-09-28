"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { AccountStepForm } from "@/features/auth/components/account-step-form";
import { useInvitationPreview } from "@/features/invitations/hooks/use-invitation";
import { withRedirect } from "@/lib/safe-redirect";

export function InvitedSignUp({
  invitationId,
  redirectTo,
}: {
  invitationId: string;
  redirectTo: string;
}) {
  const router = useRouter();

  const {
    data: invitation,
    isPending,
    isError,
  } = useInvitationPreview(invitationId);

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !invitation || invitation.status !== "pending") {
    return (
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          This invitation is no longer available.
        </p>

        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <AccountStepForm
        defaultEmail={invitation.email}
        lockEmail
        submitLabel="Create account"
        onSuccess={() => router.replace(redirectTo)}
      />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={withRedirect("/login", redirectTo)} className="font-medium text-foreground underline underline-offset-4">Sign in</Link>
      </p>
    </div>
  );
}