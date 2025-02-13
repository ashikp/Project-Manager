import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function AddTaskDialog({ projectId, users }) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        type: 'task',
        assignees: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tasks.store', projectId), {
            onSuccess: () => {
                setOpen(false);
                reset();
            }
        });
    };

    const handleUserSelect = (userId) => {
        const isSelected = data.assignees.includes(userId);
        setData('assignees', isSelected 
            ? data.assignees.filter(id => id !== userId)
            : [...data.assignees, userId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Priority</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {data.priority}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                    {['low', 'medium', 'high'].map((priority) => (
                                        <DropdownMenuCheckboxItem
                                            key={priority}
                                            checked={data.priority === priority}
                                            onCheckedChange={() => setData('priority', priority)}
                                        >
                                            {priority}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div>
                            <Label>Type</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {data.type}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                    {['task', 'bug', 'feature'].map((type) => (
                                        <DropdownMenuCheckboxItem
                                            key={type}
                                            checked={data.type === type}
                                            onCheckedChange={() => setData('type', type)}
                                        >
                                            {type}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div>
                        <Label>Assignees</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {data.assignees.length 
                                        ? `${data.assignees.length} users selected` 
                                        : "Select users"}
                                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full max-h-[200px] overflow-y-auto">
                                {users?.map((user) => (
                                    <DropdownMenuCheckboxItem
                                        key={user.id}
                                        checked={data.assignees.includes(user.id)}
                                        onCheckedChange={() => handleUserSelect(user.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                {user.name.charAt(0)}
                                            </div>
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
                            {users?.filter(user => data.assignees.includes(user.id)).map((user) => (
                                <span
                                    key={user.id}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                                >
                                    {user.name}
                                    <button
                                        type="button"
                                        onClick={() => handleUserSelect(user.id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Task
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 