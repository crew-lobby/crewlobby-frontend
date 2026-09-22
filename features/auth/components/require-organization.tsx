"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/loading-spinner";
import { authClient } from "@/lib/auth-client";

export function RequireOrganization({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: organizations, isPending } =
    authClient.useListOrganizations();

  useEffect(() => {
    if (!isPending && organizations && organizations.length === 0) {
      router.replace("/sign-up");
    }
  }, [isPending, organizations, router]);

  if (isPending || !organizations || organizations.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}