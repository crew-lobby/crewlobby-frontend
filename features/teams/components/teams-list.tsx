"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Users2 } from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";
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
    defaultValues: { name: "" },
  });

  async function onSubmit(values: CreateTeamFormData) {
    setCreateError(null);
    try {
      await createTeam(values.name);
      await queryClient.invalidateQueries({ queryKey: ["teams", organizationId] });
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
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight">Teams</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Groups of people working together in this workspace.
          </p>
        </div>
        <Can
          action="create"
          resource="team"
          fallback={<CannotMessage action="create" resource="team" />}
        >
          <Button
            onClick={() => setIsCreating((value) => !value)}
            className="bg-brass text-brass-foreground hover:bg-brass/90"
          >
            New team
          </Button>
        </Can>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end gap-3 rounded-md border bg-card p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create"}
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
        <div className="grid gap-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          We couldn&apos;t load the teams for this workspace.
        </p>
      )}

      <ul className="space-y-2">
        {data?.data.map((team) => (
          <li key={team.id}>
            <Link
              href={`/dashboard/teams/${team.id}`}
              className="flex items-center gap-3 rounded-md border bg-card p-4 hover:border-brass"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Users2 className="size-4 text-muted-foreground" />
              </div>
              <span className="font-medium">{team.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {data?.data.length === 0 && (
        <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
          No teams yet.
        </div>
      )}
    </div>
  );
}