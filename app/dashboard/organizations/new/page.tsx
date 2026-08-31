import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CreateOrganizationForm } from "@/features/organization/components/create-organization-form";

export default function NewOrganizationPage() {
  return (
    <div className="mx-auto w-full max-w-lg p-4 md:p-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create a new organization
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up another workspace. You can switch between organizations at
          any time.
        </p>
      </div>
      <CreateOrganizationForm />
    </div>
  );
}