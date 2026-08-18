"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/features/permissions/hooks/use-permissions";

type CanProps = {
  action: string;
  resource: string;
  children: ReactNode;
  fallback?: ReactNode;
};

export function Can({ action, resource, children, fallback = null }: CanProps) {
  const { data, isPending } = usePermissions();

  if (isPending) {
    return null;
  }

  const allowed = data?.permissions[resource]?.includes(action) ?? false;

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function CannotMessage({
  action,
  resource,
}: {
  action: string;
  resource: string;
}) {
  return (
    <p className="text-sm text-muted-foreground">
      You don&apos;t have permission to {action} {resource}s.
    </p>
  );
}