<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileVersion extends Model
{
    protected $fillable = [
        'file_id',
        'path',
        'version',
        'comment',
        'created_by'
    ];

    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
} 