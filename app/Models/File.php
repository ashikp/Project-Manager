<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    protected $fillable = [
        'name',
        'original_name',
        'path',
        'size',
        'type',
        'disk',
        'uploaded_by',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        if ($this->disk === 'public_access') {
            return asset('storage/public_access/' . $this->name);
        }
        return null;
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
} 