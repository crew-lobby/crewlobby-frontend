import { OrganizationSettingsForm } from "@/features/organization/components/organization-settings-form";
import { SettingsNav } from "@/features/organization/components/settings-nav";

export default function OrganizationSettingsPage() {
  return (
    <main className="flex min-h-full w-full flex-1 px-5 py-8 md:px-8 lg:px-10">
      <div className="w-full">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Organization
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              View and manage your organization&apos;s information.
            </p>
          </div>

          <SettingsNav />

          <OrganizationSettingsForm />
        </div>
      </div>
    </main>
  );
}