<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['assignees', 'tasks' => function($query) {
            $query->select('id', 'project_id', 'status');
        }])->get();
        
        $users = User::select('id', 'name', 'email')->get();
        
        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'logo' => 'nullable|image|max:1024',
            'tags' => 'required|array',
            'deadline' => 'required|date',
            'assignees' => 'required|array'
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('project-logos', 'public');
            $validated['logo'] = $path;
        }

        // No need to decode JSON since we're receiving arrays
        $validated['tags'] = $validated['tags'] ?? [];
        $assignees = $request->assignees ?? [];
        
        // Add creator
        $validated['created_by'] = auth()->id();

        $project = Project::create($validated);
        
        // Attach assignees with roles
        $assigneeData = collect($assignees)->mapWithKeys(function ($userId) {
            return [$userId => ['role' => 'viewer']];
        })->toArray();
        
        // Make creator an admin
        $assigneeData[auth()->id()] = ['role' => 'admin'];
        
        $project->assignees()->attach($assigneeData);

        return redirect()->route('projects.index');
    }

    public function show(Project $project)
    {
        $project->load(['assignees', 'tasks.assignees', 'tasks.creator']);
        return Inertia::render('Projects/Show', [
            'project' => $project,
            'projects' => Project::with('assignees')->get()
        ]);
    }
} 