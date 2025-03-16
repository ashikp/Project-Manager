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
  Link,
  Lock,
  History
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { formatBytes } from '@/lib/utils';
import FileUploadDialog from '@/Components/FileManager/FileUploadDialog';
import FileVersionDialog from '@/Components/FileManager/FileVersionDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function FileCard({ file, onDelete, onFileAccess }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

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
            <DropdownMenuItem onClick={() => onFileAccess(file, 'download')}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            {file.disk === 'public_access' && (
              <DropdownMenuItem onClick={() => onFileAccess(file, 'view')}>
                <FileText className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <History className="h-4 w-4 mr-2" />
              Versions ({file.versions?.length || 0})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(file)}>
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
            {file.is_password_protected && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                🔒 Protected
              </span>
            )}
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              v{file.version || 1}
            </span>
          </div>
          <p className="font-medium truncate max-w-[200px]">{file.original_name}</p>
          <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
        </div>
      </div>

      <FileVersionDialog file={file} open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default function FileManager({ files, projects, currentProject }) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [access, setAccess] = useState('public');
  const [passwordDialog, setPasswordDialog] = useState({ open: false, file: null });
  const [password, setPassword] = useState('');

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

  const handleFileAccess = (file, action = 'download') => {
    if (file.is_password_protected) {
      setPasswordDialog({ 
        open: true, 
        file,
        action 
      });
      return;
    }
    
    if (action === 'download') {
      window.location.href = route('files.download', file.id);
    } else {
      window.location.href = route('files.view', file.id);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { file, action } = passwordDialog;
    const route_name = action === 'download' ? 'files.download' : 'files.view';
    
    window.location.href = route(route_name, [file.id, { password }]);
    setPasswordDialog({ open: false, file: null, action: null });
    setPassword('');
  };

  const handleDelete = (file) => {
    if (confirm('Are you sure you want to delete this file?')) {
      router.delete(route('files.destroy', file.id));
    }
  };

  const handleProjectChange = (projectId) => {
    if (projectId) {
      router.get(route('files.index', projectId));
    } else {
      router.get(route('files.index'));
    }
  };

  return (
    <AuthenticatedLayout header={{ title: "File Manager" }}>
      <Head title="File Manager" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Files</h1>
            <div className="w-[200px]">
              <Select
                value={currentProject?.id || ''}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {currentProject && (
            <FileUploadDialog 
              projectId={currentProject.id}
            />
          )}
        </div>

        {currentProject ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(files).map(([type, typeFiles]) => (
              <div key={type} className="space-y-4">
                <h2 className="font-semibold capitalize">{type.split('/')[1]}</h2>
                {typeFiles.map((file) => (
                  <FileCard 
                    key={file.id} 
                    file={file} 
                    onDelete={handleDelete}
                    onFileAccess={handleFileAccess}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            Select a project to view its files
          </div>
        )}
      </div>

      <Dialog open={passwordDialog.open} onOpenChange={(open) => !open && setPasswordDialog({ open, file: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter file password"
            />
            <Button type="submit">Download</Button>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
} 