"use client";

import { SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { SearchForm } from "@/components/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

const pageLabels: Record<string, string> = {
  dashboard: "Overview",
  projects: "Projects",
  people: "People",
  teams: "Teams",
  settings: "Settings",
  organization: "Organization",
  members: "Members",
};

function getPageLabel(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return "Overview";
  }

  const lastSegment = segments[segments.length - 1];

  if (pageLabels[lastSegment]) {
    return pageLabels[lastSegment];
  }

  const parentSegment = segments[segments.length - 2];

  if (pageLabels[parentSegment]) {
    return pageLabels[parentSegment];
  }

  return "Overview";
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const pageName = getPageLabel(pathname);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="size-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <SidebarIcon />
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                CrewLobby
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  );
}