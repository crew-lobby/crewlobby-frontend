import { PageTitle } from "@/components/page-title";
import { OrganizationMembers } from "@/features/organization/components/organization-members";
import { SettingsNav } from "@/features/organization/components/settings-nav";

export default function OrganizationMembersPage() {
  return (
    <main className="flex min-h-full w-full flex-1 px-5 py-8 md:px-8 lg:px-10">
      <div className="w-full">
        <div className="flex flex-col gap-8">
          <PageTitle
            title="Members"
            description="Manage who has access to this organization."
          />

          <SettingsNav />

          <OrganizationMembers />
        </div>
      </div>
    </main>
  );
}