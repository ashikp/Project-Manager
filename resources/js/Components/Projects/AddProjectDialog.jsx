import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function AddProjectDialog({ users }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        department: '',
        logo: null,
        tags: [],
        deadline: null,
        assignees: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('department', data.department);
        
        data.tags.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });
        
        data.assignees.forEach((userId, index) => {
            formData.append(`assignees[${index}]`, userId);
        });
        
        if (data.deadline) {
            formData.append('deadline', format(data.deadline, 'yyyy-MM-dd'));
        }
        
        if (data.logo) {
            formData.append('logo', data.logo);
        }

        post(route('projects.store'), formData, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
            onError: () => {
                console.error('Form submission failed');
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!data.tags.includes(newTag)) {
                setData('tags', [...(data.tags || []), newTag]);
            }
            e.target.value = '';
        }
    };

    const removeTag = (indexToRemove) => {
        setData('tags', data.tags.filter((_, index) => index !== indexToRemove));
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
                <Button>+ Add project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Project logo</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                {data.logo ? (
                                    <img 
                                        src={URL.createObjectURL(data.logo)} 
                                        alt="Preview" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">Logo</span>
                                )}
                            </div>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => document.getElementById('logo-upload').click()}
                            >
                                Upload photo
                            </Button>
                            <input
                                id="logo-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                        {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Project name</Label>
                        <Input
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="My project"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                            value={data.department}
                            onChange={e => setData('department', e.target.value)}
                            placeholder="Department name"
                        />
                        {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <Input
                            placeholder="Press Enter to add tags"
                            onKeyDown={handleTagInput}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {data.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Deadline</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.deadline && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.deadline ? (
                                        format(data.deadline, "EEEE, MMMM d, yyyy")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={data.deadline}
                                    onSelect={(date) => setData('deadline', date)}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.deadline && (
                            <p className="text-sm text-red-500 mt-1">{errors.deadline}</p>
                        )}
                    </div>

                    <div className="space-y-2">
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
                        {errors.assignees && <p className="text-sm text-red-500">{errors.assignees}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 