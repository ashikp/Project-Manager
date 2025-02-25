<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\FileVersion;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class FileManagerController extends Controller
{
    public function index(Project $project = null)
    {
        $query = File::with('uploader', 'versions')
            ->when(!auth()->check(), function($query) {
                $query->where('disk', 'public_access');
            })
            ->when($project, function($query) use ($project) {
                $query->where('fileable_type', 'project')
                      ->where('fileable_id', $project->id);
            });

        $files = $query->latest()->get()->groupBy('type');
        $projects = Project::select('id', 'name')->get();

        return Inertia::render('FileManager/Index', [
            'files' => $files,
            'projects' => $projects,
            'currentProject' => $project
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'access' => 'required|in:public,private',
            'password' => 'nullable|string|min:6',
            'fileable_type' => 'required|in:project,task',
            'fileable_id' => 'required|integer'
        ]);

        $file = $request->file('file');
        $disk = $request->access === 'public' ? 'public_access' : 'private_access';
        $path = Storage::disk($disk)->putFile('', $file);

        $fileModel = File::create([
            'name' => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'disk' => $disk,
            'password' => $request->password,
            'uploaded_by' => auth()->id(),
            'fileable_type' => $request->fileable_type,
            'fileable_id' => $request->fileable_id
        ]);

        FileVersion::create([
            'file_id' => $fileModel->id,
            'path' => $path,
            'version' => 1,
            'created_by' => auth()->id()
        ]);

        return back();
    }

    public function download(Request $request, File $file)
    {
        if ($file->is_password_protected) {
            if (!$request->has('password')) {
                return response()->json(['message' => 'Password required'], 403);
            }

            if (!Hash::check($request->password, $file->password)) {
                return response()->json(['message' => 'Invalid password'], 403);
            }
        }

        return Storage::disk($file->disk)->download($file->path, $file->original_name);
    }

    public function view(Request $request, File $file)
    {
        if ($file->is_password_protected) {
            if (!$request->has('password')) {
                if ($request->wantsJson()) {
                    return response()->json(['message' => 'Password required'], 403);
                }
                return Inertia::render('FileManager/PasswordPrompt', [
                    'file' => $file->only('id', 'original_name', 'is_password_protected')
                ]);
            }

            if (!Hash::check($request->password, $file->password)) {
                if ($request->wantsJson()) {
                    return response()->json(['message' => 'Invalid password'], 403);
                }
                return back()->withErrors(['password' => 'Invalid password']);
            }
        }

        return Storage::disk($file->disk)->response($file->path, $file->original_name);
    }

    public function destroy(File $file)
    {
        if ($file->uploaded_by !== auth()->id()) {
            abort(403);
        }

        Storage::disk($file->disk)->delete($file->path);
        $file->delete();

        return back();
    }

    public function uploadVersion(Request $request, File $file)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'comment' => 'nullable|string'
        ]);

        $newFile = $request->file('file');
        $path = Storage::disk($file->disk)->putFile('', $newFile);

        $newVersion = $file->version + 1;
        
        FileVersion::create([
            'file_id' => $file->id,
            'path' => $path,
            'version' => $newVersion,
            'comment' => $request->comment,
            'created_by' => auth()->id()
        ]);

        $file->update([
            'path' => $path,
            'version' => $newVersion
        ]);

        return back();
    }
} 