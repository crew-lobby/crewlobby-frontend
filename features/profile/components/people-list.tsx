"use client";

import Link from "next/link";

import { PersonAvatar } from "@/components/person-avatar";
import { PageTitle } from "@/components/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
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
    <div className="w-full">
      <PageTitle
        title="People"
        description="Everyone in this workspace."
      />

      <div className="mt-10">
        {isPending && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            We couldn&apos;t load the people in this workspace.
          </p>
        )}

        {!isPending && !isError && (
          <ul className="w-full">
            {data?.members.map((member) => (
              <li key={member.id}>
                <Link
                  href={`/dashboard/people/${member.userId}`}
                  className="flex items-center gap-4 border-b border-border/40 py-5 transition-colors hover:bg-muted/30"
                >
                  <PersonAvatar
                    name={member.user.name}
                    className="size-11"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {member.user.name}
                    </p>

                    <p className="mt-0.5 truncate text-sm capitalize text-muted-foreground">
                      {member.role}
                    </p>
                  </div>

                  <span className="text-sm text-muted-foreground">
                    View profile
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}