import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import axios from 'axios';
import { format } from 'date-fns';

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

export default function TaskDialog({ task: initialTask, open, onOpenChange }) {
    const [task, setTask] = useState(initialTask);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            fetchTaskDetails();
        }
    }, [open]);

    const fetchTaskDetails = async () => {
        const response = await axios.get(route('tasks.show', task.id));
        setTask(response.data);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const response = await axios.post(route('tasks.comments.store', task.id), {
                content: comment
            });
            
            setTask(prev => ({
                ...prev,
                comments: [...prev.comments, response.data]
            }));
            setComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                <div className="flex h-full">
                    {/* Left sidebar - Task list */}
                    <div className="w-80 border-r bg-gray-50/50">
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-2">
                                {/* Task list items go here */}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col">
                        {/* Task header */}
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold">{task.title}</h2>
                                <div className="flex items-center gap-2">
                                    <Badge variant={getPriorityVariant(task.priority)}>
                                        {task.priority}
                                    </Badge>
                                    {task.type && (
                                        <Badge variant="outline">{task.type}</Badge>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600">{task.description}</p>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex -space-x-2">
                                    {task.assignees?.map((assignee) => (
                                        <Avatar key={assignee.id}>
                                            <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                {task.progress && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1 bg-gray-200 rounded-full">
                                            <div 
                                                className="h-full bg-green-500 rounded-full" 
                                                style={{ width: `${task.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500">{task.progress}%</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments section */}
                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-6">
                                {task.comments?.map((comment) => (
                                    <div key={comment.id} className="flex gap-4">
                                        <Avatar>
                                            <AvatarImage src={comment.user.avatar} />
                                            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{comment.user.name}</span>
                                                <span className="text-gray-500 text-sm">
                                                    {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-gray-700">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Comment input */}
                        <form onSubmit={handleSubmitComment} className="p-4 border-t">
                            <div className="flex gap-4">
                                <Avatar>
                                    <AvatarFallback>You</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Textarea 
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button type="submit" disabled={submitting}>
                                            {submitting ? 'Sending...' : 'Send'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 