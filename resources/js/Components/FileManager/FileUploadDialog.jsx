import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Upload } from "lucide-react";

export default function FileUploadDialog({ projectId }) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        file: null,
        access: 'private',
        password: '',
        fileable_type: 'project',
        fileable_id: projectId
    });

    useEffect(() => {
        setData(data => ({
            ...data,
            fileable_type: 'project',
            fileable_id: projectId
        }));
    }, [projectId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('access', data.access);
        formData.append('fileable_type', 'project');
        formData.append('fileable_id', projectId);
        
        if (data.password) {
            formData.append('password', data.password);
        }

        post(route('files.store'), {
            body: formData,
            onSuccess: () => {
                setOpen(false);
                reset();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload File
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload New File</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="file">File</Label>
                        <Input 
                            id="file" 
                            type="file" 
                            onChange={e => setData('file', e.target.files[0])}
                        />
                        {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                    </div>

                    <div>
                        <Label htmlFor="access">Access</Label>
                        <Select 
                            value={data.access}
                            onValueChange={(value) => setData('access', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="public">Public</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="password">Password Protection (Optional)</Label>
                        <Input 
                            id="password" 
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="Leave empty for no password"
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        Upload
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
} 