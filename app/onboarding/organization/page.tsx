import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { CreateOrganizationForm } from "@/features/organization/components/create-organization-form";
import { RequireNoOrganization } from "@/features/auth/components/require-no-organization";
import { CrewStatement } from "@/components/crew-statement";

export default function CreateOrganizationPage() {
  return (
    <RequireNoOrganization>
      <main className="grid min-h-svh lg:grid-cols-2">
        <section className="flex flex-col gap-6 p-6 md:p-10">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-semibold md:self-start"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-brass text-brass-foreground">
              <GalleryVerticalEnd className="size-4" />
            </span>
            CrewLobby
          </Link>
          <div className="m-auto w-full max-w-sm">
            <div className="mb-8 space-y-2 text-center md:text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create your organization
              </h1>
              <p className="text-sm text-muted-foreground">
                Tell us a bit about your company to finish setting up your
                workspace.
              </p>
            </div>
            <CreateOrganizationForm />
          </div>
        </section>
        <CrewStatement />
      </main>
    </RequireNoOrganization>
  );
}