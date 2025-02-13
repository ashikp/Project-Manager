import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, MoreVertical, ChevronDown } from 'lucide-react';

const getPriorityVariant = (priority) => {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getTypeVariant = (type) => {
    switch (type) {
        case 'bug':
            return 'bg-purple-100 text-purple-800';
        case 'feature':
            return 'bg-blue-100 text-blue-800';
        case 'improvement':
            return 'bg-indigo-100 text-indigo-800';
        case 'task':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function TaskShow({ project, task: initialTask, availableUsers }) {
    const [task, setTask] = useState(initialTask);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        title: task.title,
        description: task.description,
        priority: task.priority,
        type: task.type,
        assignees: task.assignees.map(a => a.id)
    });

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(route('tasks.update.details', [project.id, task.id]), editForm);
            setTask(response.data);
            setEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating task:', error);
        }
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
        <AuthenticatedLayout header={{ title: project.name }}>
            <Head title={`${project.name} - ${task.title}`} />
            
            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">{task.title}</h1>
                            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Task</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleEditSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Title</label>
                                            <Input 
                                                value={editForm.title}
                                                onChange={e => setEditForm({...editForm, title: e.target.value})}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium">Description</label>
                                            <Textarea 
                                                value={editForm.description}
                                                onChange={e => setEditForm({...editForm, description: e.target.value})}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium">Priority</label>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            {editForm.priority}
                                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-full">
                                                        {['low', 'medium', 'high'].map((priority) => (
                                                            <DropdownMenuCheckboxItem
                                                                key={priority}
                                                                checked={editForm.priority === priority}
                                                                onCheckedChange={() => setEditForm({...editForm, priority})}
                                                            >
                                                                {priority}
                                                            </DropdownMenuCheckboxItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium">Type</label>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            {editForm.type || 'Select type'}
                                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-full">
                                                        {['bug', 'feature', 'improvement', 'task'].map((type) => (
                                                            <DropdownMenuCheckboxItem
                                                                key={type}
                                                                checked={editForm.type === type}
                                                                onCheckedChange={() => setEditForm({...editForm, type})}
                                                            >
                                                                {type}
                                                            </DropdownMenuCheckboxItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Assignees</label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-between">
                                                        {editForm.assignees.length 
                                                            ? `${editForm.assignees.length} users selected` 
                                                            : "Select users"}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full max-h-[200px] overflow-y-auto">
                                                    {project.assignees?.map((user) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={user.id}
                                                            checked={editForm.assignees.includes(user.id)}
                                                            onCheckedChange={() => {
                                                                const isSelected = editForm.assignees.includes(user.id);
                                                                setEditForm({
                                                                    ...editForm,
                                                                    assignees: isSelected
                                                                        ? editForm.assignees.filter(id => id !== user.id)
                                                                        : [...editForm.assignees, user.id]
                                                                });
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Avatar>
                                                                    <AvatarImage src={user.avatar} />
                                                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium">{user.name}</div>
                                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {project.assignees?.filter(user => editForm.assignees.includes(user.id)).map((user) => (
                                                    <span
                                                        key={user.id}
                                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                                                    >
                                                        {user.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <Button type="submit">Save Changes</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-md text-sm ${getPriorityVariant(task.priority)}`}>
                                {task.priority}
                            </span>
                            {task.type && (
                                <span className={`px-2 py-1 rounded-md text-sm ${getTypeVariant(task.type)}`}>
                                    {task.type}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {task.assignees?.map((assignee) => (
                                    <Avatar key={assignee.id}>
                                        <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                        <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                Created by {task.creator.name}
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
                                <span className="text-sm text-gray-500">{task.progress}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comments section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Activity</h2>
                    
                    <div className="space-y-6 mb-6">
                        {task.comments?.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={comment.user.avatar} />
                                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className={`flex-1 ${comment.is_system ? 'text-gray-500 italic' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{comment.user.name}</span>
                                        <span className="text-gray-500 text-sm">
                                            {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
                                        </span>
                                    </div>
                                    <p className="mt-1">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleSubmitComment}>
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
        </AuthenticatedLayout>
    );
} 