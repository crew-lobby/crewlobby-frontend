import { OrganizationSettingsForm } from "@/features/organization/components/organization-settings-form";

export default function OrganizationSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Organization settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your organization&apos;s information.
        </p>
      </div>
      <OrganizationSettingsForm />
    </div>
  );
}