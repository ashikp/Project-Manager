import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  ChevronUp,
  MoreHorizontal,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'In Progress':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'Done':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'Canceled':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'Backlog':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};

const PriorityIcon = ({ priority }) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    case 'medium':
      return <ArrowRight className="h-4 w-4 text-yellow-500" />;
    case 'low':
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    default:
      return null;
  }
};

export default function TasksIndex({ project, tasks }) {
  const handleTaskClick = (task) => {
    router.visit(route('project.tasks.show', [project.id, task.id]));
  };

  return (
    <AuthenticatedLayout header={{ title: "Welcome back!" }}>
      <Head title="Tasks" />
      
      <div className="p-6">
        <p className="text-muted-foreground mb-6">
          Here's a list of your tasks for this month!
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input 
              placeholder="Filter tasks..." 
              className="max-w-sm"
            />
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Status
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Priority
            </Button>
            <Button variant="outline" className="gap-2 ml-auto">
              View
            </Button>
          </div>

          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="w-8 p-3">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left p-3 font-medium">
                    <div className="flex items-center gap-2">
                      Title
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <div className="flex items-center gap-2">
                      Status
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <div className="flex items-center gap-2">
                      Priority
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="w-8 p-3"></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr 
                    key={task.id} 
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={task.type === 'bug' ? 'destructive' : 'default'}>
                          {task.type}
                        </Badge>
                        {task.title}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={task.status} />
                        {task.status}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <PriorityIcon priority={task.priority} />
                        {task.priority}
                      </div>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 flex items-center justify-between text-sm text-muted-foreground">
              <div>0 of {tasks.length} row(s) selected.</div>
              <div className="flex items-center gap-4">
                <div>Rows per page: 10</div>
                <div>Page 1 of {Math.ceil(tasks.length / 10)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 