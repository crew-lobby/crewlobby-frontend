"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  ChevronsUpDown,
  Loader2,
  Plus,
} from "lucide-react";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

type OrganizationSwitcherProps = {
  className?: string;
  variant?: "default" | "sidebar";
};

export function OrganizationSwitcher({
  className,
  variant = "default",
}: OrganizationSwitcherProps) {
  const { data: organizations, isPending: isListPending } =
    authClient.useListOrganizations();

  const { data: activeOrganization, isPending: isActivePending } =
    authClient.useActiveOrganization();

  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const isPending = isListPending || isActivePending;

  async function handleSwitch(organizationId: string) {
    if (organizationId === activeOrganization?.id) {
      return;
    }

    setSwitchingId(organizationId);

    await authClient.organization.setActive({
      organizationId,
    });

    setSwitchingId(null);
  }

  if (isPending) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground",
          className,
        )}
      >
        <LoadingSpinner className="size-4" />
      </div>
    );
  }

  if (!organizations || organizations.length === 0) {
    return (
      <Button asChild variant="outline" className={className}>
        <Link href="/dashboard/organizations/new">
          <Plus className="size-4" />
          Create organization
        </Link>
      </Button>
    );
  }

  const currentOrganization =
    organizations.find(
      (organization) => organization.id === activeOrganization?.id,
    ) ?? organizations[0];

  const isSidebar = variant === "sidebar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-10 max-w-full justify-between gap-2 rounded-xl px-2.5",
            isSidebar && "w-full",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </span>

            <span className="truncate text-sm font-medium">
              {currentOrganization.name}
            </span>
          </span>

          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isSidebar ? "start" : "end"}
        className="w-64"
      >
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {organizations.map((organization) => (
          <DropdownMenuItem
            key={organization.id}
            disabled={switchingId !== null}
            onSelect={() => {
              void handleSwitch(organization.id);
            }}
            className="gap-2"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </span>

            <span className="min-w-0 flex-1 truncate">
              {organization.name}
            </span>

            {switchingId === organization.id ? (
              <Loader2 className="size-4 animate-spin" />
            ) : organization.id === activeOrganization?.id ? (
              <Check className="size-4 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard/organizations/new">
            <Plus className="size-4" />
            Create organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}