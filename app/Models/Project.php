<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Project extends Model
{
    protected $fillable = [
        'name',
        'department',
        'logo',
        'tags',
        'deadline',
        'created_by',
        'progress',
        'rating'
    ];

    protected $casts = [
        'tags' => 'array',
        'deadline' => 'datetime'
    ];

    protected $with = ['tasks'];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_users')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function getProgressAttribute()
    {
        $totalTasks = $this->tasks->count();
        if ($totalTasks === 0) return [0, 0];
        
        $completedTasks = $this->tasks->where('status', 'completed')->count();
        return [$completedTasks, $totalTasks];
    }

    public function getTotalTasksAttribute()
    {
        return $this->tasks->count();
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }
} 