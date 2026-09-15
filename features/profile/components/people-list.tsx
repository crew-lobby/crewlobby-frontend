"use client";

import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/features/organization/hooks/use-members";

export function PeopleList() {
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;

  const { data, isPending, isError } = useMembers(organizationId);

  if (!organizationId) {
    return (
      <p className="text-sm text-muted-foreground">
        Choose a workspace before viewing people.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl tracking-tight">People</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everyone in this workspace.
        </p>
      </div>

      {isPending && (
        <div className="grid gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          We couldn&apos;t load the people in this workspace.
        </p>
      )}

      <ul className="grid gap-2 sm:grid-cols-2">
        {data?.members.map((member) => (
          <li key={member.id}>
            <Link
              href={`/dashboard/people/${member.userId}`}
              className="flex items-center gap-3 rounded-md border bg-card p-4 hover:border-brass"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {member.user.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{member.user.name}</p>
                <p className="truncate text-sm text-muted-foreground capitalize">
                  {member.role}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
