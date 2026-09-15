"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Pencil } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePermissions } from "@/features/permissions/hooks/use-permissions";
import { useProfile, updateProfile } from "@/features/profile/hooks/use-profile";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/features/profile/schemas/profile-schema";

export function ProfilePage({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;
  const currentUserId = session?.user.id;

  const { data: profile, isPending, isError } = useProfile(organizationId, userId);
  const { data: permissions } = usePermissions();

  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isOwnProfile = currentUserId === userId;
  const canEdit =
    isOwnProfile || (permissions?.permissions.profile?.includes("update") ?? false);

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    values: profile
      ? {
          preferredName: profile.profile?.preferredName ?? "",
          location: profile.profile?.location ?? "",
          timezone: profile.profile?.timezone ?? "",
          about: profile.profile?.about ?? "",
          github: profile.profile?.github ?? "",
          linkedin: profile.profile?.linkedin ?? "",
          personalWebsite: profile.profile?.personalWebsite ?? "",
          jobTitle: profile.employment?.jobTitle ?? "",
          workEmail: profile.employment?.workEmail ?? "",
        }
      : undefined,
  });

  async function onSubmit(values: UpdateProfileFormData) {
    setSubmitError(null);
    try {
      await updateProfile(userId, values);
      await queryClient.invalidateQueries({ queryKey: ["profile", organizationId, userId] });
      setIsEditing(false);
    } catch {
      setSubmitError("We couldn't save your changes. Try again.");
    }
  }

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <p className="text-sm text-destructive">
        We couldn&apos;t load this profile.
      </p>
    );
  }

  const displayName = profile.profile?.preferredName || profile.name;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-brass text-xl font-medium text-brass-foreground">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl tracking-tight">{displayName}</h1>
            <p className="text-sm text-muted-foreground">
              {profile.employment?.jobTitle ?? profile.email}
            </p>
          </div>
        </div>

        {canEdit && !isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil className="size-4" />
            Edit profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 rounded-md border bg-card p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <FormControl>
                      <Input placeholder="America/Sao_Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="workEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/you" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/you" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://you.dev" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {submitError && (
              <p role="alert" className="text-sm text-destructive">
                {submitError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="grid gap-4">
          {profile.profile?.about && (
            <section className="rounded-md border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">About</h2>
              <p className="text-sm leading-6 whitespace-pre-wrap">{profile.profile.about}</p>
            </section>
          )}

          <section className="rounded-md border bg-card p-5">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Details</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {profile.profile?.location && (
                <Detail label="Location" value={profile.profile.location} />
              )}
              {profile.profile?.timezone && (
                <Detail label="Timezone" value={profile.profile.timezone} />
              )}
              {profile.employment?.workEmail && (
                <Detail label="Work email" value={profile.employment.workEmail} />
              )}
              {profile.employment?.startDate && (
                <Detail label="Start date" value={profile.employment.startDate} />
              )}
            </dl>
          </section>

          {(profile.profile?.github ||
            profile.profile?.linkedin ||
            profile.profile?.personalWebsite) && (
            <section className="rounded-md border bg-card p-5">
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">Links</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                {profile.profile?.github && (
                  <ProfileLink href={profile.profile.github} icon={ExternalLink} label="GitHub" />
                )}
                {profile.profile?.linkedin && (
                  <ProfileLink href={profile.profile.linkedin} icon={ExternalLink} label="LinkedIn" />
                )}
                {profile.profile?.personalWebsite && (
                  <ProfileLink
                    href={profile.profile.personalWebsite}
                    icon={ExternalLink}
                    label="Website"
                  />
                )}
              </div>
            </section>
          )}

          {profile.employment?.teamId && (
            <section className="rounded-md border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Team</h2>
              <Link
                href={`/dashboard/teams/${profile.employment.teamId}`}
                className="text-sm text-signal hover:underline"
              >
                View team
              </Link>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

function ProfileLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof ExternalLink;
  label: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-signal hover:underline">
      <Icon className="size-4" />
      {label}
    </a>
  );
}