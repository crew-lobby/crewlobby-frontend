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
    <nav className="mb-6 flex gap-1 border-b">
      {settingsTabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium",
              isActive
                ? "border-foreground text-foreground"
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