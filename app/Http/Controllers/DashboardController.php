<?php

namespace App\Http\Controllers;

use App\Events\ChatEvent;
use App\Models\Project;
use App\Models\Task;
use App\Models\File;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalProjects' => Project::count(),
            'newProjects' => Project::whereMonth('created_at', now()->month)->count(),
            'activeTasks' => Task::whereNotIn('status', ['Done', 'Canceled'])->count(),
            'taskCompletion' => $this->getTaskCompletionRate(),
            'totalFiles' => File::count(),
            'publicFiles' => File::where('disk', 'public_access')->count(),
            'privateFiles' => File::where('disk', 'private_access')->count(),
            'teamMembers' => User::count(),
            'recentMembers' => User::latest()->take(5)->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'avatar' => $user->avatar,
                    'initials' => substr($user->name, 0, 2)
                ];
            })
        ];

        broadcast(new ChatEvent('Hello', 1));

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentTasks' => Task::with('project')
                ->whereHas('assignees', fn($q) => $q->where('users.id', auth()->id()))
                ->latest()
                ->take(5)
                ->get(),
            'recentProjects' => Project::with('tasks')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($project) {
                    [$completed, $total] = $project->progress;
                    return [
                        'id' => $project->id,
                        'name' => $project->name,
                        'logo' => $project->logo,
                        'initials' => substr($project->name, 0, 2),
                        'tasks_count' => $total,
                        'completion' => $total > 0 ? ($completed / $total) * 100 : 0
                    ];
                })
        ]);
    }

    private function getTaskCompletionRate()
    {
        $total = Task::count();
        if ($total === 0) return 0;

        $completed = Task::where('status', 'Done')->count();
        return ($completed / $total) * 100;
    }
}
