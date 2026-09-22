"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/loading-spinner";
import { authClient } from "@/lib/auth-client";

export function SignUpGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { data: organizations, isPending: isOrgPending } =
    authClient.useListOrganizations();

  const isPending =
    isSessionPending || (Boolean(session) && isOrgPending);

  const isFullyOnboarded =
    Boolean(session) && (organizations?.length ?? 0) > 0;

  useEffect(() => {
    if (!isPending && isFullyOnboarded) {
      router.replace("/dashboard");
    }
  }, [isPending, isFullyOnboarded, router]);

  if (isPending || isFullyOnboarded) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}