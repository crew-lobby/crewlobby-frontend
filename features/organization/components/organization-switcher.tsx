"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type OrganizationSwitcherProps = {
  variant?: "sidebar" | "compact";
  className?: string;
};

export function OrganizationSwitcher({
  variant = "compact",
  className,
}: OrganizationSwitcherProps) {
  const { data: organizations, isPending: isListPending } =
    authClient.useListOrganizations();
  const { data: activeOrganization, isPending: isActivePending } =
    authClient.useActiveOrganization();
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const isPending = isListPending || isActivePending;

  async function handleSwitch(organizationId: string) {
    if (organizationId === activeOrganization?.id) return;

    setSwitchingId(organizationId);
    await authClient.organization.setActive({ organizationId });
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
        <Loader2 className="size-4 animate-spin" />
        Loading organizations...
      </div>
    );
  }

  if (!activeOrganization || !organizations || organizations.length === 0) {
    return null;
  }

  const trigger =
    variant === "sidebar" ? (
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-md p-2 text-left outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className,
        )}
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">
            {activeOrganization.name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            Workspace
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </button>
    ) : (
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          className,
        )}
      >
        <Building2 className="size-4 text-muted-foreground" />
        <span className="max-w-40 truncate font-medium">
          {activeOrganization.name}
        </span>
        <ChevronsUpDown className="size-4 text-muted-foreground" />
      </button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "sidebar" ? "start" : "end"}
        className="w-64"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((organization) => (
          <DropdownMenuItem
            key={organization.id}
            onSelect={() => handleSwitch(organization.id)}
            className="gap-2"
          >
            <div className="flex aspect-square size-6 items-center justify-center rounded-md border">
              <Building2 className="size-3.5" />
            </div>
            <span className="flex-1 truncate">{organization.name}</span>
            {switchingId === organization.id ? (
              <Loader2 className="size-4 animate-spin" />
            ) : organization.id === activeOrganization.id ? (
              <Check className="size-4" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="gap-2">
          <Link href="/dashboard/organizations/new">
            <div className="flex aspect-square size-6 items-center justify-center rounded-md border border-dashed">
              <Plus className="size-3.5" />
            </div>
            New organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}