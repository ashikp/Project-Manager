"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"
import { router } from '@inertiajs/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function VersionSwitcher({ projects, currentProject }) {
  const [open, setOpen] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState(currentProject?.name || 'All Projects')
  
  const handleProjectSelect = (project) => {
    setOpen(false)
    if (project === 'all') {
      setSelectedProject('All Projects')
      router.get(route('projects.index'))
    } else {
      setSelectedProject(project.name)
      router.get(route('project.tasks.index', project.id))
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Projects</span>
                <span className="truncate max-w-[150px]">{selectedProject}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] max-h-[300px] overflow-y-auto"
            align="start"
          >
            <DropdownMenuItem onClick={() => handleProjectSelect('all')}>
              <span>All Projects</span>
              {selectedProject === 'All Projects' && (
                <Check className="ml-auto size-4" />
              )}
            </DropdownMenuItem>
            {projects?.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleProjectSelect(project)}
              >
                <span>{project.name}</span>
                {selectedProject === project.name && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
