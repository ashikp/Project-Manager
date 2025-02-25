import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { History } from "lucide-react";
import { format } from 'date-fns';

export default function FileVersionDialog({ file }) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        file: null,
        comment: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('comment', data.comment);

        post(route('files.version.store', file.id), {
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
                <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    Versions ({file.versions.length})
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>File Versions</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="border rounded-lg">
                        <div className="p-4 border-b bg-muted">
                            <h3 className="font-medium">Upload New Version</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <Label htmlFor="file">File</Label>
                                <Input 
                                    id="file" 
                                    type="file" 
                                    onChange={e => setData('file', e.target.files[0])}
                                />
                            </div>
                            <div>
                                <Label htmlFor="comment">Version Comment</Label>
                                <Textarea 
                                    id="comment"
                                    value={data.comment}
                                    onChange={e => setData('comment', e.target.value)}
                                    placeholder="What changed in this version?"
                                />
                            </div>
                            <Button type="submit" disabled={processing}>
                                Upload Version
                            </Button>
                        </form>
                    </div>

                    <div className="border rounded-lg">
                        <div className="p-4 border-b bg-muted">
                            <h3 className="font-medium">Version History</h3>
                        </div>
                        <div className="divide-y">
                            {file.versions.map(version => (
                                <div key={version.id} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Version {version.version}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(version.created_at), 'PPp')}
                                            </p>
                                            {version.comment && (
                                                <p className="mt-1 text-sm">{version.comment}</p>
                                            )}
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => window.location.href = route('files.download', [file.id, { version: version.version }])}
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 