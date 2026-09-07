"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, MoreHorizontal, X } from "lucide-react";

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
import {
  inviteMemberSchema,
  roleOptions,
  type InviteMemberFormData,
} from "@/features/organization/schemas/invite-member-schema";
import type { MemberRole } from "@/features/organization/types/member";

export function OrganizationMembers() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;

  const {
    data: membersData,
    isPending: isMembersPending,
    isError: isMembersError,
  } = useMembers(organizationId);
  const { data: invitations, isPending: isInvitationsPending } =
    useInvitations(organizationId);

  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);
  const [pendingInvitationId, setPendingInvitationId] = useState<string | null>(null);

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
    if (!window.confirm("Remove this member from the organization?")) return;

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
      <div className="space-y-8">
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

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Members
          </h2>

          {isMembersPending && (
            <div className="grid gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          )}

          {isMembersError && (
            <p className="text-sm text-destructive">
              We couldn&apos;t load the members list.
            </p>
          )}

          <ul className="space-y-2">
            {membersData?.members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Can
                    action="update"
                    resource="member"
                    fallback={
                      <span className="text-sm text-muted-foreground capitalize">
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
                      <SelectTrigger size="sm" className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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
                          disabled={pendingMemberId === member.id}
                        >
                          {pendingMemberId === member.id ? (
                            <Loader2 className="size-4 animate-spin" />
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

          {membersData?.members.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No members yet.
            </div>
          )}
        </section>

        <Can action="create" resource="invitation">
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Pending invitations
            </h2>

            {isInvitationsPending && <Skeleton className="h-12 w-full" />}

            {pendingInvitations && pendingInvitations.length > 0 ? (
              <ul className="space-y-2">
                {pendingInvitations.map((invitation) => (
                  <li
                    key={invitation.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-dashed p-4"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Mail className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {invitation.email}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          Invited as {invitation.role}
                        </p>
                      </div>
                    </div>
                    <Can action="cancel" resource="invitation">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={pendingInvitationId === invitation.id}
                        onClick={() => handleCancelInvitation(invitation.id)}
                      >
                        {pendingInvitationId === invitation.id ? (
                          <Loader2 className="size-4 animate-spin" />
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
    defaultValues: { email: "", role: "user" },
  });

  async function onSubmit(values: InviteMemberFormData) {
    setSuccess(false);
    try {
      await onInvite(values);
      form.reset();
      setSuccess(true);
    } catch {
      // error is surfaced by the parent via actionError
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-end"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Invite by email</FormLabel>
              <FormControl>
                <Input placeholder="teammate@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-32">
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

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send invite"}
        </Button>
      </form>
      {success && (
        <p className="mt-2 text-sm text-emerald-600">Invitation sent.</p>
      )}
    </Form>
  );
}