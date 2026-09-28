"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, MoreHorizontal, X } from "lucide-react";

import { LoadingSpinner } from "@/components/loading-spinner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { Can, CannotMessage } from "@/features/permissions/components/can";
import {
  cancelInvitation,
  inviteMember,
  removeMember,
  updateMemberRole,
  useInvitations,
  useMembers,
} from "@/features/organization/hooks/use-members";
import { CopyInvitationLinkButton } from "@/features/invitations/components/copy-invitation-link-button";
import {
  inviteMemberSchema,
  roleOptions,
  type InviteMemberFormData,
} from "@/features/organization/schemas/invite-member-schema";
import type { MemberRole } from "@/features/organization/types/member";

export function OrganizationMembers() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId =
    session?.session.activeOrganizationId ?? undefined;

  const {
    data: membersData,
    isPending: isMembersPending,
    isError: isMembersError,
  } = useMembers(organizationId);

  const { data: invitations, isPending: isInvitationsPending } =
    useInvitations(organizationId);

  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);
  const [pendingInvitationId, setPendingInvitationId] = useState<string | null>(
    null,
  );

  const pendingInvitations = invitations?.filter(
    (invitation) => invitation.status === "pending",
  );

  function invalidateAll() {
    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["organizations", "members", organizationId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["organizations", "invitations", organizationId],
      }),
    ]);
  }

  async function handleInvite(values: InviteMemberFormData) {
    setActionError(null);

    try {
      await inviteMember(values.email, values.role as MemberRole);
      await invalidateAll();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "We couldn't send this invitation.",
      );

      throw error;
    }
  }

  async function handleRoleChange(memberId: string, role: MemberRole) {
    setActionError(null);
    setPendingMemberId(memberId);

    try {
      await updateMemberRole(memberId, role);
      await invalidateAll();
    } catch {
      setActionError("We couldn't update this member's role.");
    } finally {
      setPendingMemberId(null);
    }
  }

  async function handleRemove(memberIdOrEmail: string) {
    if (!window.confirm("Remove this member from the organization?")) {
      return;
    }

    setActionError(null);
    setPendingMemberId(memberIdOrEmail);

    try {
      await removeMember(memberIdOrEmail);
      await invalidateAll();
    } catch {
      setActionError("We couldn't remove this member.");
    } finally {
      setPendingMemberId(null);
    }
  }

  async function handleCancelInvitation(invitationId: string) {
    setActionError(null);
    setPendingInvitationId(invitationId);

    try {
      await cancelInvitation(invitationId);
      await invalidateAll();
    } catch {
      setActionError("We couldn't cancel this invitation.");
    } finally {
      setPendingInvitationId(null);
    }
  }

  if (!organizationId) {
    return (
      <p className="text-sm text-muted-foreground">
        Choose a workspace before managing members.
      </p>
    );
  }

  return (
    <Can
      action="read"
      resource="member"
      fallback={<CannotMessage action="read" resource="member" />}
    >
      <div className="w-full space-y-10">
        <Can
          action="create"
          resource="invitation"
          fallback={<CannotMessage action="invite" resource="member" />}
        >
          <InviteMemberForm onInvite={handleInvite} />
        </Can>

        {actionError && (
          <p role="alert" className="text-sm text-destructive">
            {actionError}
          </p>
        )}

        <section>
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Members
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              People who currently have access to this organization.
            </p>
          </div>

          {isMembersPending && (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          )}

          {isMembersError && (
            <p className="text-sm text-destructive">
              We couldn&apos;t load the members list.
            </p>
          )}

          {!isMembersPending && !isMembersError && (
            <ul className="w-full">
              {membersData?.members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-4 border-b border-border/40 py-5"
                >
                  <Link
                    href={`/dashboard/people/${member.userId}`}
                    className="min-w-0 flex-1 transition-colors hover:text-primary"
                  >
                    <p className="truncate font-medium">{member.user.name}</p>

                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </Link>

                  <div className="flex shrink-0 items-center gap-2">
                    <Can
                      action="update"
                      resource="member"
                      fallback={
                        <span className="text-sm capitalize text-muted-foreground">
                          {member.role}
                        </span>
                      }
                    >
                      <Select
                        value={member.role}
                        onValueChange={(role) =>
                          handleRoleChange(member.id, role as MemberRole)
                        }
                        disabled={pendingMemberId === member.id}
                      >
                        <SelectTrigger className="w-32 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {roleOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Can>

                    <Can action="delete" resource="member">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                            disabled={pendingMemberId === member.id}
                            aria-label={`Actions for ${member.user.name}`}
                          >
                            {pendingMemberId === member.id ? (
                              <LoadingSpinner className="size-4" />
                            ) : (
                              <MoreHorizontal className="size-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => handleRemove(member.id)}
                          >
                            Remove from organization
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Can>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!isMembersPending &&
            !isMembersError &&
            membersData?.members.length === 0 && (
              <div className="rounded-xl border border-dashed border-border/60 px-6 py-10 text-center">
                <p className="font-medium">No members yet.</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Invite someone to start building your team.
                </p>
              </div>
            )}
        </section>

        <Can action="create" resource="invitation">
          <section>
            <div className="mb-5">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Pending invitations
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Invitations that are still waiting for a response.
              </p>
            </div>

            {isInvitationsPending && (
              <Skeleton className="h-16 w-full rounded-xl" />
            )}

            {pendingInvitations && pendingInvitations.length > 0 ? (
              <ul className="w-full">
                {pendingInvitations.map((invitation) => (
                  <li
                    key={invitation.id}
                    className="flex items-center justify-between gap-4 border-b border-dashed border-border/40 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <Mail className="size-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {invitation.email}
                        </p>

                        <p className="text-xs capitalize text-muted-foreground">
                          Invited as {invitation.role}
                        </p>

                        <CopyInvitationLinkButton
                          invitationId={invitation.id}
                          isExpired={invitation.isExpired}
                        />
                      </div>
                    </div>

                    <Can action="cancel" resource="invitation">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        disabled={pendingInvitationId === invitation.id}
                        onClick={() =>
                          handleCancelInvitation(invitation.id)
                        }
                        aria-label={`Cancel invitation for ${invitation.email}`}
                      >
                        {pendingInvitationId === invitation.id ? (
                          <LoadingSpinner className="size-4" />
                        ) : (
                          <X className="size-4" />
                        )}
                      </Button>
                    </Can>
                  </li>
                ))}
              </ul>
            ) : (
              !isInvitationsPending && (
                <p className="text-sm text-muted-foreground">
                  No pending invitations.
                </p>
              )
            )}
          </section>
        </Can>
      </div>
    </Can>
  );
}

function InviteMemberForm({
  onInvite,
}: {
  onInvite: (values: InviteMemberFormData) => Promise<void>;
}) {
  const [success, setSuccess] = useState(false);

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  async function onSubmit(values: InviteMemberFormData) {
    setSuccess(false);

    try {
      await onInvite(values);
      form.reset();
      setSuccess(true);
    } catch {
      // Error is surfaced by the parent via actionError.
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-5 border-b border-border/40 pb-6 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-end"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Invite by email</FormLabel>

              <FormControl>
                <Input
                  placeholder="teammate@company.com"
                  className="rounded-xl"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Role</FormLabel>

              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="rounded-xl"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <LoadingSpinner className="size-4 text-primary-foreground" />
              Sending
            </>
          ) : (
            "Send invite"
          )}
        </Button>
      </form>

      {success && (
        <p className="mt-3 text-sm text-emerald-600">
          Invitation sent successfully.
        </p>
      )}
    </Form>
  );
}