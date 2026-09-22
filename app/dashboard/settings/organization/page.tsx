import { PageTitle } from "@/components/page-title";
import { OrganizationSettingsForm } from "@/features/organization/components/organization-settings-form";
import { SettingsNav } from "@/features/organization/components/settings-nav";

export default function OrganizationSettingsPage() {
  return (
    <main className="flex min-h-full w-full flex-1 px-5 py-8 md:px-8 lg:px-10">
      <div className="w-full">
        <div className="flex flex-col gap-8">
          <PageTitle
            title="Organization"
            description="View and manage your organization's information."
          />

          <SettingsNav />

          <OrganizationSettingsForm />
        </div>
      </div>
    </main>
  );
}