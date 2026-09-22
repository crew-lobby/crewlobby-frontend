"use client";

import * as React from "react";
import {
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  Users2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { CrewLogo } from "@/components/crew-logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@/features/organization/components/organization-switcher";
import { authClient } from "@/lib/auth-client";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      title: "People",
      url: "/dashboard/people",
      icon: Users,
    },
    {
      title: "Teams",
      url: "/dashboard/teams",
      icon: Users2,
    },
    {
      title: "Settings",
      url: "/dashboard/settings/organization",
      icon: Settings,
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { state } = useSidebar();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  async function handleSignOut() {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader className="gap-4 px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <CrewLogo
              href="/dashboard"
              showName={state !== "collapsed"}
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <OrganizationSwitcher variant="sidebar" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Account",
            email: user?.email ?? "",
            avatar: user?.image ?? "",
          }}
          onSignOut={handleSignOut}
        />
      </SidebarFooter>
    </Sidebar>
  );
}