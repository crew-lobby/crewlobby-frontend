"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function RequireNoOrganization({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: organizations, isPending: isOrgPending } =
    authClient.useListOrganizations();

  const isPending = isSessionPending || isOrgPending;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (organizations && organizations.length > 0) {
      router.replace("/dashboard");
    }
  }, [isPending, session, organizations, router]);

  if (isPending || !session || (organizations && organizations.length > 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}