"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";

import { LoadingSpinner } from "@/components/loading-spinner";
import { PageTitle } from "@/components/page-title";
import { PersonAvatar } from "@/components/person-avatar";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Can } from "@/features/permissions/components/can";
import { deleteTeam, useTeam } from "@/features/teams/hooks/use-teams";

export function TeamDetail({ teamId }: { teamId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;

  const { data: team, isPending, isError } = useTeam(
    organizationId,
    teamId,
  );

  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        "Delete this team? Members will not be removed from the organization.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTeam(teamId);

      await queryClient.invalidateQueries({
        queryKey: ["teams", organizationId],
      });

      router.replace("/dashboard/teams");
    } catch {
      setIsDeleting(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !team) {
    return (
      <p className="text-sm text-destructive">
        We couldn&apos;t load this team.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <Link
          href="/dashboard/teams"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to teams
        </Link>

        <div className="flex flex-col gap-6 border-b border-border/40 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <PageTitle
            title={team.name}
            description={`${team.members.length} ${
              team.members.length === 1 ? "member" : "members"
            } in this team.`}
          />

          <Can action="delete" resource="team">
            <Button
              variant="outline"
              className="rounded-xl text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner className="size-4" />
                  Deleting
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete team
                </>
              )}
            </Button>
          </Can>
        </div>

        <section>
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Members
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              People currently assigned to this team.
            </p>
          </div>

          {team.members.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-medium">No one is on this team yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Team members will appear here once they are assigned.
              </p>
            </div>
          ) : (
            <ul className="w-full">
              {team.members.map((teamMember) => (
                <li key={teamMember.id}>
                  <Link
                    href={`/dashboard/people/${teamMember.userId}`}
                    className="flex items-center gap-4 border-b border-border/40 py-5 transition-colors hover:bg-muted/20"
                  >
                    <PersonAvatar
                      name={teamMember.name}
                      className="size-11"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {teamMember.name}
                      </p>

                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {teamMember.jobTitle ?? teamMember.email}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm text-muted-foreground">
                      View profile
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}