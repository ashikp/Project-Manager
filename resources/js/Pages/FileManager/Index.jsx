import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  Image as ImageIcon, 
  File as FileIcon,
  MoreVertical,
  Download,
  Trash2,
  Link
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { formatBytes } from '@/lib/utils';

function FileCard({ file, onDownload, onDelete }) {
  const [copied, setCopied] = useState(false);

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-12 w-12 text-blue-500" />;
    }
    if (file.type.includes('pdf')) {
      return <FileText className="h-12 w-12 text-red-500" />;
    }
    return <FileIcon className="h-12 w-12 text-gray-500" />;
  };

  const copyUrl = () => {
    if (file.url) {
      navigator.clipboard.writeText(file.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDownload(file)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            {file.url && (
              <DropdownMenuItem onClick={copyUrl}>
                <Link className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy URL'}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(file)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        {getFileIcon()}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              file.disk === 'public_access' 
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {file.disk === 'public_access' ? 'Public' : 'Private'}
            </span>
          </div>
          <p className="font-medium truncate max-w-[200px]">{file.original_name}</p>
          <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
        </div>
      </div>
    </div>
  );
}

export default function FileManager({ files }) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [access, setAccess] = useState('public');

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('access', access);

    router.post(route('files.store'), formData, {
      onSuccess: () => {
        setUploadDialogOpen(false);
        setSelectedFile(null);
      },
    });
  };

  const handleDownload = (file) => {
    window.location.href = route('files.download', file.id);
  };

  const handleDelete = (file) => {
    if (confirm('Are you sure you want to delete this file?')) {
      router.delete(route('files.destroy', file.id));
    }
  };

  return (
    <AuthenticatedLayout header={{ title: "File Manager" }}>
      <Head title="File Manager" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Files</h1>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>Upload File</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>File</Label>
                  <Input 
                    type="file" 
                    onChange={(e) => setSelectedFile(e.target.files[0])} 
                  />
                </div>
                <div>
                  <Label>Access Level</Label>
                  <RadioGroup value={access} onValueChange={setAccess}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button onClick={handleUpload} disabled={!selectedFile}>
                  Upload
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Object.entries(files).map(([type, typeFiles]) => (
            <div key={type} className="space-y-4">
              <h2 className="font-semibold capitalize">{type.split('/')[1]}</h2>
              {typeFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 