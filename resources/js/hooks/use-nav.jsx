import { useMemo } from 'react'
import { 
  ListTodo, 
  FolderOpen, 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  FileBox, 
  UserCircle, 
  Settings 
} from "lucide-react"
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
            icon: <LayoutDashboard className="h-4 w-4 mr-2" />
          },
          {
            title: "Projects",
            url: route('projects.index'),
            icon: <FolderKanban className="h-4 w-4 mr-2" />
          },
          {
            title: "My Tasks",
            url: route('tasks.index'),
            icon: <ListTodo className="h-4 w-4 mr-2" />
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
            icon: <MessageSquare className="h-4 w-4 mr-2" />
          },
          {
            title: "File Manager",
            url: route('files.index'),
            icon: <FileBox className="h-4 w-4 mr-2" />
          }
        ],
      },
      {
        title: "Settings",
        items: [
          {
            title: "Profile",
            url: route('profile.edit'),
            icon: <UserCircle className="h-4 w-4 mr-2" />
          },
          {
            title: "Admin Panel",
            url: route('admin.index'),
            icon: <Settings className="h-4 w-4 mr-2" />
          }
        ],
      },
    ],
  }), [projectId, url])

  return data
}
