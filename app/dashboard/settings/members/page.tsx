import { OrganizationMembers } from "@/features/organization/components/organization-members";
import { SettingsNav } from "@/features/organization/components/settings-nav";

export default function OrganizationMembersPage() {
  return (
    <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage who has access to this organization.
        </p>
      </div>
      <SettingsNav />
      <OrganizationMembers />
    </div>
  );
}