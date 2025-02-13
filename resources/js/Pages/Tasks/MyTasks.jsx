import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';
import { router } from '@inertiajs/react';

const getPriorityVariant = (priority) => {
    switch (priority) {
        case 'high': return 'destructive';
        case 'medium': return 'warning';
        case 'low': return 'secondary';
        default: return 'default';
    }
};

function TaskCard({ task, isActive, onClick }) {
    return (
        <div 
            onClick={() => onClick(task)}
            className={`cursor-pointer p-4 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'} rounded-lg mb-2`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{task.project.name}</span>
                    <Badge variant={getPriorityVariant(task.priority)}>
                        {task.priority}
                    </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                    {format(new Date(task.created_at), 'MMM d, yyyy')}
                </span>
            </div>
            
            <h3 className="text-lg font-medium mb-2">{task.title}</h3>
            
            <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                    {task.assignees?.map((assignee) => (
                        <Avatar key={assignee.id}>
                            <AvatarImage src={assignee.avatar} alt={assignee.name} />
                            <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">
                    {task.comments?.length || 0} comments
                </span>
            </div>
        </div>
    );
}

function TaskDetails({ task }) {
    const [comment, setComment] = useState('');

    const handleSubmitComment = () => {
        router.post(route('tasks.comments.store', task.id), {
            content: comment
        }, {
            preserveScroll: true,
            onSuccess: () => setComment('')
        });
    };

    const handleUpdateTask = (data) => {
        router.patch(route('tasks.update.details', [task.project_id, task.id]), data, {
            preserveScroll: true
        });
    };

    if (!task) return null;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
                    <div className="flex items-center gap-2">
                        <Badge variant={getPriorityVariant(task.priority)}>
                            {task.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Created by {task.creator.name}
                        </span>
                    </div>
                </div>
                <Button 
                    variant="outline"
                    onClick={() => handleUpdateTask({ status: task.status === 'completed' ? 'pending' : 'completed' })}
                >
                    Mark as {task.status === 'completed' ? 'Pending' : 'Completed'}
                </Button>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{task.description}</p>
            </div>

            <Separator className="my-6" />

            <div>
                <h3 className="font-semibold mb-4">Comments</h3>
                <ScrollArea className="h-[300px] mb-4">
                    {task.comments?.map((comment) => (
                        <div key={comment.id} className="flex gap-4 mb-4">
                            <Avatar>
                                <AvatarImage src={comment.user.avatar} />
                                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{comment.user.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {format(new Date(comment.created_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>

                <div className="flex gap-2">
                    <Textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1"
                    />
                    <Button onClick={handleSubmitComment}>Comment</Button>
                </div>
            </div>
        </div>
    );
}

export default function MyTasks({ tasks }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const allTasks = [...(tasks.pending || []), ...(tasks.completed || [])];

    return (
        <AuthenticatedLayout header={{ title: "My Tasks" }}>
            <Head title="My Tasks" />
            
            <div className="flex h-[calc(100vh-4rem)]">
                <div className="w-1/3 border-r">
                    <ScrollArea className="h-full p-4">
                        {allTasks.map((task) => (
                            <TaskCard 
                                key={task.id} 
                                task={task} 
                                isActive={selectedTask?.id === task.id}
                                onClick={setSelectedTask}
                            />
                        ))}
                    </ScrollArea>
                </div>
                <div className="flex-1">
                    {selectedTask ? (
                        <TaskDetails task={selectedTask} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Select a task to view details
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 