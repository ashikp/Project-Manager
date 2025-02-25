<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'type',
        'progress',
        'project_id',
        'created_by'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_user')
                    ->withTimestamps();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }
} 