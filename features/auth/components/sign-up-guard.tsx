"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/loading-spinner";
import { authClient } from "@/lib/auth-client";

export function SignUpGuard({
  children,
  redirectTo = "/dashboard",
  skipOrganization = false,
}: {
  children: React.ReactNode;
  redirectTo?: string;
  skipOrganization?: boolean;
}) {
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { data: organizations, isPending: isOrgPending } =
    authClient.useListOrganizations();

  const isPending =
    isSessionPending ||
    (Boolean(session) && !skipOrganization && isOrgPending);

  const isReadyToLeave =
    Boolean(session) &&
    (skipOrganization || (organizations?.length ?? 0) > 0);

  useEffect(() => {
    if (!isPending && isReadyToLeave) {
      router.replace(redirectTo);
    }
  }, [isPending, isReadyToLeave, redirectTo, router]);

  if (isPending || isReadyToLeave) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}