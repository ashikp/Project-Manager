<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $path = $request->path();
        if (str_starts_with($path, 'storage/public_access/')) {
            $filename = basename($path);
            $file = File::where('name', $filename)->first();

            if ($file && $file->is_password_protected) {
                return redirect()->route('files.view', $file->id);
            }
        }

        return $next($request);
    }
} 