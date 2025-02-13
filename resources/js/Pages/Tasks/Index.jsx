import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';

const getPriorityVariant = (priority) => {
    switch (priority) {
        case 'high':
            return 'destructive';
        case 'medium':
            return 'warning';
        case 'low':
            return 'secondary';
        default:
            return 'default';
    }
};

export default function TasksIndex({ project, tasks }) {
    return (
        <AuthenticatedLayout header={{ title: `${project.name} - Tasks` }}>
            <Head title={`${project.name} - Tasks`} />
            
            <div className="p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <Link 
                                key={task.id} 
                                href={route('project.tasks.show', [project.id, task.id])}
                                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">{task.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={getPriorityVariant(task.priority)}>
                                                {task.priority}
                                            </Badge>
                                            {task.type && (
                                                <Badge variant="outline">{task.type}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className="mt-2 text-gray-600">{task.description}</p>
                                    
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                {task.assignees?.map((assignee) => (
                                                    <img
                                                        key={assignee.id}
                                                        src={assignee.avatar}
                                                        alt={assignee.name}
                                                        className="w-8 h-8 rounded-full border-2 border-white"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {task.comments?.length || 0} comments
                                            </span>
                                        </div>
                                        
                                        {task.progress && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1 bg-gray-200 rounded-full">
                                                    <div 
                                                        className="h-full bg-green-500 rounded-full" 
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {task.progress}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 