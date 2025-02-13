import { cn } from "@/lib/utils"
import { Link } from '@inertiajs/react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuGroup,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export default function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="border-r">
        <SidebarHeader className="border-b px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">Shadcn UI Kit</span>
          </Link>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuGroup label="Dashboards">
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ClockIcon className="h-4 w-4" />
                  <span>Default</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>E-commerce</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <UsersIcon className="h-4 w-4" />
                  <span>CRM</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenuGroup>

            <SidebarMenuGroup label="Apps">
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessageSquareIcon className="h-4 w-4" />
                  <span>Chats</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <InboxIcon className="h-4 w-4" />
                  <span>Inbox</span>
                  <span className="ml-auto text-xs text-muted-foreground">Coming</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LayoutKanbanIcon className="h-4 w-4" />
                  <span>Kanban</span>
                  <span className="ml-auto text-xs text-muted-foreground">Coming</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenuGroup>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Get this Dashboard</h3>
            <p className="text-xs text-muted-foreground">
              Use the link to get this dashboard template and access other resources.
            </p>
            <Link
              href="https://ui.shadcn.com/"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Get Shadcn UI Kit
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 