import * as React from "react"
import { Link, usePage } from '@inertiajs/react'
import { VersionSwitcher } from "@/components/ui/version-switcher"
import { useNav } from "@/hooks/use-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

export default function AppSidebar({ projects }) {
  const { url } = usePage();
  const nav = useNav();

  return (
    <Sidebar>
      <SidebarHeader>
        <VersionSwitcher projects={projects} />
      </SidebarHeader>
      <SidebarContent>
        {nav.navMain.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={url === item.url}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
