"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const settingsTabs = [
  { href: "/dashboard/settings/organization", label: "General" },
  { href: "/dashboard/settings/members", label: "Members" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex w-full gap-1 border-b border-border/40"
      aria-label="Settings navigation"
    >
      {settingsTabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}