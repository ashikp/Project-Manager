<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'priority' => 'required|string',
            'type' => 'nullable|string',
            'assignees' => 'array'
        ]);

        $validated['project_id'] = $project->id;
        $validated['created_by'] = auth()->id();

        $task = Task::create($validated);

        if (!empty($validated['assignees'])) {
            $task->assignees()->attach($validated['assignees']);
        }

        return back();
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string',
            'progress' => 'sometimes|integer|min:0|max:100',
        ]);

        $task->update($validated);

        return back();
    }

    public function show(Task $task)
    {
        $task->load(['assignees', 'creator', 'comments.user']);
        return response()->json($task);
    }

    public function addComment(Request $request, Task $task)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $comment = $task->comments()->create([
            'content' => $validated['content'],
            'user_id' => auth()->id()
        ]);

        $comment->load('user');
        return response()->json($comment);
    }

    public function index(Project $project)
    {
        $tasks = $project->tasks()
            ->with(['assignees', 'creator', 'comments.user'])
            ->whereHas('assignees', function($query) {
                $query->where('users.id', auth()->id());
            })
            ->get();

        return Inertia::render('Tasks/Index', [
            'project' => $project,
            'tasks' => $tasks
        ]);
    }

    public function detail(Project $project, Task $task)
    {
        $task->load(['assignees', 'creator', 'comments.user']);
        
        return Inertia::render('Tasks/Show', [
            'project' => $project->load('assignees'),
            'task' => $task
        ]);
    }

    public function myTasks()
    {
        $tasks = Task::with(['project', 'assignees', 'creator', 'comments'])
            ->whereHas('assignees', function($query) {
                $query->where('users.id', auth()->id());
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('status');

        return Inertia::render('Tasks/MyTasks', [
            'tasks' => $tasks,
            'unreadCount' => $tasks->flatten()->where('is_read', false)->count()
        ]);
    }

    public function updateDetails(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'sometimes|string',
            'type' => 'sometimes|string',
            'assignees' => 'sometimes|array',
        ]);

        $changes = [];
        $oldTask = $task->toArray();
        
        if (isset($validated['assignees'])) {
            $oldAssignees = $task->assignees->pluck('name')->toArray();
            $task->assignees()->sync($validated['assignees']);
            $newAssignees = User::whereIn('id', $validated['assignees'])->pluck('name')->toArray();
            
            if ($oldAssignees != $newAssignees) {
                $changes[] = "Assignees updated from '" . implode(", ", $oldAssignees) . "' to '" . implode(", ", $newAssignees) . "'";
            }
        }

        foreach ($validated as $field => $value) {
            if ($field !== 'assignees' && $task->$field !== $value) {
                $changes[] = "$field updated from '{$task->$field}' to '$value'";
                $task->$field = $value;
            }
        }

        if (count($changes) > 0) {
            $task->save();
            
            $task->comments()->create([
                'content' => "Task updated:\n" . implode("\n", $changes),
                'user_id' => auth()->id(),
                'is_system' => true
            ]);
        }

        $task->load(['assignees', 'creator', 'comments.user']);
        return response()->json($task);
    }
} 