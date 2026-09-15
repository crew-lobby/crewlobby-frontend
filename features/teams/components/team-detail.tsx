"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Can } from "@/features/permissions/components/can";
import { deleteTeam, useTeam } from "@/features/teams/hooks/use-teams";

export function TeamDetail({ teamId }: { teamId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;

  const { data: team, isPending, isError } = useTeam(organizationId, teamId);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this team? Members will not be removed from the organization."))
      return;

    setIsDeleting(true);
    try {
      await deleteTeam(teamId);
      await queryClient.invalidateQueries({ queryKey: ["teams", organizationId] });
      router.replace("/dashboard/teams");
    } catch {
      setIsDeleting(false);
    }
  }

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (isError || !team) {
    return <p className="text-sm text-destructive">We couldn&apos;t load this team.</p>;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/teams"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to teams
      </Link>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl tracking-tight">{team.name}</h1>
        <Can action="delete" resource="team">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="size-4" />
            {isDeleting ? "Deleting..." : "Delete team"}
          </Button>
        </Can>
      </div>

      <section className="rounded-md border bg-card">
        <div className="border-b p-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Members ({team.members.length})
          </h2>
        </div>

        {team.members.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No one is on this team yet.
          </div>
        ) : (
          <ul>
            {team.members.map((teamMember) => (
              <li key={teamMember.id} className="border-b last:border-b-0">
                <Link
                  href={`/dashboard/people/${teamMember.userId}`}
                  className="flex items-center gap-3 p-4 hover:bg-accent"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {teamMember.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{teamMember.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {teamMember.jobTitle ?? teamMember.email}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}