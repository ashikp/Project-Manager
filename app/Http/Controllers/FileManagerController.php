<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FileManagerController extends Controller
{
    public function index()
    {
        $files = File::with('uploader')
            ->when(!auth()->check(), function($query) {
                $query->where('disk', 'public_access');
            })
            ->latest()
            ->get()
            ->groupBy('type');

        return Inertia::render('FileManager/Index', [
            'files' => $files
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'access' => 'required|in:public,private'
        ]);

        $file = $request->file('file');
        $isPublic = $request->access === 'public';
        
        if ($isPublic) {
            $path = Storage::disk('public_access')->putFile('', $file);
            $disk = 'public_access';
        } else {
            $path = Storage::disk('private_access')->putFile('', $file);
            $disk = 'private_access';
        }
        
        File::create([
            'name' => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'type' => $file->getClientMimeType(),
            'disk' => $disk,
            'uploaded_by' => auth()->id()
        ]);

        return back();
    }

    public function download(File $file)
    {
        if ($file->disk === 'private_access' && !auth()->check()) {
            abort(403);
        }

        return Storage::disk($file->disk)->download($file->path, $file->original_name);
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
} 