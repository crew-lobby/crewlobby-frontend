"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Users2 } from "lucide-react";

import { PageTitle } from "@/components/page-title";
import { LoadingSpinner } from "@/components/loading-spinner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Can, CannotMessage } from "@/features/permissions/components/can";
import { createTeam, useTeams } from "@/features/teams/hooks/use-teams";

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(120),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

export function TeamsList() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;

  const { data, isPending, isError } = useTeams(organizationId);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const form = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: CreateTeamFormData) {
    setCreateError(null);

    try {
      await createTeam(values.name);

      await queryClient.invalidateQueries({
        queryKey: ["teams", organizationId],
      });

      form.reset();
      setIsCreating(false);
    } catch {
      setCreateError("We couldn't create this team. Try again.");
    }
  }

  if (!organizationId) {
    return (
      <p className="text-sm text-muted-foreground">
        Choose a workspace before managing teams.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <PageTitle
            title="Teams"
            description="Groups of people working together in this workspace."
          />

          <Can
            action="create"
            resource="team"
            fallback={
              <CannotMessage action="create" resource="team" />
            }
          >
            <Button
              onClick={() => {
                setCreateError(null);
                setIsCreating((value) => !value);
              }}
              className="rounded-xl"
            >
              {isCreating ? "Cancel" : "New team"}
            </Button>
          </Can>
        </div>

        {isCreating && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-end"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Team name</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Engineering"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="rounded-xl"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <LoadingSpinner className="size-4 text-primary-foreground" />
                    Creating
                  </>
                ) : (
                  "Create team"
                )}
              </Button>
            </form>

            {createError && (
              <p role="alert" className="text-sm text-destructive">
                {createError}
              </p>
            )}
          </Form>
        )}

        {isPending && (
          <div className="flex min-h-32 items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            We couldn&apos;t load the teams for this workspace.
          </p>
        )}

        {!isPending && !isError && (
          <ul className="w-full">
            {data?.data.map((team) => (
              <li key={team.id}>
                <Link
                  href={`/dashboard/teams/${team.id}`}
                  className="flex items-center gap-4 border-b border-border/40 py-5 transition-colors hover:bg-muted/20"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Users2 className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{team.name}</p>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      View team
                    </p>
                  </div>

                  <span className="shrink-0 text-sm text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!isPending && !isError && data?.data.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-medium">No teams yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a team to start organizing your workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}