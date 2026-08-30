"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function RequireOrganization({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: organizations, isPending } = authClient.useListOrganizations();

  useEffect(() => {
    if (!isPending && organizations && organizations.length === 0) {
      router.replace("/onboarding/organization");
    }
  }, [isPending, organizations, router]);

  if (isPending || !organizations || organizations.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}