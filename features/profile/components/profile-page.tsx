"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Pencil } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { PersonAvatar } from "@/components/person-avatar";
import { PageTitle } from "@/components/page-title";
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
import {
  updateProfile,
  useProfile,
} from "@/features/profile/hooks/use-profile";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/features/profile/schemas/profile-schema";

export function ProfilePage({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizationId = session?.session.activeOrganizationId ?? undefined;
  const currentUserId = session?.user.id;

  const { data: profile, isPending, isError } = useProfile(
    organizationId,
    userId,
  );
  const { data: permissions } = usePermissions();

  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isOwnProfile = currentUserId === userId;
  const canEdit =
    isOwnProfile ||
    (permissions?.permissions.profile?.includes("update") ?? false);

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
      await queryClient.invalidateQueries({
        queryKey: ["profile", organizationId, userId],
      });
      setIsEditing(false);
    } catch {
      setSubmitError("We couldn't save your changes. Try again.");
    }
  }

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
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
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 border-b border-border/40 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <PersonAvatar
              name={displayName}
              image={profile.image}
              className="size-16"
            />

            <PageTitle
              title={displayName}
              description={profile.employment?.jobTitle ?? profile.email}
            />
          </div>

          {canEdit && !isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="rounded-xl"
            >
              <Pencil className="size-4" />
              Edit profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
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

              <div className="grid gap-6 sm:grid-cols-2">
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
                        className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/you"
                          {...field}
                        />
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
                        <Input
                          placeholder="https://linkedin.com/in/you"
                          {...field}
                        />
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
                        <Input
                          placeholder="https://you.dev"
                          {...field}
                        />
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

              <div className="flex justify-end gap-3 border-t border-border/40 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="rounded-xl"
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-10">
            {profile.profile?.about && (
              <section>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  About
                </h2>

                <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {profile.profile.about}
                </p>
              </section>
            )}

            <section>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Details
              </h2>

              <dl className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {profile.profile?.location && (
                  <Detail
                    label="Location"
                    value={profile.profile.location}
                  />
                )}

                {profile.profile?.timezone && (
                  <Detail
                    label="Timezone"
                    value={profile.profile.timezone}
                  />
                )}

                {profile.employment?.workEmail && (
                  <Detail
                    label="Work email"
                    value={profile.employment.workEmail}
                  />
                )}

                {profile.employment?.startDate && (
                  <Detail
                    label="Start date"
                    value={profile.employment.startDate}
                  />
                )}
              </dl>
            </section>

            {(profile.profile?.github ||
              profile.profile?.linkedin ||
              profile.profile?.personalWebsite) && (
              <section>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  Links
                </h2>

                <div className="mt-4 flex flex-wrap gap-5 text-sm">
                  {profile.profile?.github && (
                    <ProfileLink
                      href={profile.profile.github}
                      icon={ExternalLink}
                      label="GitHub"
                    />
                  )}

                  {profile.profile?.linkedin && (
                    <ProfileLink
                      href={profile.profile.linkedin}
                      icon={ExternalLink}
                      label="LinkedIn"
                    />
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
              <section>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  Team
                </h2>

                <Link
                  href={`/dashboard/teams/${profile.employment.teamId}`}
                  className="mt-3 inline-flex text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View team
                </Link>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
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
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-primary/80"
    >
      <Icon className="size-4" />
      {label}
    </a>
  );
}