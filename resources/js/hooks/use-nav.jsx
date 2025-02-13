import { useMemo } from 'react'
import { ListTodo, FolderOpen } from "lucide-react"
import { usePage } from '@inertiajs/react'

export function useNav() {
  const { url } = usePage();
  const isProjectRoute = url.startsWith('/projects/');
  const projectId = isProjectRoute ? url.split('/')[2] : null;

  const data = useMemo(() => ({
    navMain: [
      {
        title: "Main",
        items: [
          {
            title: "Dashboard",
            url: route('dashboard'),
          },
          {
            title: "Projects",
            url: route('projects.index'),
          },
          {
            title: "My Tasks",
            url: route('tasks.index'),
          }
        ],
      },
      {
        title: "Apps",
        items: [
          ...(projectId ? [{
            title: "Project Tasks",
            url: route('project.tasks.index', projectId),
            icon: <ListTodo className="h-4 w-4 mr-2" />
          }] : []),
          {
            title: "Chat",
            url: route('chat.index'),
          },
          {
            title: "File Manager",
            url: route('files.index'),
          }
        ],
      },
      {
        title: "Settings",
        items: [
          {
            title: "Profile",
            url: route('profile.edit'),
          },
          {
            title: "Admin Panel",
            url: route('admin.index'),
          }
        ],
      },
    ],
  }), [projectId, url])

  return data
}
